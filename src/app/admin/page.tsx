import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';

async function getStats() {
  try {
    // 检查数据库连接
    if (
      !process.env.DATABASE_URL ||
      process.env.DATABASE_URL.includes('username:password@hostname')
    ) {
      console.warn(
        'Database not configured. Please set up your Neon database URL in .env file.'
      );
      return {
        totalPosts: 0,
        publishedPosts: 0,
        draftPosts: 0,
        totalCategories: 0,
      };
    }

    const [totalPosts, publishedPosts, draftPosts, totalCategories] =
      await Promise.all([
        prisma.post.count(),
        prisma.post.count({ where: { published: true } }),
        prisma.post.count({ where: { published: false } }),
        prisma.category.count(),
      ]);

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalCategories,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      totalPosts: 0,
      publishedPosts: 0,
      draftPosts: 0,
      totalCategories: 0,
    };
  }
}

export default async function AdminPage() {
  const stats = await getStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">管理面板</h1>
        <p className="text-gray-600">欢迎来到博客管理后台</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">文章统计</h3>
          <div className="space-y-2">
            <p>
              总文章数: <span className="font-bold">{stats.totalPosts}</span>
            </p>
            <p>
              已发布:{' '}
              <span className="font-bold text-green-600">
                {stats.publishedPosts}
              </span>
            </p>
            <p>
              草稿:{' '}
              <span className="font-bold text-yellow-600">
                {stats.draftPosts}
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">分类统计</h3>
          <p>
            总分类数: <span className="font-bold">{stats.totalCategories}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/admin/posts/new">
          <Button className="w-full h-20 text-lg">创建新文章</Button>
        </Link>

        <Link href="/admin/posts">
          <Button variant="outline" className="w-full h-20 text-lg">
            管理文章
          </Button>
        </Link>

        <Link href="/admin/categories">
          <Button variant="outline" className="w-full h-20 text-lg">
            管理分类
          </Button>
        </Link>
      </div>
    </div>
  );
}
