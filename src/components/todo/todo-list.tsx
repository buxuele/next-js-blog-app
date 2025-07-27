import * as React from 'react';
import { TodoItem as TodoItemType } from '@prisma/client';
import { TodoItem } from './todo-item';
import { sortTodosByOrder } from '@/lib/utils/todo-helpers';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface TodoListProps {
  todos: TodoItemType[];
  onCreateTodo: (afterTodoId?: string) => void;
  onUpdateTodo: (
    id: string,
    updates: { content?: string; completed?: boolean; indentLevel?: number }
  ) => void;
  onDeleteTodo: (id: string) => void;
  onCopyTodo: (id: string) => void;
  onMoveTodo: (id: string, direction: 'up' | 'down') => void;
  onIndentTodo: (id: string, direction: 'increase' | 'decrease') => void;
  onReorderTodos: (todoIds: string[]) => void;
  className?: string;
}

export const TodoList = React.memo(function TodoList({
  todos,
  onCreateTodo,
  onUpdateTodo,
  onDeleteTodo,
  onCopyTodo,
  onMoveTodo,
  onIndentTodo,
  onReorderTodos,
  className,
}: TodoListProps) {
  const [editingTodoId, setEditingTodoId] = React.useState<string | null>(null);
  const [draggedTodoId, setDraggedTodoId] = React.useState<string | null>(null);

  const sortedTodos = React.useMemo(() => sortTodosByOrder(todos), [todos]);

  // 处理键盘导航
  const handleKeyDown = (e: React.KeyboardEvent, todoId: string) => {
    const currentIndex = sortedTodos.findIndex((t) => t.id === todoId);

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // 在当前项目后创建新项目
      onCreateTodo(todoId);
    } else if (
      e.key === 'Backspace' &&
      e.currentTarget instanceof HTMLInputElement
    ) {
      const input = e.currentTarget;
      if (input.value === '' && input.selectionStart === 0) {
        e.preventDefault();
        // 删除空项目并聚焦到上一个项目
        if (sortedTodos.length > 1) {
          onDeleteTodo(todoId);
          if (currentIndex > 0) {
            const prevTodo = sortedTodos[currentIndex - 1];
            setEditingTodoId(prevTodo.id);
          }
        }
      }
    } else if (e.key === 'ArrowUp' && e.ctrlKey) {
      e.preventDefault();
      onMoveTodo(todoId, 'up');
    } else if (e.key === 'ArrowDown' && e.ctrlKey) {
      e.preventDefault();
      onMoveTodo(todoId, 'down');
    }
  };

  // 处理拖拽开始
  const handleDragStart = (e: React.DragEvent, todoId: string) => {
    setDraggedTodoId(todoId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', todoId);
  };

  // 处理拖拽结束
  const handleDragEnd = () => {
    setDraggedTodoId(null);
  };

  // 处理拖拽悬停
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // 处理放置
  const handleDrop = (e: React.DragEvent, targetTodoId: string) => {
    e.preventDefault();

    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId === targetTodoId) return;

    const draggedIndex = sortedTodos.findIndex((t) => t.id === draggedId);
    const targetIndex = sortedTodos.findIndex((t) => t.id === targetTodoId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // 重新排序
    const newTodos = [...sortedTodos];
    const [draggedTodo] = newTodos.splice(draggedIndex, 1);
    newTodos.splice(targetIndex, 0, draggedTodo);

    const reorderedIds = newTodos.map((t) => t.id);
    onReorderTodos(reorderedIds);
  };

  // 开始编辑
  const handleStartEdit = (todoId: string) => {
    setEditingTodoId(todoId);
  };

  // 结束编辑
  const handleEndEdit = () => {
    setEditingTodoId(null);
  };

  if (sortedTodos.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center py-12',
          className
        )}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            开始创建你的第一个项目
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            点击下方按钮或按回车键创建新的待办项目
          </p>
          <Button onClick={() => onCreateTodo()} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            创建项目
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-1', className)}>
      {sortedTodos.map((todo) => (
        <div
          key={todo.id}
          draggable
          onDragStart={(e) => handleDragStart(e, todo.id)}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, todo.id)}
          className={cn(
            'transition-opacity',
            draggedTodoId === todo.id && 'opacity-50'
          )}
        >
          <TodoItem
            todo={todo}
            onUpdate={onUpdateTodo}
            onDelete={onDeleteTodo}
            onCopy={onCopyTodo}
            onMove={onMoveTodo}
            onIndent={onIndentTodo}
            onKeyDown={handleKeyDown}
            isEditing={editingTodoId === todo.id}
            onStartEdit={handleStartEdit}
            onEndEdit={handleEndEdit}
          />
        </div>
      ))}

      {/* 添加新项目按钮 */}
      <div className="pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCreateTodo()}
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          添加新项目
        </Button>
      </div>
    </div>
  );
});
