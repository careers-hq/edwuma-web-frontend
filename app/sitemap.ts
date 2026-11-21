/**
 * Dynamic Sitemap Generation
 * Lists the public pages the site serves now.
 */

import { MetadataRoute } from 'next';
import { jobsApiService } from '@/lib/api/jobs';
import { blogService } from '@/lib/api/blog';
import { blogCoverSrc } from '@/lib/blog/covers';
import { MORNING_COUNTRIES } from '@/lib/morning/countries';

export const dynamic = 'force-dynamic';

function dated(value: string | null | undefined): Date {
  if (!value) {
    return new Date();
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://edwuma.com';

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/blog`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/help`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/faq`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/terms`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/cookies`, changeFrequency: 'yearly', priority: 0.3 },
  ].map((page) => ({ ...page, lastModified: new Date() }));

  const countryPages: MetadataRoute.Sitemap = MORNING_COUNTRIES.map((country) => ({
    url: `${baseUrl}/${country.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  let jobPages: MetadataRoute.Sitemap = [];
  let blogPages: MetadataRoute.Sitemap = [];

  try {
    const jobsResponse = await jobsApiService.searchJobs({
      page: 1,
      per_page: 100,
      status: 'active',
      sort_by: 'posted_at',
      sort_direction: 'desc',
    });

    const jobs = Array.isArray(jobsResponse.data?.jobs) ? jobsResponse.data.jobs : [];

    jobPages = jobs.flatMap((job) => {
      if (!job.slug) {
        return [];
      }

      return [{
        url: `${baseUrl}/jobs/${job.slug}`,
        lastModified: dated(job.timing?.posted_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }];
    });
  } catch (error) {
    console.error('Error adding jobs to sitemap:', error);
  }

  try {
    const blogResponse = await blogService.listPosts({ per_page: 50 });
    const posts = Array.isArray(blogResponse.data?.posts) ? blogResponse.data.posts : [];

    blogPages = posts.flatMap((post) => {
      if (!post.slug || (post.status && post.status !== 'published')) {
        return [];
      }

      const cover = blogCoverSrc(post.slug, post.cover_image_url);

      return [{
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: dated(post.updated_at ?? post.published_at),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
        images: cover ? [cover.startsWith('http') ? cover : `${baseUrl}${cover}`] : undefined,
      }];
    });
  } catch (error) {
    console.error('Error adding blog posts to sitemap:', error);
  }

  return [
    ...staticPages,
    ...countryPages,
    ...blogPages,
    ...jobPages,
  ];
}
