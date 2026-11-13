'use client';

import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AdminError, AdminPageHeader } from '@/components/admin/AdminChrome';
import {
  adminService,
  getApiErrorMessage,
  type AdminSchedule,
  type AdminScheduledRun,
} from '@/lib/api/admin';

const SUMMARY_LABELS: Record<string, string> = {
  boards: 'boards',
  boards_failed: 'boards failed',
  found: 'found',
  pages: 'pages',
  total_fetched: 'fetched',
  total_created: 'created',
  total_updated: 'updated',
  total_skipped: 'skipped',
  total_expired: 'expired',
  total_errors: 'errors',
  queued: 'queued',
  sent: 'sent',
  checked: 'checked',
  saved: 'saved',
};

function formatRunTime(value: string | null | undefined): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const formatted = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(date);
  return `${formatted} GMT`;
}

function formatDuration(seconds: number | null): string {
  if (seconds === null) return '';
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.round(seconds / 60);
  return `${minutes} min`;
}

function reportLine(summary: Record<string, unknown>): string {
  const parts = Object.entries(SUMMARY_LABELS).flatMap(([key, label]) => {
    const value = summary[key];
    if (typeof value !== 'number') return [];
    return [`${value} ${label}`];
  });
  return parts.join(' · ');
}

function errorSamples(summary: Record<string, unknown>): string[] {
  if (!Array.isArray(summary.error_samples)) return [];
  return summary.error_samples.flatMap((sample) => {
    if (!sample || typeof sample !== 'object') return [];
    const record = sample as { external_id?: unknown; error?: unknown };
    const error = typeof record.error === 'string' ? record.error : '';
    if (!error) return [];
    const id = typeof record.external_id === 'string' && record.external_id !== '' ? record.external_id : '';
    return [id ? `${id}: ${error}` : error];
  });
}

function statusBadge(schedule: AdminSchedule): { label: string; variant: 'success' | 'warning' | 'destructive' | 'default' } {
  if (schedule.attention === 'never') return { label: 'Never run', variant: 'default' };
  if (schedule.attention === 'missed') return { label: 'Not run', variant: 'warning' };
  if (schedule.latest?.status === 'success') return { label: 'Success', variant: 'success' };
  if (schedule.latest?.status === 'failed') return { label: 'Failed', variant: 'destructive' };
  if (schedule.latest?.status === 'skipped') return { label: 'Skipped', variant: 'warning' };
  return { label: 'Running', variant: 'default' };
}

export default function AdminSchedulesPage() {
  const [schedules, setSchedules] = useState<AdminSchedule[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSchedules(await adminService.getSchedules());
    } catch (loadError) {
      setError(getApiErrorMessage(loadError, 'Unable to load schedules.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const missed = schedules.filter((schedule) => !schedule.paused && schedule.attention !== 'ran').length;

  const runTask = async (schedule: AdminSchedule) => {
    try {
      setActing(`${schedule.name}:run`);
      await adminService.runSchedule(schedule.name);
      toast.success(`${schedule.label} started.`);
      await load();
    } catch (runError) {
      toast.error(getApiErrorMessage(runError, `Unable to start ${schedule.label}.`));
    } finally {
      setActing(null);
    }
  };

  const setPaused = async (schedule: AdminSchedule, paused: boolean) => {
    try {
      setActing(`${schedule.name}:pause`);
      await adminService.setSchedulePaused(schedule.name, paused);
      toast.success(paused ? `${schedule.label} paused.` : `${schedule.label} resumed.`);
      await load();
    } catch (pauseError) {
      toast.error(getApiErrorMessage(pauseError, `Unable to update ${schedule.label}.`));
    } finally {
      setActing(null);
    }
  };
  const failed = schedules.filter((schedule) => schedule.attention === 'ran' && schedule.latest?.status === 'failed').length;

  return (
    <div>
      <AdminPageHeader
        title="Schedules"
      />

      {error ? <AdminError message={error} onRetry={load} /> : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Metric label="Tasks" value={isLoading ? null : schedules.length} hint="Every day, GMT" />
        <Metric label="Not run" value={isLoading ? null : missed} hint="Missed the last slot, or never recorded" />
        <Metric label="Failed" value={isLoading ? null : failed} hint="Ran and finished with an error" />
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold text-[#244034]">Daily tasks</h2>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-[#f8fafc] text-xs uppercase tracking-wide text-[rgba(0,0,0,0.55)]">
                <tr>
                  <th className="px-6 py-3 font-medium">Task</th>
                  <th className="px-6 py-3 font-medium">When</th>
                  <th className="px-6 py-3 font-medium">Last report</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-[rgba(0,0,0,0.6)]">
                      Loading schedules…
                    </td>
                  </tr>
                ) : schedules.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-[rgba(0,0,0,0.6)]">
                      No schedules are configured.
                    </td>
                  </tr>
                ) : (
                  schedules.map((schedule) => {
                    const badge = statusBadge(schedule);
                    const latest = schedule.latest;
                    const report = latest ? reportLine(latest.summary) : '';
                    const samples = latest ? errorSamples(latest.summary).slice(0, 2) : [];
                    return (
                      <tr key={schedule.name} className="border-b border-gray-100 align-top last:border-0">
                        <td className="px-6 py-4">
                          <p className="font-medium text-[#244034]">{schedule.label}</p>
                          <p className="text-[rgba(0,0,0,0.55)]">{schedule.description}</p>
                        </td>
                        <td className="px-6 py-4 text-[rgba(0,0,0,0.7)]">
                          <p>{schedule.runs_at} {schedule.timezone}</p>
                          <p className="text-xs text-[rgba(0,0,0,0.5)]">{schedule.command}</p>
                        </td>
                        <td className="px-6 py-4 text-[rgba(0,0,0,0.7)]">
                          <RunReport run={latest} report={report} samples={samples} />
                          {schedule.recent.length > 1 ? <RecentRuns runs={schedule.recent} /> : null}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {schedule.paused ? <Badge variant="warning" size="sm">Paused</Badge> : null}
                            <Badge variant={badge.variant} size="sm">{badge.label}</Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={acting !== null || latest?.status === 'running'}
                              loading={acting === `${schedule.name}:run`}
                              onClick={() => void runTask(schedule)}
                            >
                              Run now
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={acting !== null}
                              loading={acting === `${schedule.name}:pause`}
                              onClick={() => void setPaused(schedule, !schedule.paused)}
                            >
                              {schedule.paused ? 'Resume' : 'Pause'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RunReport({
  run,
  report,
  samples,
}: {
  run: AdminScheduledRun | null;
  report: string;
  samples: string[];
}) {
  if (!run) return <p>—</p>;

  const duration = formatDuration(run.duration_seconds);

  return (
    <div>
      <p>{formatRunTime(run.started_at)}{duration ? ` · ${duration}` : ''}</p>
      {report ? <p className="mt-1">{report}</p> : null}
      {run.error_message ? <p className="mt-1 text-xs text-red-600">{run.error_message}</p> : null}
      {samples.map((sample) => (
        <p key={sample} className="mt-1 text-xs text-[rgba(0,0,0,0.55)]">{sample}</p>
      ))}
    </div>
  );
}

function RecentRuns({ runs }: { runs: AdminScheduledRun[] }) {
  return (
    <details className="mt-2">
      <summary className="cursor-pointer text-xs text-[#244034]">Recent runs</summary>
      <ul className="mt-2 space-y-2">
        {runs.map((run) => {
          const report = reportLine(run.summary);
          return (
            <li key={run.id} className="text-xs text-[rgba(0,0,0,0.7)]">
              <span className="capitalize">{run.status}</span>
              {' · '}
              {formatRunTime(run.started_at)}
              {report ? ` · ${report}` : ''}
              {run.error_message ? ` · ${run.error_message}` : ''}
            </li>
          );
        })}
      </ul>
    </details>
  );
}

function Metric({ label, value, hint }: { label: string; value: number | null; hint: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm font-medium text-[rgba(0,0,0,0.6)]">{label}</p>
        <p className="mt-2 text-2xl font-bold text-[#244034]">{value ?? '—'}</p>
        <p className="mt-2 text-xs text-[rgba(0,0,0,0.5)]">{hint}</p>
      </CardContent>
    </Card>
  );
}
