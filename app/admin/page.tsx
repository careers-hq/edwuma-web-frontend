'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminError } from '@/components/admin/AdminChrome';
import { Table, TableMessage, Td, Th, Tr } from '@/components/ui/DataTable';
import {
  BreakdownBars,
  DemandBars,
  Donut,
  MetricCard,
  MiniIcon,
  Panel,
  RateColumns,
  ViewsTrend,
  WindowPills,
} from '@/components/workspace/DashboardWidgets';
import {
  adminService,
  getApiErrorMessage,
  type AdminActivityPoint,
  type AdminAttention,
  type AdminAuditItem,
  type AdminDashboardStats,
  type AdminTopJob,
} from '@/lib/api/admin';

type WindowDays = 7 | 30;

const ATTENTION_HREF: Record<AdminAttention['target'], string | null> = {
  schedules: '/admin/schedules',
  sync: '/admin/sync',
  logos: '/admin/schedules',
  reports: null,
};

const MODE_COLORS = ['#244034', '#3d6b56', '#7fa37a', '#d2f34c', '#e7e5e4', '#a8a29e'];

export default function AdminOverviewPage() {
  const [days, setDays] = useState<WindowDays>(7);
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
  const series = stats?.activity_series ?? [];
  const attention = stats?.attention ?? [];
  const workModes = (stats?.jobs.by_work_mode ?? []).map((item, index) => ({
    label: item.label.trim() || 'Not set',
    value: item.value,
    color: MODE_COLORS[index % MODE_COLORS.length],
  }));
  const modeTotal = workModes.reduce((sum, item) => sum + item.value, 0);
  const leadMode = [...workModes].sort((a, b) => b.value - a.value)[0];
  const ratePoints = series.slice(-5).map((point) => ({
    date: point.date,
    rate: point.views > 0 ? (point.apply_clicks / point.views) * 100 : 0,
  }));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <WindowPills value={days} options={[7, 30]} onChange={(value) => setDays(value as WindowDays)} />
        <Link href="/admin/sync" className="text-sm text-[#6b7280] hover:text-[#1c1f24]">
          {isLoading
            ? 'Sync'
            : `Sync · ${stats?.sync.created ?? 0} created · ${stats?.sync.updated ?? 0} updated · ${stats?.sync.failed ?? 0} failed`}
        </Link>
      </div>

      {error ? <AdminError message={error} onRetry={loadStats} /> : null}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={<MiniIcon><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M3 7h18v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" /></MiniIcon>}
          label="Active jobs"
          value={isLoading ? null : formatCount(pulse?.jobs.active ?? 0)}
          hint={isLoading ? '' : `${formatCount(pulse?.jobs.posted ?? 0)} posted · ${formatCount(pulse?.jobs.expired ?? 0)} expired`}
          pill={isLoading ? null : countDelta(pulse?.jobs.posted ?? 0, pulse?.jobs.posted_previous ?? 0)}
        />
        <MetricCard
          icon={<MiniIcon><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></MiniIcon>}
          label="Apply clicks"
          value={isLoading ? null : formatCount(pulse?.apply.clicks ?? 0)}
          hint={isLoading ? '' : `of ${formatCount(pulse?.apply.views ?? 0)} views`}
          pill={isLoading ? null : ratePill(pulse?.apply.rate ?? null)}
        />
        <MetricCard
          icon={<MiniIcon><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="3" /></MiniIcon>}
          label="Joined"
          value={isLoading ? null : formatCount(pulse?.people.joined ?? 0)}
          hint={isLoading ? '' : `${formatCount(pulse?.people.still_active ?? 0)} still active`}
          pill={isLoading ? null : countDelta(pulse?.people.joined ?? 0, pulse?.people.joined_previous ?? 0)}
        />
        <MetricCard
          icon={<MiniIcon><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2" /></MiniIcon>}
          label="Morning lists"
          value={isLoading ? null : formatCount(pulse?.mornings.country_list ?? 0)}
          hint={isLoading ? '' : morningHint(pulse?.mornings)}
        />
      </section>

      <section className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title="Views"
          action={`${formatCount(seriesTotal(series, 'views'))} views · ${formatCount(seriesTotal(series, 'apply_clicks'))} apply clicks`}
        >
          <ViewsTrend
            loading={isLoading}
            points={series.map((point) => ({
              date: point.date,
              value: point.views,
              secondary: point.apply_clicks,
              tertiary: point.signups,
            }))}
          />
        </Panel>
        <Panel title="Work mode">
          {isLoading ? (
            <div className="h-40 animate-pulse rounded-xl bg-[#f6f7f9]" />
          ) : (
            <>
              <Donut
                segments={workModes}
                center={modeTotal === 0 ? '0%' : `${Math.round(((leadMode?.value ?? 0) / modeTotal) * 100)}%`}
                caption={leadMode ? leadMode.label : 'No active jobs'}
              />
              <div className="mt-5 border-t border-[#f3f4f6] pt-4">
                <h3 className="mb-3 text-sm font-semibold text-[#1c1f24]">Country</h3>
                <BreakdownBars rows={(stats?.jobs.by_country ?? []).slice(0, 5)} empty="No active jobs." />
              </div>
            </>
          )}
        </Panel>
      </section>

      <section className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Panel title="Apply rate" action="Last 5 days">
          <RateColumns points={ratePoints} loading={isLoading} />
        </Panel>
        <Panel title="Demand">
          <DemandBars
            loading={isLoading}
            rows={[
              { label: 'Views', value: pulse?.apply.views ?? 0 },
              { label: 'Apply clicks', value: pulse?.apply.clicks ?? 0 },
              { label: 'Searches', value: seriesTotal(series, 'searches') },
            ]}
          />
          {(stats?.top_searches.length ?? 0) > 0 ? (
            <ul className="mt-4 space-y-1.5 border-t border-[#f3f4f6] pt-3">
              {stats?.top_searches.slice(0, 4).map((item) => (
                <li key={item.label} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate text-[#3a3f47]">{item.label}</span>
                  <span className="font-medium tabular-nums text-[#1c1f24]">{item.value}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </Panel>
      </section>

      <section className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-5">
        <Panel className="xl:col-span-3" title="Most viewed" bodyClassName="mt-2">
          <TopJobs jobs={stats?.top_jobs ?? []} loading={isLoading} />
        </Panel>
        <div className="space-y-4 xl:col-span-2">
          {attention.length > 0 ? <AttentionList items={attention} /> : null}
          <Panel
            title="Recent changes"
            action={<Link href="/admin/audit-log" className="font-medium text-[#244034] hover:underline">Audit log</Link>}
            bodyClassName="mt-2"
          >
            <RecentAudit items={stats?.recent_audit ?? []} loading={isLoading} />
          </Panel>
        </div>
      </section>
    </div>
  );
}

function AttentionList({ items }: { items: AdminAttention[] }) {
  return (
    <section className="rounded-2xl border border-[#d5e0d4] bg-white">
      <h2 className="px-5 pt-4 text-sm font-semibold text-[#1c1f24]">Needs attention</h2>
      <ul className="max-h-72 divide-y divide-[#f6f7f9] overflow-y-auto">
        {items.map((item) => {
          const href = ATTENTION_HREF[item.target];
          const body = (
            <span className="block">
              <span className="font-medium text-[#1c1f24]">{item.label}</span>
              <span className="mt-0.5 block text-[#6b7280]">{item.detail}</span>
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

function TopJobs({ jobs, loading }: { jobs: AdminTopJob[]; loading: boolean }) {
  if (loading) return <Table><tbody><TableMessage colSpan={4}>Loading jobs…</TableMessage></tbody></Table>;
  if (jobs.length === 0) return <Table><tbody><TableMessage colSpan={4}>No job views in this window.</TableMessage></tbody></Table>;

  return (
    <Table>
      <thead>
        <tr>
          <Th>Role</Th>
          <Th>Views</Th>
          <Th>Apply clicks</Th>
          <Th>Rate</Th>
        </tr>
      </thead>
      <tbody>
        {jobs.map((job) => (
          <Tr key={job.id}>
            <Td className="max-w-[16rem]">
              <Link href={`/jobs/${job.id}`} className="block truncate font-medium text-[#141414] hover:text-[#244034]">
                {job.title}
              </Link>
              <p className="truncate text-xs text-[#8b919a]">{job.company || 'Company unknown'}</p>
            </Td>
            <Td className="tabular-nums">{formatCount(job.views)}</Td>
            <Td className="tabular-nums">{formatCount(job.apply_clicks)}</Td>
            <Td className="font-semibold tabular-nums text-[#141414]">{formatRate(job.apply_rate)}</Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}

function RecentAudit({ items, loading }: { items: AdminAuditItem[]; loading: boolean }) {
  if (loading) return <p className="py-6 text-sm text-[#8b919a]">Loading changes…</p>;
  if (items.length === 0) return <p className="py-6 text-sm text-[#8b919a]">No account changes in the log.</p>;

  return (
    <ul className="divide-y divide-[#f3f4f6]">
      {items.map((item) => (
        <li key={item.id} className="flex items-baseline justify-between gap-3 py-3 text-sm">
          <span className="min-w-0 text-[#1c1f24]">
            <span className="font-medium">{item.label}</span>
            {item.actor_email ? <span className="block truncate text-xs text-[#8b919a]">{item.actor_email}</span> : null}
          </span>
          <span className="shrink-0 text-xs text-[#9aa1ab]">{shortWhen(item.created_at)}</span>
        </li>
      ))}
    </ul>
  );
}

function morningHint(mornings: AdminDashboardStats['pulse']['mornings'] | undefined): string {
  if (!mornings) return '';
  const parts = [`${formatCount(mornings.on_list)} jobs on the list`, `${formatCount(mornings.paid)} paid`];
  if (mornings.invites > 0) parts.push(`${formatCount(mornings.invites)} invites open`);
  return parts.join(' · ');
}

function seriesTotal(series: AdminActivityPoint[], key: 'views' | 'apply_clicks' | 'signups' | 'searches'): number {
  return series.reduce((total, point) => total + point[key], 0);
}

function countDelta(current: number, previous: number): { text: string; tone: 'up' | 'down' | 'neutral' } | null {
  if (current === 0 && previous === 0) return null;
  const diff = current - previous;
  if (diff === 0) return { text: '0', tone: 'neutral' };
  return { text: `${diff > 0 ? '+' : '−'}${Math.abs(diff)}`, tone: diff > 0 ? 'up' : 'down' };
}

function ratePill(rate: number | null): { text: string; tone: 'warm' } | null {
  if (rate === null || Number.isNaN(rate)) return null;
  return { text: formatRate(rate), tone: 'warm' };
}

function formatCount(value: number): string {
  return value.toLocaleString('en-US');
}

function formatRate(value: number | null): string {
  if (value === null || Number.isNaN(value)) return '—';
  const rounded = Math.round(value * 10) / 10;
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)}%`;
}

function shortWhen(value: string): string {
  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
