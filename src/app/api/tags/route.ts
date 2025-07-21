import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";

// GET /api/tags - 获取标签列表
export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json({ error: "获取标签列表失败" }, { status: 500 });
  }
}

// POST /api/tags - 创建新标签
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "标签名称不能为空" }, { status: 400 });
    }

    const slug = generateSlug(name);

    const tag = await prisma.tag.create({
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error("Error creating tag:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "标签名称已存在" }, { status: 400 });
    }
    return NextResponse.json({ error: "创建标签失败" }, { status: 500 });
  }
}
