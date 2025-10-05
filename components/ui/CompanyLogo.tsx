import React from 'react';
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
  
  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <Image
        src={logoUrl || defaultLogo}
        alt={`${companyName} logo`}
        width={size}
        height={size}
        className="object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = defaultLogo;
        }}
        // Add loading placeholder with a simple blur effect
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iOCIgZmlsbD0iI2YzZjRmNiIvPgo8cmVjdCB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgcng9IjQiIGZpbGw9IiNkMWQ1ZGIiLz4KPC9zdmc+"
      />
    </div>
  );
};
