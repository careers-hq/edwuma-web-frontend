'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { morningMailService } from '@/lib/api/morningMail';
import { MORNING_COUNTRIES, morningCountry } from '@/lib/morning/countries';
import { cn } from '@/lib/utils';

export default function MorningCountry() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const hinted = morningCountry(searchParams.get('country'));
  const [selected, setSelected] = useState<string | null>(hinted?.name ?? null);
  const [receiving, setReceiving] = useState(false);
  const [message, setMessage] = useState<string | null>(token ? null : 'This link is missing its token.');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;

    morningMailService.show(token).then((response) => {
      if (cancelled) {
        return;
      }

      const country = morningCountry(response.data.country);
      setSelected(country?.name ?? hinted?.name ?? null);
      setReceiving(response.data.receiving);
    }).catch(() => {
      if (!cancelled) {
        setMessage('This link could not be used.');
      }
    });

    return () => {
      cancelled = true;
    };
  }, [token, hinted?.name]);

  const choose = async (name: string) => {
    if (!token || busy) {
      return;
    }

    setBusy(true);
    setMessage(null);

    try {
      const response = await morningMailService.choose(token, name);
      const country = morningCountry(response.data.country);
      setSelected(country?.name ?? name);
      setReceiving(true);
    } catch {
      setMessage('This link could not be used.');
    } finally {
      setBusy(false);
    }
  };

  if (message && !token) {
    return <p className="mt-8 text-base text-[#141414]">{message}</p>;
  }

  return (
    <div className="mt-8">
      {receiving && selected ? (
        <p className="text-lg text-[#141414]">The {selected} list arrives each morning.</p>
      ) : null}
      {message ? <p className="mt-4 text-base text-[#141414]">{message}</p> : null}
      <div className="mt-6 flex flex-col gap-3">
        {MORNING_COUNTRIES.map((country) => {
          const isSelected = selected === country.name;

          return (
            <button
              key={country.slug}
              type="button"
              disabled={!token || busy}
              aria-pressed={isSelected}
              onClick={() => void choose(country.name)}
              className={cn(
                'inline-flex h-12 items-center justify-center rounded-full px-6 text-base font-semibold',
                isSelected ? 'bg-[#244034] text-white' : 'border-2 border-[#244034] text-[#244034]'
              )}
            >
              {country.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
