import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  CreateArticleRequest,
  ApiResponse,
  ArticleWithTodos,
} from '@/lib/types';
import { validateArticleTitle } from '@/lib/utils/validation';

// GET /api/articles - 获取所有文章列表
export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      include: {
        todos: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    const response: ApiResponse<ArticleWithTodos[]> = {
      success: true,
      data: articles,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('获取文章列表失败:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: '获取文章列表失败',
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/articles - 创建新文章
export async function POST(request: NextRequest) {
  try {
    const body: CreateArticleRequest = await request.json();

    // 验证输入
    const titleErrors = validateArticleTitle(body.title || '无标题');
    if (titleErrors.length > 0) {
      const response: ApiResponse<null> = {
        success: false,
        error: titleErrors[0].message,
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 创建文章
    const article = await prisma.article.create({
      data: {
        title: body.title || '无标题',
        todos: {
          create: {
            content: '开始写作...',
            order: 0,
            indentLevel: 0,
          },
        },
      },
      include: {
        todos: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    const response: ApiResponse<ArticleWithTodos> = {
      success: true,
      data: article,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('创建文章失败:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: '创建文章失败',
    };

    return NextResponse.json(response, { status: 500 });
  }
}
