import type { ReactNode } from 'react';
import { ImageResponse } from 'next/og';
import type { MorningCountrySlug } from '@/lib/morning/countries';
import type { MorningCard } from '@/lib/og/morning';

export const ogSize = {
  width: 1200,
  height: 630,
};

function frame(children: ReactNode) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#244034',
        padding: '72px',
        color: '#ffffff',
      }}
    >
      <div style={{ display: 'flex', fontSize: 28, fontWeight: 600, color: '#d2f34c' }}>
        Edwuma
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>{children}</div>
    </div>
  );
}

function clip(value: string, max: number): string {
  const text = value.replace(/\s+/g, ' ').trim();
  if (text.length <= max) {
    return text;
  }

  return `${text.slice(0, max - 1).trim()}…`;
}

export function siteOgImage() {
  return new ImageResponse(
    frame(
      <div
        style={{
          display: 'flex',
          fontSize: 68,
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          maxWidth: 920,
        }}
      >
        Jobs you can apply to today
      </div>
    ),
    ogSize,
  );
}

export function jobOgImage(title: string, detail: string) {
  const line = clip(detail, 140);

  return new ImageResponse(
    frame(
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
          }}
        >
          {clip(title, 110)}
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: line ? 28 : 0,
            fontSize: 32,
            lineHeight: 1.3,
            color: 'rgba(255, 255, 255, 0.86)',
          }}
        >
          {line || ' '}
        </div>
      </div>
    ),
    ogSize,
  );
}

function countryMark(slug: MorningCountrySlug) {
  const stroke = '#d2f34c';

  if (slug === 'ghana') {
    return (
      <svg width="148" height="148" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="4" stroke={stroke} strokeWidth="1.6" />
        <path
          d="M12 2.2v2.4M12 19.4v2.4M2.2 12h2.4M19.4 12h2.4M5.1 5.1l1.7 1.7M17.2 17.2l1.7 1.7M18.9 5.1 17.2 6.8M6.8 17.2l-1.7 1.7"
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (slug === 'nigeria') {
    return (
      <svg width="148" height="148" viewBox="0 0 24 24" fill="none">
        <path d="M4 20V9l8-5 8 5v11" stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M9 20v-6h6v6" stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    );
  }

  if (slug === 'kenya') {
    return (
      <svg width="148" height="148" viewBox="0 0 24 24" fill="none">
        <path
          d="M2 18.5 7.8 9.2 11.6 14l3.4-6.2L22 18.5"
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg width="148" height="148" viewBox="0 0 24 24" fill="none">
      <path d="M12 2.5 20 12 12 21.5 4 12 12 2.5z" stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function morningOgImage(card: MorningCard) {
  const count = card.open !== null && card.open > 0 ? String(card.open) : null;
  const headline = count ? 'open in' : card.open === 0 ? 'Nothing open' : 'Jobs you can apply to today';
  const numberSize = count && count.length > 2 ? 112 : 148;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#244034',
          color: '#ffffff',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: 900,
            padding: '64px 64px 56px',
          }}
        >
          <div style={{ display: 'flex', fontSize: 28, fontWeight: 600, color: '#d2f34c' }}>Edwuma</div>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 36 }}>
            {count ? (
              <div
                style={{
                  display: 'flex',
                  fontSize: numberSize,
                  fontWeight: 700,
                  lineHeight: 0.9,
                  letterSpacing: '-0.05em',
                }}
              >
                {count}
              </div>
            ) : null}
            <div
              style={{
                display: 'flex',
                marginTop: count ? 18 : 0,
                fontSize: count ? 48 : 64,
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: '-0.04em',
              }}
            >
              {headline}
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 8,
                fontSize: count ? 48 : 64,
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: '-0.04em',
                color: '#d2f34c',
              }}
            >
              {count ? card.name : `in ${card.name}`}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 40 }}>
            {card.jobs.map((job, index) => (
              <div
                key={`${job.title}-${job.detail ?? ''}`}
                style={{ display: 'flex', flexDirection: 'column', marginTop: index === 0 ? 0 : 20 }}
              >
                <div style={{ display: 'flex', fontSize: 28, fontWeight: 600 }}>{job.title}</div>
                {job.detail ? (
                  <div
                    style={{
                      display: 'flex',
                      marginTop: 4,
                      fontSize: 22,
                      color: 'rgba(255, 255, 255, 0.72)',
                    }}
                  >
                    {job.detail}
                  </div>
                ) : null}
              </div>
            ))}
            <div
              style={{
                display: 'flex',
                marginTop: card.jobs.length > 0 ? 28 : 0,
                fontSize: 24,
                color: 'rgba(255, 255, 255, 0.72)',
              }}
            >
              No fee. One link.
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: 300,
            background: '#1c3329',
          }}
        >
          {countryMark(card.slug)}
          <div style={{ display: 'flex', marginTop: 28, fontSize: 28, fontWeight: 600 }}>{card.name}</div>
        </div>
      </div>
    ),
    ogSize,
  );
}
