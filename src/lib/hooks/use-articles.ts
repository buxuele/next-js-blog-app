import * as React from 'react';
import { Article } from '@prisma/client';
import {
  ArticleWithTodos,
  ApiResponse,
  CreateArticleRequest,
  UpdateArticleRequest,
} from '@/lib/types';

export interface UseArticlesReturn {
  articles: Article[];
  selectedArticle: ArticleWithTodos | null;
  loading: boolean;
  error: string | null;
  createArticle: (data?: CreateArticleRequest) => Promise<Article>;
  updateArticle: (id: string, updates: UpdateArticleRequest) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  selectArticle: (id: string) => Promise<void>;
  refreshArticles: () => Promise<void>;
}

export function useArticles(): UseArticlesReturn {
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] =
    React.useState<ArticleWithTodos | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // 获取文章列表
  const fetchArticles = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/articles');
      const result: ApiResponse<ArticleWithTodos[]> = await response.json();

      if (!result.success) {
        throw new Error(result.error || '获取文章列表失败');
      }

      setArticles(result.data || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '获取文章列表失败';
      setError(errorMessage);
      console.error('获取文章列表失败:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 获取单个文章详情
  const fetchArticle = React.useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/articles/${id}`);
      const result: ApiResponse<ArticleWithTodos> = await response.json();

      if (!result.success) {
        throw new Error(result.error || '获取文章详情失败');
      }

      return result.data!;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '获取文章详情失败';
      setError(errorMessage);
      console.error('获取文章详情失败:', err);
      throw err;
    }
  }, []);

  // 创建文章
  const createArticle = React.useCallback(
    async (data: CreateArticleRequest = {}) => {
      try {
        setError(null);

        const response = await fetch('/api/articles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result: ApiResponse<ArticleWithTodos> = await response.json();

        if (!result.success) {
          throw new Error(result.error || '创建文章失败');
        }

        const newArticle = result.data!;

        // 乐观更新：添加到文章列表
        setArticles((prev) => [newArticle, ...prev]);

        // 自动选择新创建的文章
        setSelectedArticle(newArticle);

        return newArticle;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : '创建文章失败';
        setError(errorMessage);
        console.error('创建文章失败:', err);
        throw err;
      }
    },
    []
  );

  // 更新文章
  const updateArticle = React.useCallback(
    async (id: string, updates: UpdateArticleRequest) => {
      try {
        setError(null);

        const response = await fetch(`/api/articles/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        });

        const result: ApiResponse<ArticleWithTodos> = await response.json();

        if (!result.success) {
          throw new Error(result.error || '更新文章失败');
        }

        const updatedArticle = result.data!;

        // 乐观更新：更新文章列表
        setArticles((prev) =>
          prev.map((article) => (article.id === id ? updatedArticle : article))
        );

        // 如果是当前选中的文章，也更新选中状态
        if (selectedArticle?.id === id) {
          setSelectedArticle(updatedArticle);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : '更新文章失败';
        setError(errorMessage);
        console.error('更新文章失败:', err);
        throw err;
      }
    },
    [selectedArticle]
  );

  // 删除文章
  const deleteArticle = React.useCallback(
    async (id: string) => {
      try {
        setError(null);

        const response = await fetch(`/api/articles/${id}`, {
          method: 'DELETE',
        });

        const result: ApiResponse<{ id: string }> = await response.json();

        if (!result.success) {
          throw new Error(result.error || '删除文章失败');
        }

        // 乐观更新：从文章列表中移除
        setArticles((prev) => prev.filter((article) => article.id !== id));

        // 如果删除的是当前选中的文章，清空选中状态
        if (selectedArticle?.id === id) {
          setSelectedArticle(null);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : '删除文章失败';
        setError(errorMessage);
        console.error('删除文章失败:', err);
        throw err;
      }
    },
    [selectedArticle]
  );

  // 选择文章
  const selectArticle = React.useCallback(
    async (id: string) => {
      try {
        setError(null);
        const article = await fetchArticle(id);
        setSelectedArticle(article);
      } catch (err) {
        // 错误已在 fetchArticle 中处理
      }
    },
    [fetchArticle]
  );

  // 刷新文章列表
  const refreshArticles = React.useCallback(async () => {
    await fetchArticles();
  }, [fetchArticles]);

  // 初始化加载
  React.useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return {
    articles,
    selectedArticle,
    loading,
    error,
    createArticle,
    updateArticle,
    deleteArticle,
    selectArticle,
    refreshArticles,
  };
}
