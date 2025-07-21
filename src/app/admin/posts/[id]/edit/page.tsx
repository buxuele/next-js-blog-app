import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { PostEditor } from '@/components/post-editor';

async function getPost(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    return post;
  } catch (error) {
    return null;
  }
}

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">编辑文章</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <PostEditor
          postId={post.id}
          initialData={{
            title: post.title,
            content: post.content,
            excerpt: post.excerpt || '',
            published: post.published,
            categoryId: post.categoryId,
            tags: post.tags,
          }}
        />
      </div>
    </div>
  );
}
