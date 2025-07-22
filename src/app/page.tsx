import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PostCard } from '@/components/post-card';
import { getPostsWithCache } from '@/lib/queries';

// 启用 ISR，每30秒重新验证首页
export const revalidate = 30;

async function getPosts() {
  try {
    // 检查数据库连接
    if (
      !process.env.DATABASE_URL ||
      process.env.DATABASE_URL.includes('username:password@hostname')
    ) {
      console.warn(
        'Database not configured. Please set up your Neon database URL in .env file.'
      );
      return { posts: [], total: 0 };
    }

    const result = await getPostsWithCache(1, 10);
    return result;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], total: 0 };
  }
}

export default async function HomePage() {
  const result = await getPosts();
  const posts = result.posts || [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6 text-gray-900 leading-tight">
                欢迎来到我的博客
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                分享技术见解、生活感悟和学习心得
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <span>{posts.length} 篇文章</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <span>技术 · 生活 · 学习</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Posts Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-white border border-blue-200 rounded-xl p-8 mb-8 shadow-sm">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      🚀 欢迎使用博客应用！
                    </h3>
                    <p className="text-gray-600 mb-6">
                      数据库已配置完成，现在可以开始创建内容了。
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 text-left text-sm text-gray-600 space-y-2 mb-6">
                      <p className="font-medium text-gray-900 mb-2">
                        快速开始：
                      </p>
                      <p>
                        1. 访问{' '}
                        <a
                          href="/admin"
                          className="text-blue-600 hover:underline"
                        >
                          /admin
                        </a>{' '}
                        管理后台
                      </p>
                      <p>2. 创建分类和标签</p>
                      <p>3. 发布你的第一篇文章</p>
                    </div>
                    <a
                      href="/admin"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      前往管理后台
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      最新文章
                    </h2>
                    <p className="text-gray-600">
                      探索最新的技术见解和生活感悟
                    </p>
                  </div>
                  <div className="space-y-8">
                    {posts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
