/**
 * Walkthrough completion tracking.
 * Uses safeStorage (SSR-safe localStorage wrapper) to persist
 * which features the user has explored and their visit counts.
 */

import { safeStorage } from '@/lib/safeStorage';
import { FEATURE_FLOW_ORDER } from '@/lib/walkthroughSteps';

const STORAGE_KEY = 'befach_walkthrough_status';

export interface FeatureStatus {
  completed: boolean;
  completedAt?: string;
  visitCount: number;
}

export type WalkthroughStatus = Record<string, FeatureStatus>;

function getStatus(): WalkthroughStatus {
  const data = safeStorage.getItem(STORAGE_KEY);
  if (!data) return {};
  try {
    return JSON.parse(data);
  } catch {
    return {};
  }
}

function saveStatus(status: WalkthroughStatus): void {
  safeStorage.setItem(STORAGE_KEY, JSON.stringify(status));
}

export function isWalkthroughCompleted(featureId: string): boolean {
  return getStatus()[featureId]?.completed ?? false;
}

export function completeWalkthrough(featureId: string): void {
  const status = getStatus();
  status[featureId] = {
    ...status[featureId],
    completed: true,
    completedAt: new Date().toISOString(),
    visitCount: status[featureId]?.visitCount ?? 1,
  };
  saveStatus(status);
}

export function getFeatureVisitCount(featureId: string): number {
  return getStatus()[featureId]?.visitCount ?? 0;
}

export function incrementFeatureVisit(featureId: string): number {
  const status = getStatus();
  const current = status[featureId]?.visitCount ?? 0;
  status[featureId] = {
    completed: status[featureId]?.completed ?? false,
    completedAt: status[featureId]?.completedAt,
    visitCount: current + 1,
  };
  saveStatus(status);
  return current + 1;
}

/**
 * Auto-trigger only on the very first visit to a feature
 * that hasn't been completed yet.
 */
export function shouldAutoTriggerWalkthrough(featureId: string): boolean {
  const status = getStatus()[featureId];
  if (!status) return true; // never visited
  if (status.completed) return false;
  if (status.visitCount <= 1) return true; // first visit
  return false;
}

export function resetWalkthrough(featureId: string): void {
  const status = getStatus();
  if (status[featureId]) {
    status[featureId].completed = false;
    delete status[featureId].completedAt;
    saveStatus(status);
  }
}

export function resetAllWalkthroughs(): void {
  safeStorage.removeItem(STORAGE_KEY);
}

/**
 * Count how many features the user has completed walkthroughs for.
 */
export function getCompletedCount(): number {
  const status = getStatus();
  return FEATURE_FLOW_ORDER.filter(id => status[id]?.completed).length;
}

/**
 * Progress as a percentage (0-100).
 */
export function getProgressPercent(): number {
  const total = FEATURE_FLOW_ORDER.length;
  if (total === 0) return 0;
  return Math.round((getCompletedCount() / total) * 100);
}

export function getAllFeatureStatus(): WalkthroughStatus {
  return getStatus();
}
