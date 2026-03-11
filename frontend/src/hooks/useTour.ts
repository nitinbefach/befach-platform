'use client';

import { useEffect, useCallback, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CallBackProps, STATUS, Step } from 'react-joyride';
import { hasCompletedTour, completeTour } from '@/lib/tourStorage';

interface UseTourOptions {
  tourId: string;
  steps: Step[];
  autoStart?: boolean;
}

export function useTour({ tourId, steps, autoStart = true }: UseTourOptions) {
  const [run, setRun] = useState(false);
  const searchParams = useSearchParams();
  const hasTourParam = searchParams.get('tour') === 'true';

  const handleJoyrideCallback = useCallback(
    (data: CallBackProps) => {
      const { status } = data;
      if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
        completeTour(tourId);
        setRun(false);
      }
    },
    [tourId]
  );

  const startTour = useCallback(() => {
    if (steps.length === 0) return;
    // Small delay to let DOM settle after hydration/animations
    setTimeout(() => {
      setRun(true);
    }, 600);
  }, [steps]);

  // Auto-start logic
  useEffect(() => {
    if (!autoStart) return;
    if (!hasTourParam && hasCompletedTour(tourId)) return;

    // Wait for page animations to finish
    const timer = setTimeout(() => {
      setRun(true);
    }, 800);

    return () => clearTimeout(timer);
  }, [autoStart, hasTourParam, tourId]);

  return { run, steps, startTour, handleJoyrideCallback };
}
