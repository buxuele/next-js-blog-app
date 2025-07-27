import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  category?: string;
  tags?: string[];
}

const DEFAULT_CONFIG = {
  siteName: '我的个人博客',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000',
  defaultImage: '/og-image.jpg',
  twitterHandle: '@myblog',
};

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    category,
    tags = [],
  } = config;

  const fullTitle =
    title === DEFAULT_CONFIG.siteName
      ? title
      : `${title} | ${DEFAULT_CONFIG.siteName}`;

  const fullUrl = url
    ? `${DEFAULT_CONFIG.siteUrl}${url}`
    : DEFAULT_CONFIG.siteUrl;
  const ogImage = image || DEFAULT_CONFIG.defaultImage;
  const fullImageUrl = ogImage.startsWith('http')
    ? ogImage
    : `${DEFAULT_CONFIG.siteUrl}${ogImage}`;

  const allKeywords = [...keywords, ...tags];

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: allKeywords.length > 0 ? allKeywords.join(', ') : undefined,
    authors: author ? [{ name: author }] : undefined,
    category,

    // Open Graph
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: DEFAULT_CONFIG.siteName,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'zh_CN',
      type: type === 'article' ? 'article' : 'website',
      ...(type === 'article' &&
        publishedTime && {
          publishedTime,
          modifiedTime,
          authors: author ? [author] : undefined,
          tags,
        }),
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullImageUrl],
      creator: DEFAULT_CONFIG.twitterHandle,
      site: DEFAULT_CONFIG.twitterHandle,
    },

    // Additional meta tags
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Verification and other meta tags
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION,
    },
  };

  return metadata;
}

export function generateArticleMetadata(post: {
  title: string;
  excerpt?: string | null;
  content: string;
  slug: string;
  publishedAt?: Date | null;
  updatedAt: Date;
  category?: { name: string } | null;
}) {
  // Generate description from excerpt or content
  const description =
    post.excerpt ||
    post.content.slice(0, 160).replace(/\n/g, ' ').trim() + '...';

  // Extract keywords from content (simple implementation)
  const contentKeywords = extractKeywords(post.content);

  return generateMetadata({
    title: post.title,
    description,
    keywords: contentKeywords,
    url: `/posts/${post.slug}`,
    type: 'article',
    publishedTime: post.publishedAt?.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
    category: post.category?.name,
  });
}

function extractKeywords(content: string, maxKeywords: number = 10): string[] {
  // Simple keyword extraction - in production, you might want to use a more sophisticated approach
  const words = content
    .toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fff]/g, '') // Keep Chinese characters and alphanumeric
    .split(/\s+/)
    .filter((word) => word.length > 2); // Filter out short words

  // Count word frequency
  const wordCount: Record<string, number> = {};
  words.forEach((word) => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  // Get most frequent words
  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${DEFAULT_CONFIG.siteUrl}${item.url}`,
    })),
  };
}

export function generateArticleJsonLd(post: {
  title: string;
  excerpt?: string | null;
  content: string;
  slug: string;
  publishedAt?: Date | null;
  updatedAt: Date;
  category?: { name: string } | null;
}) {
  const description =
    post.excerpt ||
    post.content.slice(0, 160).replace(/\n/g, ' ').trim() + '...';

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description,
    image: `${DEFAULT_CONFIG.siteUrl}/og-image.jpg`,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: '博客作者',
    },
    publisher: {
      '@type': 'Organization',
      name: DEFAULT_CONFIG.siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${DEFAULT_CONFIG.siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${DEFAULT_CONFIG.siteUrl}/posts/${post.slug}`,
    },
    articleSection: post.category?.name,
  };
}
