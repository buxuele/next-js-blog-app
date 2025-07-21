import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UpdateTodoRequest, ApiResponse } from '@/lib/types';
import {
  validateTodoContent,
  validateIndentLevel,
  isValidId,
  isValidOrder,
} from '@/lib/utils/validation';
import { TodoItem } from '@prisma/client';

// PUT /api/todos/[id] - 更新 Todo 项目
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: UpdateTodoRequest = await request.json();

    if (!isValidId(id)) {
      const response: ApiResponse<null> = {
        success: false,
        error: '无效的 Todo ID',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 验证输入
    if (body.content !== undefined) {
      const contentErrors = validateTodoContent(body.content);
      if (contentErrors.length > 0) {
        const response: ApiResponse<null> = {
          success: false,
          error: contentErrors[0].message,
        };
        return NextResponse.json(response, { status: 400 });
      }
    }

    if (body.indentLevel !== undefined) {
      const indentErrors = validateIndentLevel(body.indentLevel);
      if (indentErrors.length > 0) {
        const response: ApiResponse<null> = {
          success: false,
          error: indentErrors[0].message,
        };
        return NextResponse.json(response, { status: 400 });
      }
    }

    if (body.order !== undefined && !isValidOrder(body.order)) {
      const response: ApiResponse<null> = {
        success: false,
        error: '无效的排序值',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 检查 Todo 是否存在
    const existingTodo = await prisma.todoItem.findUnique({
      where: { id },
    });

    if (!existingTodo) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Todo 项目不存在',
      };
      return NextResponse.json(response, { status: 404 });
    }

    // 更新 Todo 项目
    const todo = await prisma.todoItem.update({
      where: { id },
      data: {
        ...(body.content !== undefined && { content: body.content }),
        ...(body.completed !== undefined && { completed: body.completed }),
        ...(body.order !== undefined && { order: body.order }),
        ...(body.indentLevel !== undefined && {
          indentLevel: body.indentLevel,
        }),
      },
    });

    const response: ApiResponse<TodoItem> = {
      success: true,
      data: todo,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('更新 Todo 失败:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: '更新 Todo 失败',
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// DELETE /api/todos/[id] - 删除 Todo 项目
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!isValidId(id)) {
      const response: ApiResponse<null> = {
        success: false,
        error: '无效的 Todo ID',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 检查 Todo 是否存在
    const existingTodo = await prisma.todoItem.findUnique({
      where: { id },
    });

    if (!existingTodo) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Todo 项目不存在',
      };
      return NextResponse.json(response, { status: 404 });
    }

    // 删除 Todo 项目
    await prisma.todoItem.delete({
      where: { id },
    });

    const response: ApiResponse<{ id: string }> = {
      success: true,
      data: { id },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('删除 Todo 失败:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: '删除 Todo 失败',
    };

    return NextResponse.json(response, { status: 500 });
  }
}
