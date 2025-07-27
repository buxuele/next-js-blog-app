import * as React from 'react';
import { TodoItem as TodoItemType } from '@prisma/client';
import { cn } from '@/lib/utils';
import { getIndentClassName } from '@/lib/utils/todo-helpers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ContextMenu } from '@/components/ui/context-menu';
import { ContextMenuItem, ContextMenuPosition } from '@/lib/types';
import {
  Check,
  Square,
  MoreHorizontal,
  Copy,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

export interface TodoItemProps {
  todo: TodoItemType;
  onUpdate: (
    id: string,
    updates: { content?: string; completed?: boolean; indentLevel?: number }
  ) => void;
  onDelete: (id: string) => void;
  onCopy: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  onIndent: (id: string, direction: 'increase' | 'decrease') => void;
  onKeyDown?: (e: React.KeyboardEvent, todoId: string) => void;
  isEditing?: boolean;
  onStartEdit?: (id: string) => void;
  onEndEdit?: () => void;
}

export const TodoItem = React.memo(function TodoItem({
  todo,
  onUpdate,
  onDelete,
  onCopy,
  onMove,
  onIndent,
  onKeyDown,
  isEditing = false,
  onStartEdit,
  onEndEdit,
}: TodoItemProps) {
  const [content, setContent] = React.useState(todo.content);
  const [isHovered, setIsHovered] = React.useState(false);
  const [contextMenu, setContextMenu] =
    React.useState<ContextMenuPosition | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // 同步外部内容变化
  React.useEffect(() => {
    setContent(todo.content);
  }, [todo.content]);

  // 编辑模式时聚焦输入框
  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // 处理内容变化
  const handleContentChange = (value: string) => {
    setContent(value);
  };

  // 处理内容保存
  const handleContentSave = () => {
    if (content !== todo.content) {
      onUpdate(todo.id, { content });
    }
    onEndEdit?.();
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleContentSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setContent(todo.content);
      onEndEdit?.();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        onIndent(todo.id, 'decrease');
      } else {
        onIndent(todo.id, 'increase');
      }
    }

    // 传递给父组件处理
    onKeyDown?.(e, todo.id);
  };

  // 处理复选框切换
  const handleToggleComplete = () => {
    onUpdate(todo.id, { completed: !todo.completed });
  };

  // 处理右键菜单
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  // 上下文菜单项
  const contextMenuItems: ContextMenuItem[] = [
    {
      label: '复制',
      icon: <Copy className="h-4 w-4" />,
      action: () => onCopy(todo.id),
    },
    {
      label: '向上移动',
      icon: <ArrowUp className="h-4 w-4" />,
      action: () => onMove(todo.id, 'up'),
    },
    {
      label: '向下移动',
      icon: <ArrowDown className="h-4 w-4" />,
      action: () => onMove(todo.id, 'down'),
    },
    { separator: true, label: '', action: () => {} },
    {
      label: '增加缩进',
      icon: <ChevronRight className="h-4 w-4" />,
      action: () => onIndent(todo.id, 'increase'),
      disabled: todo.indentLevel >= 3,
    },
    {
      label: '减少缩进',
      icon: <ChevronLeft className="h-4 w-4" />,
      action: () => onIndent(todo.id, 'decrease'),
      disabled: todo.indentLevel <= 0,
    },
    { separator: true, label: '', action: () => {} },
    {
      label: '删除',
      icon: '🗑️',
      action: () => onDelete(todo.id),
    },
  ];

  return (
    <>
      <div
        className={cn(
          'group flex items-center space-x-2 py-2 px-3 rounded-md transition-colors',
          'hover:bg-accent/50',
          getIndentClassName(todo.indentLevel),
          todo.completed && 'opacity-60'
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onContextMenu={handleContextMenu}
      >
        {/* 复选框 */}
        <button
          onClick={handleToggleComplete}
          className="flex-shrink-0 p-1 hover:bg-accent rounded transition-colors"
        >
          {todo.completed ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Square className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {/* 内容输入框 */}
        <div className="flex-1">
          {isEditing ? (
            <Input
              ref={inputRef}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              onBlur={handleContentSave}
              onKeyDown={handleKeyDown}
              className="border-none shadow-none p-0 h-auto focus-visible:ring-0"
              placeholder="输入内容..."
            />
          ) : (
            <div
              className={cn(
                'cursor-text py-1 px-2 rounded hover:bg-accent/30 transition-colors',
                todo.completed && 'line-through text-muted-foreground'
              )}
              onClick={() => onStartEdit?.(todo.id)}
            >
              {todo.content || '空白项目'}
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        {(isHovered || isEditing) && (
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setContextMenu({
                  x: e.currentTarget.getBoundingClientRect().left,
                  y: e.currentTarget.getBoundingClientRect().bottom + 4,
                });
              }}
              className="h-6 w-6 p-0"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* 上下文菜单 */}
      <ContextMenu
        items={contextMenuItems}
        position={contextMenu}
        onClose={() => setContextMenu(null)}
      />
    </>
  );
});
