/**
 * Mobile Detection Hook
 *
 * Provides responsive breakpoint detection and device capabilities
 * for building mobile-optimized UIs.
 */

import { useState, useEffect, useCallback } from 'react';

// Breakpoint definitions (matching Tailwind defaults)
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;

interface MobileState {
  /** True if viewport width < 768px (mobile phone) */
  isMobile: boolean;
  /** True if viewport width >= 768px and < 1024px (tablet) */
  isTablet: boolean;
  /** True if viewport width >= 1024px */
  isDesktop: boolean;
  /** True if device supports touch */
  isTouchDevice: boolean;
  /** Current viewport width */
  width: number;
  /** Current viewport height */
  height: number;
  /** True if viewport is in portrait orientation */
  isPortrait: boolean;
  /** True if viewport is in landscape orientation */
  isLandscape: boolean;
}

/**
 * Hook for detecting mobile/tablet/desktop viewports and touch capability
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isMobile, isTablet, isTouchDevice } = useMobile();
 *
 *   return (
 *     <div>
 *       {isMobile && <MobileNav />}
 *       {!isMobile && <DesktopNav />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useMobile(): MobileState {
  const [state, setState] = useState<MobileState>(() => {
    // Server-side rendering fallback
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isTouchDevice: false,
        width: 1024,
        height: 768,
        isPortrait: false,
        isLandscape: true
      };
    }

    return getDeviceState();
  });

  const handleResize = useCallback(() => {
    setState(getDeviceState());
  }, []);

  useEffect(() => {
    // Initial check
    handleResize();

    // Listen for resize events
    window.addEventListener('resize', handleResize);

    // Listen for orientation changes
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [handleResize]);

  return state;
}

/**
 * Get current device state based on window dimensions
 */
function getDeviceState(): MobileState {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const isTouchDevice =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore - for older browsers
    navigator.msMaxTouchPoints > 0;

  return {
    isMobile: width < BREAKPOINTS.md,
    isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
    isDesktop: width >= BREAKPOINTS.lg,
    isTouchDevice,
    width,
    height,
    isPortrait: height > width,
    isLandscape: width > height
  };
}

/**
 * Hook for checking if viewport matches a specific breakpoint
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isSmall = useBreakpoint('sm');
 *   const isMedium = useBreakpoint('md');
 *   const isLarge = useBreakpoint('lg');
 *
 *   if (isSmall) return <SmallLayout />;
 *   if (isMedium) return <MediumLayout />;
 *   return <LargeLayout />;
 * }
 * ```
 */
export function useBreakpoint(breakpoint: keyof typeof BREAKPOINTS): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkBreakpoint = () => {
      setMatches(window.innerWidth >= BREAKPOINTS[breakpoint]);
    };

    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);

    return () => window.removeEventListener('resize', checkBreakpoint);
  }, [breakpoint]);

  return matches;
}

/**
 * Hook for media query matching
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 *   const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
 *
 *   return <div className={prefersDark ? 'dark' : 'light'}>...</div>;
 * }
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }

    // Legacy browsers
    mediaQuery.addListener(handler);
    return () => mediaQuery.removeListener(handler);
  }, [query]);

  return matches;
}

/**
 * Hook to detect if user prefers reduced motion
 * Useful for disabling animations for accessibility
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/**
 * Hook to detect if device is in standalone mode (PWA)
 */
export function useIsStandalone(): boolean {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkStandalone = () => {
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        // @ts-ignore - iOS Safari
        window.navigator.standalone === true;
      setIsStandalone(standalone);
    };

    checkStandalone();
  }, []);

  return isStandalone;
}

/**
 * Hook to get safe area insets (for notched devices)
 */
export function useSafeAreaInsets(): {
  top: number;
  right: number;
  bottom: number;
  left: number;
} {
  const [insets, setInsets] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const computeInsets = () => {
      const style = getComputedStyle(document.documentElement);
      setInsets({
        top: parseInt(style.getPropertyValue('--sat') || '0', 10),
        right: parseInt(style.getPropertyValue('--sar') || '0', 10),
        bottom: parseInt(style.getPropertyValue('--sab') || '0', 10),
        left: parseInt(style.getPropertyValue('--sal') || '0', 10)
      });
    };

    // Set CSS variables for safe area insets
    document.documentElement.style.setProperty(
      '--sat',
      'env(safe-area-inset-top, 0px)'
    );
    document.documentElement.style.setProperty(
      '--sar',
      'env(safe-area-inset-right, 0px)'
    );
    document.documentElement.style.setProperty(
      '--sab',
      'env(safe-area-inset-bottom, 0px)'
    );
    document.documentElement.style.setProperty(
      '--sal',
      'env(safe-area-inset-left, 0px)'
    );

    computeInsets();
    window.addEventListener('resize', computeInsets);

    return () => window.removeEventListener('resize', computeInsets);
  }, []);

  return insets;
}

export default useMobile;
