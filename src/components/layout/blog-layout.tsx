import * as React from 'react';
import { ArticleWithTodos } from '@/lib/types';
import { Article } from '@prisma/client';
import { ArticleList } from '@/components/article/article-list';
import { ArticleEditor } from '@/components/article/article-editor';
import { cn } from '@/lib/utils';
import { PanelLeft, PanelLeftClose } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface BlogLayoutProps {
  articles: Article[];
  selectedArticle: ArticleWithTodos | null;
  loading?: boolean;
  onSelectArticle: (id: string) => void;
  onCreateArticle: () => void;
  onDeleteArticle: (id: string) => void;
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

export function BlogLayout({
  articles,
  selectedArticle,
  loading = false,
  onSelectArticle,
  onCreateArticle,
  onDeleteArticle,
  onUpdateArticle,
  onCreateTodo,
  onUpdateTodo,
  onDeleteTodo,
  onCopyTodo,
  onMoveTodo,
  onIndentTodo,
  onReorderTodos,
  className,
}: BlogLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [sidebarWidth, setSidebarWidth] = React.useState(320);
  const [isResizing, setIsResizing] = React.useState(false);

  // 处理侧边栏拖拽调整大小
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = Math.max(280, Math.min(500, e.clientX));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  // 响应式处理
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={cn('flex h-screen bg-background', className)}>
      {/* 侧边栏 */}
      <div
        className={cn(
          'relative flex-shrink-0 border-r bg-background transition-all duration-300',
          sidebarCollapsed ? 'w-0' : `w-[${sidebarWidth}px]`,
          isMobile &&
            !sidebarCollapsed &&
            'absolute inset-y-0 left-0 z-50 shadow-lg'
        )}
        style={{ width: sidebarCollapsed ? 0 : sidebarWidth }}
      >
        {!sidebarCollapsed && (
          <>
            <ArticleList
              articles={articles}
              selectedArticleId={selectedArticle?.id}
              onSelectArticle={(id) => {
                onSelectArticle(id);
                if (isMobile) {
                  setSidebarCollapsed(true);
                }
              }}
              onCreateArticle={onCreateArticle}
              onDeleteArticle={onDeleteArticle}
              loading={loading}
              className="flex-1"
            />

            {/* 拖拽调整大小的手柄 */}
            {!isMobile && (
              <div
                className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-border transition-colors"
                onMouseDown={handleMouseDown}
              />
            )}
          </>
        )}
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 顶部工具栏 */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="h-8 w-8 p-0"
            >
              {sidebarCollapsed ? (
                <PanelLeft className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </Button>

            {selectedArticle && (
              <div className="text-sm text-muted-foreground">
                {selectedArticle.title || '无标题文章'}
              </div>
            )}
          </div>

          {/* 快捷操作 */}
          <div className="flex items-center space-x-2">
            {selectedArticle && (
              <div className="text-xs text-muted-foreground">
                {selectedArticle.todos.length} 项目 ·{' '}
                {selectedArticle.todos.filter((t) => t.completed).length} 已完成
              </div>
            )}
          </div>
        </div>

        {/* 编辑器区域 */}
        <div className="flex-1 overflow-hidden">
          <ArticleEditor
            article={selectedArticle}
            onUpdateArticle={onUpdateArticle}
            onCreateTodo={onCreateTodo}
            onUpdateTodo={onUpdateTodo}
            onDeleteTodo={onDeleteTodo}
            onCopyTodo={onCopyTodo}
            onMoveTodo={onMoveTodo}
            onIndentTodo={onIndentTodo}
            onReorderTodos={onReorderTodos}
            className="h-full"
          />
        </div>
      </div>

      {/* 移动端遮罩 */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
    </div>
  );
}
