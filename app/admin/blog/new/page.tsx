'use client';

import { BlogPostForm } from '@/components/admin/BlogPostForm';
import { AdminPageHeader } from '@/components/admin/AdminChrome';

export default function NewBlogPostPage() {
  return (
    <div>
      <AdminPageHeader
        title="New post"
        description="Drafts stay off the public blog until you publish them."
      />
      <BlogPostForm />
    </div>
  );
}
