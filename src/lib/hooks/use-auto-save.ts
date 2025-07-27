import * as React from 'react';
import { SaveStatus } from '@/lib/types';

export interface UseAutoSaveOptions {
  delay?: number; // 防抖延迟时间（毫秒）
  enabled?: boolean; // 是否启用自动保存
}

export interface UseAutoSaveReturn {
  saveStatus: SaveStatus;
  lastSaved: Date | null;
  error: string | null;
  save: () => void;
  reset: () => void;
}

export function useAutoSave(
  saveFn: () => Promise<void>,
  options: UseAutoSaveOptions = {}
): UseAutoSaveReturn {
  const { delay = 1000, enabled = true } = options;

  const [saveStatus, setSaveStatus] = React.useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const saveFnRef = React.useRef(saveFn);

  // 更新保存函数引用
  React.useEffect(() => {
    saveFnRef.current = saveFn;
  }, [saveFn]);

  // 执行保存
  const save = React.useCallback(async () => {
    if (!enabled) return;

    try {
      setSaveStatus('saving');
      setError(null);

      await saveFnRef.current();

      setSaveStatus('saved');
      setLastSaved(new Date());

      // 2秒后重置状态
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } catch (err) {
      setSaveStatus('error');
      setError(err instanceof Error ? err.message : '保存失败');
    }
  }, [enabled]);

  // 防抖保存
  const debouncedSave = React.useCallback(() => {
    if (!enabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      save();
    }, delay);
  }, [save, delay, enabled]);

  // 重置状态
  const reset = React.useCallback(() => {
    setSaveStatus('idle');
    setError(null);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  // 清理定时器
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    saveStatus,
    lastSaved,
    error,
    save: debouncedSave,
    reset,
  };
}
