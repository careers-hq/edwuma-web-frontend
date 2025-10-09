import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Get the user's IP address from request headers
 * Supports multiple hosting platforms (Vercel, Netlify, Cloudflare, generic)
 */
function getUserIP(request: NextRequest): string | null {
  // Try multiple headers in order of preference
  const headers = [
    'x-real-ip',                    // Standard proxy header
    'x-forwarded-for',              // Standard proxy header (may contain multiple IPs)
    'x-client-ip',                  // Generic client IP
    'cf-connecting-ip',             // Cloudflare
    'x-nf-client-connection-ip',    // Netlify
    'x-vercel-forwarded-for',       // Vercel
  ];

  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      // x-forwarded-for can contain multiple IPs (client, proxy1, proxy2)
      // The first IP is the original client
      const ip = value.split(',')[0].trim();
      if (ip && ip !== '127.0.0.1' && ip !== '::1') {
        return ip;
      }
    }
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    // Method 1: Try Vercel's built-in geolocation headers (fastest)
    const vercelCountry = request.headers.get('x-vercel-ip-country');
    const vercelRegion = request.headers.get('x-vercel-ip-country-region');
    const vercelCity = request.headers.get('x-vercel-ip-city');
    const vercelTimezone = request.headers.get('x-vercel-ip-timezone');
    
    if (vercelCountry) {
      return NextResponse.json({
        country: vercelCountry,
        countryCode: vercelCountry,
        region: vercelRegion || '',
        city: vercelCity || '',
        timezone: vercelTimezone || '',
        source: 'vercel'
      });
    }

    // Method 2: Get user's IP and query external geolocation API
    const userIP = getUserIP(request);
    
    if (!userIP) {
      console.warn('Could not determine user IP address');
      return NextResponse.json(null);
    }

    console.log('Detected user IP:', userIP);

    // Try ipinfo.io with the user's actual IP
    try {
      const ipinfoResponse = await fetch(`https://ipinfo.io/${userIP}/json`, {
        headers: { 
          'Accept': 'application/json',
          'User-Agent': 'Edwuma-App/1.0'
        },
        signal: AbortSignal.timeout(5000)
      });
      
      if (ipinfoResponse.ok) {
        const data = await ipinfoResponse.json();
        return NextResponse.json({
          country: data.country || '',
          countryCode: data.country || '',
          region: data.region || '',
          city: data.city || '',
          timezone: data.timezone || '',
          source: 'ipinfo'
        });
      }
    } catch (ipinfoError) {
      console.warn('ipinfo.io failed:', ipinfoError);
    }

    // Fallback: Try ip-api.com (free, no API key needed)
    try {
      const ipapiResponse = await fetch(`http://ip-api.com/json/${userIP}`, {
        headers: { 
          'Accept': 'application/json'
        },
        signal: AbortSignal.timeout(5000)
      });
      
      if (ipapiResponse.ok) {
        const data = await ipapiResponse.json();
        if (data.status === 'success') {
          return NextResponse.json({
            country: data.country || '',
            countryCode: data.countryCode || '',
            region: data.regionName || '',
            city: data.city || '',
            timezone: data.timezone || '',
            source: 'ip-api'
          });
        }
      }
    } catch (ipapiError) {
      console.warn('ip-api.com failed:', ipapiError);
    }
    
    // If all methods fail, return null
    console.warn('All geolocation methods failed');
    return NextResponse.json(null);
  } catch (error) {
    console.error('Geolocation API error:', error);
    return NextResponse.json(
      { error: 'Failed to detect location' }, 
      { status: 500 }
    );
  }
}
