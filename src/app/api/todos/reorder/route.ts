import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ReorderTodosRequest, ApiResponse } from '@/lib/types';
import { isValidId } from '@/lib/utils/validation';
import { TodoItem } from '@prisma/client';

// PUT /api/todos/reorder - 重新排序 Todo 项目
export async function PUT(request: NextRequest) {
  try {
    const body: ReorderTodosRequest = await request.json();

    // 验证输入
    if (!Array.isArray(body.todoIds) || body.todoIds.length === 0) {
      const response: ApiResponse<null> = {
        success: false,
        error: '无效的 Todo ID 列表',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 验证所有 ID 都是有效的
    for (const id of body.todoIds) {
      if (!isValidId(id)) {
        const response: ApiResponse<null> = {
          success: false,
          error: `无效的 Todo ID: ${id}`,
        };
        return NextResponse.json(response, { status: 400 });
      }
    }

    // 获取所有相关的 Todo 项目
    const todos = await prisma.todoItem.findMany({
      where: {
        id: {
          in: body.todoIds,
        },
      },
    });

    if (todos.length !== body.todoIds.length) {
      const response: ApiResponse<null> = {
        success: false,
        error: '部分 Todo 项目不存在',
      };
      return NextResponse.json(response, { status: 404 });
    }

    // 检查所有 Todo 是否属于同一篇文章
    const articleIds = [...new Set(todos.map((t) => t.articleId))];
    if (articleIds.length > 1) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Todo 项目必须属于同一篇文章',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 使用事务更新所有 Todo 的顺序
    const updatedTodos = await prisma.$transaction(
      body.todoIds.map((id, index) =>
        prisma.todoItem.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    const response: ApiResponse<TodoItem[]> = {
      success: true,
      data: updatedTodos,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('重新排序 Todo 失败:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: '重新排序 Todo 失败',
    };

    return NextResponse.json(response, { status: 500 });
  }
}
