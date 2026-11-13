'use client';

import { BlogPostForm } from '@/components/admin/BlogPostForm';
import { AdminPageHeader } from '@/components/admin/AdminChrome';

export default function NewBlogPostPage() {
  return (
    <div>
      <AdminPageHeader title="New post" />
      <BlogPostForm />
    </div>
  );
}
