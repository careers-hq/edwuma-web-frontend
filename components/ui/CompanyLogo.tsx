import React, { useState } from 'react';
import Image from 'next/image';

interface CompanyLogoProps {
  logoUrl?: string;
  companyName: string;
  size?: number;
  className?: string;
}

const STORED_LOGO_PATH = '/storage/company-logos/';

/**
 * Job Data logos and logos we stored from a company website.
 * Other hosts, including the old logo proxy, stay on the initials mark.
 */
export function isCompanyLogoUrl(url: string): boolean {
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    return false;
  }

  if (parsed.pathname.includes('/api/v1/logos/proxy/')) {
    return false;
  }

  if (
    parsed.protocol === 'https:' &&
    parsed.hostname === 'jobdataapi.com' &&
    parsed.pathname.startsWith('/media/company/logo/')
  ) {
    return true;
  }

  if (!parsed.pathname.startsWith(STORED_LOGO_PATH)) {
    return false;
  }

  if (
    parsed.protocol === 'https:' &&
    (parsed.hostname === 'api-test.edwuma.com' || parsed.hostname === 'api-prod.edwuma.com')
  ) {
    return true;
  }

  const configured = process.env.NEXT_PUBLIC_API_URL;

  if (!configured) {
    return false;
  }

  try {
    const api = new URL(configured);

    return parsed.protocol === api.protocol && parsed.host === api.host;
  } catch {
    return false;
  }
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  logoUrl,
  companyName,
  size = 64,
  className = '',
}) => {
  const defaultLogo = '/images/default-company-logo.svg';
  const [imageError, setImageError] = useState(false);
  const allowed = Boolean(logoUrl && isCompanyLogoUrl(logoUrl) && !imageError);
  const finalLogoUrl = allowed && logoUrl ? logoUrl : defaultLogo;

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <Image
        src={finalLogoUrl}
        alt={allowed ? `${companyName} logo` : 'Edwuma'}
        width={size}
        height={size}
        className="object-cover"
        onError={() => setImageError(true)}
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iOCIgZmlsbD0iI2YzZjRmNiIvPgo8cmVjdCB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgcng9IjQiIGZpbGw9IiNkMWQ1ZGIiLz4KPC9zdmc+"
        unoptimized={!allowed}
      />
    </div>
  );
};
