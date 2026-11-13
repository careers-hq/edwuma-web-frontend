'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { AdminError, AdminPageHeader } from '@/components/admin/AdminChrome';
import {
  adminService,
  getApiErrorMessage,
  type AdminActivityPoint,
  type AdminAttention,
  type AdminAuditItem,
  type AdminBreakdown,
  type AdminDashboardStats,
  type AdminTopJob,
} from '@/lib/api/admin';

type WindowDays = 7 | 30;
type ChartSeries = 'signups' | 'searches';

const ATTENTION_HREF: Record<AdminAttention['target'], string | null> = {
  schedules: '/admin/schedules',
  sync: '/admin/sync',
  logos: '/admin/schedules',
  reports: null,
};

export default function AdminOverviewPage() {
  const [days, setDays] = useState<WindowDays>(7);
  const [seriesMode, setSeriesMode] = useState<ChartSeries>('signups');
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setStats(await adminService.getDashboard(days));
    } catch (loadError) {
      setError(getApiErrorMessage(loadError, 'Unable to load admin statistics.'));
    } finally {
      setIsLoading(false);
    }
  }, [days]);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  const pulse = stats?.pulse;
  const attention = stats?.attention ?? [];

  return (
    <div>
      <AdminPageHeader
        title="Overview"
        action={<WindowToggle days={days} onChange={setDays} />}
      />

      {error ? <AdminError message={error} onRetry={loadStats} /> : null}

      {attention.length > 0 ? <AttentionList items={attention} /> : null}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active jobs"
          value={isLoading ? null : String(pulse?.jobs.active ?? 0)}
          hint={isLoading ? '' : `${pulse?.jobs.posted ?? 0} posted · ${pulse?.jobs.expired ?? 0} expired`}
          change={isLoading ? null : changeLabel(pulse?.jobs.posted ?? 0, pulse?.jobs.posted_previous ?? 0)}
        />
        <StatCard
          label="Joined"
          value={isLoading ? null : String(pulse?.people.joined ?? 0)}
          hint={isLoading ? '' : `${pulse?.people.still_active ?? 0} still active`}
          change={isLoading ? null : changeLabel(pulse?.people.joined ?? 0, pulse?.people.joined_previous ?? 0)}
        />
        <StatCard
          label="Apply rate"
          value={isLoading ? null : formatRate(pulse?.apply.rate ?? null)}
          hint={isLoading ? '' : `${pulse?.apply.views ?? 0} views · ${pulse?.apply.clicks ?? 0} clicks`}
          change={isLoading ? null : rateChange(pulse?.apply.rate ?? null, pulse?.apply.rate_previous ?? null)}
        />
        <StatCard
          label="Morning readers"
          value={isLoading ? null : String(pulse?.mornings.country_list ?? 0)}
          hint={isLoading ? '' : morningHint(pulse?.mornings)}
          change={null}
        />
      </section>

      <Link
        href="/admin/sync"
        className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#244034]/10 bg-white px-5 py-3 text-sm text-[#244034] hover:border-[#244034]/30"
      >
        <span className="font-medium">Sync</span>
        <span>
          {isLoading
            ? '—'
            : `${stats?.sync.created ?? 0} created · ${stats?.sync.updated ?? 0} updated · ${stats?.sync.skipped ?? 0} skipped · ${stats?.sync.failed ?? 0} failed`}
        </span>
      </Link>

      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#244034]">Activity</h2>
              <p className="text-sm text-[rgba(0,0,0,0.6)]">
                {isLoading
                  ? '—'
                  : `${seriesTotal(stats?.activity_series ?? [], 'signups')} signups · ${seriesTotal(stats?.activity_series ?? [], 'searches')} searches`}
              </p>
            </div>
            <div className="flex gap-1 rounded-md bg-[#f4f7f5] p-1">
              <SeriesButton active={seriesMode === 'signups'} onClick={() => setSeriesMode('signups')}>
                Signups
              </SeriesButton>
              <SeriesButton active={seriesMode === 'searches'} onClick={() => setSeriesMode('searches')}>
                Searches
              </SeriesButton>
            </div>
          </div>
          <ActivityChart series={stats?.activity_series ?? []} mode={seriesMode} loading={isLoading} />
        </CardContent>
      </Card>

      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-[#244034]">Catalogue</h2>
            <Breakdown title="Status" items={stats?.jobs.by_status ?? []} loading={isLoading} empty="No jobs yet." />
            <dl className="mt-5 space-y-3 border-t border-gray-100 pt-4 text-sm">
              <CatalogueRow
                label="Logos"
                value={isLoading ? null : `${stats?.jobs.logos.with_logo ?? 0} of ${(stats?.jobs.logos.with_logo ?? 0) + (stats?.jobs.logos.missing ?? 0)}`}
              />
              <CatalogueRow label="On the morning list" value={isLoading ? null : stats?.jobs.on_morning_list ?? 0} />
            </dl>
            {(stats?.reports.total ?? 0) > 0 ? (
              <Breakdown title="Reports" items={stats?.reports.by_reason ?? []} loading={false} />
            ) : null}
            <Breakdown title="Work mode" items={stats?.jobs.by_work_mode ?? []} loading={isLoading} empty="No active jobs." />
            <Breakdown title="Country" items={stats?.jobs.by_country ?? []} loading={isLoading} empty="No active jobs." />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-[#244034]">Demand</h2>
            <h3 className="mt-5 text-sm font-medium text-[#244034]">Most viewed jobs</h3>
            <TopJobs jobs={stats?.top_jobs ?? []} loading={isLoading} />
            <h3 className="mt-6 text-sm font-medium text-[#244034]">Searches</h3>
            <Breakdown title="" items={stats?.top_searches ?? []} loading={isLoading} />
          </CardContent>
        </Card>
      </section>

      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-[#244034]">Recent changes</h2>
            <Link href="/admin/audit-log" className="text-sm font-medium text-[#244034] underline-offset-2 hover:underline">
              Audit log
            </Link>
          </div>
          <RecentAudit items={stats?.recent_audit ?? []} loading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}

function AttentionList({ items }: { items: AdminAttention[] }) {
  return (
    <section className="mb-6 rounded-lg border border-[#244034]/15 bg-white">
      <h2 className="px-5 pt-4 text-sm font-semibold text-[#244034]">Needs attention</h2>
      <ul className="divide-y divide-gray-100">
        {items.map((item) => {
          const href = ATTENTION_HREF[item.target];
          const body = (
            <span className="flex items-baseline justify-between gap-4">
              <span className="font-medium text-[#244034]">{item.label}</span>
              <span className="text-sm text-[rgba(0,0,0,0.6)]">{item.detail}</span>
            </span>
          );
          return (
            <li key={`${item.target}-${item.label}-${item.detail}`} className="px-5 py-3 text-sm">
              {href ? <Link href={href} className="block hover:opacity-80">{body}</Link> : body}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function WindowToggle({ days, onChange }: { days: WindowDays; onChange: (days: WindowDays) => void }) {
  return (
    <div className="flex gap-1 rounded-md bg-white p-1">
      {([7, 30] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={option === days ? 'rounded-md bg-[#244034] px-3 py-1.5 text-sm font-medium text-white' : 'rounded-md px-3 py-1.5 text-sm font-medium text-[#244034]'}
        >
          {option} days
        </button>
      ))}
    </div>
  );
}

function SeriesButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={active ? 'rounded bg-white px-3 py-1 text-sm font-medium text-[#244034] shadow-sm' : 'rounded px-3 py-1 text-sm text-[rgba(0,0,0,0.55)]'}
    >
      {children}
    </button>
  );
}

function StatCard({
  label,
  value,
  hint,
  change,
}: {
  label: string;
  value: string | null;
  hint: string;
  change: string | null;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm font-medium text-[rgba(0,0,0,0.6)]">{label}</p>
        <p className="mt-2 text-3xl font-bold text-[#244034]">{value ?? '—'}</p>
        <p className="mt-2 text-xs text-[rgba(0,0,0,0.5)]">{hint || ' '}</p>
        {change ? <p className="mt-1 text-xs font-medium text-[#244034]">{change}</p> : null}
      </CardContent>
    </Card>
  );
}

function ActivityChart({
  series,
  mode,
  loading,
}: {
  series: AdminActivityPoint[];
  mode: ChartSeries;
  loading: boolean;
}) {
  const peak = Math.max(
    ...series.flatMap((point) => [point.views, point.apply_clicks, point[mode]]),
    1
  );
  const labelEvery = series.length > 14 ? 5 : 2;

  if (loading) {
    return <div className="mt-6 h-44 animate-pulse rounded-lg bg-[#f4f7f5]" />;
  }

  if (series.length === 0) {
    return <p className="mt-6 text-sm text-[rgba(0,0,0,0.6)]">No activity recorded yet.</p>;
  }

  return (
    <div className="mt-6">
      <div className="flex h-44 items-end gap-1 sm:gap-1.5">
        {series.map((point) => (
          <div key={point.date} className="flex h-full min-w-0 flex-1 items-end gap-px" title={chartTitle(point)}>
            <div className="w-1/3 rounded-t bg-[#244034]" style={{ height: barHeight(point.views, peak) }} />
            <div className="w-1/3 rounded-t bg-[#d2f34c]" style={{ height: barHeight(point.apply_clicks, peak) }} />
            <div className="w-1/3 rounded-t bg-[#244034]/35" style={{ height: barHeight(point[mode], peak) }} />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-1 sm:gap-1.5">
        {series.map((point, index) => (
          <span key={point.date} className="flex-1 truncate text-center text-[10px] text-[rgba(0,0,0,0.45)]">
            {index % labelEvery === 0 ? shortDate(point.date) : ''}
          </span>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-[rgba(0,0,0,0.65)]">
        <Legend swatch="bg-[#244034]" label="Views" />
        <Legend swatch="bg-[#d2f34c]" label="Apply clicks" />
        <Legend swatch="bg-[#244034]/35" label={mode === 'signups' ? 'Signups' : 'Searches'} />
      </div>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-sm ${swatch}`} /> {label}
    </span>
  );
}

function Breakdown({
  title,
  items,
  loading,
  empty = 'Nothing in this window.',
}: {
  title: string;
  items: AdminBreakdown[];
  loading: boolean;
  empty?: string;
}) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className={title ? 'mt-5' : 'mt-3'}>
      {title ? <h3 className="text-sm font-medium text-[#244034]">{title}</h3> : null}
      {loading ? (
        <div className="mt-3 space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-8 animate-pulse rounded bg-[#f4f7f5]" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="mt-3 text-sm text-[rgba(0,0,0,0.6)]">{empty}</p>
      ) : (
        <div className="mt-3 space-y-3">
          {items.map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex items-center justify-between gap-4 text-sm">
                <span className="text-[#244034]">{item.label}</span>
                <span className="font-medium text-[#244034]">{item.value}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#244034]/10">
                <div
                  className="h-full rounded-full bg-[#244034]"
                  style={{ width: `${Math.max((item.value / max) * 100, item.value > 0 ? 4 : 0)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TopJobs({ jobs, loading }: { jobs: AdminTopJob[]; loading: boolean }) {
  if (loading) {
    return <p className="mt-3 text-sm text-[rgba(0,0,0,0.55)]">Loading jobs…</p>;
  }
  if (jobs.length === 0) {
    return <p className="mt-3 text-sm text-[rgba(0,0,0,0.6)]">No job views in this window.</p>;
  }
  return (
    <ol className="mt-2 divide-y divide-gray-100">
      {jobs.map((job, index) => (
        <li key={job.id} className="flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            <Link href={`/jobs/${job.id}`} className="block truncate font-medium text-[#244034] hover:underline">
              {index + 1}. {job.title}
            </Link>
            <p className="truncate text-sm text-[rgba(0,0,0,0.55)]">
              {[job.company, `${job.views} views`, `${job.apply_clicks} apply clicks`].filter(Boolean).join(' · ')}
            </p>
          </div>
          <p className="shrink-0 text-sm font-semibold text-[#244034]">{formatRate(job.apply_rate)}</p>
        </li>
      ))}
    </ol>
  );
}

function RecentAudit({ items, loading }: { items: AdminAuditItem[]; loading: boolean }) {
  if (loading) {
    return <p className="mt-4 text-sm text-[rgba(0,0,0,0.55)]">Loading changes…</p>;
  }
  if (items.length === 0) {
    return <p className="mt-4 text-sm text-[rgba(0,0,0,0.6)]">No account changes in the log.</p>;
  }
  return (
    <ul className="mt-4 divide-y divide-gray-100">
      {items.map((item) => (
        <li key={item.id} className="flex items-baseline justify-between gap-4 py-3 text-sm">
          <span className="text-[#244034]">
            <span className="font-medium">{item.label}</span>
            {item.actor_email ? <span className="text-[rgba(0,0,0,0.55)]"> · {item.actor_email}</span> : null}
          </span>
          <span className="shrink-0 text-[rgba(0,0,0,0.5)]">{shortWhen(item.created_at)}</span>
        </li>
      ))}
    </ul>
  );
}

function CatalogueRow({ label, value }: { label: string; value: string | number | null }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-[rgba(0,0,0,0.65)]">{label}</dt>
      <dd className="font-medium text-[#244034]">{value ?? '—'}</dd>
    </div>
  );
}

function morningHint(mornings: AdminDashboardStats['pulse']['mornings'] | undefined): string {
  if (!mornings) return '';
  const parts = [`${mornings.paid} paid`, `${mornings.on_list} jobs on the list`];
  if (mornings.invites > 0) parts.push(`${mornings.invites} invites open`);
  return parts.join(' · ');
}

function seriesTotal(series: AdminActivityPoint[], key: 'signups' | 'searches'): number {
  return series.reduce((total, point) => total + point[key], 0);
}

function changeLabel(current: number, previous: number): string | null {
  if (current === 0 && previous === 0) return null;
  if (previous === 0) return `+${current}`;
  const pct = Math.round(((current - previous) / previous) * 100);
  return `${pct > 0 ? '+' : ''}${pct}% vs previous`;
}

function rateChange(current: number | null, previous: number | null): string | null {
  if (current === null || previous === null) return null;
  const points = Math.round((current - previous) * 10) / 10;
  const text = Number.isInteger(points) ? String(Math.abs(points)) : Math.abs(points).toFixed(1);
  if (points === 0) return '0 pts vs previous';
  return `${points > 0 ? '+' : '−'}${text} pts vs previous`;
}

function formatRate(value: number | null): string {
  if (value === null || Number.isNaN(value)) return '—';
  const rounded = Math.round(value * 10) / 10;
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)}%`;
}

function barHeight(value: number, peak: number): string {
  if (value <= 0) return '0%';
  return `${Math.max((value / peak) * 100, 8)}%`;
}

function shortDate(value: string): string {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function shortWhen(value: string): string {
  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function chartTitle(point: AdminActivityPoint): string {
  return `${shortDate(point.date)}: ${point.views} views, ${point.apply_clicks} apply clicks, ${point.signups} signups, ${point.searches} searches`;
}
