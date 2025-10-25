import React from 'react';
import Image from 'next/image';
import { getFlagImageSrcSet } from '@/lib/utils/countryDisplay';

interface FlagIconProps {
  countryCode: string;
  size?: 16 | 20 | 24 | 32 | 40;
  className?: string;
  rounded?: boolean;
}

/**
 * FlagIcon Component
 * Displays country flag using Flagcdn.com API
 * Works consistently across all devices (no emoji issues)
 */
const FlagIcon: React.FC<FlagIconProps> = ({ 
  countryCode, 
  size = 20, 
  className = '',
  rounded = true 
}) => {
  // Map UI sizes to Flagcdn widths
  const widthMap = {
    16: 20,
    20: 20,
    24: 40,
    32: 40,
    40: 80,
  } as const;

  const cdnWidth = widthMap[size];
  const flagData = getFlagImageSrcSet(countryCode, cdnWidth);

  return (
    <Image
      src={flagData.src}
      width={size}
      height={size * 0.75} // Maintain 4:3 aspect ratio
      alt={flagData.alt}
      className={`inline-block ${rounded ? 'rounded-sm' : ''} ${className}`}
      loading="lazy"
      style={{ objectFit: 'cover' }}
      unoptimized // Use unoptimized for external CDN images
    />
  );
};

export default FlagIcon;

