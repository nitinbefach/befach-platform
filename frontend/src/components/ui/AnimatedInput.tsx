'use client';

/**
 * AnimatedInput Component
 *
 * Form inputs with smooth animations:
 * - Floating label animation
 * - Focus ring animation
 * - Error shake animation
 * - Loading state
 * - Icon support
 */

import { ReactNode, useState, forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/useMobile';

interface AnimatedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input label */
  label?: string;
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Left icon */
  leftIcon?: ReactNode;
  /** Right icon */
  rightIcon?: ReactNode;
  /** Input size */
  size?: 'sm' | 'md' | 'lg';
  /** Full width */
  fullWidth?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Use floating label */
  floatingLabel?: boolean;
  /** Custom class name */
  className?: string;
}

export const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      size = 'md',
      fullWidth = false,
      loading = false,
      floatingLabel = true,
      className = '',
      onFocus,
      onBlur,
      value,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(Boolean(value) || Boolean(props.defaultValue));

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(Boolean(e.target.value));
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(Boolean(e.target.value));
      props.onChange?.(e);
    };

    const isLabelFloated = floatingLabel && (isFocused || hasValue);

    const sizeClasses = {
      sm: 'input-sm',
      md: 'input-md',
      lg: 'input-lg'
    };

    // Shake animation on error
    const shakeVariants = {
      shake: {
        x: prefersReducedMotion ? 0 : [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.4 }
      }
    };

    return (
      <motion.div
        className={`animated-input-wrapper ${fullWidth ? 'full-width' : ''} ${className}`}
        animate={error ? 'shake' : 'idle'}
        variants={shakeVariants}
      >
        <div
          className={`input-container ${sizeClasses[size]} ${isFocused ? 'focused' : ''} ${error ? 'has-error' : ''} ${props.disabled ? 'disabled' : ''}`}
        >
          {/* Left icon */}
          {leftIcon && <span className="input-icon left">{leftIcon}</span>}

          {/* Input field */}
          <div className="input-field-wrapper">
            {floatingLabel && label && (
              <motion.label
                className={`floating-label ${isLabelFloated ? 'floated' : ''}`}
                initial={false}
                animate={{
                  y: isLabelFloated ? -24 : 0,
                  scale: isLabelFloated ? 0.85 : 1,
                  color: isFocused
                    ? error
                      ? '#ef4444'
                      : 'var(--accent-primary)'
                    : 'var(--text-tertiary)'
                }}
                transition={{ duration: 0.2 }}
              >
                {label}
              </motion.label>
            )}

            <input
              ref={ref}
              className="animated-input"
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              value={value}
              {...props}
            />
          </div>

          {/* Right icon or loading */}
          {loading ? (
            <span className="input-icon right">
              <LoadingSpinner />
            </span>
          ) : rightIcon ? (
            <span className="input-icon right">{rightIcon}</span>
          ) : null}

          {/* Focus indicator */}
          <motion.div
            className="focus-indicator"
            initial={{ scaleX: 0 }}
            animate={{
              scaleX: isFocused ? 1 : 0,
              backgroundColor: error ? '#ef4444' : 'var(--accent-primary)'
            }}
            transition={{ duration: 0.2 }}
          />
        </div>

        {/* Non-floating label */}
        {!floatingLabel && label && (
          <label className="static-label">{label}</label>
        )}

        {/* Error/Helper text */}
        <AnimatePresence>
          {(error || helperText) && (
            <motion.div
              className={`input-message ${error ? 'error' : 'helper'}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {error || helperText}
            </motion.div>
          )}
        </AnimatePresence>

        <style jsx global>{`
          .animated-input-wrapper {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .animated-input-wrapper.full-width {
            width: 100%;
          }

          .input-container {
            position: relative;
            display: flex;
            align-items: center;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            transition: border-color 0.2s, box-shadow 0.2s;
          }

          .input-container.focused {
            border-color: var(--accent-primary);
            box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
          }

          .input-container.has-error {
            border-color: #ef4444;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
          }

          .input-container.disabled {
            opacity: 0.6;
            cursor: not-allowed;
            background: var(--bg-tertiary);
          }

          .input-field-wrapper {
            position: relative;
            flex: 1;
            display: flex;
            align-items: center;
          }

          .animated-input {
            width: 100%;
            background: transparent;
            border: none;
            outline: none;
            font-family: inherit;
            color: var(--text-primary);
          }

          .animated-input::placeholder {
            color: var(--text-tertiary);
          }

          .animated-input:disabled {
            cursor: not-allowed;
          }

          /* Sizes */
          .input-container.input-sm {
            padding: 8px 12px;
          }

          .input-container.input-sm .animated-input {
            font-size: 0.875rem;
          }

          .input-container.input-md {
            padding: 12px 16px;
          }

          .input-container.input-md .animated-input {
            font-size: 0.95rem;
          }

          .input-container.input-lg {
            padding: 14px 18px;
          }

          .input-container.input-lg .animated-input {
            font-size: 1.05rem;
          }

          /* Floating label */
          .floating-label {
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            pointer-events: none;
            font-size: 0.95rem;
            transform-origin: left center;
            background: var(--bg-secondary);
            padding: 0 4px;
          }

          .floating-label.floated {
            top: 0;
          }

          /* Static label */
          .static-label {
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--text-secondary);
            margin-bottom: 6px;
          }

          /* Icons */
          .input-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-tertiary);
          }

          .input-icon.left {
            margin-right: 10px;
          }

          .input-icon.right {
            margin-left: 10px;
          }

          .input-icon svg {
            width: 18px;
            height: 18px;
          }

          /* Focus indicator line */
          .focus-indicator {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            border-radius: 0 0 10px 10px;
            transform-origin: center;
          }

          /* Message */
          .input-message {
            font-size: 0.8rem;
            margin-top: 4px;
            padding-left: 4px;
          }

          .input-message.error {
            color: #ef4444;
          }

          .input-message.helper {
            color: var(--text-tertiary);
          }

          /* Loading spinner */
          .input-spinner {
            width: 18px;
            height: 18px;
            border: 2px solid var(--border-color);
            border-top-color: var(--accent-primary);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </motion.div>
    );
  }
);

AnimatedInput.displayName = 'AnimatedInput';

/**
 * AnimatedTextarea - Multi-line input with animations
 */
interface AnimatedTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  autoResize?: boolean;
  className?: string;
}

export const AnimatedTextarea = forwardRef<HTMLTextAreaElement, AnimatedTextareaProps>(
  (
    {
      label,
      error,
      helperText,
      size = 'md',
      fullWidth = false,
      autoResize = false,
      className = '',
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      if (autoResize) {
        const target = e.currentTarget;
        target.style.height = 'auto';
        target.style.height = `${target.scrollHeight}px`;
      }
    };

    const sizeClasses = {
      sm: 'textarea-sm',
      md: 'textarea-md',
      lg: 'textarea-lg'
    };

    const shakeVariants = {
      shake: {
        x: prefersReducedMotion ? 0 : [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.4 }
      }
    };

    return (
      <motion.div
        className={`animated-textarea-wrapper ${fullWidth ? 'full-width' : ''} ${className}`}
        animate={error ? 'shake' : 'idle'}
        variants={shakeVariants}
      >
        {label && <label className="textarea-label">{label}</label>}

        <div
          className={`textarea-container ${sizeClasses[size]} ${isFocused ? 'focused' : ''} ${error ? 'has-error' : ''} ${props.disabled ? 'disabled' : ''}`}
        >
          <textarea
            ref={ref}
            className="animated-textarea"
            onFocus={handleFocus}
            onBlur={handleBlur}
            onInput={handleInput}
            {...props}
          />

          <motion.div
            className="focus-indicator"
            initial={{ scaleX: 0 }}
            animate={{
              scaleX: isFocused ? 1 : 0,
              backgroundColor: error ? '#ef4444' : 'var(--accent-primary)'
            }}
            transition={{ duration: 0.2 }}
          />
        </div>

        <AnimatePresence>
          {(error || helperText) && (
            <motion.div
              className={`textarea-message ${error ? 'error' : 'helper'}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {error || helperText}
            </motion.div>
          )}
        </AnimatePresence>

        <style jsx global>{`
          .animated-textarea-wrapper {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .animated-textarea-wrapper.full-width {
            width: 100%;
          }

          .textarea-label {
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--text-secondary);
            margin-bottom: 6px;
          }

          .textarea-container {
            position: relative;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            transition: border-color 0.2s, box-shadow 0.2s;
          }

          .textarea-container.focused {
            border-color: var(--accent-primary);
            box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
          }

          .textarea-container.has-error {
            border-color: #ef4444;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
          }

          .textarea-container.disabled {
            opacity: 0.6;
            cursor: not-allowed;
            background: var(--bg-tertiary);
          }

          .animated-textarea {
            width: 100%;
            background: transparent;
            border: none;
            outline: none;
            font-family: inherit;
            color: var(--text-primary);
            resize: vertical;
            min-height: 100px;
          }

          .animated-textarea::placeholder {
            color: var(--text-tertiary);
          }

          .animated-textarea:disabled {
            cursor: not-allowed;
            resize: none;
          }

          /* Sizes */
          .textarea-container.textarea-sm {
            padding: 10px 12px;
          }

          .textarea-container.textarea-sm .animated-textarea {
            font-size: 0.875rem;
            min-height: 80px;
          }

          .textarea-container.textarea-md {
            padding: 12px 16px;
          }

          .textarea-container.textarea-md .animated-textarea {
            font-size: 0.95rem;
          }

          .textarea-container.textarea-lg {
            padding: 14px 18px;
          }

          .textarea-container.textarea-lg .animated-textarea {
            font-size: 1.05rem;
            min-height: 120px;
          }

          .textarea-container .focus-indicator {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            border-radius: 0 0 10px 10px;
            transform-origin: center;
          }

          .textarea-message {
            font-size: 0.8rem;
            margin-top: 4px;
            padding-left: 4px;
          }

          .textarea-message.error {
            color: #ef4444;
          }

          .textarea-message.helper {
            color: var(--text-tertiary);
          }
        `}</style>
      </motion.div>
    );
  }
);

AnimatedTextarea.displayName = 'AnimatedTextarea';

/**
 * SearchInput - Animated search input
 */
export function SearchInput({
  placeholder = 'Search...',
  value,
  onChange,
  onClear,
  loading = false,
  size = 'md',
  className = ''
}: {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`search-input-wrapper ${className}`}>
      <motion.div
        className={`search-input-container search-${size} ${isFocused ? 'focused' : ''}`}
        animate={{
          boxShadow: isFocused
            ? '0 0 0 3px rgba(249, 115, 22, 0.1)'
            : '0 0 0 0px transparent'
        }}
        transition={{ duration: 0.2 }}
      >
        <span className="search-icon">
          <SearchIcon />
        </span>

        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        <AnimatePresence>
          {loading ? (
            <motion.span
              className="search-action"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <LoadingSpinner />
            </motion.span>
          ) : value ? (
            <motion.button
              className="search-action clear-btn"
              onClick={onClear}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileTap={{ scale: 0.9 }}
            >
              <ClearIcon />
            </motion.button>
          ) : null}
        </AnimatePresence>
      </motion.div>

      <style jsx global>{`
        .search-input-wrapper {
          width: 100%;
        }

        .search-input-container {
          display: flex;
          align-items: center;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          transition: border-color 0.2s;
        }

        .search-input-container.focused {
          border-color: var(--accent-primary);
        }

        .search-input-container.search-sm {
          padding: 8px 12px;
        }

        .search-input-container.search-md {
          padding: 10px 14px;
        }

        .search-input-container.search-lg {
          padding: 12px 16px;
        }

        .search-icon {
          color: var(--text-tertiary);
          margin-right: 10px;
          display: flex;
        }

        .search-icon svg {
          width: 18px;
          height: 18px;
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-family: inherit;
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        .search-input::placeholder {
          color: var(--text-tertiary);
        }

        .search-action {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 10px;
        }

        .clear-btn {
          width: 24px;
          height: 24px;
          background: var(--bg-tertiary);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          color: var(--text-secondary);
          transition: background-color 0.2s;
        }

        .clear-btn:hover {
          background: var(--border-color);
        }

        .clear-btn svg {
          width: 14px;
          height: 14px;
        }
      `}</style>
    </div>
  );
}

// Helper components
function LoadingSpinner() {
  return <span className="input-spinner" />;
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default AnimatedInput;
