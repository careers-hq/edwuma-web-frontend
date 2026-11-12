'use client';

import React, { useEffect, useState } from 'react';
import AccountFrame from '@/components/account/AccountFrame';
import { ProtectedRoute, useAuth } from '@/lib/auth';
import { authService } from '@/lib/api';
import { CALLING_CODES, MORNING_COUNTRIES, morningCountry, type MorningCountrySlug } from '@/lib/morning/countries';
import { KINDS, STAGES } from '@/lib/morning/work';

function ProfileContent() {
  const { user, rememberUser } = useAuth();
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState<MorningCountrySlug>('ghana');
  const [kinds, setKinds] = useState<string[]>([]);
  const [years, setYears] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const profileUser = await authService.fetchProfile();
        if (cancelled) return;
        rememberUser(profileUser);
        const profile = profileUser.profile;
        setFirstName(profile?.first_name ?? '');
        setLastName(profile?.last_name ?? '');
        setCountry(morningCountry(profile?.country)?.slug ?? 'ghana');
        setKinds((profile?.kind_of_work ?? '').split(',').map((part) => part.trim()).filter(Boolean));
        setYears(profile?.years ?? null);
      } catch (loadError) {
        console.error('Error loading the profile:', loadError);
        if (!cancelled) setError('Could not load the profile.');
      } finally {
        if (!cancelled) setReady(true);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [rememberUser]);

  const save = async () => {
    if (!firstName.trim()) {
      setError('Enter a first name.');
      return;
    }
    if (kinds.length === 0 || years === null) {
      setError('Choose the work and a stage.');
      return;
    }

    setBusy(true);
    setError('');
    setNotice('');
    try {
      await authService.updateName(firstName.trim(), lastName.trim());
      const saved = await authService.saveMorning({
        country: morningCountry(country)?.name,
        kind_of_work: kinds.join(','),
        years,
      });
      if (saved) rememberUser(saved);
      setNotice('Saved.');
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : 'Could not save.';
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AccountFrame image="/images/account/profile.jpg" alt="A blank card and a notebook on a wooden desk.">
      <h1 className="text-4xl font-semibold tracking-tight">Profile</h1>
      {user?.email ? <p className="mt-3 text-[17px] text-[#1d3c34]/80">{user.email}</p> : null}

      {!ready ? <div className="h-40" /> : (
        <div className="mt-8 space-y-8">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">First name</span>
              <input
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="h-12 w-full rounded-lg border border-black/10 bg-white px-3 outline-none focus:border-[#1d3c34]"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Last name</span>
              <input
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className="h-12 w-full rounded-lg border border-black/10 bg-white px-3 outline-none focus:border-[#1d3c34]"
              />
            </label>
          </div>

          <div>
            <h2 className="text-sm font-medium">Where are you looking?</h2>
            <div className="mt-3 space-y-2">
              {MORNING_COUNTRIES.map((item) => {
                const selected = item.slug === country;
                return (
                  <button
                    key={item.slug}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setCountry(item.slug)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left ${selected ? 'bg-[#e7f0e4]' : 'bg-white'}`}
                  >
                    <img
                      src={`https://flagcdn.com/w80/${CALLING_CODES[item.slug].iso.toLowerCase()}.png`}
                      alt=""
                      className="h-6 w-8 rounded-sm object-cover"
                    />
                    <span className="font-medium">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-medium">What kind of work?</h2>
            <div className="mt-3 flex flex-wrap gap-2">
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
          </div>

          <div>
            <h2 className="text-sm font-medium">What stage?</h2>
            <div className="mt-3 space-y-2">
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
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {notice ? <p className="text-sm text-[#1d3c34]/70">{notice}</p> : null}
          <button
            type="button"
            disabled={busy}
            onClick={() => void save()}
            className="flex h-12 w-full items-center justify-center rounded-lg bg-[#1d3c34] text-[15px] font-medium text-white disabled:opacity-50"
          >
            Save
          </button>
        </div>
      )}
    </AccountFrame>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
