import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 创建分类
  const techCategory = await prisma.category.upsert({
    where: { slug: 'technology' },
    update: {},
    create: {
      name: '技术',
      slug: 'technology',
      description: '技术相关文章',
    },
  });

  const lifeCategory = await prisma.category.upsert({
    where: { slug: 'life' },
    update: {},
    create: {
      name: '生活',
      slug: 'life',
      description: '生活感悟和随笔',
    },
  });

  // 标签功能暂未实现，先注释掉

  // 创建示例文章
  const post1 = await prisma.post.upsert({
    where: { slug: 'welcome-to-my-blog' },
    update: {},
    create: {
      title: '欢迎来到我的博客',
      slug: 'welcome-to-my-blog',
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
      excerpt: '这是我的第一篇博客文章，介绍了博客的主要内容方向。',
      published: true,
      publishedAt: new Date(),
      categoryId: techCategory.id,
    },
  });

  const post2 = await prisma.post.upsert({
    where: { slug: 'nextjs-15-features' },
    update: {},
    create: {
      title: 'Next.js 15 新特性探索',
      slug: 'nextjs-15-features',
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
        '探索 Next.js 15 的新特性，包括 React 19 支持、改进的缓存策略等。',
      published: true,
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1天前
      categoryId: techCategory.id,
    },
  });

  const draftPost = await prisma.post.upsert({
    where: { slug: 'draft-post' },
    update: {},
    create: {
      title: '草稿文章',
      slug: 'draft-post',
      content: '这是一篇草稿文章，还没有发布。',
      excerpt: '这是一篇草稿文章的摘要。',
      published: false,
      categoryId: lifeCategory.id,
    },
  });

  // 创建示例文章（Article 模型）
  const article1 = await prisma.article.upsert({
    where: { id: 'article-1' },
    update: {},
    create: {
      id: 'article-1',
      title: '我的第一篇 Notion 风格文章',
      todos: {
        create: [
          {
            content: '欢迎使用 Notion 风格的博客编辑器',
            completed: false,
            order: 0,
            indentLevel: 0,
          },
          {
            content: '这是一个 todo 项目，你可以点击复选框来标记完成',
            completed: false,
            order: 1,
            indentLevel: 0,
          },
          {
            content: '支持多级缩进',
            completed: true,
            order: 2,
            indentLevel: 1,
          },
          {
            content: '可以拖拽重新排序',
            completed: false,
            order: 3,
            indentLevel: 1,
          },
          {
            content: '右键菜单支持复制和移动',
            completed: false,
            order: 4,
            indentLevel: 2,
          },
          {
            content: '自动保存功能',
            completed: true,
            order: 5,
            indentLevel: 0,
          },
        ],
      },
    },
  });

  const article2 = await prisma.article.upsert({
    where: { id: 'article-2' },
    update: {},
    create: {
      id: 'article-2',
      title: '项目计划',
      todos: {
        create: [
          {
            content: '需求分析',
            completed: true,
            order: 0,
            indentLevel: 0,
          },
          {
            content: '用户调研',
            completed: true,
            order: 1,
            indentLevel: 1,
          },
          {
            content: '竞品分析',
            completed: true,
            order: 2,
            indentLevel: 1,
          },
          {
            content: '设计阶段',
            completed: false,
            order: 3,
            indentLevel: 0,
          },
          {
            content: 'UI 设计',
            completed: false,
            order: 4,
            indentLevel: 1,
          },
          {
            content: '交互设计',
            completed: false,
            order: 5,
            indentLevel: 1,
          },
          {
            content: '开发阶段',
            completed: false,
            order: 6,
            indentLevel: 0,
          },
        ],
      },
    },
  });

  const article3 = await prisma.article.upsert({
    where: { id: 'article-3' },
    update: {},
    create: {
      id: 'article-3',
      title: '学习笔记',
      todos: {
        create: [
          {
            content: 'React 19 新特性',
            completed: false,
            order: 0,
            indentLevel: 0,
          },
          {
            content: 'Next.js 15 升级指南',
            completed: false,
            order: 1,
            indentLevel: 0,
          },
          {
            content: 'TypeScript 5.0 新功能',
            completed: true,
            order: 2,
            indentLevel: 0,
          },
        ],
      },
    },
  });

  console.log('种子数据创建完成！');
  console.log({
    techCategory,
    lifeCategory,
    post1,
    post2,
    draftPost,
    article1,
    article2,
    article3,
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
