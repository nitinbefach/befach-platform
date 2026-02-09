/**
 * Animation Utilities for Befach Platform
 *
 * Provides consistent, reusable animation variants for Framer Motion
 * across all components in the application.
 */

import { Variants, Transition } from 'framer-motion';

// ============================================
// ANIMATION VARIANTS
// ============================================

/**
 * Fade in animation - simple opacity transition
 */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

/**
 * Slide up with fade - content appears from below
 */
export const slideUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

/**
 * Slide down with fade - content appears from above
 */
export const slideDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 }
};

/**
 * Slide in from left - for drawers and side panels
 */
export const slideInLeft: Variants = {
  initial: { x: '-100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 }
};

/**
 * Slide in from right - for notifications, side drawers
 */
export const slideInRight: Variants = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '100%', opacity: 0 }
};

/**
 * Slide in from bottom - for bottom sheets and modals
 */
export const slideInBottom: Variants = {
  initial: { y: '100%', opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: '100%', opacity: 0 }
};

/**
 * Scale in animation - for cards and popups
 */
export const scaleIn: Variants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 }
};

/**
 * Scale up animation - for emphasis effects
 */
export const scaleUp: Variants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 }
};

/**
 * Backdrop fade - for modal overlays
 */
export const backdropFade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

// ============================================
// SPRING CONFIGURATIONS
// ============================================

export const springConfig = {
  /** Gentle spring - for subtle, smooth animations */
  gentle: { type: 'spring', stiffness: 120, damping: 20 } as Transition,

  /** Snappy spring - for quick, responsive interactions */
  snappy: { type: 'spring', stiffness: 300, damping: 30 } as Transition,

  /** Bouncy spring - for playful, attention-grabbing animations */
  bouncy: { type: 'spring', stiffness: 400, damping: 25 } as Transition,

  /** Stiff spring - for very fast, precise animations */
  stiff: { type: 'spring', stiffness: 500, damping: 35 } as Transition,

  /** Smooth tween - for linear, predictable animations */
  smooth: { type: 'tween', duration: 0.25, ease: 'easeOut' } as Transition,

  /** Slow tween - for page transitions */
  slow: { type: 'tween', duration: 0.4, ease: [0.4, 0, 0.2, 1] } as Transition
};

// ============================================
// STAGGER ANIMATIONS
// ============================================

/**
 * Container for staggered children - use with staggerItem
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  },
  exit: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1
    }
  }
};

/**
 * Fast stagger container - for lists with many items
 */
export const staggerContainerFast: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.05
    }
  }
};

/**
 * Individual item in a staggered list
 */
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

/**
 * Scale stagger item - for cards in a grid
 */
export const staggerScaleItem: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
};

// ============================================
// TOUCH & GESTURE ANIMATIONS
// ============================================

/**
 * Scale down on tap/press
 */
export const tapScale = {
  scale: 0.97,
  transition: { duration: 0.1 }
};

/**
 * Stronger scale for buttons
 */
export const buttonTap = {
  scale: 0.95,
  transition: { duration: 0.1 }
};

/**
 * Hover lift effect - for cards
 */
export const hoverLift = {
  y: -4,
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
  transition: { duration: 0.2 }
};

/**
 * Hover glow effect - with brand color
 */
export const hoverGlow = {
  boxShadow: '0 0 20px rgba(249, 115, 22, 0.3)',
  transition: { duration: 0.2 }
};

// ============================================
// PAGE TRANSITIONS
// ============================================

/**
 * Page fade transition
 */
export const pageTransition: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

/**
 * Page slide transition - content slides up
 */
export const pageSlide: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] }
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Create a delayed version of any variant
 */
export function withDelay(variants: Variants, delay: number): Variants {
  return {
    ...variants,
    animate: {
      ...(typeof variants.animate === 'object' ? variants.animate : {}),
      transition: {
        ...((typeof variants.animate === 'object' && variants.animate.transition) || {}),
        delay
      }
    }
  };
}

/**
 * Create custom stagger timing
 */
export function createStagger(staggerTime: number, delayTime: number = 0): Variants {
  return {
    initial: {},
    animate: {
      transition: {
        staggerChildren: staggerTime,
        delayChildren: delayTime
      }
    }
  };
}

// ============================================
// LOADING ANIMATIONS
// ============================================

/**
 * Skeleton shimmer effect (use with CSS keyframes)
 */
export const shimmer: Variants = {
  initial: { backgroundPosition: '-200% 0' },
  animate: {
    backgroundPosition: '200% 0',
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: 'linear'
    }
  }
};

/**
 * Pulse animation for loading states
 */
export const pulse: Variants = {
  initial: { opacity: 0.6 },
  animate: {
    opacity: [0.6, 1, 0.6],
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: 'easeInOut'
    }
  }
};

/**
 * Spinner rotation
 */
export const spin: Variants = {
  animate: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      duration: 1,
      ease: 'linear'
    }
  }
};
