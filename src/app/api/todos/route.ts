import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CreateTodoRequest, ApiResponse } from '@/lib/types';
import {
  validateTodoContent,
  validateIndentLevel,
  isValidId,
} from '@/lib/utils/validation';
import { getNextOrder } from '@/lib/utils/todo-helpers';
import { TodoItem } from '@prisma/client';

// POST /api/todos - 创建新的 Todo 项目
export async function POST(request: NextRequest) {
  try {
    const body: CreateTodoRequest = await request.json();

    // 验证必需字段
    if (!isValidId(body.articleId)) {
      const response: ApiResponse<null> = {
        success: false,
        error: '无效的文章ID',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 验证输入
    const contentErrors = validateTodoContent(body.content || '');
    const indentErrors = validateIndentLevel(body.indentLevel || 0);

    if (contentErrors.length > 0) {
      const response: ApiResponse<null> = {
        success: false,
        error: contentErrors[0].message,
      };
      return NextResponse.json(response, { status: 400 });
    }

    if (indentErrors.length > 0) {
      const response: ApiResponse<null> = {
        success: false,
        error: indentErrors[0].message,
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 检查文章是否存在
    const article = await prisma.article.findUnique({
      where: { id: body.articleId },
      include: { todos: true },
    });

    if (!article) {
      const response: ApiResponse<null> = {
        success: false,
        error: '文章不存在',
      };
      return NextResponse.json(response, { status: 404 });
    }

    // 计算顺序号
    const order =
      body.order !== undefined ? body.order : getNextOrder(article.todos);

    // 创建 Todo 项目
    const todo = await prisma.todoItem.create({
      data: {
        content: body.content || '',
        articleId: body.articleId,
        order,
        indentLevel: body.indentLevel || 0,
      },
    });

    const response: ApiResponse<TodoItem> = {
      success: true,
      data: todo,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('创建 Todo 失败:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: '创建 Todo 失败',
    };

    return NextResponse.json(response, { status: 500 });
  }
}
