'use client';

import React, { useEffect, useState } from 'react';
import MorningJobCard from '@/components/home/MorningJobCard';
import { jobsApiService, type MorningListJob } from '@/lib/api/jobs';

function matchLine(matched: number, shown: number): string {
  if (matched <= 0) {
    return 'Nothing you can apply to today.';
  }

  if (matched === 1) {
    return '1 matches this morning. This is it.';
  }

  if (matched === shown && matched === 2) {
    return '2 match this morning. These are both.';
  }

  if (matched <= shown) {
    return `${matched} match this morning. These are all of them.`;
  }

  return `${matched} match this morning. These are ${shown}.`;
}

const MorningPreview: React.FC<{
  country: string;
  kind: string;
  years: number;
}> = ({ country, kind, years }) => {
  const [jobs, setJobs] = useState<MorningListJob[]>([]);
  const [matched, setMatched] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    jobsApiService
      .morningList(country, 5, { kindOfWork: kind, years })
      .then((response) => {
        if (!cancelled) {
          setJobs(response.data.jobs ?? []);
          setMatched(response.data.matched ?? 0);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setJobs([]);
          setMatched(0);
          setError('The morning could not be loaded.');
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
  }, [country, kind, years, reloadKey]);

  if (isLoading) {
    return (
      <div className="space-y-6" aria-hidden="true">
        {[0, 1, 2].map((row) => (
          <div key={row} className="border-b border-gray-200 py-6">
            <div className="h-5 w-2/3 rounded bg-gray-100" />
            <div className="mt-3 h-4 w-1/3 rounded bg-gray-100" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  return (
    <div>
      <p className="text-base text-gray-900">{matchLine(matched, jobs.length)}</p>
      {jobs.map((job) => (
        <MorningJobCard
          key={job.id}
          job={job}
          country={country}
          note={job.stretch ? 'This one asks for more years than you have.' : undefined}
        />
      ))}
    </div>
  );
};

export default MorningPreview;
