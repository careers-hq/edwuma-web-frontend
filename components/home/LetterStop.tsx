'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { newsletterService } from '@/lib/api/newsletter';

export default function LetterStop() {
  const token = useSearchParams().get('token');
  const [message, setMessage] = useState<string | null>(token ? null : 'This stop link is missing its token.');
  const [busy, setBusy] = useState(false);

  const stop = async () => {
    if (!token || busy) {
      return;
    }

    setBusy(true);

    try {
      const response = await newsletterService.unsubscribe(token);
      setMessage(response.message);
    } catch (error) {
      const apiError = error as { message?: string };
      setMessage(apiError.message || 'This stop link could not be used.');
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
          Stop the letter
        </button>
      ) : null}
    </div>
  );
}
