import { prisma } from './prisma';
import { withCache, cacheKeys } from './cache';

// 优化的文章查询函数
export const getPostsWithCache = withCache(
  async (page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: {
          published: true,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
        orderBy: {
          publishedAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.post.count({
        where: {
          published: true,
        },
      }),
    ]);

    return {
      posts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    };
  },
  cacheKeys.posts,
  300 // 5分钟缓存
);

// 优化的单篇文章查询
export const getPostBySlugWithCache = withCache(
  async (slug: string) => {
    return await prisma.post.findUnique({
      where: {
        slug,
        published: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });
  },
  cacheKeys.post,
  600 // 10分钟缓存
);

// 优化的分类查询
export const getCategoriesWithCache = withCache(
  async () => {
    return await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        _count: {
          select: {
            posts: {
              where: {
                published: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  },
  cacheKeys.categories,
  900 // 15分钟缓存
);

// 优化的标签查询
export const getTagsWithCache = withCache(
  async () => {
    return await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            posts: {
              where: {
                post: {
                  published: true,
                },
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  },
  cacheKeys.tags,
  900 // 15分钟缓存
);

// 按分类获取文章
export const getPostsByCategoryWithCache = withCache(
  async (categorySlug: string, page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: {
          published: true,
          category: {
            slug: categorySlug,
          },
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
        orderBy: {
          publishedAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.post.count({
        where: {
          published: true,
          category: {
            slug: categorySlug,
          },
        },
      }),
    ]);

    return {
      posts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    };
  },
  cacheKeys.postsByCategory,
  300 // 5分钟缓存
);

// 按标签获取文章
export const getPostsByTagWithCache = withCache(
  async (tagSlug: string, page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: {
          published: true,
          tags: {
            some: {
              tag: {
                slug: tagSlug,
              },
            },
          },
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
        orderBy: {
          publishedAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.post.count({
        where: {
          published: true,
          tags: {
            some: {
              tag: {
                slug: tagSlug,
              },
            },
          },
        },
      }),
    ]);

    return {
      posts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    };
  },
  cacheKeys.postsByTag,
  300 // 5分钟缓存
);

// 获取相关文章
export const getRelatedPosts = withCache(
  async (postId: string, limit: number = 5) => {
    // 获取当前文章的分类和标签
    const currentPost = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!currentPost) return [];

    // 查找相关文章（同分类或有共同标签）
    const relatedPosts = await prisma.post.findMany({
      where: {
        published: true,
        id: {
          not: postId,
        },
        OR: [
          // 同分类
          {
            categoryId: currentPost.categoryId,
          },
          // 有共同标签
          {
            tags: {
              some: {
                tagId: {
                  in: currentPost.tags.map(({ tag }) => tag.id),
                },
              },
            },
          },
        ],
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: limit,
    });

    return relatedPosts;
  },
  (postId: string, limit: number) => `related:${postId}:${limit}`,
  600 // 10分钟缓存
);

// 获取热门文章（这里简化为最新文章，实际项目中可能需要基于浏览量等指标）
export const getPopularPosts = withCache(
  async (limit: number = 5) => {
    return await prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: limit,
    });
  },
  (limit: number) => `popular:${limit}`,
  900 // 15分钟缓存
);
