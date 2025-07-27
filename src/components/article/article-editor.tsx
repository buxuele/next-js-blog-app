import * as React from 'react';
import { ArticleWithTodos } from '@/lib/types';
import { TodoList } from '@/components/todo/todo-list';
import { Input } from '@/components/ui/input';
import { AutoSaveIndicator } from '@/components/ui/auto-save-indicator';
import { useAutoSave } from '@/lib/hooks/use-auto-save';
import { cn } from '@/lib/utils';
import { FileText } from 'lucide-react';

export interface ArticleEditorProps {
  article: ArticleWithTodos | null;
  onUpdateArticle: (id: string, updates: { title?: string }) => void;
  onCreateTodo: (articleId: string, afterTodoId?: string) => void;
  onUpdateTodo: (
    id: string,
    updates: { content?: string; completed?: boolean; indentLevel?: number }
  ) => void;
  onDeleteTodo: (id: string) => void;
  onCopyTodo: (id: string) => void;
  onMoveTodo: (id: string, direction: 'up' | 'down') => void;
  onIndentTodo: (id: string, direction: 'increase' | 'decrease') => void;
  onReorderTodos: (articleId: string, todoIds: string[]) => void;
  className?: string;
}

export function ArticleEditor({
  article,
  onUpdateArticle,
  onCreateTodo,
  onUpdateTodo,
  onDeleteTodo,
  onCopyTodo,
  onMoveTodo,
  onIndentTodo,
  onReorderTodos,
  className,
}: ArticleEditorProps) {
  const [title, setTitle] = React.useState(article?.title || '');
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);

  // 自动保存标题
  const {
    saveStatus,
    lastSaved,
    error,
    save: saveTitle,
    reset: resetSaveStatus,
  } = useAutoSave(
    React.useCallback(async () => {
      if (article && title !== article.title) {
        await onUpdateArticle(article.id, { title });
      }
    }, [article, title, onUpdateArticle]),
    { delay: 1000 }
  );

  // 同步外部标题变化
  React.useEffect(() => {
    if (article) {
      setTitle(article.title);
    }
  }, [article?.title]);

  // 处理标题变化
  const handleTitleChange = (value: string) => {
    setTitle(value);
    resetSaveStatus();
  };

  // 处理标题保存
  const handleTitleSave = () => {
    setIsEditingTitle(false);
    if (article && title !== article.title) {
      saveTitle();
    }
  };

  // 处理标题键盘事件
  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTitleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setTitle(article?.title || '');
      setIsEditingTitle(false);
    }
  };

  // 处理创建 Todo
  const handleCreateTodo = (afterTodoId?: string) => {
    if (!article) return;
    onCreateTodo(article.id, afterTodoId);
  };

  // 处理重新排序 Todo
  const handleReorderTodos = (todoIds: string[]) => {
    if (!article) return;
    onReorderTodos(article.id, todoIds);
  };

  if (!article) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center h-full',
          className
        )}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            选择一篇文章开始编辑
          </h3>
          <p className="text-sm text-muted-foreground">
            从左侧列表中选择一篇文章，或创建一篇新文章
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* 文章标题区域 */}
      <div className="flex-shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              {isEditingTitle ? (
                <Input
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={handleTitleKeyDown}
                  className="text-2xl font-bold border-none shadow-none p-0 h-auto focus-visible:ring-0"
                  placeholder="文章标题..."
                  autoFocus
                />
              ) : (
                <h1
                  className="text-2xl font-bold cursor-text hover:bg-accent/30 rounded px-2 py-1 transition-colors"
                  onClick={() => setIsEditingTitle(true)}
                >
                  {title || '无标题文章'}
                </h1>
              )}
            </div>

            {/* 自动保存指示器 */}
            <AutoSaveIndicator
              status={saveStatus}
              lastSaved={lastSaved}
              error={error}
              onRetry={saveTitle}
            />
          </div>

          {/* 文章信息 */}
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>
              创建于 {new Date(article.createdAt).toLocaleDateString()}
            </span>
            <span>
              更新于 {new Date(article.updatedAt).toLocaleDateString()}
            </span>
            <span>{article.todos.length} 个项目</span>
            <span>
              {article.todos.filter((t) => t.completed).length} 个已完成
            </span>
          </div>
        </div>
      </div>

      {/* Todo 列表区域 */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <TodoList
            todos={article.todos}
            onCreateTodo={handleCreateTodo}
            onUpdateTodo={onUpdateTodo}
            onDeleteTodo={onDeleteTodo}
            onCopyTodo={onCopyTodo}
            onMoveTodo={onMoveTodo}
            onIndentTodo={onIndentTodo}
            onReorderTodos={handleReorderTodos}
          />
        </div>
      </div>
    </div>
  );
}
