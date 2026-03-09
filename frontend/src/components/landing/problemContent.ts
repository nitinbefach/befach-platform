export type Severity = 'high' | 'medium';

export interface ProblemBlock {
  id: string;
  title: string;
  story: string;
  painSignal: string;
  severity: Severity;
  visual: {
    label: string;
    points: string[];
  };
  solutionRef: string;
}

export interface SolutionBlock {
  id: string;
  featureName: string;
  description: string;
  ctaHref: string;
  ctaText: string;
  proofPoint: string;
}

export interface PlatformDepthItem {
  id: string;
  title: string;
  description: string;
  href: string;
}

export interface OutcomeStory {
  id: string;
  problem: string;
  outcome: string;
  persona: string;
}

export const problemBlocks: ProblemBlock[] = [
  {
    id: 'hidden-costs',
    title: 'Hidden landed costs erase your margin',
    story:
      'An order looks profitable at supplier quote stage, then duty, freight, and tax pile up after commitment.',
    painSignal: 'Margin loss risk: up to double-digit variance per shipment.',
    severity: 'high',
    visual: {
      label: 'Cost leak path',
      points: ['Supplier quote', 'Freight surprise', 'Duty uplift', 'IGST burden'],
    },
    solutionRef: 'landed-cost',
  },
  {
    id: 'delay-chaos',
    title: 'Shipment delays show up too late to react',
    story:
      'Teams track across multiple carrier portals, so blockers appear after the delivery promise is already missed.',
    painSignal: 'Late-delivery risk: missed commitments and escalation loops.',
    severity: 'high',
    visual: {
      label: 'Delay chain',
      points: ['Booking gap', 'Transit blind spot', 'Customs hold', 'Warehouse impact'],
    },
    solutionRef: 'tracking-booking',
  },
  {
    id: 'compliance-risk',
    title: 'Compliance gaps create clearance and penalty exposure',
    story:
      'One wrong code, missing document, or screening miss can stall clearance and trigger avoidable penalties.',
    painSignal: 'Compliance risk: delayed release and extra charges.',
    severity: 'medium',
    visual: {
      label: 'Clearance friction',
      points: ['HS mismatch', 'Doc mismatch', 'Screening flag', 'Manual rework'],
    },
    solutionRef: 'compliance-tools',
  },
];

export const solutionBlocks: SolutionBlock[] = [
  {
    id: 'landed-cost',
    featureName: 'Landed Cost Calculator',
    description: 'Model full landed cost before commitment with duty, freight, and tax visibility.',
    ctaHref: '/onboarding?redirect=/cost-calculator',
    ctaText: 'Estimate Cost',
    proofPoint: 'Breakdowns by component with reusable history.',
  },
  {
    id: 'tracking-booking',
    featureName: 'Tracking + Booking',
    description: 'Centralize booking and shipment visibility with milestone-level tracking.',
    ctaHref: '/onboarding?redirect=/track-shipment',
    ctaText: 'Track Shipment',
    proofPoint: 'Single timeline across movement, customs, and delivery.',
  },
  {
    id: 'compliance-tools',
    featureName: 'Compliance Tools',
    description: 'Reduce documentation and classification errors with guided trade workflows.',
    ctaHref: '/onboarding?redirect=/compliance-tools',
    ctaText: 'Check Compliance',
    proofPoint: 'Structured checks before filing and clearance handoff.',
  },
];

export const platformDepthItems: PlatformDepthItem[] = [
  {
    id: 'sourcing',
    title: 'Smart Sourcing',
    description: 'Find and shortlist suppliers with structured filters and match context.',
    href: '/smart-sourcing',
  },
  {
    id: 'exim',
    title: 'EXIM Intelligence',
    description: 'Analyze shipment trends and competitor trade movement.',
    href: '/exim-data',
  },
  {
    id: 'ai',
    title: 'AI Assistant',
    description: 'Resolve trade questions and workflow decisions faster.',
    href: '/dashboard',
  },
  {
    id: 'payments',
    title: 'Payments & FX',
    description: 'Track payable flow and currency exposure in one place.',
    href: '/payments/history',
  },
  {
    id: 'orders',
    title: 'Order Control',
    description: 'Monitor order lifecycle from confirmation to final delivery.',
    href: '/my-orders',
  },
];

export const outcomeStories: OutcomeStory[] = [
  {
    id: 'cost-outcome',
    problem: 'Quote-stage confidence was low due to hidden import cost shocks.',
    outcome: 'Teams moved to pre-order landed-cost decisions and improved gross margin predictability.',
    persona: 'Importer operations lead',
  },
  {
    id: 'delay-outcome',
    problem: 'Shipment updates were fragmented and escalation started late.',
    outcome: 'Milestone tracking improved visibility and reduced firefighting near promised dates.',
    persona: 'Export fulfillment manager',
  },
  {
    id: 'compliance-outcome',
    problem: 'Documentation rework caused avoidable customs delays.',
    outcome: 'Pre-check workflows reduced submission errors and clearance friction.',
    persona: 'Trade compliance coordinator',
  },
];
