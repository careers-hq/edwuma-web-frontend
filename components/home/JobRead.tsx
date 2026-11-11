'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { jobsApiService, type JobListing } from '@/lib/api/jobs';
import ReportProblem from '@/components/home/ReportProblem';

const COUNTRY_NAMES: Record<string, string> = {
  ghana: 'Ghana',
  nigeria: 'Nigeria',
  kenya: 'Kenya',
  'south-africa': 'South Africa',
};

function placeOf(job: JobListing, country: string | null): string | null {
  const locations = job.locations ?? [];
  const countryName = country ? COUNTRY_NAMES[country] : null;
  const location = locations.find((item) => item.country === countryName) ?? locations[0];
  if (!location) {
    return null;
  }

  if (!location.name || location.name === location.country) {
    return location.country || null;
  }

  return location.country ? `${location.name}, ${location.country}` : location.name;
}

function formatAmount(value: number | string | null): string | null {
  if (value === null) {
    return null;
  }

  const amount = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(amount)) {
    return null;
  }

  return new Intl.NumberFormat('en', { maximumFractionDigits: 0 }).format(amount);
}

function isHeading(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.length > 1 && trimmed.length < 80 && trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed);
}

function blocksOf(body: string): string[] {
  return body
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
}

function isList(blocks: string[]): boolean {
  return blocks.length >= 3 && blocks.every((block) => !block.includes('\n') && block.length <= 280);
}

function SectionBody({ body, list }: { body: string; list: boolean }) {
  const blocks = blocksOf(body);

  if (list) {
    return (
      <ul className="mt-4 space-y-3">
        {blocks.map((block, index) => (
          <li key={`${index}-${block.slice(0, 24)}`} className="flex gap-3 text-sm leading-6 text-gray-800">
            <span aria-hidden="true" className="text-gray-400">—</span>
            <span>{block}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {blocks.map((block) => (
        <p key={block} className="whitespace-pre-wrap text-sm leading-7 text-gray-800">
          {block}
        </p>
      ))}
    </div>
  );
}

function sectionsOf(text: string): { heading: string | null; body: string }[] {
  const sections: { heading: string | null; body: string }[] = [];
  let heading: string | null = null;
  let lines: string[] = [];

  const flush = () => {
    const body = lines.join('\n').trim();
    if (heading || body) {
      sections.push({ heading, body });
    }
    lines = [];
  };

  text.split('\n').forEach((line) => {
    if (isHeading(line)) {
      flush();
      heading = line.trim();
      return;
    }

    lines.push(line);
  });

  flush();

  const intro = sections.filter((section) => section.heading === null);
  const named = sections.filter((section) => section.heading !== null);

  return [...named, ...intro];
}

function ApplyLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-10 items-center rounded-md bg-[#244034] px-4 text-sm font-medium text-white"
    >
      Apply
    </a>
  );
}

function formatSalary(job: JobListing): string | null {
  const min = formatAmount(job.salary?.min ?? null);
  const max = formatAmount(job.salary?.max ?? null);
  const amount = min && max && min !== max ? `${min}–${max}` : min || max;

  if (!amount) {
    return null;
  }

  return job.salary?.currency ? `${amount} ${job.salary.currency.toUpperCase()}` : amount;
}

const JobRead: React.FC<{ id: string; country?: string | null }> = ({ id, country = null }) => {
  const [job, setJob] = useState<JobListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    jobsApiService
      .getJob(id)
      .then((response) => {
        if (cancelled) {
          return;
        }

        if (response.success && response.data) {
          setJob(response.data);
          return;
        }

        setError('This role could not be loaded.');
      })
      .catch(() => {
        if (!cancelled) {
          setError('This role could not be loaded.');
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
  }, [id]);

  const company = job?.companies?.[0]?.name;
  const place = job ? placeOf(job, country) : null;
  const placeLine = [company, place].filter(Boolean).join(' · ');
  const salary = job ? formatSalary(job) : null;
  const applyUrl = job?.application?.url;
  const sections = job?.description ? sectionsOf(job.description) : [];

  return (
    <div className={applyUrl ? 'pb-28' : undefined}>
      <Link href={country ? `/?country=${country}` : '/'} className="inline-flex items-center gap-2 text-sm text-gray-600">
        <span aria-hidden="true">←</span>
        Today&apos;s list
      </Link>

      {isLoading ? (
        <div className="mt-8 space-y-3" aria-hidden="true">
          <div className="h-8 w-2/3 rounded bg-gray-100" />
          <div className="h-4 w-1/3 rounded bg-gray-100" />
          <div className="mt-6 h-4 w-full rounded bg-gray-100" />
          <div className="h-4 w-full rounded bg-gray-100" />
          <div className="h-4 w-4/5 rounded bg-gray-100" />
        </div>
      ) : error || !job ? (
        <p className="mt-8 text-sm text-gray-700">{error ?? 'This role could not be loaded.'}</p>
      ) : (
        <article className="mt-8">
          <h1 className="!text-[28px] font-semibold !leading-tight tracking-tight !text-gray-900 sm:!text-[32px]">{job.title}</h1>
          {placeLine ? <p className="mt-3 text-sm text-gray-700">{placeLine}</p> : null}
          {salary ? <p className="mt-2 text-sm text-gray-900">{salary}</p> : null}
          {applyUrl ? (
            <div className="mt-5">
              <ApplyLink href={applyUrl} />
            </div>
          ) : null}
          {sections.length > 0 ? (
            <div className="mt-10 space-y-10">
              {sections.map((section) => {
                const blocks = blocksOf(section.body);
                const list = section.heading !== null && isList(blocks);

                if (section.heading === null) {
                  return (
                    <div
                      key={`intro-${section.body.slice(0, 24)}`}
                      className="rounded-md bg-gray-50 px-4 py-4 text-sm leading-7 text-gray-600"
                    >
                      {blocks.map((block) => (
                        <p key={block} className="whitespace-pre-wrap [&:not(:first-child)]:mt-4">
                          {block}
                        </p>
                      ))}
                    </div>
                  );
                }

                return (
                  <section key={`${section.heading}-${section.body.slice(0, 24)}`}>
                    <h2 className="!text-xs font-medium !leading-4 uppercase tracking-[0.14em] !text-[#244034]">
                      {section.heading}
                    </h2>
                    {section.body ? <SectionBody body={section.body} list={list} /> : null}
                  </section>
                );
              })}
            </div>
          ) : (
            <p className="mt-8 text-sm text-gray-700">The description is not on this page.</p>
          )}
          <ReportProblem jobId={job.id} />
        </article>
      )}
      {applyUrl && job ? (
        <div className="fixed inset-x-0 bottom-0 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)]">
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-6 px-4 py-3 sm:px-6">
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-semibold text-[#244034]">{job.title}</p>
              {placeLine ? <p className="truncate text-sm text-gray-500">{placeLine}</p> : null}
            </div>
            <a
              href={applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-full shrink-0 items-center justify-center rounded-md bg-[#244034] px-5 text-sm font-medium text-white sm:w-auto"
            >
              Apply for this role
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default JobRead;
