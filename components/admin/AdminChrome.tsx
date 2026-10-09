'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { ProtectedRoute } from '@/lib/auth';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/admin', label: 'Overview', exact: true },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/invitations', label: 'Invitations' },
  { href: '/admin/blog', label: 'Blog' },
  { href: '/admin/sync', label: 'Job sync' },
];

function isNavActive(pathname: string, href: string, exact?: boolean): boolean {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-[#f4f7f5]">
        <Header />
        <div className="border-b border-[#244034]/10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex gap-1 overflow-x-auto py-3" aria-label="Admin">
              {NAV_ITEMS.map((item) => {
                const active = isNavActive(pathname, item.href, item.exact);
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
