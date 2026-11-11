'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MorningMessageForm from '@/components/home/MorningMessageForm';
import { morningMessageService } from '@/lib/api/morningMessages';

const COUNTRIES = [
  { slug: 'ghana', name: 'Ghana' },
  { slug: 'nigeria', name: 'Nigeria' },
  { slug: 'kenya', name: 'Kenya' },
  { slug: 'south-africa', name: 'South Africa' },
] as const;

export default function MorningStart() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requested = searchParams.get('country');
  const selected = COUNTRIES.some((country) => country.slug === requested) ? requested : null;
  const name = COUNTRIES.find((country) => country.slug === selected)?.name;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    morningMessageService
      .options()
      .then((response) => {
        if (!cancelled) {
          setReady(response.data.ready);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setReady(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <p className="text-sm font-medium text-gray-900">Where do you live?</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {COUNTRIES.map((country) => {
          const isSelected = selected === country.slug;
          return (
            <button
              key={country.slug}
              type="button"
              aria-pressed={isSelected}
              onClick={() => router.replace(`/morning?country=${country.slug}`, { scroll: false })}
              className={
                isSelected
                  ? 'inline-flex h-8 items-center whitespace-nowrap rounded-full bg-[#244034] px-3 text-sm text-white'
                  : 'inline-flex h-8 items-center whitespace-nowrap rounded-full border border-gray-300 bg-white px-3 text-sm text-gray-900'
              }
            >
              {country.name}
            </button>
          );
        })}
      </div>
      {selected && ready ? (
        <div className="mt-8">
          <p className="text-base text-gray-900">
            {`The morning for ${name}, on WhatsApp and by email.`}
          </p>
          <div className="mt-6">
            <MorningMessageForm country={selected} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
