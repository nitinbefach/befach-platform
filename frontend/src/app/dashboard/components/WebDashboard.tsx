'use client';

/**
 * WebDashboard - Desktop-optimized dashboard view
 *
 * Features:
 * - 4-column metrics grid with hover animations
 * - Full chart visibility (Area, Bar, Pie, Radar)
 * - 6-column data table for requirements
 * - 2-column orders + activity section
 * - Staggered entry animations
 * - Custom chart tooltips
 *
 * Uses shared components from ./shared/ for consistency with MobileDashboard
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout';
import { GuidedTour } from '@/components/onboarding';
import { usePrefersReducedMotion } from '@/hooks/useMobile';
import { Package, ArrowRight, Star, Activity } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart,
  Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, Legend, TooltipProps
} from 'recharts';

// Import shared components
import {
  OrderCard,
  CalculationCard,
  InsightCard,
  RequirementCard,
  ActivityItem,
} from './shared';
import { CalculationSkeleton } from './shared/skeletons';

import {
  useDashboard,
  orderData,
  savingsData,
  supplierPerformance,
  shipmentStatus,
  costComparison,
  topSuppliers,
  COLORS,
} from './DashboardContext';

// ============ SKELETON COMPONENTS ============

function MetricSkeleton() {
  return (
    <div className="metric-card skeleton-card">
      <div className="metric-header">
        <div className="skeleton-icon-wrapper" />
        <div className="skeleton-badge" />
      </div>
      <div className="skeleton-text skeleton-xl" />
      <div className="skeleton-text skeleton-md" />
      <div className="skeleton-text skeleton-sm" />
    </div>
  );
}

// ============ CUSTOM TOOLTIP COMPONENTS ============

function CustomChartTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="custom-tooltip">
      <p className="tooltip-label">{label}</p>
      <div className="tooltip-items">
        {payload.map((entry: any, idx: number) => (
          <div key={idx} className="tooltip-item">
            <span
              className="tooltip-dot"
              style={{ backgroundColor: entry.color }}
            />
            <span className="tooltip-name">{entry.name}:</span>
            <span className="tooltip-value">
              {typeof entry.value === 'number'
                ? entry.value >= 1000
                  ? `$${(entry.value / 1000).toFixed(1)}K`
                  : `$${entry.value.toLocaleString()}`
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomPieTooltip({ active, payload }: any) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0];
  return (
    <div className="custom-tooltip">
      <p className="tooltip-label">{data.name}</p>
      <div className="tooltip-item">
        <span className="tooltip-name">Count:</span>
        <span className="tooltip-value">{data.value}</span>
      </div>
    </div>
  );
}

export default function WebDashboard() {
  const {
    organization,
    metrics,
    detailedMetrics,
    quickActions,
    requirements,
    recentCalculations,
    activeOrders,
    recentActivity,
    marketInsights,
    calculationsLoading,
    showTour,
    handleCompleteTour,
  } = useDashboard();

  const prefersReducedMotion = usePrefersReducedMotion();

  // Animation variants - enhanced for smooth, professional feel
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] as [number, number, number, number]
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number]
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number]
      }
    }
  };

  return (
    <AppLayout searchPlaceholder="Search dashboard, orders, suppliers...">
      {/* Guided Tour */}
      {showTour && (
        <GuidedTour onComplete={handleCompleteTour} />
      )}

      <div className="dashboard-container">
        {/* Welcome & Actions Bar */}
        <motion.div
          className="welcome-section"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="welcome-content">
            <h1 className="welcome-title">Welcome back, {organization?.name || 'there'}!</h1>
          </div>
          <div className="quick-actions-bar">
            {quickActions.map((action, idx) => (
              <motion.div
                key={idx}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                style={{ display: 'contents' }}
              >
                <Link href={action.href} className="quick-action-button">
                  <div className="action-icon-wrapper" style={{ backgroundColor: `${action.color}15` }}>
                    <action.icon className="action-icon" style={{ color: action.color }} />
                  </div>
                  <div className="action-content">
                    <div className="action-title">{action.title}</div>
                    <div className="action-count">{action.count}</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Primary Metrics Grid */}
        <motion.div
          className="metrics-grid"
          variants={prefersReducedMotion ? undefined : containerVariants}
          initial="hidden"
          animate="visible"
        >
          {metrics.map((metric, idx) => (
            <motion.div
              key={idx}
              className="metric-card"
              variants={prefersReducedMotion ? undefined : itemVariants}
              whileHover={prefersReducedMotion ? {} : { scale: 1.02, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="metric-header">
                <div className="metric-icon-wrapper">
                  <metric.icon className="metric-icon" />
                </div>
                <span className={`metric-trend ${metric.trendUp ? 'trend-up' : 'trend-down'}`}>
                  <Activity className="trend-icon" />
                  {metric.trend}
                </span>
              </div>
              <div className="metric-value">{metric.value}</div>
              <div className="metric-label">{metric.label}</div>
              <div className="metric-subvalue">{metric.subValue}</div>
              <div className="metric-change">{metric.change}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Secondary Metrics */}
        <motion.div
          className="secondary-metrics"
          variants={prefersReducedMotion ? undefined : containerVariants}
          initial="hidden"
          animate="visible"
        >
          {detailedMetrics.map((metric, idx) => (
            <motion.div
              key={idx}
              className="secondary-metric-card"
              variants={prefersReducedMotion ? undefined : itemVariants}
              whileHover={prefersReducedMotion ? {} : { scale: 1.03 }}
            >
              <div className={`secondary-metric-icon ${metric.bg}`}>
                <metric.icon className={`${metric.color}`} />
              </div>
              <div className="secondary-metric-content">
                <div className="secondary-metric-value">{metric.value}</div>
                <div className="secondary-metric-label">{metric.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Section - First Row */}
        <motion.div
          className="charts-row"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Revenue & Savings Trend */}
          <div className="chart-card chart-large">
            <div className="chart-header">
              <div className="chart-title-section">
                <h3 className="chart-title">Revenue & Savings</h3>
              </div>
              <select className="chart-select">
                <option>Last 6 months</option>
                <option>Last year</option>
                <option>All time</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={orderData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(value) => `$${value/1000}K`} />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue ($)" />
                <Area type="monotone" dataKey="savings" stroke="#10b981" fillOpacity={1} fill="url(#colorSavings)" name="Savings ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Shipment Status */}
          <div className="chart-card">
            <h3 className="chart-title">Shipment Status</h3>
            <div className="shipment-legend">
              {shipmentStatus.map((item, idx) => (
                <div key={idx} className="legend-item">
                  <div className="legend-dot" style={{ backgroundColor: item.color }}></div>
                  <span className="legend-label">{item.status}</span>
                  <span className="legend-value">{item.count}</span>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={shipmentStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {shipmentStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Charts Section - Second Row */}
        <motion.div
          className="charts-row"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Market Price Comparison */}
          <div className="chart-card chart-large">
            <div className="chart-header">
              <div className="chart-title-section">
                <h3 className="chart-title">Cost vs Market Price</h3>
              </div>
              <div className="savings-badge">Saving 12% on average</div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={costComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(value) => `$${value/1000}K`} />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="market" fill="#94a3b8" name="Market Price" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" fill="#f97316" name="Your Price" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Supplier Performance Radar */}
          <div className="chart-card">
            <h3 className="chart-title">Supplier Performance</h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={supplierPerformance}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar name="Performance" dataKey="A" stroke="#f97316" strokeWidth={2} fill="#f97316" fillOpacity={0.4} />
                <Tooltip content={<CustomPieTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Distribution & Top Suppliers */}
        <motion.div
          className="charts-row"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {/* Category Distribution */}
          <div className="chart-card">
            <h3 className="chart-title">Category Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={savingsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {savingsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="category-grid">
              {savingsData.map((item, idx) => (
                <div key={idx} className="category-item">
                  <div className="category-name">
                    <div className="category-dot" style={{ backgroundColor: COLORS[idx] }}></div>
                    <span>{item.name}</span>
                  </div>
                  <span className="category-value">${(item.savings / 1000).toFixed(1)}K</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Suppliers */}
          <div className="chart-card chart-large">
            <div className="chart-header">
              <div className="chart-title-section">
                <h3 className="chart-title">Top Suppliers</h3>
              </div>
              <Link href="/suppliers" className="view-all-link">View All</Link>
            </div>
            <div className="suppliers-list">
              {topSuppliers.map((supplier, idx) => (
                <div key={idx} className="supplier-item">
                  <div className="supplier-rank">{idx + 1}</div>
                  <div className="supplier-info">
                    <div className="supplier-name">
                      {supplier.name}
                      <span className="supplier-country"> • {supplier.country}</span>
                    </div>
                    <div className="supplier-orders">{supplier.orders} orders completed</div>
                  </div>
                  <div className="supplier-metrics">
                    <div className="supplier-value-section">
                      <div className="supplier-value">{supplier.value}</div>
                      <div className="supplier-value-label">Total value</div>
                    </div>
                    <div className="supplier-rating">
                      <Star className="rating-star" />
                      <span>{supplier.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Cost Calculations - Using shared CalculationCard */}
        <motion.div
          className="calculations-section"
          variants={prefersReducedMotion ? undefined : sectionVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
        >
          <div className="section-header">
            <h2 className="section-title">Recent Cost Calculations</h2>
            <Link href="/cost-calculator" className="section-link">
              View All <ArrowRight className="link-arrow" />
            </Link>
          </div>

          {calculationsLoading ? (
            <CalculationSkeleton variant="web" count={4} />
          ) : recentCalculations.length > 0 ? (
            <div className="calculations-grid">
              {recentCalculations.slice(0, 4).map((calc) => (
                <CalculationCard key={calc.id} calculation={calc} variant="web" />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Package className="empty-icon" />
              <p>No calculations yet. Start calculating your landed costs!</p>
              <Link href="/cost-calculator" className="empty-cta">
                Calculate Now <ArrowRight className="cta-arrow" />
              </Link>
            </div>
          )}
        </motion.div>

        {/* Sourcing Requirements Table - Using shared RequirementCard for rows */}
        <motion.div
          className="requirements-section"
          variants={prefersReducedMotion ? undefined : sectionVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
        >
          <div className="section-header">
            <h2 className="section-title">Your Sourcing Requests</h2>
            <Link href="/share-requirement" className="section-link">
              + New Request
            </Link>
          </div>

          {requirements.length > 0 ? (
            <div className="requirements-table">
              <div className="table-header">
                <div className="th-cell">Product / Item</div>
                <div className="th-cell">Quantity</div>
                <div className="th-cell">Target Price</div>
                <div className="th-cell">Status</div>
                <div className="th-cell">Submitted</div>
                <div className="th-cell">Action</div>
              </div>
              {requirements.map((req) => (
                <RequirementCard key={req.id} requirement={req} variant="table-row" />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Package className="empty-icon" />
              <p>No sourcing requirements yet. Start by sharing your first requirement!</p>
              <Link href="/share-requirement" className="empty-cta">
                Share Requirement <ArrowRight className="cta-arrow" />
              </Link>
            </div>
          )}
        </motion.div>

        {/* Active Orders & Recent Activity - Using shared components */}
        <div className="two-column-section">
          <div className="orders-section">
            <h3 className="subsection-title">Active Orders</h3>
            <div className="orders-list">
              {activeOrders.map((order) => (
                <OrderCard key={order.id} order={order} variant="row" href="/track-shipment" />
              ))}
            </div>
          </div>

          <div className="activity-section">
            <h3 className="subsection-title">Recent Activity</h3>
            <div className="activity-list">
              {recentActivity.map((activity, idx) => (
                <ActivityItem key={idx} activity={activity} />
              ))}
            </div>
          </div>
        </div>

        {/* Market Insights Preview - Using shared InsightCard */}
        <div className="insights-section">
          <div className="section-header">
            <h2 className="section-title">Market Insights</h2>
            <Link href="/market-insights" className="section-link">
              View All <ArrowRight className="link-arrow" />
            </Link>
          </div>
          <div className="insights-grid">
            {marketInsights.map((insight, idx) => (
              <InsightCard key={idx} insight={insight} variant="card" />
            ))}
          </div>
        </div>

        <style jsx global>{`
          .dashboard-container {
            padding: 2rem;
            max-width: 1800px;
            margin: 0 auto;
          }

          .welcome-section {
            display: flex !important;
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: center !important;
            margin-bottom: 2rem;
            flex-wrap: wrap;
            gap: 1.5rem;
          }

          .welcome-content {
            flex: 1;
            min-width: 280px;
          }

          .welcome-title {
            font-size: 1.875rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: #1e293b;
            background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .welcome-subtitle {
            color: #64748b;
            font-size: 0.95rem;
          }

          .quick-actions-bar {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: wrap;
            gap: 0.75rem;
          }

          .quick-action-button {
            display: flex !important;
            flex-direction: row !important;
            align-items: center;
            gap: 0.875rem;
            padding: 0.875rem 1.25rem;
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            text-decoration: none;
            color: #1e293b;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            min-width: 180px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          }

          .quick-action-button:hover {
            box-shadow: 0 8px 25px rgba(0,0,0,0.12);
            transform: translateY(-3px);
            border-color: #cbd5e1;
            background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
          }

          .action-icon-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 42px;
            height: 42px;
            border-radius: 10px;
            flex-shrink: 0;
          }

          .action-icon {
            width: 20px;
            height: 20px;
          }

          .action-content {
            text-align: left;
          }

          .action-title {
            font-size: 0.875rem;
            font-weight: 600;
            margin-bottom: 0.2rem;
            color: #1e293b;
          }

          .action-count {
            font-size: 0.75rem;
            color: #64748b;
            font-weight: 500;
          }

          .metrics-grid {
            display: grid !important;
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 1.5rem;
            margin-bottom: 2rem;
          }

          .metric-card {
            background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
            padding: 1.5rem;
            border-radius: 16px;
            border: 1px solid #e2e8f0;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          }

          .metric-card:hover {
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transform: translateY(-4px);
            border-color: #cbd5e1;
          }

          .metric-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
          }

          .metric-icon-wrapper {
            width: 3.25rem;
            height: 3.25rem;
            background: linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(249, 115, 22, 0.08) 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .metric-icon {
            width: 1.5rem;
            height: 1.5rem;
            color: #f97316;
          }

          .metric-trend {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            padding: 0.3rem 0.6rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
          }

          .trend-up {
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%);
            color: #059669;
          }

          .trend-down {
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.08) 100%);
            color: #dc2626;
          }

          .trend-icon {
            width: 0.75rem;
            height: 0.75rem;
          }

          .metric-value {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 0.25rem;
            color: #0f172a;
            letter-spacing: -0.02em;
          }

          .metric-label {
            font-size: 0.9rem;
            font-weight: 500;
            color: #334155;
            margin-bottom: 0.375rem;
          }

          .metric-subvalue {
            font-size: 0.8rem;
            color: #64748b;
          }

          .metric-change {
            font-size: 0.75rem;
            color: #94a3b8;
            margin-top: 0.25rem;
          }

          .secondary-metrics {
            display: grid !important;
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 1.5rem;
            margin-bottom: 2rem;
          }

          .secondary-metric-card {
            background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
            padding: 1.25rem;
            border-radius: 14px;
            border: 1px solid #e2e8f0;
            display: flex !important;
            flex-direction: row !important;
            align-items: center;
            gap: 1rem;
            transition: all 0.2s ease;
            box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          }

          .secondary-metric-card:hover {
            box-shadow: 0 6px 20px rgba(0,0,0,0.08);
            transform: translateY(-2px);
          }

          .secondary-metric-icon {
            width: 3rem;
            height: 3rem;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .secondary-metric-icon svg {
            width: 1.5rem;
            height: 1.5rem;
          }

          .secondary-metric-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: #0f172a;
          }

          .secondary-metric-label {
            font-size: 0.85rem;
            color: #64748b;
          }

          .charts-row {
            display: grid !important;
            grid-template-columns: 2fr 1fr !important;
            gap: 1.5rem;
            margin-bottom: 2rem;
          }

          .charts-row:nth-of-type(3) {
            grid-template-columns: 1fr 2fr !important;
          }

          .chart-card {
            background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
            padding: 1.5rem;
            border-radius: 16px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.04);
            transition: all 0.2s ease;
          }

          .chart-card:hover {
            box-shadow: 0 6px 20px rgba(0,0,0,0.08);
          }

          .chart-large {
            grid-column: span 1;
          }

          .chart-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1.5rem;
          }

          .chart-title {
            font-size: 1.125rem;
            font-weight: 600;
            color: #0f172a;
            margin-bottom: 0.25rem;
          }

          .chart-subtitle {
            font-size: 0.875rem;
            color: #64748b;
            margin-bottom: 1.5rem;
          }

          .chart-select {
            padding: 0.5rem 0.75rem;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 0.875rem;
            color: #334155;
            background: #f8fafc;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .chart-select:hover {
            border-color: #cbd5e1;
            background: #f1f5f9;
          }

          .savings-badge {
            padding: 0.4rem 0.875rem;
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%);
            color: #059669;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
          }

          .shipment-legend {
            margin-bottom: 1.5rem;
          }

          .legend-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1rem;
          }

          .legend-dot {
            width: 0.75rem;
            height: 0.75rem;
            border-radius: 50%;
            margin-right: 0.75rem;
          }

          .legend-label {
            flex: 1;
            font-size: 0.875rem;
            color: var(--text-secondary);
          }

          .legend-value {
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--text-primary);
          }

          .category-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
            margin-top: 1rem;
          }

          .category-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem;
            background: var(--bg-secondary);
            border-radius: 0.5rem;
          }

          .category-name {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.75rem;
            color: var(--text-secondary);
          }

          .category-dot {
            width: 0.75rem;
            height: 0.75rem;
            border-radius: 50%;
          }

          .category-value {
            font-size: 0.75rem;
            font-weight: 500;
            color: var(--text-primary);
          }

          .view-all-link {
            color: #f97316;
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 500;
            padding: 0.5rem 1rem;
            background: rgba(249, 115, 22, 0.08);
            border-radius: 8px;
            transition: all 0.2s ease;
          }

          .view-all-link:hover {
            background: rgba(249, 115, 22, 0.15);
            color: #ea580c;
          }

          .suppliers-list {
            display: flex;
            flex-direction: column;
            gap: 0.875rem;
          }

          .supplier-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1.125rem;
            background: #f8fafc;
            border-radius: 12px;
            transition: all 0.2s ease;
            border: 1px solid #f1f5f9;
          }

          .supplier-item:hover {
            background: #f1f5f9;
            border-color: #e2e8f0;
            transform: translateX(4px);
          }

          .supplier-rank {
            width: 2.5rem;
            height: 2.5rem;
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            color: white;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 1rem;
            box-shadow: 0 2px 8px rgba(249, 115, 22, 0.25);
          }

          .supplier-info {
            flex: 1;
          }

          .supplier-name {
            font-weight: 600;
            color: #0f172a;
            margin-bottom: 0.25rem;
          }

          .supplier-country {
            font-size: 0.75rem;
            color: #64748b;
          }

          .supplier-orders {
            font-size: 0.75rem;
            color: #64748b;
          }

          .supplier-metrics {
            display: flex;
            align-items: center;
            gap: 1.5rem;
          }

          .supplier-value-section {
            text-align: right;
          }

          .supplier-value {
            font-size: 0.95rem;
            font-weight: 700;
            color: #0f172a;
          }

          .supplier-value-label {
            font-size: 0.7rem;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.03em;
          }

          .supplier-rating {
            display: flex;
            align-items: center;
            gap: 0.375rem;
            padding: 0.4rem 0.875rem;
            background: linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0.08) 100%);
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.875rem;
            color: #b45309;
          }

          .rating-star {
            width: 1rem;
            height: 1rem;
            color: #fbbf24;
            fill: #fbbf24;
          }

          .calculations-section,
          .requirements-section,
          .insights-section {
            margin-bottom: 2rem;
          }

          .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
          }

          .section-title {
            font-size: 1.25rem;
            font-weight: 700;
            color: #0f172a;
          }

          .section-link {
            color: #f97316;
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 0.375rem;
            padding: 0.5rem 1rem;
            background: rgba(249, 115, 22, 0.08);
            border-radius: 8px;
            transition: all 0.2s ease;
          }

          .section-link:hover {
            background: rgba(249, 115, 22, 0.15);
            color: #ea580c;
          }

          .link-arrow {
            width: 1rem;
            height: 1rem;
          }

          .requirements-table {
            background: #ffffff;
            border-radius: 16px;
            border: 1px solid #e2e8f0;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          }

          .table-header {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
            padding: 1rem 1.5rem;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-bottom: 1px solid #e2e8f0;
          }

          .th-cell {
            font-size: 0.8rem;
            font-weight: 600;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.03em;
          }

          .empty-state {
            padding: 3.5rem 2rem;
            text-align: center;
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            border-radius: 16px;
            border: 2px dashed #e2e8f0;
          }

          .empty-icon {
            width: 4rem;
            height: 4rem;
            margin: 0 auto 1.25rem;
            color: #cbd5e1;
          }

          .empty-state p {
            color: #64748b;
            margin-bottom: 1.5rem;
            font-size: 0.95rem;
            line-height: 1.5;
          }

          .empty-cta {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.875rem 1.75rem;
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            color: white;
            border-radius: 10px;
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 600;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
          }

          .empty-cta:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4);
          }

          .cta-arrow {
            width: 1rem;
            height: 1rem;
          }

          .orders-section,
          .activity-section {
            background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
            padding: 1.5rem;
            border-radius: 16px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          }

          .subsection-title {
            font-size: 1.125rem;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 1.25rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .orders-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .activity-list {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .two-column-section {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 1.5rem;
            margin-bottom: 2rem;
          }

          .calculations-grid {
            display: grid !important;
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 1rem;
          }

          .insights-grid {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 1rem;
          }

          @media (max-width: 1400px) {
            .metrics-grid {
              grid-template-columns: repeat(4, 1fr) !important;
            }

            .quick-actions-bar {
              gap: 0.5rem;
            }

            .quick-action-button {
              min-width: 160px;
              padding: 0.75rem 1rem;
            }
          }

          @media (max-width: 1200px) {
            .metrics-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }

            .secondary-metrics {
              grid-template-columns: repeat(2, 1fr) !important;
            }

            .charts-row {
              grid-template-columns: 1fr !important;
            }

            .charts-row:nth-of-type(3) {
              grid-template-columns: 1fr !important;
            }

            .calculations-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }

            .insights-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }

            .table-header {
              grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)) !important;
            }
          }

          @media (max-width: 900px) {
            .two-column-section {
              grid-template-columns: 1fr !important;
            }

            .calculations-grid {
              grid-template-columns: 1fr !important;
            }

            .quick-actions-bar {
              display: grid !important;
              grid-template-columns: repeat(2, 1fr) !important;
              width: 100%;
            }

            .quick-action-button {
              min-width: auto;
              width: 100%;
            }
          }

          @media (max-width: 768px) {
            .dashboard-container {
              padding: 1rem;
            }

            .welcome-section {
              flex-direction: column !important;
              gap: 1.25rem;
              align-items: stretch !important;
            }

            .welcome-content {
              text-align: center;
            }

            .welcome-title {
              font-size: 1.5rem;
            }

            .quick-actions-bar {
              display: grid !important;
              grid-template-columns: repeat(2, 1fr) !important;
              width: 100%;
            }

            .quick-action-button {
              min-width: auto;
              width: 100%;
              padding: 0.75rem;
              justify-content: flex-start;
            }

            .metrics-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 0.875rem;
            }

            .secondary-metrics {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 0.875rem;
            }

            .insights-grid {
              grid-template-columns: 1fr !important;
            }

            .metric-card {
              padding: 1.25rem;
            }

            .metric-value {
              font-size: 1.5rem;
            }

            .secondary-metric-card {
              padding: 1rem;
            }

            .secondary-metric-value {
              font-size: 1.25rem;
            }
          }

          @media (max-width: 480px) {
            .dashboard-container {
              padding: 0.75rem;
            }

            .metrics-grid {
              grid-template-columns: 1fr !important;
            }

            .secondary-metrics {
              grid-template-columns: 1fr !important;
            }

            .quick-actions-bar {
              grid-template-columns: 1fr !important;
            }

            .metric-card {
              padding: 1rem;
            }

            .chart-card {
              padding: 1rem;
            }
          }

          /* ============ SKELETON LOADING STYLES ============ */

          .skeleton-card {
            position: relative;
            overflow: hidden;
          }

          .skeleton-card::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
              90deg,
              transparent 0%,
              rgba(255, 255, 255, 0.4) 50%,
              transparent 100%
            );
            animation: shimmer 1.5s infinite;
          }

          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }

          .skeleton-icon-wrapper {
            width: 3.25rem;
            height: 3.25rem;
            border-radius: 12px;
            background: linear-gradient(135deg, #e2e8f0 0%, #f1f5f9 100%);
          }

          .skeleton-badge {
            width: 3rem;
            height: 1.5rem;
            border-radius: 20px;
            background: linear-gradient(135deg, #e2e8f0 0%, #f1f5f9 100%);
          }

          .skeleton-text {
            border-radius: 4px;
            background: linear-gradient(135deg, #e2e8f0 0%, #f1f5f9 100%);
            margin-bottom: 0.5rem;
          }

          .skeleton-xl {
            height: 2rem;
            width: 60%;
          }

          .skeleton-lg {
            height: 1.25rem;
            width: 80%;
          }

          .skeleton-md {
            height: 1rem;
            width: 70%;
          }

          .skeleton-sm {
            height: 0.75rem;
            width: 50%;
          }

          /* ============ CUSTOM TOOLTIP STYLES ============ */

          .custom-tooltip {
            background: white;
            padding: 12px 16px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            border: 1px solid #e2e8f0;
            min-width: 140px;
          }

          .tooltip-label {
            font-weight: 600;
            font-size: 0.875rem;
            color: #0f172a;
            margin-bottom: 8px;
            padding-bottom: 6px;
            border-bottom: 1px solid #f1f5f9;
          }

          .tooltip-items {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .tooltip-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.8rem;
          }

          .tooltip-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            flex-shrink: 0;
          }

          .tooltip-name {
            color: #64748b;
          }

          .tooltip-value {
            font-weight: 600;
            color: #0f172a;
            margin-left: auto;
          }

          /* ============ CHART ENHANCEMENTS ============ */

          .recharts-legend-wrapper {
            padding-top: 12px !important;
          }

          .recharts-legend-item {
            margin-right: 16px !important;
          }

          .recharts-legend-item-text {
            font-size: 0.8rem !important;
            color: #64748b !important;
          }

          .recharts-cartesian-axis-tick-value {
            font-size: 0.75rem;
            fill: #64748b;
          }
        `}</style>
      </div>
    </AppLayout>
  );
}
