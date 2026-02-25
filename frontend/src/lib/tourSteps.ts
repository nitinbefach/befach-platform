import { DriveStep } from 'driver.js';

// ─── Dashboard ──────────────────────────────────────────────
export const dashboardTourSteps: DriveStep[] = [
  {
    element: '#dashboard-quick-actions',
    popover: {
      title: 'Quick Actions',
      description: 'Jump straight into key tasks — submit requirements, track shipments, find suppliers, or use the AI assistant.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#dashboard-metrics',
    popover: {
      title: 'Your Metrics',
      description: 'See your total orders, spend, active suppliers, and savings at a glance. These update as you use the platform.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#dashboard-charts',
    popover: {
      title: 'Revenue & Trends',
      description: 'Track your revenue growth, cost savings, and supplier performance over time with interactive charts.',
      side: 'top',
      align: 'center',
    },
  },
  {
    element: '#dashboard-orders',
    popover: {
      title: 'Active Orders',
      description: 'Monitor your in-progress orders, check ETAs, and see which suppliers are handling each shipment.',
      side: 'top',
      align: 'start',
    },
  },
  {
    element: '#dashboard-insights',
    popover: {
      title: 'Market Insights',
      description: 'Stay ahead with real-time market data — commodity prices, growth trends, and import opportunities.',
      side: 'top',
      align: 'start',
    },
  },
];

export const mobileDashboardTourSteps: DriveStep[] = [
  {
    element: '#dashboard-metrics',
    popover: {
      title: 'Your Metrics',
      description: 'Scroll to see orders, spend, suppliers, and savings at a glance.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#dashboard-quick-actions',
    popover: {
      title: 'Quick Actions',
      description: 'Tap to submit requirements, track shipments, or chat with the AI assistant.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#dashboard-charts',
    popover: {
      title: 'Analytics',
      description: 'Revenue, savings, and monthly trends — all in one view.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#dashboard-orders',
    popover: {
      title: 'Active Orders',
      description: 'Check your in-progress orders, ETAs, and supplier details.',
      side: 'top',
      align: 'center',
    },
  },
  {
    element: '#dashboard-insights',
    popover: {
      title: 'Market Insights',
      description: 'Real-time commodity prices and import opportunities.',
      side: 'top',
      align: 'center',
    },
  },
];

// ─── Cost Calculator ────────────────────────────────────────
export const costCalculatorTourSteps: DriveStep[] = [
  {
    element: '#calc-header',
    popover: {
      title: 'Landed Cost Calculator',
      description: 'Calculate the total import cost for any product including duties, freight, and taxes.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#calc-form',
    popover: {
      title: 'Enter Product Details',
      description: 'Fill in your product name, HSN code, quantity, and unit price. Duty rates are auto-fetched from the HSN code.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#calc-shipping-mode',
    popover: {
      title: 'Choose Shipping Mode',
      description: 'Select sea, air, or road freight. Transit days auto-adjust based on your choice.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#calc-submit-btn',
    popover: {
      title: 'Calculate',
      description: 'Hit calculate to see your total landed cost with a full breakdown of duties, taxes, and freight charges.',
      side: 'top',
      align: 'center',
    },
  },
];

export const mobileCostCalculatorTourSteps: DriveStep[] = [
  {
    element: '#calc-form',
    popover: {
      title: 'Product Details',
      description: 'Enter product name, HSN code, quantity, and price.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#calc-shipping-mode',
    popover: {
      title: 'Shipping Mode',
      description: 'Pick sea, air, or road. Transit time adjusts automatically.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#calc-submit-btn',
    popover: {
      title: 'Calculate',
      description: 'Tap to see your full landed cost breakdown.',
      side: 'top',
      align: 'center',
    },
  },
];

// ─── Smart Sourcing ─────────────────────────────────────────
export const smartSourcingTourSteps: DriveStep[] = [
  {
    element: '#sourcing-search',
    popover: {
      title: 'Search Suppliers',
      description: 'Search by product name or category. Use filters to narrow by country, rating, certifications, and more.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#sourcing-stats',
    popover: {
      title: 'Supplier Network',
      description: 'See how many verified and premium suppliers are available across different categories.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#sourcing-results',
    popover: {
      title: 'Supplier Cards',
      description: 'View supplier details, ratings, and specializations. Click to see full profiles, send inquiries, or start a chat.',
      side: 'top',
      align: 'center',
    },
  },
  {
    element: '#sourcing-help',
    popover: {
      title: 'Need Help?',
      description: "Can't find what you need? Share your requirement or invite your own suppliers to the platform.",
      side: 'left',
      align: 'center',
    },
  },
];

export const mobileSmartSourcingTourSteps: DriveStep[] = [
  {
    element: '#sourcing-search',
    popover: {
      title: 'Search Suppliers',
      description: 'Search by product or category, then filter results.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#sourcing-stats',
    popover: {
      title: 'Supplier Network',
      description: 'See verified and premium supplier counts.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#sourcing-help',
    popover: {
      title: 'Need Help?',
      description: 'Tap to share your requirement or invite suppliers.',
      side: 'bottom',
      align: 'center',
    },
  },
];

// ─── Our Vendors ────────────────────────────────────────────
export const ourVendorsTourSteps: DriveStep[] = [
  {
    element: '#vendors-pipeline',
    popover: {
      title: 'Supplier Pipeline',
      description: 'See your suppliers organized by relationship stage. Click a stage to filter the list below.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#vendors-toolbar',
    popover: {
      title: 'Manage Vendors',
      description: 'Add new suppliers manually, find new ones via Smart Sourcing, or export your list to CSV.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#vendors-filters',
    popover: {
      title: 'Filter & Sort',
      description: 'Filter by tags, categories, or relationship stage. Sort by rating, orders, or recency.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#vendors-list',
    popover: {
      title: 'Supplier List',
      description: 'Click any supplier to expand their details, send RFQs, message them, or manage tags and notes.',
      side: 'top',
      align: 'center',
    },
  },
];

export const mobileOurVendorsTourSteps: DriveStep[] = [
  {
    element: '#vendors-pipeline',
    popover: {
      title: 'Pipeline Overview',
      description: 'Tap a stage to filter suppliers by relationship status.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#vendors-toolbar',
    popover: {
      title: 'Actions',
      description: 'Add suppliers, search, or export your vendor list.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#vendors-list',
    popover: {
      title: 'Vendor Cards',
      description: 'Tap a supplier to expand details and take actions.',
      side: 'top',
      align: 'center',
    },
  },
];

// ─── Submit Requirement ─────────────────────────────────────
export const submitRequirementTourSteps: DriveStep[] = [
  {
    element: '#req-header',
    popover: {
      title: 'Share Your Requirement',
      description: "Tell us what you need to import and we'll match you with the best suppliers.",
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#req-tabs',
    popover: {
      title: 'Single or Bulk',
      description: 'Submit a single product requirement, or bulk-upload multiple products via CSV.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#req-form',
    popover: {
      title: 'Product Form',
      description: 'Fill in product details, quantity, target price, and any special requirements. We handle supplier matching.',
      side: 'top',
      align: 'center',
    },
  },
];

export const mobileSubmitRequirementTourSteps: DriveStep[] = [
  {
    element: '#req-tabs',
    popover: {
      title: 'Single or Bulk',
      description: 'Choose single product or bulk CSV upload.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#req-form',
    popover: {
      title: 'Product Details',
      description: "Enter what you need and we'll find suppliers for you.",
      side: 'bottom',
      align: 'center',
    },
  },
];

// ─── Market Insights ────────────────────────────────────────
export const marketInsightsTourSteps: DriveStep[] = [
  {
    element: '#market-overview',
    popover: {
      title: 'Market Overview',
      description: 'Key market indicators at a glance — trading volume, active commodities, and overall market sentiment.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#market-filters',
    popover: {
      title: 'Filter Markets',
      description: 'Filter by category, region, or price range to focus on commodities that matter to you.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#market-tabs',
    popover: {
      title: 'Explore Data',
      description: 'Switch between Overview (trending table), Price Charts (visual trends), and Opportunities (actionable alerts).',
      side: 'top',
      align: 'center',
    },
  },
  {
    element: '#market-watchlist',
    popover: {
      title: 'Your Watchlist',
      description: 'Track commodities you care about. Add items from the overview to monitor price changes.',
      side: 'left',
      align: 'start',
    },
  },
];

export const mobileMarketInsightsTourSteps: DriveStep[] = [
  {
    element: '#market-overview',
    popover: {
      title: 'Market Overview',
      description: 'Key market indicators and trading volume.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#market-filters',
    popover: {
      title: 'Filters',
      description: 'Filter by category, region, or price range.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#market-tabs',
    popover: {
      title: 'Explore',
      description: 'Switch between Overview, Charts, and Opportunities.',
      side: 'bottom',
      align: 'center',
    },
  },
];

// ─── Book Shipment ──────────────────────────────────────────
export const bookShipmentTourSteps: DriveStep[] = [
  {
    element: '#booking-header',
    popover: {
      title: 'Book Shipment',
      description: 'Book international ocean/air freight or domestic logistics with competitive carrier quotes.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#booking-tabs',
    popover: {
      title: 'New or Existing',
      description: 'Create a new booking or view your existing bookings and their status.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#booking-segments',
    popover: {
      title: 'Choose Segment',
      description: 'Select International Freight for ocean/air cargo, or Local Logistics for domestic pan-India delivery.',
      side: 'top',
      align: 'center',
    },
  },
];

export const mobileBookShipmentTourSteps: DriveStep[] = [
  {
    element: '#booking-tabs',
    popover: {
      title: 'New or Existing',
      description: 'Create a new booking or check your bookings.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#booking-segments',
    popover: {
      title: 'Choose Type',
      description: 'International freight or local logistics.',
      side: 'bottom',
      align: 'center',
    },
  },
];

// ─── Track Shipment ─────────────────────────────────────────
export const trackShipmentTourSteps: DriveStep[] = [
  {
    element: '#track-shipments',
    popover: {
      title: 'My Shipments',
      description: 'Quick access to your saved shipments. Click any to instantly view its tracking details.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#track-search',
    popover: {
      title: 'Track a Shipment',
      description: 'Enter a BL, container, or booking number to get real-time tracking. Try "0037" for a demo.',
      side: 'bottom',
      align: 'center',
    },
  },
];

export const mobileTrackShipmentTourSteps: DriveStep[] = [
  {
    element: '#track-shipments',
    popover: {
      title: 'My Shipments',
      description: 'Tap a saved shipment for instant tracking.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#track-search',
    popover: {
      title: 'Track',
      description: 'Enter tracking number. Try "0037" for a demo.',
      side: 'bottom',
      align: 'center',
    },
  },
];

// ─── Documents ──────────────────────────────────────────────
export const documentsTourSteps: DriveStep[] = [
  {
    element: '#docs-header',
    popover: {
      title: 'My Documents',
      description: 'Access all your import documents — invoices, BOE filings, shipping docs, and certificates — in one place.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#docs-filters',
    popover: {
      title: 'Search & Filter',
      description: 'Search documents by name, filter by order or document type to find exactly what you need.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#docs-orders',
    popover: {
      title: 'Documents by Order',
      description: 'Documents are grouped by order. Click "View All" to see every document for a specific order.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#docs-guide',
    popover: {
      title: 'Document Guide',
      description: 'Not sure what a document type means? This guide explains each type and its purpose.',
      side: 'top',
      align: 'center',
    },
  },
];

export const mobileDocumentsTourSteps: DriveStep[] = [
  {
    element: '#docs-filters',
    popover: {
      title: 'Search & Filter',
      description: 'Search documents or filter by order and type.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#docs-orders',
    popover: {
      title: 'Your Documents',
      description: 'Documents grouped by order. Tap to expand.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#docs-guide',
    popover: {
      title: 'Document Guide',
      description: 'Learn what each document type means.',
      side: 'top',
      align: 'center',
    },
  },
];

// ─── Compliance Tools ───────────────────────────────────────
export const complianceTourSteps: DriveStep[] = [
  {
    element: '#compliance-welcome',
    popover: {
      title: 'Compliance Dashboard',
      description: 'Your hub for customs clearance, BOE filing, and regulatory compliance. Use quick actions to file BOE instantly.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#compliance-metrics',
    popover: {
      title: 'Compliance Metrics',
      description: 'Track BOE filings, compliance rate, active alerts, and average clearance time at a glance.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#compliance-search',
    popover: {
      title: 'Search Requirements',
      description: 'Look up compliance requirements by HSN code or product description to check duties, licenses, and regulations.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#compliance-boe',
    popover: {
      title: 'Recent BOE Filings',
      description: 'View your recent Bill of Entry filings, their status, and duty amounts paid.',
      side: 'top',
      align: 'center',
    },
  },
];

export const mobileComplianceTourSteps: DriveStep[] = [
  {
    element: '#compliance-metrics',
    popover: {
      title: 'Key Metrics',
      description: 'BOE count, compliance rate, alerts, and clearance time.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#compliance-search',
    popover: {
      title: 'Search',
      description: 'Look up compliance by HSN code or product.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#compliance-boe',
    popover: {
      title: 'BOE Filings',
      description: 'Your recent Bill of Entry filings and status.',
      side: 'top',
      align: 'center',
    },
  },
];

// ─── My Orders ──────────────────────────────────────────────
export const myOrdersTourSteps: DriveStep[] = [
  {
    element: '#orders-stats',
    popover: {
      title: 'Order Statistics',
      description: 'See total orders, in-progress count, completed deliveries, and total value. Click any stat to filter.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#orders-filters',
    popover: {
      title: 'Filter Orders',
      description: 'Filter by status (processing, shipped, delivered) and search by order ID or product name.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#orders-timeline',
    popover: {
      title: 'Order Timeline',
      description: 'Your orders in chronological order. Click any card to see full details, tracking, and documents.',
      side: 'top',
      align: 'center',
    },
  },
];

export const mobileMyOrdersTourSteps: DriveStep[] = [
  {
    element: '#orders-stats',
    popover: {
      title: 'Quick Stats',
      description: 'Tap a stat card to filter orders by that status.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#orders-filters',
    popover: {
      title: 'Filter & Search',
      description: 'Filter by status or search by order ID.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#orders-timeline',
    popover: {
      title: 'Your Orders',
      description: 'Tap any order to view details.',
      side: 'top',
      align: 'center',
    },
  },
];

// ─── Reports ────────────────────────────────────────────────
export const reportsTourSteps: DriveStep[] = [
  {
    element: '#reports-stats',
    popover: {
      title: 'Summary Stats',
      description: 'Key metrics for your import operations — order count, total spend, and active suppliers.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#reports-chart',
    popover: {
      title: 'Import Trends',
      description: 'Visual trends of your import volume over time. Toggle between 6 months, 1 year, and all time.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#reports-list',
    popover: {
      title: 'Saved Reports',
      description: 'View, download, or delete your generated reports. Click "Generate Report" to create new ones.',
      side: 'top',
      align: 'center',
    },
  },
  {
    element: '#reports-quick',
    popover: {
      title: 'Quick Reports',
      description: 'One-click access to common reports: monthly orders, spending, supplier overview, and compliance.',
      side: 'top',
      align: 'center',
    },
  },
];

export const mobileReportsTourSteps: DriveStep[] = [
  {
    element: '#reports-stats',
    popover: {
      title: 'Summary Stats',
      description: 'Key metrics for your import operations.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#reports-list',
    popover: {
      title: 'Your Reports',
      description: 'Download or generate new reports.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#reports-quick',
    popover: {
      title: 'Quick Reports',
      description: 'Tap for instant common reports.',
      side: 'top',
      align: 'center',
    },
  },
];

// ─── Settings ───────────────────────────────────────────────
export const settingsTourSteps: DriveStep[] = [
  {
    element: '#settings-profile',
    popover: {
      title: 'Your Profile',
      description: 'Your account details, organization, plan, and team seat information at a glance.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#settings-grid',
    popover: {
      title: 'Settings',
      description: 'Update your profile, manage notifications, customize sidebar shortcuts, and configure security settings.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#settings-notifications',
    popover: {
      title: 'Notifications',
      description: 'Control which notifications you receive — order updates, shipment tracking, price alerts, and more.',
      side: 'right',
      align: 'start',
    },
  },
];

export const mobileSettingsTourSteps: DriveStep[] = [
  {
    element: '#settings-profile',
    popover: {
      title: 'Your Profile',
      description: 'Account details and plan information.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#settings-grid',
    popover: {
      title: 'Settings',
      description: 'Profile, notifications, sidebar, and security.',
      side: 'bottom',
      align: 'center',
    },
  },
];

// ─── Team Management ────────────────────────────────────────
export const teamManagementTourSteps: DriveStep[] = [
  {
    element: '#team-seats',
    popover: {
      title: 'Team Seats',
      description: 'See how many seats you have used out of your plan limit. Upgrade to add more members.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#team-members',
    popover: {
      title: 'Team Members',
      description: 'View all team members, their roles, and status. Change roles or remove members as needed.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#team-roles',
    popover: {
      title: 'Roles & Permissions',
      description: 'Understand what each role can do — Owner, Admin, Member, and Viewer have different access levels.',
      side: 'top',
      align: 'center',
    },
  },
];

export const mobileTeamManagementTourSteps: DriveStep[] = [
  {
    element: '#team-seats',
    popover: {
      title: 'Team Seats',
      description: 'See how many seats are used in your plan.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#team-members',
    popover: {
      title: 'Members',
      description: 'View and manage your team members.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#team-roles',
    popover: {
      title: 'Roles Guide',
      description: 'Learn what each role can do.',
      side: 'top',
      align: 'center',
    },
  },
];
