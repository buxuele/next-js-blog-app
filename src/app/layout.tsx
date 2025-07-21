import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '我的个人博客',
  description: '分享技术见解、生活感悟和学习心得',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
