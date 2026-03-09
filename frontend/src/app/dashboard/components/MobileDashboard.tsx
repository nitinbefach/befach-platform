'use client';

/**
 * MobileDashboard - Touch-optimized mobile view
 *
 * Features:
 * - Horizontal scroll metrics strip
 * - Quick Actions via centered popup modal
 * - Collapsible chart sections
 * - Card-based data displays
 * - 44px+ touch targets
 * - Safe area support
 *
 * Uses shared components from ./shared/ for consistency with WebDashboard
 */

import { useState } from 'react';
import Link from 'next/link';
import {
  Package, TrendingUp, ChevronRight,
  Zap, BarChart3, Calculator, ArrowRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { useDashboard, timeAgo } from './DashboardContext';
import { captureFeatureAction } from '@/lib/posthogEvents';

// Import shared components
import {
  OrderCard,
  CalculationCard,
  InsightCard,
  RequirementCard,
} from './shared';
import { CalculationSkeleton } from './shared/skeletons';

// ============ MOBILE METRICS STRIP ============

function MobileMetricsStrip() {
  const { metrics } = useDashboard();

  return (
    <div className="metrics-strip">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon;
        return (
          <div key={idx} className="metric-chip">
            <div className="chip-icon-wrapper">
              <Icon size={18} />
            </div>
            <div className="chip-content">
              <span className="chip-value">{metric.value}</span>
              <span className="chip-label">{metric.label}</span>
            </div>
            <span className={`chip-trend ${metric.trendUp ? 'up' : 'down'}`}>
              {metric.trend}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ============ MOBILE QUICK ACTIONS ============

function MobileQuickActions() {
  const [isOpen, setIsOpen] = useState(false);
  const { quickActions } = useDashboard();

  return (
    <>
      <button
        className="quick-actions-trigger"
        onClick={() => setIsOpen(true)}
      >
        <Zap size={20} />
        <span>Quick Actions</span>
        <ChevronRight size={18} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="qa-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="qa-backdrop" onClick={() => setIsOpen(false)} />
            <motion.div
              className="qa-modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            >
              <div className="qa-modal-header">
                <div className="qa-modal-title">
                  <Zap size={18} />
                  <h3>Quick Actions</h3>
                </div>
                <button className="qa-close-btn" onClick={() => setIsOpen(false)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="actions-grid">
                {quickActions.map((action, idx) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={idx}
                      href={action.href}
                      className="action-card"
                      onClick={() => { captureFeatureAction('dashboard', 'engaged', { action: action.title }); setIsOpen(false); }}
                    >
                      <div
                        className="action-icon"
                        style={{ backgroundColor: `${action.color}15` }}
                      >
                        <Icon size={22} style={{ color: action.color }} />
                      </div>
                      <span className="action-title">{action.title}</span>
                      <span className="action-count">{action.count}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ============ CHART SUMMARY STATS ============

function ChartSummaryStats() {
  return (
    <div className="chart-summary-stats">
      <div className="summary-stat">
        <span className="stat-label">Total Revenue</span>
        <span className="stat-value">$258K</span>
      </div>
      <div className="summary-stat">
        <span className="stat-label">Total Savings</span>
        <span className="stat-value highlight">$31K</span>
      </div>
      <div className="summary-stat">
        <span className="stat-label">Avg Monthly</span>
        <span className="stat-value">$43K</span>
      </div>
    </div>
  );
}

// ============ MAIN MOBILE DASHBOARD ============

export default function MobileDashboard() {
  const {
    organization,
    activeOrders,
    requirements,
    recentCalculations,
    marketInsights,
    calculationsLoading,
  } = useDashboard();
  return (
    <AppLayout searchPlaceholder="Search...">
      <div className="mobile-dashboard">
        {/* Compact Welcome */}
        <div className="mobile-welcome">
          <div className="welcome-text">
            <h1>Hi, {organization?.name || 'there'}! <span className="wave"></span></h1>
          </div>
        </div>

        {/* Horizontal Scroll Metrics */}
        <div id="dashboard-metrics">
          <MobileMetricsStrip />
        </div>

        {/* Quick Actions Button */}
        <div id="dashboard-quick-actions">
          <MobileQuickActions />
        </div>

        {/* Analytics Section */}
        <section id="dashboard-charts" className="analytics-section">
          <h2 className="section-title-text">
            <BarChart3 size={20} />
            Analytics
          </h2>
          <ChartSummaryStats />
        </section>

        {/* Active Orders - Using shared OrderCard */}
        <section id="dashboard-orders" className="mobile-section">
          <div className="section-header-row">
            <h2 className="section-title-text">
              <Package size={20} />
              Active Orders
              <span className="count-badge">{activeOrders.length}</span>
            </h2>
            <Link href="/my-orders" className="view-all-link">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="orders-stack">
            {activeOrders.length > 0 ? (
              activeOrders.map(order => (
                <OrderCard key={order.id} order={order} variant="card" />
              ))
            ) : (
              <div className="empty-state">
                <Package size={32} />
                <p>No active orders</p>
              </div>
            )}
          </div>
        </section>

        {/* Recent Calculations - Using shared CalculationCard */}
        <section className="mobile-section">
          <div className="section-header-row">
            <h2 className="section-title-text">
              <Calculator size={20} />
              Recent Calculations
            </h2>
            <Link href="/cost-calculator" className="view-all-link">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          {calculationsLoading ? (
            <CalculationSkeleton variant="mobile" count={3} />
          ) : recentCalculations.length > 0 ? (
            <div className="calcs-stack">
              {recentCalculations.slice(0, 3).map(calc => (
                <CalculationCard key={calc.id} calculation={calc} variant="mobile" />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Calculator size={32} />
              <p>No calculations yet</p>
              <Link href="/cost-calculator" className="empty-cta">
                Create First Calculation
              </Link>
            </div>
          )}
        </section>

        {/* Sourcing Requests - Using shared RequirementCard */}
        <section className="mobile-section">
          <div className="section-header-row">
            <h2 className="section-title-text">
              <TrendingUp size={20} />
              Sourcing Requests
            </h2>
            <Link href="/submit-requirement" className="add-new-link">
              + New
            </Link>
          </div>
          <div className="reqs-stack">
            {requirements.length > 0 ? (
              requirements.slice(0, 4).map(req => (
                <RequirementCard key={req.id} requirement={req} variant="card" />
              ))
            ) : (
              <div className="empty-state">
                <TrendingUp size={32} />
                <p>No sourcing requests</p>
                <Link href="/submit-requirement" className="empty-cta">
                  Submit Requirement
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Market Insights - Using shared InsightCard */}
        <section id="dashboard-insights" className="mobile-section">
          <h2 className="section-title-text standalone">
            <Sparkles size={20} />
            Market Insights
          </h2>
          <div className="insights-scroll">
            {marketInsights.slice(0, 2).map((insight, idx) => (
              <InsightCard key={idx} insight={insight} variant="chip" />
            ))}
          </div>
        </section>
      </div>

      <style jsx global>{`
        /* ============ MOBILE DASHBOARD BASE ============ */
        .mobile-dashboard {
          padding: 16px;
          padding-bottom: calc(80px + env(safe-area-inset-bottom));
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 100%;
          overflow-x: hidden;
        }

        /* ============ WELCOME SECTION ============ */
        .mobile-welcome {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0;
        }

        .welcome-text h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .wave {
          display: inline-block;
          animation: wave 1.5s ease-in-out infinite;
          transform-origin: 70% 70%;
        }

        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-10deg); }
        }

        .welcome-text p {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 4px 0 0 0;
        }

        /* ============ METRICS STRIP ============ */
        .metrics-strip {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          gap: 12px;
          padding: 4px 0;
          margin: 0 -16px;
          padding-left: 16px;
          padding-right: 16px;
          -webkit-overflow-scrolling: touch;
        }

        .metrics-strip::-webkit-scrollbar {
          display: none;
        }

        .metric-chip {
          min-width: 150px;
          scroll-snap-align: start;
          flex-shrink: 0;
          padding: 14px 16px;
          background: var(--bg-secondary);
          border-radius: 14px;
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .chip-icon-wrapper {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #f97316, #fb923c);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .chip-content {
          display: flex;
          flex-direction: column;
        }

        .chip-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .chip-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .chip-trend {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 6px;
          width: fit-content;
        }

        .chip-trend.up {
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
        }

        .chip-trend.down {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        /* ============ QUICK ACTIONS TRIGGER ============ */
        .quick-actions-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 14px 16px;
          background: linear-gradient(135deg, #f97316, #fb923c);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          min-height: 48px;
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.25);
        }

        .quick-actions-trigger span {
          flex: 1;
          text-align: left;
          margin-left: 12px;
        }

        /* ============ QUICK ACTIONS MODAL ============ */
        .qa-overlay {
          position: fixed;
          inset: 0;
          z-index: 1100;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .qa-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
        }

        .qa-modal {
          position: relative;
          width: calc(100% - 40px);
          max-width: 360px;
          background: var(--bg-secondary);
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.18);
        }

        .qa-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .qa-modal-title {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #f97316;
        }

        .qa-modal-title h3 {
          margin: 0;
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .qa-close-btn {
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

        /* ============ ACTIONS GRID ============ */
        .actions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .action-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 16px;
          background: var(--bg-tertiary);
          border-radius: 14px;
          text-decoration: none;
          gap: 10px;
          min-height: 110px;
        }

        .action-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          text-align: center;
        }

        .action-count {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        /* ============ ANALYTICS SECTION ============ */
        .analytics-section {
          background: var(--bg-secondary);
          border-radius: 14px;
          border: 1px solid var(--border-color);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* ============ CHART SUMMARY STATS ============ */
        .chart-summary-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .summary-stat {
          text-align: center;
          padding: 12px 8px;
          background: var(--bg-tertiary);
          border-radius: 10px;
        }

        .stat-label {
          display: block;
          font-size: 0.7rem;
          color: var(--text-secondary);
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-value.highlight {
          color: #10b981;
        }

        .chart-note {
          font-size: 0.75rem;
          color: var(--text-secondary);
          text-align: center;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--border-color);
        }

        /* ============ MOBILE SECTIONS ============ */
        .mobile-section {
          background: var(--bg-secondary);
          border-radius: 14px;
          border: 1px solid var(--border-color);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .section-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 4px;
        }

        .section-title-text {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .section-title-text.standalone {
          margin-bottom: 4px;
        }

        .section-title-text svg {
          color: #f97316;
        }

        .count-badge {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 2px 8px;
          background: rgba(249, 115, 22, 0.1);
          color: #f97316;
          border-radius: 10px;
        }

        .view-all-link,
        .add-new-link {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #f97316;
          text-decoration: none;
        }

        .add-new-link {
          padding: 6px 12px;
          background: rgba(249, 115, 22, 0.1);
          border-radius: 8px;
        }

        /* ============ CARDS STACK ============ */
        .orders-stack,
        .calcs-stack,
        .reqs-stack {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        /* Remove double borders on inner cards within section containers */
        .mobile-section .orders-stack :global(.mobile-order-card),
        .mobile-section .calcs-stack :global(.mobile-calc-card),
        .mobile-section .reqs-stack :global(.mobile-req-card) {
          border: none;
          background: var(--bg-primary);
          border-radius: 10px;
        }

        /* ============ INSIGHTS SCROLL ============ */
        .insights-scroll {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          gap: 12px;
          padding: 4px 0;
          margin: 0 -16px;
          padding-left: 16px;
          padding-right: 16px;
          -webkit-overflow-scrolling: touch;
        }

        .insights-scroll::-webkit-scrollbar {
          display: none;
        }

        /* ============ EMPTY STATES ============ */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px 16px;
          background: var(--bg-secondary);
          border-radius: 14px;
          border: 1px dashed var(--border-color);
          gap: 8px;
        }

        .empty-state svg {
          color: var(--text-tertiary);
        }

        .empty-state p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin: 0;
        }

        .empty-cta {
          margin-top: 8px;
          padding: 10px 20px;
          background: #f97316;
          color: white;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
        }
      `}</style>
    </AppLayout>
  );
}
