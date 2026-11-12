'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { morningMailService } from '@/lib/api/morningMail';

export default function MorningCountryStop() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [message, setMessage] = useState<string | null>(token ? null : 'This stop link is missing its token.');
  const [busy, setBusy] = useState(false);

  const stop = async () => {
    if (!token || busy) {
      return;
    }

    setBusy(true);

    try {
      const response = await morningMailService.stop(token);
      setMessage(response.message);
    } catch {
      setMessage('This stop link could not be used.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-8">
      {message ? <p className="text-base text-[#141414]">{message}</p> : null}
      {token && message === null ? (
        <button
          type="button"
          disabled={busy}
          onClick={() => void stop()}
          className="inline-flex h-12 items-center rounded-full bg-[#244034] px-6 text-base font-semibold text-white"
        >
          Stop these emails
        </button>
      ) : null}
    </div>
  );
}
