'use client';

import React from 'react';
import { TooltipRenderProps, Styles } from 'react-joyride';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

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
  initial: { opacity: 0, scale: 0.92, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.92, y: 8 },
  transition: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 25,
    mass: 0.8,
  },
};

export function BefachTooltip({
  continuous,
  index,
  step,
  size,
  backProps,
  closeProps,
  primaryProps,
  skipProps,
  tooltipProps,
  isLastStep,
}: TooltipRenderProps) {
  return (
    <AnimatePresence>
      <motion.div
        {...tooltipProps}
        initial={tooltipAnimation.initial}
        animate={tooltipAnimation.animate}
        exit={tooltipAnimation.exit}
        transition={tooltipAnimation.transition}
      >
        {/* Google Fonts link for DM Sans */}
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <div className="befach-tooltip">
          {/* Close button */}
          <button className="tooltip-close" {...closeProps}>
            <X size={16} />
          </button>

          {/* Title */}
          {step.title && <div className="tooltip-title">{step.title}</div>}

          {/* Content */}
          {step.content && (
            <div className="tooltip-content">{step.content}</div>
          )}

          {/* Footer */}
          <div className="tooltip-footer">
            <span className="tooltip-progress">
              {index + 1} of {size}
            </span>
            <div className="tooltip-buttons">
              {index > 0 && (
                <button className="tooltip-btn tooltip-btn-prev" {...backProps}>
                  Back
                </button>
              )}
              {continuous && (
                <button
                  className="tooltip-btn tooltip-btn-next"
                  {...primaryProps}
                >
                  {isLastStep ? 'Finish' : 'Next'}
                </button>
              )}
            </div>
          </div>

          {index === 0 && (
            <button className="tooltip-skip" {...skipProps}>
              Skip tour
            </button>
          )}
        </div>

        <style jsx>{`
          .befach-tooltip {
            position: relative;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 14px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
            padding: 20px;
            max-width: 340px;
            font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          .tooltip-close {
            position: absolute;
            top: 12px;
            right: 12px;
            background: none;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: all 0.2s ease;
          }
          .tooltip-close:hover {
            color: var(--text-primary);
            transform: scale(1.1);
          }
          .tooltip-title {
            font-size: 1rem;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 6px;
            padding-right: 24px;
            letter-spacing: -0.01em;
          }
          .tooltip-content {
            font-size: 0.875rem;
            color: var(--text-secondary);
            line-height: 1.6;
            margin-bottom: 16px;
            font-weight: 400;
          }
          .tooltip-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .tooltip-progress {
            font-size: 0.75rem;
            color: var(--text-muted);
            font-weight: 500;
          }
          .tooltip-buttons {
            display: flex;
            gap: 8px;
          }
          .tooltip-btn {
            border: none;
            border-radius: 8px;
            padding: 8px 18px;
            font-weight: 600;
            font-size: 0.85rem;
            font-family: 'DM Sans', sans-serif;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .tooltip-btn:hover {
            opacity: 0.9;
            transform: translateY(-1px);
          }
          .tooltip-btn:active {
            transform: translateY(0px) scale(0.98);
          }
          .tooltip-btn-next {
            background: var(--accent-gradient);
            color: white;
          }
          .tooltip-btn-prev {
            background: var(--bg-tertiary);
            color: var(--text-primary);
          }
          .tooltip-skip {
            display: block;
            margin-top: 10px;
            background: none;
            border: none;
            color: var(--text-muted);
            font-size: 0.75rem;
            font-family: 'DM Sans', sans-serif;
            cursor: pointer;
            padding: 0;
            transition: color 0.2s ease;
          }
          .tooltip-skip:hover {
            color: var(--text-secondary);
          }
          @media (max-width: 480px) {
            .befach-tooltip {
              max-width: 280px;
              padding: 16px;
            }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
}
