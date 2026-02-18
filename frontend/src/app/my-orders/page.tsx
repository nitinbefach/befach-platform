'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout';
import { useMobile } from '@/hooks/useMobile';
import {
  Package, Clock, CheckCircle, DollarSign,
  Plus, Search, X, ChevronRight, Check, ArrowRight
} from 'lucide-react';
import {
  Order, STAGES, getOrders, saveOrders,
  getOrderCounts, filterOrders, groupByDate, createOrder
} from '@/lib/orders';

export default function MyOrdersPage() {
  const router = useRouter();
  const { isMobile } = useMobile();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sheetOrder, setSheetOrder] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Form state
  const [formProduct, setFormProduct] = useState('');
  const [formSupplier, setFormSupplier] = useState('');
  const [formQty, setFormQty] = useState('');
  const [formValue, setFormValue] = useState('');
  const [formDate, setFormDate] = useState('');

  // Load orders on mount
  useEffect(() => {
    setOrders(getOrders());
  }, []);

  // Derived data
  const counts = useMemo(() => getOrderCounts(orders), [orders]);
  const filtered = useMemo(
    () => filterOrders(orders, activeFilter, searchQuery),
    [orders, activeFilter, searchQuery]
  );
  const grouped = useMemo(() => groupByDate(filtered), [filtered]);

  // Filter handlers
  const handleFilter = useCallback((status: string) => {
    setActiveFilter(status);
    setExpandedId(null);
  }, []);

  const handleStatClick = useCallback((stat: string) => {
    if (stat === 'value') {
      handleFilter('all');
    } else {
      handleFilter(stat);
    }
  }, [handleFilter]);

  const getActiveStatFilter = () => {
    if (activeFilter === 'all') return 'all';
    if (activeFilter === 'delivered') return 'delivered';
    if (['processing', 'transit', 'customs'].includes(activeFilter)) return 'in_progress';
    return 'all';
  };

  // Card click
  const handleCardClick = useCallback((order: Order) => {
    if (isMobile) {
      setSheetOrder(order);
      document.body.style.overflow = 'hidden';
    } else {
      setExpandedId(prev => prev === order.id ? null : order.id);
    }
  }, [isMobile]);

  // Bottom sheet
  const closeSheet = useCallback(() => {
    setSheetOrder(null);
    document.body.style.overflow = '';
  }, []);

  // Toast
  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  }, []);

  // Create order
  const handleCreateOrder = useCallback(() => {
    const newOrder = createOrder({
      product: formProduct,
      supplier: formSupplier,
      qty: formQty,
      value: formValue,
      eta: formDate,
    });
    const updated = [newOrder, ...orders];
    setOrders(updated);
    saveOrders(updated);
    setFormProduct(''); setFormSupplier(''); setFormQty(''); setFormValue(''); setFormDate('');
    setModalOpen(false);
    document.body.style.overflow = '';
    handleFilter('all');
    showToast(`Order ${newOrder.id} created`);
  }, [formProduct, formSupplier, formQty, formValue, formDate, orders, handleFilter, showToast]);

  // Search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setExpandedId(null);
  }, []);

  const statHighlight = getActiveStatFilter();

  // Filter chip config
  const chips = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'processing', label: 'Processing', count: counts.processing },
    { key: 'transit', label: 'In Transit', count: counts.transit },
    { key: 'customs', label: 'Customs', count: counts.customs },
    { key: 'delivered', label: 'Delivered', count: counts.delivered },
  ];

  // Inline stepper renderer (must be in same component for styled-jsx scoping)
  const renderStepper = (stage: number) => (
    <div className="progress-stepper">
      {STAGES.map((name, i) => {
        const num = i + 1;
        const isDone = num < stage;
        const isActive = num === stage;
        return (
          <div key={name} style={{ display: 'contents' }}>
            <div className="step">
              <div className={`step-dot ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
                {isDone ? <Check size={9} /> : isActive ? <ArrowRight size={9} /> : num}
              </div>
              <span className={`step-label ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
                {name}
              </span>
            </div>
            {i < STAGES.length - 1 && (
              <div className={`step-line ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );

  // Inline detail renderer (must be in same component for styled-jsx scoping)
  const renderDetail = (order: Order) => {
    const isDelivered = order.status === 'delivered';
    return (
      <>
        <div className="detail-status-banner">
          <div className="detail-status-icon">
            {isDelivered ? <Check size={14} /> : <Clock size={14} />}
          </div>
          <div className="detail-status-text">
            <strong>{order.statusLabel}</strong>
            <span>{order.statusSub}</span>
          </div>
        </div>
        <div className="detail-extra-grid">
          <div className="detail-extra-item">
            <span className="detail-extra-label">Shipping Route</span>
            <span className="detail-extra-value">{order.route}</span>
          </div>
          <div className="detail-extra-item">
            <span className="detail-extra-label">Payment</span>
            <span className="detail-extra-value">{order.payment}</span>
          </div>
          <div className="detail-extra-item">
            <span className="detail-extra-label">Quantity</span>
            <span className="detail-extra-value">{order.qty}</span>
          </div>
          <div className="detail-extra-item">
            <span className="detail-extra-label">{isDelivered ? 'Delivered' : 'ETA'}</span>
            <span className="detail-extra-value">{order.eta}</span>
          </div>
        </div>
        <div className="detail-actions">
          <button className="btn btn-ghost" onClick={e => { e.stopPropagation(); router.push('/track-shipment'); }}>Track Shipment</button>
          <button className="btn btn-primary" onClick={e => { e.stopPropagation(); router.push('/documents'); }}>View Invoice</button>
        </div>
      </>
    );
  };

  return (
    <AppLayout searchPlaceholder="Search orders...">
      <div className="orders-page">
        {/* Sticky header wrapper (freezes on mobile scroll) */}
        <div className="sticky-header">
          {/* Header */}
          <div className="page-header">
            <div>
              <h1>My Orders</h1>
              <p>View and manage all your import orders</p>
            </div>
            <div className="header-actions">
              <button className="btn btn-ghost desktop-only" onClick={() => alert('Export coming soon')}>Export</button>
              <button className="btn btn-primary" onClick={() => { setModalOpen(true); document.body.style.overflow = 'hidden'; }}>
                <Plus size={14} strokeWidth={2.5} />
                New Order
              </button>
            </div>
          </div>

          {/* Stats Strip */}
          <div className="stats-strip">
            <div className={`stat-card ${statHighlight === 'all' ? 'active' : ''}`} onClick={() => handleStatClick('all')}>
              <div className="stat-icon"><Package size={16} /></div>
              <div className="stat-text">
                <span className="value">1,847</span>
                <span className="label">Total Orders</span>
                <span className="trend">+124 this month</span>
              </div>
            </div>
            <div className={`stat-card ${statHighlight === 'in_progress' ? 'active' : ''}`} onClick={() => handleStatClick('in_progress')}>
              <div className="stat-icon"><Clock size={16} /></div>
              <div className="stat-text">
                <span className="value">342</span>
                <span className="label">In Progress</span>
                <span className="trend">28 active now</span>
              </div>
            </div>
            <div className={`stat-card ${statHighlight === 'delivered' ? 'active' : ''}`} onClick={() => handleStatClick('delivered')}>
              <div className="stat-icon"><CheckCircle size={16} /></div>
              <div className="stat-text">
                <span className="value">1,476</span>
                <span className="label">Completed</span>
                <span className="trend">98% on time</span>
              </div>
            </div>
            <div className={`stat-card ${statHighlight === 'all' ? 'active' : ''}`} onClick={() => handleStatClick('value')}>
              <div className="stat-icon"><DollarSign size={16} /></div>
              <div className="stat-text">
                <span className="value">$2.4M</span>
                <span className="label">Total Value</span>
                <span className="trend">+23% this year</span>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="filter-bar">
            <div className="filter-chips">
              {chips.map(chip => (
                <button
                  key={chip.key}
                  className={`filter-chip ${activeFilter === chip.key ? 'active' : ''}`}
                  data-status={chip.key}
                  onClick={() => handleFilter(chip.key)}
                >
                  {chip.label}
                  <span className="chip-count">{chip.count}</span>
                </button>
              ))}
            </div>
            <div className="search-wrapper">
              <Search size={14} className="search-icon" />
              <input
                className="search-input"
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setExpandedId(null); }}
              />
              {searchQuery && (
                <button className="search-clear" onClick={clearSearch}>
                  <X size={10} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="timeline-container">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Search size={20} /></div>
              <h4>No orders found</h4>
              <p>{searchQuery ? `No results for "${searchQuery}"` : 'No orders match this filter'}</p>
              <button className="btn btn-ghost" onClick={() => { clearSearch(); handleFilter('all'); }}>
                Clear filters
              </button>
            </div>
          ) : (
            Object.keys(grouped).map(dateLabel => (
              <div className="date-group" key={dateLabel}>
                <div className="date-label">{dateLabel}</div>
                <div className="timeline">
                  {grouped[dateLabel].map(order => {
                    const isExpanded = expandedId === order.id;
                    const isDelivered = order.status === 'delivered';
                    return (
                      <div className="timeline-item" key={order.id}>
                        <div
                          className={`tl-card ${isExpanded ? 'expanded' : ''}`}
                          onClick={() => handleCardClick(order)}
                        >
                          <div className="tl-card-header">
                            <div className="tl-card-header-left">
                              <span className="tl-card-id">{order.id}</span>
                              <span className={`tl-card-badge ${isDelivered ? 'delivered' : ''}`}>
                                {order.statusLabel}
                              </span>
                            </div>
                            <div className="tl-card-expand-icon">
                              <ChevronRight size={14} />
                            </div>
                          </div>
                          <div className="tl-card-body">
                            <div className="tl-card-body-left">
                              <div className="tl-card-product">{order.product}</div>
                              <div className="tl-card-supplier">
                                {order.supplier} &middot; {order.qty}
                              </div>
                              <div className="tl-card-mobile-meta">
                                {order.eta} &middot; {order.route}
                              </div>
                            </div>
                            <div className="tl-card-mobile-value">{order.value}</div>
                          </div>
                          {/* Desktop: stepper + meta grid */}
                          <div className="desktop-stepper">
                            {renderStepper(order.stage)}
                          </div>
                          <div className="tl-card-meta">
                            <div className="tl-meta-item">
                              <span className="tl-meta-label">Value</span>
                              <span className="tl-meta-value highlight">{order.value}</span>
                            </div>
                            <div className="tl-meta-item">
                              <span className="tl-meta-label">Ordered</span>
                              <span className="tl-meta-value">{order.date}</span>
                            </div>
                            <div className="tl-meta-item">
                              <span className="tl-meta-label">{isDelivered ? 'Delivered' : 'ETA'}</span>
                              <span className="tl-meta-value">{order.eta}</span>
                            </div>
                            <div className="tl-meta-item">
                              <span className="tl-meta-label">Route</span>
                              <span className="tl-meta-value">{order.route}</span>
                            </div>
                          </div>
                          {/* Desktop: expandable details */}
                          <div className="tl-card-details">
                            {isExpanded && renderDetail(order)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      {sheetOrder && (
        <>
          <div className="sheet-backdrop" onClick={closeSheet} />
          <div className="bottom-sheet">
            <div className="sheet-handle" />
            <div className="sheet-content">
              <div className="sheet-order-header">
                <div className="sheet-id-row">
                  <span className="tl-card-id">{sheetOrder.id}</span>
                  <span className={`tl-card-badge ${sheetOrder.status === 'delivered' ? 'delivered' : ''}`}>
                    {sheetOrder.statusLabel}
                  </span>
                </div>
                <div className="sheet-product">{sheetOrder.product}</div>
                <div className="sheet-supplier">{sheetOrder.supplier} &middot; {sheetOrder.qty}</div>
              </div>
              <div className="sheet-stepper">
                {renderStepper(sheetOrder.stage)}
              </div>
              {renderDetail(sheetOrder)}
            </div>
          </div>
        </>
      )}

      {/* Create Order Modal */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => { setModalOpen(false); document.body.style.overflow = ''; }}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Order</h3>
              <button className="modal-close" onClick={() => { setModalOpen(false); document.body.style.overflow = ''; }}>
                <X size={14} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input className="form-input" type="text" placeholder="e.g. USB-C Cables"
                  value={formProduct} onChange={e => setFormProduct(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Supplier</label>
                <input className="form-input" type="text" placeholder="e.g. Shenzhen Electronics Co."
                  value={formSupplier} onChange={e => setFormSupplier(e.target.value)} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <input className="form-input" type="text" placeholder="e.g. 500 pcs"
                    value={formQty} onChange={e => setFormQty(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Estimated Value</label>
                  <input className="form-input" type="text" placeholder="e.g. $2,500"
                    value={formValue} onChange={e => setFormValue(e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Expected Delivery</label>
                <input className="form-input" type="date"
                  value={formDate} onChange={e => setFormDate(e.target.value)} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => { setModalOpen(false); document.body.style.overflow = ''; }}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreateOrder}>Create Order</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div className={`toast ${toastMsg ? 'visible' : ''}`}>
        <div className="toast-icon"><Check size={9} strokeWidth={3} /></div>
        <span>{toastMsg}</span>
      </div>

      <style jsx global>{`
        /* ── CSS Variables (scoped) ── */
        .orders-page {
          --accent: #f97316;
          --accent-light: #fff7ed;
          --bg: #f9fafb;
          --card-bg: #ffffff;
          --text-primary: #111827;
          --text-secondary: #4b5563;
          --text-muted: #6b7280;
          --border: #e5e7eb;
          --radius: 10px;
          max-width: 1400px;
          margin: 0 auto;
          font-size: 14px;
          line-height: 1.5;
        }

        /* ── Header ── */
        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .page-header h1 {
          font-size: 1.35rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .page-header p {
          font-size: 0.82rem;
          color: var(--text-secondary);
          margin-top: 2px;
          font-weight: 400;
        }
        .header-actions {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          border: none;
          font-family: inherit;
          min-height: 38px;
        }
        .btn-primary {
          background: #f97316 !important;
          color: white !important;
        }
        .btn-primary:hover { opacity: 0.9; }
        .btn-ghost {
          background: var(--card-bg);
          color: var(--text-secondary);
          border: 1px solid var(--border);
        }
        .btn-ghost:hover { border-color: #d1d5db; }

        /* ── Stats Strip ── */
        .stats-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }
        .stat-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }
        .stat-card.active {
          border-color: var(--accent);
          background: var(--accent-light);
        }
        .stat-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: var(--accent-light);
          color: var(--accent);
        }
        .stat-text { display: flex; flex-direction: column; gap: 1px; }
        .stat-text .value {
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .stat-text .label {
          font-size: 0.68rem;
          font-weight: 400;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .stat-text .trend {
          font-size: 0.68rem;
          color: var(--text-secondary);
          font-weight: 400;
        }

        /* ── Filter Bar ── */
        .filter-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .filter-chips {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          flex: 1;
          min-width: 0;
        }
        .filter-chips::-webkit-scrollbar { display: none; }
        .filter-chip {
          flex-shrink: 0;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 400;
          cursor: pointer;
          border: 1px solid var(--border);
          background: var(--card-bg);
          color: var(--text-secondary);
          white-space: nowrap;
          font-family: inherit;
        }
        .filter-chip:hover { border-color: #d1d5db; }
        .filter-chip.active {
          background: var(--accent);
          color: white;
          border-color: var(--accent);
        }
        .chip-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          border-radius: 4px;
          font-size: 0.66rem;
          font-weight: 500;
          margin-left: 5px;
          background: rgba(0,0,0,0.06);
        }
        .filter-chip.active .chip-count {
          background: rgba(255,255,255,0.25);
          color: white;
        }

        /* ── Search ── */
        .search-wrapper {
          position: relative;
          flex-shrink: 0;
          width: 240px;
        }
        .search-wrapper :global(.search-icon) {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }
        .search-input {
          width: 100%;
          padding: 7px 32px 7px 34px;
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 400;
          outline: none;
          background: var(--card-bg);
          color: var(--text-primary);
          font-family: inherit;
        }
        .search-input:focus { border-color: var(--accent); }
        .search-input::placeholder { color: var(--text-muted); }
        .search-clear {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: none;
          background: var(--border);
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }

        /* ── Date Group ── */
        .date-group { margin-bottom: 24px; }
        .date-label {
          font-size: 0.72rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 12px;
        }

        /* ── Timeline ── */
        .timeline-item { margin-bottom: 12px; }
        .timeline-item:last-child { margin-bottom: 0; }

        /* ── Order Card ── */
        .tl-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 16px 20px;
          cursor: pointer;
          position: relative;
        }
        .tl-card:hover { border-color: #d1d5db; }
        .tl-card.expanded { border-color: var(--accent); }

        .tl-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
          gap: 8px;
        }
        .tl-card-header-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .tl-card-id {
          font-size: 0.72rem;
          font-weight: 500;
          color: var(--accent);
        }
        .tl-card-badge {
          font-size: 0.66rem;
          font-weight: 500;
          padding: 3px 8px;
          border-radius: 4px;
          background: var(--accent-light);
          color: var(--accent);
        }
        .tl-card-badge.delivered {
          background: #f3f4f6;
          color: var(--text-muted);
        }
        .tl-card-expand-icon {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          flex-shrink: 0;
        }
        .tl-card.expanded .tl-card-expand-icon {
          transform: rotate(90deg);
          color: var(--accent);
        }

        .tl-card-product {
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 2px;
        }
        .tl-card-supplier {
          font-size: 0.76rem;
          color: var(--text-secondary);
          margin-bottom: 12px;
          font-weight: 400;
        }

        /* ── Progress Stepper ── */
        .progress-stepper {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          padding: 10px 14px;
          background: var(--bg);
          border-radius: 8px;
        }
        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          flex-shrink: 0;
        }
        .step-dot {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e5e7eb;
          color: white;
          z-index: 2;
          font-size: 0.58rem;
          font-weight: 500;
        }
        .step-dot.active { background: var(--accent); }
        .step-dot.done { background: var(--accent); opacity: 0.6; }
        .step-label {
          font-size: 0.6rem;
          font-weight: 400;
          color: var(--text-secondary);
          text-align: center;
          white-space: nowrap;
        }
        .step-label.active { color: var(--accent); font-weight: 500; }
        .step-label.done { color: var(--text-secondary); }
        .step-line {
          flex: 1;
          height: 1px;
          background: #e5e7eb;
          margin: 0 4px;
          align-self: flex-start;
          margin-top: 11px;
          min-width: 14px;
        }
        .step-line.done { background: var(--accent); opacity: 0.4; }
        .step-line.active { background: var(--accent); opacity: 0.6; }

        /* ── Card Meta ── */
        .tl-card-meta {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }
        .tl-meta-item { display: flex; flex-direction: column; gap: 1px; }
        .tl-meta-label {
          font-size: 0.64rem;
          font-weight: 400;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .tl-meta-value {
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-primary);
        }
        .tl-meta-value.highlight { color: var(--accent); }

        /* ── Mobile-only elements (hidden on desktop) ── */
        .tl-card-mobile-meta { display: none; }
        .tl-card-mobile-value { display: none; }

        /* ── Expandable Details ── */
        .tl-card-details {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          margin-top: 0;
        }
        .tl-card.expanded .tl-card-details {
          max-height: 500px;
          opacity: 1;
          margin-top: 14px;
        }
        .detail-status-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 8px;
          margin-bottom: 14px;
          background: var(--accent-light);
        }
        .detail-status-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: var(--accent);
          color: white;
        }
        .detail-status-text { display: flex; flex-direction: column; gap: 1px; }
        .detail-status-text strong {
          font-size: 0.82rem;
          font-weight: 500;
          color: var(--accent);
        }
        .detail-status-text span {
          font-size: 0.72rem;
          font-weight: 400;
          color: var(--text-secondary);
        }
        .detail-extra-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 14px;
        }
        .detail-extra-item { display: flex; flex-direction: column; gap: 2px; }
        .detail-extra-label {
          font-size: 0.64rem;
          font-weight: 400;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .detail-extra-value {
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-primary);
        }
        .detail-actions {
          display: flex;
          gap: 10px;
          padding-top: 14px;
          border-top: 1px solid var(--border);
        }
        .detail-actions .btn {
          flex: 1;
          justify-content: center;
          font-size: 0.78rem;
          padding: 8px 12px;
          min-height: 42px;
        }

        /* ── Empty State ── */
        .empty-state {
          text-align: center;
          padding: 48px 24px;
        }
        .empty-state-icon {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          background: var(--bg);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 14px;
          color: var(--text-muted);
        }
        .empty-state h4 {
          font-size: 0.88rem;
          font-weight: 500;
          margin-bottom: 4px;
        }
        .empty-state p {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 400;
          margin-bottom: 14px;
        }
        .empty-state .btn { margin: 0 auto; }

        .desktop-only { display: inline-flex; }

        /* ── Modal ── */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.35);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-card {
          background: var(--card-bg);
          border-radius: 12px;
          width: calc(100% - 32px);
          max-width: 480px;
          max-height: 90vh;
          overflow-y: auto;
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 20px;
          border-bottom: 1px solid var(--border);
        }
        .modal-header h3 {
          font-size: 0.95rem;
          font-weight: 600;
        }
        .modal-close {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: none;
          background: var(--bg);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
        }
        .modal-close:hover { background: var(--border); }
        .modal-body { padding: 20px; }
        .form-group { margin-bottom: 14px; }
        .form-group:last-child { margin-bottom: 0; }
        .form-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 500;
          color: var(--text-secondary);
          margin-bottom: 5px;
        }
        .form-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid var(--border);
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 400;
          outline: none;
          background: var(--card-bg);
          color: var(--text-primary);
          font-family: inherit;
        }
        .form-input:focus { border-color: var(--accent); }
        .form-input::placeholder { color: var(--text-muted); }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .modal-footer {
          display: flex;
          gap: 8px;
          padding: 14px 20px 20px;
        }
        .modal-footer .btn { flex: 1; justify-content: center; }

        /* ── Toast ── */
        .toast {
          position: fixed;
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--text-primary);
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 400;
          z-index: 2000;
          white-space: nowrap;
          display: none;
          align-items: center;
          gap: 8px;
        }
        .toast.visible { display: flex; }
        .toast-icon {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* ── Bottom Sheet ── */
        .sheet-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.35);
          z-index: 1100;
        }
        .bottom-sheet {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--card-bg);
          border-radius: 14px 14px 0 0;
          max-height: 85vh;
          overflow-y: auto;
          z-index: 1200;
          padding: 0 20px 24px;
          padding-bottom: calc(24px + env(safe-area-inset-bottom, 0px));
        }
        .sheet-handle {
          width: 36px;
          height: 4px;
          background: var(--border);
          border-radius: 2px;
          margin: 10px auto 16px;
        }
        .sheet-order-header { margin-bottom: 16px; }
        .sheet-id-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }
        .sheet-id-row .tl-card-id { font-size: 0.8rem; }
        .sheet-id-row .tl-card-badge { font-size: 0.68rem; padding: 3px 8px; }
        .sheet-product {
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: 4px;
          color: var(--text-primary);
        }
        .sheet-supplier {
          font-size: 0.82rem;
          color: var(--text-secondary);
        }
        .sheet-stepper { margin-bottom: 16px; }
        .sheet-stepper .progress-stepper {
          padding: 10px 12px;
          display: flex;
          align-items: center;
          background: #f9fafb;
          border-radius: 8px;
          margin-bottom: 0;
        }
        .sheet-stepper .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          flex-shrink: 0;
        }
        .sheet-stepper .step-dot {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e5e7eb;
          color: white;
          font-size: 0.58rem;
          font-weight: 500;
        }
        .sheet-stepper .step-dot.active { background: #f97316; }
        .sheet-stepper .step-dot.done { background: #f97316; opacity: 0.6; }
        .sheet-stepper .step-label {
          font-size: 0.6rem;
          font-weight: 400;
          color: #4b5563;
          text-align: center;
          white-space: nowrap;
        }
        .sheet-stepper .step-label.active { color: #f97316; font-weight: 500; }
        .sheet-stepper .step-line {
          flex: 1;
          height: 1px;
          background: #e5e7eb;
          margin: 0 4px;
          align-self: flex-start;
          margin-top: 11px;
          min-width: 14px;
        }
        .sheet-stepper .step-line.done { background: #f97316; opacity: 0.4; }
        .sheet-stepper .step-line.active { background: #f97316; opacity: 0.6; }
        .bottom-sheet .detail-extra-grid {
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }
        .bottom-sheet .detail-extra-label { font-size: 0.72rem; }
        .bottom-sheet .detail-extra-value { font-size: 0.88rem; }
        .bottom-sheet .detail-actions {
          display: flex;
          gap: 10px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
        }
        .bottom-sheet .detail-actions .btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          font-size: 0.82rem;
          font-weight: 500;
          border-radius: 10px;
          padding: 10px 16px;
          cursor: pointer;
          font-family: inherit;
          border: none;
        }
        .bottom-sheet .detail-actions .btn-primary {
          background: #f97316;
          color: white;
        }
        .bottom-sheet .detail-actions .btn-ghost {
          background: #ffffff;
          color: #4b5563;
          border: 1px solid #e5e7eb;
        }
        .bottom-sheet .detail-status-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          margin-bottom: 16px;
          border-radius: 8px;
          background: #fff7ed;
        }
        .bottom-sheet .detail-status-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: #f97316;
          color: white;
        }
        .bottom-sheet .detail-status-text {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .bottom-sheet .detail-status-text strong {
          font-size: 0.82rem;
          font-weight: 500;
          color: #f97316;
        }
        .bottom-sheet .detail-status-text span {
          font-size: 0.72rem;
          font-weight: 400;
          color: #4b5563;
        }
        .bottom-sheet .detail-extra-label {
          font-size: 0.72rem;
          font-weight: 400;
          color: #4b5563;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .bottom-sheet .detail-extra-value {
          font-size: 0.88rem;
          font-weight: 500;
          color: #111827;
        }

        /* ── Mobile (<=768px) ── */
        @media (max-width: 768px) {
          .orders-page {
            margin: -16px -16px 0;
          }

          /* Sticky header: freeze header + stats + filters */
          .sticky-header {
            position: sticky;
            top: -16px;
            z-index: 10;
            background: #ffffff;
            padding-top: 16px;
          }

          /* Header */
          .page-header {
            padding: 14px 12px;
            margin-bottom: 0;
            gap: 8px;
            flex-wrap: nowrap;
          }
          .page-header h1 { font-size: 1.25rem; }
          .page-header p { display: none; }
          .desktop-only { display: none !important; }
          .header-actions { flex-shrink: 0; }
          .header-actions .btn-primary {
            padding: 7px 14px;
            font-size: 0.8rem;
            min-height: 34px;
            border-radius: 20px;
          }

          /* Stats: horizontal strip */
          .stats-strip {
            display: flex;
            gap: 0;
            margin-bottom: 0;
            border-bottom: 1px solid #f0f0f0;
            padding: 10px 0;
          }
          .stat-card {
            flex: 1;
            background: transparent;
            border: none;
            border-radius: 0;
            padding: 6px 0;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 2px;
            border-right: 1px solid #efefef;
          }
          .stat-card:last-child { border-right: none; }
          .stat-card.active {
            background: transparent;
            border-color: #efefef;
          }
          .stat-card.active .stat-text .value { color: var(--accent); }
          .stat-icon { display: none; }
          .stat-text { align-items: center; }
          .stat-text .value { font-size: 1.15rem; }
          .stat-text .label { font-size: 0.64rem; }
          .stat-text .trend { display: none; }

          /* Filter bar */
          .filter-bar {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
            background: #ffffff;
            padding: 10px 12px;
            margin: 0;
            border-bottom: 1px solid #f0f0f0;
          }
          .search-wrapper { width: 100%; }
          .search-input {
            min-height: 40px;
            font-size: 0.88rem;
            border-radius: 10px;
            background: #f3f4f6;
            border: 1px solid transparent;
            padding: 8px 32px 8px 34px;
          }
          .search-input:focus {
            border-color: var(--accent);
            background: #ffffff;
          }
          .filter-chip {
            padding: 7px 10px;
            font-size: 0.82rem;
            min-height: 34px;
            border-radius: 20px;
            flex-grow: 1;
            text-align: center;
          }
          .filter-chip[data-status="delivered"] { display: none; }
          .chip-count {
            min-width: 18px;
            height: 18px;
            font-size: 0.64rem;
            margin-left: 4px;
            border-radius: 9px;
          }

          /* Timeline: edge-to-edge */
          .date-group { margin-bottom: 0; }
          .date-label {
            font-size: 0.7rem;
            margin-bottom: 0;
            padding: 10px 12px 6px;
            color: var(--text-muted);
            background: #fafafa;
            letter-spacing: 0.06em;
          }
          .timeline-item { margin-bottom: 0; }

          /* Cards → list items */
          .tl-card {
            background: transparent;
            border: none;
            border-bottom: 1px solid #f0f0f0;
            border-radius: 0;
            padding: 14px 12px;
          }
          .tl-card:hover { border-color: #f0f0f0; }
          .tl-card.expanded { border-color: #f0f0f0; }
          .tl-card:active { background: #fafafa; }

          .tl-card-header { margin-bottom: 5px; justify-content: flex-start; }
          .tl-card-id { font-size: 0.76rem; }
          .tl-card-badge {
            font-size: 0.68rem;
            padding: 3px 10px;
            border-radius: 10px;
          }

          /* Card body: content left, value right */
          .tl-card-body {
            display: flex;
            align-items: flex-start;
            gap: 8px;
          }
          .tl-card-body-left { flex: 1; min-width: 0; }
          .tl-card-product {
            font-size: 1rem;
            font-weight: 500;
            margin-bottom: 2px;
          }
          .tl-card-supplier {
            font-size: 0.84rem;
            margin-bottom: 0;
          }
          .tl-card-mobile-value {
            display: block;
            font-size: 1.05rem;
            font-weight: 500;
            color: var(--accent);
            flex-shrink: 0;
            white-space: nowrap;
            padding-top: 1px;
            margin-left: auto;
          }

          .tl-card-expand-icon {
            display: flex;
            width: 18px;
            height: 18px;
            color: #d1d5db;
            margin-left: auto;
          }

          /* Hide stepper on cards */
          .desktop-stepper { display: none; }

          /* Hide desktop meta grid */
          .tl-card-meta { display: none; }

          /* Mobile meta */
          .tl-card-mobile-meta {
            display: block;
            margin-top: 6px;
            font-size: 0.82rem;
            color: var(--text-muted);
            line-height: 1.4;
          }

          /* Hide desktop expand details */
          .tl-card-details { display: none !important; }

          /* Bottom sheet adjustments */
          .bottom-sheet { padding: 0 12px 20px; }
          .bottom-sheet .detail-actions .btn { font-size: 0.88rem; }

          /* Modal: full-screen */
          .modal-card {
            width: 100%;
            max-width: 100%;
            max-height: 100vh;
            border-radius: 0;
            height: 100vh;
          }
          .modal-header { padding: 14px 12px; }
          .modal-header h3 { font-size: 1.05rem; }
          .modal-body { padding: 14px 12px; }
          .modal-footer { padding: 12px; }
          .form-input {
            min-height: 46px;
            font-size: 0.9rem;
            padding: 10px 14px;
            border-radius: 10px;
          }
          .form-label { font-size: 0.8rem; margin-bottom: 6px; }
          .form-row { gap: 10px; }
          .modal-footer .btn {
            min-height: 46px;
            border-radius: 10px;
            font-size: 0.88rem;
          }

          /* Empty state */
          .empty-state { padding: 40px 12px; }
          .empty-state h4 { font-size: 0.95rem; }
          .empty-state p { font-size: 0.86rem; }
        }

        /* ── Small phones (<=400px) ── */
        @media (max-width: 400px) {
          .orders-page { margin: -12px -12px 0; }
          .sticky-header { top: -12px; padding-top: 12px; }
          .page-header { padding: 12px 10px; }
          .page-header h1 { font-size: 1.15rem; }
          .header-actions .btn-primary { padding: 6px 12px; font-size: 0.78rem; }

          .stat-card { padding: 4px 0; }
          .stat-text .value { font-size: 1.05rem; }
          .stat-text .label { font-size: 0.58rem; }

          .filter-bar { padding: 8px 10px; }
          .filter-chip { padding: 6px 6px; font-size: 0.76rem; min-height: 32px; }
          .search-input { min-height: 38px; font-size: 0.84rem; }

          .tl-card { padding: 12px 10px; }
          .tl-card-product { font-size: 0.95rem; }
          .tl-card-supplier { font-size: 0.8rem; }
          .tl-card-mobile-meta { font-size: 0.78rem; margin-top: 5px; }
          .tl-card-mobile-value { font-size: 0.9rem; }

          .date-label { padding: 8px 10px 5px; font-size: 0.66rem; }

          .bottom-sheet { padding: 0 10px 16px; }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </AppLayout>
  );
}
