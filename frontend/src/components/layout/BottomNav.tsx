'use client';

/**
 * BottomNav Component
 *
 * A mobile-only bottom navigation bar with:
 * - 5 key navigation items
 * - Active state animations
 * - Safe area padding for notched devices
 * - Touch-friendly targets (44px+)
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { tapScale } from '@/lib/animations';

// Bottom navigation items (5 max for mobile usability)
const bottomNavItems = [
  { href: '/dashboard', label: 'Home', icon: HomeIcon },
  { href: '/smart-sourcing', label: 'Search', icon: SearchIcon },
  { href: '/submit-requirement', label: 'Add', icon: AddIcon, primary: true },
  { href: '/supplier-matches', label: 'Inbox', icon: InboxIcon, badge: 3 },
  { href: '/settings', label: 'Profile', icon: ProfileIcon },
];

interface BottomNavProps {
  className?: string;
}

export function BottomNav({ className = '' }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className={`bottom-nav ${className}`}>
      {bottomNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-nav-item ${isActive ? 'active' : ''} ${item.primary ? 'primary' : ''}`}
          >
            <motion.div
              className="nav-icon-wrapper"
              whileTap={tapScale}
            >
              <Icon />
              {item.badge && item.badge > 0 && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </motion.div>
            <span className="nav-label">{item.label}</span>
          </Link>
        );
      })}

      <style jsx global>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-color);
          display: none;
          justify-content: space-around;
          align-items: center;
          padding: 8px 8px;
          padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
          z-index: 1000;
        }

        @media (max-width: 768px) {
          .bottom-nav {
            display: flex;
          }
        }

        .bottom-nav-item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px 12px;
          min-width: 64px;
          min-height: 52px;
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.2s;
        }

        .bottom-nav-item .nav-icon-wrapper {
          position: relative;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
        }

        .bottom-nav-item svg {
          width: 24px;
          height: 24px;
          transition: transform 0.2s;
        }

        .bottom-nav-item .nav-label {
          font-size: 0.7rem;
          font-weight: 500;
          line-height: 1;
          transition: color 0.2s;
        }

        .bottom-nav-item.active {
          color: var(--accent-primary);
        }

        .bottom-nav-item.active svg {
          transform: scale(1.1);
        }

        /* Primary button (center Add button) */
        .bottom-nav-item.primary .nav-icon-wrapper {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          border-radius: 50%;
          margin-top: -16px;
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
        }

        .bottom-nav-item.primary svg {
          color: white;
          width: 24px;
          height: 24px;
        }

        .bottom-nav-item.primary .nav-label {
          margin-top: 6px;
        }

        .bottom-nav-item.primary.active {
          color: var(--accent-primary);
        }

        .bottom-nav-item.primary .nav-icon-wrapper:active {
          transform: scale(0.95);
        }

        /* Badge */
        .bottom-nav-item .nav-badge {
          position: absolute;
          top: -4px;
          right: -8px;
          min-width: 18px;
          height: 18px;
          background: #ef4444;
          color: white;
          font-size: 0.65rem;
          font-weight: 600;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
        }

        /* Dark mode adjustments */
        [data-theme="dark"] .bottom-nav {
          background: var(--bg-secondary);
          border-color: var(--border-color);
        }
      `}</style>
    </nav>
  );
}

// Icon Components
function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
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

function AddIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
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

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export default BottomNav;
