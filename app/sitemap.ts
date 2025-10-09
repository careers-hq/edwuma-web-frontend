/**
 * Dynamic Sitemap Generation
 * Generates XML sitemap for SEO optimization
 */

import { MetadataRoute } from 'next';
import { jobsApiService } from '@/lib/api/jobs';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://edwuma.com';
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/auth/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  try {
    // Fetch recent jobs for sitemap (limit to 1000 most recent)
    const jobsResponse = await jobsApiService.searchJobs({
      page: 1,
      per_page: 1000,
      status: 'active',
      sort_by: 'created_at',
      sort_direction: 'desc',
    });

    const jobPages: MetadataRoute.Sitemap = jobsResponse.data.jobs.map((job) => ({
      url: `${baseUrl}/jobs/${job.slug}`,
      lastModified: new Date(job.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Extract unique countries for location pages
    const uniqueCountries = new Set<string>();
    const uniqueCities = new Set<string>();
    
    jobsResponse.data.jobs.forEach((job) => {
      job.locations.forEach((location) => {
        uniqueCountries.add(location.country.toLowerCase().replace(/\s+/g, '-'));
        uniqueCities.add(`${location.country.toLowerCase().replace(/\s+/g, '-')}/${location.city.toLowerCase().replace(/\s+/g, '-')}`);
      });
    });

    // Location pages
    const locationPages: MetadataRoute.Sitemap = [
      ...Array.from(uniqueCountries).map((country) => ({
        url: `${baseUrl}/locations/${country}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      })),
      ...Array.from(uniqueCities).slice(0, 100).map((cityPath) => ({
        url: `${baseUrl}/locations/${cityPath}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.7,
      })),
    ];

    // Extract unique categories
    const uniqueCategories = new Set<string>();
    jobsResponse.data.jobs.forEach((job) => {
      job.categories.forEach((category) => {
        uniqueCategories.add(category.name.toLowerCase().replace(/\s+/g, '-'));
      });
    });

    const categoryPages: MetadataRoute.Sitemap = Array.from(uniqueCategories).map((category) => ({
      url: `${baseUrl}/categories/${category}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }));

    // Extract unique companies
    const uniqueCompanies = new Set<string>();
    jobsResponse.data.jobs.forEach((job) => {
      job.companies.forEach((company) => {
        uniqueCompanies.add(company.id);
      });
    });

    const companyPages: MetadataRoute.Sitemap = Array.from(uniqueCompanies).slice(0, 100).map((companyId) => ({
      url: `${baseUrl}/companies/${companyId}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [
      ...staticPages,
      ...jobPages,
      ...locationPages,
      ...categoryPages,
      ...companyPages,
    ];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return at least the static pages if dynamic content fails
    return staticPages;
  }
}

