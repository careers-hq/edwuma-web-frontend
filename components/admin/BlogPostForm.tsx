'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { adminService, getApiErrorMessage, type AdminBlogPayload } from '@/lib/api/admin';
import type { BlogPost } from '@/lib/api/blog';

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
];

interface BlogPostFormProps {
  post?: BlogPost;
}

export function BlogPostForm({ post }: BlogPostFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState(post?.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const [category, setCategory] = useState(post?.category ?? '');
  const [tags, setTags] = useState(post?.tags?.join(', ') ?? '');
  const [coverImageUrl, setCoverImageUrl] = useState(post?.cover_image_url ?? '');
  const [authorName, setAuthorName] = useState(post?.author?.name ?? '');
  const [status, setStatus] = useState<'draft' | 'published'>(post?.status ?? 'draft');
  const [isFeatured, setIsFeatured] = useState(post?.is_featured ?? false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload: AdminBlogPayload = {
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      category: category.trim(),
      status,
      is_featured: isFeatured,
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    if (slug.trim()) payload.slug = slug.trim();
    payload.cover_image_url = coverImageUrl.trim() || null;
    payload.author_name = authorName.trim() || null;

    try {
      setIsSaving(true);
      const saved = post
        ? await adminService.updateBlogPost(post.id, payload)
        : await adminService.createBlogPost(payload);
      toast.success(post ? 'Post updated.' : 'Post created.');
      router.push(`/admin/blog/${saved.id}`);
      router.refresh();
    } catch (saveError) {
      toast.error(getApiErrorMessage(saveError, 'Unable to save this post.'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="Title" required value={title} onChange={(event) => setTitle(event.target.value)} />
            <Input
              label="Slug"
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder="Generated from the title if left blank"
              helperText="Lowercase letters, numbers, and hyphens."
            />
          </div>
          <div>
            <label htmlFor="excerpt" className="mb-2 block text-sm font-medium text-[#244034]">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              required
              maxLength={500}
              rows={3}
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-[rgba(0,0,0,0.7)] focus:border-[#244034] focus:outline-none focus:ring-2 focus:ring-[#244034]/20"
            />
          </div>
          <div>
            <label htmlFor="content" className="mb-2 block text-sm font-medium text-[#244034]">
              Content
            </label>
            <textarea
              id="content"
              required
              rows={16}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-[rgba(0,0,0,0.8)] focus:border-[#244034] focus:outline-none focus:ring-2 focus:ring-[#244034]/20"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="Category" required value={category} onChange={(event) => setCategory(event.target.value)} />
            <Input
              label="Tags"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder="careers, ghana, remote"
              helperText="Comma-separated, up to 10."
            />
            <Input
              label="Cover image URL"
              type="url"
              value={coverImageUrl}
              onChange={(event) => setCoverImageUrl(event.target.value)}
              placeholder="https://"
            />
            <Input
              label="Author name"
              value={authorName}
              onChange={(event) => setAuthorName(event.target.value)}
              placeholder="Shown on the post"
            />
            <Select
              label="Status"
              value={status}
              options={STATUS_OPTIONS}
              onChange={(event) => setStatus(event.target.value as 'draft' | 'published')}
            />
            <label className="mt-8 flex items-center gap-3 text-sm text-[#244034]">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(event) => setIsFeatured(event.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#244034] focus:ring-[#244034]"
              />
              Feature this post
            </label>
          </div>
          <div className="flex gap-3">
            <Button type="submit" loading={isSaving}>
              {post ? 'Save changes' : 'Create post'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push('/admin/blog')}>
              Back to posts
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
