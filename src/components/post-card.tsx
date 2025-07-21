import Link from "next/link";
import { formatDate } from "@/lib/utils";

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
    <article className="border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
        {post.publishedAt && (
          <time>{formatDate(new Date(post.publishedAt))}</time>
        )}
        {post.category && (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {post.category.name}
          </span>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-3">
        <Link
          href={`/posts/${post.slug}`}
          className="hover:text-blue-600 transition-colors"
        >
          {post.title}
        </Link>
      </h2>

      {post.excerpt && (
        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
      )}

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
    </article>
  );
}
