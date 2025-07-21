import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CopyTodoRequest, ApiResponse } from '@/lib/types';
import { isValidId } from '@/lib/utils/validation';
import { getNextOrder, copyTodo } from '@/lib/utils/todo-helpers';
import { TodoItem } from '@prisma/client';

// POST /api/todos/[id]/copy - 复制 Todo 项目
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: CopyTodoRequest = await request.json();

    if (!isValidId(id)) {
      const response: ApiResponse<null> = {
        success: false,
        error: '无效的 Todo ID',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 获取原始 Todo 项目
    const originalTodo = await prisma.todoItem.findUnique({
      where: { id },
      include: {
        article: {
          include: {
            todos: true,
          },
        },
      },
    });

    if (!originalTodo) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Todo 项目不存在',
      };
      return NextResponse.json(response, { status: 404 });
    }

    // 确定目标文章ID
    const targetArticleId = body.targetArticleId || originalTodo.articleId;

    // 如果是复制到不同文章，验证目标文章是否存在
    let targetArticle = originalTodo.article;
    if (targetArticleId !== originalTodo.articleId) {
      if (!isValidId(targetArticleId)) {
        const response: ApiResponse<null> = {
          success: false,
          error: '无效的目标文章ID',
        };
        return NextResponse.json(response, { status: 400 });
      }

      const foundArticle = await prisma.article.findUnique({
        where: { id: targetArticleId },
        include: { todos: true },
      });

      if (!foundArticle) {
        const response: ApiResponse<null> = {
          success: false,
          error: '目标文章不存在',
        };
        return NextResponse.json(response, { status: 404 });
      }

      targetArticle = foundArticle;
    }

    // 计算插入位置
    const insertOrder =
      body.insertAfterOrder !== undefined
        ? body.insertAfterOrder + 1
        : getNextOrder(targetArticle.todos);

    // 如果插入位置不是末尾，需要更新后续项目的顺序
    if (body.insertAfterOrder !== undefined) {
      await prisma.todoItem.updateMany({
        where: {
          articleId: targetArticleId,
          order: {
            gte: insertOrder,
          },
        },
        data: {
          order: {
            increment: 1,
          },
        },
      });
    }

    // 创建复制的 Todo 项目
    const copiedTodoData = copyTodo(originalTodo, insertOrder);
    const newTodo = await prisma.todoItem.create({
      data: {
        ...copiedTodoData,
        articleId: targetArticleId,
      },
    });

    const response: ApiResponse<TodoItem> = {
      success: true,
      data: newTodo,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('复制 Todo 失败:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: '复制 Todo 失败',
    };

    return NextResponse.json(response, { status: 500 });
  }
}
