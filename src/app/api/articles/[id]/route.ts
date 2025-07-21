import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  UpdateArticleRequest,
  ApiResponse,
  ArticleWithTodos,
} from '@/lib/types';
import { validateArticleTitle, isValidId } from '@/lib/utils/validation';

// GET /api/articles/[id] - 获取单个文章
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!isValidId(id)) {
      const response: ApiResponse<null> = {
        success: false,
        error: '无效的文章ID',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        todos: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!article) {
      const response: ApiResponse<null> = {
        success: false,
        error: '文章不存在',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<ArticleWithTodos> = {
      success: true,
      data: article,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('获取文章失败:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: '获取文章失败',
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// PUT /api/articles/[id] - 更新文章
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: UpdateArticleRequest = await request.json();

    if (!isValidId(id)) {
      const response: ApiResponse<null> = {
        success: false,
        error: '无效的文章ID',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 验证输入
    if (body.title !== undefined) {
      const titleErrors = validateArticleTitle(body.title);
      if (titleErrors.length > 0) {
        const response: ApiResponse<null> = {
          success: false,
          error: titleErrors[0].message,
        };
        return NextResponse.json(response, { status: 400 });
      }
    }

    // 检查文章是否存在
    const existingArticle = await prisma.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      const response: ApiResponse<null> = {
        success: false,
        error: '文章不存在',
      };
      return NextResponse.json(response, { status: 404 });
    }

    // 更新文章
    const article = await prisma.article.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
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

    return NextResponse.json(response);
  } catch (error) {
    console.error('更新文章失败:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: '更新文章失败',
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// DELETE /api/articles/[id] - 删除文章
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!isValidId(id)) {
      const response: ApiResponse<null> = {
        success: false,
        error: '无效的文章ID',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 检查文章是否存在
    const existingArticle = await prisma.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      const response: ApiResponse<null> = {
        success: false,
        error: '文章不存在',
      };
      return NextResponse.json(response, { status: 404 });
    }

    // 删除文章（会级联删除相关的 todos）
    await prisma.article.delete({
      where: { id },
    });

    const response: ApiResponse<{ id: string }> = {
      success: true,
      data: { id },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('删除文章失败:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: '删除文章失败',
    };

    return NextResponse.json(response, { status: 500 });
  }
}
