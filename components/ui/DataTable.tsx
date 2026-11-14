'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export function TableCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn('overflow-hidden rounded-2xl border border-[#eceef2] bg-white', className)}>{children}</section>;
}

export function TableToolbar({
  search = '',
  onSearch,
  searchPlaceholder = 'Search',
  filter,
  sort,
  onExport,
  action,
}: {
  search?: string;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
  filter?: React.ReactNode;
  sort?: {
    value: string;
    options: Array<{ value: string; label: string }>;
    onChange: (value: string) => void;
  };
  onExport?: () => void;
  action?: React.ReactNode;
}) {
  const [draft, setDraft] = useState(search);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const filterId = useId();

  useEffect(() => {
    setDraft(search);
  }, [search]);

  useEffect(() => {
    if (!sortOpen) return;
    const close = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) setSortOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [sortOpen]);

  return (
    <div className="border-b border-[#f3f4f6] px-4 py-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {onSearch ? (
          <form
            className="relative min-w-0 flex-1"
            onSubmit={(event) => {
              event.preventDefault();
              onSearch(draft.trim());
            }}
          >
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa1ab]" />
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="h-10 w-full rounded-xl border border-[#e6e8ee] bg-white pl-9 pr-3 text-sm text-[#141414] outline-none placeholder:text-[#9aa1ab] focus:border-[#244034]/40"
            />
          </form>
        ) : (
          <div className="flex-1" />
        )}
        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          {filter ? (
            <ToolButton pressed={filterOpen} onClick={() => setFilterOpen((open) => !open)} aria-expanded={filterOpen} aria-controls={filterId}>
              <FilterIcon />
              Filter
            </ToolButton>
          ) : null}
          {sort ? (
            <div className="relative" ref={sortRef}>
              <ToolButton pressed={sortOpen} onClick={() => setSortOpen((open) => !open)} aria-expanded={sortOpen}>
                <SortIcon />
                Sort
              </ToolButton>
              {sortOpen ? (
                <div className="absolute right-0 z-20 mt-1 w-48 rounded-xl border border-[#eceef2] bg-white py-1 shadow-lg">
                  {sort.options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={cn(
                        'block w-full px-3 py-2 text-left text-sm text-[#244034] hover:bg-[#F4F2EE]',
                        option.value === sort.value && 'font-semibold'
                      )}
                      onClick={() => {
                        sort.onChange(option.value);
                        setSortOpen(false);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
          {onExport ? (
            <ToolButton onClick={onExport}>
              <ExportIcon />
              Export
            </ToolButton>
          ) : null}
          {action}
        </div>
      </div>
      {filter && filterOpen ? (
        <div id={filterId} className="mt-3 rounded-xl bg-[#F4F2EE] p-3">
          {filter}
        </div>
      ) : null}
    </div>
  );
}

export function TableAction({
  children,
  onClick,
  type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#244034] px-3.5 text-sm font-semibold text-white hover:bg-[#1a2f26]"
    >
      {children}
    </button>
  );
}

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-left text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={cn('whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-[#8b919a]', className)}>{children}</th>;
}

export function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn('px-4 py-3.5 align-middle text-[#3a3f47]', className)}>{children}</td>;
}

export function Tr({ children }: { children: React.ReactNode }) {
  return <tr className="border-t border-[#f3f4f6]">{children}</tr>;
}

export function TableMessage({ colSpan, children }: { colSpan: number; children: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-10 text-center text-sm text-[#8b919a]">
        {children}
      </td>
    </tr>
  );
}

export function StatusPill({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode;
  tone?: 'success' | 'warning' | 'danger' | 'neutral' | 'brand';
}) {
  const tones = {
    success: 'bg-[#e7f6ec] text-[#17803d]',
    warning: 'bg-[#fff6e8] text-[#9a6700]',
    danger: 'bg-[#fdecec] text-[#d92d20]',
    neutral: 'bg-[#f3f4f6] text-[#6b7280]',
    brand: 'bg-[#eef6d4] text-[#244034]',
  };
  return <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-medium', tones[tone])}>{children}</span>;
}

export function DotLabel({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f6f7f9] px-2.5 py-1 text-xs font-medium text-[#3a3f47]">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {children}
    </span>
  );
}

export function RowMenu({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#6b7280] hover:bg-[#F4F2EE]"
      >
        <DotsIcon />
      </button>
      {open ? (
        <div className="absolute right-0 z-20 mt-1 min-w-44 rounded-xl border border-[#eceef2] bg-white py-1 shadow-lg" onClick={() => setOpen(false)}>
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function RowMenuItem({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="block w-full px-3 py-2 text-left text-sm text-[#244034] hover:bg-[#F4F2EE]">
      {children}
    </button>
  );
}

export function TablePager({
  page,
  lastPage,
  total,
  pageSize,
  pageSizeOptions = [10, 20, 50],
  onPageChange,
  onPageSizeChange,
}: {
  page: number;
  lastPage: number;
  total: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}) {
  if (total === 0) return null;
  const pages = pageWindow(page, Math.max(lastPage, 1));

  return (
    <div className="flex flex-col gap-3 border-t border-[#f3f4f6] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <label className="flex items-center gap-2 text-sm text-[#6b7280]">
        {onPageSizeChange && pageSize ? (
          <>
            Show
            <select
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              className="h-9 rounded-lg border border-[#e6e8ee] bg-white px-2 text-sm text-[#141414]"
              aria-label="Rows per page"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </>
        ) : null}
        from {total.toLocaleString('en-US')} data
      </label>
      <div className="flex items-center gap-1">
        <PagerButton label="Previous page" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <Chevron className="rotate-180" />
        </PagerButton>
        {pages.map((item, index) =>
          item === 'gap' ? (
            <span key={`gap-${index}`} className="px-1 text-sm text-[#9aa1ab]">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              className={cn(
                'h-8 min-w-8 rounded-lg px-2 text-sm font-medium',
                item === page ? 'bg-[#244034] text-white' : 'text-[#6b7280] hover:bg-[#F4F2EE]'
              )}
              aria-current={item === page ? 'page' : undefined}
            >
              {item}
            </button>
          )
        )}
        <PagerButton label="Next page" disabled={page >= lastPage} onClick={() => onPageChange(page + 1)}>
          <Chevron />
        </PagerButton>
      </div>
    </div>
  );
}

export function downloadCsv(filename: string, rows: Array<Array<string | number | null | undefined>>) {
  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function pageWindow(page: number, last: number): Array<number | 'gap'> {
  if (last <= 7) return Array.from({ length: last }, (_, index) => index + 1);
  if (page <= 3) return [1, 2, 3, 'gap', last];
  if (page >= last - 2) return [1, 'gap', last - 2, last - 1, last];
  return [1, 'gap', page - 1, page, page + 1, 'gap', last];
}

function ToolButton({
  children,
  onClick,
  pressed,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { pressed?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex h-10 items-center gap-2 rounded-xl border border-[#e6e8ee] bg-white px-3 text-sm font-medium text-[#3a3f47] hover:bg-[#F4F2EE]',
        pressed && 'border-[#244034] text-[#244034]'
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function PagerButton({
  children,
  label,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#6b7280] hover:bg-[#F4F2EE] disabled:text-[#d1d5db]"
    >
      {children}
    </button>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M8 7v10M8 7 5 10M8 7l3 3M16 17V7M16 17l-3-3M16 17l3-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExportIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M12 4v10M8 8l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 15v4h14v-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}

function Chevron({ className }: { className?: string }) {
  return (
    <svg className={cn('h-4 w-4', className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
