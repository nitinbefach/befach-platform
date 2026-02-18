'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard, Calculator, Search, Users, FileText, TrendingUp,
  Package, Truck, FileCheck, Shield, Wallet, Clock, ArrowLeftRight,
  Users2, BarChart3, Bot, Settings, Sparkles, ChevronRight, CheckCircle,
  type LucideIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMobile } from '@/hooks/useMobile';
import { WALKTHROUGH_CONFIGS, FEATURE_FLOW_ORDER } from '@/lib/walkthroughSteps';
import { getAllFeatureStatus, getCompletedCount } from '@/lib/walkthroughStorage';

const FEATURE_ICONS: Record<string, LucideIcon> = {
  'dashboard': LayoutDashboard,
  'cost-calculator': Calculator,
  'smart-sourcing': Search,
  'our-vendors': Users,
  'submit-requirement': FileText,
  'market-insights': TrendingUp,
  'book-shipment': Package,
  'track-shipment': Truck,
  'documents': FileCheck,
  'compliance-tools': Shield,
  'payments-new': Wallet,
  'payments-history': Clock,
  'payments-fx': ArrowLeftRight,
  'team-management': Users2,
  'reports': BarChart3,
  'ai-assistant': Bot,
  'settings': Settings,
};

function getRelativeTime(isoString?: string): string {
  if (!isoString) return '';
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { isMobile } = useMobile();
  const [activeTab, setActiveTab] = useState<'activity' | 'discover'>('activity');

  const { explored, undiscovered, completedCount, total } = useMemo(() => {
    const status = getAllFeatureStatus();
    const exp: { id: string; name: string; route: string; desc: string; completedAt?: string }[] = [];
    const undisc: { id: string; name: string; route: string; desc: string }[] = [];

    FEATURE_FLOW_ORDER.forEach(id => {
      const config = WALKTHROUGH_CONFIGS[id];
      if (!config) return;
      const feat = status[id];

      if (feat && feat.visitCount > 0) {
        exp.push({
          id,
          name: config.featureName,
          route: config.route,
          desc: config.description,
          completedAt: feat.completedAt,
        });
      } else {
        undisc.push({
          id,
          name: config.featureName,
          route: config.route,
          desc: config.description,
        });
      }
    });

    exp.sort((a, b) => {
      if (a.completedAt && b.completedAt) return b.completedAt.localeCompare(a.completedAt);
      if (a.completedAt) return -1;
      if (b.completedAt) return 1;
      return 0;
    });

    return {
      explored: exp,
      undiscovered: undisc,
      completedCount: getCompletedCount(),
      total: FEATURE_FLOW_ORDER.length,
    };
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Default to appropriate tab on open
  useEffect(() => {
    if (isOpen) {
      setActiveTab(explored.length > 0 ? 'activity' : 'discover');
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const progressPercent = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const circumference = 2 * Math.PI * 20;
  const strokeOffset = circumference * (1 - progressPercent / 100);

  const panelContent = (
    <div className="np-content">
      {/* Progress Header */}
      <div className="np-header">
        <div className="np-ring">
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" className="ring-track" />
            <circle
              cx="24" cy="24" r="20"
              className="ring-fill"
              style={{ strokeDasharray: circumference, strokeDashoffset: strokeOffset }}
            />
          </svg>
          <span className="np-ring-label">{completedCount}</span>
        </div>
        <div className="np-header-text">
          <span className="np-header-title">{completedCount} of {total} explored</span>
          <span className="np-header-sub">
            {progressPercent === 100
              ? 'All features discovered!'
              : `${total - completedCount} features to discover`}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="np-tabs">
        <button
          className={`np-tab ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          Activity
        </button>
        <button
          className={`np-tab ${activeTab === 'discover' ? 'active' : ''}`}
          onClick={() => setActiveTab('discover')}
        >
          Discover
          {undiscovered.length > 0 && (
            <span className="np-tab-badge">{undiscovered.length}</span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="np-body">
        {activeTab === 'activity' && (
          <>
            {explored.length > 0 ? (
              explored.slice(0, 8).map(feat => {
                const Icon = FEATURE_ICONS[feat.id] || LayoutDashboard;
                return (
                  <Link key={feat.id} href={feat.route} className="np-activity-item" onClick={onClose}>
                    <div className="np-activity-icon">
                      <Icon size={16} />
                    </div>
                    <div className="np-activity-text">
                      <span className="np-activity-name">{feat.name}</span>
                      <span className="np-activity-time">{getRelativeTime(feat.completedAt)}</span>
                    </div>
                    <ChevronRight size={14} className="np-activity-arrow" />
                  </Link>
                );
              })
            ) : (
              <div className="np-empty">
                <div className="np-empty-icon">
                  <Sparkles size={24} />
                </div>
                <p>Start exploring features to see your activity here</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'discover' && (
          <>
            {undiscovered.length > 0 ? (
              undiscovered.map(feat => {
                const Icon = FEATURE_ICONS[feat.id] || LayoutDashboard;
                return (
                  <Link key={feat.id} href={feat.route} className="np-discover-item" onClick={onClose}>
                    <div className="np-discover-icon">
                      <Icon size={16} />
                    </div>
                    <div className="np-discover-text">
                      <span className="np-discover-name">{feat.name}</span>
                      <span className="np-discover-desc">{feat.desc}</span>
                    </div>
                    <span className="np-discover-cta">Explore</span>
                  </Link>
                );
              })
            ) : (
              <div className="np-empty np-empty-done">
                <div className="np-empty-icon done">
                  <CheckCircle size={24} />
                </div>
                <p>You&apos;ve explored everything!</p>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx global>{`
        .np-content {
          display: flex;
          flex-direction: column;
        }

        /* ── Progress Header ── */
        .np-header {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 4px 4px 14px;
        }
        .np-ring {
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          position: relative;
        }
        .np-ring svg {
          transform: rotate(-90deg);
        }
        .np-ring .ring-track {
          stroke: var(--border-color);
          stroke-width: 3;
          fill: none;
        }
        .np-ring .ring-fill {
          stroke: #f97316;
          stroke-width: 3;
          fill: none;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .np-ring-label {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .np-header-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .np-header-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .np-header-sub {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        /* ── Tabs ── */
        .np-tabs {
          display: flex;
          gap: 2px;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 4px;
        }
        .np-tab {
          flex: 1;
          padding: 10px 0;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
          background: none;
          border: none;
          cursor: pointer;
          position: relative;
          transition: color 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .np-tab:hover {
          color: var(--text-secondary);
        }
        .np-tab.active {
          color: var(--text-primary);
        }
        .np-tab.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 20%;
          right: 20%;
          height: 2px;
          background: var(--accent-primary);
          border-radius: 1px;
        }
        .np-tab-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          background: rgba(249, 115, 22, 0.1);
          color: #f97316;
          font-size: 0.68rem;
          font-weight: 700;
          border-radius: 9px;
        }

        /* ── Body ── */
        .np-body {
          padding: 8px 0 0;
          max-height: 380px;
          overflow-y: auto;
          overscroll-behavior: contain;
        }
        .np-body::-webkit-scrollbar {
          width: 4px;
        }
        .np-body::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 2px;
        }

        /* ── Activity Items ── */
        .np-activity-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 8px;
          border-radius: 10px;
          text-decoration: none;
          transition: background 0.12s;
          cursor: pointer;
        }
        .np-activity-item:hover {
          background: var(--bg-primary);
        }
        .np-activity-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: rgba(16, 185, 129, 0.08);
          color: #10b981;
        }
        .np-activity-text {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .np-activity-name {
          font-size: 0.84rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .np-activity-time {
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .np-activity-item .np-activity-arrow {
          color: var(--text-muted);
          opacity: 0;
          transform: translateX(-4px);
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .np-activity-item:hover .np-activity-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        /* ── Discover Items ── */
        .np-discover-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 10px;
          text-decoration: none;
          background: var(--bg-primary);
          border: 1px solid transparent;
          transition: all 0.15s;
          cursor: pointer;
          margin-bottom: 6px;
        }
        .np-discover-item:last-child {
          margin-bottom: 0;
        }
        .np-discover-item:hover {
          border-color: rgba(249, 115, 22, 0.15);
          background: rgba(249, 115, 22, 0.03);
        }
        .np-discover-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: rgba(249, 115, 22, 0.08);
          color: #f97316;
        }
        .np-discover-text {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .np-discover-name {
          font-size: 0.84rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .np-discover-desc {
          font-size: 0.72rem;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .np-discover-cta {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--accent-primary);
          white-space: nowrap;
          flex-shrink: 0;
          padding: 4px 10px;
          background: rgba(249, 115, 22, 0.06);
          border-radius: 6px;
          transition: background 0.15s;
        }
        .np-discover-item:hover .np-discover-cta {
          background: rgba(249, 115, 22, 0.12);
        }

        /* ── Empty States ── */
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
          background: rgba(249, 115, 22, 0.08);
          color: #f97316;
        }
        .np-empty-icon.done {
          background: rgba(16, 185, 129, 0.08);
          color: #10b981;
        }
        .np-empty p {
          color: var(--text-muted);
          font-size: 0.84rem;
          margin: 0;
          line-height: 1.4;
        }

        /* ── Mobile overrides ── */
        @media (max-width: 768px) {
          .np-header {
            padding: 0 0 14px;
          }
          .np-tabs {
            margin-bottom: 2px;
          }
          .np-tab {
            padding: 12px 0;
            font-size: 0.82rem;
          }
          .np-body {
            max-height: none;
            padding: 8px 0 0;
          }
          .np-activity-item,
          .np-discover-item {
            padding: 12px 8px;
          }
          .np-activity-icon,
          .np-discover-icon {
            width: 40px;
            height: 40px;
            border-radius: 12px;
          }
          .np-activity-name,
          .np-discover-name {
            font-size: 0.88rem;
          }
          .np-activity-item .np-activity-arrow {
            opacity: 0.4;
            transform: translateX(0);
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
                <h3>Feature Explorer</h3>
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

  // Desktop: Dropdown
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
          width: 400px;
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
          max-height: 480px;
          overflow-y: auto;
        }
        .np-dropdown-body::-webkit-scrollbar {
          width: 4px;
        }
        .np-dropdown-body::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 2px;
        }
      `}</style>
    </>
  );
}
