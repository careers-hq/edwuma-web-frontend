'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CompanyLogo, isCompanyLogoUrl } from '@/components/ui/CompanyLogo';
import { EDWUMA_TEAM_ICON } from '@/lib/blog/covers';
import { savedJobsService } from '@/lib/api/savedJobs';
import type { MorningListJob, MorningListSalary } from '@/lib/api/jobs';
import { useAuth } from '@/lib/auth';
import { clearSavedCache, loadSaved, rememberSaved, subscribeSaved, type SavedMap } from '@/lib/savedJobsState';
import { requireAccount } from '@/lib/utils/jobApplication';

interface MorningJobCardProps {
  job: MorningListJob;
  country: string;
  note?: string;
}

function formatAmount(value: number): string | null {
  if (!Number.isFinite(value)) {
    return null;
  }

  return new Intl.NumberFormat('en', { maximumFractionDigits: 0 }).format(value);
}

function formatSalary(salary: MorningListSalary): string | null {
  const min = salary.min !== null ? Number(salary.min) : null;
  const max = salary.max !== null ? Number(salary.max) : null;
  const low = min !== null && Number.isFinite(min) && min > 0 ? formatAmount(min) : null;
  const high = max !== null && Number.isFinite(max) && max > 0 ? formatAmount(max) : null;
  const amount = low && high && low !== high ? `${low}–${high}` : low || high;

  if (!amount) {
    return null;
  }

  return salary.currency ? `${amount} ${salary.currency.toUpperCase()}` : amount;
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

function experienceLine(years: number | null): string | null {
  if (years === null || years < 1) {
    return null;
  }

  const level = years <= 2 ? 'Entry' : years <= 4 ? 'Mid-level' : 'Senior';
  const unit = years === 1 ? 'yr' : 'yrs';

  return `${level} · ${years} ${unit}`;
}

function closingLine(value: string | null | undefined): { text: string; soon: boolean } | null {
  if (!value) {
    return null;
  }

  const deadline = new Date(value);
  if (!Number.isFinite(deadline.getTime())) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(deadline);
  end.setHours(0, 0, 0, 0);
  const days = Math.round((end.getTime() - today.getTime()) / 86400000);

  if (days < 0) {
    return null;
  }

  const date = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(deadline);
  const left = days === 0 ? 'today' : days === 1 ? '1 day left' : `${days} days left`;

  return {
    text: days === 0 ? `Closes ${date} · today` : `Closes ${date} · ${left}`,
    soon: days <= 10,
  };
}

function closingBadge(badges: string[]): { text: string; soon: boolean } | null {
  const badge = badges.find((item) => item.startsWith('Closes '));

  return badge ? { text: badge, soon: false } : null;
}

function factPills(badges: string[], salary: string | null): string[] {
  const pills = badges.filter((badge) => !/^(Entry|Mid-level|Senior), \d+ years?$/.test(badge) && !badge.startsWith('Closes '));

  if (salary) {
    pills.push(salary);
  }

  return pills;
}

function PinIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-black/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z" strokeLinejoin="round" />
      <circle cx="12" cy="11" r="2" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-black/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7M3 12h18" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4.5l3 2" strokeLinecap="round" />
    </svg>
  );
}

function SaveButton({ jobId, country }: { jobId: string; country: string }) {
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

  const toggle = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      requireAccount({
        action: 'save',
        jobId,
        returnTo: `/read/${jobId}?country=${encodeURIComponent(country)}`,
        country,
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
      className="relative z-10 inline-flex h-11 w-11 items-center justify-center rounded-xl text-[#141414]"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill={savedId ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M7 4.5h10a1 1 0 0 1 1 1V20l-6-3.5L6 20V5.5a1 1 0 0 1 1-1z" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function CompanyMark({ name, logoUrl }: { name: string; logoUrl?: string | null }) {
  if (logoUrl && isCompanyLogoUrl(logoUrl)) {
    return (
      <CompanyLogo
        logoUrl={logoUrl}
        companyName={name}
        size={48}
        className="h-12 w-12 shrink-0 rounded-xl border border-black/10"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={EDWUMA_TEAM_ICON} alt="" className="h-12 w-12 shrink-0 rounded-full" />
  );
}

const MorningJobCard: React.FC<MorningJobCardProps> = ({ job, country, note }) => {
  const title = roleTitle(job.title, job.company);
  const salary = job.salary ? formatSalary(job.salary) : null;
  const experience = experienceLine(job.years_experience);
  const closing = closingLine(job.closes_at) ?? closingBadge(job.badges ?? []);
  const pills = factPills(job.badges ?? [], salary);
  const company = job.company || 'Company';

  return (
    <article className="relative rounded-2xl bg-white px-4 py-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(36,64,52,0.12)] sm:px-5 sm:py-5">
      <div className="flex items-start gap-3 sm:gap-4">
        <CompanyMark name={company} logoUrl={job.logo_url} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-[17px] font-bold leading-6 tracking-[-0.02em] text-[#141414]">{title}</h3>
              {job.company ? <p className="mt-0.5 text-sm text-black/70">{job.company}</p> : null}
              {job.place || experience ? (
                <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-black/55">
                  {job.place ? (
                    <span className="inline-flex items-center gap-1.5">
                      <PinIcon />
                      {job.place}
                    </span>
                  ) : null}
                  {experience ? (
                    <span className="inline-flex items-center gap-1.5">
                      <BriefcaseIcon />
                      {experience}
                    </span>
                  ) : null}
                </p>
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              <SaveButton jobId={job.id} country={country} />
              <Link
                href={`/read/${job.id}?country=${encodeURIComponent(country)}`}
                className="relative z-10 inline-flex h-11 items-center rounded-xl border border-[#141414] bg-white px-4 text-sm font-semibold text-[#141414]"
              >
                View job
              </Link>
            </div>
          </div>
          {pills.length > 0 || closing ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {pills.map((pill) => (
                <li key={pill} className="inline-flex h-7 items-center rounded-full bg-[#F4F2EE] px-2.5 text-xs font-medium text-[#141414]">
                  {pill}
                </li>
              ))}
              {closing ? (
                <li
                  className={`inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium ${closing.soon ? 'bg-[#F8D48A] text-[#141414]' : 'bg-[#F4F2EE] text-[#141414]'}`}
                >
                  <ClockIcon />
                  {closing.text}
                </li>
              ) : null}
            </ul>
          ) : null}
          {note ? <p className="mt-2 text-sm leading-6 text-[#141414]">{note}</p> : null}
        </div>
      </div>
      <Link href={`/read/${job.id}?country=${country}`} className="after:absolute after:inset-0">
        <span className="sr-only">View {title}</span>
      </Link>
    </article>
  );
};

export default MorningJobCard;
