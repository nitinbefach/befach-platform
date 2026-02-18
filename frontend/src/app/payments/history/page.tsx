'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useMobile } from '@/hooks/useMobile';
import {
  getPayments,
  filterPayments,
  getPaymentStats,
  exportPaymentsCSV,
} from '@/lib/payments';
import { STATUS_CONFIG, formatPaymentCurrency } from '@/lib/paymentConstants';
import type { PaymentRecord, PaymentFilters, PaymentStatus, PaymentSegment } from '@/types/payments';
import { Download, ChevronRight, X, Clock, ArrowUpRight, Wallet, Filter, Globe } from 'lucide-react';

export default function PaymentHistoryPage() {
  const { isMobile } = useMobile();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [filters, setFilters] = useState<PaymentFilters>({
    segment: 'all',
    status: 'all',
    dateRange: 'all',
    currency: 'all',
  });
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setPayments(getPayments());
  }, []);

  const filtered = filterPayments(payments, filters);
  const stats = getPaymentStats(payments);

  const handleExport = () => exportPaymentsCSV(filtered);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  // ─── Detail View ────────────────────────────────────────────────────
  if (selectedPayment) {
    const p = selectedPayment;
    const statusStyle = STATUS_CONFIG[p.status];

    return (
      <AppLayout>
        <div className="page-container">
          <button className="back-btn" onClick={() => setSelectedPayment(null)}>
            <X size={16} /> Close
          </button>

          <div className="detail-header">
            <span className="detail-segment">{p.segment === 'international' ? <><Globe size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> International</> : 'Local'}</span>
            <span className="detail-status" style={{ background: statusStyle.bg, color: statusStyle.text }}>
              {statusStyle.label}
            </span>
          </div>

          <h2 className="detail-id">{p.id}</h2>
          <p className="detail-ref">{p.referenceNumber}</p>

          <div className="detail-amount">
            {formatPaymentCurrency(p.amount, p.currency)}
            {p.currency !== 'INR' && (
              <span className="detail-inr"> ({formatPaymentCurrency(p.amountInINR, 'INR')})</span>
            )}
          </div>

          <div className="detail-card">
            <div className="detail-row"><span>Supplier</span><span>{p.supplierName}</span></div>
            <div className="detail-row"><span>Method</span><span>{p.methodLabel}</span></div>
            <div className="detail-row"><span>Purpose</span><span>{p.purpose}</span></div>
            {p.orderId && <div className="detail-row"><span>Order</span><span>{p.orderId}</span></div>}
            {p.invoiceNumber && <div className="detail-row"><span>Invoice</span><span>{p.invoiceNumber}</span></div>}
            {p.fxRate && <div className="detail-row"><span>FX Rate</span><span>1 {p.currency} = {p.fxRate.toFixed(2)} INR</span></div>}
            <div className="detail-row"><span>Fees</span><span>{formatPaymentCurrency(p.fees, 'INR')}</span></div>
            <div className="detail-row total"><span>Total Debit</span><span>{formatPaymentCurrency(p.totalDebit, 'INR')}</span></div>
          </div>

          <h3 className="timeline-title">Payment Timeline</h3>
          <div className="timeline">
            {p.timeline.map((event, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <span className="timeline-status">{event.status}</span>
                  <span className="timeline-desc">{event.description}</span>
                  <span className="timeline-time">{formatDate(event.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
          .page-container { max-width: 700px; padding: 20px; }
          .back-btn {
            display: inline-flex; align-items: center; gap: 6px;
            background: var(--bg-tertiary); border: none; padding: 8px 16px;
            border-radius: 8px; color: var(--text-primary); cursor: pointer;
            font-size: 0.85rem; font-weight: 500; margin-bottom: 20px;
          }
          .detail-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
          .detail-segment { font-size: 0.8rem; background: var(--bg-tertiary); padding: 4px 10px; border-radius: 6px; color: var(--text-secondary); }
          .detail-status { font-size: 0.75rem; font-weight: 600; padding: 4px 10px; border-radius: 10px; text-transform: capitalize; }
          .detail-id { font-size: 1.3rem; font-weight: 700; color: var(--text-primary); margin: 0 0 4px; }
          .detail-ref { font-family: monospace; font-size: 0.85rem; color: var(--text-muted); margin: 0 0 16px; }
          .detail-amount { font-size: 1.8rem; font-weight: 700; color: var(--accent-primary, #f97316); margin-bottom: 24px; }
          .detail-inr { font-size: 1rem; color: var(--text-secondary); font-weight: 500; }
          .detail-card { border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; margin-bottom: 28px; }
          .detail-row { display: flex; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid var(--border-color); font-size: 0.88rem; }
          .detail-row:last-child { border-bottom: none; }
          .detail-row span:first-child { color: var(--text-secondary); }
          .detail-row span:last-child { color: var(--text-primary); font-weight: 500; text-align: right; max-width: 60%; }
          .detail-row.total { background: var(--bg-tertiary); }
          .detail-row.total span:last-child { color: var(--accent-primary, #f97316); font-weight: 700; }

          .timeline-title { font-size: 1rem; color: var(--text-primary); margin: 0 0 16px; }
          .timeline { position: relative; padding-left: 24px; }
          .timeline::before { content: ''; position: absolute; left: 6px; top: 8px; bottom: 8px; width: 2px; background: var(--border-color); }
          .timeline-item { position: relative; margin-bottom: 20px; }
          .timeline-dot {
            position: absolute; left: -24px; top: 4px;
            width: 14px; height: 14px; border-radius: 50%;
            background: var(--accent-primary, #f97316); border: 2px solid var(--bg-secondary, #fff);
          }
          .timeline-content { display: flex; flex-direction: column; gap: 2px; }
          .timeline-status { font-size: 0.82rem; font-weight: 600; color: var(--text-primary); text-transform: capitalize; }
          .timeline-desc { font-size: 0.82rem; color: var(--text-secondary); }
          .timeline-time { font-size: 0.75rem; color: var(--text-muted); }

          @media (max-width: 768px) {
            .page-container { padding: 14px; padding-bottom: 100px; }
            .detail-amount { font-size: 1.4rem; }
            .detail-row { padding: 10px 14px; font-size: 0.84rem; }
          }
        `}</style>
      </AppLayout>
    );
  }

  // ─── Main List View ─────────────────────────────────────────────────
  return (
    <AppLayout>
      <div className="page-container">
        <div className="content-header">
          <h1>Payment History</h1>
          <p>Track all supplier payments made through the platform</p>
        </div>

        {/* Summary Cards */}
        <div className="summary-strip">
          <div className="summary-card">
            <Wallet size={20} className="summary-icon-el" />
            <div className="summary-content">
              <span className="summary-value">{formatPaymentCurrency(stats.totalPaidThisMonth, 'INR')}</span>
              <span className="summary-label">Paid (30 days)</span>
            </div>
          </div>
          <div className="summary-card">
            <Clock size={20} className="summary-icon-el" />
            <div className="summary-content">
              <span className="summary-value">{stats.pendingCount} ({formatPaymentCurrency(stats.pendingValue, 'INR')})</span>
              <span className="summary-label">Pending</span>
            </div>
          </div>
          <div className="summary-card">
            <ArrowUpRight size={20} className="summary-icon-el" />
            <div className="summary-content">
              <span className="summary-value">{stats.avgProcessingDays} days</span>
              <span className="summary-label">Avg. Processing</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <div className="segment-pills">
            {(['all', 'international', 'local'] as const).map(seg => (
              <button
                key={seg}
                className={`filter-pill ${filters.segment === seg ? 'active' : ''}`}
                onClick={() => setFilters(prev => ({ ...prev, segment: seg }))}
              >
                {seg === 'all' ? 'All' : seg === 'international' ? <><Globe size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> International</> : 'Local'}
              </button>
            ))}
          </div>

          {isMobile ? (
            <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
              <Filter size={16} /> Filters
            </button>
          ) : (
            <>
              <select
                value={filters.status || 'all'}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as PaymentStatus | 'all' }))}
              >
                <option value="all">All Statuses</option>
                <option value="initiated">Initiated</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
                <option value="on_hold">On Hold</option>
              </select>
              <select
                value={filters.dateRange || 'all'}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
              >
                <option value="30">Last 30 days</option>
                <option value="90">Last 3 months</option>
                <option value="365">Last year</option>
                <option value="all">All time</option>
              </select>
              <button className="btn-export" onClick={handleExport}>
                <Download size={14} /> Export CSV
              </button>
            </>
          )}
        </div>

        {/* Mobile Filter Sheet */}
        {isMobile && showFilters && (
          <div className="mobile-filters">
            <div className="mobile-filter-group">
              <label>Status</label>
              <select
                value={filters.status || 'all'}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as PaymentStatus | 'all' }))}
              >
                <option value="all">All Statuses</option>
                <option value="initiated">Initiated</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>
            <div className="mobile-filter-group">
              <label>Period</label>
              <select
                value={filters.dateRange || 'all'}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
              >
                <option value="30">Last 30 days</option>
                <option value="90">Last 3 months</option>
                <option value="365">Last year</option>
                <option value="all">All time</option>
              </select>
            </div>
            <button className="btn-export mobile-export" onClick={handleExport}>
              <Download size={14} /> Export CSV
            </button>
          </div>
        )}

        {/* Empty State */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <Wallet size={48} strokeWidth={1} />
            <h3>No payments found</h3>
            <p>Your supplier payments will appear here</p>
            <a href="/payments/new" className="empty-cta">Make a Payment</a>
          </div>
        ) : isMobile ? (
          /* Mobile: Card List */
          <div className="payment-cards">
            {filtered.map(p => {
              const statusStyle = STATUS_CONFIG[p.status];
              return (
                <button key={p.id} className="payment-card" onClick={() => setSelectedPayment(p)}>
                  <div className="card-top">
                    <span className="card-segment">{p.segment === 'international' ? <><Globe size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> International</> : 'Local'}</span>
                    <span className="card-status" style={{ background: statusStyle.bg, color: statusStyle.text }}>
                      {statusStyle.label}
                    </span>
                  </div>
                  <span className="card-id">{p.id}</span>
                  <div className="card-supplier">To: {p.supplierName}</div>
                  <div className="card-amount">
                    {formatPaymentCurrency(p.amount, p.currency)}
                    {p.currency !== 'INR' && (
                      <span className="card-inr"> ({formatPaymentCurrency(p.amountInINR, 'INR')})</span>
                    )}
                  </div>
                  <div className="card-bottom">
                    <span className="card-method">via {p.methodLabel}</span>
                    <span className="card-date">{formatDate(p.createdAt)}</span>
                  </div>
                  <ChevronRight size={16} className="card-arrow" />
                </button>
              );
            })}
          </div>
        ) : (
          /* Desktop: Table */
          <div className="table-container">
            <table className="payments-table">
              <thead>
                <tr>
                  <th>Payment</th>
                  <th>Date</th>
                  <th>Supplier</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const statusStyle = STATUS_CONFIG[p.status];
                  return (
                    <tr key={p.id} onClick={() => setSelectedPayment(p)} className="table-row-click">
                      <td>
                        <div className="txn-info">
                          <span className="txn-segment">{p.segment === 'international' ? <Globe size={12} /> : 'IN'}</span>
                          <div>
                            <span className="txn-id">{p.id}</span>
                            <span className="txn-purpose">{p.purpose.slice(0, 40)}{p.purpose.length > 40 ? '...' : ''}</span>
                          </div>
                        </div>
                      </td>
                      <td>{formatDate(p.createdAt)}</td>
                      <td>{p.supplierName}</td>
                      <td>
                        <span className="table-amount">{formatPaymentCurrency(p.amount, p.currency)}</span>
                        {p.currency !== 'INR' && (
                          <span className="table-inr">{formatPaymentCurrency(p.amountInINR, 'INR')}</span>
                        )}
                      </td>
                      <td>{p.methodLabel}</td>
                      <td>
                        <span className="status-badge" style={{ background: statusStyle.bg, color: statusStyle.text }}>
                          {statusStyle.label}
                        </span>
                      </td>
                      <td><ChevronRight size={16} className="row-arrow" /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        .page-container { max-width: 1100px; padding: 20px; }
        .content-header { margin-bottom: 24px; }
        .content-header h1 { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin: 0 0 6px; }
        .content-header p { font-size: 0.9rem; color: var(--text-secondary); margin: 0; }

        /* Summary */
        .summary-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
        .summary-card {
          background: var(--card-bg, var(--bg-secondary, #fff)); border-radius: 12px;
          padding: 18px 20px; display: flex; gap: 14px; align-items: center;
          border: 1px solid var(--border-color);
        }
        .summary-content { display: flex; flex-direction: column; }
        .summary-value { font-size: 1.05rem; font-weight: 700; color: var(--text-primary); }
        .summary-label { font-size: 0.78rem; color: var(--text-secondary); }

        /* Filters */
        .filter-bar { display: flex; gap: 12px; align-items: center; margin-bottom: 20px; flex-wrap: wrap; }
        .segment-pills { display: flex; gap: 6px; }
        .filter-pill {
          padding: 8px 16px; border-radius: 20px; font-size: 0.82rem;
          border: 1px solid var(--border-color); background: var(--bg-secondary, #fff);
          cursor: pointer; color: var(--text-secondary); transition: all 0.15s; white-space: nowrap;
        }
        .filter-pill.active { background: var(--accent-primary, #f97316); color: white; border-color: var(--accent-primary, #f97316); }
        .filter-bar select {
          padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 8px;
          background: var(--bg-secondary, #fff); color: var(--text-primary); font-size: 0.84rem;
        }
        .btn-export {
          display: flex; align-items: center; gap: 6px; margin-left: auto;
          background: var(--bg-tertiary); border: none; padding: 8px 16px;
          border-radius: 8px; color: var(--text-primary); cursor: pointer; font-size: 0.84rem; font-weight: 500;
        }
        .btn-export:hover { background: var(--accent-primary, #f97316); color: white; }
        .filter-toggle {
          display: flex; align-items: center; gap: 6px; margin-left: auto;
          background: var(--bg-tertiary); border: none; padding: 8px 14px;
          border-radius: 8px; color: var(--text-primary); cursor: pointer; font-size: 0.82rem;
        }

        /* Mobile Filters */
        .mobile-filters {
          background: var(--card-bg, var(--bg-secondary, #fff)); border: 1px solid var(--border-color);
          border-radius: 12px; padding: 16px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 12px;
        }
        .mobile-filter-group label { display: block; font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 4px; }
        .mobile-filter-group select { width: 100%; padding: 10px 12px; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-secondary, #fff); color: var(--text-primary); }
        .mobile-export { align-self: stretch; justify-content: center; }

        /* Table */
        .table-container {
          background: var(--card-bg, var(--bg-secondary, #fff)); border-radius: 12px;
          overflow: hidden; border: 1px solid var(--border-color);
        }
        .payments-table { width: 100%; border-collapse: collapse; }
        .payments-table th {
          text-align: left; padding: 14px 18px; background: var(--bg-tertiary);
          color: var(--text-secondary); font-size: 0.8rem; font-weight: 600;
        }
        .payments-table td { padding: 16px 18px; border-bottom: 1px solid var(--border-color); }
        .payments-table tr:last-child td { border-bottom: none; }
        .table-row-click { cursor: pointer; transition: background 0.15s; }
        .table-row-click:hover { background: var(--bg-tertiary); }

        .txn-info { display: flex; gap: 10px; align-items: center; }
        .txn-segment { font-size: 1.1rem; }
        .txn-id { display: block; font-weight: 600; font-size: 0.85rem; color: var(--text-primary); font-family: monospace; }
        .txn-purpose { display: block; font-size: 0.78rem; color: var(--text-muted); }
        .table-amount { display: block; font-weight: 600; color: var(--text-primary); font-size: 0.88rem; }
        .table-inr { display: block; font-size: 0.75rem; color: var(--text-muted); }

        .status-badge { padding: 4px 10px; border-radius: 10px; font-size: 0.75rem; font-weight: 600; text-transform: capitalize; }

        /* Mobile Cards */
        .payment-cards { display: flex; flex-direction: column; gap: 12px; }
        .payment-card {
          background: var(--card-bg, var(--bg-secondary, #fff)); border: 1px solid var(--border-color);
          border-radius: 14px; padding: 16px; text-align: left; cursor: pointer;
          width: 100%; position: relative; transition: all 0.15s;
        }
        .payment-card:active { transform: scale(0.99); }
        .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
        .card-segment { font-size: 0.72rem; background: var(--bg-tertiary); padding: 3px 8px; border-radius: 4px; color: var(--text-secondary); }
        .card-status { font-size: 0.7rem; font-weight: 600; padding: 3px 8px; border-radius: 8px; text-transform: capitalize; }
        .card-id { font-family: monospace; font-size: 0.82rem; color: var(--text-muted); display: block; margin-bottom: 8px; }
        .card-supplier { font-size: 0.88rem; color: var(--text-primary); font-weight: 500; margin-bottom: 4px; }
        .card-amount { font-size: 1.1rem; font-weight: 700; color: var(--accent-primary, #f97316); margin-bottom: 8px; }
        .card-inr { font-size: 0.82rem; color: var(--text-secondary); font-weight: 500; }
        .card-bottom { display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-muted); }

        /* Empty State */
        .empty-state { text-align: center; padding: 48px 20px; color: var(--text-muted); }
        .empty-state h3 { color: var(--text-primary); margin: 16px 0 8px; }
        .empty-state p { font-size: 0.88rem; margin: 0 0 20px; }
        .empty-cta {
          display: inline-block; background: linear-gradient(135deg, #f97316, #ea580c);
          color: white; padding: 12px 24px; border-radius: 10px; text-decoration: none;
          font-weight: 600; font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .page-container { padding: 14px; padding-bottom: 100px; }
          .content-header h1 { font-size: 1.25rem; }
          .summary-strip { grid-template-columns: 1fr; gap: 10px; overflow-x: auto; display: flex; }
          .summary-card { min-width: 200px; flex-shrink: 0; padding: 14px 16px; }
          .segment-pills { overflow-x: auto; flex-wrap: nowrap; }
          .filter-pill { white-space: nowrap; padding: 10px 16px; }
        }
        @media (max-width: 480px) {
          .page-container { padding: 12px; padding-bottom: 100px; }
          .summary-card { min-width: 170px; }
          .card-amount { font-size: 1rem; }
        }
      `}</style>
    </AppLayout>
  );
}
