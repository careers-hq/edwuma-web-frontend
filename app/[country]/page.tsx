import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HomeShell from '@/components/home/HomeShell';
import { MORNING_COUNTRIES, morningCountry } from '@/lib/morning/countries';
import { morningShareMetadata } from '@/lib/og/morning';

export const dynamicParams = false;

export function generateStaticParams() {
  return MORNING_COUNTRIES.map((country) => ({ country: country.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const country = morningCountry((await params).country);
  if (!country) {
    return {};
  }

  return morningShareMetadata(country);
}

export default async function CountryHome({ params }: { params: Promise<{ country: string }> }) {
  const country = morningCountry((await params).country);
  if (!country) {
    notFound();
  }

  return <HomeShell country={country.slug} />;
}
