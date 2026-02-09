'use client';

/**
 * Loading Indicator Components
 *
 * Various loading indicators for different use cases:
 * - Spinner: General loading
 * - Dots: Button loading states
 * - Progress: Page/section loading
 * - Overlay: Full-screen loading
 */

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SpinnerProps {
  /** Size of the spinner */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Color of the spinner (defaults to accent color) */
  color?: string;
  /** Additional class name */
  className?: string;
}

/**
 * Spinner - Classic rotating loader
 */
export function Spinner({
  size = 'md',
  color,
  className = ''
}: SpinnerProps) {
  const sizes = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48
  };

  const sizeValue = sizes[size];

  return (
    <motion.div
      className={`spinner ${className}`}
      style={{
        width: sizeValue,
        height: sizeValue,
        borderColor: color || 'var(--accent-primary)',
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <style jsx>{`
        .spinner {
          border: 3px solid transparent;
          border-top-color: currentColor;
          border-radius: 50%;
        }
      `}</style>
    </motion.div>
  );
}

/**
 * LoadingDots - Three bouncing dots
 */
export function LoadingDots({
  size = 'md',
  color,
  className = ''
}: SpinnerProps) {
  const dotSizes = {
    sm: 4,
    md: 6,
    lg: 8,
    xl: 10
  };

  const dotSize = dotSizes[size];

  return (
    <div className={`loading-dots ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="dot"
          style={{
            width: dotSize,
            height: dotSize,
            backgroundColor: color || 'var(--accent-primary)'
          }}
          animate={{ y: [-2, 2, -2] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut'
          }}
        />
      ))}

      <style jsx>{`
        .loading-dots {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .loading-dots .dot {
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}

/**
 * ProgressBar - Linear progress indicator
 */
export function ProgressBar({
  progress,
  className = '',
  showLabel = false,
  color,
  height = 4
}: {
  progress: number;
  className?: string;
  showLabel?: boolean;
  color?: string;
  height?: number;
}) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={`progress-container ${className}`}>
      {showLabel && (
        <span className="progress-label">{Math.round(clampedProgress)}%</span>
      )}
      <div className="progress-track" style={{ height }}>
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{ backgroundColor: color || 'var(--accent-primary)' }}
        />
      </div>

      <style jsx>{`
        .progress-container {
          width: 100%;
        }
        .progress-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-secondary);
          margin-bottom: 4px;
          text-align: right;
        }
        .progress-track {
          width: 100%;
          background: var(--bg-tertiary);
          border-radius: 999px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          border-radius: 999px;
        }
      `}</style>
    </div>
  );
}

/**
 * IndeterminateProgress - Animated progress bar without known completion
 */
export function IndeterminateProgress({
  className = '',
  color,
  height = 3
}: {
  className?: string;
  color?: string;
  height?: number;
}) {
  return (
    <div className={`indeterminate-progress ${className}`} style={{ height }}>
      <motion.div
        className="progress-bar"
        style={{ backgroundColor: color || 'var(--accent-primary)' }}
        animate={{
          x: ['-100%', '100%'],
          scaleX: [0.3, 0.8, 0.3]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      <style jsx>{`
        .indeterminate-progress {
          width: 100%;
          background: var(--bg-tertiary);
          border-radius: 999px;
          overflow: hidden;
          position: relative;
        }
        .indeterminate-progress .progress-bar {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          border-radius: 999px;
        }
      `}</style>
    </div>
  );
}

/**
 * LoadingOverlay - Full-screen loading state
 */
export function LoadingOverlay({
  isLoading,
  message,
  children,
  blur = true
}: {
  isLoading: boolean;
  message?: string;
  children?: ReactNode;
  blur?: boolean;
}) {
  if (!isLoading) return <>{children}</>;

  return (
    <div className="loading-overlay-container">
      {children && (
        <div className={`overlay-content ${blur ? 'blur' : ''}`}>
          {children}
        </div>
      )}
      <motion.div
        className="loading-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="loading-content">
          <Spinner size="lg" />
          {message && <p className="loading-message">{message}</p>}
        </div>
      </motion.div>

      <style jsx>{`
        .loading-overlay-container {
          position: relative;
        }
        .overlay-content.blur {
          filter: blur(2px);
          pointer-events: none;
          user-select: none;
        }
        .loading-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(var(--bg-primary-rgb, 255, 255, 255), 0.8);
          z-index: 50;
        }
        .loading-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .loading-message {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}

/**
 * FullPageLoader - Full viewport loading state
 */
export function FullPageLoader({
  message = 'Loading...'
}: {
  message?: string;
}) {
  return (
    <motion.div
      className="full-page-loader"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="loader-content">
        <div className="logo-pulse">
          <motion.span
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            B
          </motion.span>
        </div>
        <Spinner size="lg" />
        <p className="loader-message">{message}</p>
      </div>

      <style jsx>{`
        .full-page-loader {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary);
          z-index: 9999;
        }
        .loader-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        .logo-pulse {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2rem;
          font-weight: 700;
          box-shadow: 0 8px 24px rgba(249, 115, 22, 0.3);
        }
        .loader-message {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }
      `}</style>
    </motion.div>
  );
}

/**
 * ButtonLoader - Loading state for buttons
 */
export function ButtonLoader({
  isLoading,
  children,
  loadingText
}: {
  isLoading: boolean;
  children: ReactNode;
  loadingText?: string;
}) {
  return (
    <>
      {isLoading ? (
        <span className="button-loader">
          <LoadingDots size="sm" color="currentColor" />
          {loadingText && <span className="loading-text">{loadingText}</span>}
        </span>
      ) : (
        children
      )}

      <style jsx>{`
        .button-loader {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .loading-text {
          margin-left: 4px;
        }
      `}</style>
    </>
  );
}

/**
 * PulseLoader - Pulsing circle loader
 */
export function PulseLoader({
  size = 'md',
  color,
  className = ''
}: SpinnerProps) {
  const sizes = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24
  };

  const sizeValue = sizes[size];

  return (
    <div className={`pulse-loader ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="pulse-ring"
          style={{
            width: sizeValue,
            height: sizeValue,
            backgroundColor: color || 'var(--accent-primary)'
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.3, 1]
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}

      <style jsx>{`
        .pulse-loader {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .pulse-loader .pulse-ring {
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}

export default Spinner;
