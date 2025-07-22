import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    publishedAt: Date | null;
    category: {
      name: string;
      slug: string;
    } | null;
    tags: {
      tag: {
        name: string;
        slug: string;
      };
    }[];
  };
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200 group">
      <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
        {post.publishedAt && (
          <time className="flex items-center gap-1">
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

      <h2 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
        <Link
          href={`/posts/${post.slug}`}
          className="hover:text-blue-600 transition-colors"
        >
          {post.title}
        </Link>
      </h2>

      {post.excerpt && (
        <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>
      )}

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          {post.tags.map(({ tag }) => (
            <span
              key={tag.slug}
              className="bg-gray-50 text-gray-600 px-2 py-1 rounded-md text-xs font-medium hover:bg-gray-100 transition-colors"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
