import posthog from "posthog-js";
import { hasAnalyticsConsent } from "@/lib/cookies/consent";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (key) {
  const analytics = hasAnalyticsConsent();

  posthog.init(key, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    defaults: "2025-05-24",
    capture_exceptions: true,
    debug: process.env.NODE_ENV === "development",
    opt_out_capturing_by_default: !analytics,
    persistence: analytics ? "localStorage+cookie" : "memory",
  });
}
