'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { DriveStep } from 'driver.js';
import { createTour } from '@/lib/tourConfig';
import { hasCompletedTour, completeTour } from '@/lib/tourStorage';

interface UseTourOptions {
  tourId: string;
  steps: DriveStep[];
  autoStart?: boolean; // start if ?tour=true and not completed
}

export function useTour({ tourId, steps, autoStart = true }: UseTourOptions) {
  const driverRef = useRef<ReturnType<typeof createTour> | null>(null);
  const [isActive, setIsActive] = useState(false);
  const searchParams = useSearchParams();
  const hasTourParam = searchParams.get('tour') === 'true';

  const startTour = useCallback(() => {
    if (steps.length === 0) return;

    // Destroy previous instance if any
    driverRef.current?.destroy();

    const instance = createTour({
      steps,
      onDestroyStarted: () => {
        completeTour(tourId);
        setIsActive(false);
        instance.destroy();
      },
    });

    driverRef.current = instance;

    // Small delay to let DOM settle after hydration/animations
    setTimeout(() => {
      setIsActive(true);
      instance.drive();
    }, 600);
  }, [tourId, steps]);

  // Auto-start logic
  useEffect(() => {
    if (!autoStart) return;
    if (!hasTourParam && hasCompletedTour(tourId)) return;

    // Wait for dashboard animations to finish
    const timer = setTimeout(() => {
      startTour();
    }, 800);

    return () => clearTimeout(timer);
  }, [autoStart, hasTourParam, tourId, startTour]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      driverRef.current?.destroy();
    };
  }, []);

  return { startTour, isActive };
}
