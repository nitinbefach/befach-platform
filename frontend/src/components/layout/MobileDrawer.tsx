'use client';

/**
 * MobileDrawer Component
 *
 * An animated navigation drawer for mobile devices with:
 * - Slide-in animation from left
 * - Swipe-to-close gesture
 * - Backdrop fade effect
 * - Touch-friendly navigation items
 */

import { useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { slideInLeft, backdropFade, springConfig } from '@/lib/animations';

// Navigation items for mobile drawer
const mobileNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { href: '/my-requirements', label: 'My Requirements', icon: RequirementsIcon },
  { href: '/my-orders', label: 'My Orders', icon: OrdersIcon },
  { href: '/smart-sourcing', label: 'AI Supplier Search', icon: SearchIcon },
  { href: '/our-vendors', label: 'Our Vendors', icon: VendorsIcon },
  { href: '/supplier-matches', label: 'Supplier Inbox', icon: InboxIcon, badge: '3' },
  { href: '/market-insights', label: 'Market Insights', icon: InsightsIcon },
  { href: '/exim-data', label: 'EX-IM Data', icon: GlobeIcon },
  { href: '/ai-assistant', label: 'AI Assistant', icon: BrainIcon },
  { href: '/cost-calculator', label: 'Cost Calculator', icon: CalculatorIcon },
  { href: '/book-shipment', label: 'Book Shipment', icon: PackageIcon },
  { href: '/track-shipment', label: 'Track Shipments', icon: TruckIcon },
  { href: '/payments/new', label: 'Make Payment', icon: WalletIcon },
  { href: '/payments/history', label: 'Payment History', icon: PaymentHistoryIcon },
  { href: '/payments/methods', label: 'Payment Methods', icon: CardIcon },
  { href: '/payments/fx-rates', label: 'FX & Rates', icon: ExchangeIcon },
  { href: '/settings', label: 'Settings', icon: SettingsIcon },
];

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when drawer is open
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

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => onClose(),
    trackMouse: false,
    trackTouch: true,
    delta: 50,
    swipeDuration: 500,
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="mobile-drawer-backdrop"
            variants={backdropFade}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.nav
            className="mobile-drawer"
            variants={slideInLeft}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={springConfig.snappy}
            {...swipeHandlers}
          >
            {/* Header */}
            <div className="mobile-drawer-header">
              <div className="drawer-logo">
                <span className="logo-badge">B</span>
                <span className="logo-text">Befach</span>
              </div>
              <button
                className="drawer-close"
                onClick={onClose}
                aria-label="Close menu"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Navigation Items */}
            <div className="mobile-drawer-nav">
              {mobileNavItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                    style={{ animationDelay: `${index * 0.03}s` }}
                  >
                    <span className="nav-icon">
                      <Icon />
                    </span>
                    <span className="nav-label">{item.label}</span>
                    {item.badge && (
                      <span className="nav-badge">{item.badge}</span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mobile-drawer-footer">
              <Link href="/settings" className="drawer-footer-item">
                <UserIcon />
                <span>My Profile</span>
              </Link>
              <button className="drawer-footer-item logout">
                <LogoutIcon />
                <span>Logout</span>
              </button>
            </div>
          </motion.nav>
        </>
      )}

      <style jsx global>{`
        .mobile-drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 1100;
        }

        .mobile-drawer {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 280px;
          max-width: 85vw;
          background: var(--sidebar-bg, #1e293b);
          z-index: 1200;
          display: flex;
          flex-direction: column;
          box-shadow: 4px 0 20px rgba(0, 0, 0, 0.3);
        }

        .mobile-drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid var(--sidebar-border, #334155);
        }

        .drawer-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-badge {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 1.25rem;
        }

        .logo-text {
          color: var(--sidebar-text, #f1f5f9);
          font-size: 1.25rem;
          font-weight: 600;
        }

        .drawer-close {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: var(--sidebar-text-muted, #94a3b8);
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .drawer-close:hover {
          background: var(--sidebar-hover, #334155);
          color: var(--sidebar-text, #f1f5f9);
        }

        .drawer-close svg {
          width: 24px;
          height: 24px;
        }

        .mobile-drawer-nav {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
        }

        .mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          color: var(--sidebar-text, #f1f5f9);
          text-decoration: none;
          border-radius: 10px;
          margin-bottom: 4px;
          transition: all 0.2s;
          animation: slideInLeft 0.3s ease-out forwards;
          opacity: 0;
        }

        .mobile-nav-item:hover {
          background: var(--sidebar-hover, #334155);
        }

        .mobile-nav-item:active {
          transform: scale(0.98);
        }

        .mobile-nav-item.active {
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
        }

        .mobile-nav-item .nav-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.85;
        }

        .mobile-nav-item .nav-icon svg {
          width: 22px;
          height: 22px;
        }

        .mobile-nav-item.active .nav-icon {
          opacity: 1;
        }

        .mobile-nav-item .nav-label {
          flex: 1;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .mobile-nav-item .nav-badge {
          background: rgba(249, 115, 22, 0.2);
          color: #f97316;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .mobile-nav-item.active .nav-badge {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .mobile-drawer-footer {
          padding: 16px;
          border-top: 1px solid var(--sidebar-border, #334155);
        }

        .drawer-footer-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          color: var(--sidebar-text-muted, #94a3b8);
          text-decoration: none;
          border-radius: 8px;
          width: 100%;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .drawer-footer-item:hover {
          background: var(--sidebar-hover, #334155);
          color: var(--sidebar-text, #f1f5f9);
        }

        .drawer-footer-item.logout:hover {
          color: #ef4444;
        }

        .drawer-footer-item svg {
          width: 20px;
          height: 20px;
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </AnimatePresence>
  );
}

// Icon Components
function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function RequirementsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function VendorsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function InboxIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

function InsightsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function CalculatorIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="8" y2="10" />
      <line x1="12" y1="10" x2="12" y2="10" />
      <line x1="16" y1="10" x2="16" y2="10" />
      <line x1="8" y1="14" x2="8" y2="14" />
      <line x1="12" y1="14" x2="12" y2="14" />
      <line x1="16" y1="14" x2="16" y2="14" />
      <line x1="8" y1="18" x2="8" y2="18" />
      <line x1="12" y1="18" x2="16" y2="18" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M16.5 9.4l-9-5.19" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M1 3h15v13H1z" />
      <path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
    </svg>
  );
}

function PaymentHistoryIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function ExchangeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M12 2L9 9l-7 1 5 5-1 7 6-3 6 3-1-7 5-5-7-1z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
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

export default MobileDrawer;
