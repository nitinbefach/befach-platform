/**
 * Shared Dashboard Components
 *
 * Reusable, variant-based components used by both MobileDashboard and WebDashboard.
 * Each component accepts a `variant` prop to switch between mobile and web layouts.
 */

export { CollapsibleSection } from './CollapsibleSection';
export type { CollapsibleSectionProps } from './CollapsibleSection';

export { OrderCard } from './OrderCard';
export type { OrderCardProps } from './OrderCard';

export { CalculationCard } from './CalculationCard';
export type { CalculationCardProps } from './CalculationCard';

export { InsightCard } from './InsightCard';
export type { InsightCardProps } from './InsightCard';

export { RequirementCard } from './RequirementCard';
export type { RequirementCardProps } from './RequirementCard';

export { ActivityItem } from './ActivityItem';
export type { ActivityItemProps } from './ActivityItem';

// Skeleton components
export * from './skeletons';
