'use client';

import React, { Suspense } from 'react';
import { Button } from '@/components/ui/Button';
import { TablePager } from '@/components/ui/DataTable';
import { ProtectedRoute } from '@/lib/auth';
import { WorkspaceShell, type WorkspaceNavGroup } from '@/components/workspace/WorkspaceShell';

const NAV: WorkspaceNavGroup[] = [
  {
    label: 'Workspace',
    items: [{ href: '/admin', label: 'Overview', icon: 'home', exact: true }],
  },
  {
    label: 'People',
    items: [
      { href: '/admin/users', label: 'Users', icon: 'users', exact: true },
      { href: '/admin/access', label: 'Roles', icon: 'shield' },
      { href: '/admin/invitations', label: 'Invitations', icon: 'mail' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { href: '/admin/sync', label: 'Job sync', icon: 'refresh' },
      { href: '/admin/schedules', label: 'Schedules', icon: 'clock' },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/blog', label: 'Blog', icon: 'pen' },
      { href: '/admin/letter', label: 'Letter', icon: 'mail' },
      { href: '/admin/audit-log', label: 'Audit log', icon: 'list' },
    ],
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="admin">
      <Suspense fallback={<div className="min-h-screen bg-[#F4F2EE]" />}>
        <WorkspaceShell groups={NAV} markHref="/admin" searchBase="/admin/users" searchPlaceholder="Search people">
          {children}
        </WorkspaceShell>
      </Suspense>
    </ProtectedRoute>
  );
}

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  if (!action && !description) return null;

  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
      {description ? <p className="mr-auto max-w-2xl text-sm text-[#6b7280]">{description}</p> : <h2 className="sr-only">{title}</h2>}
      {action}
    </div>
  );
}

export function AdminError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-[#f6d0d0] bg-[#fff6f6] px-4 py-3 text-sm text-[#b42318] sm:flex-row sm:items-center sm:justify-between">
      <p>{message}</p>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}

export function AdminPagination({
  page,
  lastPage,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  page: number;
  lastPage: number;
  total: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}) {
  return (
    <TablePager
      page={page}
      lastPage={lastPage}
      total={total}
      pageSize={pageSize}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
    />
  );
}
