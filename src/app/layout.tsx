import type { Metadata } from 'next';
import './globals.css';
import { generateMetadata } from '@/lib/seo';
import { Toaster } from 'sonner';
import { ErrorBoundary } from '@/components/error-boundary';

export const metadata: Metadata = generateMetadata({
  title: '我的个人博客',
  description: '分享技术见解、生活感悟和学习心得',
  keywords: ['博客', '技术', '编程', '生活', '学习'],
  url: '/',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased bg-amber-50 min-h-screen">
        <ErrorBoundary>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            expand={false}
            duration={4000}
          />
        </ErrorBoundary>
      </body>
    </html>
  );
}
