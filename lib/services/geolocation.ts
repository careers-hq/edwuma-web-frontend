// Geolocation service to detect user's country from IP address

export interface GeolocationData {
  country: string;
  countryCode: string;
  region?: string;
  city?: string;
  timezone?: string;
}

export interface GeolocationError {
  error: string;
  message: string;
}

class GeolocationService {
  private cache: Map<string, GeolocationData> = new Map();
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
    const cached = localStorage.getItem('user-location');
    if (!cached) return null;

    try {
      const data = JSON.parse(cached);
      const now = Date.now();
      
      // Check if cache is still valid
      if (data.timestamp && (now - data.timestamp) < this.CACHE_DURATION) {
        return data.location;
      }
      
      // Remove expired cache
      localStorage.removeItem('user-location');
      return null;
    } catch (error) {
      console.error('Error reading cached location:', error);
      localStorage.removeItem('user-location');
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
      localStorage.setItem('user-location', JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error caching location:', error);
    }
  }

  /**
   * Get country code for API filtering
   */
  async getCountryForFiltering(): Promise<string | null> {
    const location = await this.getUserLocation();
    if (!location || !location.countryCode) {
      return null;
    }

    // Map ISO country codes (2-letter) to API-compatible slugified format
    const countryCodeMapping: Record<string, string> = {
      // African Countries
      'GH': 'ghana',
      'NG': 'nigeria',
      'KE': 'kenya',
      'ZA': 'south-africa',
      'SN': 'senegal',
      'CI': 'ivory-coast',
      'SL': 'sierra-leone',
      'LR': 'liberia',
      'GN': 'guinea',
      'GW': 'guinea-bissau',
      'GM': 'gambia',
      'CV': 'cape-verde',
      'ML': 'mali',
      'BF': 'burkina-faso',
      'NE': 'niger',
      'TD': 'chad',
      'MR': 'mauritania',
      'BJ': 'benin',
      'TG': 'togo',
      'ET': 'ethiopia',
      'TZ': 'tanzania',
      'UG': 'uganda',
      'RW': 'rwanda',
      'BI': 'burundi',
      'DJ': 'djibouti',
      'ER': 'eritrea',
      'SO': 'somalia',
      'SS': 'south-sudan',
      'SD': 'sudan',
      'BW': 'botswana',
      'NA': 'namibia',
      'ZM': 'zambia',
      'ZW': 'zimbabwe',
      'MW': 'malawi',
      'MZ': 'mozambique',
      'LS': 'lesotho',
      'SZ': 'swaziland',
      'AO': 'angola',
      'EG': 'egypt',
      'MA': 'morocco',
      'DZ': 'algeria',
      'TN': 'tunisia',
      'LY': 'libya',
      'CD': 'democratic-republic-of-congo',
      'CG': 'republic-of-congo',
      'CM': 'cameroon',
      'CF': 'central-african-republic',
      'GA': 'gabon',
      'GQ': 'equatorial-guinea',
      'ST': 'sao-tome-and-principe',
      'MG': 'madagascar',
      'MU': 'mauritius',
      'SC': 'seychelles',
      'KM': 'comoros',
      'RE': 'reunion',
      'YT': 'mayotte',
      
      // Diaspora Countries
      'US': 'united-states',
      'CA': 'canada',
      'GB': 'united-kingdom',
      'FR': 'france',
      'DE': 'germany',
      'NL': 'netherlands',
      'BE': 'belgium',
      'CH': 'switzerland',
      'SE': 'sweden',
      'NO': 'norway',
      'DK': 'denmark',
      'AU': 'australia',
      'NZ': 'new-zealand',
      'BR': 'brazil',
      'AR': 'argentina',
      'VN': 'vietnam',
      'TH': 'thailand',
      'PH': 'philippines',
      'MY': 'malaysia',
      'SG': 'singapore',
      'ID': 'indonesia',
      'KR': 'south-korea',
      'JP': 'japan',
      'CN': 'china',
      'IN': 'india',
      'AE': 'uae',
      'SA': 'saudi-arabia',
      'QA': 'qatar',
      'KW': 'kuwait',
      'BH': 'bahrain',
      'OM': 'oman',
      'JO': 'jordan',
      'LB': 'lebanon',
      'TR': 'turkey',
      'IL': 'israel'
    };

    // Convert country code to uppercase to ensure consistency
    const upperCode = location.countryCode.toUpperCase();
    return countryCodeMapping[upperCode] || null;
  }

  /**
   * Clear cached location data
   */
  clearCache(): void {
    localStorage.removeItem('user-location');
    this.cache.clear();
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
