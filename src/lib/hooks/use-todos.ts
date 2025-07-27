import * as React from 'react';
import { TodoItem } from '@prisma/client';
import {
  ApiResponse,
  CreateTodoRequest,
  UpdateTodoRequest,
  ReorderTodosRequest,
  CopyTodoRequest,
} from '@/lib/types';

export interface UseTodosReturn {
  createTodo: (articleId: string, todo: CreateTodoRequest) => Promise<TodoItem>;
  updateTodo: (id: string, updates: UpdateTodoRequest) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  reorderTodos: (articleId: string, todoIds: string[]) => Promise<void>;
  copyTodo: (id: string, request: CopyTodoRequest) => Promise<TodoItem>;
}

export function useTodos(): UseTodosReturn {
  // 创建 Todo
  const createTodo = React.useCallback(
    async (articleId: string, todo: CreateTodoRequest) => {
      try {
        const response = await fetch('/api/todos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...todo, articleId }),
        });

        const result: ApiResponse<TodoItem> = await response.json();

        if (!result.success) {
          throw new Error(result.error || '创建 Todo 失败');
        }

        return result.data!;
      } catch (err) {
        console.error('创建 Todo 失败:', err);
        throw err;
      }
    },
    []
  );

  // 更新 Todo
  const updateTodo = React.useCallback(
    async (id: string, updates: UpdateTodoRequest) => {
      try {
        const response = await fetch(`/api/todos/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        });

        const result: ApiResponse<TodoItem> = await response.json();

        if (!result.success) {
          throw new Error(result.error || '更新 Todo 失败');
        }
      } catch (err) {
        console.error('更新 Todo 失败:', err);
        throw err;
      }
    },
    []
  );

  // 删除 Todo
  const deleteTodo = React.useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });

      const result: ApiResponse<{ id: string }> = await response.json();

      if (!result.success) {
        throw new Error(result.error || '删除 Todo 失败');
      }
    } catch (err) {
      console.error('删除 Todo 失败:', err);
      throw err;
    }
  }, []);

  // 重新排序 Todo
  const reorderTodos = React.useCallback(
    async (articleId: string, todoIds: string[]) => {
      try {
        const response = await fetch('/api/todos/reorder', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ todoIds } as ReorderTodosRequest),
        });

        const result: ApiResponse<TodoItem[]> = await response.json();

        if (!result.success) {
          throw new Error(result.error || '重新排序失败');
        }
      } catch (err) {
        console.error('重新排序失败:', err);
        throw err;
      }
    },
    []
  );

  // 复制 Todo
  const copyTodo = React.useCallback(
    async (id: string, request: CopyTodoRequest) => {
      try {
        const response = await fetch(`/api/todos/${id}/copy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        });

        const result: ApiResponse<TodoItem> = await response.json();

        if (!result.success) {
          throw new Error(result.error || '复制 Todo 失败');
        }

        return result.data!;
      } catch (err) {
        console.error('复制 Todo 失败:', err);
        throw err;
      }
    },
    []
  );

  return {
    createTodo,
    updateTodo,
    deleteTodo,
    reorderTodos,
    copyTodo,
  };
}
