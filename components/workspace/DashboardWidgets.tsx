'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function Panel({
  title,
  action,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn('rounded-2xl border border-[#eceef2] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]', className)}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-[#1c1f24]">{title}</h2>
        {action ? <div className="text-xs text-[#8b919a]">{action}</div> : null}
      </div>
      <div className={cn('mt-4', bodyClassName)}>{children}</div>
    </section>
  );
}

export function MetricCard({
  icon,
  label,
  value,
  hint,
  pill,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  hint?: string;
  pill?: { text: string; tone: 'up' | 'down' | 'neutral' | 'warm' } | null;
}) {
  const tones = {
    up: 'bg-[#e8f8ee] text-[#17803d]',
    down: 'bg-[#fdecec] text-[#d92d20]',
    neutral: 'bg-[#f3f4f6] text-[#6b7280]',
    warm: 'bg-[#d2f34c] text-[#244034]',
  };

  return (
    <article className="rounded-2xl border border-[#eceef2] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div className="flex items-center gap-2 text-sm text-[#6b7280]">
        <span className="text-[#244034]">{icon}</span>
        {label}
      </div>
      <div className="mt-3 flex items-center gap-2">
        {value === null ? (
          <span className="inline-block h-8 w-16 animate-pulse rounded-md bg-[#f3f4f6]" />
        ) : (
          <p className="text-[28px] font-semibold leading-none tracking-tight text-[#1c1f24] tabular-nums">{value}</p>
        )}
        {pill ? (
          <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold', tones[pill.tone])}>{pill.text}</span>
        ) : null}
      </div>
      <p className="mt-2 min-h-4 text-xs text-[#8b919a]">{hint || ' '}</p>
    </article>
  );
}

export function WindowPills({
  value,
  options,
  onChange,
}: {
  value: number;
  options: number[];
  onChange: (value: number) => void;
}) {
  return (
    <div className="inline-flex rounded-xl bg-white p-1 shadow-[0_1px_2px_rgba(16,24,40,0.04)] ring-1 ring-[#eceef2]">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={
            option === value
              ? 'rounded-lg bg-[#244034] px-3 py-1.5 text-sm font-semibold text-white'
              : 'rounded-lg px-3 py-1.5 text-sm font-medium text-[#6b7280] hover:text-[#1c1f24]'
          }
        >
          {option}D
        </button>
      ))}
    </div>
  );
}

type TrendPoint = { date: string; value: number; secondary: number; tertiary: number };

export function ViewsTrend({
  points,
  loading,
}: {
  points: TrendPoint[];
  loading: boolean;
}) {
  if (loading) {
    return <div className="h-56 animate-pulse rounded-xl bg-[#f6f7f9]" />;
  }
  if (points.length === 0) {
    return <p className="text-sm text-[#8b919a]">No activity in this window.</p>;
  }

  const width = 640;
  const height = 210;
  const pad = { l: 36, r: 12, t: 22, b: 28 };
  const peak = Math.max(...points.map((point) => point.value), 1);
  const max = peak * 1.22;
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const xAt = (index: number) => pad.l + (points.length === 1 ? innerW / 2 : (index / (points.length - 1)) * innerW);
  const yAt = (value: number) => pad.t + innerH - (value / max) * innerH;
  const line = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${xAt(index).toFixed(1)} ${yAt(point.value).toFixed(1)}`).join(' ');
  const area = `${line} L ${xAt(points.length - 1).toFixed(1)} ${(pad.t + innerH).toFixed(1)} L ${xAt(0).toFixed(1)} ${(pad.t + innerH).toFixed(1)} Z`;
  const ticks = [0, Math.round(peak / 2), peak];
  const showEvery = points.length > 16 ? 5 : points.length > 8 ? 2 : 1;
  const clickPeak = Math.max(...points.map((point) => point.secondary), 1);
  const signupPeak = Math.max(...points.map((point) => point.tertiary), 1);

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-52 w-full" role="img" aria-label="Views over the selected window">
        <defs>
          <linearGradient id="views-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#244034" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#244034" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={pad.l}
              x2={width - pad.r}
              y1={yAt(tick)}
              y2={yAt(tick)}
              stroke="#f0f1f4"
            />
            <text x={0} y={yAt(tick) + 3} fill="#9aa1ab" fontSize="10">
              {tick}
            </text>
          </g>
        ))}
        <path d={area} fill="url(#views-fill)" />
        <path d={line} fill="none" stroke="#244034" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((point, index) => (
          <g key={point.date}>
            <circle cx={xAt(index)} cy={yAt(point.value)} r="3.5" fill="#fff" stroke="#244034" strokeWidth="2" />
            {points.length <= 8 ? (
              <text x={xAt(index)} y={yAt(point.value) - 10} textAnchor="middle" fill="#1c1f24" fontSize="11" fontWeight="600">
                {point.value}
              </text>
            ) : null}
            {index % showEvery === 0 || index === points.length - 1 ? (
              <text x={xAt(index)} y={height - 6} textAnchor="middle" fill="#9aa1ab" fontSize="10">
                {shortDate(point.date)}
              </text>
            ) : null}
          </g>
        ))}
      </svg>
      <div
        className="mt-1 flex items-end gap-1"
        style={{ paddingLeft: `${(pad.l / width) * 100}%`, paddingRight: `${(pad.r / width) * 100}%` }}
      >
        {points.map((point) => (
          <div key={point.date} className="flex h-7 flex-1 items-end justify-center gap-px" title={`${point.secondary} apply clicks · ${point.tertiary} signups`}>
            <div
              className="w-1.5 rounded-sm bg-[#244034]"
              style={{ height: point.secondary > 0 ? `${Math.max((point.secondary / clickPeak) * 100, 18)}%` : '0%' }}
            />
            <div
              className="w-1.5 rounded-sm bg-[#d2f34c]"
              style={{ height: point.tertiary > 0 ? `${Math.max((point.tertiary / signupPeak) * 100, 18)}%` : '0%' }}
            />
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-[#6b7280]">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-3 rounded-full bg-[#244034]" />
          Views
        </span>
        <Legend swatch="bg-[#244034]" label="Apply clicks" />
        <Legend swatch="bg-[#d2f34c]" label="Signups" />
      </div>
    </div>
  );
}

export function Donut({
  segments,
  center,
  caption,
}: {
  segments: Array<{ label: string; value: number; color: string }>;
  center: string;
  caption?: string;
}) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const size = 148;
  const stroke = 16;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  let cursor = 0;

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
      <div className="relative h-[148px] w-[148px] shrink-0">
        <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90" role="img" aria-label={caption || center}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f3f4f6" strokeWidth={stroke} />
          {total > 0
            ? segments.map((segment) => {
                const length = (segment.value / total) * circumference;
                const gap = segments.length > 1 && length > 8 ? 3 : 0;
                const visible = Math.max(length - gap, 0);
                const dash = `${visible} ${circumference - visible}`;
                const offset = -cursor;
                cursor += length;
                if (segment.value <= 0) return null;
                return (
                  <circle
                    key={segment.label}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={segment.color}
                    strokeWidth={stroke}
                    strokeDasharray={dash}
                    strokeDashoffset={offset}
                    strokeLinecap="butt"
                  />
                );
              })
            : null}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[26px] font-semibold leading-none tracking-tight text-[#1c1f24]">{center}</span>
          {caption ? <span className="mt-1 max-w-[88px] text-[11px] leading-tight text-[#8b919a]">{caption}</span> : null}
        </div>
      </div>
      <ul className="w-full space-y-2">
        {segments.map((segment) => {
          const share = total === 0 ? 0 : Math.round((segment.value / total) * 100);
          return (
            <li key={segment.label} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-center gap-2 text-[#3a3f47]">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: segment.color }} />
                <span className="truncate">{segment.label}</span>
              </span>
              <span className="shrink-0 tabular-nums text-[#1c1f24]">
                {segment.value} <span className="text-[#8b919a]">{share}%</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function RateColumns({
  points,
  loading,
}: {
  points: Array<{ date: string; rate: number }>;
  loading: boolean;
}) {
  if (loading) {
    return <div className="h-40 animate-pulse rounded-xl bg-[#f6f7f9]" />;
  }
  if (points.length === 0) {
    return <p className="text-sm text-[#8b919a]">No views in this window.</p>;
  }

  return (
    <div className="flex items-end gap-3">
      {points.map((point) => (
        <div key={point.date} className="flex min-w-0 flex-1 flex-col items-center">
          <span className="mb-1 text-xs font-semibold text-[#1c1f24]">{Math.round(point.rate)}%</span>
          <div className="flex h-28 w-full items-end overflow-hidden rounded-t-lg bg-[#e7efe4]">
            <div
              className="w-full rounded-t-lg bg-[#244034]"
              style={{ height: `${Math.min(100, Math.max(point.rate, point.rate > 0 ? 8 : 2))}%` }}
            />
          </div>
          <span className="mt-2 text-[10px] text-[#9aa1ab]">{shortDate(point.date)}</span>
        </div>
      ))}
    </div>
  );
}

export function DemandBars({
  rows,
  loading,
}: {
  rows: Array<{ label: string; value: number }>;
  loading: boolean;
}) {
  const max = Math.max(...rows.map((row) => row.value), 1);
  const colors = ['#244034', '#3d6b56', '#7fa37a', '#d2f34c'];

  if (loading) {
    return <div className="h-40 animate-pulse rounded-xl bg-[#f6f7f9]" />;
  }
  if (rows.every((row) => row.value === 0)) {
    return <p className="text-sm text-[#8b919a]">No activity in this window.</p>;
  }

  return (
    <ul className="space-y-3">
      {rows.map((row, index) => (
        <li key={row.label} className="grid grid-cols-[7.5rem_1fr_auto] items-center gap-3 text-sm">
          <span className="text-[#3a3f47]">{row.label}</span>
          <span className="h-2.5 overflow-hidden rounded-full bg-[#f6f7f9]">
            <span
              className="block h-full rounded-full"
              style={{
                width: `${Math.max((row.value / max) * 100, row.value > 0 ? 4 : 0)}%`,
                background: colors[index % colors.length],
              }}
            />
          </span>
          <span className="w-10 text-right font-semibold tabular-nums text-[#1c1f24]">{row.value}</span>
        </li>
      ))}
    </ul>
  );
}

export function BreakdownBars({
  rows,
  empty,
}: {
  rows: Array<{ label: string; value: number }>;
  empty: string;
}) {
  const max = Math.max(...rows.map((row) => row.value), 1);
  if (rows.length === 0) {
    return <p className="text-sm text-[#8b919a]">{empty}</p>;
  }
  return (
    <ul className="space-y-2.5">
      {rows.map((row) => (
        <li key={row.label}>
          <div className="mb-1 flex items-center justify-between gap-3 text-sm">
            <span className="truncate text-[#3a3f47]">{row.label}</span>
            <span className="font-medium tabular-nums text-[#1c1f24]">{row.value}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#f6f7f9]">
            <div
              className="h-full rounded-full bg-[#244034]"
              style={{ width: `${Math.max((row.value / max) * 100, row.value > 0 ? 4 : 0)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn('h-2 w-2 rounded-sm', swatch)} />
      {label}
    </span>
  );
}

function shortDate(value: string): string {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function MiniIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}
