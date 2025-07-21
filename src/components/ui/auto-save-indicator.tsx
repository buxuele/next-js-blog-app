import * as React from 'react';
import { cn } from '@/lib/utils';
import { SaveStatus } from '@/lib/types';
import { Check, Loader2, AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './button';

export interface AutoSaveIndicatorProps {
  status: SaveStatus;
  lastSaved?: Date;
  error?: string;
  onRetry?: () => void;
  className?: string;
}

const statusConfig = {
  idle: {
    icon: null,
    text: '',
    color: 'text-muted-foreground',
  },
  saving: {
    icon: Loader2,
    text: '保存中...',
    color: 'text-blue-500',
    animate: true,
  },
  saved: {
    icon: Check,
    text: '已保存',
    color: 'text-green-500',
  },
  error: {
    icon: AlertCircle,
    text: '保存失败',
    color: 'text-red-500',
  },
};

function formatLastSaved(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60000) {
    // 小于1分钟
    return '刚刚';
  } else if (diff < 3600000) {
    // 小于1小时
    const minutes = Math.floor(diff / 60000);
    return `${minutes}分钟前`;
  } else if (diff < 86400000) {
    // 小于1天
    const hours = Math.floor(diff / 3600000);
    return `${hours}小时前`;
  } else {
    return date.toLocaleDateString();
  }
}

export function AutoSaveIndicator({
  status,
  lastSaved,
  error,
  onRetry,
  className,
}: AutoSaveIndicatorProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  if (status === 'idle' && !lastSaved) {
    return null;
  }

  return (
    <div className={cn('flex items-center space-x-2 text-sm', className)}>
      {Icon && (
        <Icon
          className={cn(
            'h-4 w-4',
            config.color,
            status === 'saving' && 'animate-spin'
          )}
        />
      )}

      <span className={config.color}>
        {config.text}
        {status === 'saved' && lastSaved && (
          <span className="ml-1 text-muted-foreground">
            · {formatLastSaved(lastSaved)}
          </span>
        )}
      </span>

      {status === 'error' && (
        <div className="flex items-center space-x-2">
          {error && (
            <span className="text-xs text-muted-foreground max-w-[200px] truncate">
              {error}
            </span>
          )}
          {onRetry && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRetry}
              className="h-6 px-2 text-xs"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              重试
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
