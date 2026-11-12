'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MorningJobCard from '@/components/home/MorningJobCard';
import MorningPitch from '@/components/home/MorningPitch';
import { jobsApiService, type MorningListJob } from '@/lib/api/jobs';
import { useAuth } from '@/lib/auth';
import { useGeolocation } from '@/lib/hooks/useGeolocation';
import { MORNING_COUNTRIES, type MorningCountrySlug } from '@/lib/morning/countries';
import { cn } from '@/lib/utils';

const COUNTRIES = MORNING_COUNTRIES;

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

function CountryMark({ slug }: { slug: MorningCountrySlug }) {
  const common = 'h-6 w-6';

  if (slug === 'ghana') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" strokeLinecap="round" />
      </svg>
    );
  }

  if (slug === 'nigeria') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M4 20V9l8-5 8 5v11" strokeLinejoin="round" />
        <path d="M9 20v-6h6v6" strokeLinejoin="round" />
      </svg>
    );
  }

  if (slug === 'kenya') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M3 18l5.5-8 3.5 4 3-5L21 18" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 3l7 9-7 9-7-9 7-9z" strokeLinejoin="round" />
    </svg>
  );
}

const MorningList: React.FC<{ initialCountry?: string | null }> = ({ initialCountry = null }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isInitialized } = useAuth();
  const { countryCode } = useGeolocation();
  const requested = searchParams.get('country') ?? initialCountry;
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
    if (!selected || !isInitialized) {
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    jobsApiService
      .morningList(selected, 5, undefined, isAuthenticated)
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
  }, [selected, reloadKey, isInitialized, isAuthenticated]);

  const chooseCountry = (slug: string) => {
    router.replace(`/?country=${slug}`, { scroll: false });
  };

  const seeJobs = () => {
    document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const showPitch = subscription && !isAuthenticated;
  const pending = isLoading || (Boolean(selected) && !isInitialized);
  const today = showPitch ? jobs.slice(0, 5) : jobs;
  const name = selected ? countryName(selected) : null;
  const summary =
    selected && !pending && !error
      ? openLine(name ?? selected, openCount, today.length, showPitch)
      : selected
        ? `Still open. Someone in ${name} can apply. No fee.`
        : 'Still open. Someone where you live can apply. No fee.';

  return (
    <>
      <section className="relative overflow-hidden bg-[#244034] lg:min-h-[760px]">
        <img
          src="/images/home-hero.jpg"
          alt=""
          className="absolute inset-x-0 top-0 h-80 w-full object-cover object-[center_28%] sm:h-96 lg:inset-y-0 lg:left-auto lg:right-0 lg:h-full lg:w-[46%] lg:object-[center_18%]"
        />
        <div className="relative mx-auto flex max-w-6xl px-4 pb-12 pt-52 sm:px-6 sm:pt-64 lg:min-h-[760px] lg:items-center lg:py-16">
          <div className="w-full max-w-[560px] rounded-[28px] bg-white px-5 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] sm:px-8 sm:py-8">
            <div className="grid grid-cols-4 border-b border-[#244034]/15" role="tablist" aria-label="Country">
              {COUNTRIES.map((country) => {
                const isSelected = selected === country.slug;
                return (
                  <button
                    key={country.slug}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => chooseCountry(country.slug)}
                    className={cn(
                      'flex flex-col items-center gap-2 border-b-2 px-1 pb-3 pt-1 text-center text-[11px] font-semibold leading-tight sm:text-sm',
                      isSelected
                        ? 'border-[#244034] text-[#244034]'
                        : 'border-transparent text-[#141414]'
                    )}
                  >
                    <CountryMark slug={country.slug} />
                    {country.name}
                  </button>
                );
              })}
            </div>

            <h1 className="mt-7 text-[40px] font-extrabold leading-[1.05] tracking-[-0.045em] text-[#141414] sm:text-5xl">
              Jobs you can apply to today
            </h1>
            <p className="mt-4 text-base leading-7 text-[#141414] sm:text-lg">{summary}</p>

            <button
              type="button"
              onClick={seeJobs}
              className="mt-7 inline-flex h-12 items-center rounded-full bg-[#244034] px-6 text-base font-semibold text-white"
            >
              {name ? `See jobs in ${name}` : 'See today’s jobs'}
            </button>
          </div>
        </div>
      </section>

      <section id="jobs" className="scroll-mt-24 bg-[#F4F2EE] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-[36px] font-extrabold leading-[1.05] tracking-[-0.045em] text-[#141414] sm:text-5xl">
            {name ? (
              <>
                Open in <span className="text-[#244034]">{name}</span>
              </>
            ) : (
              'Where you live'
            )}
          </h2>

          <div className="mt-8 inline-flex max-w-full flex-wrap gap-1 rounded-full border-2 border-[#244034] p-1.5">
            {COUNTRIES.map((country) => {
              const isSelected = selected === country.slug;
              return (
                <button
                  key={country.slug}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => chooseCountry(country.slug)}
                  className={cn(
                    'inline-flex h-11 items-center rounded-full px-5 text-sm font-semibold',
                    isSelected ? 'bg-[#244034] text-white' : 'text-[#244034]'
                  )}
                >
                  {country.name}
                </button>
              );
            })}
          </div>

          <div className="mt-8">
            {!selected ? (
              <p className="text-base text-black/70">Ghana, Nigeria, Kenya, and South Africa.</p>
            ) : pending ? (
              <div className="space-y-3" aria-hidden="true">
                {[0, 1, 2].map((row) => (
                  <div key={row} className="rounded-[24px] bg-white px-5 py-6">
                    <div className="h-5 w-2/3 rounded-full bg-[#F4F2EE]" />
                    <div className="mt-3 h-4 w-1/3 rounded-full bg-[#F4F2EE]" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div>
                <p className="text-base text-[#141414]">{error}</p>
                <button
                  type="button"
                  onClick={() => setReloadKey((key) => key + 1)}
                  className="mt-3 text-sm font-semibold text-[#244034] underline underline-offset-4"
                >
                  Try again
                </button>
              </div>
            ) : today.length === 0 ? (
              <div>
                <p className="text-lg font-semibold text-[#141414]">Nothing you can apply to today.</p>
                {showPitch ? (
                  <MorningPitch name={name ?? selected} open={openCount} shown={0} />
                ) : null}
              </div>
            ) : (
              <div className="space-y-3">
                {today.map((job) => (
                  <MorningJobCard key={job.id} job={job} country={selected} />
                ))}
                {showPitch ? (
                  <MorningPitch name={name ?? selected} open={openCount} shown={today.length} />
                ) : null}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default MorningList;
