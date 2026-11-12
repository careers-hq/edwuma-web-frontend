import { morningOgImage, siteOgImage } from '@/lib/og/card';
import { loadMorningCard, morningCountryFromQuery } from '@/lib/og/morning';

export async function GET(request: Request) {
  const country = morningCountryFromQuery(new URL(request.url).searchParams.get('country') ?? undefined);

  if (!country) {
    return siteOgImage();
  }

  try {
    const card = await loadMorningCard(country);
    const image = morningOgImage(card);
    image.headers.set('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
    return image;
  } catch (error) {
    console.error('Error generating morning OG image:', error);
    return siteOgImage();
  }
}
