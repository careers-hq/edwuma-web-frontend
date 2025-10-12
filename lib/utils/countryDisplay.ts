/**
 * Country Display Utilities
 * Utilities for displaying country information without relying on flag emojis
 * which don't render properly on all devices
 */

export interface CountryInfo {
  code: string; // ISO 2-letter code (e.g., 'GH', 'NG')
  name: string;
  region: 'west-africa' | 'east-africa' | 'southern-africa' | 'north-africa' | 'central-africa' | 'diaspora';
}

export const AFRICAN_COUNTRIES: Record<string, CountryInfo> = {
  GH: { code: 'GH', name: 'Ghana', region: 'west-africa' },
  NG: { code: 'NG', name: 'Nigeria', region: 'west-africa' },
  KE: { code: 'KE', name: 'Kenya', region: 'east-africa' },
  ZA: { code: 'ZA', name: 'South Africa', region: 'southern-africa' },
  EG: { code: 'EG', name: 'Egypt', region: 'north-africa' },
  ET: { code: 'ET', name: 'Ethiopia', region: 'east-africa' },
  TZ: { code: 'TZ', name: 'Tanzania', region: 'east-africa' },
  UG: { code: 'UG', name: 'Uganda', region: 'east-africa' },
  RW: { code: 'RW', name: 'Rwanda', region: 'east-africa' },
  SN: { code: 'SN', name: 'Senegal', region: 'west-africa' },
  CI: { code: 'CI', name: "Côte d'Ivoire", region: 'west-africa' },
  CM: { code: 'CM', name: 'Cameroon', region: 'central-africa' },
  MA: { code: 'MA', name: 'Morocco', region: 'north-africa' },
  TN: { code: 'TN', name: 'Tunisia', region: 'north-africa' },
  BW: { code: 'BW', name: 'Botswana', region: 'southern-africa' },
  ZW: { code: 'ZW', name: 'Zimbabwe', region: 'southern-africa' },
  MU: { code: 'MU', name: 'Mauritius', region: 'east-africa' },
  // Add more as needed
};

/**
 * Get country name from ISO code
 * Fallback to code if not found
 */
export function getCountryName(code: string): string {
  const country = AFRICAN_COUNTRIES[code.toUpperCase()];
  return country ? country.name : code;
}

/**
 * Get region emoji (universal globe emojis work on all devices)
 */
export function getRegionEmoji(region: string): string {
  const emojis: Record<string, string> = {
    'west-africa': '🌍',
    'east-africa': '🌍',
    'southern-africa': '🌍',
    'north-africa': '🌍',
    'central-africa': '🌍',
    'diaspora': '🌎',
  };
  return emojis[region] || '🌍';
}

/**
 * Get country display with emoji (avoids flag emojis)
 */
export function getCountryDisplay(code: string): {
  name: string;
  emoji: string;
  region: string;
} {
  const country = AFRICAN_COUNTRIES[code.toUpperCase()];
  if (country) {
    return {
      name: country.name,
      emoji: getRegionEmoji(country.region),
      region: country.region,
    };
  }
  
  // Fallback
  return {
    name: code,
    emoji: '🌍',
    region: 'unknown',
  };
}

/**
 * Format country code to flag emoji (for devices that support it)
 * Use with caution - prefer getCountryDisplay() for better compatibility
 */
export function codeToFlagEmoji(code: string): string {
  // Convert ISO code to regional indicator symbols
  // Note: This will show as 2-letter codes on devices without flag emoji support
  const codePoints = code
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

/**
 * Check if device supports flag emojis
 */
export function supportsFlagEmojis(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;
    
    ctx.fillText('🇬🇭', 0, 0);
    const imageData = ctx.getImageData(0, 0, 1, 1).data;
    
    // If all pixels are 0, emoji not supported
    return imageData.some(pixel => pixel !== 0);
  } catch {
    return false;
  }
}

/**
 * Get flag image URL from Flagcdn.com
 * @param code ISO 2-letter country code (e.g., 'GH', 'NG')
 * @param width Width in pixels (20, 40, 80, 160, 320, 640, 1280, 2560)
 * @returns Flag image URL
 */
export function getFlagImageUrl(code: string, width: 20 | 40 | 80 | 160 | 320 | 640 | 1280 | 2560 = 40): string {
  const lowerCode = code.toLowerCase();
  return `https://flagcdn.com/w${width}/${lowerCode}.png`;
}

/**
 * Get flag image URLs with srcSet for retina displays
 * @param code ISO 2-letter country code
 * @param baseWidth Base width in pixels
 * @returns Object with src and srcSet
 */
export function getFlagImageSrcSet(code: string, baseWidth: 20 | 40 | 80 | 160 = 20): {
  src: string;
  srcSet: string;
  width: number;
  alt: string;
} {
  const lowerCode = code.toLowerCase();
  const countryName = getCountryName(code);
  const retinaWidth = (baseWidth * 2) as 40 | 80 | 160 | 320;
  
  return {
    src: `https://flagcdn.com/w${baseWidth}/${lowerCode}.png`,
    srcSet: `https://flagcdn.com/w${retinaWidth}/${lowerCode}.png 2x`,
    width: baseWidth,
    alt: `${countryName} flag`,
  };
}

/**
 * Get circular flag image URL (using Hatscripts Circle Flags)
 * Good alternative for circular/rounded flags
 */
export function getCircleFlagUrl(code: string): string {
  const lowerCode = code.toLowerCase();
  return `https://hatscripts.github.io/circle-flags/flags/${lowerCode}.svg`;
}

