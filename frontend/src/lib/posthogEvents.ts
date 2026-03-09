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
    posthog.capture(`${feature}_${action}`, {
      feature_name: feature,
      ...properties,
    });
  } catch (e) {
    // PostHog may not be initialized in dev mode
  }
}
