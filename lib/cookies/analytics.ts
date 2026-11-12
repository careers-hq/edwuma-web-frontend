import posthog from "posthog-js";

const GA_MEASUREMENT_ID = "G-REZ4R5TQBW";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function ensureGtag(): void {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
}

function expireCookie(name: string): void {
  const host = window.location.hostname;
  const domains = ["", host, `.${host}`];

  for (const domain of domains) {
    const domainAttr = domain ? `; domain=${domain}` : "";
    document.cookie = `${name}=; Max-Age=0; path=/${domainAttr}`;
  }
}

function clearAnalyticsStorage(): void {
  const names = document.cookie
    .split(";")
    .map((part) => part.trim().split("=")[0])
    .filter((name) => name === "_gid" || name.startsWith("_ga") || name.startsWith("ph_"));

  for (const name of names) expireCookie(name);

  try {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith("ph_")) localStorage.removeItem(key);
    }
  } catch {
    // Storage can be blocked. The choice itself is already saved.
  }
}

function syncGoogleAnalytics(analytics: boolean): void {
  ensureGtag();
  const loaded = Boolean(document.getElementById("edwuma-ga"));

  if (!loaded) {
    window.gtag?.("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }

  window.gtag?.("consent", "update", {
    analytics_storage: analytics ? "granted" : "denied",
  });

  if (!analytics) {
    clearAnalyticsStorage();
    return;
  }

  if (loaded) return;

  const script = document.createElement("script");
  script.id = "edwuma-ga";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
  window.gtag?.("js", new Date());
  window.gtag?.("config", GA_MEASUREMENT_ID);
}

function syncPostHog(analytics: boolean): void {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY || !posthog.__loaded) return;

  if (analytics) {
    posthog.set_config({ persistence: "localStorage+cookie" });
    if (posthog.has_opted_out_capturing()) {
      posthog.opt_in_capturing();
      posthog.capture("$pageview");
    }
    return;
  }

  posthog.opt_out_capturing();
  posthog.set_config({ persistence: "memory" });
}

export function syncAnalytics(analytics: boolean): void {
  if (typeof window === "undefined") return;
  syncPostHog(analytics);
  syncGoogleAnalytics(analytics);
}
