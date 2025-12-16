// Health Score Utility Functions
// Provides health score calculation, grading, and styling utilities

import { Vendor, HealthScoreBreakdown } from './vendors';
import { SavedSupplier } from './savedSuppliers';

// ============================================================================
// TYPES
// ============================================================================

export type HealthGrade = 'A' | 'B' | 'C' | 'D' | 'F';

export interface HealthScoreConfig {
  weights: {
    quality: number;
    delivery: number;
    response: number;
    compliance: number;
  };
  thresholds: {
    A: number;
    B: number;
    C: number;
    D: number;
  };
}

// Default configuration
export const DEFAULT_HEALTH_CONFIG: HealthScoreConfig = {
  weights: {
    quality: 0.4,      // 40%
    delivery: 0.3,     // 30%
    response: 0.2,     // 20%
    compliance: 0.1    // 10%
  },
  thresholds: {
    A: 90,
    B: 75,
    C: 60,
    D: 40
  }
};

// ============================================================================
// CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate overall health score from breakdown
 */
export function calculateOverallScore(
  breakdown: HealthScoreBreakdown,
  config: HealthScoreConfig = DEFAULT_HEALTH_CONFIG
): number {
  const { weights } = config;

  const score = (
    breakdown.qualityScore * weights.quality +
    breakdown.deliveryScore * weights.delivery +
    breakdown.responseScore * weights.response +
    breakdown.complianceScore * weights.compliance
  );

  return Math.round(Math.max(0, Math.min(100, score)));
}

/**
 * Calculate health score breakdown from vendor data
 */
export function calculateBreakdown(vendor: Vendor | SavedSupplier): HealthScoreBreakdown {
  // Quality Score: Based on rating (max 5)
  const qualityFromRating = (vendor.rating / 5) * 100;
  const qualityScore = Math.round(Math.max(0, Math.min(100, qualityFromRating)));

  // Delivery Score: Based on completed deals ratio
  const totalDeals = (vendor.completedDeals || 0) + (vendor.activeDeals || 0);
  const deliveryRatio = totalDeals > 0 ? (vendor.completedDeals || 0) / totalDeals : 0.5;
  const deliveryScore = Math.round(Math.max(0, Math.min(100, deliveryRatio * 100)));

  // Response Score: Based on communication frequency and recency
  const hasRecentContact = vendor.lastContactedDate
    ? (Date.now() - new Date(vendor.lastContactedDate).getTime()) < 30 * 24 * 60 * 60 * 1000
    : false;
  const commBase = Math.min((vendor.communicationCount || 0) / 50 * 100, 100);
  const responseScore = Math.round(hasRecentContact ? Math.max(commBase, 60) : commBase * 0.7);

  // Compliance Score: Based on verified status and documents
  const vendorExt = vendor as Vendor;
  const hasDocuments = vendorExt.documents?.length > 0;
  const complianceBase = vendor.verified ? 70 : 30;
  const complianceScore = Math.round(Math.min(100, hasDocuments ? complianceBase + 30 : complianceBase));

  return {
    qualityScore,
    deliveryScore,
    responseScore,
    complianceScore
  };
}

/**
 * Calculate full health score for a vendor
 */
export function calculateHealthScore(
  vendor: Vendor | SavedSupplier,
  config: HealthScoreConfig = DEFAULT_HEALTH_CONFIG
): number {
  const breakdown = calculateBreakdown(vendor);
  return calculateOverallScore(breakdown, config);
}

// ============================================================================
// GRADING FUNCTIONS
// ============================================================================

/**
 * Get letter grade from score
 */
export function getGrade(
  score: number,
  config: HealthScoreConfig = DEFAULT_HEALTH_CONFIG
): HealthGrade {
  const { thresholds } = config;

  if (score >= thresholds.A) return 'A';
  if (score >= thresholds.B) return 'B';
  if (score >= thresholds.C) return 'C';
  if (score >= thresholds.D) return 'D';
  return 'F';
}

/**
 * Get grade description
 */
export function getGradeDescription(grade: HealthGrade): string {
  const descriptions: Record<HealthGrade, string> = {
    A: 'Excellent - Top performer',
    B: 'Good - Reliable partner',
    C: 'Average - Room for improvement',
    D: 'Below Average - Needs attention',
    F: 'Poor - Consider alternatives'
  };
  return descriptions[grade];
}

// ============================================================================
// STYLING FUNCTIONS
// ============================================================================

/**
 * Get color for health score
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return '#10B981'; // Green
  if (score >= 60) return '#F59E0B'; // Amber
  if (score >= 40) return '#F97316'; // Orange
  return '#EF4444'; // Red
}

/**
 * Get background color for health score (with transparency)
 */
export function getScoreBgColor(score: number): string {
  if (score >= 80) return 'rgba(16, 185, 129, 0.15)';
  if (score >= 60) return 'rgba(245, 158, 11, 0.15)';
  if (score >= 40) return 'rgba(249, 115, 22, 0.15)';
  return 'rgba(239, 68, 68, 0.15)';
}

/**
 * Get grade-specific styling
 */
export function getGradeStyle(grade: HealthGrade): { color: string; bgColor: string; borderColor: string } {
  const styles: Record<HealthGrade, { color: string; bgColor: string; borderColor: string }> = {
    A: { color: '#059669', bgColor: 'rgba(16, 185, 129, 0.15)', borderColor: '#10B981' },
    B: { color: '#0284C7', bgColor: 'rgba(59, 130, 246, 0.15)', borderColor: '#3B82F6' },
    C: { color: '#D97706', bgColor: 'rgba(245, 158, 11, 0.15)', borderColor: '#F59E0B' },
    D: { color: '#EA580C', bgColor: 'rgba(249, 115, 22, 0.15)', borderColor: '#F97316' },
    F: { color: '#DC2626', bgColor: 'rgba(239, 68, 68, 0.15)', borderColor: '#EF4444' }
  };
  return styles[grade];
}

// ============================================================================
// TREND ANALYSIS
// ============================================================================

/**
 * Calculate score trend from performance history
 */
export function calculateTrend(
  performanceHistory: Array<{ period: string; onTimeDeliveryRate: number; qualityRating: number }>
): 'up' | 'down' | 'stable' {
  if (performanceHistory.length < 2) return 'stable';

  // Get last 3 entries
  const recent = performanceHistory.slice(-3);
  if (recent.length < 2) return 'stable';

  // Calculate average score for first half and second half
  const midpoint = Math.floor(recent.length / 2);
  const firstHalf = recent.slice(0, midpoint);
  const secondHalf = recent.slice(midpoint);

  const avgFirst = firstHalf.reduce((sum, e) => sum + (e.onTimeDeliveryRate + e.qualityRating * 20) / 2, 0) / firstHalf.length;
  const avgSecond = secondHalf.reduce((sum, e) => sum + (e.onTimeDeliveryRate + e.qualityRating * 20) / 2, 0) / secondHalf.length;

  const diff = avgSecond - avgFirst;

  if (diff > 3) return 'up';
  if (diff < -3) return 'down';
  return 'stable';
}

/**
 * Get trend indicator style
 */
export function getTrendStyle(trend: 'up' | 'down' | 'stable'): { icon: string; color: string; label: string } {
  const styles = {
    up: { icon: '↑', color: '#10B981', label: 'Improving' },
    down: { icon: '↓', color: '#EF4444', label: 'Declining' },
    stable: { icon: '→', color: '#6B7280', label: 'Stable' }
  };
  return styles[trend];
}

// ============================================================================
// METRIC LABELS
// ============================================================================

export const METRIC_LABELS: Record<keyof HealthScoreBreakdown, { label: string; description: string; icon: string }> = {
  qualityScore: {
    label: 'Quality',
    description: 'Product/service quality based on ratings',
    icon: '⭐'
  },
  deliveryScore: {
    label: 'Delivery',
    description: 'On-time delivery and completion rate',
    icon: '🚚'
  },
  responseScore: {
    label: 'Response',
    description: 'Communication frequency and responsiveness',
    icon: '💬'
  },
  complianceScore: {
    label: 'Compliance',
    description: 'Documentation and verification status',
    icon: '✅'
  }
};
