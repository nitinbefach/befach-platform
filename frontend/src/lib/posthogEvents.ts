import posthog from 'posthog-js';

/**
 * Capture a feature-specific action event for PostHog survey targeting.
 * Events follow the pattern: {feature}_{action}
 * e.g., captureFeatureAction('cost_calculator', 'calculated') → 'cost_calculator_calculated'
 */
export function captureFeatureAction(
  feature: string,
  action: string,
  properties?: Record<string, unknown>
) {
  posthog.capture(`${feature}_${action}`, {
    feature_name: feature,
    ...properties,
  });
}
