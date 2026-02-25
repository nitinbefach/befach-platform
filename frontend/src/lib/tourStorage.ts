import { safeStorage } from './safeStorage';

const PREFIX = 'befach-tour-';

export function hasCompletedTour(tourId: string): boolean {
  return safeStorage.getItem(`${PREFIX}${tourId}`) === 'done';
}

export function completeTour(tourId: string): void {
  safeStorage.setItem(`${PREFIX}${tourId}`, 'done');
}

export function resetTour(tourId: string): void {
  safeStorage.removeItem(`${PREFIX}${tourId}`);
}
