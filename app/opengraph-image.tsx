import { ogSize, siteOgImage } from '@/lib/og/card';

export const alt = 'Jobs you can apply to today';
export const size = ogSize;
export const contentType = 'image/png';

export default function Image() {
  return siteOgImage();
}
