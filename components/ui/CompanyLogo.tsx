import React, { useState } from 'react';
import Image from 'next/image';

interface CompanyLogoProps {
  logoUrl?: string;
  companyName: string;
  size?: number;
  className?: string;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  logoUrl,
  companyName,
  size = 64,
  className = '',
}) => {
  const defaultLogo = '/images/default-company-logo.svg';
  const [imageError, setImageError] = useState(false);
  
  // Validate logo URL - reject any proxy URLs immediately
  const isValidLogoUrl = (url: string) => {
    // Only allow HTTPS URLs from trusted domains
    if (!url.startsWith('https://')) return false;
    
    // Block any localhost or proxy URLs
    if (url.includes('localhost') || url.includes('127.0.0.1') || url.includes('/api/v1/logos/proxy/')) {
      return false;
    }
    
    // Only allow jobdataapi.com and other trusted domains
    const allowedDomains = ['jobdataapi.com', 'api-test.edwuma.com'];
    return allowedDomains.some(domain => url.includes(domain));
  };
  
  const finalLogoUrl = (logoUrl && isValidLogoUrl(logoUrl) && !imageError) ? logoUrl : defaultLogo;
  
  const handleError = () => {
    setImageError(true);
  };
  
  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <Image
        src={finalLogoUrl}
        alt={`${companyName} logo`}
        width={size}
        height={size}
        className="object-cover"
        onError={handleError}
        // Add loading placeholder with a simple blur effect
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iOCIgZmlsbD0iI2YzZjRmNiIvPgo8cmVjdCB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgcng9IjQiIGZpbGw9IiNkMWQ1ZGIiLz4KPC9zdmc+"
        // Force unoptimized for any potentially problematic URLs
        unoptimized={!isValidLogoUrl(logoUrl || '')}
      />
    </div>
  );
};
