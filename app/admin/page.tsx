'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { AdminError, AdminPageHeader } from '@/components/admin/AdminChrome';
import {
  adminService,
  getApiErrorMessage,
  type AdminActivityPoint,
  type AdminBreakdown,
  type AdminDashboardStats,
} from '@/lib/api/admin';

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admins',
  user: 'Job seekers',
  recruiter: 'Recruiters',
};

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setStats(await adminService.getDashboard());
    } catch (loadError) {
      setError(getApiErrorMessage(loadError, 'Unable to load admin statistics.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  const series = stats?.activity_series ?? [];
  const signupsInSeries = series.reduce((total, point) => total + point.signups, 0);

  return (
    <div>
      <AdminPageHeader
        title="Overview"
        description="Platform totals, and how people have been using Edwuma over the last 30 days."
      />

      {error ? <AdminError message={error} onRetry={loadStats} /> : null}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Job views"
          value={stats?.engagement.views_30d}
          loading={isLoading}
          hint="Last 30 days"
        />
        <StatCard
          label="Apply clicks"
          value={stats?.engagement.apply_clicks_30d}
          loading={isLoading}
          hint="Last 30 days"
        />
        <StatCard
          label="Jobs saved"
          value={stats?.engagement.saves_30d}
          loading={isLoading}
          hint={`${stats?.content.saved_jobs ?? 0} saved in total`}
        />
        <StatCard
          label="Searches"
          value={stats?.engagement.searches_30d}
          loading={isLoading}
          hint="Last 30 days"
        />
      </section>

      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#244034]">Activity</h2>
              <p className="text-sm text-[rgba(0,0,0,0.6)]">Views and apply clicks for the last 14 days.</p>
            </div>
            <p className="text-sm text-[#244034]">
              {isLoading ? '—' : `${signupsInSeries} ${signupsInSeries === 1 ? 'signup' : 'signups'}`} in this window
            </p>
          </div>
          <ActivityChart series={series} loading={isLoading} />
        </CardContent>
      </Card>

      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BreakdownCard title="Active jobs by work mode" items={stats?.jobs.by_work_mode ?? []} loading={isLoading} />
        <BreakdownCard title="Active jobs by country" items={stats?.jobs.by_country ?? []} loading={isLoading} />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-[#244034]">Most viewed jobs</h2>
            <p className="mt-1 text-sm text-[rgba(0,0,0,0.6)]">Last 30 days</p>
            {isLoading ? (
              <p className="mt-6 text-sm text-[rgba(0,0,0,0.55)]">Loading jobs…</p>
            ) : (stats?.top_jobs.length ?? 0) === 0 ? (
              <p className="mt-6 text-sm text-[rgba(0,0,0,0.6)]">No job views in the last 30 days.</p>
            ) : (
              <ol className="mt-4 divide-y divide-gray-100">
                {stats?.top_jobs.map((job, index) => (
                  <li key={job.id} className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-[#244034]">
                        {index + 1}. {job.title}
                      </p>
                      <p className="text-sm text-[rgba(0,0,0,0.55)]">{job.apply_clicks} apply clicks</p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-[#244034]">{job.views} views</p>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-[#244034]">Catalogue</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <CatalogueRow label="Active jobs" value={isLoading ? null : `${stats?.jobs.active ?? 0} of ${stats?.jobs.total ?? 0}`} />
              <CatalogueRow label="Posted this week" value={isLoading ? null : stats?.jobs.posted_7d ?? 0} />
              <CatalogueRow label="Companies" value={isLoading ? null : stats?.content.companies ?? 0} />
              <CatalogueRow label="Job alerts" value={isLoading ? null : stats?.content.job_alerts ?? 0} />
              <CatalogueRow
                label="Blog"
                value={isLoading ? null : `${stats?.content.published_posts ?? 0} published, ${stats?.content.draft_posts ?? 0} drafts`}
              />
            </dl>
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-lg font-semibold text-[#244034]">People</h2>
              <p className="text-sm text-[rgba(0,0,0,0.6)]">
                {isLoading ? '—' : `${stats?.new_users_7d ?? 0} joined this week`}
              </p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <MiniStat label="Total" value={stats?.total_users} loading={isLoading} />
              <MiniStat label="Active" value={stats?.active_users} loading={isLoading} />
              <MiniStat label="Pending invites" value={stats?.pending_invitations} loading={isLoading} />
              <MiniStat label="Accepted invites" value={stats?.accepted_invitations} loading={isLoading} />
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {Object.entries(ROLE_LABELS).map(([role, label]) => (
                <div key={role} className="rounded-lg bg-[#f4f7f5] px-4 py-4">
                  <p className="text-sm text-[rgba(0,0,0,0.6)]">{label}</p>
                  <p className="mt-1 text-2xl font-bold text-[#244034]">
                    {isLoading ? '—' : stats?.users_by_role[role as keyof AdminDashboardStats['users_by_role']] ?? 0}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-[#244034]">Manage</h2>
            <div className="mt-4 space-y-2">
              <ManageLink href="/admin/users" title="Users" detail="Roles and account status" />
              <ManageLink href="/admin/invitations" title="Invitations" detail="Invite recruiters and admins" />
              <ManageLink href="/admin/blog" title="Blog" detail="Drafts and published posts" />
              <ManageLink href="/admin/sync" title="Job sync" detail="Sources and recent runs" />
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function ActivityChart({ series, loading }: { series: AdminActivityPoint[]; loading: boolean }) {
  const peak = Math.max(...series.flatMap((point) => [point.views, point.apply_clicks]), 1);

  if (loading) {
    return <div className="mt-6 h-44 animate-pulse rounded-lg bg-[#f4f7f5]" />;
  }

  if (series.length === 0) {
    return <p className="mt-6 text-sm text-[rgba(0,0,0,0.6)]">No activity recorded yet.</p>;
  }

  return (
    <div className="mt-6">
      <div className="flex h-44 items-end gap-1 sm:gap-2">
        {series.map((point) => (
          <div key={point.date} className="flex h-full min-w-0 flex-1 items-end gap-0.5" title={chartTitle(point)}>
            <div
              className="w-1/2 rounded-t bg-[#244034]"
              style={{ height: barHeight(point.views, peak) }}
            />
            <div
              className="w-1/2 rounded-t bg-[#d2f34c]"
              style={{ height: barHeight(point.apply_clicks, peak) }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-1 sm:gap-2">
        {series.map((point, index) => (
          <span key={point.date} className="flex-1 truncate text-center text-[10px] text-[rgba(0,0,0,0.45)]">
            {index % 2 === 0 ? shortDate(point.date) : ''}
          </span>
        ))}
      </div>
      <div className="mt-4 flex gap-4 text-xs text-[rgba(0,0,0,0.65)]">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-[#244034]" /> Views
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-[#d2f34c]" /> Apply clicks
        </span>
      </div>
    </div>
  );
}

function BreakdownCard({
  title,
  items,
  loading,
}: {
  title: string;
  items: AdminBreakdown[];
  loading: boolean;
}) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-[#244034]">{title}</h2>
        {loading ? (
          <div className="mt-5 space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-8 animate-pulse rounded bg-[#f4f7f5]" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="mt-5 text-sm text-[rgba(0,0,0,0.6)]">Nothing to break down yet.</p>
        ) : (
          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
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
      </CardContent>
    </Card>
  );
}

function StatCard({
  label,
  value,
  hint,
  loading,
}: {
  label: string;
  value?: number;
  hint: string;
  loading: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm font-medium text-[rgba(0,0,0,0.6)]">{label}</p>
        <p className="mt-2 text-3xl font-bold text-[#244034]">{loading ? '—' : value ?? 0}</p>
        <p className="mt-2 text-xs text-[rgba(0,0,0,0.5)]">{hint}</p>
      </CardContent>
    </Card>
  );
}

function MiniStat({ label, value, loading }: { label: string; value?: number; loading: boolean }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-[rgba(0,0,0,0.45)]">{label}</p>
      <p className="mt-1 text-2xl font-bold text-[#244034]">{loading ? '—' : value ?? 0}</p>
    </div>
  );
}

function CatalogueRow({ label, value }: { label: string; value: string | number | null }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
      <dt className="text-[rgba(0,0,0,0.65)]">{label}</dt>
      <dd className="font-medium text-[#244034]">{value ?? '—'}</dd>
    </div>
  );
}

function ManageLink({ href, title, detail }: { href: string; title: string; detail: string }) {
  return (
    <Link
      href={href}
      className="block rounded-md border border-[#244034]/10 px-4 py-3 transition-colors hover:border-[#244034]/30 hover:bg-[#f4f7f5]"
    >
      <p className="font-medium text-[#244034]">{title}</p>
      <p className="text-sm text-[rgba(0,0,0,0.6)]">{detail}</p>
    </Link>
  );
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

function chartTitle(point: AdminActivityPoint): string {
  return `${shortDate(point.date)}: ${point.views} views, ${point.apply_clicks} apply clicks, ${point.signups} signups`;
}
