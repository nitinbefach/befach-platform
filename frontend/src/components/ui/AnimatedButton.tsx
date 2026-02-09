'use client';

/**
 * AnimatedButton Component
 *
 * Interactive button with smooth animations:
 * - Ripple effect on click/tap
 * - Scale animation on press
 * - Loading state with spinner
 * - Multiple variants and sizes
 */

import { ReactNode, useState, useRef, MouseEvent, ButtonHTMLAttributes } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/useMobile';

interface RippleStyle {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface AnimatedButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  children: ReactNode;
  /** Click handler */
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  /** Button size */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Full width */
  fullWidth?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Icon before text */
  leftIcon?: ReactNode;
  /** Icon after text */
  rightIcon?: ReactNode;
  /** Enable ripple effect */
  ripple?: boolean;
  /** Custom class name */
  className?: string;
}

export function AnimatedButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  ripple = true,
  className = '',
  type = 'button',
  ...props
}: AnimatedButtonProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<RippleStyle[]>([]);
  const [isPressed, setIsPressed] = useState(false);

  // Create ripple effect
  const createRipple = (e: MouseEvent<HTMLButtonElement>) => {
    if (!ripple || prefersReducedMotion || disabled || loading) return;

    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple: RippleStyle = {
      left: x,
      top: y,
      width: size,
      height: size
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.slice(1));
    }, 600);
  };

  // Handle click with optional async support
  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    createRipple(e);
    if (onClick && !disabled && !loading) {
      await onClick(e);
    }
  };

  // Animation variants
  const buttonVariants = {
    idle: { scale: 1 },
    pressed: { scale: prefersReducedMotion ? 1 : 0.97 },
    hover: { scale: prefersReducedMotion ? 1 : 1.02 }
  };

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
    success: 'btn-success'
  };

  const sizeClasses = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
    xl: 'btn-xl'
  };

  return (
    <>
      <motion.button
        ref={buttonRef}
        type={type}
        className={`animated-btn ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'btn-full' : ''} ${loading ? 'btn-loading' : ''} ${className}`}
        onClick={handleClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        disabled={disabled || loading}
        variants={buttonVariants}
        initial="idle"
        whileHover={!disabled && !loading ? "hover" : undefined}
        animate={isPressed ? "pressed" : "idle"}
        transition={{ duration: 0.15 }}
        {...props}
      >
        {/* Ripple effects */}
        <span className="ripple-container">
          <AnimatePresence>
            {ripples.map((ripple, index) => (
              <motion.span
                key={index}
                className="ripple"
                style={{
                  left: ripple.left,
                  top: ripple.top,
                  width: ripple.width,
                  height: ripple.height
                }}
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 2.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            ))}
          </AnimatePresence>
        </span>

        {/* Button content */}
        <span className="btn-content">
          {loading ? (
            <LoadingSpinner size={size} />
          ) : (
            <>
              {leftIcon && <span className="btn-icon left">{leftIcon}</span>}
              <span className="btn-text">{children}</span>
              {rightIcon && <span className="btn-icon right">{rightIcon}</span>}
            </>
          )}
        </span>
      </motion.button>

      <style jsx global>{`
        .animated-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          overflow: hidden;
          transition: background-color 0.2s, box-shadow 0.2s;
          outline: none;
          font-family: inherit;
        }

        .animated-btn:focus-visible {
          outline: 2px solid var(--accent-primary);
          outline-offset: 2px;
        }

        .animated-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Variants */
        .animated-btn.btn-primary {
          background: linear-gradient(135deg, var(--accent-primary) 0%, #e85d04 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(249, 115, 22, 0.3);
        }

        .animated-btn.btn-primary:hover:not(:disabled) {
          box-shadow: 0 4px 16px rgba(249, 115, 22, 0.4);
        }

        .animated-btn.btn-secondary {
          background: var(--bg-tertiary);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
        }

        .animated-btn.btn-secondary:hover:not(:disabled) {
          background: var(--border-color);
        }

        .animated-btn.btn-outline {
          background: transparent;
          color: var(--accent-primary);
          border: 2px solid var(--accent-primary);
        }

        .animated-btn.btn-outline:hover:not(:disabled) {
          background: var(--accent-primary);
          color: white;
        }

        .animated-btn.btn-ghost {
          background: transparent;
          color: var(--text-primary);
        }

        .animated-btn.btn-ghost:hover:not(:disabled) {
          background: var(--bg-tertiary);
        }

        .animated-btn.btn-danger {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
        }

        .animated-btn.btn-danger:hover:not(:disabled) {
          box-shadow: 0 4px 16px rgba(239, 68, 68, 0.4);
        }

        .animated-btn.btn-success {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
        }

        .animated-btn.btn-success:hover:not(:disabled) {
          box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
        }

        /* Sizes */
        .animated-btn.btn-sm {
          padding: 8px 16px;
          font-size: 0.85rem;
          min-height: 36px;
        }

        .animated-btn.btn-md {
          padding: 12px 24px;
          font-size: 0.95rem;
          min-height: 44px;
        }

        .animated-btn.btn-lg {
          padding: 14px 32px;
          font-size: 1.05rem;
          min-height: 52px;
        }

        .animated-btn.btn-xl {
          padding: 16px 40px;
          font-size: 1.15rem;
          min-height: 60px;
        }

        .animated-btn.btn-full {
          width: 100%;
        }

        /* Content */
        .btn-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-icon.left {
          margin-right: 4px;
        }

        .btn-icon.right {
          margin-left: 4px;
        }

        .btn-icon svg {
          width: 1.2em;
          height: 1.2em;
        }

        /* Ripple effect */
        .ripple-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border-radius: inherit;
          pointer-events: none;
        }

        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          pointer-events: none;
        }

        .btn-secondary .ripple,
        .btn-ghost .ripple {
          background: rgba(0, 0, 0, 0.1);
        }

        /* Loading state */
        .btn-loading .btn-content {
          opacity: 0.9;
        }

        .btn-spinner {
          display: inline-block;
          border: 2px solid transparent;
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .btn-sm .btn-spinner {
          width: 14px;
          height: 14px;
        }

        .btn-md .btn-spinner {
          width: 18px;
          height: 18px;
        }

        .btn-lg .btn-spinner {
          width: 20px;
          height: 20px;
        }

        .btn-xl .btn-spinner {
          width: 22px;
          height: 22px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}

/**
 * Loading spinner for button
 */
function LoadingSpinner({ size }: { size: string }) {
  return <span className={`btn-spinner ${size}`} />;
}

/**
 * IconButton - Circular button for icons
 */
export function IconButton({
  children,
  onClick,
  variant = 'ghost',
  size = 'md',
  label,
  className = '',
  disabled = false,
  ...props
}: {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  label: string;
  className?: string;
  disabled?: boolean;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const sizeStyles = {
    sm: { width: '32px', height: '32px', fontSize: '0.9rem' },
    md: { width: '40px', height: '40px', fontSize: '1rem' },
    lg: { width: '48px', height: '48px', fontSize: '1.2rem' }
  };

  return (
    <>
      <motion.button
        className={`icon-button icon-${variant} ${className}`}
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        title={label}
        style={sizeStyles[size]}
        whileHover={!prefersReducedMotion && !disabled ? { scale: 1.1 } : undefined}
        whileTap={!prefersReducedMotion && !disabled ? { scale: 0.9 } : undefined}
        {...props}
      >
        {children}
      </motion.button>

      <style jsx global>{`
        .icon-button {
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          transition: background-color 0.2s, color 0.2s;
        }

        .icon-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .icon-button.icon-primary {
          background: var(--accent-primary);
          color: white;
        }

        .icon-button.icon-primary:hover:not(:disabled) {
          background: #e85d04;
        }

        .icon-button.icon-secondary {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .icon-button.icon-secondary:hover:not(:disabled) {
          background: var(--border-color);
        }

        .icon-button.icon-ghost {
          background: transparent;
          color: var(--text-secondary);
        }

        .icon-button.icon-ghost:hover:not(:disabled) {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .icon-button.icon-outline {
          background: transparent;
          color: var(--text-primary);
          border: 1px solid var(--border-color);
        }

        .icon-button.icon-outline:hover:not(:disabled) {
          background: var(--bg-tertiary);
          border-color: var(--text-secondary);
        }

        .icon-button:focus-visible {
          outline: 2px solid var(--accent-primary);
          outline-offset: 2px;
        }

        .icon-button svg {
          width: 60%;
          height: 60%;
        }
      `}</style>
    </>
  );
}

/**
 * FloatingActionButton - Prominent action button
 */
export function FloatingActionButton({
  children,
  onClick,
  label,
  position = 'bottom-right',
  className = ''
}: {
  children: ReactNode;
  onClick?: () => void;
  label: string;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  className?: string;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const positionStyles = {
    'bottom-right': { bottom: '80px', right: '20px' },
    'bottom-left': { bottom: '80px', left: '20px' },
    'bottom-center': { bottom: '80px', left: '50%', transform: 'translateX(-50%)' }
  };

  return (
    <>
      <motion.button
        className={`fab ${className}`}
        onClick={onClick}
        aria-label={label}
        style={positionStyles[position]}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        whileHover={!prefersReducedMotion ? { scale: 1.1 } : undefined}
        whileTap={!prefersReducedMotion ? { scale: 0.9 } : undefined}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {children}
      </motion.button>

      <style jsx global>{`
        .fab {
          position: fixed;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent-primary) 0%, #e85d04 100%);
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(249, 115, 22, 0.4);
          z-index: 1000;
        }

        .fab:hover {
          box-shadow: 0 6px 24px rgba(249, 115, 22, 0.5);
        }

        .fab svg {
          width: 24px;
          height: 24px;
        }

        .fab:focus-visible {
          outline: 2px solid white;
          outline-offset: 2px;
        }

        /* Adjust for bottom nav */
        @media (max-width: 768px) {
          .fab {
            bottom: 90px !important;
          }
        }
      `}</style>
    </>
  );
}

export default AnimatedButton;
