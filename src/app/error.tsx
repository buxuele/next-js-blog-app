'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 记录错误到控制台
    console.error('Global error:', error);

    // 在生产环境中，你可能想要将错误发送到错误监控服务
    if (process.env.NODE_ENV === 'production') {
      // 例如：sendErrorToService(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">出现了错误</h1>

          <p className="text-gray-600 mb-6">
            很抱歉，应用程序遇到了意外错误。我们已经记录了这个问题，请稍后再试。
          </p>

          {process.env.NODE_ENV === 'development' && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
                错误详情 (开发模式)
              </summary>
              <div className="bg-gray-100 p-3 rounded text-xs font-mono overflow-auto max-h-40">
                <div className="text-red-600 font-semibold mb-2">
                  {error.name}: {error.message}
                </div>
                {error.stack && (
                  <pre className="text-gray-700 whitespace-pre-wrap">
                    {error.stack}
                  </pre>
                )}
                {error.digest && (
                  <div className="mt-2 text-gray-500">
                    Error ID: {error.digest}
                  </div>
                )}
              </div>
            </details>
          )}

          <div className="space-y-3">
            <Button onClick={reset} className="w-full">
              重试
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="w-full"
            >
              刷新页面
            </Button>
            <Button
              variant="ghost"
              onClick={() => (window.location.href = '/')}
              className="w-full"
            >
              回到首页
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
