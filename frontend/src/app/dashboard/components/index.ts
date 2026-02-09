// Dashboard Components
export { DashboardProvider, useDashboard } from './DashboardContext';
export { default as WebDashboard } from './WebDashboard';
export { default as MobileDashboard } from './MobileDashboard';

// Re-export types and data for external use
export type {
  SubmittedRequirement,
  MetricData,
  DetailedMetric,
  QuickAction,
  ActiveOrder,
  Activity,
  TopSupplier,
  MarketInsight
} from './DashboardContext';

export {
  COLORS,
  orderData,
  savingsData,
  supplierPerformance,
  shipmentStatus,
  costComparison,
  topSuppliers,
  timeAgo
} from './DashboardContext';
