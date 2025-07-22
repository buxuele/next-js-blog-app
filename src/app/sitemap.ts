import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/admin`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
  ];

  try {
    // Check database connection
    if (
      !process.env.DATABASE_URL ||
      process.env.DATABASE_URL.includes('username:password@hostname')
    ) {
      console.warn('Database not configured for sitemap generation');
      return staticPages;
    }

    // Get all published posts
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      select: {
        slug: true,
        updatedAt: true,
        publishedAt: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });

    // Get all categories
    const categories = await prisma.category.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    // Get all tags
    const tags = await prisma.tag.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    // Generate post URLs
    const postUrls = posts.map((post) => ({
      url: `${baseUrl}/posts/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Generate category URLs (if you have category pages)
    const categoryUrls = categories.map((category) => ({
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    // Generate tag URLs (if you have tag pages)
    const tagUrls = tags.map((tag) => ({
      url: `${baseUrl}/tags/${tag.slug}`,
      lastModified: tag.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }));

    return [...staticPages, ...postUrls, ...categoryUrls, ...tagUrls];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticPages;
  }
}
