'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

export type WorkspaceIconName =
  | 'home'
  | 'users'
  | 'shield'
  | 'mail'
  | 'refresh'
  | 'clock'
  | 'pen'
  | 'list'
  | 'briefcase';

export type WorkspaceNavItem = {
  href: string;
  label: string;
  icon: WorkspaceIconName;
  exact?: boolean;
};

export type WorkspaceNavGroup = {
  label: string;
  items: WorkspaceNavItem[];
};

const ICONS: Record<WorkspaceIconName, React.ReactNode> = {
  home: (
    <>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6 10v10h12V10" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="3" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  shield: <path d="M12 3 5 6v6c0 4.2 2.9 7.2 7 8.5 4.1-1.3 7-4.3 7-8.5V6l-7-3z" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  refresh: (
    <>
      <path d="M21 12a9 9 0 1 1-2.6-6.3" />
      <path d="M21 3v6h-6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v5l3 2" />
    </>
  ),
  pen: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5z" />
    </>
  ),
  list: (
    <>
      <path d="M8 6h13M8 12h13M8 18h13" />
      <path d="M3 6h.01M3 12h.01M3 18h.01" />
    </>
  ),
  briefcase: (
    <>
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 7h18v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
      <path d="M3 12h18" />
    </>
  ),
};

function Glyph({ name, className }: { name: WorkspaceIconName | 'search' | 'menu' | 'logout' | 'chevron' | 'external'; className?: string }) {
  const extra: Record<string, React.ReactNode> = {
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    external: (
      <>
        <path d="M14 5h5v5" />
        <path d="M19 5 10 14" />
        <path d="M17 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h6" />
      </>
    ),
    logout: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="M16 17l5-5-5-5" />
        <path d="M21 12H9" />
      </>
    ),
    chevron: <path d="M15 6 9 12l6 6" />,
  };

  return (
    <svg
      className={className ?? 'h-[18px] w-[18px]'}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {name in ICONS ? ICONS[name as WorkspaceIconName] : extra[name]}
    </svg>
  );
}

function isActive(pathname: string, href: string, exact?: boolean): boolean {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function pageTitle(pathname: string, groups: WorkspaceNavGroup[]): string {
  if (pathname === '/admin/blog/new') return 'New post';
  if (/^\/admin\/blog\/[^/]+$/.test(pathname)) return 'Edit post';

  const match = groups
    .flatMap((group) => group.items)
    .filter((item) => isActive(pathname, item.href, item.exact))
    .sort((a, b) => b.href.length - a.href.length)[0];

  return match?.label ?? 'Overview';
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'E';
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function WorkspaceShell({
  children,
  groups,
  markHref,
  searchBase,
  searchPlaceholder,
}: {
  children: React.ReactNode;
  groups: WorkspaceNavGroup[];
  markHref: string;
  searchBase: string;
  searchPlaceholder: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { logout, getUserDisplayName } = useAuth();
  const urlQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(urlQuery);
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const name = getUserDisplayName();
  const title = pageTitle(pathname, groups);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const next = query.trim();
    router.push(next ? `${searchBase}?q=${encodeURIComponent(next)}` : searchBase);
  };

  const signOut = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="relative flex min-h-0 w-full flex-1 overflow-hidden bg-white">
        {open ? (
          <button
            type="button"
            className="absolute inset-0 z-30 bg-[#1c1f24]/30 lg:hidden"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
        ) : null}

        <aside
          className={cn(
            'z-40 flex w-[248px] shrink-0 flex-col border-r border-[#f0f1f4] bg-white',
            'absolute inset-y-0 left-0 lg:static',
            open ? 'flex' : 'hidden lg:flex',
            collapsed && 'lg:w-[76px]'
          )}
        >
          <div className={cn('flex h-16 items-center gap-2 px-4', collapsed && 'lg:h-auto lg:flex-col lg:justify-center lg:gap-3 lg:px-2 lg:py-4')}>
            <Link href={markHref} className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#244034] text-[18px] font-extrabold leading-none text-[#d2f34c]">
                e
              </span>
              <span className={cn('truncate text-[17px] font-bold tracking-tight text-[#1c1f24]', collapsed && 'lg:hidden')}>
                edwuma
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setCollapsed((value) => !value)}
              className={cn(
                'ml-auto hidden h-7 w-7 items-center justify-center rounded-full border border-[#eceef2] text-[#9aa1ab] hover:text-[#1c1f24] lg:inline-flex',
                collapsed && 'ml-0'
              )}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Glyph name="chevron" className={cn('h-4 w-4', collapsed && 'rotate-180')} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 pb-4" aria-label="Workspace">
            {groups.map((group) => (
              <div key={group.label}>
                <p className={cn('px-3 pb-2 pt-5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9aa1ab]', collapsed && 'lg:hidden')}>
                  {group.label}
                </p>
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const active = isActive(pathname, item.href, item.exact);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          title={item.label}
                          aria-current={active ? 'page' : undefined}
                          className={cn(
                            'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-[#3a3f47] hover:bg-[#F4F2EE]',
                            active && 'bg-[#d2f34c] text-[#244034] hover:bg-[#d2f34c]',
                            collapsed && 'lg:justify-center lg:px-0'
                          )}
                        >
                          <Glyph name={item.icon} />
                          <span className={cn(collapsed && 'lg:hidden')}>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          <div className={cn('space-y-1 border-t border-[#f4f5f7] p-3', collapsed && 'lg:px-2')}>
            <Link
              href="/"
              title="Site"
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-[#6b7280] hover:bg-[#F4F2EE] hover:text-[#1c1f24]',
                collapsed && 'lg:justify-center lg:px-0'
              )}
            >
              <Glyph name="external" />
              <span className={cn(collapsed && 'lg:hidden')}>Site</span>
            </Link>
            <button
              type="button"
              onClick={() => void signOut()}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-[#244034] hover:bg-[#F4F2EE]',
                collapsed && 'lg:justify-center lg:px-0'
              )}
            >
              <Glyph name="logout" />
              <span className={cn(collapsed && 'lg:hidden')}>Log out</span>
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col bg-[#F4F2EE]">
          <header className="flex h-16 shrink-0 items-center gap-3 border-b border-[#f0f1f4] bg-white px-4 sm:px-6">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[#1c1f24] hover:bg-[#F4F2EE] lg:hidden"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Glyph name="menu" />
            </button>
            <h1 className="min-w-0 flex-1 truncate text-[17px] font-semibold tracking-tight text-[#1c1f24]">{title}</h1>
            <form onSubmit={submitSearch} className="relative hidden w-56 sm:block">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa1ab]">
                <Glyph name="search" className="h-4 w-4" />
              </span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="h-10 w-full rounded-xl border border-[#eceef2] bg-[#fbfbfc] pl-9 pr-3 text-sm text-[#1c1f24] outline-none placeholder:text-[#9aa1ab] focus:border-[#244034]/30 focus:bg-white"
              />
            </form>
            <span
              title={name}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d2f34c] text-xs font-semibold text-[#244034]"
            >
              {initials(name)}
            </span>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
