/**
 * Showcase Card Data
 *
 * Edit this file to change card content, colors, or add more cards.
 * All 4 prototype variants read from this single data source.
 */

export interface ShowcaseCard {
  id: string;
  step: number;
  eyebrow: string;
  problemHeadline: string;
  problemDescription: string;
  solutionName: string;
  solutionDescription: string;
  ctaText: string;
  ctaHref: string;
  /** Per-card accent color — used for borders, badges, sidebar accents */
  accentColor: string;
  /** Determines which mock visual to render on the visual side */
  mockType: 'cost' | 'tracking' | 'compliance' | 'workflow';
}

export const showcaseCards: ShowcaseCard[] = [
  {
    id: 'hidden-costs',
    step: 1,
    eyebrow: 'Hidden Costs',
    problemHeadline: 'Landed costs erase your margins before you even notice',
    problemDescription:
      'Teams struggle to identify operational bottlenecks across disconnected systems. An order looks profitable at supplier quote stage — then duty, freight, and tax pile up after commitment.',
    solutionName: 'Landed Cost Calculator',
    solutionDescription:
      'Our platform unifies cost visibility in one operational dashboard. Model full landed cost before commitment with duty, freight, and tax breakdowns — so you know the real number before you commit.',
    ctaText: 'Estimate Cost',
    ctaHref: '/onboarding?redirect=/cost-calculator',
    accentColor: '#f59e0b',
    mockType: 'cost',
  },
  {
    id: 'shipment-delays',
    step: 2,
    eyebrow: 'Shipment Delays',
    problemHeadline: 'Delays surface too late to prevent downstream chaos',
    problemDescription:
      'Manual follow-ups and fragmented communication slow down execution. Teams track across multiple carrier portals, so blockers appear after the delivery promise is already missed.',
    solutionName: 'Tracking + Booking',
    solutionDescription:
      'Our platform automates coordination, alerts, and next-step actions across teams. Centralize booking and shipment visibility with milestone-level tracking in a single timeline.',
    ctaText: 'Track Shipment',
    ctaHref: '/onboarding?redirect=/track-shipment',
    accentColor: '#3b82f6',
    mockType: 'tracking',
  },
  {
    id: 'compliance-gaps',
    step: 3,
    eyebrow: 'Compliance Gaps',
    problemHeadline: 'One wrong code can stall clearance and trigger penalties',
    problemDescription:
      'Leaders lack real-time insight into outcomes, risks, and performance trends. One wrong HS code, missing document, or screening miss can stall clearance and trigger avoidable penalties.',
    solutionName: 'Compliance Tools',
    solutionDescription:
      'Our platform delivers live analytics, trend monitoring, and decision-ready reporting. Reduce documentation and classification errors with guided trade compliance workflows.',
    ctaText: 'Check Compliance',
    ctaHref: '/onboarding?redirect=/compliance-tools',
    accentColor: '#ef4444',
    mockType: 'compliance',
  },
  {
    id: 'scaling-inconsistency',
    step: 4,
    eyebrow: 'Scaling Challenges',
    problemHeadline: 'Growth creates inconsistency and compliance blind spots',
    problemDescription:
      'Scaling processes across teams creates inconsistency and compliance gaps. What worked for 10 shipments a month breaks at 100 — tribal knowledge doesn\'t scale.',
    solutionName: 'Standardized Workflows',
    solutionDescription:
      'Our platform standardizes execution with governed workflows, role-based controls, and auditability. Build repeatable processes that scale with your trade volume.',
    ctaText: 'See Platform',
    ctaHref: '/onboarding',
    accentColor: '#8b5cf6',
    mockType: 'workflow',
  },
];
