'use client';

import posthog from 'posthog-js';

/**
 * Capture a feature action event for PostHog survey targeting.
 * Events are named as `{feature}_{action}` (e.g. "cost_calculator_calculated").
 */
export function captureFeatureAction(
  feature: string,
  action: string,
  properties?: Record<string, any>
) {
  try {
    if ((posthog as any).__loaded) {
      console.log(`[PostHog Event] ${feature}_${action}`, properties);
      posthog.capture(`${feature}_${action}`, {
        feature_name: feature,
        ...properties,
      });
    }
  } catch (e) {
    // PostHog may not be initialized in dev mode
  }
}
