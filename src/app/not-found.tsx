import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            页面未找到
          </h2>
          <p className="text-gray-600 mb-8">
            抱歉，您访问的页面不存在或已被删除。
          </p>
          <Link href="/">
            <Button>返回首页</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
