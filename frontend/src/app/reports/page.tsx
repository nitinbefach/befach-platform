'use client';

import { useState, Suspense } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useMobile } from '@/hooks/useMobile';
import { useTour } from '@/hooks/useTour';
import { reportsTourSteps, mobileReportsTourSteps } from '@/lib/tourSteps';
import TourFAB from '@/components/walkthrough/TourFAB';
import Joyride from 'react-joyride';
import { joyrideStyles, BefachTooltip } from '@/lib/tourConfig';
import { Modal } from '@/components/ui';
import { Package, DollarSign, TrendingDown, Factory, Lock, BarChart3, TrendingUp, ClipboardList } from 'lucide-react';
import { captureFeatureAction } from '@/lib/posthogEvents';

interface Report {
  id: string;
  name: string;
  type: 'orders' | 'spending' | 'suppliers' | 'compliance' | 'custom';
  dateRange: string;
  createdAt: string;
  status: 'ready' | 'generating';
  size?: string;
}

const mockReports: Report[] = [
  {
    id: 'RPT-001',
    name: 'Monthly Import Summary - November 2024',
    type: 'orders',
    dateRange: 'Nov 1 - Nov 30, 2024',
    createdAt: 'Nov 25, 2024',
    status: 'ready',
    size: '2.4 MB'
  },
  {
    id: 'RPT-002',
    name: 'Q3 Spending Analysis',
    type: 'spending',
    dateRange: 'Jul 1 - Sep 30, 2024',
    createdAt: 'Oct 5, 2024',
    status: 'ready',
    size: '1.8 MB'
  },
  {
    id: 'RPT-003',
    name: 'Supplier Performance Report',
    type: 'suppliers',
    dateRange: 'Jan 1 - Nov 25, 2024',
    createdAt: 'Nov 20, 2024',
    status: 'ready',
    size: '3.1 MB'
  },
  {
    id: 'RPT-004',
    name: 'Compliance Audit Trail',
    type: 'compliance',
    dateRange: 'Oct 1 - Nov 25, 2024',
    createdAt: 'Nov 24, 2024',
    status: 'generating'
  }
];

const summaryStats: { label: string; value: string; change: string; icon: React.ReactNode }[] = [
  { label: 'Total Orders', value: '47', change: '+12%', icon: <Package size={20} /> },
  { label: 'Total Spending', value: '₹45.2L', change: '+8%', icon: <DollarSign size={20} /> },
  { label: 'Avg. Savings', value: '14%', change: '+2%', icon: <TrendingDown size={20} /> },
  { label: 'Active Suppliers', value: '12', change: '+3', icon: <Factory size={20} /> }
];

const typeIcons: Record<Report['type'], React.ReactNode> = {
  orders: <Package size={16} />,
  spending: <DollarSign size={16} />,
  suppliers: <Factory size={16} />,
  compliance: <Lock size={16} />,
  custom: <BarChart3 size={16} />
};

function ReportsContent() {
  const { isMobile } = useMobile();
  const tourSteps = isMobile ? mobileReportsTourSteps : reportsTourSteps;
  const { run, startTour, handleJoyrideCallback } = useTour({ tourId: 'reports', steps: tourSteps });
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [reports, setReports] = useState(mockReports);
  const [newReport, setNewReport] = useState({
    type: 'orders' as Report['type'],
    dateRange: '30days'
  });

  const handleGenerate = () => {
    const dateRanges: Record<string, string> = {
      '7days': 'Last 7 days',
      '30days': 'Last 30 days',
      '90days': 'Last 90 days',
      'ytd': 'Year to date',
      'custom': 'Custom range'
    };

    const typeNames: Record<Report['type'], string> = {
      orders: 'Orders Report',
      spending: 'Spending Analysis',
      suppliers: 'Supplier Performance',
      compliance: 'Compliance Report',
      custom: 'Custom Report'
    };

    const report: Report = {
      id: `RPT-${Date.now()}`,
      name: `${typeNames[newReport.type]} - ${dateRanges[newReport.dateRange]}`,
      type: newReport.type,
      dateRange: dateRanges[newReport.dateRange],
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'generating'
    };

    setReports([report, ...reports]);
    setShowGenerateModal(false);
    captureFeatureAction('report', 'generated', { type: newReport.type });

    // Simulate report generation
    setTimeout(() => {
      setReports(prev => prev.map(r => 
        r.id === report.id ? { ...r, status: 'ready', size: '1.5 MB' } : r
      ));
    }, 3000);
  };

  const handleDownload = (report: Report) => {
    alert(`Downloading ${report.name}...`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this report?')) {
      setReports(reports.filter(r => r.id !== id));
    }
  };

  return (
    <AppLayout>      <div className="content-header">
        <div>
          <h1><BarChart3 size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} /> Reports & Analytics</h1>
          <p>Generate and download detailed reports for your import operations</p>        </div>
        <button className="btn-primary" onClick={() => setShowGenerateModal(true)}>
          + Generate Report
        </button>
      </div>

      {/* Summary Stats */}
      <div id="reports-stats" className="stats-grid">
        {summaryStats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <span className="stat-icon">{stat.icon}</span>
            <div className="stat-content">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
            <span className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
              {stat.change}
            </span>
          </div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <div id="reports-chart" className="chart-section">
        <div className="chart-header">
          <h2>Import Trends</h2>
          <div className="chart-filters">
            <button className="chart-filter active">6 Months</button>
            <button className="chart-filter">1 Year</button>
            <button className="chart-filter">All Time</button>
          </div>
        </div>
        <div className="chart-placeholder">
          <div className="chart-bars">
            {[65, 85, 55, 90, 75, 95].map((height, idx) => (
              <div key={idx} className="bar-container">
                <div className="bar" style={{ height: `${height}%` }} />
                <span className="bar-label">{['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'][idx]}</span>
              </div>
            ))}
          </div>
          <p className="chart-note"><TrendingUp size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Import volume increased 23% over the last 6 months</p>
        </div>
      </div>

      {/* Reports List */}
      <div id="reports-list" className="reports-section">
        <h2>Saved Reports</h2>
        <div className="reports-list">
          {reports.map(report => (
            <div key={report.id} className="report-card">
              <div className="report-icon">{typeIcons[report.type]}</div>
              <div className="report-info">
                <h4>{report.name}</h4>
                <div className="report-meta">
                  <span>{report.dateRange}</span>
                  <span>•</span>
                  <span>Created {report.createdAt}</span>
                  {report.size && (
                    <>
                      <span>•</span>
                      <span>{report.size}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="report-actions">
                {report.status === 'ready' ? (
                  <>
                    <button 
                      className="action-btn primary"
                      onClick={() => handleDownload(report)}
                    >
                      ↓ Download
                    </button>
                    <button 
                      className="action-btn"
                      onClick={() => handleDelete(report.id)}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <span className="generating-badge">
                    <span className="spinner" /> Generating...
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Reports */}
      <div id="reports-quick" className="quick-reports">
        <h2>Quick Reports</h2>
        <div className="quick-reports-grid">
          <button className="quick-report-btn">
            <span className="qr-icon"><Package size={16} /></span>
            <span>This Month&apos;s Orders</span>
          </button>
          <button className="quick-report-btn">
            <span className="qr-icon"><DollarSign size={16} /></span>
            <span>Spending Summary</span>
          </button>
          <button className="quick-report-btn">
            <span className="qr-icon"><Factory size={16} /></span>
            <span>Supplier Overview</span>
          </button>
          <button className="quick-report-btn">
            <span className="qr-icon"><ClipboardList size={16} /></span>
            <span>Compliance Status</span>
          </button>
        </div>
      </div>

      {/* Generate Modal */}
      <Modal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        title="Generate New Report"
      >
        <div className="form-group">
          <label>Report Type</label>
          <select 
            value={newReport.type}
            onChange={(e) => setNewReport({ ...newReport, type: e.target.value as Report['type'] })}
          >
            <option value="orders">Orders Report</option>
            <option value="spending">Spending Analysis</option>
            <option value="suppliers">Supplier Performance</option>
            <option value="compliance">Compliance Report</option>
            <option value="custom">Custom Report</option>
          </select>
        </div>
        <div className="form-group">
          <label>Date Range</label>
          <select
            value={newReport.dateRange}
            onChange={(e) => setNewReport({ ...newReport, dateRange: e.target.value })}
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="ytd">Year to date</option>
            <option value="custom">Custom range</option>
          </select>
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={() => setShowGenerateModal(false)}>
            Cancel
          </button>
          <button className="btn-submit" onClick={handleGenerate}>
            Generate Report
          </button>
        </div>
      </Modal>

      <style jsx>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }
        .stat-card {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .stat-icon {
          font-size: 2em;
        }
        .stat-content {
          flex: 1;
        }
        .stat-value {
          display: block;
          font-size: 1.5em;
          font-weight: 700;
          color: var(--text-primary);
        }
        .stat-label {
          color: var(--text-secondary);
          font-size: 0.85em;
        }
        .stat-change {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8em;
          font-weight: 600;
        }
        .stat-change.positive {
          background: #d1fae5;
          color: #065f46;
        }
        .stat-change.negative {
          background: #fee2e2;
          color: #991b1b;
        }
        .chart-section {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 30px;
        }
        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }
        .chart-header h2 {
          color: var(--text-primary);
          margin: 0;
        }
        .chart-filters {
          display: flex;
          gap: 10px;
        }
        .chart-filter {
          background: var(--bg-tertiary);
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 0.85em;
        }
        .chart-filter.active {
          background: var(--accent-primary);
          color: white;
        }
        .chart-placeholder {
          min-height: 250px;
        }
        .chart-bars {
          display: flex;
          justify-content: space-around;
          align-items: flex-end;
          height: 200px;
          padding: 0 20px;
        }
        .bar-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .bar {
          width: 50px;
          background: linear-gradient(to top, var(--accent-primary), #ff8c66);
          border-radius: 6px 6px 0 0;
          transition: height 0.3s;
        }
        .bar-label {
          color: var(--text-secondary);
          font-size: 0.85em;
        }
        .chart-note {
          text-align: center;
          color: var(--text-secondary);
          margin-top: 20px;
          font-size: 0.95em;
        }
        .reports-section {
          margin-bottom: 30px;
        }
        .reports-section h2 {
          color: var(--text-primary);
          margin-bottom: 20px;
        }
        .reports-list {
          display: grid;
          gap: 15px;
        }
        .report-card {
          display: flex;
          gap: 20px;
          background: var(--card-bg);
          border-radius: 12px;
          padding: 20px;
          align-items: center;
        }
        .report-icon {
          font-size: 2em;
        }
        .report-info {
          flex: 1;
        }
        .report-info h4 {
          color: var(--text-primary);
          margin-bottom: 5px;
        }
        .report-meta {
          display: flex;
          gap: 8px;
          color: var(--text-muted);
          font-size: 0.85em;
        }
        .report-actions {
          display: flex;
          gap: 10px;
        }
        .action-btn {
          background: var(--bg-tertiary);
          border: none;
          padding: 10px 18px;
          border-radius: 8px;
          color: var(--text-primary);
          cursor: pointer;
          font-size: 0.9em;
        }
        .action-btn.primary {
          background: var(--accent-primary);
          color: white;
        }
        .action-btn:hover {
          opacity: 0.9;
        }
        .generating-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          font-size: 0.9em;
        }
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid var(--border-color);
          border-top-color: var(--accent-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .quick-reports h2 {
          color: var(--text-primary);
          margin-bottom: 20px;
        }
        .quick-reports-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
        }
        .quick-report-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          background: var(--card-bg);
          border: 2px solid var(--border-color);
          padding: 25px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          color: var(--text-primary);
        }
        .quick-report-btn:hover {
          border-color: var(--accent-primary);
          background: rgba(255, 107, 53, 0.05);
        }
        .qr-icon {
          font-size: 2em;
        }
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .report-card {
            flex-wrap: wrap;
          }
          .report-actions {
            width: 100%;
            justify-content: flex-end;
          }
          .quick-reports-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
      <Joyride
        steps={tourSteps}
        run={run}
        continuous
        showProgress
        showSkipButton
        scrollToFirstStep
        callback={handleJoyrideCallback}
        tooltipComponent={BefachTooltip}
        styles={joyrideStyles}
      />
      {!run && <TourFAB onStart={startTour} />}
    </AppLayout>
  );
}

export default function ReportsPage() {
  return (
    <Suspense fallback={null}>
      <ReportsContent />
    </Suspense>
  );
}

