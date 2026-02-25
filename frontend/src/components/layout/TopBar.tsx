'use client';

import { useState, useRef, useEffect } from 'react';
import { Logo } from '../ui';
import { Search, Bell, User } from 'lucide-react';
import { useMobile } from '@/hooks/useMobile';
import NotificationPanel from './NotificationPanel';
import ProfileMenu from './ProfileMenu';

interface TopBarProps {
  onMenuToggle?: () => void;
  onGetStarted?: () => void;
  searchPlaceholder?: string;
}

export default function TopBar({
  onMenuToggle,
  onGetStarted,
  searchPlaceholder = "Search products, suppliers, or markets..."
}: TopBarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { isMobile } = useMobile();
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside (desktop only)
  useEffect(() => {
    if (isMobile) return;
    if (!notifOpen && !profileOpen) return;

    const handleClick = (e: MouseEvent) => {
      if (notifOpen && notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileOpen && profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [notifOpen, profileOpen, isMobile]);

  const toggleNotif = () => {
    setNotifOpen(prev => !prev);
    setProfileOpen(false);
  };

  const toggleProfile = () => {
    setProfileOpen(prev => !prev);
    setNotifOpen(false);
  };

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <button className="mobile-menu-toggle" onClick={onMenuToggle}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <Logo size="medium" />
      </div>

      <div className="top-actions">
        <div className="search-bar">
          <Search size={18} />
          <input type="text" placeholder={searchPlaceholder} />
        </div>

        {/* Notification bell */}
        <div className="dropdown-anchor" ref={notifRef}>
          <button className={`icon-btn notification-btn ${notifOpen ? 'active' : ''}`} onClick={toggleNotif}>
            <Bell size={20} />
          </button>
          <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>

        <button className="btn-primary" onClick={onGetStarted}>Get Started</button>

        {/* Profile avatar */}
        <div className="dropdown-anchor" ref={profileRef}>
          <div className={`user-avatar ${profileOpen ? 'active' : ''}`} onClick={toggleProfile}>
            <User size={18} />
          </div>
          <ProfileMenu isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
        </div>
      </div>

      <style jsx>{`
        .top-bar {
          grid-column: 1 / -1;
          grid-row: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
          height: 64px;
        }

        .top-bar-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          color: var(--text-primary);
        }

        .mobile-menu-toggle svg {
          width: 24px;
          height: 24px;
        }

        .top-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .dropdown-anchor {
          position: relative;
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          padding: 10px 16px;
          min-width: 300px;
        }

        .search-bar :global(svg) {
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .search-bar input {
          flex: 1;
          border: none;
          background: none;
          outline: none;
          font-size: 0.9rem;
          color: var(--text-primary);
        }

        .search-bar input::placeholder {
          color: var(--text-muted);
        }

        .icon-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          cursor: pointer;
          color: var(--text-secondary);
          transition: all 0.2s;
        }

        .icon-btn:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }

        .icon-btn.active {
          background: rgba(249, 115, 22, 0.08);
          border-color: rgba(249, 115, 22, 0.2);
          color: var(--accent-primary);
        }

        .notification-dot {
          position: absolute;
          top: 7px;
          right: 7px;
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
          border: 2px solid var(--bg-secondary);
          box-sizing: content-box;
          animation: dotPulse 2s ease-in-out infinite;
        }

        @keyframes dotPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          50% { box-shadow: 0 0 0 4px rgba(239, 68, 68, 0); }
        }

        .btn-primary {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: box-shadow 0.2s;
        }

        .user-avatar.active {
          box-shadow: 0 0 0 2px var(--bg-secondary), 0 0 0 4px rgba(249, 115, 22, 0.3);
        }

        @media (max-width: 1024px) {
          .mobile-menu-toggle {
            display: block;
          }

          .search-bar {
            min-width: 200px;
          }
        }

        @media (max-width: 768px) {
          .search-bar {
            display: none;
          }

          .btn-primary {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
