'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useUser } from '@/context/UserModeContext';
import { useMobile } from '@/hooks/useMobile';
import styles from './Sidebar.module.css';

// Navigation structure with parent sections and child features
const navigationConfig = {
  standalone: [
    { id: 'dashboard', href: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'my-requirements', href: '/my-requirements', icon: 'requirements', label: 'My Requirements' },
    { id: 'my-orders', href: '/my-orders', icon: 'orders', label: 'My Orders' },
  ],
  sections: {
    sourcing: {
      id: 'sourcing',
      label: 'Sourcing',
      icon: 'search',
      features: [
        { id: 'submit-requirement', href: '/submit-requirement', icon: 'add', label: 'Share Requirement', section: 'actions' },
        { id: 'smart-sourcing', href: '/smart-sourcing', icon: 'ai', label: 'AI Supplier Search', section: 'actions' },
        { id: 'invite-supplier', href: '/invite-supplier', icon: 'invite', label: 'Invite Supplier', section: 'actions' },
        { id: 'our-vendors', href: '/our-vendors', icon: 'building', label: 'Our Vendors', section: 'manage' },
        { id: 'supplier-inbox', href: '/supplier-matches', icon: 'mail', label: 'Supplier Inbox', section: 'manage', badge: '3' },
      ],
    },
    tools: {
      id: 'tools',
      label: 'Tools',
      icon: 'tools',
      features: [
        { id: 'market-insights', href: '/market-insights', icon: 'insights', label: 'Market Insights', section: 'analytics' },
        { id: 'exim-data', href: '/exim-data', icon: 'globe', label: 'EX-IM Data', section: 'analytics' },
        { id: 'cost-calculator', href: '/cost-calculator', icon: 'dollar', label: 'Cost Calculator', section: 'utilities' },
        { id: 'compliance-tools', href: '/compliance-tools', icon: 'shield', label: 'Compliance', section: 'utilities' },
      ],
    },
    logistics: {
      id: 'logistics',
      label: 'Logistics',
      icon: 'truck',
      features: [
        { id: 'book-shipment', href: '/book-shipment', icon: 'package', label: 'Book Shipment', section: 'tracking' },
        { id: 'track-shipment', href: '/track-shipment', icon: 'location', label: 'Track Shipments', section: 'tracking' },
        { id: 'documents', href: '/documents', icon: 'document', label: 'Documents', section: 'tracking' },
      ],
    },
    payments: {
      id: 'payments',
      label: 'Payments',
      icon: 'wallet',
      features: [
        { id: 'make-payment', href: '/payments/new', icon: 'send', label: 'Make Payment', section: 'actions' },
        { id: 'payment-history', href: '/payments/history', icon: 'dollar', label: 'Payment History', section: 'history' },
        { id: 'payment-methods', href: '/payments/methods', icon: 'card', label: 'Payment Methods', section: 'manage' },
        { id: 'fx-rates', href: '/payments/fx-rates', icon: 'exchange', label: 'FX & Rates', section: 'tools' },
      ],
    },
    team: {
      id: 'team',
      label: 'Team',
      icon: 'team',
      features: [
        { id: 'team-management', href: '/team-management', icon: 'users', label: 'Team Members', section: 'members' },
        { id: 'reports', href: '/reports', icon: 'report', label: 'Reports', section: 'analytics' },
        { id: 'feedback', href: '/feedback', icon: 'star', label: 'Feedback', section: 'analytics' },
        { id: 'api-settings', href: '/api-settings', icon: 'api', label: 'API Settings', section: 'settings' },
      ],
    },
    settings: {
      id: 'settings',
      label: 'Settings',
      icon: 'settings',
      features: [
        { id: 'billing', href: '/billing-history', icon: 'dollar', label: 'Billing & Plans', section: 'account' },
        { id: 'profile', href: '/settings', icon: 'user', label: 'My Profile', section: 'account' },
        { id: 'recycle-bin', href: '/recycle-bin', icon: 'trash', label: 'Recycle Bin', section: 'account' },
      ],
    },
  },
};

const sectionTitles: Record<string, string> = {
  actions: 'Quick Actions',
  manage: 'Manage',
  analytics: 'Analytics',
  utilities: 'Utilities',
  tracking: 'Tracking',
  history: 'History',
  tools: 'Tools',
  members: 'Members',
  settings: 'Settings',
  account: 'Account',
};

// Chevron icon for section expand/collapse
const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// SVG Icons
const icons: { [key: string]: JSX.Element } = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  orders: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  requirements: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  ),
  tools: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  truck: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M1 3h15v13H1z" />
      <path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  team: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  add: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
  invite: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" y1="8" x2="20" y2="14" />
      <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
  ),
  ai: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
      <circle cx="7.5" cy="14.5" r="1.5" fill="currentColor" />
      <circle cx="16.5" cy="14.5" r="1.5" fill="currentColor" />
    </svg>
  ),
  target: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  insights: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  dollar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  location: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  document: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  package: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  report: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  api: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  trash: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  ),
  building: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M3 21h18" />
      <path d="M5 21V7l8-4v18" />
      <path d="M19 21V11l-6-4" />
      <path d="M9 9v.01" />
      <path d="M9 12v.01" />
      <path d="M9 15v.01" />
      <path d="M9 18v.01" />
    </svg>
  ),
  wallet: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
    </svg>
  ),
  send: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  card: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  exchange: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  ),
};

interface SidebarProps {
  isOpen?: boolean;
  isCollapsed?: boolean;
  onClose?: () => void;
  onToggleCollapse?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { organization, logout } = useUser();
  const { isDesktop } = useMobile();
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const togglePanel = (panelId: string) => {
    setActivePanel(prev => prev === panelId ? null : panelId);
  };

  const closePanel = () => {
    setActivePanel(null);
  };

  const handleFeatureClick = () => {
    setActivePanel(null);
    if (onClose) onClose();
  };

  const isSectionActive = (sectionId: string) => {
    const section = navigationConfig.sections[sectionId as keyof typeof navigationConfig.sections];
    if (!section) return false;
    return section.features.some(f => pathname === f.href);
  };

  const isStandaloneActive = (href: string) => pathname === href;

  const groupFeaturesBySection = (features: typeof navigationConfig.sections.sourcing.features) => {
    const grouped: Record<string, typeof features> = {};
    features.forEach(feature => {
      if (!grouped[feature.section]) {
        grouped[feature.section] = [];
      }
      grouped[feature.section].push(feature);
    });
    return grouped;
  };

  // ─── Desktop: Expanded Sidebar with Inline Labels + Accordion ───
  if (isDesktop) {
    return (
      <div className={styles.sidebarWrapper}>
        <aside className={`${styles.iconSidebar} ${styles.iconSidebarExpanded}`}>
          {/* Logo */}
          <div className={styles.sidebarLogo}>
            <div className={styles.logoBadge}>
              {organization?.name?.charAt(0).toUpperCase() || 'B'}
            </div>
            <span className={styles.orgName}>{organization?.name || 'Befach'}</span>
          </div>

          {/* Nav Items */}
          <nav className={`${styles.navIcons} ${styles.navIconsExpanded}`}>
            {/* Standalone Items */}
            {navigationConfig.standalone.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`${styles.navIconItem} ${styles.navItemExpanded} ${isStandaloneActive(item.href) ? styles.active : ''}`}
                onClick={onClose}
              >
                <div className={styles.iconWrapper}>{icons[item.icon]}</div>
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            ))}

            {/* Section Items with Inline Accordion */}
            {Object.entries(navigationConfig.sections).map(([key, section]) => {
              const isOpen = activePanel === key;
              const sectionActive = isSectionActive(key);
              const groupedFeatures = groupFeaturesBySection(section.features);

              return (
                <div key={key}>
                  {/* Section Header */}
                  <div
                    className={`${styles.navIconItem} ${styles.navItemExpanded} ${sectionActive ? styles.active : ''}`}
                    onClick={() => togglePanel(key)}
                  >
                    <div className={styles.iconWrapper}>{icons[section.icon]}</div>
                    <span className={styles.navLabel}>{section.label}</span>
                    <span className={`${styles.sectionChevron} ${isOpen ? styles.sectionChevronOpen : ''}`}>
                      <ChevronRight />
                    </span>
                  </div>

                  {/* Inline Accordion Children */}
                  {isOpen && (
                    <div className={styles.inlineChildren}>
                      {Object.entries(groupedFeatures).map(([sectionKey, features]) => (
                        <div key={sectionKey}>
                          {Object.keys(groupedFeatures).length > 1 && (
                            <div className={styles.inlineSectionTitle}>
                              {sectionTitles[sectionKey] || sectionKey}
                            </div>
                          )}
                          {features.map((feature) => (
                            <Link
                              key={feature.id}
                              href={feature.href}
                              className={`${styles.inlineChildItem} ${pathname === feature.href ? styles.active : ''}`}
                              onClick={handleFeatureClick}
                            >
                              <span className={styles.childIcon}>{icons[feature.icon]}</span>
                              <span className={styles.childLabel}>{feature.label}</span>
                              {feature.badge && <span className={styles.inlineChildBadge}>{feature.badge}</span>}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className={styles.sidebarFooter}>
            <button
              className={`${styles.navIconItem} ${styles.navItemExpanded} ${styles.logoutItem} ${styles.logoutExpanded}`}
              onClick={handleLogout}
            >
              <div className={styles.iconWrapper}>{icons.logout}</div>
              <span className={styles.logoutLabel}>Logout</span>
            </button>
          </div>
        </aside>
      </div>
    );
  }

  // ─── Mobile/Tablet: Original Icon-Only Sidebar + Flyout Panels ───
  return (
    <div className={`${styles.sidebarWrapper} ${isOpen ? styles.open : ''}`}>
      {/* Icon Sidebar */}
      <aside className={styles.iconSidebar}>
        {/* Logo */}
        <div className={styles.sidebarLogo}>
          <div className={styles.logoBadge}>
            {organization?.name?.charAt(0).toUpperCase() || 'B'}
          </div>
        </div>

        {/* Standalone Items */}
        <nav className={styles.navIcons}>
          {navigationConfig.standalone.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`${styles.navIconItem} ${isStandaloneActive(item.href) ? styles.active : ''}`}
              onClick={onClose}
            >
              <div className={styles.iconWrapper}>{icons[item.icon]}</div>
              <span className={styles.tooltip}>{item.label}</span>
            </Link>
          ))}

          {/* Section Items with Expandable Panels */}
          {Object.entries(navigationConfig.sections).map(([key, section]) => (
            <div
              key={key}
              className={`${styles.navIconItem} ${isSectionActive(key) ? styles.active : ''} ${activePanel === key ? styles.hovered : ''}`}
              onClick={() => togglePanel(key)}
            >
              <div className={styles.iconWrapper}>{icons[section.icon]}</div>
              <span className={styles.tooltip}>{section.label}</span>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className={styles.sidebarFooter}>
          <button className={`${styles.navIconItem} ${styles.logoutItem}`} onClick={handleLogout}>
            <div className={styles.iconWrapper}>{icons.logout}</div>
            <span className={styles.tooltip}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Expandable Panels (mobile/tablet only) */}
      {Object.entries(navigationConfig.sections).map(([key, section]) => {
        const groupedFeatures = groupFeaturesBySection(section.features);

        return (
          <div
            key={key}
            className={`${styles.expandPanel} ${activePanel === key ? styles.visible : ''}`}
          >
            <div className={styles.panelHeader}>
              <div className={styles.panelTitle}>
                <span className={styles.panelIcon}>{icons[section.icon]}</span>
                {section.label}
              </div>
              <button
                className={styles.closeButton}
                onClick={closePanel}
                aria-label="Close panel"
              >
                ×
              </button>
            </div>

            <nav className={styles.panelNav}>
              {Object.entries(groupedFeatures).map(([sectionKey, features]) => (
                <div key={sectionKey}>
                  <div className={styles.panelSectionTitle}>{sectionTitles[sectionKey] || sectionKey}</div>
                  {features.map((feature) => (
                    <Link
                      key={feature.id}
                      href={feature.href}
                      className={`${styles.panelNavItem} ${pathname === feature.href ? styles.active : ''}`}
                      onClick={handleFeatureClick}
                    >
                      <span className={styles.itemIcon}>{icons[feature.icon]}</span>
                      <span className={styles.itemText}>{feature.label}</span>
                      {feature.badge && <span className={styles.itemBadge}>{feature.badge}</span>}
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
          </div>
        );
      })}
    </div>
  );
}
