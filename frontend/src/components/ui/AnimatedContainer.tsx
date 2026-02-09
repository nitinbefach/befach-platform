'use client';

/**
 * AnimatedContainer Component
 *
 * A reusable wrapper component that provides smooth animations
 * using Framer Motion. Wrap any content to add entrance/exit animations.
 */

import { motion, AnimatePresence, HTMLMotionProps, Variants } from 'framer-motion';
import { ReactNode } from 'react';
import {
  fadeIn,
  slideUp,
  slideDown,
  slideInLeft,
  slideInRight,
  slideInBottom,
  scaleIn,
  staggerContainer,
  staggerItem,
  springConfig
} from '@/lib/animations';
import { usePrefersReducedMotion } from '@/hooks/useMobile';

// Available animation variants
const variants: Record<string, Variants> = {
  fadeIn,
  slideUp,
  slideDown,
  slideInLeft,
  slideInRight,
  slideInBottom,
  scaleIn,
  staggerContainer,
  staggerItem
};

// Spring preset types
type SpringPreset = 'gentle' | 'snappy' | 'bouncy' | 'stiff' | 'smooth' | 'slow';

interface AnimatedContainerProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  /** Animation variant to use */
  variant?: keyof typeof variants;
  /** Delay before animation starts (in seconds) */
  delay?: number;
  /** Duration of the animation (in seconds) */
  duration?: number;
  /** Spring preset for physics-based animation */
  spring?: SpringPreset;
  /** Custom class name */
  className?: string;
  /** Whether to animate on mount */
  animateOnMount?: boolean;
  /** Whether to show the component */
  show?: boolean;
  /** Enable exit animation when unmounting */
  exitAnimation?: boolean;
  /** Tag to render (default: div) */
  as?: 'div' | 'section' | 'article' | 'main' | 'aside' | 'header' | 'footer' | 'nav' | 'ul' | 'li' | 'span';
}

/**
 * AnimatedContainer - Wrap content for smooth animations
 *
 * @example Basic fade in
 * ```tsx
 * <AnimatedContainer>
 *   <Card>Content</Card>
 * </AnimatedContainer>
 * ```
 *
 * @example Slide up with delay
 * ```tsx
 * <AnimatedContainer variant="slideUp" delay={0.2}>
 *   <Card>Content</Card>
 * </AnimatedContainer>
 * ```
 *
 * @example Staggered list
 * ```tsx
 * <AnimatedContainer variant="staggerContainer">
 *   {items.map((item, i) => (
 *     <AnimatedContainer key={item.id} variant="staggerItem">
 *       <ListItem>{item.name}</ListItem>
 *     </AnimatedContainer>
 *   ))}
 * </AnimatedContainer>
 * ```
 *
 * @example Conditional with exit animation
 * ```tsx
 * <AnimatedContainer show={isVisible} variant="scaleIn" exitAnimation>
 *   <Modal>Content</Modal>
 * </AnimatedContainer>
 * ```
 */
export function AnimatedContainer({
  children,
  variant = 'fadeIn',
  delay = 0,
  duration,
  spring = 'gentle',
  className,
  animateOnMount = true,
  show = true,
  exitAnimation = false,
  as = 'div',
  ...motionProps
}: AnimatedContainerProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  // If user prefers reduced motion, render without animation
  if (prefersReducedMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  // Get the variant configuration
  const variantConfig = variants[variant];

  // Build transition configuration
  const transition = {
    ...springConfig[spring],
    ...(duration && { duration }),
    delay
  };

  // Create the motion component dynamically based on 'as' prop
  const MotionComponent = motion[as] as typeof motion.div;

  const content = (
    <MotionComponent
      initial={animateOnMount ? 'initial' : false}
      animate="animate"
      exit={exitAnimation ? 'exit' : undefined}
      variants={variantConfig}
      transition={transition}
      className={className}
      {...motionProps}
    >
      {children}
    </MotionComponent>
  );

  // If using exitAnimation with show prop, wrap in AnimatePresence
  if (exitAnimation) {
    return <AnimatePresence mode="wait">{show && content}</AnimatePresence>;
  }

  // If show is false, don't render
  if (!show) return null;

  return content;
}

/**
 * AnimatedList - Specialized container for animating lists with stagger
 *
 * @example
 * ```tsx
 * <AnimatedList>
 *   {items.map((item) => (
 *     <AnimatedListItem key={item.id}>
 *       <Card>{item.name}</Card>
 *     </AnimatedListItem>
 *   ))}
 * </AnimatedList>
 * ```
 */
export function AnimatedList({
  children,
  className,
  staggerDelay = 0.05,
  ...props
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
} & Omit<HTMLMotionProps<'div'>, 'children'>) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1
          }
        },
        exit: {
          transition: {
            staggerChildren: staggerDelay / 2,
            staggerDirection: -1
          }
        }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * AnimatedListItem - Individual item in an AnimatedList
 */
export function AnimatedListItem({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
} & Omit<HTMLMotionProps<'div'>, 'children'>) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={staggerItem}
      transition={springConfig.gentle}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * FadeIn - Simple fade in wrapper
 */
export function FadeIn({
  children,
  delay = 0,
  className
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <AnimatedContainer variant="fadeIn" delay={delay} className={className}>
      {children}
    </AnimatedContainer>
  );
}

/**
 * SlideUp - Content slides up and fades in
 */
export function SlideUp({
  children,
  delay = 0,
  className
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <AnimatedContainer variant="slideUp" delay={delay} className={className}>
      {children}
    </AnimatedContainer>
  );
}

/**
 * ScaleIn - Content scales and fades in
 */
export function ScaleIn({
  children,
  delay = 0,
  className
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <AnimatedContainer variant="scaleIn" delay={delay} className={className}>
      {children}
    </AnimatedContainer>
  );
}

export default AnimatedContainer;
