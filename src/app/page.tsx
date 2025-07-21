import { prisma } from '@/lib/prisma';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PostCard } from '@/components/post-card';

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
      return [];
    }

    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: 10,
    });

    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">欢迎来到我的博客</h1>
            <p className="text-gray-600 text-lg">
              分享技术见解、生活感悟和学习心得
            </p>
          </div>

          <div className="space-y-8">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    🚀 欢迎使用博客应用！
                  </h3>
                  <p className="text-blue-700 mb-4">
                    要开始使用，请先配置您的 Neon 数据库连接。
                  </p>
                  <div className="text-left text-sm text-blue-600 space-y-2">
                    <p>
                      1. 在{' '}
                      <a
                        href="https://neon.tech"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        Neon
                      </a>{' '}
                      创建数据库
                    </p>
                    <p>
                      2. 更新{' '}
                      <code className="bg-blue-100 px-1 rounded">.env</code>{' '}
                      文件中的{' '}
                      <code className="bg-blue-100 px-1 rounded">
                        DATABASE_URL
                      </code>
                    </p>
                    <p>
                      3. 运行{' '}
                      <code className="bg-blue-100 px-1 rounded">
                        npm run db:push
                      </code>{' '}
                      初始化数据库
                    </p>
                    <p>
                      4. 运行{' '}
                      <code className="bg-blue-100 px-1 rounded">
                        npm run db:seed
                      </code>{' '}
                      添加示例数据
                    </p>
                  </div>
                  <p className="text-blue-700 mt-4">
                    详细说明请查看{' '}
                    <code className="bg-blue-100 px-1 rounded">SETUP.md</code>{' '}
                    文件。
                  </p>
                </div>
                <p className="text-gray-500 text-lg">暂无文章发布</p>
              </div>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
