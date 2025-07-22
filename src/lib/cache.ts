// 简单的内存缓存实现
// 在生产环境中，你可能想使用 Redis 或其他缓存解决方案

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class MemoryCache {
  private cache = new Map<string, CacheItem<any>>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // 每5分钟清理一次过期缓存
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  set<T>(key: string, data: T, ttlSeconds: number = 300): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // 检查是否过期
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // 获取缓存统计信息
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.clear();
  }
}

// 全局缓存实例
export const cache = new MemoryCache();

// 缓存装饰器函数
export function withCache<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  keyGenerator: (...args: T) => string,
  ttlSeconds: number = 300
) {
  return async (...args: T): Promise<R> => {
    const cacheKey = keyGenerator(...args);

    // 尝试从缓存获取
    const cached = cache.get<R>(cacheKey);
    if (cached !== null) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return cached;
    }

    // 缓存未命中，执行原函数
    console.log(`Cache miss for key: ${cacheKey}`);
    const result = await fn(...args);

    // 存储到缓存
    cache.set(cacheKey, result, ttlSeconds);

    return result;
  };
}

// 预定义的缓存键生成器
export const cacheKeys = {
  posts: (page: number = 1, limit: number = 10) => `posts:${page}:${limit}`,
  post: (slug: string) => `post:${slug}`,
  categories: () => 'categories:all',
  tags: () => 'tags:all',
  postsByCategory: (categorySlug: string, page: number = 1) =>
    `posts:category:${categorySlug}:${page}`,
  postsByTag: (tagSlug: string, page: number = 1) =>
    `posts:tag:${tagSlug}:${page}`,
};

// 缓存失效工具
export const cacheInvalidation = {
  // 文章相关缓存失效
  invalidatePost: (slug: string) => {
    cache.delete(cacheKeys.post(slug));
    // 也可以失效相关的列表缓存
    cache.delete(cacheKeys.posts());
  },

  // 失效所有文章列表缓存
  invalidatePostLists: () => {
    const stats = cache.getStats();
    stats.keys.forEach((key) => {
      if (key.startsWith('posts:')) {
        cache.delete(key);
      }
    });
  },

  // 失效分类相关缓存
  invalidateCategories: () => {
    cache.delete(cacheKeys.categories());
    const stats = cache.getStats();
    stats.keys.forEach((key) => {
      if (key.startsWith('posts:category:')) {
        cache.delete(key);
      }
    });
  },

  // 失效标签相关缓存
  invalidateTags: () => {
    cache.delete(cacheKeys.tags());
    const stats = cache.getStats();
    stats.keys.forEach((key) => {
      if (key.startsWith('posts:tag:')) {
        cache.delete(key);
      }
    });
  },

  // 清空所有缓存
  invalidateAll: () => {
    cache.clear();
  },
};

// React Hook 用于在客户端使用缓存
export function useCache() {
  return {
    cache,
    cacheKeys,
    cacheInvalidation,
  };
}
