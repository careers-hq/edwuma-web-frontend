'use client';

import React from 'react';
import { Turnstile as CloudflareTurnstile, TurnstileInstance } from '@marsidev/react-turnstile';

interface TurnstileProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  className?: string;
}

export interface TurnstileHandle {
  reset: () => void;
}

export const Turnstile = React.forwardRef<TurnstileHandle, TurnstileProps>(({
  onSuccess,
  onError,
  onExpire,
  className = '',
}, ref) => {
  const turnstileRef = React.useRef<TurnstileInstance>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

  // Show warning in development if site key is missing
  React.useEffect(() => {
    if (!siteKey && process.env.NODE_ENV === 'development') {
      console.warn('⚠️ NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set in environment variables');
    }
  }, [siteKey]);

  React.useImperativeHandle(ref, () => ({
    reset: () => {
      if (turnstileRef.current) {
        turnstileRef.current.reset();
      }
    },
  }), []);

  const handleSuccess = (token: string) => {
    onSuccess(token);
  };

  const handleError = () => {
    console.error('Turnstile verification failed');
    onError?.();
  };

  const handleExpire = () => {
    console.warn('Turnstile token expired');
    onExpire?.();
  };

  if (!siteKey) {
    // In development, show a placeholder
    if (process.env.NODE_ENV === 'development') {
      return (
        <div className={`p-4 bg-yellow-50 border border-yellow-200 rounded-md ${className}`}>
          <p className="text-sm text-yellow-800">
            ⚠️ Turnstile disabled: Add NEXT_PUBLIC_TURNSTILE_SITE_KEY to .env.local
          </p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className={className}>
      <CloudflareTurnstile
        ref={turnstileRef}
        siteKey={siteKey}
        onSuccess={handleSuccess}
        onError={handleError}
        onExpire={handleExpire}
        options={{
          theme: 'light',
          size: 'normal',
        }}
      />
    </div>
  );
});

Turnstile.displayName = 'Turnstile';

export default Turnstile;

