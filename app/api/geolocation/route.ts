import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Use Vercel's built-in geolocation headers first
    const country = request.headers.get('x-vercel-ip-country');
    const region = request.headers.get('x-vercel-ip-country-region');
    const city = request.headers.get('x-vercel-ip-city');
    const timezone = request.headers.get('x-vercel-ip-timezone');
    
    if (country) {
      return NextResponse.json({
        country: country,
        countryCode: country,
        region: region || '',
        city: city || '',
        timezone: timezone || '',
      });
    }
    
    // Fallback to external API if Vercel headers are not available
    try {
      const externalResponse = await fetch('https://ipinfo.io/json', {
        headers: { 
          'Accept': 'application/json',
          'User-Agent': 'Edwuma-App/1.0'
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(5000)
      });
      
      if (externalResponse.ok) {
        const data = await externalResponse.json();
        return NextResponse.json({
          country: data.country || '',
          countryCode: data.country || '',
          region: data.region || '',
          city: data.city || '',
          timezone: data.timezone || '',
        });
      }
    } catch (externalError) {
      console.warn('External geolocation API failed:', externalError);
    }
    
    // If both methods fail, return null
    return NextResponse.json(null);
  } catch (error) {
    console.error('Geolocation API error:', error);
    return NextResponse.json(
      { error: 'Failed to detect location' }, 
      { status: 500 }
    );
  }
}
