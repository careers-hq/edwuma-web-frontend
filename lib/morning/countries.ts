export const MORNING_COUNTRIES = [
  { slug: 'ghana', name: 'Ghana', places: 'Accra, Kumasi' },
  { slug: 'nigeria', name: 'Nigeria', places: 'Lagos, Abuja' },
  { slug: 'kenya', name: 'Kenya', places: 'Nairobi' },
  { slug: 'south-africa', name: 'South Africa', places: 'Cape Town, Johannesburg' },
] as const;

export type MorningCountrySlug = (typeof MORNING_COUNTRIES)[number]['slug'];

export type MorningCountry = (typeof MORNING_COUNTRIES)[number];

export const CALLING_CODES: Record<MorningCountrySlug, { iso: string; dial: string; example: string }> = {
  ghana: { iso: 'GH', dial: '233', example: '24 123 4567' },
  nigeria: { iso: 'NG', dial: '234', example: '802 123 4567' },
  kenya: { iso: 'KE', dial: '254', example: '712 345 678' },
  'south-africa': { iso: 'ZA', dial: '27', example: '82 123 4567' },
};

export function morningCountry(value: string | null | undefined): MorningCountry | null {
  if (!value) {
    return null;
  }

  const key = value.trim().toLowerCase();

  return MORNING_COUNTRIES.find((country) => country.slug === key || country.name.toLowerCase() === key) ?? null;
}
