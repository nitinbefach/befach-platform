'use client';

/**
 * AppLayout Component
 *
 * Main application layout with:
 * - TopBar header
 * - Sidebar navigation (desktop: expanded 240px, mobile: hidden)
 * - MobileDrawer (mobile, swipe-to-close)
 * - BottomNav (mobile)
 * - Optional right contextual panel (desktop only)
 * - Animated page transitions
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import { MobileDrawer } from './MobileDrawer';
import { BottomNav } from './BottomNav';
import Modal from '../ui/Modal';
import FeedbackWidget from '../feedback/FeedbackWidget';
import { useMobile } from '@/hooks/useMobile';
import { pageSlide, springConfig } from '@/lib/animations';

interface AppLayoutProps {
  children: React.ReactNode;
  /** Optional right panel content (rendered as 3rd grid column on desktop, below content on mobile) */
  rightPanel?: React.ReactNode;
  /** Right panel width in px (default 340) */
  rightPanelWidth?: number;
  searchPlaceholder?: string;
  /** Hide bottom nav on specific pages */
  hideBottomNav?: boolean;
  /** Animate page content */
  animateContent?: boolean;
}

export default function AppLayout({
  children,
  rightPanel,
  rightPanelWidth = 340,
  searchPlaceholder,
  hideBottomNav = false,
  animateContent = true
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { isMobile, isDesktop } = useMobile();

  // Close drawer when switching to desktop view
  useEffect(() => {
    if (!isMobile && drawerOpen) {
      setDrawerOpen(false);
    }
  }, [isMobile, drawerOpen]);

  // Handle menu toggle - open drawer on mobile, sidebar on desktop
  const handleMenuToggle = () => {
    if (isMobile) {
      setDrawerOpen(!drawerOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const showRightColumn = rightPanel && isDesktop;
  const showRightInline = rightPanel && !isDesktop;

  const containerClasses = [
    'app-container',
    !hideBottomNav && isMobile ? 'has-bottom-nav' : '',
    showRightColumn ? 'has-right-panel' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={containerClasses}
      style={showRightColumn ? { '--right-panel-width': `${rightPanelWidth}px` } as React.CSSProperties : undefined}
    >
      <TopBar
        onMenuToggle={handleMenuToggle}
        onGetStarted={() => setModalOpen(true)}
        searchPlaceholder={searchPlaceholder}
      />

      {/* Desktop Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Main Content with Optional Animation */}
      <main className="main-content">
        {animateContent ? (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageSlide}
            transition={springConfig.gentle}
            className="content-wrapper"
          >
            {children}
            {/* Mobile/tablet: right panel stacks below content */}
            {showRightInline && (
              <div className="right-panel-mobile">
                {rightPanel}
              </div>
            )}
          </motion.div>
        ) : (
          <div className="content-wrapper">
            {children}
            {showRightInline && (
              <div className="right-panel-mobile">
                {rightPanel}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Desktop: Right Contextual Panel */}
      {showRightColumn && (
        <aside className="right-panel">
          {rightPanel}
        </aside>
      )}

      {/* Mobile Bottom Navigation */}
      {!hideBottomNav && <BottomNav />}

      {/* Global Feedback Widget */}
      <FeedbackWidget />

      {/* Get Started Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Get Started with BEFACH">
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem' }}>
          Join 5,000+ businesses simplifying their global trade operations
        </p>
        <form>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Enter your name" required />
          </div>
          <div className="form-group">
            <label>Business Email</label>
            <input type="email" placeholder="you@company.com" required />
          </div>
          <div className="form-group">
            <label>Company Name</label>
            <input type="text" placeholder="Your company name" required />
          </div>
          <div className="form-group">
            <label>Import Volume</label>
            <select required>
              <option value="">Select monthly volume</option>
              <option value="0-50k">$0 - $50,000</option>
              <option value="50k-200k">$50,000 - $200,000</option>
              <option value="200k-1m">$200,000 - $1M</option>
              <option value="1m+">$1M+</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-submit">Start Free Trial</button>
          </div>
        </form>
      </Modal>

      <style jsx>{`
        .app-container {
          display: grid;
          grid-template-columns: 240px 1fr;
          grid-template-rows: 64px 1fr;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
        }

        /* 3-column layout when right panel is present */
        .app-container.has-right-panel {
          grid-template-columns: 240px 1fr var(--right-panel-width, 340px);
        }

        .main-content {
          grid-column: 2;
          grid-row: 2;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 28px;
          background: var(--bg-primary);
          transition: padding 0.2s ease;
        }

        .content-wrapper {
          min-height: 100%;
        }

        /* Right panel — desktop only (3rd grid column) */
        .right-panel {
          grid-column: 3;
          grid-row: 2;
          overflow-y: auto;
          overflow-x: hidden;
          border-left: 1px solid var(--border-color);
          background: var(--bg-secondary);
          padding: 20px;
        }

        /* Right panel — mobile/tablet (stacked below content) */
        .right-panel-mobile {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid var(--border-color);
        }

        /* Tablet - hide sidebar, collapse to single column */
        @media (max-width: 1024px) {
          .app-container {
            grid-template-columns: 1fr;
          }
          .app-container.has-right-panel {
            grid-template-columns: 1fr;
          }
          .main-content {
            grid-column: 1;
          }
          .right-panel {
            display: none;
          }
        }

        /* Mobile - reduce padding, account for bottom nav */
        @media (max-width: 768px) {
          .main-content {
            padding: 16px;
            padding-bottom: 20px;
          }

          .app-container.has-bottom-nav .main-content {
            padding-bottom: calc(80px + env(safe-area-inset-bottom, 0px));
          }

          .right-panel-mobile {
            margin-top: 16px;
            padding-top: 16px;
          }
        }

        /* Small mobile */
        @media (max-width: 480px) {
          .main-content {
            padding: 12px;
          }

          .app-container.has-bottom-nav .main-content {
            padding-bottom: calc(100px + env(safe-area-inset-bottom, 0px));
          }
        }
      `}</style>
    </div>
  );
}
