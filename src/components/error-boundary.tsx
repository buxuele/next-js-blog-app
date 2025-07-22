'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // 在生产环境中，你可能想要将错误发送到错误监控服务
    if (process.env.NODE_ENV === 'production') {
      // 例如：sendErrorToService(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;

      return (
        <FallbackComponent
          error={this.state.error!}
          reset={() => this.setState({ hasError: false, error: undefined })}
        />
      );
    }

    return this.props.children;
  }
}

// 默认错误回退组件
function DefaultErrorFallback({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          出现了一些问题
        </h2>

        <p className="text-gray-600 mb-4">
          很抱歉，页面遇到了错误。请尝试刷新页面或稍后再试。
        </p>

        {process.env.NODE_ENV === 'development' && (
          <details className="mb-4 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              错误详情 (开发模式)
            </summary>
            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}

        <div className="space-y-2">
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
        </div>
      </div>
    </div>
  );
}

// 页面级错误边界组件
export function PageErrorBoundary({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary fallback={PageErrorFallback}>{children}</ErrorBoundary>;
}

function PageErrorFallback({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="max-w-lg w-full mx-4">
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

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              页面加载失败
            </h1>

            <p className="text-gray-600 mb-6">
              很抱歉，页面在加载过程中遇到了问题。这可能是临时的网络问题或服务器错误。
            </p>

            <div className="space-y-3">
              <Button onClick={reset} className="w-full">
                重新加载
              </Button>
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="w-full"
              >
                返回上一页
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
    </div>
  );
}

// API 错误处理 Hook
export function useErrorHandler() {
  const handleError = React.useCallback((error: Error, context?: string) => {
    console.error(`Error ${context ? `in ${context}` : ''}:`, error);

    // 在生产环境中发送错误到监控服务
    if (process.env.NODE_ENV === 'production') {
      // sendErrorToService(error, { context });
    }
  }, []);

  return { handleError };
}
