'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AppLayout } from '@/components/layout';
import { useUser } from '@/context/UserModeContext';
import { GuidedTour } from '@/components/onboarding';
import calculatorService from '@/services/calculatorService';
import { CalculationRecord } from '@/types/calculator';
import {
  Search, Bell, User, Package, TrendingUp, Users, Brain, ArrowRight,
  Star, FileText, BarChart3, Activity, ShoppingCart, DollarSign,
  Globe, Clock, Target, AlertCircle, CheckCircle, TrendingDown,
  Calendar, Filter, Download, Ship, Shield, Receipt, Truck, Eye, Copy, Trash2
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart,
  Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, Legend
} from 'recharts';

interface SubmittedRequirement {
  id: string;
  productDescription: string;
  quantity: string;
  unit: string;
  targetPrice: string;
  additionalDetails: string;
  status: 'Pending' | 'In Review' | 'Sourcing' | 'Completed';
  submittedAt: string;
}

// Chart color constants
const COLORS = ['#f97316', '#8b5cf6', '#10b981', '#3b82f6'];

// Mock data for charts - TODO: Replace with API calls
const orderData = [
  { month: 'Jan', orders: 12, revenue: 24500, savings: 2940 },
  { month: 'Feb', orders: 19, revenue: 38200, savings: 4584 },
  { month: 'Mar', orders: 15, revenue: 31500, savings: 3780 },
  { month: 'Apr', orders: 25, revenue: 52000, savings: 6240 },
  { month: 'May', orders: 22, revenue: 47300, savings: 5676 },
  { month: 'Jun', orders: 30, revenue: 64800, savings: 7776 },
];

const savingsData = [
  { name: 'Electronics', value: 35, savings: 8540 },
  { name: 'Textiles', value: 25, savings: 6100 },
  { name: 'Machinery', value: 20, savings: 4880 },
  { name: 'Others', value: 20, savings: 4880 },
];

const supplierPerformance = [
  { subject: 'Quality', A: 90, fullMark: 100 },
  { subject: 'Delivery Time', A: 85, fullMark: 100 },
  { subject: 'Price', A: 92, fullMark: 100 },
  { subject: 'Communication', A: 88, fullMark: 100 },
  { subject: 'Flexibility', A: 80, fullMark: 100 },
];

const shipmentStatus = [
  { status: 'In Transit', count: 8, color: '#3b82f6' },
  { status: 'Delivered', count: 24, color: '#10b981' },
  { status: 'Processing', count: 5, color: '#f59e0b' },
  { status: 'Delayed', count: 2, color: '#ef4444' },
];

const costComparison = [
  { month: 'Jan', market: 26500, actual: 24500 },
  { month: 'Feb', market: 41200, actual: 38200 },
  { month: 'Mar', market: 34000, actual: 31500 },
  { month: 'Apr', market: 56100, actual: 52000 },
  { month: 'May', market: 51000, actual: 47300 },
  { month: 'Jun', market: 69900, actual: 64800 },
];

const topSuppliers = [
  { name: 'Nitin Supplier', orders: 12, value: '$28,500', rating: 4.8, country: 'India' },
  { name: 'Global Tech Parts', orders: 18, value: '$42,300', rating: 4.9, country: 'China' },
  { name: 'Asia Manufacturing Co', orders: 8, value: '$19,800', rating: 4.6, country: 'Vietnam' },
  { name: 'Euro Components Ltd', orders: 15, value: '$35,200', rating: 4.7, country: 'Germany' },
];

const activeOrders = [
  {
    id: 'ORD-2024-0847',
    product: 'Organic Turmeric Powder',
    status: 'In Transit',
    statusColor: '#f59e0b',
    eta: 'Dec 5, 2024',
    value: '$2,500',
    supplier: 'Nitin Supplier',
  },
  {
    id: 'ORD-2024-0812',
    product: 'Black Pepper - Premium Grade',
    status: 'Customs Clearance',
    statusColor: '#3b82f6',
    eta: 'Dec 1, 2024',
    value: '$3,850',
    supplier: 'Global Tech Parts',
  }
];

const recentActivity = [
  { icon: Package, text: 'Order ORD-2024-0847 shipped from Vietnam', time: '2 hours ago' },
  { icon: FileText, text: 'Commercial Invoice generated', time: '5 hours ago' },
  { icon: CheckCircle, text: 'Quote accepted for Organic Turmeric', time: '2 days ago' },
];

// Helper function to format time ago
function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return date.toLocaleDateString();
}

export default function Dashboard() {
  const searchParams = useSearchParams();
  const { organization, hasCompletedTour, completeTour } = useUser();
  const [showTour, setShowTour] = useState(false);
  const [requirements, setRequirements] = useState<SubmittedRequirement[]>([]);
  const [recentCalculations, setRecentCalculations] = useState<CalculationRecord[]>([]);
  const [calculationsLoading, setCalculationsLoading] = useState(false);

  useEffect(() => {
    // Check if we should show the tour
    if (searchParams.get('tour') === 'true' && !hasCompletedTour) {
      setShowTour(true);
    }
  }, [searchParams, hasCompletedTour]);

  useEffect(() => {
    // Load submitted requirements from localStorage
    const loadRequirements = () => {
      const saved = localStorage.getItem('befach-requirements');
      if (saved) {
        try {
          const allRequirements = JSON.parse(saved);
          setRequirements(allRequirements.slice(0, 5)); // Show last 5
        } catch (error) {
          console.error('Error loading requirements:', error);
        }
      }
    };

    loadRequirements();
  }, []);

  useEffect(() => {
    // Load recent calculations
    const loadCalculations = async () => {
      setCalculationsLoading(true);
      try {
        const calculations = await calculatorService.getRecentCalculations(5);
        setRecentCalculations(calculations);
      } catch (error) {
        console.error('Error loading calculations:', error);
      } finally {
        setCalculationsLoading(false);
      }
    };

    loadCalculations();
  }, []);

  // Calculate dynamic metrics
  const totalOrders = orderData.reduce((sum, item) => sum + item.orders, 0);
  const totalSpend = orderData.reduce((sum, item) => sum + item.revenue, 0);
  const totalSavings = orderData.reduce((sum, item) => sum + item.savings, 0);
  const avgSavingsPercent = ((totalSavings / totalSpend) * 100).toFixed(1);

  const metrics = [
    {
      label: 'Total Orders',
      value: totalOrders.toString(),
      icon: ShoppingCart,
      trend: '+12%',
      trendUp: true,
      subValue: `${orderData[orderData.length - 1].orders} this month`,
      change: '+8 from last month'
    },
    {
      label: 'Total Spend',
      value: `$${(totalSpend / 1000).toFixed(0)}K`,
      icon: DollarSign,
      trend: '+18%',
      trendUp: true,
      subValue: `$${(orderData[orderData.length - 1].revenue / 1000).toFixed(1)}K this month`,
      change: 'vs last month'
    },
    {
      label: 'Active Suppliers',
      value: '12',
      icon: Users,
      trend: '+25%',
      trendUp: true,
      subValue: '8 countries',
      change: '3 added this month'
    },
    {
      label: 'Avg. Savings',
      value: `${avgSavingsPercent}%`,
      icon: TrendingUp,
      trend: '+3%',
      trendUp: true,
      subValue: `$${(totalSavings / 1000).toFixed(0)}K saved`,
      change: 'vs market price'
    },
  ];

  const detailedMetrics = [
    { label: 'On-Time Delivery', value: '94%', icon: Clock, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Supplier Rating', value: '4.7/5', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Pending Approvals', value: '3', icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Completed Orders', value: '24', icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  const quickActions = [
    {
      icon: FileText,
      title: 'Share Requirement',
      count: requirements.length > 0 ? `${requirements.length} active` : 'Start now',
      href: '/share-requirement',
      color: '#3b82f6'
    },
    {
      icon: Package,
      title: 'Track Shipment',
      count: '1 in transit',
      href: '/tracking',
      color: '#10b981'
    },
    {
      icon: Users,
      title: 'Find Suppliers',
      count: '12 saved',
      href: '/suppliers',
      color: '#f59e0b'
    },
    {
      icon: Brain,
      title: 'AI Assistant',
      count: 'Available',
      href: '/ai-assistant',
      color: '#8b5cf6'
    },
  ];

  return (
    <AppLayout searchPlaceholder="Search dashboard, orders, suppliers...">
      {/* Guided Tour */}
      {showTour && (
        <GuidedTour
          isOpen={showTour}
          onClose={() => {
            setShowTour(false);
            completeTour();
          }}
        />
      )}

      <div className="dashboard-container">
        {/* Welcome & Actions Bar */}
        <div className="welcome-section">
          <div className="welcome-content">
            <h1 className="welcome-title">Welcome back, {organization?.name || 'there'}! 👋</h1>
            <p className="welcome-subtitle">Real-time analytics and insights for your import operations</p>
          </div>
          <div className="quick-actions-bar">
            {quickActions.map((action, idx) => (
              <Link key={idx} href={action.href} className="quick-action-button">
                <div className="action-icon-wrapper" style={{ backgroundColor: `${action.color}15` }}>
                  <action.icon className="action-icon" style={{ color: action.color }} />
                </div>
                <div className="action-content">
                  <div className="action-title">{action.title}</div>
                  <div className="action-count">{action.count}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Primary Metrics Grid */}
        <div className="metrics-grid">
          {metrics.map((metric, idx) => (
            <div key={idx} className="metric-card">
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
            </div>
          ))}
        </div>

        {/* Secondary Metrics */}
        <div className="secondary-metrics">
          {detailedMetrics.map((metric, idx) => (
            <div key={idx} className="secondary-metric-card">
              <div className={`secondary-metric-icon ${metric.bg}`}>
                <metric.icon className={`${metric.color}`} />
              </div>
              <div className="secondary-metric-content">
                <div className="secondary-metric-value">{metric.value}</div>
                <div className="secondary-metric-label">{metric.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section - First Row */}
        <div className="charts-row">
          {/* Revenue & Savings Trend */}
          <div className="chart-card chart-large">
            <div className="chart-header">
              <div className="chart-title-section">
                <h3 className="chart-title">Revenue & Savings Analysis</h3>
                <p className="chart-subtitle">Track spending and cost savings over time</p>
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
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke="#f97316" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue ($)" />
                <Area type="monotone" dataKey="savings" stroke="#10b981" fillOpacity={1} fill="url(#colorSavings)" name="Savings ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Shipment Status */}
          <div className="chart-card">
            <h3 className="chart-title">Shipment Status</h3>
            <p className="chart-subtitle">Current shipment breakdown</p>
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
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Section - Second Row */}
        <div className="charts-row">
          {/* Market Price Comparison */}
          <div className="chart-card chart-large">
            <div className="chart-header">
              <div className="chart-title-section">
                <h3 className="chart-title">Cost vs Market Price Comparison</h3>
                <p className="chart-subtitle">Your spending compared to market averages</p>
              </div>
              <div className="savings-badge">Saving 12% on average</div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={costComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Legend />
                <Bar dataKey="market" fill="#94a3b8" name="Market Price" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" fill="#f97316" name="Your Price" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Supplier Performance Radar */}
          <div className="chart-card">
            <h3 className="chart-title">Supplier Performance</h3>
            <p className="chart-subtitle">Average ratings across metrics</p>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={supplierPerformance}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
                <Radar name="Performance" dataKey="A" stroke="#f97316" fill="#f97316" fillOpacity={0.5} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution & Top Suppliers */}
        <div className="charts-row">
          {/* Category Distribution */}
          <div className="chart-card">
            <h3 className="chart-title">Category Distribution</h3>
            <p className="chart-subtitle">Spending by product category</p>
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
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {savingsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
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
                <h3 className="chart-title">Top Performing Suppliers</h3>
                <p className="chart-subtitle">Ranked by order volume and performance</p>
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
        </div>

        {/* Recent Cost Calculations */}
        <div className="calculations-section">
          <div className="section-header">
            <h2 className="section-title">Recent Cost Calculations</h2>
            <Link href="/cost-calculator" className="section-link">
              View All <ArrowRight className="link-arrow" />
            </Link>
          </div>

          {calculationsLoading ? (
            <div className="loading-state">Loading calculations...</div>
          ) : recentCalculations.length > 0 ? (
            <div className="calculations-grid">
              {recentCalculations.slice(0, 4).map((calc) => (
                <Link
                  key={calc.id}
                  href={`/cost-calculator/results/${calc.id}`}
                  className="calculation-card"
                >
                  <div className="calc-header">
                    <Package className="calc-icon" />
                    <span className="calc-date">{new Date(calc.calculatedAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="calc-product">{calc.input?.productName || 'N/A'}</h4>
                  <div className="calc-detail">
                    <span className="detail-label">HSN:</span>
                    <span className="detail-value">{calc.input?.hsnCode || 'N/A'}</span>
                  </div>
                  <div className="calc-detail">
                    <span className="detail-label">Route:</span>
                    <span className="detail-value">
                      {calc.input?.originCountry || 'N/A'} → {calc.input?.portOfDischarge || 'India'}
                    </span>
                  </div>
                  <div className="calc-detail">
                    <span className="detail-label">FOB:</span>
                    <span className="detail-value">
                      {calc.input?.currency || 'USD'} {calc.fobValue?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="calc-footer">
                    <div className="calc-total">
                      <span className="total-label">Total Cost:</span>
                      <span className="total-value">₹{calc.totalLandedCost?.toLocaleString() || '0'}</span>
                    </div>
                    {calc.totalDuties && (
                      <div className="calc-savings">
                        Duty: ₹{calc.totalDuties.toLocaleString()}
                      </div>
                    )}
                  </div>
                </Link>
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
        </div>

        {/* Sourcing Requirements Table */}
        <div className="requirements-section">
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
                <div key={req.id} className="table-row">
                  <div className="td-cell">
                    <div className="product-info">
                      <Package className="product-icon" />
                      <span>{req.productDescription ? req.productDescription.substring(0, 50) + '...' : 'N/A'}</span>
                    </div>
                  </div>
                  <div className="td-cell">{req.quantity} {req.unit}</div>
                  <div className="td-cell">{req.targetPrice}</div>
                  <div className="td-cell">
                    <span className={`status-badge status-${req.status.toLowerCase()}`}>
                      {req.status}
                    </span>
                  </div>
                  <div className="td-cell">{timeAgo(req.submittedAt)}</div>
                  <div className="td-cell">
                    <button className="action-link">
                      View Details <ArrowRight className="action-arrow" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FileText className="empty-icon" />
              <p>No sourcing requirements yet. Start by sharing your first requirement!</p>
              <Link href="/share-requirement" className="empty-cta">
                Share Requirement <ArrowRight className="cta-arrow" />
              </Link>
            </div>
          )}
        </div>

        {/* Active Orders & Recent Activity */}
        <div className="two-column-section">
          <div className="orders-section">
            <h3 className="subsection-title">Active Orders</h3>
            <div className="orders-list">
              {activeOrders.map((order) => (
                <div key={order.id} className="order-item">
                  <div className="order-header">
                    <span className="order-id">{order.id}</span>
                    <span className="order-value">{order.value}</span>
                  </div>
                  <div className="order-product">{order.product}</div>
                  <div className="order-supplier">Supplier: {order.supplier}</div>
                  <div className="order-footer">
                    <span className="order-status" style={{ color: order.statusColor }}>
                      {order.status}
                    </span>
                    <span className="order-eta">ETA: {order.eta}</span>
                  </div>
                  <Link href="/tracking" className="order-track">
                    Track <ArrowRight className="track-arrow" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="activity-section">
            <h3 className="subsection-title">Recent Activity</h3>
            <div className="activity-list">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="activity-item">
                  <activity.icon className="activity-icon" />
                  <div className="activity-content">
                    <p className="activity-text">{activity.text}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Market Insights Preview */}
        <div className="insights-section">
          <div className="section-header">
            <h2 className="section-title">Market Insights</h2>
            <Link href="/market-insights" className="section-link">
              View All <ArrowRight className="link-arrow" />
            </Link>
          </div>
          <div className="insights-grid">
            {[
              { commodity: 'LED Bulbs', hsn: '94054090', origin: 'China', value: '$850M', growth: '+12%', color: '#10b981' },
              { commodity: 'Mobile Accessories', hsn: '85177900', origin: 'Vietnam', value: '$650M', growth: '+18%', color: '#10b981' },
              { commodity: 'Textiles', hsn: '52085100', origin: 'Bangladesh', value: '$1.2B', growth: '-5%', color: '#ef4444' },
            ].map((insight, idx) => (
              <div key={idx} className="insight-card">
                <h4 className="insight-commodity">{insight.commodity}</h4>
                <div className="insight-detail">
                  <span className="insight-label">HSN:</span>
                  <span className="insight-value">{insight.hsn}</span>
                </div>
                <div className="insight-detail">
                  <span className="insight-label">Origin:</span>
                  <span className="insight-value">{insight.origin}</span>
                </div>
                <div className="insight-detail">
                  <span className="insight-label">Market Value:</span>
                  <span className="insight-value">{insight.value}</span>
                </div>
                <div className="insight-growth" style={{ color: insight.color }}>
                  {insight.growth}
                </div>
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
          .dashboard-container {
            padding: 2rem;
            max-width: 1800px;
            margin: 0 auto;
          }

          .welcome-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
          }

          .welcome-title {
            font-size: 1.875rem;
            font-weight: 600;
            margin-bottom: 0.25rem;
            color: var(--text-primary);
          }

          .welcome-subtitle {
            color: var(--text-secondary);
            font-size: 0.875rem;
          }

          .quick-actions-bar {
            display: flex;
            gap: 0.75rem;
          }

          .quick-action-button {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem 1.25rem;
            background: white;
            border: 1px solid var(--border-color);
            border-radius: 0.75rem;
            text-decoration: none;
            color: var(--text-primary);
            transition: all 0.2s;
            min-width: 200px;
          }

          .quick-action-button:hover {
            box-shadow: 0 6px 20px rgba(0,0,0,0.1);
            transform: translateY(-2px);
            border-color: #e5e7eb;
          }

          .action-icon-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
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
            font-size: 0.9rem;
            font-weight: 600;
            margin-bottom: 0.25rem;
            color: var(--text-primary);
          }

          .action-count {
            font-size: 0.8rem;
            color: var(--text-secondary);
            font-weight: 500;
          }

          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
          }

          .metric-card {
            background: white;
            padding: 1.5rem;
            border-radius: 0.75rem;
            border: 1px solid var(--border-color);
            transition: all 0.2s;
          }

          .metric-card:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }

          .metric-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
          }

          .metric-icon-wrapper {
            width: 3rem;
            height: 3rem;
            background: rgba(249, 115, 22, 0.1);
            border-radius: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .metric-icon {
            width: 1.5rem;
            height: 1.5rem;
            color: var(--accent-primary);
          }

          .metric-trend {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            padding: 0.25rem 0.5rem;
            border-radius: 9999px;
            font-size: 0.75rem;
          }

          .trend-up {
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
          }

          .trend-down {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
          }

          .trend-icon {
            width: 0.75rem;
            height: 0.75rem;
          }

          .metric-value {
            font-size: 1.875rem;
            font-weight: 600;
            margin-bottom: 0.25rem;
            color: var(--text-primary);
          }

          .metric-label {
            font-size: 0.875rem;
            color: var(--text-primary);
            margin-bottom: 0.25rem;
          }

          .metric-subvalue {
            font-size: 0.75rem;
            color: var(--text-secondary);
          }

          .metric-change {
            font-size: 0.75rem;
            color: var(--text-muted);
            margin-top: 0.25rem;
          }

          .secondary-metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
          }

          .secondary-metric-card {
            background: white;
            padding: 1.25rem;
            border-radius: 0.75rem;
            border: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .secondary-metric-icon {
            width: 3rem;
            height: 3rem;
            border-radius: 0.5rem;
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
            font-weight: 600;
            color: var(--text-primary);
          }

          .secondary-metric-label {
            font-size: 0.875rem;
            color: var(--text-secondary);
          }

          .charts-row {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 1.5rem;
            margin-bottom: 2rem;
          }

          .charts-row:nth-of-type(3) {
            grid-template-columns: 1fr 2fr;
          }

          .chart-card {
            background: white;
            padding: 1.5rem;
            border-radius: 0.75rem;
            border: 1px solid var(--border-color);
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
            color: var(--text-primary);
            margin-bottom: 0.25rem;
          }

          .chart-subtitle {
            font-size: 0.875rem;
            color: var(--text-secondary);
            margin-bottom: 1.5rem;
          }

          .chart-select {
            padding: 0.5rem 0.75rem;
            border: 1px solid var(--border-color);
            border-radius: 0.5rem;
            font-size: 0.875rem;
            color: var(--text-primary);
            background: white;
          }

          .savings-badge {
            padding: 0.375rem 0.75rem;
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
            border-radius: 0.5rem;
            font-size: 0.875rem;
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
            color: var(--accent-primary);
            text-decoration: none;
            font-size: 0.875rem;
          }

          .view-all-link:hover {
            color: var(--accent-secondary);
          }

          .suppliers-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .supplier-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: var(--bg-secondary);
            border-radius: 0.5rem;
            transition: all 0.2s;
          }

          .supplier-item:hover {
            background: var(--bg-tertiary);
          }

          .supplier-rank {
            width: 2.5rem;
            height: 2.5rem;
            background: var(--accent-primary);
            color: white;
            border-radius: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
          }

          .supplier-info {
            flex: 1;
          }

          .supplier-name {
            font-weight: 500;
            color: var(--text-primary);
            margin-bottom: 0.25rem;
          }

          .supplier-country {
            font-size: 0.75rem;
            color: var(--text-secondary);
          }

          .supplier-orders {
            font-size: 0.75rem;
            color: var(--text-secondary);
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
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--text-primary);
          }

          .supplier-value-label {
            font-size: 0.75rem;
            color: var(--text-secondary);
          }

          .supplier-rating {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            padding: 0.375rem 0.75rem;
            background: rgba(251, 191, 36, 0.1);
            border-radius: 0.5rem;
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
            font-weight: 600;
            color: var(--text-primary);
          }

          .section-link {
            color: var(--accent-primary);
            text-decoration: none;
            font-size: 0.875rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
          }

          .section-link:hover {
            color: var(--accent-secondary);
          }

          .link-arrow {
            width: 1rem;
            height: 1rem;
          }

          .calculations-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1rem;
          }

          .calculation-card {
            background: white;
            padding: 1.25rem;
            border-radius: 0.75rem;
            border: 1px solid var(--border-color);
            text-decoration: none;
            color: var(--text-primary);
            transition: all 0.2s;
          }

          .calculation-card:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transform: translateY(-2px);
          }

          .calc-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.75rem;
          }

          .calc-icon {
            width: 1.25rem;
            height: 1.25rem;
            color: var(--accent-primary);
          }

          .calc-date {
            font-size: 0.75rem;
            color: var(--text-secondary);
          }

          .calc-product {
            font-weight: 500;
            margin-bottom: 0.75rem;
            color: var(--text-primary);
          }

          .calc-detail {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
            font-size: 0.875rem;
          }

          .detail-label {
            color: var(--text-secondary);
          }

          .detail-value {
            color: var(--text-primary);
            font-weight: 500;
          }

          .calc-footer {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid var(--border-color);
          }

          .calc-total {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
          }

          .total-label {
            font-size: 0.875rem;
            color: var(--text-secondary);
          }

          .total-value {
            font-size: 1.125rem;
            font-weight: 600;
            color: var(--accent-primary);
          }

          .calc-savings {
            font-size: 0.75rem;
            color: #10b981;
          }

          .requirements-table {
            background: white;
            border-radius: 0.75rem;
            border: 1px solid var(--border-color);
            overflow: hidden;
          }

          .table-header {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
            padding: 1rem 1.5rem;
            background: var(--bg-secondary);
            border-bottom: 1px solid var(--border-color);
          }

          .th-cell {
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--text-secondary);
          }

          .table-row {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
            padding: 1rem 1.5rem;
            border-bottom: 1px solid var(--border-color);
            transition: background 0.2s;
          }

          .table-row:hover {
            background: var(--bg-secondary);
          }

          .td-cell {
            display: flex;
            align-items: center;
            font-size: 0.875rem;
            color: var(--text-primary);
          }

          .product-info {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }

          .product-icon {
            width: 2.5rem;
            height: 2.5rem;
            padding: 0.5rem;
            background: rgba(249, 115, 22, 0.1);
            border-radius: 0.5rem;
            color: var(--accent-primary);
          }

          .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
          }

          .status-pending {
            background: rgba(251, 191, 36, 0.1);
            color: #f59e0b;
          }

          .status-in.review {
            background: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
          }

          .status-sourcing {
            background: rgba(139, 92, 246, 0.1);
            color: #8b5cf6;
          }

          .status-completed {
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
          }

          .action-link {
            color: var(--accent-primary);
            background: none;
            border: none;
            font-size: 0.875rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.25rem;
          }

          .action-arrow {
            width: 0.75rem;
            height: 0.75rem;
          }

          .empty-state {
            padding: 3rem;
            text-align: center;
            background: white;
            border-radius: 0.75rem;
            border: 1px solid var(--border-color);
          }

          .empty-icon {
            width: 4rem;
            height: 4rem;
            margin: 0 auto 1rem;
            color: var(--text-muted);
          }

          .empty-state p {
            color: var(--text-secondary);
            margin-bottom: 1rem;
          }

          .empty-cta {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            background: var(--accent-primary);
            color: white;
            border-radius: 0.5rem;
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 500;
          }

          .cta-arrow {
            width: 1rem;
            height: 1rem;
          }

          .two-column-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            margin-bottom: 2rem;
          }

          .orders-section,
          .activity-section {
            background: white;
            padding: 1.5rem;
            border-radius: 0.75rem;
            border: 1px solid var(--border-color);
          }

          .subsection-title {
            font-size: 1.125rem;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 1rem;
          }

          .orders-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .order-item {
            padding: 1rem;
            background: var(--bg-secondary);
            border-radius: 0.5rem;
            position: relative;
          }

          .order-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
          }

          .order-id {
            font-size: 0.75rem;
            color: var(--text-secondary);
            font-family: monospace;
          }

          .order-value {
            font-weight: 600;
            color: var(--text-primary);
          }

          .order-product {
            font-weight: 500;
            margin-bottom: 0.25rem;
            color: var(--text-primary);
          }

          .order-supplier {
            font-size: 0.875rem;
            color: var(--text-secondary);
            margin-bottom: 0.75rem;
          }

          .order-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .order-status {
            font-size: 0.875rem;
            font-weight: 500;
          }

          .order-eta {
            font-size: 0.75rem;
            color: var(--text-secondary);
          }

          .order-track {
            position: absolute;
            right: 1rem;
            bottom: 1rem;
            color: var(--accent-primary);
            text-decoration: none;
            font-size: 0.75rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
          }

          .track-arrow {
            width: 0.75rem;
            height: 0.75rem;
          }

          .activity-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .activity-item {
            display: flex;
            gap: 0.75rem;
          }

          .activity-icon {
            width: 2rem;
            height: 2rem;
            padding: 0.5rem;
            background: rgba(249, 115, 22, 0.1);
            border-radius: 0.5rem;
            color: var(--accent-primary);
            flex-shrink: 0;
          }

          .activity-text {
            font-size: 0.875rem;
            color: var(--text-primary);
            margin-bottom: 0.25rem;
          }

          .activity-time {
            font-size: 0.75rem;
            color: var(--text-secondary);
          }

          .insights-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1rem;
          }

          .insight-card {
            background: white;
            padding: 1.25rem;
            border-radius: 0.75rem;
            border: 1px solid var(--border-color);
            transition: all 0.2s;
          }

          .insight-card:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }

          .insight-commodity {
            font-weight: 500;
            margin-bottom: 1rem;
            color: var(--text-primary);
          }

          .insight-detail {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
            font-size: 0.875rem;
          }

          .insight-label {
            color: var(--text-secondary);
          }

          .insight-value {
            color: var(--text-primary);
            font-weight: 500;
          }

          .insight-growth {
            margin-top: 1rem;
            font-size: 1.125rem;
            font-weight: 600;
            text-align: right;
          }

          .loading-state {
            padding: 2rem;
            text-align: center;
            color: var(--text-secondary);
          }

          @media (max-width: 1200px) {
            .charts-row {
              grid-template-columns: 1fr;
            }

            .charts-row:nth-of-type(3) {
              grid-template-columns: 1fr;
            }

            .table-header,
            .table-row {
              grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            }
          }

          @media (max-width: 900px) {
            .metrics-grid {
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            }

            .secondary-metrics {
              grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            }

            .two-column-section {
              grid-template-columns: 1fr;
            }

            .calculations-grid {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 768px) {
            .welcome-section {
              flex-direction: column;
              gap: 1rem;
              align-items: flex-start;
            }

            .quick-actions-bar {
              width: 100%;
              display: grid;
              grid-template-columns: repeat(2, 1fr);
            }

            .insights-grid {
              grid-template-columns: 1fr;
            }

            .dashboard-container {
              padding: 1rem;
            }
          }
        `}</style>
      </div>
    </AppLayout>
  );
}