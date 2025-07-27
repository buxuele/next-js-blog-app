'use client';

import * as React from 'react';
import { BlogLayout } from '@/components/layout/blog-layout';
import { useArticles } from '@/lib/hooks/use-articles';
import { useTodos } from '@/lib/hooks/use-todos';
import { ErrorBoundary } from '@/components/error-boundary';
import { toast } from 'sonner';

export default function BlogPage() {
  const {
    articles,
    selectedArticle,
    loading,
    error,
    createArticle,
    updateArticle,
    deleteArticle,
    selectArticle,
  } = useArticles();

  const { createTodo, updateTodo, deleteTodo, reorderTodos, copyTodo } =
    useTodos();

  // 处理创建 Todo
  const handleCreateTodo = async (articleId: string, afterTodoId?: string) => {
    try {
      const afterTodo = afterTodoId
        ? selectedArticle?.todos.find((t) => t.id === afterTodoId)
        : null;

      const order = afterTodo ? afterTodo.order + 1 : 0;

      await createTodo(articleId, {
        content: '',
        articleId,
        order,
        indentLevel: 0,
      });

      // 重新加载文章以获取最新的 todos
      await selectArticle(articleId);

      toast.success('创建项目成功');
    } catch (error) {
      console.error('创建 Todo 失败:', error);
      toast.error('创建项目失败');
    }
  };

  // 处理更新 Todo
  const handleUpdateTodo = async (
    id: string,
    updates: { content?: string; completed?: boolean; indentLevel?: number }
  ) => {
    try {
      await updateTodo(id, updates);

      // 重新加载当前文章
      if (selectedArticle) {
        await selectArticle(selectedArticle.id);
      }
    } catch (error) {
      console.error('更新 Todo 失败:', error);
      toast.error('更新项目失败');
    }
  };

  // 处理删除 Todo
  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id);

      // 重新加载当前文章
      if (selectedArticle) {
        await selectArticle(selectedArticle.id);
      }

      toast.success('删除项目成功');
    } catch (error) {
      console.error('删除 Todo 失败:', error);
      toast.error('删除项目失败');
    }
  };

  // 处理复制 Todo
  const handleCopyTodo = async (id: string) => {
    try {
      await copyTodo(id, {});

      // 重新加载当前文章
      if (selectedArticle) {
        await selectArticle(selectedArticle.id);
      }

      toast.success('复制项目成功');
    } catch (error) {
      console.error('复制 Todo 失败:', error);
      toast.error('复制项目失败');
    }
  };

  // 处理移动 Todo
  const handleMoveTodo = async (id: string, direction: 'up' | 'down') => {
    if (!selectedArticle) return;

    const todos = selectedArticle.todos;
    const currentIndex = todos.findIndex((t) => t.id === id);

    if (currentIndex === -1) return;

    const targetIndex =
      direction === 'up'
        ? Math.max(0, currentIndex - 1)
        : Math.min(todos.length - 1, currentIndex + 1);

    if (currentIndex === targetIndex) return;

    // 重新排序
    const newTodos = [...todos];
    const [movedTodo] = newTodos.splice(currentIndex, 1);
    newTodos.splice(targetIndex, 0, movedTodo);

    const reorderedIds = newTodos.map((t) => t.id);
    await handleReorderTodos(selectedArticle.id, reorderedIds);
  };

  // 处理缩进 Todo
  const handleIndentTodo = async (
    id: string,
    direction: 'increase' | 'decrease'
  ) => {
    const todo = selectedArticle?.todos.find((t) => t.id === id);
    if (!todo) return;

    const newLevel =
      direction === 'increase'
        ? Math.min(todo.indentLevel + 1, 3)
        : Math.max(todo.indentLevel - 1, 0);

    if (newLevel === todo.indentLevel) return;

    await handleUpdateTodo(id, { indentLevel: newLevel });
  };

  // 处理重新排序 Todo
  const handleReorderTodos = async (articleId: string, todoIds: string[]) => {
    try {
      await reorderTodos(articleId, todoIds);

      // 重新加载当前文章
      await selectArticle(articleId);
    } catch (error) {
      console.error('重新排序失败:', error);
      toast.error('重新排序失败');
    }
  };

  // 处理创建文章
  const handleCreateArticle = async () => {
    try {
      await createArticle({ title: '新文章' });
      toast.success('创建文章成功');
    } catch (error) {
      console.error('创建文章失败:', error);
      toast.error('创建文章失败');
    }
  };

  // 处理删除文章
  const handleDeleteArticle = async (id: string) => {
    try {
      await deleteArticle(id);
      toast.success('删除文章成功');
    } catch (error) {
      console.error('删除文章失败:', error);
      toast.error('删除文章失败');
    }
  };

  // 处理更新文章
  const handleUpdateArticle = async (
    id: string,
    updates: { title?: string }
  ) => {
    try {
      await updateArticle(id, updates);
    } catch (error) {
      console.error('更新文章失败:', error);
      toast.error('更新文章失败');
    }
  };

  // 显示全局错误
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive mb-2">
            加载失败
          </h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="h-screen bg-background">
        <BlogLayout
          articles={articles}
          selectedArticle={selectedArticle}
          loading={loading}
          onSelectArticle={selectArticle}
          onCreateArticle={handleCreateArticle}
          onDeleteArticle={handleDeleteArticle}
          onUpdateArticle={handleUpdateArticle}
          onCreateTodo={handleCreateTodo}
          onUpdateTodo={handleUpdateTodo}
          onDeleteTodo={handleDeleteTodo}
          onCopyTodo={handleCopyTodo}
          onMoveTodo={handleMoveTodo}
          onIndentTodo={handleIndentTodo}
          onReorderTodos={handleReorderTodos}
        />
      </div>
    </ErrorBoundary>
  );
}
