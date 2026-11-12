import type { BlogPost } from '@/lib/api/blog';
import { blogCoverImage } from '@/lib/blog/covers';

function publisher(baseUrl: string) {
  return {
    '@type': 'Organization',
    name: 'Edwuma',
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/icon-512.png`,
    },
  };
}

function coverImage(post: BlogPost, baseUrl: string) {
  const image = blogCoverImage(post.slug, post.cover_image_url, post.title, baseUrl);
  if (!image) {
    return undefined;
  }

  return {
    '@type': 'ImageObject',
    url: image.url,
    width: image.width,
    height: image.height,
  };
}

export function BlogPostingSchema({ post, baseUrl }: { post: BlogPost; baseUrl: string }) {
  const url = `${baseUrl}/blog/${post.slug}`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: coverImage(post, baseUrl),
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at ?? post.published_at ?? undefined,
    author: {
      '@type': 'Organization',
      name: post.author.name,
      url: baseUrl,
    },
    publisher: publisher(baseUrl),
    mainEntityOfPage: url,
    articleSection: post.category,
    keywords: post.tags.join(', '),
    url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BlogListingSchema({
  posts,
  url,
  name,
  description,
  baseUrl,
}: {
  posts: BlogPost[];
  url: string;
  name: string;
  description: string;
  baseUrl: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name,
    description,
    url,
    publisher: publisher(baseUrl),
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      url: `${baseUrl}/blog/${post.slug}`,
      image: coverImage(post, baseUrl),
      datePublished: post.published_at ?? undefined,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
