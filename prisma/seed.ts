import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 创建分类
  const techCategory = await prisma.category.upsert({
    where: { slug: "technology" },
    update: {},
    create: {
      name: "技术",
      slug: "technology",
      description: "技术相关文章",
    },
  });

  const lifeCategory = await prisma.category.upsert({
    where: { slug: "life" },
    update: {},
    create: {
      name: "生活",
      slug: "life",
      description: "生活感悟和随笔",
    },
  });

  // 创建标签
  const reactTag = await prisma.tag.upsert({
    where: { slug: "react" },
    update: {},
    create: {
      name: "React",
      slug: "react",
    },
  });

  const nextjsTag = await prisma.tag.upsert({
    where: { slug: "nextjs" },
    update: {},
    create: {
      name: "Next.js",
      slug: "nextjs",
    },
  });

  const typescriptTag = await prisma.tag.upsert({
    where: { slug: "typescript" },
    update: {},
    create: {
      name: "TypeScript",
      slug: "typescript",
    },
  });

  // 创建示例文章
  const post1 = await prisma.post.upsert({
    where: { slug: "welcome-to-my-blog" },
    update: {},
    create: {
      title: "欢迎来到我的博客",
      slug: "welcome-to-my-blog",
      content: `# 欢迎来到我的博客

这是我的第一篇博客文章！在这里我会分享：

## 技术内容
- React 和 Next.js 开发经验
- TypeScript 最佳实践
- 前端工程化思考

## 生活感悟
- 学习心得
- 工作体会
- 生活随笔

希望这个博客能够记录我的成长历程，也希望能够帮助到其他人。

感谢您的阅读！`,
      excerpt: "这是我的第一篇博客文章，介绍了博客的主要内容方向。",
      published: true,
      publishedAt: new Date(),
      categoryId: techCategory.id,
      tags: {
        create: [{ tagId: reactTag.id }, { tagId: nextjsTag.id }],
      },
    },
  });

  const post2 = await prisma.post.upsert({
    where: { slug: "nextjs-15-features" },
    update: {},
    create: {
      title: "Next.js 15 新特性探索",
      slug: "nextjs-15-features",
      content: `# Next.js 15 新特性探索

Next.js 15 带来了许多令人兴奋的新特性，让我们一起来探索一下。

## 主要更新

### 1. React 19 支持
Next.js 15 完全支持 React 19，包括新的并发特性。

### 2. 改进的缓存策略
新的缓存机制让应用性能更加出色。

### 3. 更好的 TypeScript 支持
类型推断和错误提示得到了显著改善。

## 总结

Next.js 15 是一个重要的版本更新，值得升级体验。`,
      excerpt:
        "探索 Next.js 15 的新特性，包括 React 19 支持、改进的缓存策略等。",
      published: true,
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1天前
      categoryId: techCategory.id,
      tags: {
        create: [{ tagId: nextjsTag.id }, { tagId: typescriptTag.id }],
      },
    },
  });

  const draftPost = await prisma.post.upsert({
    where: { slug: "draft-post" },
    update: {},
    create: {
      title: "草稿文章",
      slug: "draft-post",
      content: "这是一篇草稿文章，还没有发布。",
      excerpt: "这是一篇草稿文章的摘要。",
      published: false,
      categoryId: lifeCategory.id,
    },
  });

  console.log("种子数据创建完成！");
  console.log({
    techCategory,
    lifeCategory,
    reactTag,
    nextjsTag,
    typescriptTag,
    post1,
    post2,
    draftPost,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
