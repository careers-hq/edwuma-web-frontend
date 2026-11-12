'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CompanyLogo, isCompanyLogoUrl } from '@/components/ui/CompanyLogo';
import { jobsApiService, type JobListing, type MorningListJob } from '@/lib/api/jobs';
import { savedJobsService } from '@/lib/api/savedJobs';
import { userActivitiesService } from '@/lib/api/activities';
import ReportProblem from '@/components/home/ReportProblem';
import { useAuth } from '@/lib/auth';
import { clearSavedCache, loadSaved, rememberSaved, subscribeSaved, type SavedMap } from '@/lib/savedJobsState';
import { requireAccount } from '@/lib/utils/jobApplication';

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
      <ul className="mt-4 list-disc space-y-2 ps-5 text-base leading-7 text-[#141414]">
        {blocks.map((block, index) => (
          <li key={`${index}-${block.slice(0, 24)}`}>{block}</li>
        ))}
      </ul>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {blocks.map((block) => (
        <p key={block} className="whitespace-pre-wrap text-base leading-7 text-[#141414]">
          {block}
        </p>
      ))}
    </div>
  );
}

function roleTitle(title: string, company: string | null): string {
  if (!company) {
    return title;
  }

  const suffix = ` at ${company}`;
  if (title.toLowerCase().endsWith(suffix.toLowerCase())) {
    const role = title.slice(0, -suffix.length).trim();
    return role || title;
  }

  return title;
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

function ApplyButton({ onClick, wide = false, tone = 'green' }: { onClick: () => void; wide?: boolean; tone?: 'green' | 'lime' }) {
  const colors = tone === 'lime' ? 'bg-[#d2f34c] text-[#244034]' : 'bg-[#244034] text-white';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-12 cursor-pointer items-center justify-center rounded-full px-6 text-base font-semibold ${colors} ${wide ? 'w-full' : 'w-full sm:w-auto'}`}
    >
      Apply for this role
    </button>
  );
}

function SaveRoleButton({ jobId, country }: { jobId: string; country?: string | null }) {
  const { isAuthenticated } = useAuth();
  const [savedId, setSavedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setSavedId(null);
      return;
    }

    let cancelled = false;
    const apply = (map: SavedMap) => {
      if (!cancelled) {
        setSavedId(map.get(jobId) ?? null);
      }
    };

    const unsubscribe = subscribeSaved(apply);
    loadSaved().then(apply);

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [isAuthenticated, jobId]);

  const toggle = async () => {
    if (!isAuthenticated) {
      requireAccount({
        action: 'save',
        jobId,
        returnTo: `${window.location.pathname}${window.location.search}`,
        country: country ?? undefined,
      });
      return;
    }

    if (busy) {
      return;
    }

    setBusy(true);

    try {
      if (savedId) {
        await savedJobsService.unsaveJob(savedId);
        rememberSaved(jobId, null);
        return;
      }

      const response = await savedJobsService.saveJob(jobId);
      rememberSaved(jobId, response.data.id);
    } catch (error) {
      const status = error && typeof error === 'object' && 'status' in error ? error.status : null;
      if (status === 400) {
        clearSavedCache();
        const map = await loadSaved();
        setSavedId(map.get(jobId) ?? null);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={savedId !== null}
      aria-label={savedId ? 'Remove from saved' : 'Save job'}
      className="inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill={savedId ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M7 4.5h10a1 1 0 0 1 1 1V20l-6-3.5L6 20V5.5a1 1 0 0 1 1-1z" strokeLinejoin="round" />
      </svg>
    </button>
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

const OPTION_LABELS: Record<string, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
  freelance: 'Freelance',
  internship: 'Internship',
  volunteer: 'Volunteer',
  remote: 'Remote',
  hybrid: 'Hybrid',
  'on-site': 'On site',
  'field-work': 'Field work',
  'travel-required': 'Travel',
  'project-based': 'Project based',
  'entry-level': 'Entry level',
  junior: 'Junior',
  'mid-level': 'Mid level',
  senior: 'Senior',
  lead: 'Lead',
  executive: 'Executive',
  'fresh-graduate': 'Fresh graduate',
  'career-changer': 'Career changer',
  'returning-professional': 'Returning professional',
  'diaspora-return': 'Diaspora return',
  'primary-school': 'Primary school',
  'secondary-school': 'Secondary school',
  'vocational-training': 'Vocational training',
  diploma: 'Diploma',
  'bachelor-degree': "Bachelor's",
  'master-degree': "Master's",
  phd: 'PhD',
  'professional-certification': 'Certification',
  'international-qualification': 'International qualification',
  'african-university': 'African university',
  'western-university': 'Western university',
};

function optionLabel(option?: { value?: string; label?: string } | null): string | null {
  if (!option) {
    return null;
  }

  const value = option.value?.trim();
  if (value && OPTION_LABELS[value]) {
    return OPTION_LABELS[value];
  }

  const label = option.label?.trim();
  if (label && /[a-z]/.test(label)) {
    return label;
  }

  const raw = (value || label || '').toLowerCase().replace(/_/g, '-');
  if (!raw) {
    return null;
  }

  return OPTION_LABELS[raw] ?? raw.replace(/-/g, ' ').replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function headingLabel(value: string): string {
  return value.toLowerCase().replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function shortDate(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

function isRecent(value: string | null | undefined): boolean {
  if (!value) {
    return false;
  }

  const posted = new Date(value).getTime();
  if (!Number.isFinite(posted)) {
    return false;
  }

  return Date.now() - posted < 14 * 24 * 60 * 60 * 1000;
}

function ShareMark({ name }: { name: 'WhatsApp' | 'LinkedIn' | 'X' | 'Facebook' }) {
  const common = 'h-[18px] w-[18px]';

  if (name === 'WhatsApp') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    );
  }

  if (name === 'LinkedIn') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  }

  if (name === 'X') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }

  return (
    <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function FactIcon({ name, light = false }: { name: 'pin' | 'people' | 'clock' | 'calendar'; light?: boolean }) {
  const common = `h-[18px] w-[18px] shrink-0 ${light ? 'text-white' : 'text-[#244034]'}`;

  if (name === 'pin') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z" strokeLinejoin="round" />
        <circle cx="12" cy="11" r="2" />
      </svg>
    );
  }

  if (name === 'people') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 19c.6-2.6 2.8-4 5.5-4s4.9 1.4 5.5 4" strokeLinecap="round" />
        <circle cx="17" cy="9" r="2" />
        <path d="M16 15c1.8.3 3.2 1.4 3.8 3" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === 'clock') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4.5l3 2" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3.5V7M16 3.5V7M4 10h16" strokeLinecap="round" />
    </svg>
  );
}

const JobRead: React.FC<{ id: string; country?: string | null }> = ({ id, country = null }) => {
  const { isAuthenticated } = useAuth();
  const [job, setJob] = useState<JobListing | null>(null);
  const [related, setRelated] = useState<MorningListJob[]>([]);
  const [shareUrl, setShareUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setShareUrl(window.location.href);
  }, [id]);

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

  useEffect(() => {
    if (!country) {
      setRelated([]);
      return;
    }

    let cancelled = false;

    jobsApiService
      .morningList(country, 8)
      .then((response) => {
        if (!cancelled) {
          setRelated((response.data.jobs ?? []).filter((item) => item.id !== id).slice(0, 3));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRelated([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [country, id]);

  const company = job?.companies?.[0]?.name;
  const logo = job?.companies?.[0]?.logo_url;
  const showLogo = Boolean(logo && isCompanyLogoUrl(logo));
  const place = job ? placeOf(job, country) : null;
  const salary = job ? formatSalary(job) : null;
  const applyUrl = job?.application?.url;
  const sections = job?.description ? sectionsOf(job.description) : [];
  const category = job?.categories?.[0]?.name;
  const contract = [optionLabel(job?.job_type), optionLabel(job?.work_mode)].filter(Boolean).join(' · ');
  const posted = job?.timing?.posted_at_formatted || shortDate(job?.timing?.posted_at);
  const listHref = country ? `/?country=${country}` : '/';
  const countryLabel = country ? COUNTRY_NAMES[country] : null;
  const aboutRows = [
    ['Location', place],
    ['Company', company],
    ['Contract', optionLabel(job?.job_type)],
    ['Workplace', optionLabel(job?.work_mode)],
    ['Experience', optionLabel(job?.experience_level)],
    ['Education', optionLabel(job?.education_level)],
    ['Pay', salary],
    ['Posted', posted],
    ['Closes', job?.application?.deadline_formatted],
  ].filter((row): row is [string, string] => Boolean(row[1]));
  const headerFacts = [
    place ? { icon: 'pin' as const, text: place } : null,
    category ? { icon: 'people' as const, text: category } : company ? { icon: 'people' as const, text: company } : null,
    contract ? { icon: 'clock' as const, text: contract } : null,
    posted ? { icon: 'calendar' as const, text: `Posted ${posted}` } : null,
  ].filter((item): item is { icon: 'pin' | 'people' | 'clock' | 'calendar'; text: string } => item !== null);
  const shareTargets: { name: 'WhatsApp' | 'LinkedIn' | 'X' | 'Facebook'; href: string }[] = shareUrl
    ? [
        { name: 'WhatsApp', href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${job?.title ?? 'Role'} ${shareUrl}`)}` },
        { name: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
        { name: 'X', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(job?.title ?? 'Role')}` },
        { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
      ]
    : [];

  const apply = () => {
    if (!job || !applyUrl) {
      return;
    }

    const metadata = {
      job_title: job.title,
      company: job.companies?.[0]?.name,
      application_url: applyUrl,
      country: country ?? undefined,
    };

    if (!isAuthenticated) {
      requireAccount({
        action: 'apply',
        jobId: job.id,
        returnTo: `${window.location.pathname}${window.location.search}`,
        applicationUrl: applyUrl,
        country: country ?? undefined,
        metadata,
      });
      return;
    }

    void userActivitiesService.trackActivity('apply_click', job.id, metadata);
    window.open(applyUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div>
      <section
        className="bg-[#244034] px-4 py-12 sm:px-6 sm:py-16"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.16) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      >
        <div className="mx-auto max-w-6xl">
          <nav aria-label="Breadcrumb" className="text-sm text-white/60">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href={listHref} className="hover:text-white">Today&apos;s list</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-white" aria-current="page">{job?.title ?? 'Role'}</li>
            </ol>
          </nav>

          {isLoading ? (
            <div className="mt-8 space-y-4" aria-hidden="true">
              <div className="h-10 w-2/3 rounded-full bg-white/15" />
              <div className="h-5 w-1/3 rounded-full bg-white/15" />
            </div>
          ) : error || !job ? (
            <p className="mt-8 text-base text-white">{error ?? 'This role could not be loaded.'}</p>
          ) : (
            <>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                {category ? (
                  <span className="inline-flex rounded-full bg-white px-3 py-1 text-sm text-[#141414]">{category}</span>
                ) : null}
                {isRecent(job.timing?.posted_at) ? (
                  <span className="inline-flex rounded-full bg-[#d2f34c] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[#244034]">New</span>
                ) : null}
              </div>
              <div className="mt-4 flex items-start gap-4">
                <CompanyLogo
                  logoUrl={showLogo && logo ? logo : undefined}
                  companyName={company || 'Company'}
                  size={56}
                  className="mt-1 h-14 w-14 shrink-0 rounded-2xl bg-white ring-4 ring-white"
                />
                <h1 className="text-[40px] font-extrabold leading-[1.05] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
                  {job.title}
                </h1>
              </div>
              {headerFacts.length > 0 ? (
                <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-base text-white/80">
                  {headerFacts.map((fact) => (
                    <li key={fact.text} className="flex items-center gap-2">
                      <FactIcon name={fact.icon} light />
                      {fact.text}
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                {applyUrl ? <ApplyButton onClick={apply} tone="lime" /> : null}
                <SaveRoleButton jobId={job.id} country={country} />
                <Link href={listHref} className="text-center text-base font-semibold text-white sm:ms-2">
                  Today&apos;s list
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {job ? (
        <section className="px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="min-w-0 lg:col-span-8">
              {sections.length > 0 ? (
                <div className="space-y-8 text-base leading-7 text-[#141414]">
                  {sections.map((section) => {
                    const blocks = blocksOf(section.body);
                    const list = section.heading !== null && isList(blocks);

                    return (
                      <section key={`${section.heading ?? 'intro'}-${section.body.slice(0, 24)}`}>
                        {section.heading ? (
                          <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-[#141414]">
                            {headingLabel(section.heading)}
                          </h2>
                        ) : null}
                        {section.body ? <SectionBody body={section.body} list={list} /> : null}
                      </section>
                    );
                  })}
                </div>
              ) : (
                <p className="text-base text-black/70">The description is not on this page.</p>
              )}
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                {applyUrl ? <ApplyButton onClick={apply} /> : null}
                <Link
                  href={listHref}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-[#F4F2EE] px-6 text-base font-semibold text-[#244034]"
                >
                  Today&apos;s list
                </Link>
              </div>
              <ReportProblem jobId={job.id} />
            </div>

            <aside className="lg:col-span-4">
              <div className="flex flex-col gap-6 rounded-[28px] bg-[#F4F2EE] p-6 sm:p-8 lg:sticky lg:top-[88px]">
                <h2 className="text-xl font-extrabold tracking-[-0.03em] text-[#141414]">About this role</h2>
                <dl className="flex flex-col divide-y divide-black/10">
                  {aboutRows.map(([label, value]) => (
                    <div key={label} className="flex items-start justify-between gap-6 py-3 first:pt-0 last:pb-0">
                      <dt className="text-sm text-black/45">{label}</dt>
                      <dd className="text-end text-sm font-semibold text-[#141414]">{value}</dd>
                    </div>
                  ))}
                </dl>
                {applyUrl ? <ApplyButton onClick={apply} wide /> : null}
                <p className="text-sm leading-6 text-black/50">
                  The link opens the employer&apos;s own page. Edwuma does not take your application.
                </p>
                {shareTargets.length > 0 ? (
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-black/45">Share</p>
                    <div className="flex items-center gap-1">
                      {shareTargets.map((target) => (
                        <a
                          key={target.name}
                          href={target.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Share on ${target.name}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#244034] hover:bg-white"
                        >
                          <ShareMark name={target.name} />
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </aside>
          </div>

          {related.length > 0 ? (
            <div className="mx-auto mt-16 max-w-6xl sm:mt-24">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-[#141414] sm:text-4xl">
                  {countryLabel ? `More open in ${countryLabel}` : 'More open roles'}
                </h2>
                <Link href={listHref} className="text-base font-semibold text-[#244034]">
                  See all
                </Link>
              </div>
              <ul className="grid gap-4 lg:grid-cols-3 lg:gap-6">
                {related.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/read/${item.id}?country=${country}`}
                      className="group flex h-full flex-col gap-4 rounded-[28px] border border-black/10 bg-white p-6 transition duration-200 hover:-translate-y-0.5 hover:border-[#244034] hover:shadow-[0_16px_40px_rgba(36,64,52,0.12)]"
                    >
                      {item.badges[0] ? (
                        <span className="inline-flex w-fit rounded-full bg-[#F4F2EE] px-3 py-1 text-sm text-[#141414]">{item.badges[0]}</span>
                      ) : null}
                      <h3 className="text-xl font-extrabold tracking-[-0.03em] text-[#141414]">{roleTitle(item.title, item.company)}</h3>
                      <p className="mt-auto text-sm text-black/55">
                        {[item.company, item.place, shortDate(item.posted_at)].filter(Boolean).join(' · ')}
                      </p>
                      <span className="text-sm font-semibold text-[#244034]">View job</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
};

export default JobRead;
