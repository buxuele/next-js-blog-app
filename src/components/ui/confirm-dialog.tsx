import * as React from 'react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

const variantConfig = {
  danger: {
    icon: AlertTriangle,
    iconColor: 'text-red-500',
    confirmVariant: 'destructive' as const,
  },
  warning: {
    icon: AlertCircle,
    iconColor: 'text-yellow-500',
    confirmVariant: 'default' as const,
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-500',
    confirmVariant: 'default' as const,
  },
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmText = '确认',
  cancelText = '取消',
  onConfirm,
  onCancel,
  variant = 'info',
}: ConfirmDialogProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />

      {/* 对话框内容 */}
      <div className="relative bg-background rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
        <div className="flex items-start space-x-3">
          <Icon
            className={cn('h-6 w-6 mt-0.5 flex-shrink-0', config.iconColor)}
          />

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">{message}</p>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={onCancel}>
                {cancelText}
              </Button>
              <Button variant={config.confirmVariant} onClick={onConfirm}>
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
