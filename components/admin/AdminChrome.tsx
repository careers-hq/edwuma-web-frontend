'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ProtectedRoute, useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/admin', label: 'Overview', exact: true },
  {
    href: '/admin/users',
    label: 'People',
    children: [
      { href: '/admin/users', label: 'Users', exact: true },
      { href: '/admin/access', label: 'Roles' },
      { href: '/admin/invitations', label: 'Invitations' },
    ],
  },
  {
    href: '/admin/sync',
    label: 'Operations',
    children: [
      { href: '/admin/sync', label: 'Job sync' },
      { href: '/admin/schedules', label: 'Schedules' },
    ],
  },
  { href: '/admin/blog', label: 'Blog' },
  { href: '/admin/audit-log', label: 'Audit log' },
];

function isNavActive(pathname: string, href: string, exact?: boolean): boolean {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, getUserDisplayName } = useAuth();
  const section = NAV_ITEMS.find((item) =>
    item.children
      ? item.children.some((child) => isNavActive(pathname, child.href, child.exact))
      : isNavActive(pathname, item.href, item.exact)
  );

  const signOut = async () => {
    await logout();
    router.push('/');
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-[#f4f7f5]">
        <header className="border-b border-[#244034]/10 bg-white">
          <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
            <Link href="/admin" className="text-xl font-extrabold tracking-[-0.04em] text-[#244034]">
              edwuma
            </Link>
            <span className="text-sm font-medium text-[rgba(0,0,0,0.45)]">Admin</span>
            <div className="ml-auto flex items-center gap-4">
              <Link href="/" className="text-sm text-[#244034]">
                Site
              </Link>
              <span className="hidden max-w-[12rem] truncate text-sm text-[#244034] sm:inline">
                {getUserDisplayName()}
              </span>
              <Button variant="ghost" size="sm" onClick={() => void signOut()}>
                Sign out
              </Button>
            </div>
          </div>
        </header>
        <div className="border-b border-[#244034]/10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex gap-1 overflow-x-auto py-3" aria-label="Admin">
              {NAV_ITEMS.map((item) => {
                const active = item.children
                  ? item.children.some((child) => isNavActive(pathname, child.href, child.exact))
                  : isNavActive(pathname, item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'bg-[#244034] text-white'
                        : 'text-[#244034] hover:bg-[#244034]/5'
                    )}
                    aria-current={active ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            {section?.children ? (
              <div className="flex gap-4 overflow-x-auto border-t border-gray-100 py-2">
                {section.children.map((child) => {
                  const active = isNavActive(pathname, child.href, child.exact);
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        'whitespace-nowrap py-1 text-sm',
                        active ? 'font-semibold text-[#244034]' : 'text-[rgba(0,0,0,0.55)] hover:text-[#244034]'
                      )}
                      aria-current={active ? 'page' : undefined}
                    >
                      {child.label}
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      </div>
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
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-[#244034] font-['Gordita']">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-[rgba(0,0,0,0.7)]">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function AdminError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
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
  onPageChange,
}: {
  page: number;
  lastPage: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  if (total === 0) return null;

  return (
    <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-[rgba(0,0,0,0.6)]">
        {total} {total === 1 ? 'result' : 'results'}
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </Button>
        <span className="px-2 text-sm text-[#244034]">
          {page} / {lastPage}
        </span>
        <Button variant="outline" size="sm" disabled={page >= lastPage} onClick={() => onPageChange(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
