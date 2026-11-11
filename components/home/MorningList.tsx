'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MorningJobCard from '@/components/home/MorningJobCard';
import MorningPitch from '@/components/home/MorningPitch';
import { jobsApiService, type MorningListJob } from '@/lib/api/jobs';
import { useGeolocation } from '@/lib/hooks/useGeolocation';

const COUNTRIES = [
  { slug: 'ghana', name: 'Ghana' },
  { slug: 'nigeria', name: 'Nigeria' },
  { slug: 'kenya', name: 'Kenya' },
  { slug: 'south-africa', name: 'South Africa' },
] as const;

function countryName(slug: string): string {
  return COUNTRIES.find((country) => country.slug === slug)?.name ?? slug;
}

function openLine(name: string, open: number, shown: number, subscription: boolean): string {
  if (!subscription) {
    if (open <= 0) {
      return `Nothing open in ${name}.`;
    }

    if (open === 1) {
      return `1 open in ${name}.`;
    }

    return `${open} open in ${name}.`;
  }

  if (open <= 0) {
    return `Nothing open in ${name}.`;
  }

  if (open === 1) {
    return `1 open in ${name}. This is it.`;
  }

  if (open <= shown) {
    return `${open} open in ${name}. These are all of them.`;
  }

  return `${open} open in ${name}. These are ${shown}.`;
}

const MorningList: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { countryCode } = useGeolocation();
  const requested = searchParams.get('country');
  const selected = COUNTRIES.some((country) => country.slug === requested) ? requested : null;

  const [jobs, setJobs] = useState<MorningListJob[]>([]);
  const [openCount, setOpenCount] = useState(0);
  const [subscription, setSubscription] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (selected || !countryCode) {
      return;
    }

    if (COUNTRIES.some((country) => country.slug === countryCode)) {
      router.replace(`/?country=${countryCode}`, { scroll: false });
    }
  }, [selected, countryCode, router]);

  useEffect(() => {
    if (!selected) {
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    jobsApiService
      .morningList(selected)
      .then((response) => {
        if (!cancelled) {
          setJobs(response.data.jobs ?? []);
          setOpenCount(response.data.open ?? 0);
          setSubscription(response.data.subscription !== false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setJobs([]);
          setOpenCount(0);
          setSubscription(true);
          setError('The list could not be loaded.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selected, reloadKey]);

  const chooseCountry = (slug: string) => {
    router.replace(`/?country=${slug}`, { scroll: false });
  };

  const today = subscription ? jobs.slice(0, 5) : jobs;

  return (
    <div>
      <p className="mt-3 text-base text-gray-700">
        {selected && !isLoading && !error
          ? openLine(countryName(selected), openCount, today.length, subscription)
          : selected
            ? `Still open. Someone in ${countryName(selected)} can apply. No fee.`
            : 'Still open. Someone where you live can apply. No fee.'}
      </p>

      <div className="mt-8">
        <p className="text-sm font-medium text-gray-900">Where do you live?</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {COUNTRIES.map((country) => {
            const isSelected = selected === country.slug;
            return (
              <button
                key={country.slug}
                type="button"
                aria-pressed={isSelected}
                onClick={() => chooseCountry(country.slug)}
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
      </div>

      <div className="mt-8">
        {!selected ? null : isLoading ? (
          <div className="space-y-6" aria-hidden="true">
            {[0, 1, 2].map((row) => (
              <div key={row} className="border-b border-gray-200 py-6">
                <div className="h-5 w-2/3 rounded bg-gray-100" />
                <div className="mt-3 h-4 w-1/3 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div>
            <p className="text-sm text-gray-700">{error}</p>
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="mt-3 text-sm font-medium text-[#244034] underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        ) : today.length === 0 ? (
          <div>
            <p className="text-base text-gray-900">Nothing you can apply to today.</p>
            {subscription ? (
              <MorningPitch country={selected} name={countryName(selected)} open={openCount} shown={0} />
            ) : null}
          </div>
        ) : (
          <div>
            {today.map((job) => (
              <MorningJobCard key={job.id} job={job} country={selected} />
            ))}
            {subscription ? (
              <MorningPitch country={selected} name={countryName(selected)} open={openCount} shown={today.length} />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default MorningList;
