'use client';

/**
 * AppLayout Component
 *
 * Main application layout with:
 * - TopBar header
 * - Sidebar navigation (desktop)
 * - MobileDrawer (mobile, swipe-to-close)
 * - BottomNav (mobile)
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
import AIChatbot from '../chat/AIChatbot';
import { useMobile } from '@/hooks/useMobile';
import { pageSlide, springConfig } from '@/lib/animations';

interface AppLayoutProps {
  children: React.ReactNode;
  searchPlaceholder?: string;
  /** Hide bottom nav on specific pages */
  hideBottomNav?: boolean;
  /** Animate page content */
  animateContent?: boolean;
}

export default function AppLayout({
  children,
  searchPlaceholder,
  hideBottomNav = false,
  animateContent = true
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { isMobile } = useMobile();

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

  return (
    <div className={`app-container ${!hideBottomNav && isMobile ? 'has-bottom-nav' : ''}`}>
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
          </motion.div>
        ) : (
          <div className="content-wrapper">
            {children}
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      {!hideBottomNav && <BottomNav />}

      {/* Global Feedback Widget */}
      <FeedbackWidget />

      {/* Global AI Chatbot */}
      <AIChatbot />

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
          grid-template-columns: 70px 1fr;
          grid-template-rows: 64px 1fr;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
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

        /* Tablet - hide sidebar, show hamburger menu */
        @media (max-width: 1024px) {
          .app-container {
            grid-template-columns: 1fr;
          }
          .main-content {
            grid-column: 1;
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
        }

        /* Small mobile */
        @media (max-width: 480px) {
          .main-content {
            padding: 12px;
          }

          .app-container.has-bottom-nav .main-content {
            padding-bottom: calc(76px + env(safe-area-inset-bottom, 0px));
          }
        }
      `}</style>
    </div>
  );
}
