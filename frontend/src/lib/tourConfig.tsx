'use client';

import React from 'react';
import { TooltipRenderProps, Styles } from 'react-joyride';
import { motion, AnimatePresence } from 'framer-motion';

export const joyrideStyles: Styles = {
  options: {
    zIndex: 10000,
    arrowColor: 'var(--bg-secondary)',
    backgroundColor: 'var(--bg-secondary)',
    overlayColor: 'rgba(0, 0, 0, 0.5)',
    primaryColor: '#f97316',
  },
  spotlight: {
    borderRadius: 12,
  },
};

const tooltipAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: {
    duration: 0.2,
    ease: 'easeOut' as const,
  },
};

export function BefachTooltip({
  continuous,
  index,
  step,
  size,
  primaryProps,
  skipProps,
  backProps,
  tooltipProps,
  isLastStep,
}: TooltipRenderProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={index}
        {...tooltipProps}
        initial={tooltipAnimation.initial}
        animate={tooltipAnimation.animate}
        exit={tooltipAnimation.exit}
        transition={tooltipAnimation.transition}
      >
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <div className="befach-tooltip">
          {/* Title */}
          {step.title && <div className="tooltip-title">{step.title}</div>}

          {/* Content */}
          {step.content && (
            <div className="tooltip-content">{step.content}</div>
          )}

          {/* Buttons row */}
          <div className="tooltip-buttons">
            <button className="tooltip-btn tooltip-btn-quit" {...skipProps}>
              Quit
            </button>
            {index > 0 && (
              <button className="tooltip-btn tooltip-btn-back" {...backProps}>
                Back
              </button>
            )}
            {continuous && (
              <button className="tooltip-btn tooltip-btn-next" {...primaryProps}>
                {isLastStep ? 'Finish' : 'Next'}
              </button>
            )}
          </div>
        </div>

        <style jsx>{`
          .befach-tooltip {
            position: relative;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
            padding: 14px;
            max-width: 300px;
            font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          .tooltip-title {
            font-size: 0.9375rem;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 4px;
            letter-spacing: -0.01em;
          }
          .tooltip-content {
            font-size: 0.8125rem;
            color: var(--text-secondary);
            line-height: 1.5;
            margin-bottom: 12px;
            font-weight: 400;
          }
          .tooltip-buttons {
            display: flex;
            gap: 8px;
          }
          .tooltip-btn {
            border: none;
            border-radius: 6px;
            padding: 7px 0;
            font-weight: 600;
            font-size: 0.8125rem;
            font-family: 'DM Sans', sans-serif;
            cursor: pointer;
            transition: all 0.2s ease;
            flex: 1;
            text-align: center;
          }
          .tooltip-btn:hover {
            opacity: 0.9;
            transform: translateY(-1px);
          }
          .tooltip-btn:active {
            transform: translateY(0) scale(0.98);
          }
          .tooltip-btn-quit {
            background: var(--bg-tertiary);
            color: var(--text-secondary);
          }
          .tooltip-btn-back {
            background: var(--bg-tertiary);
            color: var(--text-primary);
          }
          .tooltip-btn-next {
            background: var(--accent-gradient);
            color: white;
          }
          @media (max-width: 480px) {
            .befach-tooltip {
              max-width: 260px;
              padding: 12px;
            }
            .tooltip-title {
              font-size: 0.875rem;
            }
            .tooltip-content {
              font-size: 0.8rem;
              margin-bottom: 10px;
            }
            .tooltip-btn {
              padding: 6px 0;
              font-size: 0.8rem;
            }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
}
