'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  shouldShowNudge,
  getNudgeMessage,
  onNudgeShown,
  onNudgeDismissed,
  NUDGE_DELAY_MS,
  NUDGE_AUTO_DISMISS_MS,
} from '@/lib/aiNudge';

interface AINudgeProps {
  isPanelOpen: boolean;
  isMobile: boolean;
  onOpenChat: () => void;
}

export default function AINudge({ isPanelOpen, isMobile, onOpenChat }: AINudgeProps) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  const dismiss = useCallback(() => {
    setVisible(false);
    onNudgeDismissed();
  }, []);

  const handleClick = useCallback(() => {
    setVisible(false);
    onOpenChat();
  }, [onOpenChat]);

  useEffect(() => {
    setVisible(false);

    if (!shouldShowNudge(pathname, isPanelOpen)) return;

    const showTimer = setTimeout(() => {
      // Re-check right before showing (panel may have opened during delay)
      if (!shouldShowNudge(pathname, isPanelOpen)) return;
      setMessage(getNudgeMessage(pathname));
      setVisible(true);
      onNudgeShown(pathname);
    }, NUDGE_DELAY_MS);

    return () => clearTimeout(showTimer);
  }, [pathname, isPanelOpen]);

  // Auto-dismiss
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(dismiss, NUDGE_AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [visible, dismiss]);

  // Hide when panel opens
  useEffect(() => {
    if (isPanelOpen && visible) {
      setVisible(false);
    }
  }, [isPanelOpen, visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="nudge-tooltip"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') handleClick(); }}
        >
          <div className="nudge-accent" />
          <div className="nudge-body">
            <span className="nudge-icon">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L9 9l-7 1 5 5-1 7 6-3 6 3-1-7 5-5-7-1z" />
              </svg>
            </span>
            <span className="nudge-text">{message}</span>
          </div>
          <button
            className="nudge-close"
            onClick={(e) => { e.stopPropagation(); dismiss(); }}
            aria-label="Dismiss"
          >
            &times;
          </button>

          <style jsx>{`
            .nudge-tooltip {
              position: fixed;
              bottom: ${isMobile ? '150px' : '84px'};
              right: ${isMobile ? '16px' : '90px'};
              z-index: 1040;
              width: ${isMobile ? '200px' : '220px'};
              background: var(--bg-primary, #fff);
              border: 1px solid var(--border-color, #e2e8f0);
              border-left: 4px solid #f97316;
              border-radius: 10px;
              padding: 10px 12px;
              display: flex;
              align-items: flex-start;
              gap: 8px;
              cursor: pointer;
              box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
              user-select: none;
            }
            .nudge-accent {
              display: none;
            }
            .nudge-body {
              flex: 1;
              display: flex;
              align-items: flex-start;
              gap: 6px;
              min-width: 0;
            }
            .nudge-icon {
              flex-shrink: 0;
              color: #f97316;
              margin-top: 1px;
            }
            .nudge-text {
              font-size: 0.78rem;
              font-weight: 500;
              color: var(--text-primary, #1e293b);
              line-height: 1.4;
            }
            .nudge-close {
              flex-shrink: 0;
              width: 20px;
              height: 20px;
              border: none;
              background: transparent;
              color: var(--text-secondary, #94a3b8);
              font-size: 1rem;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 4px;
              padding: 0;
              transition: background 0.15s;
            }
            .nudge-close:hover {
              background: var(--bg-secondary, #f1f5f9);
              color: var(--text-primary, #1e293b);
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
