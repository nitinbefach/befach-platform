/**
 * Walkthrough configurations for all Befach features.
 * Each feature has structured intro content: title, highlights (action items),
 * a pro tip, and feedback config. Features are chained for guided navigation.
 */

export interface WalkthroughConfig {
  featureId: string;
  featureName: string;
  route: string;
  title: string;
  description: string;
  highlights: string[];    // 3 key things the user can do
  tip: string;             // pro tip for this feature
  target?: string;         // CSS selector for element to spotlight-highlight
  nextFeature?: string;
  feedbackQuestion: string;
  feedbackType: 'thumbs' | 'stars' | 'emoji';
}

// Ordered list of feature IDs — determines the walkthrough flow
export const FEATURE_FLOW_ORDER: string[] = [
  'dashboard',
  'my-orders',
  'cost-calculator',
  'smart-sourcing',
  'our-vendors',
  'submit-requirement',
  'market-insights',
  'book-shipment',
  'track-shipment',
  'documents',
  'compliance-tools',
  'payments-new',
  'payments-history',
  'payments-fx',
  'team-management',
  'reports',
  'ai-assistant',
  'settings',
];

export const WALKTHROUGH_CONFIGS: Record<string, WalkthroughConfig> = {
  // ── 1. Dashboard ───────────────────────────────────────────
  'dashboard': {
    featureId: 'dashboard',
    featureName: 'Dashboard',
    route: '/dashboard',
    nextFeature: 'my-orders',
    target: '.quick-actions-bar',
    title: 'Your Command Center',
    description: 'Everything you need at a glance — metrics, shipments, and quick actions.',
    highlights: [
      'View real-time metrics: orders, shipments, savings & suppliers',
      'Use Quick Actions to jump to any feature instantly',
      'Track recent shipments and pending tasks below',
    ],
    tip: 'Click any metric card to see detailed breakdowns',
    feedbackQuestion: "How's the Dashboard experience?",
    feedbackType: 'stars',
  },

  // ── 1b. My Orders ────────────────────────────────────────
  'my-orders': {
    featureId: 'my-orders',
    featureName: 'My Orders',
    route: '/my-orders',
    nextFeature: 'cost-calculator',
    target: '.stats-strip',
    title: 'Your Order Hub',
    description: 'Track all your import orders from placement to delivery.',
    highlights: [
      'View real-time order status and progress with visual stepper',
      'Filter by status — processing, in transit, customs, delivered',
      'Tap any order for full details, route, and payment info',
    ],
    tip: 'Use the stats strip to quickly filter by order status',
    feedbackQuestion: 'How useful is the orders timeline view?',
    feedbackType: 'thumbs',
  },

  // ── 2. Cost Calculator ─────────────────────────────────────
  'cost-calculator': {
    featureId: 'cost-calculator',
    featureName: 'Cost Calculator',
    route: '/cost-calculator',
    nextFeature: 'smart-sourcing',
    target: '.form-card',
    title: 'Landing Cost Calculator',
    description: 'Get the total landed cost of your imports in seconds.',
    highlights: [
      'Search HSN codes — duty & IGST rates fill automatically',
      'Choose shipping mode: Sea, Air, or Road freight',
      'Hit "Calculate" for full breakdown — save or export as PDF',
    ],
    tip: 'Add custom charges (insurance, handling) for a more accurate estimate',
    feedbackQuestion: 'How was the Cost Calculator?',
    feedbackType: 'stars',
  },

  // ── 3. Smart Sourcing ──────────────────────────────────────
  'smart-sourcing': {
    featureId: 'smart-sourcing',
    featureName: 'Smart Sourcing',
    route: '/smart-sourcing',
    nextFeature: 'our-vendors',
    target: '.source-tabs',
    title: 'AI-Powered Supplier Discovery',
    description: 'Find the right suppliers from verified networks and global marketplaces.',
    highlights: [
      'Type what you need in plain language in the search bar',
      'Compare Befach verified partners vs Alibaba/IndiaMART results',
      'Check ratings, MOQs, certifications & response rates per supplier',
    ],
    tip: 'Use the "Befach Partners" tab for pre-verified suppliers with faster response',
    feedbackQuestion: 'Did Smart Sourcing help you find suppliers?',
    feedbackType: 'thumbs',
  },

  // ── 4. Our Vendors ─────────────────────────────────────────
  'our-vendors': {
    featureId: 'our-vendors',
    featureName: 'Our Vendors',
    route: '/our-vendors',
    nextFeature: 'submit-requirement',
    target: '.results-section',
    title: 'Vendor Pipeline',
    description: 'Track and manage all your supplier relationships in one place.',
    highlights: [
      'See vendor stages: Prospect → Negotiation → Active Partner',
      'Click any vendor card for actions: RFQ, notes, tags',
      'Monitor health scores and relationship status at a glance',
    ],
    tip: 'Use tags to organize vendors by category or priority',
    feedbackQuestion: "How's vendor management working for you?",
    feedbackType: 'stars',
  },

  // ── 5. Submit Requirement ──────────────────────────────────
  'submit-requirement': {
    featureId: 'submit-requirement',
    featureName: 'Submit Requirement',
    route: '/submit-requirement',
    nextFeature: 'market-insights',
    target: '.tabs-container',
    title: 'Share Your Import Needs',
    description: 'Tell us what you need — we\'ll match you with the best suppliers.',
    highlights: [
      'Fill in product name, HSN code, quantity & target price',
      'Switch to "Bulk Upload" tab to import a CSV file',
      'Track progress: Pending → Supplier Found → Completed',
    ],
    tip: 'Add detailed specifications for more accurate supplier matching',
    feedbackQuestion: 'How was submitting your requirement?',
    feedbackType: 'stars',
  },

  // ── 6. Market Insights ─────────────────────────────────────
  'market-insights': {
    featureId: 'market-insights',
    featureName: 'Market Insights',
    route: '/market-insights',
    nextFeature: 'book-shipment',
    target: '.opportunity-card',
    title: 'Market Intelligence',
    description: 'Real-time data to help you make smarter sourcing decisions.',
    highlights: [
      'Monitor commodity prices, trade volumes & currency rates',
      'Click trending commodities for detailed price charts',
      'Add items to your watchlist for alerts & trend tracking',
    ],
    tip: 'Check the currency section before making international payments',
    feedbackQuestion: 'Are these market insights useful?',
    feedbackType: 'emoji',
  },

  // ── 7. Book Shipment ───────────────────────────────────────
  'book-shipment': {
    featureId: 'book-shipment',
    featureName: 'Book Shipment',
    route: '/book-shipment',
    nextFeature: 'track-shipment',
    target: '.segment-cards',
    title: 'Book a Shipment',
    description: 'Create bookings with carrier comparison and real-time rates.',
    highlights: [
      'Choose International or Local shipment type',
      'Fill origin, destination & cargo details step by step',
      'Compare carrier rates before confirming your booking',
    ],
    tip: 'Book early for sea freight — rates are usually lower 2-3 weeks ahead',
    feedbackQuestion: 'How was the shipment booking experience?',
    feedbackType: 'stars',
  },

  // ── 8. Track Shipment ──────────────────────────────────────
  'track-shipment': {
    featureId: 'track-shipment',
    featureName: 'Track Shipment',
    route: '/track-shipment',
    nextFeature: 'documents',
    target: '.search-form',
    title: 'Shipment Tracking',
    description: 'Monitor all your shipments with live location and status updates.',
    highlights: [
      'View active shipments with carrier, ETA & status',
      'Enter any container no., B/L or booking ID to track',
      'See the complete journey timeline with milestone events',
    ],
    tip: 'Click any shipment card for the full tracking timeline',
    feedbackQuestion: 'Is shipment tracking helpful?',
    feedbackType: 'thumbs',
  },

  // ── 9. Documents ───────────────────────────────────────────
  'documents': {
    featureId: 'documents',
    featureName: 'Documents',
    route: '/documents',
    nextFeature: 'compliance-tools',
    target: '.filters-section',
    title: 'Document Center',
    description: 'All your trade documents organized and accessible in one place.',
    highlights: [
      'Filter by type: invoices, BOE, shipping docs, certificates',
      'Check document status and linked order details',
      'Download or preview any document with one click',
    ],
    tip: 'Use the search bar to find documents by name or order number',
    feedbackQuestion: "How's document management?",
    feedbackType: 'thumbs',
  },

  // ── 10. Compliance Tools ───────────────────────────────────
  'compliance-tools': {
    featureId: 'compliance-tools',
    featureName: 'Compliance Tools',
    route: '/compliance-tools',
    nextFeature: 'payments-new',
    target: '.search-section',
    title: 'Stay Compliant',
    description: 'Check regulations, licenses, and manage Bills of Entry.',
    highlights: [
      'Search by HSN code or product name for regulations',
      'View applicable restrictions and required licenses',
      'Create and track Bills of Entry processing status',
    ],
    tip: 'Always check compliance before placing a large import order',
    feedbackQuestion: 'Are the compliance tools useful?',
    feedbackType: 'thumbs',
  },

  // ── 11. Make Payment ───────────────────────────────────────
  'payments-new': {
    featureId: 'payments-new',
    featureName: 'Make Payment',
    route: '/payments/new',
    nextFeature: 'payments-history',
    target: '.segment-selector',
    title: 'Pay Your Suppliers',
    description: 'Secure payments with transparent fees and real-time FX rates.',
    highlights: [
      'Choose International (cross-border) or Local transfer',
      'Follow the wizard: supplier → details → method → confirm',
      'Review full fee breakdown and exchange rate before paying',
    ],
    tip: 'Compare FX rates on the rates page before making large payments',
    feedbackQuestion: 'How was the payment experience?',
    feedbackType: 'stars',
  },

  // ── 12. Payment History ────────────────────────────────────
  'payments-history': {
    featureId: 'payments-history',
    featureName: 'Payment History',
    route: '/payments/history',
    nextFeature: 'payments-fx',
    target: '.filter-bar',
    title: 'Transaction History',
    description: 'Full record of all your payments, refunds, and credits.',
    highlights: [
      'Filter by type: payments, refunds, or credits',
      'Set date ranges to find specific transactions',
      'Click any transaction for supplier, fees & FX details',
    ],
    tip: 'Export transaction history for your accounting records',
    feedbackQuestion: 'Is payment history helpful?',
    feedbackType: 'thumbs',
  },

  // ── 13. FX Rates ───────────────────────────────────────────
  'payments-fx': {
    featureId: 'payments-fx',
    featureName: 'FX Rates',
    route: '/payments/fx-rates',
    nextFeature: 'team-management',
    target: '.converter-card',
    title: 'Currency & FX Rates',
    description: 'Live exchange rates, provider comparison, and historical trends.',
    highlights: [
      'Use the quick converter with live rates',
      'Compare fees across different payment providers',
      'View historical charts: 7 days to 1 year trends',
    ],
    tip: 'Track rate trends before scheduling large international payments',
    feedbackQuestion: 'Are the FX rate tools useful?',
    feedbackType: 'thumbs',
  },

  // ── 14. Team Management ────────────────────────────────────
  'team-management': {
    featureId: 'team-management',
    featureName: 'Team Management',
    route: '/team-management',
    nextFeature: 'reports',
    target: '.members-grid',
    title: 'Your Team',
    description: 'Manage members, roles, and permissions for your organization.',
    highlights: [
      'View all team members with roles and last active time',
      'Invite new members by email — they get instant access',
      'Assign roles: Owner, Admin, Member, or Viewer',
    ],
    tip: 'Use the Viewer role for stakeholders who only need read access',
    feedbackQuestion: "How's team management working?",
    feedbackType: 'thumbs',
  },

  // ── 15. Reports ────────────────────────────────────────────
  'reports': {
    featureId: 'reports',
    featureName: 'Reports',
    route: '/reports',
    nextFeature: 'ai-assistant',
    target: '.stats-grid',
    title: 'Business Reports',
    description: 'Generate detailed reports on orders, spending, and suppliers.',
    highlights: [
      'See summary metrics: orders, spending, savings at a glance',
      'Generate custom reports by type and date range',
      'Download reports as PDF or CSV for sharing',
    ],
    tip: 'Schedule monthly reports to track spending trends over time',
    feedbackQuestion: 'Are the reports useful?',
    feedbackType: 'thumbs',
  },

  // ── 16. AI Assistant ───────────────────────────────────────
  'ai-assistant': {
    featureId: 'ai-assistant',
    featureName: 'AI Assistant',
    route: '/ai-assistant',
    nextFeature: 'settings',
    target: '.ch-input-area',
    title: 'AI Trade Assistant',
    description: 'Ask anything about import/export and get instant answers.',
    highlights: [
      'Ask about regulations, duties, HSN codes, or market trends',
      'Get supplier recommendations based on your requirements',
      'Past conversations are saved — continue anytime',
    ],
    tip: 'Try asking "What\'s the duty on [your product]?" for quick answers',
    feedbackQuestion: 'Is the AI Assistant helpful?',
    feedbackType: 'emoji',
  },

  // ── 17. Settings ───────────────────────────────────────────
  'settings': {
    featureId: 'settings',
    featureName: 'Settings',
    route: '/settings',
    // No nextFeature — this is the last one
    target: '.account-grid',
    title: 'Customize Befach',
    description: 'Manage your account, notifications, and preferences.',
    highlights: [
      'Update your organization and account details',
      'Choose which notifications you receive',
      'Customize sidebar navigation and display preferences',
    ],
    tip: 'Enable shipment alerts to never miss an important update',
    feedbackQuestion: 'Finding everything you need in Settings?',
    feedbackType: 'thumbs',
  },
};

/**
 * Get the next feature config in the flow after the given feature.
 */
export function getNextFeature(currentFeatureId: string): WalkthroughConfig | null {
  const config = WALKTHROUGH_CONFIGS[currentFeatureId];
  if (!config?.nextFeature) return null;
  return WALKTHROUGH_CONFIGS[config.nextFeature] ?? null;
}

/**
 * Get the total number of walkthrough features.
 */
export function getTotalFeatures(): number {
  return FEATURE_FLOW_ORDER.length;
}

/**
 * Get the 1-based step number for a feature in the flow.
 */
export function getFeatureStepNumber(featureId: string): number {
  const idx = FEATURE_FLOW_ORDER.indexOf(featureId);
  return idx >= 0 ? idx + 1 : 0;
}
