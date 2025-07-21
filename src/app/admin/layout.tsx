import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/admin" className="text-xl font-bold">
              博客管理
            </Link>

            <div className="flex items-center space-x-4">
              <Link
                href="/admin/posts"
                className="text-gray-600 hover:text-gray-900"
              >
                文章管理
              </Link>
              <Link
                href="/admin/categories"
                className="text-gray-600 hover:text-gray-900"
              >
                分类管理
              </Link>
              <Link
                href="/admin/tags"
                className="text-gray-600 hover:text-gray-900"
              >
                标签管理
              </Link>
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                返回首页
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
