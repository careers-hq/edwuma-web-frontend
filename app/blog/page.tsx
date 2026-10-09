import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BlogCover from '@/components/blog/BlogCover';
import AuthorAvatar from '@/components/blog/AuthorAvatar';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { blogService } from '@/lib/api/blog';
import type { BlogPost } from '@/lib/api/blog';
import { formatRelativeTime } from '@/lib/utils';

interface BlogPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
  }>;
}

function blogHref(filters: { search?: string; category?: string; page?: number }) {
  const query = new URLSearchParams();

  if (filters.search) {
    query.set('search', filters.search);
  }

  if (filters.category) {
    query.set('category', filters.category);
  }

  if (filters.page && filters.page > 1) {
    query.set('page', String(filters.page));
  }

  const qs = query.toString();
  return qs ? `/blog?${qs}` : '/blog';
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const search = params.search?.trim() || '';
  const category = params.category?.trim() || '';
  const page = Math.max(1, Number(params.page) || 1);

  let posts: BlogPost[] = [];
  let categories: string[] = [];
  let currentPage = page;
  let lastPage = 1;
  let loadError = false;

  try {
    const [postsResponse, categoriesResponse] = await Promise.all([
      blogService.listPosts({
        search: search || undefined,
        category: category || undefined,
        page,
        per_page: 12,
      }),
      blogService.listCategories(),
    ]);

    posts = postsResponse.data.posts;
    currentPage = postsResponse.data.pagination.current_page;
    lastPage = postsResponse.data.pagination.last_page;
    categories = categoriesResponse.data.categories;
  } catch (error) {
    console.error('Failed to load blog posts:', error);
    loadError = true;
  }

  const showFeatured = !search && !category && currentPage === 1;
  const featured = showFeatured ? posts.find((post) => post.is_featured) ?? null : null;
  const gridPosts = featured ? posts.filter((post) => post.id !== featured.id) : posts;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#244034] font-['Gordita'] mb-4">
            Career Insights & Tips
          </h1>
          <p className="text-lg text-[rgba(0,0,0,0.7)] max-w-2xl mx-auto">
            Stay updated with career advice, hiring trends, and job search guides for markets across Africa.
          </p>
        </div>

        <form method="get" action="/blog" className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="blog-search" className="sr-only">Search articles</label>
              <input
                id="blog-search"
                name="search"
                defaultValue={search}
                placeholder="Search articles..."
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:border-[#244034] focus:outline-none focus:ring-2 focus:ring-[#244034] focus:ring-opacity-20"
              />
            </div>
            <div className="md:w-64">
              <label htmlFor="blog-category" className="sr-only">Category</label>
              <select
                id="blog-category"
                name="category"
                defaultValue={category}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:border-[#244034] focus:outline-none focus:ring-2 focus:ring-[#244034] focus:ring-opacity-20"
              >
                <option value="">All Categories</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" variant="primary">
              Search
            </Button>
          </div>
        </form>

        {loadError ? (
          <div className="text-center py-16">
            <h2 className="text-lg font-medium text-[#244034] mb-2">Articles are unavailable right now</h2>
            <p className="text-[rgba(0,0,0,0.7)]">Refresh the page in a moment and try again.</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-lg font-medium text-[#244034] mb-2">No articles found</h2>
            <p className="text-[rgba(0,0,0,0.7)] mb-4">
              Try a different search, or browse every category.
            </p>
            <Link href="/blog">
              <Button variant="outline">Clear filters</Button>
            </Link>
          </div>
        ) : (
          <>
            {featured && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-[#244034] mb-6">Featured Article</h2>
                <Card className="overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/2">
                      <BlogCover
                        title={featured.title}
                        category={featured.category}
                        imageUrl={featured.cover_image_url}
                        className="h-64 md:h-full min-h-64"
                      />
                    </div>
                    <div className="md:w-1/2 p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge variant="secondary">{featured.category}</Badge>
                        <span className="text-sm text-[rgba(0,0,0,0.7)]">{featured.read_time}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-[#244034] mb-3">
                        <Link href={`/blog/${featured.slug}`} className="hover:underline">
                          {featured.title}
                        </Link>
                      </h3>
                      <p className="text-[rgba(0,0,0,0.7)] mb-4 leading-relaxed">
                        {featured.excerpt}
                      </p>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center space-x-3">
                          <AuthorAvatar name={featured.author.name} avatarUrl={featured.author.avatar_url} />
                          <div>
                            <p className="text-sm font-medium text-[#244034]">{featured.author.name}</p>
                            {featured.published_at && (
                              <p className="text-xs text-[rgba(0,0,0,0.7)]">
                                {formatRelativeTime(featured.published_at)}
                              </p>
                            )}
                          </div>
                        </div>
                        <Link href={`/blog/${featured.slug}`}>
                          <Button variant="primary">Read More</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {gridPosts.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#244034] mb-6">Latest Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gridPosts.map((post) => (
                    <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                      <BlogCover
                        title={post.title}
                        category={post.category}
                        imageUrl={post.cover_image_url}
                        className="h-48"
                      />
                      <CardContent className="p-6 flex flex-col flex-1">
                        <div className="flex items-center space-x-2 mb-3">
                          <Badge variant="secondary" size="sm">{post.category}</Badge>
                          <span className="text-xs text-[rgba(0,0,0,0.7)]">{post.read_time}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-[#244034] mb-2 line-clamp-2">
                          <Link href={`/blog/${post.slug}`} className="hover:underline">
                            {post.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-[rgba(0,0,0,0.7)] mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center space-x-2">
                            <AuthorAvatar name={post.author.name} avatarUrl={post.author.avatar_url} size="sm" />
                            <span className="text-xs text-[rgba(0,0,0,0.7)]">{post.author.name}</span>
                          </div>
                          {post.published_at && (
                            <span className="text-xs text-[rgba(0,0,0,0.7)]">
                              {formatRelativeTime(post.published_at)}
                            </span>
                          )}
                        </div>
                        <div className="mt-4">
                          <Link href={`/blog/${post.slug}`}>
                            <Button variant="outline" size="sm" className="w-full">
                              Read More
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {lastPage > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                {currentPage > 1 ? (
                  <Link href={blogHref({ search, category, page: currentPage - 1 })}>
                    <Button variant="outline">Previous</Button>
                  </Link>
                ) : (
                  <Button variant="outline" disabled>Previous</Button>
                )}
                <span className="text-sm text-[rgba(0,0,0,0.7)]">
                  Page {currentPage} of {lastPage}
                </span>
                {currentPage < lastPage ? (
                  <Link href={blogHref({ search, category, page: currentPage + 1 })}>
                    <Button variant="outline">Next</Button>
                  </Link>
                ) : (
                  <Button variant="outline" disabled>Next</Button>
                )}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
