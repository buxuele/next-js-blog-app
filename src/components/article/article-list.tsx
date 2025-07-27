import * as React from 'react';
import { Article } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { cn } from '@/lib/utils';
import {
  Plus,
  FileText,
  MoreHorizontal,
  Trash2,
  Calendar,
  Clock,
} from 'lucide-react';

export interface ArticleListProps {
  articles: Article[];
  selectedArticleId?: string;
  onSelectArticle: (id: string) => void;
  onCreateArticle: () => void;
  onDeleteArticle: (id: string) => void;
  loading?: boolean;
  className?: string;
}

export const ArticleList = React.memo(function ArticleList({
  articles,
  selectedArticleId,
  onSelectArticle,
  onCreateArticle,
  onDeleteArticle,
  loading = false,
  className,
}: ArticleListProps) {
  const [deleteConfirm, setDeleteConfirm] = React.useState<{
    open: boolean;
    articleId: string;
    articleTitle: string;
  }>({
    open: false,
    articleId: '',
    articleTitle: '',
  });

  // 处理删除确认
  const handleDeleteClick = (article: Article, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirm({
      open: true,
      articleId: article.id,
      articleTitle: article.title,
    });
  };

  // 确认删除
  const handleConfirmDelete = () => {
    onDeleteArticle(deleteConfirm.articleId);
    setDeleteConfirm({ open: false, articleId: '', articleTitle: '' });
  };

  // 取消删除
  const handleCancelDelete = () => {
    setDeleteConfirm({ open: false, articleId: '', articleTitle: '' });
  };

  // 格式化日期
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 86400000) {
      // 小于1天
      return date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diff < 604800000) {
      // 小于1周
      const days = Math.floor(diff / 86400000);
      return `${days}天前`;
    } else {
      return date.toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  if (loading) {
    return (
      <div className={cn('flex flex-col h-full', className)}>
        {/* 头部 */}
        <div className="flex-shrink-0 p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">文章列表</h2>
            <Button size="sm" disabled>
              <Plus className="h-4 w-4 mr-2" />
              新建
            </Button>
          </div>
        </div>

        {/* 加载状态 */}
        <div className="flex-1 p-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={cn('flex flex-col h-full bg-background', className)}>
        {/* 头部 */}
        <div className="flex-shrink-0 p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">文章列表</h2>
            <Button onClick={onCreateArticle} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              新建
            </Button>
          </div>

          {/* 统计信息 */}
          <div className="text-sm text-muted-foreground">
            共 {articles.length} 篇文章
          </div>
        </div>

        {/* 文章列表 */}
        <div className="flex-1 overflow-auto">
          {articles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">还没有文章</h3>
              <p className="text-sm text-muted-foreground mb-4">
                创建你的第一篇文章开始写作
              </p>
              <Button onClick={onCreateArticle} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                创建文章
              </Button>
            </div>
          ) : (
            <div className="p-2">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className={cn(
                    'group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent/50',
                    selectedArticleId === article.id && 'bg-accent'
                  )}
                  onClick={() => onSelectArticle(article.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <h3 className="font-medium truncate">
                        {article.title || '无标题'}
                      </h3>
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(new Date(article.createdAt))}</span>
                      </div>

                      {article.updatedAt !== article.createdAt && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            更新于 {formatDate(new Date(article.updatedAt))}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteClick(article, e)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 删除确认对话框 */}
      <ConfirmDialog
        open={deleteConfirm.open}
        title="删除文章"
        message={`确定要删除文章"${deleteConfirm.articleTitle}"吗？此操作无法撤销。`}
        confirmText="删除"
        cancelText="取消"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
});
