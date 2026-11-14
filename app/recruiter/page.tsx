'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  DotLabel,
  downloadCsv,
  StatusPill,
  Table,
  TableCard,
  TableMessage,
  TablePager,
  TableToolbar,
  Td,
  Th,
  Tr,
} from '@/components/ui/DataTable';
import { Donut, MetricCard, MiniIcon } from '@/components/workspace/DashboardWidgets';
import { getApiErrorMessage } from '@/lib/api/admin';
import { jobsApiService, type JobListing, type JobSearchFilters } from '@/lib/api/jobs';

type RoleStatus = 'active' | 'filled' | 'expired' | 'all';

type Catalogue = {
  active: number;
  filled: number;
  expired: number;
  inactive: number;
  remote: number;
  onsite: number;
  hybrid: number;
};

const STATUS_OPTIONS: Array<{ value: RoleStatus; label: string }> = [
  { value: 'active', label: 'Open' },
  { value: 'filled', label: 'Filled' },
  { value: 'expired', label: 'Expired' },
  { value: 'all', label: 'All' },
];

const MODE_DOT: Record<string, string> = {
  remote: '#244034',
  hybrid: '#3d6b56',
  'on-site': '#00bf58',
  'field-work': '#7fa37a',
  'travel-required': '#d2f34c',
  'project-based': '#1d3c34',
};

const EMPTY_CATALOGUE: Catalogue = {
  active: 0,
  filled: 0,
  expired: 0,
  inactive: 0,
  remote: 0,
  onsite: 0,
  hybrid: 0,
};

function statusTone(value?: string): 'success' | 'warning' | 'danger' | 'neutral' | 'brand' {
  if (value === 'active') return 'success';
  if (value === 'filled') return 'brand';
  if (value === 'expired') return 'danger';
  return 'neutral';
}

async function countJobs(filters: JobSearchFilters): Promise<number> {
  const response = await jobsApiService.searchJobs({ ...filters, page: 1, per_page: 1 });
  return response.data.pagination.total ?? 0;
}

export default function RecruiterDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [status, setStatus] = useState<RoleStatus>('active');
  const [sort, setSort] = useState<'desc' | 'asc'>('desc');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [catalogue, setCatalogue] = useState<Catalogue>(EMPTY_CATALOGUE);
  const [error, setError] = useState<string | null>(null);
  const [loadingCatalogue, setLoadingCatalogue] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    setPage(1);
  }, [query]);

  const loadCatalogue = useCallback(async () => {
    try {
      setLoadingCatalogue(true);
      setError(null);
      const [active, filled, expired, inactive, remote, onsite, hybrid] = await Promise.all([
        countJobs({ status: 'active' }),
        countJobs({ status: 'filled' }),
        countJobs({ status: 'expired' }),
        countJobs({ status: 'inactive' }),
        countJobs({ status: 'active', work_mode: 'remote' }),
        countJobs({ status: 'active', work_mode: 'on-site' }),
        countJobs({ status: 'active', work_mode: 'hybrid' }),
      ]);
      setCatalogue({ active, filled, expired, inactive, remote, onsite, hybrid });
    } catch (loadError) {
      setError(getApiErrorMessage(loadError, 'Unable to load roles.'));
    } finally {
      setLoadingCatalogue(false);
    }
  }, []);

  const loadJobs = useCallback(async () => {
    try {
      setLoadingJobs(true);
      setError(null);
      const response = await jobsApiService.searchJobs({
        search: query || undefined,
        status: status === 'all' ? undefined : status,
        page,
        per_page: pageSize,
        sort_by: 'posted_at',
        sort_direction: sort,
      });
      setJobs(response.data.jobs ?? []);
      setTotal(response.data.pagination.total ?? 0);
      setLastPage(response.data.pagination.last_page ?? 1);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError, 'Unable to load roles.'));
    } finally {
      setLoadingJobs(false);
    }
  }, [page, pageSize, query, sort, status]);

  useEffect(() => {
    void loadCatalogue();
  }, [loadCatalogue]);

  useEffect(() => {
    void loadJobs();
  }, [loadJobs]);

  const catalogueTotal = catalogue.active + catalogue.filled + catalogue.expired + catalogue.inactive;
  const openShare = catalogueTotal === 0 ? 0 : Math.round((catalogue.active / catalogueTotal) * 100);
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const submitSearch = (value: string) => {
    router.replace(value ? `/recruiter?q=${encodeURIComponent(value)}` : '/recruiter');
  };

  const exportRoles = () => {
    downloadCsv('roles.csv', [
      ['Role', 'Company', 'Place', 'Work mode', 'Type', 'Posted', 'Status'],
      ...jobs.map((job) => {
        const place = job.locations?.[0];
        const where = place ? [place.city || place.name, place.country].filter(Boolean).join(', ') : '';
        return [
          job.title,
          job.companies?.[0]?.name,
          where,
          job.work_mode?.label,
          job.job_type?.label,
          job.timing?.posted_at_formatted,
          job.status?.label,
        ];
      }),
    ]);
  };

  return (
    <div>
      {error ? (
        <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-[#f6d0d0] bg-[#fff6f6] px-4 py-3 text-sm text-[#b42318] sm:flex-row sm:items-center sm:justify-between">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => {
              void loadCatalogue();
              void loadJobs();
            }}
            className="rounded-lg border border-[#f6d0d0] px-3 py-1.5 text-sm font-medium"
          >
            Try again
          </button>
        </div>
      ) : null}

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section className="rounded-2xl border border-[#eceef2] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-[#1c1f24]">
              <MiniIcon><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M3 7h18v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" /></MiniIcon>
              Open roles
            </h2>
            <span className="text-xs text-[#8b919a]">{today}</span>
          </div>
          <div className="mt-4">
            {loadingCatalogue ? (
              <div className="h-40 animate-pulse rounded-xl bg-[#f6f7f9]" />
            ) : (
              <Donut
                center={`${openShare}%`}
                caption={catalogueTotal === 0 ? 'No roles yet' : `${catalogue.active} of ${catalogueTotal} open`}
                segments={[
                  { label: 'Open', value: catalogue.active, color: '#244034' },
                  { label: 'Filled', value: catalogue.filled, color: '#3d6b56' },
                  { label: 'Expired', value: catalogue.expired, color: '#d2f34c' },
                  { label: 'Inactive', value: catalogue.inactive, color: '#e7e5e4' },
                ]}
              />
            )}
          </div>
        </section>

        <div className="grid gap-4">
          <MetricCard
            icon={<MiniIcon><path d="M4 7h16M7 7V5h10v2M6 11h.01M6 15h.01M10 11h8M10 15h8" /></MiniIcon>}
            label="Remote"
            value={loadingCatalogue ? null : catalogue.remote.toLocaleString('en-US')}
            hint="Open roles"
          />
          <MetricCard
            icon={<MiniIcon><path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></MiniIcon>}
            label="On-site"
            value={loadingCatalogue ? null : catalogue.onsite.toLocaleString('en-US')}
            hint="Open roles"
          />
          <MetricCard
            icon={<MiniIcon><path d="M4 18V6h7v12M11 10h9v8H11" /></MiniIcon>}
            label="Hybrid"
            value={loadingCatalogue ? null : catalogue.hybrid.toLocaleString('en-US')}
            hint="Open roles"
          />
        </div>
      </section>

      <TableCard className="mt-4">
        <TableToolbar
          search={query}
          onSearch={submitSearch}
          searchPlaceholder="Search roles"
          onExport={exportRoles}
          sort={{
            value: sort,
            options: [
              { value: 'desc', label: 'Newest posted' },
              { value: 'asc', label: 'Oldest posted' },
            ],
            onChange: (value) => {
              setSort(value as 'desc' | 'asc');
              setPage(1);
            },
          }}
          filter={
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setStatus(option.value);
                    setPage(1);
                  }}
                  className={
                    status === option.value
                      ? 'rounded-lg bg-[#244034] px-3 py-1.5 text-sm font-semibold text-white'
                      : 'rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-[#244034]'
                  }
                >
                  {option.label}
                </button>
              ))}
            </div>
          }
        />
        <Table>
          <thead>
            <tr>
              <Th>Role</Th>
              <Th>Company</Th>
              <Th>Place</Th>
              <Th>Work mode</Th>
              <Th>Type</Th>
              <Th>Status</Th>
              <Th>Posted</Th>
            </tr>
          </thead>
          <tbody>
            {loadingJobs ? (
              <TableMessage colSpan={7}>Loading roles…</TableMessage>
            ) : jobs.length === 0 ? (
              <TableMessage colSpan={7}>No roles match.</TableMessage>
            ) : (
              jobs.map((job) => {
                const company = job.companies?.[0]?.name;
                const place = job.locations?.[0];
                const where = place ? [place.city || place.name, place.country].filter(Boolean).join(', ') : '';
                const mode = job.work_mode?.value;
                return (
                  <Tr key={job.id}>
                    <Td className="max-w-[16rem]">
                      <Link href={`/jobs/${job.slug || job.id}`} className="block truncate font-medium text-[#141414] hover:text-[#244034]">
                        {job.title}
                      </Link>
                    </Td>
                    <Td className="max-w-[10rem] truncate">{company || '—'}</Td>
                    <Td className="max-w-[10rem] truncate">{where || '—'}</Td>
                    <Td>
                      {job.work_mode?.label ? (
                        <DotLabel color={MODE_DOT[mode] || '#9aa1ab'}>{job.work_mode.label}</DotLabel>
                      ) : (
                        '—'
                      )}
                    </Td>
                    <Td>{job.job_type?.label || '—'}</Td>
                    <Td>
                      <StatusPill tone={statusTone(job.status?.value)}>{job.status?.label || '—'}</StatusPill>
                    </Td>
                    <Td className="whitespace-nowrap text-[#6b7280]">{job.timing?.posted_at_formatted || '—'}</Td>
                  </Tr>
                );
              })
            )}
          </tbody>
        </Table>
        <TablePager
          page={page}
          lastPage={lastPage}
          total={total}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </TableCard>
    </div>
  );
}
