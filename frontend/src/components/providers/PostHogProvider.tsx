'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';

// Module-level init — runs once when file is imported, before any render
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: '/ingest',
    ui_host: 'https://us.i.posthog.com',
    capture_pageview: false,
    person_profiles: 'identified_only',
    opt_in_site_apps: true,
    loaded: (ph) => {
      // Force-load surveys after PostHog is ready
      ph.getActiveMatchingSurveys((surveys) => {
        if (surveys.length > 0) {
          console.log('[PostHog] Active surveys:', surveys.map(s => s.name));
        }
      });
    },
  });
}

/**
 * Reload PostHog surveys after user identification changes.
 * Call this after posthog.identify() to ensure survey targeting
 * conditions are re-evaluated with the new person properties.
 */
export function reloadPostHogSurveys() {
  try {
    posthog.getActiveMatchingSurveys((surveys) => {
      console.log('[PostHog] Reloaded surveys after identify:', surveys.map(s => s.name));
    }, true); // true = force reload from server
  } catch (e) { /* noop in dev */ }
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <PHProvider client={posthog}>{children}</PHProvider>;
}
