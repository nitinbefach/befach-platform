'use client';

/**
 * PageTransition Component
 *
 * Provides smooth page transition animations using Framer Motion.
 * Wrap page content to add entrance/exit animations on route changes.
 */

import { ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { usePrefersReducedMotion } from '@/hooks/useMobile';

// Page transition variants
const pageVariants: Record<string, Variants> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  },
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 }
  },
  slideUpFade: {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1]
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  }
};

// Transition configurations
const transitionConfig = {
  fast: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] },
  normal: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  slow: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  spring: { type: 'spring', stiffness: 300, damping: 30 }
};

interface PageTransitionProps {
  children: ReactNode;
  /** Animation variant */
  variant?: 'fade' | 'slideUp' | 'slideRight' | 'scale' | 'slideUpFade';
  /** Transition speed */
  speed?: 'fast' | 'normal' | 'slow' | 'spring';
  /** Custom class name */
  className?: string;
  /** Enable exit animations (requires AnimatePresence wrapper) */
  enableExit?: boolean;
}

/**
 * PageTransition - Animate page content on mount
 *
 * @example Basic usage
 * ```tsx
 * export default function DashboardPage() {
 *   return (
 *     <PageTransition>
 *       <h1>Dashboard</h1>
 *       <Content />
 *     </PageTransition>
 *   );
 * }
 * ```
 *
 * @example With custom variant
 * ```tsx
 * <PageTransition variant="slideUp" speed="fast">
 *   <Content />
 * </PageTransition>
 * ```
 */
export function PageTransition({
  children,
  variant = 'slideUpFade',
  speed = 'normal',
  className = '',
  enableExit = false
}: PageTransitionProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const pathname = usePathname();

  // Skip animations if user prefers reduced motion
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const content = (
    <motion.div
      key={enableExit ? pathname : undefined}
      initial="initial"
      animate="animate"
      exit={enableExit ? "exit" : undefined}
      variants={pageVariants[variant]}
      transition={transitionConfig[speed]}
      className={className}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );

  if (enableExit) {
    return (
      <AnimatePresence mode="wait">
        {content}
      </AnimatePresence>
    );
  }

  return content;
}

/**
 * AnimatedPage - Full page wrapper with transition
 * Use this at the top level of page components
 */
export function AnimatedPage({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <PageTransition variant="slideUpFade" speed="normal" className={className}>
      {children}
    </PageTransition>
  );
}

/**
 * StaggeredContent - Animate children with stagger effect
 */
export function StaggeredContent({
  children,
  className = '',
  staggerDelay = 0.05,
  initialDelay = 0.1
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: initialDelay
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggeredItem - Individual item in StaggeredContent
 */
export function StaggeredItem({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        initial: { opacity: 0, y: 15 },
        animate: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.3,
            ease: [0.25, 0.1, 0.25, 1]
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;
