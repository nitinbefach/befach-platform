'use client';

import { NextStepProvider, NextStep } from 'nextstepjs';
import { useNextAdapter } from 'nextstepjs/adapters/next';
import { usePostHog } from 'posthog-js/react';
import { tourSteps } from '@/lib/tourSteps';
import TourCard from '@/components/walkthrough/TourCard';

export function NextStepWrapper({ children }: { children: React.ReactNode }) {
  const posthog = usePostHog();

  return (
    <NextStepProvider>
      <NextStep
        steps={tourSteps}
        cardComponent={TourCard}
        navigationAdapter={useNextAdapter}
        shadowRgb="0, 0, 0"
        shadowOpacity="0.6"
        onStart={(tour) => {
          posthog?.capture('tour_started', { tour });
        }}
        onStepChange={(step, tour) => {
          posthog?.capture('tour_step_viewed', { step: step + 1, tour });
        }}
        onComplete={(tour) => {
          posthog?.capture('tour_completed', { tour });
        }}
        onSkip={(step, tour) => {
          posthog?.capture('tour_skipped', { step_skipped_at: step + 1, tour });
        }}
      >
        {children}
      </NextStep>
    </NextStepProvider>
  );
}
