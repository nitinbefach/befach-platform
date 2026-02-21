/**
 * Tour steps for NextStep.js — built from existing walkthroughSteps configs.
 * Each feature in FEATURE_FLOW_ORDER becomes one step in the "befach-tour".
 */

import type { Tour } from 'nextstepjs';
import { WALKTHROUGH_CONFIGS, FEATURE_FLOW_ORDER } from './walkthroughSteps';

function buildSteps() {
  return FEATURE_FLOW_ORDER.map((featureId, index) => {
    const config = WALKTHROUGH_CONFIGS[featureId];
    if (!config) return null;

    const prevConfig = index > 0 ? WALKTHROUGH_CONFIGS[FEATURE_FLOW_ORDER[index - 1]] : null;
    const nextConfig = index < FEATURE_FLOW_ORDER.length - 1 ? WALKTHROUGH_CONFIGS[FEATURE_FLOW_ORDER[index + 1]] : null;

    return {
      icon: '👋',
      title: config.title,
      content: (
        <div className="tour-step-content">
          <p className="tour-description">{config.description}</p>
          <ul className="tour-highlights">
            {config.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
          <div className="tour-tip">
            <strong>Pro Tip:</strong> {config.tip}
          </div>
        </div>
      ),
      selector: config.target,
      side: 'bottom' as const,
      showControls: true,
      showSkip: true,
      pointerPadding: 10,
      pointerRadius: 12,
      nextRoute: nextConfig && nextConfig.route !== config.route ? nextConfig.route : undefined,
      prevRoute: prevConfig && prevConfig.route !== config.route ? prevConfig.route : undefined,
    };
  }).filter(Boolean);
}

export const tourSteps: Tour[] = [
  {
    tour: 'befach-tour',
    steps: buildSteps() as Tour['steps'],
  },
];
