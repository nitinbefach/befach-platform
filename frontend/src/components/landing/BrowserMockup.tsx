'use client';

import {
  Lock, LayoutDashboard, Receipt, Ship, Search, FileCheck2,
  TrendingUp, MessageSquare, Package, Wallet, Users, Settings,
  FilePlus, MapPin, ShoppingCart, DollarSign, Clock,
  Star, AlertCircle, CheckCircle2
} from 'lucide-react';

export default function BrowserMockup() {
  return (
    <div className="hero-visual">
      <div className="browser-frame">
        {/* Browser Top Bar */}
        <div className="browser-topbar">
          <div className="browser-dots">
            <div className="browser-dot dot-red"></div>
            <div className="browser-dot dot-yellow"></div>
            <div className="browser-dot dot-green"></div>
          </div>
          <div className="browser-url">
            <Lock size={12} style={{ opacity: 0.5, marginRight: 6 }} />
            app.befach.com/dashboard
          </div>
        </div>

        {/* Browser Content */}
        <div className="browser-content">
          {/* Sidebar */}
          <div className="dash-sidebar">
            <div className="dash-sidebar-brand">
              <span>BEFACH</span>
              <small>International</small>
            </div>
            <NavItem icon={LayoutDashboard} label="Dashboard" active />
            <NavItem icon={Receipt} label="Cost Calculator" />
            <NavItem icon={Ship} label="Shipments" />
            <NavItem icon={Search} label="Sourcing" />
            <NavItem icon={FileCheck2} label="Compliance" />
            <NavItem icon={TrendingUp} label="Market Insights" />
            <NavItem icon={MessageSquare} label="AI Assistant" />
            <NavItem icon={Package} label="Orders" />
            <NavItem icon={Wallet} label="Payments" />
            <NavItem icon={Users} label="Team" />
            <NavItem icon={Settings} label="Settings" />
          </div>

          {/* Main Dashboard */}
          <div className="dash-main">
            <div className="dash-header">
              <h3>Welcome back, Befach!</h3>
              <div className="dash-quick-actions">
                <QuickAction icon={FilePlus} label="Share Requirement" />
                <QuickAction icon={MapPin} label="Track Shipment" />
                <QuickAction icon={Search} label="Find Suppliers" />
                <QuickAction icon={MessageSquare} label="AI Assistant" />
              </div>
            </div>

            {/* Stat Cards */}
            <div className="dash-stats">
              <StatCard icon={ShoppingCart} iconColor="orange" value="123" label="Total Orders" sub="30 this month" badge="+12%" />
              <StatCard icon={DollarSign} iconColor="green" value="$258K" label="Total Spend" sub="$64.8K this month" badge="+18%" />
              <StatCard icon={Users} iconColor="red" value="12" label="Active Suppliers" sub="8 countries" badge="+25%" />
              <StatCard icon={TrendingUp} iconColor="blue" value="12.0%" label="Avg. Savings" sub="$31K saved" badge="+3%" />
            </div>

            {/* Secondary Stats */}
            <div className="dash-secondary-stats">
              <SecondaryCard icon={Clock} bg="#f0fdf4" color="#16a34a" value="94%" label="On-Time Delivery" />
              <SecondaryCard icon={Star} bg="#fffbeb" color="#d97706" value="4.7/5" label="Supplier Rating" />
              <SecondaryCard icon={AlertCircle} bg="#fef2f2" color="#ef4444" value="3" label="Pending Approvals" />
              <SecondaryCard icon={CheckCircle2} bg="#eff6ff" color="#2563eb" value="24" label="Completed Orders" />
            </div>

            {/* Mini Chart */}
            <div className="dash-chart">
              <div className="dash-chart-header">
                <div className="dash-chart-title">Revenue &amp; Savings</div>
                <div className="dash-chart-tabs">
                  <span className="dash-chart-tab">3M</span>
                  <span className="dash-chart-tab active">6M</span>
                  <span className="dash-chart-tab">1Y</span>
                </div>
              </div>
              <svg className="mini-chart" viewBox="0 0 400 80" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <line className="chart-grid" x1="0" y1="20" x2="400" y2="20" />
                <line className="chart-grid" x1="0" y1="40" x2="400" y2="40" />
                <line className="chart-grid" x1="0" y1="60" x2="400" y2="60" />
                <polygon
                  className="chart-fill"
                  points="0,65 50,58 100,50 150,45 200,40 250,32 300,28 350,20 400,15 400,80 0,80"
                />
                <polyline points="0,65 50,58 100,50 150,45 200,40 250,32 300,28 350,20 400,15" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-visual {
          position: relative;
        }

        .browser-frame {
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid var(--landing-border);
          overflow: hidden;
          position: relative;
          user-select: none;
          -webkit-user-select: none;
        }

        .browser-topbar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: #f9fafb;
          border-bottom: 1px solid var(--landing-border);
        }

        .browser-dots {
          display: flex;
          gap: 6px;
        }

        .browser-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .dot-red { background: #ef4444; }
        .dot-yellow { background: #f59e0b; }
        .dot-green { background: #22c55e; }

        .browser-url {
          flex: 1;
          height: 28px;
          background: #ffffff;
          border-radius: 6px;
          border: 1px solid var(--landing-border);
          display: flex;
          align-items: center;
          padding: 0 10px;
          font-size: 0.72rem;
          color: var(--landing-text-muted);
          margin-left: 8px;
        }

        .browser-content {
          display: flex;
          min-height: 320px;
        }

        /* Dashboard Sidebar */
        .dash-sidebar {
          width: 150px;
          background: var(--landing-dark);
          padding: 16px 0;
          flex-shrink: 0;
        }

        .dash-sidebar-brand {
          padding: 0 14px 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          margin-bottom: 10px;
        }

        .dash-sidebar-brand span {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--landing-primary-start);
        }

        .dash-sidebar-brand small {
          display: block;
          font-size: 0.5rem;
          color: rgba(255, 255, 255, 0.35);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* Dashboard Main */
        .dash-main {
          flex: 1;
          min-width: 0;
          padding: 14px;
          background: var(--landing-light-bg);
        }

        .dash-header {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 14px;
        }

        .dash-header h3 {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--landing-text-heading);
        }

        .dash-quick-actions {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .dash-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 10px;
        }

        .dash-secondary-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 10px;
        }

        /* Mini Chart */
        .dash-chart {
          background: #ffffff;
          border-radius: 8px;
          padding: 14px;
          border: 1px solid var(--landing-border-light);
        }

        .dash-chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .dash-chart-title {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--landing-text-heading);
        }

        .dash-chart-tabs {
          display: flex;
          gap: 2px;
        }

        .dash-chart-tab {
          font-size: 0.55rem;
          padding: 3px 8px;
          border-radius: 4px;
          color: var(--landing-text-muted);
          font-weight: 500;
        }

        .dash-chart-tab.active {
          background: var(--landing-dark);
          color: #ffffff;
        }

        .mini-chart {
          width: 100%;
          height: 80px;
        }

        .mini-chart polyline {
          fill: none;
          stroke: var(--landing-primary-start);
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .mini-chart .chart-fill {
          fill: url(#chartGrad);
          opacity: 0.15;
        }

        .mini-chart .chart-grid {
          stroke: var(--landing-border);
          stroke-width: 0.5;
        }

        @media (max-width: 1024px) {
          .dash-sidebar {
            width: 120px;
          }
        }

        @media (max-width: 768px) {
          .hero-visual {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .dash-secondary-stats {
            display: none;
          }

          .dash-chart {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

/* Sub-components */

function NavItem({ icon: Icon, label, active }: { icon: any; label: string; active?: boolean }) {
  return (
    <>
      <div className={`dash-nav-item ${active ? 'active' : ''}`}>
        <Icon size={14} />
        <span>{label}</span>
      </div>
      <style jsx>{`
        .dash-nav-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          font-size: 0.68rem;
          color: rgba(255, 255, 255, 0.5);
          transition: all 0.2s;
        }

        .dash-nav-item.active {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
          border-right: 2px solid var(--landing-primary-start);
        }
      `}</style>
    </>
  );
}

function QuickAction({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <>
      <div className="dash-quick-action">
        <Icon size={12} style={{ color: 'var(--landing-primary-end)' }} />
        <span>{label}</span>
      </div>
      <style jsx>{`
        .dash-quick-action {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 5px 8px;
          background: #ffffff;
          border: 1px solid var(--landing-border);
          border-radius: 6px;
          font-size: 0.55rem;
          font-weight: 600;
          color: var(--landing-text-body);
          white-space: nowrap;
        }
      `}</style>
    </>
  );
}

function StatCard({ icon: Icon, iconColor, value, label, sub, badge }: {
  icon: any; iconColor: string; value: string; label: string; sub: string; badge: string;
}) {
  const iconBgMap: Record<string, string> = {
    orange: '#fff7ed',
    green: '#f0fdf4',
    blue: '#eff6ff',
    red: '#fef2f2',
  };
  const iconColorMap: Record<string, string> = {
    orange: 'var(--landing-primary-end)',
    green: '#16a34a',
    blue: '#2563eb',
    red: '#ef4444',
  };

  return (
    <>
      <div className="dash-stat-card">
        <div className="dash-stat-top">
          <div className="dash-stat-icon" style={{ background: iconBgMap[iconColor] }}>
            <Icon size={14} style={{ color: iconColorMap[iconColor] }} />
          </div>
          <span className="dash-stat-badge">{badge}</span>
        </div>
        <div className="dash-stat-value">{value}</div>
        <div className="dash-stat-label">{label}</div>
        <div className="dash-stat-sub">{sub}</div>
      </div>
      <style jsx>{`
        .dash-stat-card {
          background: #ffffff;
          border-radius: 8px;
          padding: 10px;
          border: 1px solid var(--landing-border-light);
        }

        .dash-stat-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .dash-stat-icon {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dash-stat-badge {
          font-size: 0.5rem;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
          background: #f0fdf4;
          color: #16a34a;
        }

        .dash-stat-value {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--landing-text-heading);
        }

        .dash-stat-label {
          font-size: 0.58rem;
          color: var(--landing-text-muted);
          margin-bottom: 2px;
        }

        .dash-stat-sub {
          font-size: 0.5rem;
          color: var(--landing-text-muted);
          margin-top: 2px;
        }
      `}</style>
    </>
  );
}

function SecondaryCard({ icon: Icon, bg, color, value, label }: {
  icon: any; bg: string; color: string; value: string; label: string;
}) {
  return (
    <>
      <div className="dash-secondary-card">
        <div className="sec-icon" style={{ background: bg, color }}>
          <Icon size={12} />
        </div>
        <div>
          <div className="sec-value">{value}</div>
          <div className="sec-label">{label}</div>
        </div>
      </div>
      <style jsx>{`
        .dash-secondary-card {
          background: #ffffff;
          border-radius: 8px;
          padding: 8px;
          border: 1px solid var(--landing-border-light);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .sec-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sec-value {
          font-size: 0.78rem;
          font-weight: 800;
          color: var(--landing-text-heading);
        }

        .sec-label {
          font-size: 0.52rem;
          color: var(--landing-text-muted);
        }
      `}</style>
    </>
  );
}
