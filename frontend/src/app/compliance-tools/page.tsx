'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout';
import { useMobile } from '@/hooks/useMobile';
import { useTour } from '@/hooks/useTour';
import { complianceTourSteps, mobileComplianceTourSteps } from '@/lib/tourSteps';
import TourFAB from '@/components/walkthrough/TourFAB';
import Joyride from 'react-joyride';
import { joyrideStyles, BefachTooltip } from '@/lib/tourConfig';
import { Modal } from '@/components/ui';
import { ComplianceSearch, ComplianceResultCard } from '@/components/compliance';
import { captureFeatureAction } from '@/lib/posthogEvents';
import {
  searchCompliance,
  getComplianceStats,
  getBOERecords,
  createBOE
} from '@/services/complianceService';
import {
  ComplianceSearchParams,
  ComplianceRequirement,
  ComplianceStats,
  BOERecord
} from '@/types/compliance';
import {
  Shield,
  FileText,
  AlertCircle,
  TrendingUp,
  Activity,
  ArrowRight,
  Download,
  Clock,
  Package
} from 'lucide-react';

function ComplianceToolsContent() {
  const { isMobile } = useMobile();
  const tourSteps = isMobile ? mobileComplianceTourSteps : complianceTourSteps;
  const { run, startTour, handleJoyrideCallback } = useTour({ tourId: 'compliance-tools', steps: tourSteps });
  const [boeModal, setBoeModal] = useState(false);
  const [searchResults, setSearchResults] = useState<ComplianceRequirement[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [stats, setStats] = useState<ComplianceStats | null>(null);
  const [recentBOEs, setRecentBOEs] = useState<BOERecord[]>([]);

  // Load statistics on mount
  useEffect(() => {
    loadStats();
    loadRecentBOEs();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getComplianceStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadRecentBOEs = async () => {
    try {
      const boes = getBOERecords();
      setRecentBOEs(boes.slice(0, 5));
    } catch (error) {
      console.error('Failed to load BOEs:', error);
    }
  };

  const handleSearch = async (params: ComplianceSearchParams) => {
    setIsSearching(true);
    try {
      const result = await searchCompliance(params);
      setSearchResults(result.requirements);
      captureFeatureAction('compliance', 'checked', { hsn_code: params.hsnCode });
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleApplyLicense = (licenseType: string) => {
    console.log('Apply for license:', licenseType);
    // TODO: Implement license application flow
  };

  return (
    <AppLayout searchPlaceholder="Search regulations, HSN codes...">      <div className="dashboard-container">
        {/* Welcome Section with Quick Actions */}
        <div id="compliance-welcome" className="welcome-section">
          <div className="welcome-content">
            <h1 className="welcome-title">Compliance & Regulatory Tools <Shield size={20} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 8 }} /></h1>
            <p className="welcome-subtitle">
              Customs clearance, BOE filing, duty calculation, and EXIM regulation compliance made easy
            </p>          </div>
          <div className="quick-actions-bar">
            <button onClick={() => setBoeModal(true)} className="quick-action-button">
              <div className="action-icon-wrapper" style={{ backgroundColor: '#3b82f615' }}>
                <FileText className="action-icon" style={{ color: '#3b82f6' }} />
              </div>
              <div className="action-content">
                <div className="action-title">File BOE</div>
                <div className="action-count">Quick filing</div>
              </div>
            </button>
            {/* <Link href="#regulations" className="quick-action-button">
              <div className="action-icon-wrapper" style={{ backgroundColor: '#10b98115' }}>
                <Shield className="action-icon" style={{ color: '#10b981' }} />
              </div>
              <div className="action-content">
                <div className="action-title">Check</div>
                <div className="action-title">Regulations</div>
              </div>
            </Link> */}
            {/* <Link href="#forms" className="quick-action-button">
              <div className="action-icon-wrapper" style={{ backgroundColor: '#f59e0b15' }}>
                <Download className="action-icon" style={{ color: '#f59e0b' }} />
              </div>
              <div className="action-content">
                <div className="action-title">Download Forms</div>
                <div className="action-count">All formats</div>
              </div>
            </Link> */}
            {/* <Link href="#alerts" className="quick-action-button">
              <div className="action-icon-wrapper" style={{ backgroundColor: '#8b5cf615' }}>
                <AlertCircle className="action-icon" style={{ color: '#8b5cf6' }} />
              </div>
              <div className="action-content">
                <div className="action-title">Active Alerts</div>
                <div className="action-count">{stats?.recentNotifications?.length || 0} new</div>
              </div>
            </Link> */}
          </div>
        </div>

        {/* Metrics Grid */}
        <div id="compliance-metrics" className="metrics-grid">
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon-wrapper">
                <FileText className="metric-icon" />
              </div>
              <span className="metric-trend trend-up">
                <Activity className="trend-icon" />
                +8%
              </span>
            </div>
            <div className="metric-value">1,847</div>
            <div className="metric-label">BOE Filed</div>
            <div className="metric-subvalue">124 this month</div>
            <div className="metric-change">vs last month</div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon-wrapper">
                <Shield className="metric-icon" />
              </div>
              <span className="metric-trend trend-up">
                <Activity className="trend-icon" />
                +0.3%
              </span>
            </div>
            <div className="metric-value">99.8%</div>
            <div className="metric-label">Compliance Rate</div>
            <div className="metric-subvalue">Exceptional</div>
            <div className="metric-change">0.3% improvement</div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon-wrapper">
                <AlertCircle className="metric-icon" />
              </div>
              <span className="metric-trend trend-up">
                <Activity className="trend-icon" />
                +3
              </span>
            </div>
            <div className="metric-value">12</div>
            <div className="metric-label">Active Alerts</div>
            <div className="metric-subvalue">3 new today</div>
            <div className="metric-change">Requires attention</div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-icon-wrapper">
                <Clock className="metric-icon" />
              </div>
              <span className="metric-trend trend-down">
                <Activity className="trend-icon" />
                -32%
              </span>
            </div>
            <div className="metric-value">2.4d</div>
            <div className="metric-label">Avg Clearance Time</div>
            <div className="metric-subvalue">Best in class</div>
            <div className="metric-change">32% faster than avg</div>
          </div>
        </div>

        {/* Compliance Search Section */}
        <div id="compliance-search" className="search-section">
          <div className="section-header">
            <h2 className="section-title">Search Compliance Requirements</h2>
          </div>
          <div>
            <ComplianceSearch
              onSearch={handleSearch}
              isLoading={isSearching}
              placeholder="Search by HSN code (e.g., 8517) or product description (e.g., smartphones)..."
            />
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="results-section">
            <div className="section-header">
              <h2 className="section-title">
                Search Results ({searchResults.length} found)
              </h2>
              <button onClick={() => setSearchResults([])} className="section-link">
                Clear Results
              </button>
            </div>
            <div className="results-grid">
              {searchResults.map((requirement) => (
                <ComplianceResultCard
                  key={requirement.id}
                  requirement={requirement}
                  onApplyLicense={handleApplyLicense}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recent BOE Filings Table */}
        <div id="compliance-boe" className="requirements-section">
          <div className="section-header">
            <h2 className="section-title">Recent BOE Filings</h2>
            <button onClick={() => setBoeModal(true)} className="section-link">
              + File New BOE
            </button>
          </div>

          <div className="requirements-table">
            <div className="table-header">
              <div className="th-cell">BOE / Import #</div>
              <div className="th-cell">Product</div>
              <div className="th-cell">Port</div>
              <div className="th-cell">Duty Paid</div>
              <div className="th-cell">Filed Date</div>
              <div className="th-cell">Status</div>
            </div>

            <div className="table-row">
              <div className="td-cell">
                <div className="product-info">
                  <Package className="product-icon" />
                  <div>
                    <strong>BOE-2847-2025</strong>
                    <br />
                    <small style={{ color: 'var(--text-secondary)' }}>IMP-2847</small>
                  </div>
                </div>
              </div>
              <div className="td-cell">LED Bulbs 9W</div>
              <div className="td-cell">JNPT, Mumbai</div>
              <div className="td-cell" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                $428
              </div>
              <div className="td-cell">Nov 20, 2025</div>
              <div className="td-cell">
                <span className="status-badge status-completed">Cleared</span>
              </div>
            </div>

            <div className="table-row">
              <div className="td-cell">
                <div className="product-info">
                  <Package className="product-icon" />
                  <div>
                    <strong>BOE-2846-2025</strong>
                    <br />
                    <small style={{ color: 'var(--text-secondary)' }}>IMP-2846</small>
                  </div>
                </div>
              </div>
              <div className="td-cell">Mobile Chargers</div>
              <div className="td-cell">Chennai Port</div>
              <div className="td-cell" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                $180
              </div>
              <div className="td-cell">Nov 19, 2025</div>
              <div className="td-cell">
                <span className="status-badge status-in-review">Under Review</span>
              </div>
            </div>

            <div className="table-row">
              <div className="td-cell">
                <div className="product-info">
                  <Package className="product-icon" />
                  <div>
                    <strong>BOE-2845-2025</strong>
                    <br />
                    <small style={{ color: 'var(--text-secondary)' }}>IMP-2845</small>
                  </div>
                </div>
              </div>
              <div className="td-cell">Cotton Fabric</div>
              <div className="td-cell">Kolkata Port</div>
              <div className="td-cell" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                $374
              </div>
              <div className="td-cell">Nov 18, 2025</div>
              <div className="td-cell">
                <span className="status-badge status-completed">Cleared</span>
              </div>
            </div>

            <div className="table-row">
              <div className="td-cell">
                <div className="product-info">
                  <Package className="product-icon" />
                  <div>
                    <strong>BOE-2844-2025</strong>
                    <br />
                    <small style={{ color: 'var(--text-secondary)' }}>IMP-2844</small>
                  </div>
                </div>
              </div>
              <div className="td-cell">Bluetooth Speakers</div>
              <div className="td-cell">JNPT, Mumbai</div>
              <div className="td-cell" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                $675
              </div>
              <div className="td-cell">Nov 17, 2025</div>
              <div className="td-cell">
                <span className="status-badge status-warning">Pending Docs</span>
              </div>
            </div>

            <div className="table-row">
              <div className="td-cell">
                <div className="product-info">
                  <Package className="product-icon" />
                  <div>
                    <strong>BOE-2843-2025</strong>
                    <br />
                    <small style={{ color: 'var(--text-secondary)' }}>IMP-2843</small>
                  </div>
                </div>
              </div>
              <div className="td-cell">Solar Panels 300W</div>
              <div className="td-cell">ICD Bangalore</div>
              <div className="td-cell" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                $902
              </div>
              <div className="td-cell">Nov 16, 2025</div>
              <div className="td-cell">
                <span className="status-badge status-completed">Cleared</span>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Features */}
        <div className="features-section">
          <div className="section-header">
            <h2 className="section-title">Compliance Tools Features</h2>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FileText style={{ width: 22, height: 22 }} />
              </div>
              <h3>BOE Management</h3>
              <p>File, track, and manage Bill of Entry documents electronically with automated processing.</p>
              <span className="feature-link">File Now →</span>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Shield style={{ width: 22, height: 22 }} />
              </div>
              <h3>Customs Clearance</h3>
              <p>Streamline customs clearance process with automated document verification and submission.</p>
              <span className="feature-link">Learn More →</span>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <AlertCircle style={{ width: 22, height: 22 }} />
              </div>
              <h3>Regulation Updates</h3>
              <p>Get real-time alerts on changes to import regulations, duties, and compliance requirements.</p>
              <span className="feature-link">Subscribe →</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOE Filing Modal */}
      <Modal isOpen={boeModal} onClose={() => setBoeModal(false)} title="File Bill of Entry">
        <p style={{ color: '#5a6c7d', marginBottom: '30px' }}>Enter shipment details to file your BOE</p>
        <form>
          <div className="form-group">
            <label>Import Order Number</label>
            <input type="text" placeholder="Enter order number" required />
          </div>
          <div className="form-group">
            <label>Product Description</label>
            <input type="text" placeholder="Enter product name" required />
          </div>
          <div className="form-group">
            <label>HSN Code</label>
            <input type="text" placeholder="e.g., 8539" required />
          </div>
          <div className="form-group">
            <label>Port of Entry</label>
            <select required>
              <option value="">Select port</option>
              <option value="jnpt">JNPT, Mumbai</option>
              <option value="chennai">Chennai Port</option>
              <option value="kolkata">Kolkata Port</option>
              <option value="bangalore">ICD Bangalore</option>
              <option value="delhi">ICD Delhi</option>
            </select>
          </div>
          <div className="form-group">
            <label>Invoice Value (USD)</label>
            <input type="number" placeholder="Enter invoice value" required />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={() => setBoeModal(false)}>Cancel</button>
            <button type="submit" className="btn-submit">File BOE</button>
          </div>
        </form>
      </Modal>

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
          gap: 2rem;
        }

        .welcome-content {
          flex: 0 0 auto;
          min-width: 300px;
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
          flex-wrap: wrap;
        }

        .quick-action-button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1.125rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.625rem;
          text-decoration: none;
          color: var(--text-primary);
          transition: all 0.2s ease;
          min-width: 160px;
          cursor: pointer;
          flex: 0 0 auto;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }

        .quick-action-button:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          transform: translateY(-1px);
          border-color: #d1d5db;
          background: #fafafa;
        }

        .action-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          flex-shrink: 0;
        }

        .action-icon {
          width: 18px;
          height: 18px;
        }

        .action-content {
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .action-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .action-count {
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-weight: 400;
          line-height: 1.2;
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
          font-weight: 500;
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

        .search-section,
        .results-section,
        .requirements-section {
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
          cursor: pointer;
          background: none;
          border: none;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .section-link:hover {
          background: rgba(249, 115, 22, 0.05);
          color: var(--accent-secondary);
        }

        .results-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .requirements-table {
          background: white;
          border-radius: 0.75rem;
          border: 1px solid var(--border-color);
          overflow: hidden;
        }

        .table-header {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1.2fr 0.8fr 1fr 1fr;
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
          grid-template-columns: 2fr 1.5fr 1.2fr 0.8fr 1fr 1fr;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border-color);
          transition: background 0.2s;
        }

        .table-row:last-child {
          border-bottom: none;
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

        .status-completed {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        .status-pending {
          background: rgba(251, 191, 36, 0.1);
          color: #f59e0b;
        }

        .status-in-review {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }

        .status-warning {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .features-section {
          margin-bottom: 2rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .feature-card {
          background: white;
          padding: 2rem;
          border-radius: 0.75rem;
          border: 1px solid var(--border-color);
          transition: all 0.2s;
        }

        .feature-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transform: translateY(-2px);
        }

        .feature-icon {
          width: 3rem;
          height: 3rem;
          background: rgba(249, 115, 22, 0.1);
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-primary);
          margin-bottom: 1rem;
        }

        .feature-card h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: var(--text-primary);
        }

        .feature-card p {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .feature-link {
          color: var(--accent-primary);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.2s;
        }

        .feature-link:hover {
          color: var(--accent-secondary);
        }

        @media (max-width: 1400px) {
          .quick-actions-bar {
            flex-wrap: wrap;
          }

          .quick-action-button {
            min-width: 140px;
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

          .dashboard-container {
            padding: 1rem;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .table-header,
          .table-row {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            padding: 1rem;
          }

          .th-cell {
            display: none;
          }

          .td-cell::before {
            content: attr(data-label);
            font-weight: 500;
            margin-right: 0.5rem;
            color: var(--text-secondary);
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

export default function ComplianceToolsPage() {
  return (
    <Suspense fallback={null}>
      <ComplianceToolsContent />
    </Suspense>
  );
}