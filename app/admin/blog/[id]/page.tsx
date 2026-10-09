'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { BlogPostForm } from '@/components/admin/BlogPostForm';
import { AdminError, AdminPageHeader } from '@/components/admin/AdminChrome';
import { adminService, getApiErrorMessage } from '@/lib/api/admin';
import type { BlogPost } from '@/lib/api/blog';

export default function EditBlogPostPage() {
  const params = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = params.id;
    if (!id) return;

    let cancelled = false;
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const loaded = await adminService.getBlogPost(id);
        if (!cancelled) setPost(loaded);
      } catch (loadError) {
        if (!cancelled) setError(getApiErrorMessage(loadError, 'Unable to load this post.'));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  return (
    <div>
      <AdminPageHeader title={post ? `Edit ${post.title}` : 'Edit post'} description="Update the post and save it as a draft or publish it." />
      {error ? <AdminError message={error} /> : null}
      {isLoading ? <p className="text-sm text-[rgba(0,0,0,0.6)]">Loading post…</p> : null}
      {post ? <BlogPostForm key={post.id} post={post} /> : null}
    </div>
  );
}
