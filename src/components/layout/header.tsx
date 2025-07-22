import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
          >
            我的博客
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              首页
            </Link>
            <Link
              href="/admin"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              管理
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
