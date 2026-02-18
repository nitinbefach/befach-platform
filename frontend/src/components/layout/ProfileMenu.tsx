'use client';

import Link from 'next/link';
import { User, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMobile } from '@/hooks/useMobile';
import { useUser } from '@/context/UserModeContext';

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileMenu({ isOpen, onClose }: ProfileMenuProps) {
  const { isMobile } = useMobile();
  const { organization, userRole, logout } = useUser();

  const initial = (organization?.name || 'U').charAt(0).toUpperCase();

  const handleLogout = () => {
    onClose();
    logout();
  };

  const menuContent = (
    <div className="pm-content">
      {/* User Card */}
      <div className="pm-user-card">
        <div className="pm-avatar">{initial}</div>
        <div className="pm-user-info">
          <span className="pm-user-name">{organization?.name || 'User'}</span>
          <span className="pm-user-role">{userRole}</span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="pm-menu-section">
        <Link href="/settings" className="pm-menu-item" onClick={onClose}>
          <div className="pm-menu-item-icon">
            <User size={15} />
          </div>
          <span>My Profile</span>
        </Link>
        <Link href="/settings" className="pm-menu-item" onClick={onClose}>
          <div className="pm-menu-item-icon">
            <Settings size={15} />
          </div>
          <span>Settings</span>
        </Link>
      </div>

      <div className="pm-divider" />

      <div className="pm-menu-section">
        <button className="pm-menu-item pm-logout" onClick={handleLogout}>
          <div className="pm-menu-item-icon logout-icon">
            <LogOut size={15} />
          </div>
          <span>Logout</span>
        </button>
      </div>

      {/* Footer */}
      <div className="pm-footer">
        <span className="pm-plan-badge">Demo Plan</span>
      </div>

      <style jsx global>{`
        .pm-content {
          display: flex;
          flex-direction: column;
        }

        /* ── User Card ── */
        .pm-user-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: var(--bg-primary);
          border-radius: 10px;
          margin-bottom: 8px;
        }
        .pm-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
          font-weight: 700;
          font-size: 0.9rem;
        }
        .pm-user-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .pm-user-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .pm-user-role {
          font-size: 0.72rem;
          font-weight: 500;
          color: var(--text-muted);
          text-transform: capitalize;
        }

        /* ── Menu Section ── */
        .pm-menu-section {
          padding: 4px 0;
        }
        .pm-menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 8px;
          font-size: 0.84rem;
          font-weight: 500;
          color: var(--text-primary);
          text-decoration: none;
          cursor: pointer;
          transition: background 0.12s;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }
        .pm-menu-item:hover {
          background: var(--bg-primary);
        }
        .pm-menu-item-icon {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-tertiary);
          color: var(--text-secondary);
          flex-shrink: 0;
          transition: background 0.12s;
        }
        .pm-menu-item:hover .pm-menu-item-icon {
          background: var(--border-color);
        }

        /* ── Logout ── */
        .pm-logout {
          color: #dc2626;
        }
        .pm-logout .logout-icon {
          background: rgba(220, 38, 38, 0.06);
          color: #dc2626;
        }
        .pm-logout:hover {
          background: rgba(220, 38, 38, 0.04);
        }
        .pm-logout:hover .logout-icon {
          background: rgba(220, 38, 38, 0.1);
        }

        /* ── Divider ── */
        .pm-divider {
          height: 1px;
          background: var(--border-color);
          margin: 4px 8px;
        }

        /* ── Footer ── */
        .pm-footer {
          padding: 10px 12px 4px;
          border-top: 1px solid var(--border-color);
          margin-top: 4px;
        }
        .pm-plan-badge {
          font-size: 0.68rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        /* ── Mobile overrides ── */
        @media (max-width: 768px) {
          .pm-user-card {
            padding: 14px;
            border-radius: 12px;
            margin-bottom: 10px;
          }
          .pm-avatar {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            font-size: 1rem;
          }
          .pm-user-name {
            font-size: 0.9rem;
          }
          .pm-menu-item {
            padding: 13px 12px;
            font-size: 0.88rem;
          }
          .pm-menu-item-icon {
            width: 32px;
            height: 32px;
            border-radius: 8px;
          }
        }
      `}</style>
    </div>
  );

  // Mobile: Top slide-down panel
  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="pm-mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.div
              className="pm-mobile-panel"
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            >
              <div className="pm-mobile-header">
                <h3>Account</h3>
                <button className="pm-mobile-close" onClick={onClose}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="pm-mobile-body">
                {menuContent}
              </div>
            </motion.div>
            <style jsx global>{`
              .pm-mobile-backdrop {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.4);
                z-index: 1100;
              }
              .pm-mobile-panel {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: var(--bg-secondary);
                border-radius: 0 0 20px 20px;
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
                z-index: 1200;
                display: flex;
                flex-direction: column;
                padding-top: env(safe-area-inset-top, 0px);
              }
              .pm-mobile-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 16px 20px;
                border-bottom: 1px solid var(--border-color);
              }
              .pm-mobile-header h3 {
                font-size: 1.05rem;
                font-weight: 700;
                color: var(--text-primary);
                margin: 0;
              }
              .pm-mobile-close {
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
              .pm-mobile-body {
                padding: 16px 20px 20px;
              }
            `}</style>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Desktop: Dropdown
  if (!isOpen) return null;

  return (
    <>
      <div className="pm-dropdown">
        {menuContent}
      </div>
      <style jsx>{`
        .pm-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 260px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.03);
          z-index: 1050;
          padding: 8px;
          animation: pmSlideIn 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes pmSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
