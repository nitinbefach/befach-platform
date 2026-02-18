'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFeedbackTrigger } from '@/hooks/useFeedbackTrigger';
import {
  History,
  Search,
  ArrowUpDown,
  Download,
  Trash2,
  Eye,
  Copy,
  Star,
  ChevronLeft,
  ChevronRight,
  Calculator,
  Ship,
  Plane,
  Truck,
  Calendar,
  ArrowLeft,
} from 'lucide-react';
import { historyStorage, type CalculationRecord, type FilterCriteria } from '@/lib/historyStorage';
import { safeStorage } from '@/lib/safeStorage';

const ITEMS_PER_PAGE = 12;

const modeIcons: Record<string, any> = { sea: Ship, air: Plane, road: Truck };

export default function HistoryPage() {
  const router = useRouter();
  const { triggerTimeBasedFeedback, promptElement } = useFeedbackTrigger();

  useEffect(() => {
    triggerTimeBasedFeedback('cost-calculator-history', 20000);
  }, [triggerTimeBasedFeedback]);

  // State
  const [calculations, setCalculations] = useState<CalculationRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'cost' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Load calculations from localStorage
  useEffect(() => {
    loadCalculations();
  }, []);

  const loadCalculations = () => {
    setLoading(true);
    try {
      const records = historyStorage.getAll({ sortBy: 'date', sortOrder: 'desc' });
      setCalculations(records);
    } catch (error) {
      console.error('Error loading history:', error);
      setCalculations([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter + sort
  const filteredCalculations = useMemo(() => {
    let filtered = [...calculations];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(calc => {
        const text = [
          calc.input.productName,
          calc.input.hsnCode,
          calc.input.originPort,
          calc.input.destinationPort,
          calc.metadata.notes,
        ].filter(Boolean).join(' ').toLowerCase();
        return text.includes(q);
      });
    }

    filtered.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case 'date':
          cmp = new Date(a.metadata.calculatedAt).getTime() - new Date(b.metadata.calculatedAt).getTime();
          break;
        case 'cost':
          cmp = (a.result?.totalLandedCost || 0) - (b.result?.totalLandedCost || 0);
          break;
        case 'name':
          cmp = a.input.productName.localeCompare(b.input.productName);
          break;
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    return filtered;
  }, [calculations, searchQuery, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredCalculations.length / ITEMS_PER_PAGE);
  const paginatedCalcs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCalculations.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCalculations, currentPage]);

  // Reset page on filter change
  useEffect(() => { setCurrentPage(1); }, [searchQuery, sortBy, sortOrder]);

  // Stats
  const stats = useMemo(() => historyStorage.getStats(), [calculations]);

  // Handlers
  const handleView = (id: string) => router.push(`/cost-calculator/results/${id}`);

  const handleDuplicate = (calc: CalculationRecord) => {
    safeStorage.setItem('duplicateCalculation', JSON.stringify(calc.input));
    router.push('/cost-calculator');
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this calculation?')) {
      historyStorage.delete(id);
      loadCalculations();
    }
  };

  const handleToggleFavorite = (calc: CalculationRecord) => {
    historyStorage.update(calc.id, {
      metadata: { ...calc.metadata, isFavorite: !calc.metadata.isFavorite },
    });
    loadCalculations();
  };

  const handleExportCSV = () => {
    const csv = historyStorage.exportToCSV();
    if (!csv) return;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calculations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const fmt = (v: number, cur = 'USD') =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: cur, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const getModeBadgeColor = (mode: string) => {
    switch (mode) {
      case 'sea': return { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' };
      case 'air': return { bg: '#fef3c7', text: '#d97706', border: '#fde68a' };
      case 'road': return { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' };
      default: return { bg: '#f1f5f9', text: '#64748b', border: '#e2e8f0' };
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="history-page">
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>Loading history...</p>
        </div>
        <style jsx>{`
          .history-page { max-width: 1200px; margin: 0 auto; padding: 2rem; }
          .loading-state { text-align: center; padding: 4rem 2rem; color: var(--text-secondary, #64748b); }
          .loading-spinner {
            width: 32px; height: 32px; margin: 0 auto 1rem;
            border: 3px solid var(--border-color, #e2e8f0);
            border-top-color: #f97316; border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="history-page">
      {/* Back + Header */}
      <div className="page-header">
        <Link href="/cost-calculator" className="back-link">
          <ArrowLeft size={18} />
          <span>Back to Calculator</span>
        </Link>
        <div className="header-row">
          <div className="header-title">
            <div className="header-icon-wrap">
              <History size={20} />
            </div>
            <div>
              <h1>Calculation History</h1>
              <p className="header-sub">{stats.totalCalculations} calculation{stats.totalCalculations !== 1 ? 's' : ''} saved</p>
            </div>
          </div>
          <div className="header-actions">
            {calculations.length > 0 && (
              <button className="btn-outline" onClick={handleExportCSV}>
                <Download size={15} />
                <span>Export</span>
              </button>
            )}
            <Link href="/cost-calculator" className="btn-primary">
              <Calculator size={15} />
              <span>New Calculation</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      {calculations.length > 0 && (
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-value">{stats.totalCalculations}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{fmt(stats.averageLandedCost)}</span>
            <span className="stat-label">Avg Cost</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{fmt(stats.totalDutiesPaid)}</span>
            <span className="stat-label">Duties Paid</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">
              {stats.thisWeekCount}
              {stats.thisWeekCount !== stats.lastWeekCount && (
                <span className={`stat-trend ${stats.thisWeekCount > stats.lastWeekCount ? 'up' : 'down'}`}>
                  {stats.thisWeekCount > stats.lastWeekCount ? '+' : ''}{stats.thisWeekCount - stats.lastWeekCount}
                </span>
              )}
            </span>
            <span className="stat-label">This Week</span>
          </div>
        </div>
      )}

      {/* Controls */}
      {calculations.length > 0 && (
        <div className="controls-bar">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search products, HSN codes, ports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="sort-group">
            <ArrowUpDown size={14} />
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-');
                setSortBy(sb as any);
                setSortOrder(so as any);
              }}
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="cost-desc">Highest Cost</option>
              <option value="cost-asc">Lowest Cost</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
            </select>
          </div>
        </div>
      )}

      {/* Empty State */}
      {calculations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon-wrap">
            <Calculator size={36} />
          </div>
          <h3>No calculations yet</h3>
          <p>Use the cost calculator to estimate landed costs. Your results will appear here automatically when you save them.</p>
          <Link href="/cost-calculator" className="btn-primary-lg">
            <Calculator size={16} />
            Start Calculating
          </Link>
        </div>
      ) : filteredCalculations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon-wrap secondary">
            <Search size={36} />
          </div>
          <h3>No matching results</h3>
          <p>Try adjusting your search term</p>
          <button className="btn-outline" onClick={() => setSearchQuery('')}>Clear Search</button>
        </div>
      ) : (
        <>
          {/* Cards Grid */}
          <div className="cards-grid">
            {paginatedCalcs.map((calc) => {
              const ModeIcon = modeIcons[calc.input.shippingMode] || Ship;
              const modeColors = getModeBadgeColor(calc.input.shippingMode);
              return (
                <div key={calc.id} className="calc-card">
                  <div className="card-top">
                    <div className="card-title-row">
                      <h3 className="card-product">{calc.input.productName || 'Unnamed Product'}</h3>
                      <button
                        className={`fav-btn ${calc.metadata.isFavorite ? 'active' : ''}`}
                        onClick={() => handleToggleFavorite(calc)}
                        title={calc.metadata.isFavorite ? 'Remove favorite' : 'Add favorite'}
                      >
                        <Star size={16} fill={calc.metadata.isFavorite ? '#f97316' : 'none'} />
                      </button>
                    </div>
                    <div className="card-meta">
                      <span className="hsn-badge">{calc.input.hsnCode}</span>
                      <span
                        className="mode-badge"
                        style={{ background: modeColors.bg, color: modeColors.text, borderColor: modeColors.border }}
                      >
                        <ModeIcon size={12} />
                        {calc.input.shippingMode.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="card-row">
                      <span className="row-label">FOB Value</span>
                      <span className="row-value">{fmt(parseFloat(calc.input.fobValue) || 0)}</span>
                    </div>
                    <div className="card-row highlight">
                      <span className="row-label">Landed Cost</span>
                      <span className="row-value accent">
                        {calc.result ? fmt(calc.result.totalLandedCost) : '—'}
                      </span>
                    </div>
                    {(calc.input.originPort || calc.input.destinationPort) && (
                      <div className="card-row">
                        <span className="row-label">Route</span>
                        <span className="row-value route-text">
                          {(calc.input.originPort || '').split(' - ')[0] || '—'}
                          {' → '}
                          {(calc.input.destinationPort || '').split(' - ')[0] || '—'}
                        </span>
                      </div>
                    )}
                    <div className="card-row">
                      <span className="row-label">Date</span>
                      <span className="row-value">
                        <Calendar size={12} style={{ marginRight: 4, opacity: 0.5 }} />
                        {fmtDate(calc.metadata.calculatedAt)}
                      </span>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button className="action-btn view" onClick={() => handleView(calc.id)} title="View details">
                      <Eye size={14} />
                      <span>View</span>
                    </button>
                    <button className="action-btn" onClick={() => handleDuplicate(calc)} title="Duplicate">
                      <Copy size={14} />
                      <span>Duplicate</span>
                    </button>
                    <button className="action-btn danger" onClick={() => handleDelete(calc.id)} title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>
              <div className="page-info">
                {currentPage} of {totalPages}
              </div>
              <button
                className="page-btn"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      {promptElement}

      <style jsx>{`
        .history-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.5rem 2rem 3rem;
        }

        /* ── Header ── */
        .page-header {
          margin-bottom: 1.5rem;
        }

        :global(.back-link) {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--text-secondary, #64748b);
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 1rem;
          transition: color 0.2s;
        }
        :global(.back-link:hover) {
          color: #f97316;
        }

        .header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-icon-wrap {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .header-title h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary, #1e293b);
          margin: 0;
          line-height: 1.2;
        }

        .header-sub {
          font-size: 0.82rem;
          color: var(--text-secondary, #64748b);
          margin: 2px 0 0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border: 1.5px solid var(--border-color, #e2e8f0);
          border-radius: 10px;
          background: var(--bg-primary, #fff);
          color: var(--text-primary, #1e293b);
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }
        .btn-outline:hover {
          border-color: #f97316;
          color: #f97316;
          background: #fff7ed;
        }

        :global(.btn-primary) {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
          font-family: inherit;
        }
        :global(.btn-primary:hover) {
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
          transform: translateY(-1px);
        }

        /* ── Stats Row ── */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 1.25rem;
        }

        .stat-card {
          background: var(--bg-primary, #fff);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 12px;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          transition: all 0.2s;
        }
        .stat-card:hover {
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        .stat-value {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary, #1e293b);
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .stat-trend {
          font-size: 0.72rem;
          font-weight: 600;
          padding: 1px 6px;
          border-radius: 6px;
        }
        .stat-trend.up { background: #ecfdf5; color: #059669; }
        .stat-trend.down { background: #fef2f2; color: #dc2626; }

        .stat-label {
          font-size: 0.75rem;
          color: var(--text-secondary, #64748b);
          font-weight: 500;
        }

        /* ── Controls ── */
        .controls-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 1.25rem;
        }

        .search-box {
          flex: 1;
          position: relative;
          max-width: 400px;
        }
        .search-box :global(.search-icon) {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary, #94a3b8);
          pointer-events: none;
        }
        .search-box input {
          width: 100%;
          padding: 9px 12px 9px 36px;
          border: 1.5px solid var(--border-color, #e2e8f0);
          border-radius: 10px;
          background: var(--bg-primary, #fff);
          color: var(--text-primary, #1e293b);
          font-size: 0.85rem;
          font-family: inherit;
          transition: all 0.2s;
        }
        .search-box input:focus {
          outline: none;
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }
        .search-box input::placeholder {
          color: var(--text-secondary, #94a3b8);
        }

        .sort-group {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-secondary, #64748b);
          flex-shrink: 0;
        }
        .sort-group select {
          padding: 9px 12px;
          border: 1.5px solid var(--border-color, #e2e8f0);
          border-radius: 10px;
          background: var(--bg-primary, #fff);
          color: var(--text-primary, #1e293b);
          font-size: 0.82rem;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s;
        }
        .sort-group select:focus {
          outline: none;
          border-color: #f97316;
        }

        /* ── Empty State ── */
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: var(--bg-primary, #fff);
          border: 2px dashed var(--border-color, #e2e8f0);
          border-radius: 16px;
        }

        .empty-icon-wrap {
          width: 72px;
          height: 72px;
          border-radius: 20px;
          background: linear-gradient(135deg, #fff7ed, #ffedd5);
          color: #f97316;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
        }
        .empty-icon-wrap.secondary {
          background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
          color: var(--text-secondary, #64748b);
        }

        .empty-state h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary, #1e293b);
          margin: 0 0 0.5rem;
        }
        .empty-state p {
          color: var(--text-secondary, #64748b);
          font-size: 0.9rem;
          line-height: 1.5;
          margin: 0 0 1.5rem;
          max-width: 380px;
          margin-left: auto;
          margin-right: auto;
        }

        :global(.btn-primary-lg) {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
        }
        :global(.btn-primary-lg:hover) {
          box-shadow: 0 6px 20px rgba(249, 115, 22, 0.35);
          transform: translateY(-2px);
        }

        /* ── Cards Grid ── */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 1.5rem;
        }

        .calc-card {
          background: var(--bg-primary, #fff);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 14px;
          overflow: hidden;
          transition: all 0.2s ease;
        }
        .calc-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
          transform: translateY(-2px);
        }

        .card-top {
          padding: 14px 16px 10px;
          border-bottom: 1px solid var(--border-color, #f1f5f9);
        }

        .card-title-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 8px;
        }

        .card-product {
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--text-primary, #1e293b);
          margin: 0;
          line-height: 1.3;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .fav-btn {
          width: 28px;
          height: 28px;
          border: none;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          color: var(--text-secondary, #94a3b8);
          transition: all 0.2s;
          flex-shrink: 0;
          padding: 0;
        }
        .fav-btn:hover { background: #fff7ed; color: #f97316; }
        .fav-btn.active { color: #f97316; }

        .card-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .hsn-badge {
          font-size: 0.72rem;
          font-weight: 600;
          font-family: 'SF Mono', 'Fira Code', monospace;
          padding: 2px 8px;
          background: var(--bg-secondary, #f8fafc);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 6px;
          color: var(--text-primary, #475569);
          letter-spacing: 0.02em;
        }

        .mode-badge {
          font-size: 0.68rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 6px;
          border: 1px solid;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        /* ── Card Body ── */
        .card-body {
          padding: 10px 16px 12px;
        }

        .card-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 5px 0;
          gap: 8px;
        }
        .card-row.highlight {
          padding: 8px 10px;
          margin: 4px -10px;
          background: #fff7ed;
          border-radius: 8px;
        }

        .row-label {
          font-size: 0.78rem;
          color: var(--text-secondary, #64748b);
          flex-shrink: 0;
        }
        .row-value {
          font-size: 0.82rem;
          font-weight: 500;
          color: var(--text-primary, #1e293b);
          text-align: right;
          display: flex;
          align-items: center;
        }
        .row-value.accent {
          font-weight: 700;
          color: #ea580c;
          font-size: 0.95rem;
        }
        .route-text {
          font-size: 0.78rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 160px;
        }

        /* ── Card Actions ── */
        .card-actions {
          display: flex;
          gap: 6px;
          padding: 10px 16px 14px;
          border-top: 1px solid var(--border-color, #f1f5f9);
        }

        .action-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 7px 8px;
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 8px;
          background: var(--bg-primary, #fff);
          color: var(--text-secondary, #64748b);
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }
        .action-btn:hover {
          border-color: #f97316;
          color: #f97316;
          background: #fff7ed;
        }
        .action-btn.view {
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: #fff;
          border-color: transparent;
        }
        .action-btn.view:hover {
          box-shadow: 0 2px 8px rgba(249, 115, 22, 0.3);
          background: linear-gradient(135deg, #ea580c, #c2410c);
          color: #fff;
        }
        .action-btn.danger:hover {
          border-color: #ef4444;
          color: #ef4444;
          background: #fef2f2;
        }

        /* ── Pagination ── */
        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 0.5rem 0 1rem;
        }
        .page-btn {
          width: 36px;
          height: 36px;
          border: 1.5px solid var(--border-color, #e2e8f0);
          border-radius: 10px;
          background: var(--bg-primary, #fff);
          color: var(--text-primary, #1e293b);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .page-btn:hover:not(:disabled) {
          border-color: #f97316;
          color: #f97316;
          background: #fff7ed;
        }
        .page-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .page-info {
          font-size: 0.82rem;
          color: var(--text-secondary, #64748b);
          font-weight: 500;
          min-width: 70px;
          text-align: center;
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .history-page {
            padding: 1rem 1rem 2rem;
          }

          .header-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .header-actions {
            width: 100%;
          }
          .header-actions .btn-outline,
          :global(.header-actions .btn-primary) {
            flex: 1;
            justify-content: center;
          }
          .header-title h1 {
            font-size: 1.25rem;
          }
          .header-icon-wrap {
            width: 36px;
            height: 36px;
            border-radius: 10px;
          }

          .stats-row {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
          .stat-card { padding: 10px 12px; }
          .stat-value { font-size: 1rem; }

          .controls-bar {
            flex-direction: column;
            gap: 8px;
          }
          .search-box {
            max-width: none;
            width: 100%;
          }
          .sort-group {
            width: 100%;
          }
          .sort-group select {
            flex: 1;
          }

          .cards-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .empty-state {
            padding: 3rem 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .history-page {
            padding: 0.75rem 0.75rem 2rem;
          }
          .header-title h1 { font-size: 1.1rem; }
          .header-sub { font-size: 0.75rem; }
          .stat-value { font-size: 0.9rem; }
          .stat-label { font-size: 0.68rem; }
          .card-product { font-size: 0.85rem; }
          .row-value.accent { font-size: 0.88rem; }
          .route-text { max-width: 120px; }

          .action-btn span {
            display: none;
          }
          .action-btn {
            flex: 0;
            width: 34px;
            height: 34px;
            padding: 0;
          }
          .action-btn.view {
            flex: 1;
          }
          .action-btn.view span {
            display: inline;
          }
        }
      `}</style>
    </div>
  );
}
