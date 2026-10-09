import type { Metadata } from 'next';
import Link from 'next/link';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BlogCover from '@/components/blog/BlogCover';
import AuthorAvatar from '@/components/blog/AuthorAvatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { blogService } from '@/lib/api/blog';
import type { BlogPost } from '@/lib/api/blog';
import { formatDate } from '@/lib/utils';

interface BlogArticlePageProps {
  params: Promise<{ slug: string }>;
}

function isNotFound(error: unknown): boolean {
  return Boolean(error && typeof error === 'object' && 'status' in error && error.status === 404);
}

const loadPost = cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    const response = await blogService.getPost(slug);
    return response.data;
  } catch (error) {
    if (isNotFound(error)) {
      return null;
    }

    throw error;
  }
});

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadPost(slug);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://edwuma.com';

  if (!post) {
    return {
      title: 'Article not found',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: {
      absolute: `${post.title} | Edwuma`,
    },
    description: post.excerpt,
    keywords: [post.category, ...post.tags],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `${baseUrl}/blog/${post.slug}`,
      siteName: 'Edwuma',
    },
    alternates: {
      canonical: `${baseUrl}/blog/${post.slug}`,
    },
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const post = await loadPost(slug);

  if (!post) {
    notFound();
  }

  let related: BlogPost[] = [];

  try {
    const relatedResponse = await blogService.listPosts({
      category: post.category,
      per_page: 4,
    });
    related = relatedResponse.data.posts.filter((item) => item.slug !== post.slug).slice(0, 3);
  } catch (error) {
    console.error('Failed to load related articles:', error);
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/blog" className="text-sm font-medium text-[#244034] hover:underline">
          Back to articles
        </Link>

        <article className="mt-6">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="secondary">{post.category}</Badge>
            <span className="text-sm text-[rgba(0,0,0,0.7)]">{post.read_time}</span>
            {post.published_at && (
              <time dateTime={post.published_at} className="text-sm text-[rgba(0,0,0,0.7)]">
                {formatDate(post.published_at)}
              </time>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-[#244034] font-['Gordita'] mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 mb-8">
            <AuthorAvatar name={post.author.name} avatarUrl={post.author.avatar_url} />
            <p className="text-sm font-medium text-[#244034]">{post.author.name}</p>
          </div>

          <BlogCover
            title={post.title}
            category={post.category}
            imageUrl={post.cover_image_url}
            className="h-56 md:h-80 rounded-xl mb-8"
          />

          <p className="text-lg text-[rgba(0,0,0,0.75)] leading-relaxed mb-8">
            {post.excerpt}
          </p>

          {post.content && (
            <div
              className="text-[rgba(0,0,0,0.8)] leading-relaxed [&_p]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#244034] [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#244034] [&_h3]:mt-6 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-2 [&_a]:text-[#244034] [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-[#d2f34c] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10">
              {post.tags.map((tag) => (
                <Link key={tag} href={`/blog?search=${encodeURIComponent(tag)}`}>
                  <Badge variant="secondary" size="sm">{tag}</Badge>
                </Link>
              ))}
            </div>
          )}
        </article>

        {related.length > 0 && (
          <section className="mt-16 border-t border-gray-200 pt-10">
            <h2 className="text-2xl font-bold text-[#244034] mb-6">More in {post.category}</h2>
            <div className="space-y-4">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/blog/${item.slug}`}
                  className="block rounded-lg border border-gray-200 p-4 hover:border-[#244034]"
                >
                  <p className="text-xs text-[rgba(0,0,0,0.6)] mb-1">{item.read_time}</p>
                  <h3 className="font-semibold text-[#244034]">{item.title}</h3>
                  <p className="text-sm text-[rgba(0,0,0,0.7)] mt-1 line-clamp-2">{item.excerpt}</p>
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <Link href={`/blog?category=${encodeURIComponent(post.category)}`}>
                <Button variant="outline">View all {post.category}</Button>
              </Link>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
