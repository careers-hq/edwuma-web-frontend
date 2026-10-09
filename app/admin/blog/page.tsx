'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { AdminError, AdminPageHeader, AdminPagination } from '@/components/admin/AdminChrome';
import { adminService, getApiErrorMessage } from '@/lib/api/admin';
import type { BlogPagination, BlogPost } from '@/lib/api/blog';
import { formatDate } from '@/lib/utils';

const STATUS_OPTIONS = [
  { value: '', label: 'All posts' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Drafts' },
];

export default function AdminBlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState<BlogPagination | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await adminService.listBlogPosts({
        search: appliedSearch,
        status: status ? (status as 'draft' | 'published') : undefined,
        page,
        per_page: 15,
      });
      setPosts(result.posts);
      setPagination(result.pagination);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError, 'Unable to load blog posts.'));
    } finally {
      setIsLoading(false);
    }
  }, [appliedSearch, page, status]);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  const handleDelete = async (post: BlogPost) => {
    if (!window.confirm(`Delete “${post.title}”? This cannot be undone.`)) return;

    try {
      setDeletingId(post.id);
      await adminService.deleteBlogPost(post.id);
      toast.success('Post deleted.');
      await loadPosts();
    } catch (deleteError) {
      toast.error(getApiErrorMessage(deleteError, 'Unable to delete this post.'));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Blog"
        description="Write drafts, publish posts, and remove anything that should not stay live."
        action={
          <Button onClick={() => router.push('/admin/blog/new')}>New post</Button>
        }
      />

      <Card className="mb-6">
        <CardContent className="p-6">
          <form
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
            onSubmit={(event) => {
              event.preventDefault();
              setPage(1);
              setAppliedSearch(search.trim());
            }}
          >
            <div className="md:col-span-2">
              <Input
                label="Search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Title or excerpt"
              />
            </div>
            <Select
              label="Status"
              value={status}
              options={STATUS_OPTIONS}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
            />
            <div>
              <Button type="submit">Search</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {error ? <AdminError message={error} onRetry={loadPosts} /> : null}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-[#f8fafc] text-xs uppercase tracking-wide text-[rgba(0,0,0,0.55)]">
                <tr>
                  <th className="px-6 py-3 font-medium">Post</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Published</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-[rgba(0,0,0,0.6)]">
                      Loading posts…
                    </td>
                  </tr>
                ) : posts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-[rgba(0,0,0,0.6)]">
                      No posts match these filters.
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr key={post.id} className="border-b border-gray-100 last:border-0">
                      <td className="px-6 py-4">
                        <p className="font-medium text-[#244034]">{post.title}</p>
                        <p className="text-[rgba(0,0,0,0.6)]">
                          {post.category}
                          {post.is_featured ? ' · Featured' : ''}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={post.status === 'published' ? 'success' : 'warning'} size="sm" className="capitalize">
                          {post.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-[rgba(0,0,0,0.7)]">
                        {post.published_at ? formatDate(post.published_at) : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" onClick={() => router.push(`/admin/blog/${post.id}`)}>
                            Edit
                          </Button>
                          {post.status === 'published' ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`/blog/${post.slug}`, '_blank', 'noopener,noreferrer')}
                            >
                              View
                            </Button>
                          ) : null}
                          <Button
                            variant="ghost"
                            size="sm"
                            loading={deletingId === post.id}
                            onClick={() => void handleDelete(post)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {pagination ? (
            <div className="px-6 pb-6">
              <AdminPagination
                page={pagination.current_page}
                lastPage={pagination.last_page}
                total={pagination.total}
                onPageChange={setPage}
              />
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
