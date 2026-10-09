'use client';

import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AdminError, AdminPageHeader, AdminPagination } from '@/components/admin/AdminChrome';
import { formatDate } from '@/lib/utils';
import {
  adminService,
  getApiErrorMessage,
  type AdminPagination as Pagination,
  type SyncLog,
  type SyncSource,
  type SyncStatistics,
} from '@/lib/api/admin';

function formatSyncDate(value: string | null | undefined): string {
  if (!value) return '—';
  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return value;
  return formatDate(date);
}

function statusVariant(status: string): 'success' | 'warning' | 'destructive' | 'default' {
  if (status === 'success') return 'success';
  if (status === 'partial') return 'warning';
  if (status === 'failed') return 'destructive';
  return 'default';
}

export default function AdminSyncPage() {
  const [sources, setSources] = useState<SyncSource[]>([]);
  const [stats, setStats] = useState<SyncStatistics | null>(null);
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [nextStats, nextSources, nextLogs] = await Promise.all([
        adminService.getSyncStatistics(),
        adminService.getSyncSources(),
        adminService.getSyncLogs(page),
      ]);
      setStats(nextStats);
      setSources(nextSources);
      setLogs(nextLogs.logs);
      setPagination(nextLogs.pagination);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError, 'Unable to load job sync.'));
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSyncAll = async () => {
    try {
      setSyncingId('all');
      const results = await adminService.syncAll();
      const names = Object.keys(results);
      const failed = names.filter((name) => results[name] && results[name].success === false);
      if (names.length === 0) {
        toast.success('No active sources to sync.');
      } else if (failed.length > 0) {
        toast.error(`Sync finished with problems on ${failed.join(', ')}.`);
      } else {
        toast.success(`Synced ${names.length} ${names.length === 1 ? 'source' : 'sources'}.`);
      }
      await load();
    } catch (syncError) {
      toast.error(getApiErrorMessage(syncError, 'Job sync failed.'));
    } finally {
      setSyncingId(null);
    }
  };

  const handleSyncSource = async (source: SyncSource) => {
    try {
      setSyncingId(source.id);
      const result = await adminService.syncSource(source.id);
      if (!result.success) {
        toast.error(result.error || `Sync failed for ${source.name}.`);
      } else {
        const created = result.results?.jobs_created ?? 0;
        const updated = result.results?.jobs_updated ?? 0;
        toast.success(`${source.name}: ${created} created, ${updated} updated.`);
      }
      await load();
    } catch (syncError) {
      toast.error(getApiErrorMessage(syncError, `Unable to sync ${source.name}.`));
    } finally {
      setSyncingId(null);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Job sync"
        description="Pull jobs from connected sources and review what each run created or skipped."
        action={
          <Button onClick={() => void handleSyncAll()} loading={syncingId === 'all'} disabled={syncingId !== null && syncingId !== 'all'}>
            Sync all sources
          </Button>
        }
      />

      {error ? <AdminError message={error} onRetry={load} /> : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Sources" value={isLoading ? null : `${stats?.sources.active ?? 0} / ${stats?.sources.total ?? 0}`} hint="Active of total" />
        <Metric label="Successful syncs" value={isLoading ? null : stats?.overview.successful_syncs ?? 0} hint={`${stats?.overview.success_rate ?? 0}% success rate`} />
        <Metric label="Jobs created" value={isLoading ? null : stats?.jobs.total_created ?? 0} hint={`${stats?.jobs.total_updated ?? 0} updated`} />
        <Metric label="Last sync" value={isLoading ? null : stats?.last_sync?.api_source ?? 'None yet'} hint={stats?.last_sync?.started_at ? formatSyncDate(stats.last_sync.started_at) : 'No runs recorded'} />
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold text-[#244034]">Sources</h2>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-[#f8fafc] text-xs uppercase tracking-wide text-[rgba(0,0,0,0.55)]">
                <tr>
                  <th className="px-6 py-3 font-medium">Source</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Last sync</th>
                  <th className="px-6 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-[rgba(0,0,0,0.6)]">
                      Loading sources…
                    </td>
                  </tr>
                ) : sources.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-[rgba(0,0,0,0.6)]">
                      No job sources are configured.
                    </td>
                  </tr>
                ) : (
                  sources.map((source) => (
                    <tr key={source.id} className="border-b border-gray-100 last:border-0">
                      <td className="px-6 py-4">
                        <p className="font-medium text-[#244034]">{source.name}</p>
                        <p className="max-w-md truncate text-[rgba(0,0,0,0.55)]">{source.base_url}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={source.is_active ? 'success' : 'destructive'} size="sm">
                          {source.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-[rgba(0,0,0,0.7)]">
                        {source.last_sync_at ? formatSyncDate(source.last_sync_at) : 'Never'}
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!source.is_active || (syncingId !== null && syncingId !== source.id)}
                          loading={syncingId === source.id}
                          onClick={() => void handleSyncSource(source)}
                        >
                          Sync
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <h2 className="mb-3 mt-8 text-lg font-semibold text-[#244034]">Recent runs</h2>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-[#f8fafc] text-xs uppercase tracking-wide text-[rgba(0,0,0,0.55)]">
                <tr>
                  <th className="px-6 py-3 font-medium">Source</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Jobs</th>
                  <th className="px-6 py-3 font-medium">Started</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-[rgba(0,0,0,0.6)]">
                      Loading runs…
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-[rgba(0,0,0,0.6)]">
                      No sync runs yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-100 last:border-0">
                      <td className="px-6 py-4">
                        <p className="font-medium text-[#244034]">{log.api_source?.name ?? 'Unknown source'}</p>
                        <p className="text-xs capitalize text-[rgba(0,0,0,0.5)]">{log.sync_type}</p>
                        {log.error_message ? <p className="mt-1 text-xs text-red-600">{log.error_message}</p> : null}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={statusVariant(log.status)} size="sm" className="capitalize">
                          {log.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-[rgba(0,0,0,0.7)]">
                        {log.jobs_created} created · {log.jobs_updated} updated · {log.jobs_skipped} skipped
                      </td>
                      <td className="px-6 py-4 text-[rgba(0,0,0,0.7)]">{formatSyncDate(log.started_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {pagination ? (
            <div className="px-6 pb-6">
              <AdminPagination
                page={pagination.current_page}
                lastPage={pagination.last_page}
                total={pagination.total}
                onPageChange={setPage}
              />
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ label, value, hint }: { label: string; value: string | number | null; hint: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm font-medium text-[rgba(0,0,0,0.6)]">{label}</p>
        <p className="mt-2 truncate text-2xl font-bold text-[#244034]">{value ?? '—'}</p>
        <p className="mt-2 text-xs text-[rgba(0,0,0,0.5)]">{hint}</p>
      </CardContent>
    </Card>
  );
}
