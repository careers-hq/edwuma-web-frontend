// Geolocation service to detect user's country.
// The browser timezone is preferred over IP lookup, because VPNs and
// private relays often report a different country than where the user is.

/** Countries the job filters can apply. Other detections are ignored. */
const SUPPORTED_FILTER_COUNTRIES = new Set([
  'ghana',
  'nigeria',
  'kenya',
  'south-africa',
]);

/** IANA timezones for the countries users can filter by. */
const TIMEZONE_TO_COUNTRY: Record<string, string> = {
  'Africa/Accra': 'ghana',
  'Africa/Lagos': 'nigeria',
  'Africa/Nairobi': 'kenya',
  'Africa/Johannesburg': 'south-africa',
};

const SLUG_TO_COUNTRY: Record<string, { name: string; code: string }> = {
  ghana: { name: 'Ghana', code: 'GH' },
  nigeria: { name: 'Nigeria', code: 'NG' },
  kenya: { name: 'Kenya', code: 'KE' },
  'south-africa': { name: 'South Africa', code: 'ZA' },
};

const ISO_TO_SLUG: Record<string, string> = {
  GH: 'ghana',
  NG: 'nigeria',
  KE: 'kenya',
  ZA: 'south-africa',
};

const LOCATION_CACHE_KEY = 'user-location-v2';
const LEGACY_LOCATION_CACHE_KEY = 'user-location';

export interface GeolocationData {
  country: string;
  countryCode: string;
  region?: string;
  city?: string;
  timezone?: string;
  source?: 'vercel' | 'ipinfo' | 'ip-api' | string; // Which geolocation method was used
}

export interface GeolocationError {
  error: string;
  message: string;
}

class GeolocationService {
  private cache: Map<string, GeolocationData> = new Map();
  private resolvedLocation: GeolocationData | null = null;
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private readonly API_ENDPOINTS = [
    'https://ipinfo.io/json',
    'https://ipapi.co/json/',
    'https://ip-api.com/json/'
  ];

  /**
   * Get user's location data from IP address
   * Now uses internal API route for better Vercel compatibility
   */
  async getUserLocation(): Promise<GeolocationData | null> {
    try {
      // Check cache first
      const cached = this.getCachedLocation();
      if (cached) {
        return cached;
      }

      // Try internal API route first (uses Vercel headers)
      try {
        const response = await fetch('/api/geolocation', {
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.country) {
            this.cacheLocation(data);
            return data;
          }
        }
      } catch (apiError) {
        console.warn('Internal geolocation API failed:', apiError);
      }

      // Fallback to external APIs if internal route fails
      for (const endpoint of this.API_ENDPOINTS) {
        try {
          const data = await this.fetchFromService(endpoint);
          if (data) {
            this.cacheLocation(data);
            return data;
          }
        } catch (error) {
          console.warn(`Failed to fetch from ${endpoint}:`, error);
          continue;
        }
      }

      return null;
    } catch (error) {
      console.error('Geolocation service error:', error);
      return null;
    }
  }

  /**
   * Fetch location data from a specific service
   */
  private async fetchFromService(endpoint: string): Promise<GeolocationData | null> {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    // Normalize data from different services
    return this.normalizeLocationData(data, endpoint);
  }

  /**
   * Normalize location data from different API providers
   */
  private normalizeLocationData(data: Record<string, unknown>, endpoint: string): GeolocationData | null {
    try {
      // ipapi.co format
      if (endpoint.includes('ipapi.co')) {
        return {
          country: (data.country_name as string) || '',
          countryCode: (data.country_code as string) || '',
          region: (data.region as string) || '',
          city: (data.city as string) || '',
          timezone: (data.timezone as string) || ''
        };
      }

      // ipinfo.io format
      if (endpoint.includes('ipinfo.io')) {
        return {
          country: (data.country as string) || '',
          countryCode: (data.country as string) || '',
          region: (data.region as string) || '',
          city: (data.city as string) || '',
          timezone: (data.timezone as string) || ''
        };
      }

      // ip-api.com format
      if (endpoint.includes('ip-api.com')) {
        return {
          country: (data.country as string) || '',
          countryCode: (data.countryCode as string) || '',
          region: (data.regionName as string) || '',
          city: (data.city as string) || '',
          timezone: (data.timezone as string) || ''
        };
      }

      return null;
    } catch (error) {
      console.error('Error normalizing location data:', error);
      return null;
    }
  }

  /**
   * Get cached location data
   */
  private getCachedLocation(): GeolocationData | null {
    // Drop the previous cache so a stale IP result (for example United Kingdom)
    // is not reused after detection switched to the browser timezone.
    localStorage.removeItem(LEGACY_LOCATION_CACHE_KEY);

    const cached = localStorage.getItem(LOCATION_CACHE_KEY);
    if (!cached) return null;

    try {
      const data = JSON.parse(cached);
      const now = Date.now();
      
      // Check if cache is still valid
      if (data.timestamp && (now - data.timestamp) < this.CACHE_DURATION) {
        return data.location;
      }
      
      // Remove expired cache
      localStorage.removeItem(LOCATION_CACHE_KEY);
      return null;
    } catch (error) {
      console.error('Error reading cached location:', error);
      localStorage.removeItem(LOCATION_CACHE_KEY);
      return null;
    }
  }

  /**
   * Cache location data
   */
  private cacheLocation(data: GeolocationData): void {
    try {
      const cacheData = {
        location: data,
        timestamp: Date.now()
      };
      localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error caching location:', error);
    }
  }

  /**
   * Country slug for job filters.
   * Uses the browser timezone when it is available, because that follows the
   * computer's clock rather than the public IP. IP lookup is only used when
   * the timezone cannot be read, and only for countries the filters support.
   */
  async getCountryForFiltering(): Promise<string | null> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LEGACY_LOCATION_CACHE_KEY);
    }

    const timezone = this.getBrowserTimezone();
    if (timezone) {
      const slug = TIMEZONE_TO_COUNTRY[timezone] ?? null;
      this.resolvedLocation = slug ? this.locationFromSlug(slug, timezone) : null;
      return slug;
    }

    const location = await this.getUserLocation();
    if (!location?.countryCode) {
      this.resolvedLocation = null;
      return null;
    }

    const slug = ISO_TO_SLUG[location.countryCode.toUpperCase()] ?? null;
    if (!slug || !SUPPORTED_FILTER_COUNTRIES.has(slug)) {
      this.resolvedLocation = null;
      return null;
    }

    this.resolvedLocation = { ...location, source: location.source ?? 'ip' };
    return slug;
  }

  /**
   * Location resolved by the latest getCountryForFiltering call.
   */
  getResolvedLocation(): GeolocationData | null {
    return this.resolvedLocation;
  }

  /**
   * Browser IANA timezone. Returns null on the server so a hosted
   * machine's timezone is never treated as the visitor's location.
   */
  private getBrowserTimezone(): string | null {
    if (typeof window === 'undefined') return null;

    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return timeZone || null;
    } catch {
      return null;
    }
  }

  private locationFromSlug(slug: string, timezone: string): GeolocationData {
    const details = SLUG_TO_COUNTRY[slug];
    return {
      country: details?.name ?? slug,
      countryCode: details?.code ?? '',
      timezone,
      source: 'timezone',
    };
  }

  /**
   * Clear cached location data
   */
  clearCache(): void {
    localStorage.removeItem(LOCATION_CACHE_KEY);
    localStorage.removeItem(LEGACY_LOCATION_CACHE_KEY);
    this.cache.clear();
    this.resolvedLocation = null;
  }

  /**
   * Check if location detection is available
   */
  isAvailable(): boolean {
    return typeof window !== 'undefined' && 'localStorage' in window;
  }
}

// Export singleton instance
export const geolocationService = new GeolocationService();
export default geolocationService;
