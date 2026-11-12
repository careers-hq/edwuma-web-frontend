"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { syncAnalytics } from "@/lib/cookies/analytics";
import {
  OPEN_COOKIE_SETTINGS_EVENT,
  readConsent,
  writeConsent,
} from "@/lib/cookies/consent";

export default function CookieConsent() {
  const titleId = useId();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const existing = readConsent();
    if (existing) {
      setAnalytics(existing.analytics);
      syncAnalytics(existing.analytics);
    } else {
      setOpen(true);
    }
    setReady(true);

    const showSettings = () => {
      const current = readConsent();
      setAnalytics(current?.analytics ?? false);
      setSettingsOpen(true);
      setOpen(true);
    };

    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, showSettings);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, showSettings);
  }, []);

  if (!ready || !open) return null;

  function save(nextAnalytics: boolean) {
    writeConsent(nextAnalytics);
    syncAnalytics(nextAnalytics);
    setAnalytics(nextAnalytics);
    setSettingsOpen(false);
    setOpen(false);
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center p-3 sm:p-6">
      <section
        role="dialog"
        aria-labelledby={titleId}
        className="pointer-events-auto flex max-h-[calc(100dvh-1.5rem)] w-full max-w-3xl flex-col rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)] sm:p-8"
      >
        <div className={`overflow-y-auto ${settingsOpen ? "grid gap-6 md:grid-cols-[180px_1fr] md:gap-8" : ""}`}>
          {settingsOpen && (
            <fieldset className="space-y-4">
              <legend className="sr-only">Cookie categories</legend>
              <label className="flex items-start gap-3 text-[#141414]">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="mt-0.5 size-5 rounded border-black/20 accent-[#244034]"
                />
                <span className="font-medium">Essential</span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 text-[#141414]">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(event) => setAnalytics(event.target.checked)}
                  className="mt-0.5 size-5 rounded border-black/20 accent-[#244034]"
                />
                <span className="font-medium">Analytics</span>
              </label>
            </fieldset>
          )}

          <div>
            <h2 id={titleId} className="text-3xl font-extrabold tracking-[-0.04em] text-[#141414]">
              Cookies
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-[#141414]">
              We use cookies to keep you signed in and, if you allow it, to measure how the site is used.
              Essential cookies stay on. I accept allows analytics. I refuse leaves analytics off. You can
              change that choice in cookie settings. Read the{" "}
              <Link href="/cookies" className="text-[#244034] underline">
                Cookies policy
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="mt-6 flex shrink-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
          <button
            type="button"
            aria-expanded={settingsOpen}
            onClick={() => setSettingsOpen((open) => !open)}
            className="rounded-full border-2 border-[#244034] px-5 py-2.5 text-sm font-semibold text-[#244034] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#244034]"
          >
            {settingsOpen ? "Hide cookie settings" : "Show cookie settings"}
          </button>
          <button
            type="button"
            onClick={() => save(false)}
            className="rounded-full border-2 border-[#244034] px-5 py-2.5 text-sm font-semibold text-[#244034] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#244034]"
          >
            I refuse
          </button>
          <button
            type="button"
            onClick={() => save(settingsOpen ? analytics : true)}
            className="rounded-full bg-[#244034] px-5 py-2.5 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#244034]"
          >
            I accept
          </button>
        </div>
      </section>
    </div>
  );
}
