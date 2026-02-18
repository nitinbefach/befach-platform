'use client';

/**
 * AnimatedCard Component
 *
 * Interactive card with smooth animations:
 * - Hover lift effect with shadow
 * - Tap/press scale feedback
 * - Optional swipe actions
 * - Stagger animation support
 */

import { ReactNode, useState } from 'react';
import { Check, X } from 'lucide-react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { usePrefersReducedMotion } from '@/hooks/useMobile';

interface AnimatedCardProps {
  children: ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Card href for links */
  href?: string;
  /** Enable hover lift effect */
  hoverLift?: boolean;
  /** Enable tap scale effect */
  tapScale?: boolean;
  /** Enable swipe actions */
  swipeable?: boolean;
  /** Left swipe action */
  onSwipeLeft?: () => void;
  /** Right swipe action */
  onSwipeRight?: () => void;
  /** Left swipe content */
  swipeLeftContent?: ReactNode;
  /** Right swipe content */
  swipeRightContent?: ReactNode;
  /** Custom class name */
  className?: string;
  /** Animation delay for stagger */
  delay?: number;
  /** Card variant */
  variant?: 'default' | 'outlined' | 'elevated' | 'ghost';
}

export function AnimatedCard({
  children,
  onClick,
  href,
  hoverLift = true,
  tapScale = true,
  swipeable = false,
  onSwipeLeft,
  onSwipeRight,
  swipeLeftContent,
  swipeRightContent,
  className = '',
  delay = 0,
  variant = 'default'
}: AnimatedCardProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isSwiping, setIsSwiping] = useState(false);
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-100, 0, 100],
    ['#ef4444', 'transparent', '#10b981']
  );

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (onSwipeLeft) {
        onSwipeLeft();
      }
    },
    onSwipedRight: () => {
      if (onSwipeRight) {
        onSwipeRight();
      }
    },
    onSwiping: () => setIsSwiping(true),
    onSwiped: () => setIsSwiping(false),
    trackMouse: false,
    trackTouch: true,
    delta: 50,
  });

  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  // Hover animation
  const hoverAnimation = hoverLift && !prefersReducedMotion
    ? {
        y: -4,
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.12)',
        transition: { duration: 0.2 }
      }
    : {};

  // Tap animation
  const tapAnimation = tapScale && !prefersReducedMotion
    ? { scale: 0.98 }
    : {};

  const variantStyles = {
    default: 'card-default',
    outlined: 'card-outlined',
    elevated: 'card-elevated',
    ghost: 'card-ghost'
  };

  const CardWrapper = href ? motion.a : motion.div;
  const wrapperProps = href ? { href } : {};

  if (prefersReducedMotion) {
    return (
      <div
        className={`animated-card ${variantStyles[variant]} ${className}`}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }

  // Swipeable card
  if (swipeable) {
    return (
      <div className={`swipeable-card-container ${className}`}>
        {/* Background actions */}
        <motion.div className="swipe-actions" style={{ background }}>
          <div className="swipe-action left">{swipeLeftContent || <Check size={16} />}</div>
          <div className="swipe-action right">{swipeRightContent || <X size={16} />}</div>
        </motion.div>

        {/* Card */}
        <motion.div
          className={`animated-card ${variantStyles[variant]} swipeable`}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          style={{ x }}
          onDragEnd={(_, info: PanInfo) => {
            if (info.offset.x < -100 && onSwipeLeft) {
              onSwipeLeft();
            } else if (info.offset.x > 100 && onSwipeRight) {
              onSwipeRight();
            }
          }}
          onClick={!isSwiping ? onClick : undefined}
          {...swipeHandlers}
        >
          {children}
        </motion.div>

        <style jsx global>{`
          .swipeable-card-container {
            position: relative;
            overflow: hidden;
            border-radius: 12px;
          }
          .swipe-actions {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 20px;
            border-radius: 12px;
          }
          .swipe-action {
            color: white;
            font-size: 1.5rem;
          }
          .animated-card.swipeable {
            position: relative;
            z-index: 1;
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <CardWrapper
        className={`animated-card ${variantStyles[variant]} ${className}`}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover={hoverAnimation}
        whileTap={tapAnimation}
        onClick={onClick}
        {...wrapperProps}
      >
        {children}
      </CardWrapper>

      <style jsx global>{`
        .animated-card {
          display: block;
          background: var(--bg-secondary);
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
          transition: box-shadow 0.2s ease;
        }

        .animated-card.card-default {
          border: 1px solid var(--border-color);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .animated-card.card-outlined {
          border: 1px solid var(--border-color);
          background: transparent;
        }

        .animated-card.card-elevated {
          border: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .animated-card.card-ghost {
          border: 1px solid transparent;
          background: transparent;
        }

        .animated-card.card-ghost:hover {
          background: var(--bg-tertiary);
        }

        .animated-card:focus-visible {
          outline: 2px solid var(--accent-primary);
          outline-offset: 2px;
        }
      `}</style>
    </>
  );
}

/**
 * CardGrid - Grid container for animated cards with stagger
 */
export function CardGrid({
  children,
  columns = 3,
  gap = 20,
  className = ''
}: {
  children: ReactNode;
  columns?: number;
  gap?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={`card-grid ${className}`}
      initial="initial"
      animate="animate"
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1
          }
        }
      }}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(280px, 1fr))`,
        gap: `${gap}px`
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * InteractiveCard - Card with hover state info reveal
 */
export function InteractiveCard({
  children,
  hoverContent,
  className = ''
}: {
  children: ReactNode;
  hoverContent?: ReactNode;
  className?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`interactive-card ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}

      {hoverContent && (
        <motion.div
          className="hover-reveal"
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 10
          }}
          transition={{ duration: 0.2 }}
        >
          {hoverContent}
        </motion.div>
      )}

      <style jsx global>{`
        .interactive-card {
          position: relative;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          overflow: hidden;
        }
        .interactive-card .hover-reveal {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 16px 20px;
          background: linear-gradient(to top, var(--bg-secondary) 80%, transparent);
        }
      `}</style>
    </motion.div>
  );
}

export default AnimatedCard;
