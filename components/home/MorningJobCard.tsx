import React from 'react';
import Link from 'next/link';
import type { MorningListJob, MorningListSalary } from '@/lib/api/jobs';

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

const MorningJobCard: React.FC<MorningJobCardProps> = ({ job, country, note }) => {
  const salary = job.salary ? formatSalary(job.salary) : null;
  const facts = [job.company, job.place, salary].filter(Boolean).join(' · ');

  return (
    <article className="flex flex-col gap-3 border-b border-gray-200 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
      <div className="min-w-0">
        <h2 className="!text-lg font-semibold !leading-6 !text-gray-900">{roleTitle(job.title, job.company)}</h2>
        {facts ? <p className="mt-1 text-sm leading-6 text-gray-600">{facts}</p> : null}
        {note ? <p className="mt-1 text-sm leading-6 text-gray-900">{note}</p> : null}
        {(job.badges ?? []).length > 0 ? (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {(job.badges ?? []).map((badge) => (
              <li
                key={badge}
                className="inline-flex h-6 items-center rounded-full border border-gray-300 px-2 text-xs text-gray-700"
              >
                {badge}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-4">
        {job.application_url ? (
          <a
            href={job.application_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center rounded-md bg-[#244034] px-4 text-sm font-medium text-white"
          >
            Apply
          </a>
        ) : null}
        <Link
          href={`/read/${job.id}?country=${country}`}
          className="text-sm font-medium text-[#244034] underline underline-offset-4"
        >
          Read
        </Link>
      </div>
    </article>
  );
};

export default MorningJobCard;
