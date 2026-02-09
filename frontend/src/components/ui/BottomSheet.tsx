'use client';

/**
 * BottomSheet Component
 *
 * Mobile-optimized modal that slides from bottom:
 * - Drag to dismiss gesture
 * - Snap points (25%, 50%, 90%)
 * - Backdrop fade
 * - Safe area support for notched devices
 */

import { ReactNode, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls, PanInfo } from 'framer-motion';
import { usePrefersReducedMotion, useMobile } from '@/hooks/useMobile';

interface BottomSheetProps {
  /** Whether the sheet is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Sheet content */
  children: ReactNode;
  /** Sheet title */
  title?: string;
  /** Show drag handle */
  showHandle?: boolean;
  /** Snap points as percentage of screen height */
  snapPoints?: number[];
  /** Default snap point index */
  defaultSnapPoint?: number;
  /** Allow drag to dismiss */
  dismissible?: boolean;
  /** Show close button */
  showCloseButton?: boolean;
  /** Custom class name */
  className?: string;
  /** Max height as percentage */
  maxHeight?: number;
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  showHandle = true,
  snapPoints = [0.5, 0.9],
  defaultSnapPoint = 0,
  dismissible = true,
  showCloseButton = true,
  className = '',
  maxHeight = 90
}: BottomSheetProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { isMobile } = useMobile();
  const dragControls = useDragControls();
  const sheetRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle drag end
  const handleDragEnd = (_: any, info: PanInfo) => {
    const shouldClose = info.velocity.y > 500 || info.offset.y > 200;
    if (shouldClose && dismissible) {
      onClose();
    }
  };

  // Calculate height based on snap point
  const sheetHeight = `${snapPoints[defaultSnapPoint] * 100}%`;

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const sheetVariants = {
    hidden: { y: '100%' },
    visible: {
      y: 0,
      transition: prefersReducedMotion
        ? { duration: 0.1 }
        : { type: 'spring', damping: 30, stiffness: 300 }
    },
    exit: {
      y: '100%',
      transition: { duration: 0.2 }
    }
  };

  // For desktop, use a centered modal instead
  if (!isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="bottom-sheet-backdrop desktop"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={onClose}
            />
            <motion.div
              className={`bottom-sheet-desktop ${className}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {title && (
                <div className="sheet-header">
                  <h3 className="sheet-title">{title}</h3>
                  {showCloseButton && (
                    <button className="sheet-close" onClick={onClose}>
                      <CloseIcon />
                    </button>
                  )}
                </div>
              )}
              <div className="sheet-content">{children}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="bottom-sheet-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            className={`bottom-sheet ${className}`}
            style={{ maxHeight: `${maxHeight}vh`, height: sheetHeight }}
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            drag={dismissible ? 'y' : false}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
          >
            {/* Drag handle */}
            {showHandle && (
              <div
                className="sheet-handle-area"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <div className="sheet-handle" />
              </div>
            )}

            {/* Header */}
            {title && (
              <div className="sheet-header">
                <h3 className="sheet-title">{title}</h3>
                {showCloseButton && (
                  <button className="sheet-close" onClick={onClose}>
                    <CloseIcon />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="sheet-content">{children}</div>
          </motion.div>
        </>
      )}

      <style jsx global>{`
        .bottom-sheet-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 1100;
        }

        .bottom-sheet-backdrop.desktop {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bottom-sheet {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--bg-secondary);
          border-radius: 20px 20px 0 0;
          z-index: 1200;
          display: flex;
          flex-direction: column;
          padding-bottom: env(safe-area-inset-bottom, 0px);
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
          touch-action: none;
        }

        .bottom-sheet-desktop {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: var(--bg-secondary);
          border-radius: 16px;
          z-index: 1200;
          width: 90%;
          max-width: 500px;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        }

        .sheet-handle-area {
          padding: 12px 0 8px;
          cursor: grab;
          touch-action: none;
          display: flex;
          justify-content: center;
        }

        .sheet-handle-area:active {
          cursor: grabbing;
        }

        .sheet-handle {
          width: 36px;
          height: 4px;
          background: var(--border-color);
          border-radius: 2px;
        }

        .sheet-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-color);
        }

        .sheet-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .sheet-close {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-tertiary);
          border: none;
          border-radius: 8px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .sheet-close:hover {
          background: var(--border-color);
          color: var(--text-primary);
        }

        .sheet-close svg {
          width: 18px;
          height: 18px;
        }

        .sheet-content {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          overscroll-behavior: contain;
        }
      `}</style>
    </AnimatePresence>
  );
}

/**
 * BottomSheetActions - Action buttons at bottom of sheet
 */
export function BottomSheetActions({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`sheet-actions ${className}`}>
      {children}
      <style jsx>{`
        .sheet-actions {
          display: flex;
          gap: 12px;
          padding: 16px 20px;
          border-top: 1px solid var(--border-color);
          background: var(--bg-secondary);
        }
        .sheet-actions :global(button) {
          flex: 1;
        }
      `}</style>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default BottomSheet;
