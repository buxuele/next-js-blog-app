import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { formatDate } from '@/lib/utils';
import { generateArticleMetadata, generateArticleJsonLd } from '@/lib/seo';
import { getPostBySlugWithCache } from '@/lib/queries';
import { prisma } from '@/lib/prisma';

async function getPost(slug: string) {
  try {
    // 检查数据库连接
    if (
      !process.env.DATABASE_URL ||
      process.env.DATABASE_URL.includes('username:password@hostname')
    ) {
      console.warn(
        'Database not configured. Please set up your Neon database URL in .env file.'
      );
      return null;
    }

    const post = await getPostBySlugWithCache(slug);
    return post;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

// 启用 ISR，每60秒重新验证
export const revalidate = 60;

export async function generateStaticParams() {
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
      select: {
        slug: true,
      },
      // 只预生成最新的10篇文章，其他的按需生成
      take: 10,
      orderBy: {
        publishedAt: 'desc',
      },
    });

    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: '文章未找到',
      description: '您访问的文章不存在或已被删除',
    };
  }

  return generateArticleMetadata(post);
}

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = generateArticleJsonLd(post);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />

        {/* Breadcrumb */}
        <nav className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-3">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <a href="/" className="hover:text-blue-600 transition-colors">
                  首页
                </a>
                <svg
                  className="w-4 h-4"
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
                <span className="text-gray-900">{post.title}</span>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <article className="max-w-4xl mx-auto">
              {/* Article Header */}
              <header className="bg-white rounded-xl p-8 mb-8 shadow-sm border border-gray-200">
                <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                  {post.publishedAt && (
                    <time
                      dateTime={post.publishedAt.toISOString()}
                      className="flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {formatDate(new Date(post.publishedAt))}
                    </time>
                  )}
                  {post.category && (
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200">
                      {post.category.name}
                    </span>
                  )}
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
                  {post.title}
                </h1>

                {/* Tags not implemented yet */}
              </header>

              {/* Article Content */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <div className="prose prose-lg prose-gray max-w-none">
                  <div className="whitespace-pre-wrap leading-relaxed text-gray-800">
                    {post.content}
                  </div>
                </div>
              </div>

              {/* Article Footer */}
              <footer className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">博客作者</p>
                      <p className="text-sm text-gray-600">
                        分享技术见解和生活感悟
                      </p>
                    </div>
                  </div>
                  <a
                    href="/"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    返回首页
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
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                  </a>
                </div>
              </footer>
            </article>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
