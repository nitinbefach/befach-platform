interface MinimalPostHog {
  capture: (eventName: string, properties?: Record<string, unknown>) => void;
}

export interface LandingEventPayload {
  event_name: string;
  variant: 'A' | 'B';
  problem_id?: string;
  section: string;
  cta_type?: 'primary' | 'secondary' | 'problem' | 'solution';
}

export function captureLandingEvent(posthog: MinimalPostHog | null | undefined, payload: LandingEventPayload) {
  if (!posthog) return;
  posthog.capture(payload.event_name, { ...payload });
}
