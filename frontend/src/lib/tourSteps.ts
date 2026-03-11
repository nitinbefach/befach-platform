import { Step } from 'react-joyride';

// ─── Dashboard ──────────────────────────────────────────────
export const dashboardTourSteps: Step[] = [
  {
    target: '#nav-dashboard',
    title: 'Welcome to Befach!',
    content: 'This is your Dashboard — your home base for managing imports. Use the sidebar to navigate between sections.',
    placement: 'right-start',
    disableBeacon: true,
  },
  {
    target: '#dashboard-quick-actions',
    title: 'Quick Actions',
    content: 'Jump straight into key tasks — submit requirements, track shipments, find suppliers, or use the AI assistant.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#dashboard-metrics',
    title: 'Your Metrics',
    content: 'See your total orders, spend, active suppliers, and savings at a glance. These update as you use the platform.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#dashboard-charts',
    title: 'Revenue & Trends',
    content: 'Track your revenue growth, cost savings, and supplier performance over time with interactive charts.',
    placement: 'top',
    disableBeacon: true,
  },
  {
    target: '#dashboard-orders',
    title: 'Active Orders',
    content: 'Monitor your in-progress orders, check ETAs, and see which suppliers are handling each shipment.',
    placement: 'top-start',
    disableBeacon: true,
  },
  {
    target: '#dashboard-insights',
    title: 'Market Insights',
    content: 'Stay ahead with real-time market data — commodity prices, growth trends, and import opportunities.',
    placement: 'top-start',
    disableBeacon: true,
  },
];

export const mobileDashboardTourSteps: Step[] = [
  {
    target: '#bnav-dashboard',
    title: 'Welcome to Befach!',
    content: 'Navigate between pages using this bar. Tap Home anytime to return here.',
    placement: 'top',
    disableBeacon: true,
  },
  {
    target: '#dashboard-metrics',
    title: 'Your Metrics',
    content: 'Scroll to see orders, spend, suppliers, and savings at a glance.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#dashboard-quick-actions',
    title: 'Quick Actions',
    content: 'Tap to submit requirements, track shipments, or chat with the AI assistant.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#dashboard-charts',
    title: 'Analytics',
    content: 'Revenue, savings, and monthly trends — all in one view.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#dashboard-orders',
    title: 'Active Orders',
    content: 'Check your in-progress orders, ETAs, and supplier details.',
    placement: 'top',
    disableBeacon: true,
  },
  {
    target: '#dashboard-insights',
    title: 'Market Insights',
    content: 'Real-time commodity prices and import opportunities.',
    placement: 'top',
    disableBeacon: true,
  },
];

// ─── Cost Calculator ────────────────────────────────────────
export const costCalculatorTourSteps: Step[] = [
  {
    target: '#nav-tools',
    title: 'Tools Section',
    content: 'The Cost Calculator lives under Tools — along with Market Insights and Compliance.',
    placement: 'right-start',
    disableBeacon: true,
  },
  {
    target: '#calc-header',
    title: 'Landed Cost Calculator',
    content: 'Calculate the total import cost for any product including duties, freight, and taxes.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#calc-form',
    title: 'Enter Product Details',
    content: 'Fill in your product name, HSN code, quantity, and unit price. Duty rates are auto-fetched from the HSN code.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#calc-shipping-mode',
    title: 'Choose Shipping Mode',
    content: 'Select sea, air, or road freight. Transit days auto-adjust based on your choice.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#calc-submit-btn',
    title: 'Calculate',
    content: 'Hit calculate to see your total landed cost with a full breakdown of duties, taxes, and freight charges.',
    placement: 'top',
    disableBeacon: true,
  },
];

export const mobileCostCalculatorTourSteps: Step[] = [
  {
    target: '#calc-form',
    title: 'Product Details',
    content: 'Enter product name, HSN code, quantity, and price.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#calc-shipping-mode',
    title: 'Shipping Mode',
    content: 'Pick sea, air, or road. Transit time adjusts automatically.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#calc-submit-btn',
    title: 'Calculate',
    content: 'Tap to see your full landed cost breakdown.',
    placement: 'top',
    disableBeacon: true,
  },
];

// ─── Smart Sourcing ─────────────────────────────────────────
export const smartSourcingTourSteps: Step[] = [
  {
    target: '#nav-sourcing',
    title: 'Sourcing Section',
    content: 'Find suppliers, manage vendors, and share requirements — all from the Sourcing section in the sidebar.',
    placement: 'right-start',
    disableBeacon: true,
  },
  {
    target: '#sourcing-search',
    title: 'Search Suppliers',
    content: 'Search by product name or category. Use filters to narrow by country, rating, certifications, and more.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#sourcing-stats',
    title: 'Supplier Network',
    content: 'See how many verified and premium suppliers are available across different categories.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#sourcing-results',
    title: 'Supplier Cards',
    content: 'View supplier details, ratings, and specializations. Click to see full profiles, send inquiries, or start a chat.',
    placement: 'top',
    disableBeacon: true,
  },
  {
    target: '#sourcing-help',
    title: 'Need Help?',
    content: "Can't find what you need? Share your requirement or invite your own suppliers to the platform.",
    placement: 'left',
    disableBeacon: true,
  },
];

export const mobileSmartSourcingTourSteps: Step[] = [
  {
    target: '#bnav-smart-sourcing',
    title: 'Smart Sourcing',
    content: 'Tap Search anytime to find and connect with verified suppliers.',
    placement: 'top',
    disableBeacon: true,
  },
  {
    target: '#sourcing-search',
    title: 'Search Suppliers',
    content: 'Search by product or category, then filter results.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#sourcing-stats',
    title: 'Supplier Network',
    content: 'See verified and premium supplier counts.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#sourcing-help',
    title: 'Need Help?',
    content: 'Tap to share your requirement or invite suppliers.',
    placement: 'top',
    disableBeacon: true,
  },
];

// ─── Our Vendors ────────────────────────────────────────────
export const ourVendorsTourSteps: Step[] = [
  {
    target: '#nav-sourcing',
    title: 'Sourcing Section',
    content: 'Our Vendors is part of the Sourcing section — manage your supplier relationships here.',
    placement: 'right-start',
    disableBeacon: true,
  },
  {
    target: '#vendors-pipeline',
    title: 'Supplier Pipeline',
    content: 'See your suppliers organized by relationship stage. Click a stage to filter the list below.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#vendors-toolbar',
    title: 'Manage Vendors',
    content: 'Add new suppliers manually, find new ones via Smart Sourcing, or export your list to CSV.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#vendors-filters',
    title: 'Filter & Sort',
    content: 'Filter by tags, categories, or relationship stage. Sort by rating, orders, or recency.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#vendors-list',
    title: 'Supplier List',
    content: 'Click any supplier to expand their details, send RFQs, message them, or manage tags and notes.',
    placement: 'top',
    disableBeacon: true,
  },
];

export const mobileOurVendorsTourSteps: Step[] = [
  {
    target: '#vendors-pipeline',
    title: 'Pipeline Overview',
    content: 'Tap a stage to filter suppliers by relationship status.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#vendors-toolbar',
    title: 'Actions',
    content: 'Add suppliers, search, or export your vendor list.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#vendors-list',
    title: 'Vendor Cards',
    content: 'Tap a supplier to expand details and take actions.',
    placement: 'top',
    disableBeacon: true,
  },
];

// ─── Submit Requirement ─────────────────────────────────────
export const submitRequirementTourSteps: Step[] = [
  {
    target: '#nav-sourcing',
    title: 'Sourcing Section',
    content: 'Share your import requirements from the Sourcing section. We match you with the best suppliers.',
    placement: 'right-start',
    disableBeacon: true,
  },
  {
    target: '#req-header',
    title: 'Share Your Requirement',
    content: "Tell us what you need to import and we'll match you with the best suppliers.",
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#req-tabs',
    title: 'Single or Bulk',
    content: 'Submit a single product requirement, or bulk-upload multiple products via CSV.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#req-form',
    title: 'Product Form',
    content: 'Fill in product details, quantity, target price, and any special requirements. We handle supplier matching.',
    placement: 'top',
    disableBeacon: true,
  },
];

export const mobileSubmitRequirementTourSteps: Step[] = [
  {
    target: '#bnav-submit-requirement',
    title: 'Share Requirement',
    content: 'Tap the Add button anytime to submit a new import requirement.',
    placement: 'top',
    disableBeacon: true,
  },
  {
    target: '#req-tabs',
    title: 'Single or Bulk',
    content: 'Choose single product or bulk CSV upload.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#req-form',
    title: 'Product Details',
    content: "Enter what you need and we'll find suppliers for you.",
    placement: 'bottom',
    disableBeacon: true,
  },
];

// ─── Market Insights ────────────────────────────────────────
export const marketInsightsTourSteps: Step[] = [
  {
    target: '#nav-tools',
    title: 'Tools Section',
    content: 'Market Insights is under Tools — track commodity prices, trends, and import opportunities.',
    placement: 'right-start',
    disableBeacon: true,
  },
  {
    target: '#market-overview',
    title: 'Market Overview',
    content: 'Key market indicators at a glance — trading volume, active commodities, and overall market sentiment.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#market-filters',
    title: 'Filter Markets',
    content: 'Filter by category, region, or price range to focus on commodities that matter to you.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#market-tabs',
    title: 'Explore Data',
    content: 'Switch between Overview (trending table), Price Charts (visual trends), and Opportunities (actionable alerts).',
    placement: 'top',
    disableBeacon: true,
  },
  {
    target: '#market-watchlist',
    title: 'Your Watchlist',
    content: 'Track commodities you care about. Add items from the overview to monitor price changes.',
    placement: 'left-start',
    disableBeacon: true,
  },
];

export const mobileMarketInsightsTourSteps: Step[] = [
  {
    target: '#market-overview',
    title: 'Market Overview',
    content: 'Key market indicators and trading volume.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#market-filters',
    title: 'Filters',
    content: 'Filter by category, region, or price range.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#market-tabs',
    title: 'Explore',
    content: 'Switch between Overview, Charts, and Opportunities.',
    placement: 'bottom',
    disableBeacon: true,
  },
];

// ─── Book Shipment ──────────────────────────────────────────
export const bookShipmentTourSteps: Step[] = [
  {
    target: '#nav-logistics',
    title: 'Logistics Section',
    content: 'Book and track shipments from the Logistics section in the sidebar.',
    placement: 'right-start',
    disableBeacon: true,
  },
  {
    target: '#booking-header',
    title: 'Book Shipment',
    content: 'Book international ocean/air freight or domestic logistics with competitive carrier quotes.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#booking-tabs',
    title: 'New or Existing',
    content: 'Create a new booking or view your existing bookings and their status.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#booking-segments',
    title: 'Choose Segment',
    content: 'Select International Freight for ocean/air cargo, or Local Logistics for domestic pan-India delivery.',
    placement: 'top',
    disableBeacon: true,
  },
];

export const mobileBookShipmentTourSteps: Step[] = [
  {
    target: '#booking-tabs',
    title: 'New or Existing',
    content: 'Create a new booking or check your bookings.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#booking-segments',
    title: 'Choose Type',
    content: 'International freight or local logistics.',
    placement: 'bottom',
    disableBeacon: true,
  },
];

// ─── Track Shipment ─────────────────────────────────────────
export const trackShipmentTourSteps: Step[] = [
  {
    target: '#nav-logistics',
    title: 'Logistics Section',
    content: 'Track all your shipments from the Logistics section.',
    placement: 'right-start',
    disableBeacon: true,
  },
  {
    target: '#track-shipments',
    title: 'My Shipments',
    content: 'Quick access to your saved shipments. Click any to instantly view its tracking details.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#track-search',
    title: 'Track a Shipment',
    content: 'Enter a BL, container, or booking number to get real-time tracking. Try "0037" for a demo.',
    placement: 'bottom',
    disableBeacon: true,
  },
];

export const mobileTrackShipmentTourSteps: Step[] = [
  {
    target: '#track-shipments',
    title: 'My Shipments',
    content: 'Tap a saved shipment for instant tracking.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#track-search',
    title: 'Track',
    content: 'Enter tracking number. Try "0037" for a demo.',
    placement: 'bottom',
    disableBeacon: true,
  },
];

// ─── Documents ──────────────────────────────────────────────
export const documentsTourSteps: Step[] = [
  {
    target: '#nav-logistics',
    title: 'Logistics Section',
    content: 'Access your import documents from the Logistics section.',
    placement: 'right-start',
    disableBeacon: true,
  },
  {
    target: '#docs-header',
    title: 'My Documents',
    content: 'Access all your import documents — invoices, BOE filings, shipping docs, and certificates — in one place.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#docs-filters',
    title: 'Search & Filter',
    content: 'Search documents by name, filter by order or document type to find exactly what you need.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#docs-orders',
    title: 'Documents by Order',
    content: 'Documents are grouped by order. Click "View All" to see every document for a specific order.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#docs-guide',
    title: 'Document Guide',
    content: 'Not sure what a document type means? This guide explains each type and its purpose.',
    placement: 'top',
    disableBeacon: true,
  },
];

export const mobileDocumentsTourSteps: Step[] = [
  {
    target: '#docs-filters',
    title: 'Search & Filter',
    content: 'Search documents or filter by order and type.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#docs-orders',
    title: 'Your Documents',
    content: 'Documents grouped by order. Tap to expand.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#docs-guide',
    title: 'Document Guide',
    content: 'Learn what each document type means.',
    placement: 'top',
    disableBeacon: true,
  },
];

// ─── Compliance Tools ───────────────────────────────────────
export const complianceTourSteps: Step[] = [
  {
    target: '#nav-tools',
    title: 'Tools Section',
    content: 'Compliance tools are under the Tools section — manage customs clearance and BOE filings.',
    placement: 'right-start',
    disableBeacon: true,
  },
  {
    target: '#compliance-welcome',
    title: 'Compliance Dashboard',
    content: 'Your hub for customs clearance, BOE filing, and regulatory compliance. Use quick actions to file BOE instantly.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#compliance-metrics',
    title: 'Compliance Metrics',
    content: 'Track BOE filings, compliance rate, active alerts, and average clearance time at a glance.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#compliance-search',
    title: 'Search Requirements',
    content: 'Look up compliance requirements by HSN code or product description to check duties, licenses, and regulations.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#compliance-boe',
    title: 'Recent BOE Filings',
    content: 'View your recent Bill of Entry filings, their status, and duty amounts paid.',
    placement: 'top',
    disableBeacon: true,
  },
];

export const mobileComplianceTourSteps: Step[] = [
  {
    target: '#compliance-metrics',
    title: 'Key Metrics',
    content: 'BOE count, compliance rate, alerts, and clearance time.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#compliance-search',
    title: 'Search',
    content: 'Look up compliance by HSN code or product.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#compliance-boe',
    title: 'BOE Filings',
    content: 'Your recent Bill of Entry filings and status.',
    placement: 'top',
    disableBeacon: true,
  },
];

// ─── My Orders ──────────────────────────────────────────────
export const myOrdersTourSteps: Step[] = [
  {
    target: '#nav-my-orders',
    title: 'My Orders',
    content: 'Access all your orders from the sidebar. Track status, view details, and manage deliveries.',
    placement: 'right-start',
    disableBeacon: true,
  },
  {
    target: '#orders-stats',
    title: 'Order Statistics',
    content: 'See total orders, in-progress count, completed deliveries, and total value. Click any stat to filter.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#orders-filters',
    title: 'Filter Orders',
    content: 'Filter by status (processing, shipped, delivered) and search by order ID or product name.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#orders-timeline',
    title: 'Order Timeline',
    content: 'Your orders in chronological order. Click any card to see full details, tracking, and documents.',
    placement: 'top',
    disableBeacon: true,
  },
];

export const mobileMyOrdersTourSteps: Step[] = [
  {
    target: '#orders-stats',
    title: 'Quick Stats',
    content: 'Tap a stat card to filter orders by that status.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#orders-filters',
    title: 'Filter & Search',
    content: 'Filter by status or search by order ID.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#orders-timeline',
    title: 'Your Orders',
    content: 'Tap any order to view details.',
    placement: 'top',
    disableBeacon: true,
  },
];

// ─── Reports ────────────────────────────────────────────────
export const reportsTourSteps: Step[] = [
  {
    target: '#nav-team',
    title: 'Team Section',
    content: 'Reports are under the Team section — view analytics and generate custom reports.',
    placement: 'right-start',
    disableBeacon: true,
  },
  {
    target: '#reports-stats',
    title: 'Summary Stats',
    content: 'Key metrics for your import operations — order count, total spend, and active suppliers.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#reports-chart',
    title: 'Import Trends',
    content: 'Visual trends of your import volume over time. Toggle between 6 months, 1 year, and all time.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#reports-list',
    title: 'Saved Reports',
    content: 'View, download, or delete your generated reports. Click "Generate Report" to create new ones.',
    placement: 'top',
    disableBeacon: true,
  },
  {
    target: '#reports-quick',
    title: 'Quick Reports',
    content: 'One-click access to common reports: monthly orders, spending, supplier overview, and compliance.',
    placement: 'top',
    disableBeacon: true,
  },
];

export const mobileReportsTourSteps: Step[] = [
  {
    target: '#reports-stats',
    title: 'Summary Stats',
    content: 'Key metrics for your import operations.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#reports-list',
    title: 'Your Reports',
    content: 'Download or generate new reports.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#reports-quick',
    title: 'Quick Reports',
    content: 'Tap for instant common reports.',
    placement: 'top',
    disableBeacon: true,
  },
];

// ─── Settings ───────────────────────────────────────────────
export const settingsTourSteps: Step[] = [
  {
    target: '#nav-settings',
    title: 'Settings',
    content: 'Manage your profile, notifications, and account preferences from the Settings section.',
    placement: 'right-start',
    disableBeacon: true,
  },
  {
    target: '#settings-profile',
    title: 'Your Profile',
    content: 'Your account details, organization, plan, and team seat information at a glance.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#settings-grid',
    title: 'Settings',
    content: 'Update your profile, manage notifications, customize sidebar shortcuts, and configure security settings.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#settings-notifications',
    title: 'Notifications',
    content: 'Control which notifications you receive — order updates, shipment tracking, price alerts, and more.',
    placement: 'bottom',
    disableBeacon: true,
  },
];

export const mobileSettingsTourSteps: Step[] = [
  {
    target: '#bnav-settings',
    title: 'Settings',
    content: 'Tap Profile to manage your account and preferences.',
    placement: 'top',
    disableBeacon: true,
  },
  {
    target: '#settings-profile',
    title: 'Your Profile',
    content: 'Account details and plan information.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#settings-grid',
    title: 'Settings',
    content: 'Profile, notifications, sidebar, and security.',
    placement: 'bottom',
    disableBeacon: true,
  },
];

// ─── Team Management ────────────────────────────────────────
export const teamManagementTourSteps: Step[] = [
  {
    target: '#nav-team',
    title: 'Team Section',
    content: 'Manage your team members, roles, and permissions from the Team section.',
    placement: 'right-start',
    disableBeacon: true,
  },
  {
    target: '#team-seats',
    title: 'Team Seats',
    content: 'See how many seats you have used out of your plan limit. Upgrade to add more members.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#team-members',
    title: 'Team Members',
    content: 'View all team members, their roles, and status. Change roles or remove members as needed.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#team-roles',
    title: 'Roles & Permissions',
    content: 'Understand what each role can do — Owner, Admin, Member, and Viewer have different access levels.',
    placement: 'top',
    disableBeacon: true,
  },
];

export const mobileTeamManagementTourSteps: Step[] = [
  {
    target: '#team-seats',
    title: 'Team Seats',
    content: 'See how many seats are used in your plan.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#team-members',
    title: 'Members',
    content: 'View and manage your team members.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#team-roles',
    title: 'Roles Guide',
    content: 'Learn what each role can do.',
    placement: 'top',
    disableBeacon: true,
  },
];
