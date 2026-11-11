'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AdminError, AdminPageHeader, AdminPagination } from '@/components/admin/AdminChrome';
import {
  adminService,
  getApiErrorMessage,
  type AdminAuditLog,
  type AdminPagination as Pagination,
} from '@/lib/api/admin';

const EVENT_OPTIONS = [
  { value: '', label: 'All events' },
  { value: 'auth.login', label: 'Signed in' },
  { value: 'auth.login_failed', label: 'Sign-in failed' },
  { value: 'auth.logout', label: 'Signed out' },
  { value: 'auth.password_reset', label: 'Password reset' },
  { value: 'user.roles.synced', label: 'Role changed' },
  { value: 'user.status.updated', label: 'Account status changed' },
  { value: 'user.created', label: 'User created' },
  { value: 'role.created', label: 'Role created' },
  { value: 'permission.created', label: 'Permission created' },
  { value: 'role.permissions.synced', label: 'Role permissions changed' },
];

const CATEGORY_OPTIONS = [
  { value: '', label: 'All categories' },
  { value: 'auth', label: 'Auth' },
  { value: 'user', label: 'User' },
];

const EVENT_LABELS: Record<string, string> = Object.fromEntries(
  EVENT_OPTIONS.filter((option) => option.value).map((option) => [option.value, option.label])
);

function eventLabel(event: string): string {
  return EVENT_LABELS[event] ?? event;
}

function eventVariant(event: string): 'success' | 'destructive' | 'warning' | 'secondary' | 'default' {
  if (event === 'auth.login') return 'success';
  if (event === 'auth.login_failed') return 'destructive';
  if (event === 'auth.password_reset' || event === 'user.status.updated' || event === 'role.permissions.synced') return 'warning';
  if (event === 'auth.logout') return 'secondary';
  return 'default';
}

function formatWhen(value: string): string {
  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function subjectLabel(type: string | null): string {
  if (!type) return '—';
  const name = type.split('\\').pop() ?? type;
  return name.replace(/([a-z])([A-Z])/g, '$1 $2');
}

function roleList(value: unknown): string {
  if (!Array.isArray(value) || value.length === 0) return 'none';
  return value.map(String).join(', ');
}

function summarize(log: AdminAuditLog): string {
  const properties = log.properties ?? {};

  if (log.event === 'user.roles.synced') {
    return `${roleList(properties.old_roles)} → ${roleList(properties.new_roles)}`;
  }

  if (log.event === 'user.status.updated') {
    const next = properties.new;
    const active = next && typeof next === 'object' && 'is_active' in next
      ? Boolean((next as { is_active?: boolean }).is_active)
      : null;
    if (active === null) return 'Status updated';
    return active ? 'Activated' : 'Deactivated';
  }

  const email = typeof properties.email === 'string' ? properties.email : '';
  const reason = typeof properties.reason === 'string' ? properties.reason.replace(/_/g, ' ') : '';

  if (email && reason) return `${email} · ${reason}`;
  if (email) return email;
  if (reason) return reason;
  return '—';
}

export default function AdminAuditLogPage() {
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [event, setEvent] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  const loadLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await adminService.listAuditLogs({
        event: event || undefined,
        category: category || undefined,
        page,
        per_page: 15,
      });
      setLogs(result.auditLogs);
      setPagination(result.pagination);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError, 'Unable to load the audit log.'));
    } finally {
      setIsLoading(false);
    }
  }, [category, event, page]);

  useEffect(() => {
    void loadLogs();
  }, [loadLogs]);

  return (
    <div>
      <AdminPageHeader
        title="Audit log"
        description="Sign-ins, password resets, role changes, and account status updates."
      />

      <Card className="mb-6">
        <CardContent className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
          <Select
            label="Event"
            value={event}
            options={EVENT_OPTIONS}
            onChange={(change) => {
              setEvent(change.target.value);
              setPage(1);
              setOpenId(null);
            }}
          />
          <Select
            label="Category"
            value={category}
            options={CATEGORY_OPTIONS}
            onChange={(change) => {
              setCategory(change.target.value);
              setPage(1);
              setOpenId(null);
            }}
          />
        </CardContent>
      </Card>

      {error ? <AdminError message={error} onRetry={loadLogs} /> : null}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-[#f8fafc] text-xs uppercase tracking-wide text-[rgba(0,0,0,0.55)]">
                <tr>
                  <th className="px-6 py-3 font-medium">When</th>
                  <th className="px-6 py-3 font-medium">Event</th>
                  <th className="px-6 py-3 font-medium">Actor</th>
                  <th className="px-6 py-3 font-medium">Change</th>
                  <th className="px-6 py-3 font-medium">IP</th>
                  <th className="px-6 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-[rgba(0,0,0,0.6)]">
                      Loading audit log…
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-[rgba(0,0,0,0.6)]">
                      No audit events match these filters.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    const open = openId === log.id;
                    return (
                      <React.Fragment key={log.id}>
                        <tr className="border-b border-gray-100 last:border-0">
                          <td className="whitespace-nowrap px-6 py-4 text-[rgba(0,0,0,0.7)]">
                            {formatWhen(log.created_at)}
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={eventVariant(log.event)} size="sm">
                              {eventLabel(log.event)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-[#244034]">{log.actor?.email ?? 'Unknown'}</td>
                          <td className="px-6 py-4 text-[rgba(0,0,0,0.75)]">{summarize(log)}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-[rgba(0,0,0,0.55)]">
                            {log.ip_address ?? '—'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setOpenId(open ? null : log.id)}
                            >
                              {open ? 'Hide' : 'Details'}
                            </Button>
                          </td>
                        </tr>
                        {open ? (
                          <tr className="border-b border-gray-100 bg-[#f8fafc]">
                            <td colSpan={6} className="px-6 py-4">
                              <dl className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                                <div>
                                  <dt className="text-xs uppercase tracking-wide text-[rgba(0,0,0,0.45)]">Subject</dt>
                                  <dd className="mt-1 text-[#244034]">
                                    {subjectLabel(log.subject_type)}
                                    {log.subject_id ? ` · ${log.subject_id}` : ''}
                                  </dd>
                                </div>
                                <div>
                                  <dt className="text-xs uppercase tracking-wide text-[rgba(0,0,0,0.45)]">URL</dt>
                                  <dd className="mt-1 break-all text-[rgba(0,0,0,0.75)]">{log.url ?? '—'}</dd>
                                </div>
                                <div className="md:col-span-2">
                                  <dt className="text-xs uppercase tracking-wide text-[rgba(0,0,0,0.45)]">User agent</dt>
                                  <dd className="mt-1 break-all text-[rgba(0,0,0,0.75)]">{log.user_agent || '—'}</dd>
                                </div>
                                <div className="md:col-span-2">
                                  <dt className="text-xs uppercase tracking-wide text-[rgba(0,0,0,0.45)]">Properties</dt>
                                  <dd className="mt-1">
                                    <pre className="overflow-x-auto rounded-md bg-white p-3 text-xs text-[#244034]">
                                      {JSON.stringify(log.properties ?? {}, null, 2)}
                                    </pre>
                                  </dd>
                                </div>
                              </dl>
                            </td>
                          </tr>
                        ) : null}
                      </React.Fragment>
                    );
                  })
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
