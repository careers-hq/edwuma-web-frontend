import { useState, useEffect, useCallback } from 'react';
import { geolocationService, GeolocationData } from '@/lib/services/geolocation';

interface UseGeolocationReturn {
  location: GeolocationData | null;
  countryCode: string | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to get user's location based on IP address
 */
export const useGeolocation = (): UseGeolocationReturn => {
  const [location, setLocation] = useState<GeolocationData | null>(null);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const fetchLocation = useCallback(async () => {
    // Only run on client side
    if (!isClient) return;
    
    if (!geolocationService.isAvailable()) {
      setError('Geolocation not available in this environment');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const userLocation = await geolocationService.getUserLocation();
      setLocation(userLocation);

      if (userLocation) {
        const country = await geolocationService.getCountryForFiltering();
        setCountryCode(country);
      } else {
        // If geolocation fails, don't treat it as an error - just continue without auto-detection
        console.warn('Geolocation failed, continuing without auto-detection');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to detect location';
      setError(errorMessage);
      console.error('Geolocation error:', err);
      
      // Don't block the UI if geolocation fails - just log the error
      // The user can still use the app without auto-detected location
    } finally {
      setIsLoading(false);
    }
  }, [isClient]);

  const refetch = async () => {
    geolocationService.clearCache();
    await fetchLocation();
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      fetchLocation();
    }
  }, [isClient, fetchLocation]);

  return {
    location,
    countryCode,
    isLoading,
    error,
    refetch
  };
};

export default useGeolocation;
