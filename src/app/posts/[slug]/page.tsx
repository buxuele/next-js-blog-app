import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { formatDate } from '@/lib/utils';

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

    const post = await prisma.post.findUnique({
      where: {
        slug,
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
    });

    return post;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

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
    });

    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
              {post.publishedAt && (
                <time>{formatDate(new Date(post.publishedAt))}</time>
              )}
              {post.category && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {post.category.name}
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map(({ tag }) => (
                  <span
                    key={tag.slug}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap">{post.content}</div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
