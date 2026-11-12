import type { Metadata } from 'next';
import { getApiUrl } from '@/lib/api/config';
import { morningCountry, type MorningCountry, type MorningCountrySlug } from '@/lib/morning/countries';
import { jobShareTitle } from '@/lib/og/job';

export type MorningCardJob = {
  title: string;
  company: string | null;
  detail: string | null;
};

export type MorningCard = {
  slug: MorningCountrySlug;
  name: string;
  open: number | null;
  jobs: MorningCardJob[];
};

function clip(value: string, max: number): string {
  const text = value.replace(/\s+/g, ' ').trim();
  if (text.length <= max) {
    return text;
  }

  return `${text.slice(0, max - 1).trim()}…`;
}

function cityOf(place: string | null, countryName: string): string | null {
  if (!place) {
    return null;
  }

  const city = place.split(',')[0]?.trim() || null;
  if (!city || city.toLowerCase() === countryName.toLowerCase()) {
    return null;
  }

  return city;
}

function cardJob(
  title: string,
  company: string | null,
  place: string | null,
  countryName: string,
): MorningCardJob {
  const role = jobShareTitle(title, company);
  const city = cityOf(place, countryName);
  const companyOnTitle = company ? role.toLowerCase().includes(company.toLowerCase()) : false;
  const detail = [companyOnTitle ? null : company, city].filter(Boolean).join(' · ');

  return {
    title: clip(role, 46),
    company: company ? clip(company, 48) : null,
    detail: detail ? clip(detail, 52) : null,
  };
}

export function morningTitle(card: MorningCard): string {
  if (card.open === null) {
    return `Jobs open in ${card.name} today`;
  }

  if (card.open <= 0) {
    return `Nothing open in ${card.name}`;
  }

  if (card.open === 1) {
    return `1 open in ${card.name}`;
  }

  return `${card.open} open in ${card.name}`;
}

export function morningDescription(card: MorningCard): string {
  const tail = 'No fee. One link to apply.';
  const lines = card.jobs.slice(0, 2).map((job) => {
    if (!job.company || job.title.toLowerCase().includes(job.company.toLowerCase())) {
      return job.title;
    }

    return `${job.title} at ${job.company}`;
  });

  if (lines.length === 0) {
    return `A short list of open jobs in ${card.name}. ${tail}`;
  }

  return `${lines.join('. ')}. ${tail}`;
}

export async function loadMorningCard(country: MorningCountry): Promise<MorningCard> {
  const base: MorningCard = {
    slug: country.slug,
    name: country.name,
    open: null,
    jobs: [],
  };

  try {
    const url = new URL(`${getApiUrl()}/api/v1/jobs/morning-list`);
    url.searchParams.set('country', country.slug);
    url.searchParams.set('per_page', '2');

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(12000),
    });

    if (!response.ok) {
      console.error('Morning list for share image failed:', response.status, url.pathname);
      return base;
    }

    const body = (await response.json()) as {
      data?: {
        open?: unknown;
        jobs?: { title?: unknown; company?: unknown; place?: unknown }[];
      };
    };
    const open = body.data?.open;
    const jobs = Array.isArray(body.data?.jobs) ? body.data.jobs : [];

    return {
      ...base,
      open: typeof open === 'number' ? open : null,
      jobs: jobs.slice(0, 2).flatMap((job) => {
        if (typeof job.title !== 'string' || job.title.trim() === '') {
          return [];
        }

        return [
          cardJob(
            job.title,
            typeof job.company === 'string' ? job.company : null,
            typeof job.place === 'string' ? job.place : null,
            country.name,
          ),
        ];
      }),
    };
  } catch (error) {
    console.error('Morning list for share image failed:', error);
    return base;
  }
}

export async function morningShareMetadata(country: MorningCountry): Promise<Metadata> {
  const card = await loadMorningCard(country);
  const title = morningTitle(card);
  const countryDescription = morningDescription(card);
  const image = `/api/og?country=${country.slug}`;
  const path = `/${country.slug}`;

  return {
    title: { absolute: `${title} | Edwuma` },
    description: countryDescription,
    openGraph: {
      title,
      description: countryDescription,
      url: path,
      siteName: 'Edwuma',
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: countryDescription,
      images: [image],
    },
    alternates: {
      canonical: path,
    },
  };
}

export function morningCountryFromQuery(value: string | string[] | undefined): MorningCountry | null {
  const slug = Array.isArray(value) ? value[0] : value;
  return morningCountry(slug);
}
