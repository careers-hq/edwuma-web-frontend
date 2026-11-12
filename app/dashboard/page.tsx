'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AccountFrame from '@/components/account/AccountFrame';
import { ProtectedRoute, useAuth } from '@/lib/auth';
import { authService, savedJobsService, userActivitiesService } from '@/lib/api';
import type { ActivitySummary, SavedJob } from '@/lib/api';
import { morningCountry } from '@/lib/morning/countries';
import { kindLabelList, stageLabel } from '@/lib/morning/work';
function readHref(id: string, country?: string): string {
  return country ? `/read/${id}?country=${country}` : `/read/${id}`;
}

function roleTitle(title: string): string {
  return title.replace(/\s+at\s+.+$/i, '').trim() || title;
}

function DashboardContent() {
  const { user, getUserDisplayName, rememberUser } = useAuth();
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [activity, setActivity] = useState<ActivitySummary[]>([]);
  const [ready, setReady] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [profile, saved, recent] = await Promise.all([
          authService.fetchProfile(),
          savedJobsService.getSavedJobs(1, 20),
          userActivitiesService.getSummary(10),
        ]);
        if (cancelled) return;
        rememberUser(profile);
        if (saved.success) setSavedJobs(saved.data.data ?? []);
        if (recent.success) {
          setActivity(recent.data.filter((item) => item.type === 'apply_click' || item.type === 'save'));
        }
      } catch (error) {
        console.error('Error loading the dashboard:', error);
      } finally {
        if (!cancelled) setReady(true);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [rememberUser]);

  const profile = user?.profile;
  const country = morningCountry(profile?.country);
  const morning = [country?.name, kindLabelList(profile?.kind_of_work), stageLabel(profile?.years)].filter(Boolean).join(' · ');

  const removeSaved = async (id: string) => {
    if (removingId) return;
    setRemovingId(id);
    try {
      const response = await savedJobsService.unsaveJob(id);
      if (response.success) {
        setSavedJobs((current) => current.filter((job) => job.id !== id));
      }
    } catch (error) {
      console.error('Error removing a saved role:', error);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <AccountFrame image="/images/account/saved.jpg" alt="A bookmarked card on a wooden desk, with a cup beside it.">
      {!ready ? <div className="h-40" /> : (
        <>
          <h1 className="text-4xl font-semibold tracking-tight">{getUserDisplayName()}</h1>
          <Link href="/profile" className="mt-3 block text-[17px] leading-relaxed text-[#1d3c34]/80">
            {morning || 'Profile'}
          </Link>
          <Link
            href={country ? `/?country=${country.slug}` : '/'}
            className="mt-8 flex h-12 w-full items-center justify-center rounded-lg bg-[#1d3c34] text-[15px] font-medium text-white"
          >
            Today&apos;s list
          </Link>

          <section id="saved" className="mt-12">
            <h2 className="text-sm font-medium text-[#1d3c34]/70">Saved</h2>
            {savedJobs.length === 0 ? (
              <p className="mt-4 text-[17px]">Nothing saved.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {savedJobs.map((saved) => {
                  const company = saved.job.companies?.[0]?.name;
                  const place = saved.job.locations?.[0]?.name;
                  return (
                    <li key={saved.id} className="rounded-2xl bg-white px-4 py-3">
                      <div className="flex items-start justify-between gap-4">
                        <Link href={readHref(saved.job.id, country?.slug)} className="min-w-0">
                          <p className="font-semibold">{roleTitle(saved.job.title)}</p>
                          <p className="text-sm text-[#1d3c34]/60">{[company, place].filter(Boolean).join(' · ')}</p>
                        </Link>
                        <button
                          type="button"
                          onClick={() => void removeSaved(saved.id)}
                          disabled={removingId === saved.id}
                          className="shrink-0 text-sm text-[#1d3c34]/70 underline disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {activity.length > 0 ? (
            <section className="mt-12">
              <h2 className="text-sm font-medium text-[#1d3c34]/70">Recent</h2>
              <ul className="mt-4 space-y-3">
                {activity.slice(0, 5).map((item) => (
                  <li key={item.id}>
                    <Link href={readHref(item.job_slug, country?.slug)} className="block rounded-2xl bg-white px-4 py-3">
                      <p className="text-sm text-[#1d3c34]/60">{item.type === 'save' ? 'Saved' : 'Applied'}</p>
                      <p className="font-semibold">{roleTitle(item.job_title)}</p>
                      <p className="text-sm text-[#1d3c34]/60">{[item.company, item.location].filter(Boolean).join(' · ')}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      )}
    </AccountFrame>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
