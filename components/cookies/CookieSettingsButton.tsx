"use client";

import { openCookieSettings } from "@/lib/cookies/consent";
import { cn } from "@/lib/utils";

export default function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={openCookieSettings}
      className={cn("text-left text-sm text-[#141414] hover:text-[#244034]", className)}
    >
      Cookie settings
    </button>
  );
}
