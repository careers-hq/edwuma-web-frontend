'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Turnstile, TurnstileHandle } from '@/components/ui/Turnstile';
import { useAuth } from '@/lib/auth';
import { authService } from '@/lib/api';
import { jobsApiService } from '@/lib/api/jobs';
import { useGeolocation } from '@/lib/hooks/useGeolocation';
import { CALLING_CODES, MORNING_COUNTRIES, morningCountry, type MorningCountrySlug } from '@/lib/morning/countries';
import { KINDS, STAGES } from '@/lib/morning/work';
import { completePendingJobAction, peekPendingJobAction, safeReturnPath, type PendingJobAction } from '@/lib/utils/jobApplication';

type Step = 'email' | 'code' | 'name' | 'country' | 'kind' | 'years';

const CHAPTER: Record<Step, { label: string; progress: number; image?: string; alt?: string }> = {
  email: {
    label: 'Step 1 of 4 · Identity',
    progress: 12,
    image: '/images/start/start-email.jpg',
    alt: 'A phone on a wooden desk, with an envelope on the screen.',
  },
  code: {
    label: 'Step 2 of 4 · Verification',
    progress: 30,
    image: '/images/start/start-code.jpg',
    alt: 'A phone on a desk, with six empty squares on the screen.',
  },
  name: {
    label: 'Step 3 of 4 · Your name',
    progress: 48,
    image: '/images/account/profile.jpg',
    alt: 'A blank card and a notebook on a wooden desk.',
  },
  country: {
    label: 'Step 4 of 4 · Your morning',
    progress: 64,
    image: '/images/start/start-market.jpg',
    alt: 'A stack of cards, the top one marked with a check.',
  },
  kind: {
    label: 'Step 4 of 4 · Your morning',
    progress: 82,
    image: '/images/start/start-morning.jpg',
    alt: 'A phone, a cup, and a notebook on a wooden desk.',
  },
  years: {
    label: 'Step 4 of 4 · Your morning',
    progress: 100,
    image: '/images/start/start-stage.jpg',
    alt: 'Three cards on a desk, each a step taller than the last.',
  },
};

function calledName(value: string): { first: string; last: string } {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  return { first: parts[0] ?? '', last: parts.slice(1).join(' ') };
}

function roleTitle(title: string): string {
  return title.replace(/\s+at\s+.+$/i, '').trim() || title;
}

function readError(error: unknown): Record<string, string> {
  const body = error as { message?: string; errors?: Record<string, string[]> };
  if (body.errors && Object.keys(body.errors).length > 0) {
    return Object.fromEntries(
      Object.entries(body.errors).map(([key, messages]) => [key, Array.isArray(messages) ? messages[0] : String(messages)]),
    );
  }

  return { general: body.message || 'Something went wrong.' };
}

function Frame({ step, children }: { step: Step; children: React.ReactNode }) {
  const chapter = CHAPTER[step];

  return (
    <div className="min-h-screen bg-[#f4f3ef] px-4 py-10 text-[#16382c]">
      <div className="mx-auto w-full max-w-xl">
        <div className="mb-3 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.14em] text-[#1d3c34]/70">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 normal-case tracking-normal">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3d7a4a]" />
            {chapter.label}
          </span>
          <span>{chapter.progress}%</span>
        </div>
        <div className="mb-8 h-px bg-[#e4e1da]">
          <div className="h-px bg-[#1d3c34]" style={{ width: `${chapter.progress}%` }} />
        </div>
        {chapter.image ? (
          <img src={chapter.image} alt={chapter.alt} className="mb-8 h-48 w-full rounded-2xl object-cover" />
        ) : null}
        {children}
      </div>
    </div>
  );
}

function PrimaryButton({ children, disabled, type = 'button', onClick }: { children: React.ReactNode; disabled?: boolean; type?: 'button' | 'submit'; onClick?: () => void }) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="flex h-12 w-full items-center justify-center rounded-lg bg-[#1d3c34] text-[15px] font-medium text-white transition-colors hover:bg-[#163028] disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function StepActions({ onBack, children }: { onBack: () => void; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={onBack}
        className="h-12 shrink-0 rounded-lg border border-[#1d3c34] bg-white px-5 text-[15px] font-medium text-[#1d3c34]"
      >
        Back
      </button>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function CodeBoxes({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length: 6 }, (_, index) => value[index] ?? '');

  const write = (next: string) => {
    onChange(next.replace(/\D/g, '').slice(0, 6));
  };

  return (
    <div className="flex justify-between gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => { refs.current[index] = node; }}
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          aria-label={`Digit ${index + 1}`}
          value={digit}
          maxLength={1}
          onChange={(event) => {
            const entered = event.target.value.replace(/\D/g, '');
            if (!entered) {
              write(value.slice(0, index) + value.slice(index + 1));
              return;
            }
            const next = (value.slice(0, index) + entered + value.slice(index + 1)).slice(0, 6);
            write(next);
            refs.current[Math.min(index + entered.length, 5)]?.focus();
          }}
          onKeyDown={(event) => {
            if (event.key === 'Backspace' && !digits[index] && index > 0) {
              refs.current[index - 1]?.focus();
            }
          }}
          onPaste={(event) => {
            event.preventDefault();
            write(event.clipboardData.getData('text'));
            refs.current[5]?.focus();
          }}
          className="h-14 w-full rounded-xl border border-black/10 bg-white text-center text-xl font-semibold text-[#16382c] outline-none focus:border-[#1d3c34]"
        />
      ))}
    </div>
  );
}

function StartForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signInWithEmailCode, isAuthenticated, isInitialized, user, rememberUser } = useAuth();
  const { countryCode } = useGeolocation();
  const turnstileRef = useRef<TurnstileHandle>(null);
  const finishing = useRef(false);
  const verifying = useRef(false);
  const countryTouched = useRef(false);

  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState<PendingJobAction | null>(null);
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [country, setCountry] = useState<MorningCountrySlug>('ghana');
  const [counts, setCounts] = useState<Partial<Record<MorningCountrySlug, number>>>({});
  const [kinds, setKinds] = useState<string[]>([]);
  const [years, setYears] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  const title = typeof pending?.metadata?.job_title === 'string' ? roleTitle(pending.metadata.job_title) : '';

  useEffect(() => {
    const action = peekPendingJobAction();
    setPending(action);
    const fromRole = morningCountry(action?.country)?.slug;
    if (fromRole) {
      countryTouched.current = true;
      setCountry(fromRole);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (countryTouched.current) return;
    const detected = morningCountry(countryCode)?.slug;
    if (detected) {
      setCountry(detected);
    }
  }, [countryCode]);

  useEffect(() => {
    if (!isInitialized || finishing.current || verifying.current || !isAuthenticated) return;
    setStep((current) => {
      if (current !== 'email' && current !== 'code') return current;
      return user?.profile?.first_name?.trim() ? 'country' : 'name';
    });
  }, [isInitialized, isAuthenticated, user]);

  useEffect(() => {
    if (step !== 'code' || resendIn <= 0) return;
    const timer = window.setTimeout(() => setResendIn((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [step, resendIn]);

  useEffect(() => {
    if (step !== 'country') return;
    let cancelled = false;

    Promise.all(MORNING_COUNTRIES.map(async (item) => {
      try {
        const response = await jobsApiService.morningList(item.slug, 1);
        return [item.slug, response.data.open] as const;
      } catch {
        return [item.slug, undefined] as const;
      }
    })).then((rows) => {
      if (cancelled) return;
      const next: Partial<Record<MorningCountrySlug, number>> = {};
      rows.forEach(([slug, open]) => {
        if (typeof open === 'number') next[slug] = open;
      });
      setCounts(next);
    });

    return () => {
      cancelled = true;
    };
  }, [step]);

  const sendCode = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErrors({ email: 'Enter an email address' });
      return;
    }
    if (!turnstileToken && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      setErrors({ turnstile: 'Complete the check below' });
      return;
    }

    setBusy(true);
    setErrors({});
    setNotice('');
    try {
      await authService.sendEmailCode(email.trim(), turnstileToken);
      setResendIn(60);
      setStep('code');
    } catch (error) {
      setErrors(readError(error));
      turnstileRef.current?.reset();
      setTurnstileToken('');
    } finally {
      setBusy(false);
    }
  };

  const resendCode = async () => {
    if (resendIn > 0 || busy) return;

    setBusy(true);
    setErrors({});
    setNotice('');
    try {
      await authService.sendEmailCode(email.trim(), turnstileToken);
      setResendIn(60);
      setNotice('Sent.');
    } catch (error) {
      setErrors(readError(error));
    } finally {
      setBusy(false);
    }
  };

  const verify = async () => {
    if (code.length !== 6) {
      setErrors({ code: 'Enter the 6-digit code' });
      return;
    }

    setBusy(true);
    setErrors({});
    verifying.current = true;
    try {
      const created = await signInWithEmailCode(email.trim(), code);
      if (!created) {
        finishing.current = true;
        const fallback = '/dashboard';
        const path = await completePendingJobAction(fallback, safeReturnPath(searchParams.get('returnTo')));
        router.push(path);
        return;
      }
      setStep('name');
    } catch (error) {
      setErrors(readError(error));
    } finally {
      verifying.current = false;
      setBusy(false);
    }
  };

  const saveName = async () => {
    const called = calledName(name);
    if (!called.first) {
      setErrors({ name: 'Enter your name' });
      return;
    }

    setBusy(true);
    setErrors({});
    try {
      const saved = await authService.updateName(called.first, called.last);
      rememberUser(saved);
      setStep('country');
    } catch (error) {
      setErrors(readError(error));
    } finally {
      setBusy(false);
    }
  };

  const save = async (facts: { country?: string; kind_of_work?: string; years?: number; phone?: string; phone_country?: string }) => {
    setBusy(true);
    setErrors({});
    try {
      await authService.saveMorning(facts);
      return true;
    } catch (error) {
      setErrors(readError(error));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const continueFromStage = async () => {
    if (years === null) {
      setErrors({ years: 'Choose a stage' });
      return;
    }

    const saved = await save({
      country: morningCountry(country)?.name,
      kind_of_work: kinds.join(','),
      years,
    });
    if (!saved) return;

    finishing.current = true;
    const fallback = `/?country=${country}`;
    const path = await completePendingJobAction(fallback, safeReturnPath(searchParams.get('returnTo')));
    router.push(path);
  };

  if (!ready) {
    return <div className="min-h-screen bg-[#f4f3ef]" />;
  }

  const opening = pending?.action === 'save' ? `To save ${title}.` : title ? `To apply for ${title}.` : '';
  const finishLabel = pending?.action === 'save'
    ? 'Save this role'
    : pending?.action === 'apply'
      ? 'Apply for this role'
      : "Go to today's list";

  return (
    <Frame step={step}>
      {step === 'email' ? (
        <div className="space-y-6">
          {opening ? <p className="text-sm text-[#1d3c34]/70">{opening}</p> : null}
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">Start with your email.</h1>
            <p className="mt-3 text-[17px] leading-relaxed text-[#1d3c34]/80">
              No password. We send a code, then set up your morning.
            </p>
          </div>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Email address</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@email.com"
              className="h-12 w-full rounded-lg border border-black/10 bg-white px-3 text-[#16382c] outline-none focus:border-[#1d3c34]"
            />
            {errors.email ? <span className="mt-1 block text-sm text-red-600">{errors.email}</span> : (
              <span className="mt-2 block text-sm text-[#1d3c34]/60">A single-use code will be sent here.</span>
            )}
          </label>
          {errors.general ? <p className="text-sm text-red-600">{errors.general}</p> : null}
          <Turnstile
            ref={turnstileRef}
            onSuccess={setTurnstileToken}
            onError={() => setTurnstileToken('')}
            onExpire={() => setTurnstileToken('')}
          />
          {errors.turnstile ? <p className="text-sm text-red-600">{errors.turnstile}</p> : null}
          <PrimaryButton disabled={busy} onClick={() => void sendCode()}>Continue with email →</PrimaryButton>
          <div className="rounded-2xl bg-white/70 px-4 py-4 text-sm leading-relaxed text-[#1d3c34]/75">
            By continuing, you agree to the <Link href="/terms" className="underline">Terms</Link> and the <Link href="/privacy" className="underline">Privacy Policy</Link>. We do not sell the address.
          </div>
          <p className="text-center text-sm text-[#1d3c34]/70">
            Already use a password? <Link href={searchParams.toString() ? `/auth/login?${searchParams.toString()}` : '/auth/login'} className="underline">Sign in</Link>
          </p>
        </div>
      ) : null}

      {step === 'code' ? (
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">Enter the 6-digit code.</h1>
            <p className="mt-3 text-[17px] leading-relaxed text-[#1d3c34]/80">
              We sent it to {email}. <button type="button" className="underline" onClick={() => { setCode(''); setStep('email'); }}>Change email</button>
            </p>
          </div>
          <CodeBoxes value={code} onChange={setCode} />
          {errors.code ? <p className="text-sm text-red-600">{errors.code}</p> : null}
          {errors.general ? <p className="text-sm text-red-600">{errors.general}</p> : null}
          <PrimaryButton disabled={busy} onClick={() => void verify()}>Verify and proceed →</PrimaryButton>
          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              disabled={resendIn > 0 || busy}
              className="underline disabled:cursor-default disabled:no-underline disabled:text-[#1d3c34]/50"
              onClick={() => void resendCode()}
            >
              {resendIn > 0 ? `Resend in ${Math.floor(resendIn / 60)}:${String(resendIn % 60).padStart(2, '0')}` : 'Resend code'}
            </button>
            <span className="text-[#1d3c34]/60">{notice || 'It expires in 10 minutes.'}</span>
          </div>
        </div>
      ) : null}

      {step === 'name' ? (
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">What should we call you?</h1>
          </div>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Name</span>
            <input
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-12 w-full rounded-lg border border-black/10 bg-white px-3 text-[#16382c] outline-none focus:border-[#1d3c34]"
            />
            {errors.name ? <span className="mt-1 block text-sm text-red-600">{errors.name}</span> : null}
          </label>
          {errors.general ? <p className="text-sm text-red-600">{errors.general}</p> : null}
          <PrimaryButton disabled={busy || name.trim() === ''} onClick={() => void saveName()}>Continue →</PrimaryButton>
        </div>
      ) : null}

      {step === 'country' ? (
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">Where are you looking?</h1>
            <p className="mt-3 text-[17px] leading-relaxed text-[#1d3c34]/80">
              The morning list is for one country.
            </p>
          </div>
          <div className="space-y-3">
            {MORNING_COUNTRIES.map((item) => {
              const selected = item.slug === country;
              const open = counts[item.slug];
              return (
                <button
                  key={item.slug}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    countryTouched.current = true;
                    setCountry(item.slug);
                  }}
                  className={`flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-left ${selected ? 'bg-[#e7f0e4]' : 'bg-white'}`}
                >
                  <img
                    src={`https://flagcdn.com/w80/${CALLING_CODES[item.slug].iso.toLowerCase()}.png`}
                    alt=""
                    width={32}
                    height={24}
                    className="h-6 w-8 rounded-sm object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{item.name}</span>
                    <span className="block text-sm text-[#1d3c34]/60">{item.places}</span>
                  </span>
                  <span className="text-sm text-[#1d3c34]/70">{typeof open === 'number' ? `${open} open` : ''}</span>
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${selected ? 'border-[#1d3c34] bg-[#1d3c34] text-white' : 'border-black/15'}`}>
                    {selected ? '✓' : ''}
                  </span>
                </button>
              );
            })}
          </div>
          {errors.general ? <p className="text-sm text-red-600">{errors.general}</p> : null}
          <PrimaryButton disabled={busy} onClick={() => void save({ country: morningCountry(country)?.name }).then((ok) => { if (ok) setStep('kind'); })}>
            Save and continue →
          </PrimaryButton>
        </div>
      ) : null}

      {step === 'kind' ? (
        <div>
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">What kind of work?</h1>
            <p className="mt-3 min-h-6 text-[17px] leading-relaxed text-[#1d3c34]/80">
              {kinds.length === 0
                ? 'Choose any that fit.'
                : KINDS.filter((item) => kinds.includes(item.value)).map((item) => item.label).join(', ')}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {KINDS.map((item) => {
              const selected = kinds.includes(item.value);
              return (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setKinds((current) => selected ? current.filter((value) => value !== item.value) : [...current, item.value])}
                  className={`rounded-full px-4 py-2.5 text-sm font-medium ${selected ? 'bg-[#1d3c34] text-white' : 'bg-white text-[#16382c] ring-1 ring-black/10'}`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <div className="sticky bottom-0 z-10 -mx-4 mt-8 bg-[#f4f3ef]/95 px-4 py-4 backdrop-blur-sm">
            <StepActions onBack={() => setStep('country')}>
              <PrimaryButton disabled={kinds.length === 0 || busy} onClick={() => void save({ kind_of_work: kinds.join(',') }).then((ok) => { if (ok) setStep('years'); })}>
                Continue →
              </PrimaryButton>
            </StepActions>
          </div>
        </div>
      ) : null}

      {step === 'years' ? (
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">What stage?</h1>
            <p className="mt-3 text-[17px] leading-relaxed text-[#1d3c34]/80">A rough sense of your work experience is enough.</p>
          </div>
          <div className="space-y-3">
            {STAGES.map((item) => {
              const selected = years === item.years;
              return (
                <button
                  key={item.years}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setYears(item.years)}
                  className={`flex h-14 w-full items-center justify-between rounded-2xl px-4 text-left text-sm font-semibold ${selected ? 'bg-[#1d3c34] text-white' : 'bg-white text-[#16382c]'}`}
                >
                  <span>{item.label}</span>
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs ${selected ? 'border-white bg-white text-[#1d3c34]' : 'border-black/15'}`}>
                    {selected ? '✓' : ''}
                  </span>
                </button>
              );
            })}
          </div>
          {errors.years ? <p className="text-sm text-red-600">{errors.years}</p> : null}
          <StepActions onBack={() => setStep('kind')}>
            <PrimaryButton disabled={years === null || busy} onClick={() => void continueFromStage()}>{finishLabel} →</PrimaryButton>
          </StepActions>
        </div>
      ) : null}

    </Frame>
  );
}

export default function StartPage() {
  return (
    <Suspense>
      <StartForm />
    </Suspense>
  );
}
