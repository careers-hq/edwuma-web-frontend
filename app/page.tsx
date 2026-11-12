import type { Metadata } from 'next';
import HomeShell from '@/components/home/HomeShell';
import { morningCountryFromQuery, morningShareMetadata } from '@/lib/og/morning';

const description =
  'A short list of open jobs in Ghana, Nigeria, Kenya, and South Africa. No fee. One link to apply.';

const homeMetadata: Metadata = {
  title: {
    absolute: 'Jobs you can apply to today | Edwuma',
  },
  description,
  openGraph: {
    title: 'Jobs you can apply to today | Edwuma',
    description,
    url: '/',
    siteName: 'Edwuma',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jobs you can apply to today | Edwuma',
    description,
  },
  alternates: {
    canonical: '/',
  },
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ country?: string | string[] }>;
}): Promise<Metadata> {
  const country = morningCountryFromQuery((await searchParams).country);
  if (!country) {
    return homeMetadata;
  }

  return morningShareMetadata(country);
}

export default function HomePage() {
  return <HomeShell />;
}
