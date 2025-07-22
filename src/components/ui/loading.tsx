import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function Loading({ size = 'md', className, text }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex flex-col items-center space-y-2">
        <div
          className={cn(
            'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
            sizeClasses[size]
          )}
        />
        {text && <p className="text-sm text-gray-600 animate-pulse">{text}</p>}
      </div>
    </div>
  );
}

// 页面级加载组件
export function PageLoading({ text = '加载中...' }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loading size="lg" text={text} />
    </div>
  );
}

// 内容区域加载组件
export function ContentLoading({ text = '加载中...' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <Loading size="md" text={text} />
    </div>
  );
}

// 按钮加载状态
export function ButtonLoading({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  return <Loading size={size} className="mr-2" />;
}

// 骨架屏组件
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded-md bg-gray-200', className)} />
  );
}

// 文章卡片骨架屏
export function PostCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex space-x-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  );
}

// 文章列表骨架屏
export function PostListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-8">
      {Array.from({ length: count }).map((_, index) => (
        <PostCardSkeleton key={index} />
      ))}
    </div>
  );
}

// 文章内容骨架屏
export function PostContentSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-10 w-3/4" />
        <div className="flex space-x-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-18" />
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}

// 表格骨架屏
export function TableSkeleton({
  rows = 5,
  cols = 4,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="space-y-3">
      {/* 表头 */}
      <div className="flex space-x-4">
        {Array.from({ length: cols }).map((_, index) => (
          <Skeleton key={index} className="h-4 flex-1" />
        ))}
      </div>

      {/* 表格行 */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
