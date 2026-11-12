import { morningOgImage, siteOgImage, withOgCache } from '@/lib/og/card';
import { loadMorningCard, morningCountryFromQuery } from '@/lib/og/morning';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const country = morningCountryFromQuery(new URL(request.url).searchParams.get('country') ?? undefined);

  if (!country) {
    return siteOgImage();
  }

  try {
    const card = await loadMorningCard(country);
    return withOgCache(morningOgImage(card), card.open !== null);
  } catch (error) {
    console.error('Error generating morning OG image:', error);
    return withOgCache(siteOgImage(), false);
  }
}
