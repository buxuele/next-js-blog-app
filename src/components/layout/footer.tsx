export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* 博客信息 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                我的博客
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                分享技术见解、生活感悟和学习心得，记录成长的每一个瞬间。
              </p>
            </div>

            {/* 快速链接 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                快速链接
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    首页
                  </a>
                </li>
                <li>
                  <a
                    href="/admin"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    管理后台
                  </a>
                </li>
                <li>
                  <a
                    href="/sitemap.xml"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    站点地图
                  </a>
                </li>
              </ul>
            </div>

            {/* 技术栈 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                技术栈
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  Next.js 15
                </span>
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  React 19
                </span>
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  TypeScript
                </span>
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  Tailwind CSS
                </span>
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  Prisma
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">
                &copy; 2025 我的个人博客. 保留所有权利.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Built with ❤️ using Next.js</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
