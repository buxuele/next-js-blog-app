import { PostEditor } from '@/components/post-editor';

export default function NewPostPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">创建新文章</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <PostEditor />
      </div>
    </div>
  );
}
