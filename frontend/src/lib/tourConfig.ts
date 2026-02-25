import { driver, Config } from 'driver.js';

const defaultConfig: Config = {
  showProgress: true,
  animate: true,
  smoothScroll: true,
  allowClose: true,
  overlayOpacity: 0.6,
  stagePadding: 12,
  stageRadius: 12,
  popoverOffset: 14,
};

export function createTour(overrides?: Partial<Config>) {
  return driver({ ...defaultConfig, ...overrides });
}
