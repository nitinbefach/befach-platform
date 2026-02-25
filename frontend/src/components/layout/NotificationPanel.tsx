'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMobile } from '@/hooks/useMobile';
import { Bell } from 'lucide-react';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { isMobile } = useMobile();

  const panelContent = (
    <div className="np-content">
      <div className="np-empty">
        <div className="np-empty-icon">
          <Bell size={24} />
        </div>
        <p>No new notifications</p>
      </div>

      <style jsx global>{`
        .np-content {
          display: flex;
          flex-direction: column;
        }
        .np-empty {
          padding: 40px 16px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .np-empty-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-tertiary);
          color: var(--text-muted);
        }
        .np-empty p {
          color: var(--text-muted);
          font-size: 0.84rem;
          margin: 0;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="np-mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.div
              className="np-mobile-panel"
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            >
              <div className="np-mobile-header">
                <h3>Notifications</h3>
                <button className="np-mobile-close" onClick={onClose}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="np-mobile-body">
                {panelContent}
              </div>
            </motion.div>
            <style jsx global>{`
              .np-mobile-backdrop {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.4);
                z-index: 1100;
              }
              .np-mobile-panel {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                max-height: 80vh;
                background: var(--bg-secondary);
                border-radius: 0 0 20px 20px;
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
                z-index: 1200;
                display: flex;
                flex-direction: column;
                padding-top: env(safe-area-inset-top, 0px);
              }
              .np-mobile-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 16px 20px;
                border-bottom: 1px solid var(--border-color);
                flex-shrink: 0;
              }
              .np-mobile-header h3 {
                font-size: 1.05rem;
                font-weight: 700;
                color: var(--text-primary);
                margin: 0;
              }
              .np-mobile-close {
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
              }
              .np-mobile-body {
                flex: 1;
                overflow-y: auto;
                padding: 16px 20px 20px;
                overscroll-behavior: contain;
              }
            `}</style>
          </>
        )}
      </AnimatePresence>
    );
  }

  if (!isOpen) return null;

  return (
    <>
      <div className="np-dropdown">
        <div className="np-dropdown-header">
          <h3>Notifications</h3>
        </div>
        <div className="np-dropdown-body">
          {panelContent}
        </div>
      </div>
      <style jsx>{`
        .np-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 340px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.03);
          z-index: 1050;
          animation: npSlideIn 0.18s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }
        @keyframes npSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .np-dropdown-header {
          padding: 16px 20px 12px;
          border-bottom: 1px solid var(--border-color);
        }
        .np-dropdown-header h3 {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }
        .np-dropdown-body {
          padding: 14px 16px 16px;
        }
      `}</style>
    </>
  );
}
