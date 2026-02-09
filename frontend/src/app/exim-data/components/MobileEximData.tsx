'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { EximSearchBar } from '@/components/exim';
import { STAT_PILL_COLORS, SORT_OPTIONS, RESULTS_PER_PAGE } from '@/lib/eximConstants';
import { EximSidebarFilters, ShipmentRecord, TraderSummary, CountryBreakdown, HSCodeBreakdown } from '@/types/exim';
import { useEximData, TABS } from './EximDataContext';

// ============ MOBILE STATS STRIP ============

function MobileStatsStrip() {
  const { stats } = useEximData();
  if (!stats) return null;

  const pills = [
    { key: 'shipments', label: 'Shipments', value: stats.shipments },
    { key: 'consignees', label: 'Consignee', value: stats.consignees },
    { key: 'shippers', label: 'Shipper', value: stats.shippers },
    { key: 'countriesOfOrigin', label: 'Countries', value: stats.countriesOfOrigin },
    { key: 'portsOfDestination', label: 'Ports', value: stats.portsOfDestination },
    { key: 'hsCodes', label: 'HS Codes', value: stats.hsCodes },
  ];

  return (
    <div className="m-stats-strip">
      {pills.map(p => (
        <div
          key={p.key}
          className="m-stat-chip"
          style={{ background: STAT_PILL_COLORS[p.key] || '#6b7280' }}
        >
          <span className="m-chip-label">{p.label}</span>
          <span className="m-chip-value">{p.value.toLocaleString()}</span>
        </div>
      ))}

      <style jsx>{`
        .m-stats-strip {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 12px 0;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .m-stats-strip::-webkit-scrollbar { display: none; }
        .m-stat-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          color: white;
          font-size: 0.75rem;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .m-chip-label { font-weight: 600; }
        .m-chip-value { font-weight: 400; opacity: 0.9; }
      `}</style>
    </div>
  );
}

// ============ MOBILE TAB PILLS ============

function MobileTabPills() {
  const { activeTab, setActiveTab } = useEximData();

  return (
    <div className="m-tab-pills">
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`m-tab-pill ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}

      <style jsx>{`
        .m-tab-pills {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 4px 0 12px;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .m-tab-pills::-webkit-scrollbar { display: none; }
        .m-tab-pill {
          padding: 8px 16px;
          border-radius: 20px;
          border: 1.5px solid var(--border-color);
          background: var(--bg-primary);
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          min-height: 36px;
        }
        .m-tab-pill.active {
          background: #2563eb;
          border-color: #2563eb;
          color: white;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}

// ============ MOBILE FILTER CHIPS ============

function MobileFilterChips({ onOpenFilters }: { onOpenFilters: () => void }) {
  const { sidebarFilters, handleFilterChange } = useEximData();

  const activeCount = [
    sidebarFilters.removeDuplicates,
    sidebarFilters.removeToOrder,
    sidebarFilters.removeBankingEntity,
    sidebarFilters.removeShippingEntity,
  ].filter(Boolean).length
    + sidebarFilters.consigneeFilter.length
    + sidebarFilters.shipperFilter.length;

  return (
    <div className="m-filter-chips">
      <button className="m-filter-btn" onClick={onOpenFilters}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        Filters
        {activeCount > 0 && <span className="m-filter-badge">{activeCount}</span>}
      </button>

      {sidebarFilters.removeDuplicates && (
        <span className="m-chip-active">
          No Duplicates
          <button
            className="m-chip-x"
            onClick={() => handleFilterChange({ ...sidebarFilters, removeDuplicates: false })}
          >
            &times;
          </button>
        </span>
      )}
      {sidebarFilters.removeToOrder && (
        <span className="m-chip-active">
          No TO Order
          <button
            className="m-chip-x"
            onClick={() => handleFilterChange({ ...sidebarFilters, removeToOrder: false })}
          >
            &times;
          </button>
        </span>
      )}

      <style jsx>{`
        .m-filter-chips {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 0 0 12px;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          align-items: center;
        }
        .m-filter-chips::-webkit-scrollbar { display: none; }
        .m-filter-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 8px;
          border: 1.5px solid var(--border-color);
          background: var(--bg-primary);
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-primary);
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          min-height: 38px;
        }
        .m-filter-badge {
          background: #2563eb;
          color: white;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 10px;
          min-width: 18px;
          text-align: center;
        }
        .m-chip-active {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 10px;
          border-radius: 16px;
          background: rgba(37, 99, 235, 0.1);
          color: #2563eb;
          font-size: 0.75rem;
          font-weight: 500;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .m-chip-x {
          background: none;
          border: none;
          color: #2563eb;
          font-size: 1rem;
          cursor: pointer;
          padding: 0 2px;
          line-height: 1;
        }
      `}</style>
    </div>
  );
}

// ============ MOBILE FILTER SHEET ============

function MobileFilterSheet({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { sidebarFilters, handleFilterChange } = useEximData();

  const toggleFilter = (key: 'removeDuplicates' | 'removeToOrder' | 'removeBankingEntity' | 'removeShippingEntity') => {
    handleFilterChange({ ...sidebarFilters, [key]: !sidebarFilters[key] });
  };

  const toggles = [
    { key: 'removeDuplicates' as const, label: 'Remove duplicate shipments' },
    { key: 'removeToOrder' as const, label: 'Remove TO Order / NA' },
    { key: 'removeBankingEntity' as const, label: 'Remove Banking Entity' },
    { key: 'removeShippingEntity' as const, label: 'Remove Shipping Entity' },
  ];

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Filters" snapPoints={[0.6, 0.9]}>
      <div className="m-filter-sheet">
        {toggles.map(t => (
          <div key={t.key} className="m-toggle-row">
            <span className="m-toggle-label">{t.label}</span>
            <button
              className={`m-toggle-switch ${sidebarFilters[t.key] ? 'on' : ''}`}
              onClick={() => toggleFilter(t.key)}
            >
              <span className="m-toggle-knob" />
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .m-filter-sheet {
          padding: 8px 20px 20px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .m-toggle-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 0;
          border-bottom: 1px solid var(--border-color);
        }
        .m-toggle-row:last-child { border-bottom: none; }
        .m-toggle-label {
          font-size: 0.875rem;
          color: var(--text-primary);
        }
        .m-toggle-switch {
          position: relative;
          width: 48px;
          height: 28px;
          border-radius: 14px;
          border: none;
          background: #d1d5db;
          cursor: pointer;
          transition: background 0.2s;
          flex-shrink: 0;
        }
        .m-toggle-switch.on {
          background: #2563eb;
        }
        .m-toggle-knob {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: white;
          transition: transform 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        .m-toggle-switch.on .m-toggle-knob {
          transform: translateX(20px);
        }
      `}</style>
    </BottomSheet>
  );
}

// ============ MOBILE SHIPMENT CARD ============

function MobileShipmentCard({ shipment }: { shipment: ShipmentRecord }) {
  const [expanded, setExpanded] = useState(false);
  const { openTraderModal } = useEximData();

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const formatValue = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

  return (
    <div className="m-shipment-card" onClick={() => setExpanded(!expanded)}>
      <div className="m-card-top">
        <span className="m-card-date">{formatDate(shipment.date)}</span>
        <span className="m-card-value">{formatValue(shipment.valueUSD)}</span>
      </div>
      <div className="m-card-hs">HS: {shipment.hsnCode}</div>
      <div className="m-card-product">{shipment.productDescription}</div>
      <div className="m-card-parties">
        <div className="m-party-row">
          <span className="m-party-label">Consignee</span>
          <button
            className="m-party-name"
            onClick={(e) => { e.stopPropagation(); openTraderModal(shipment.consigneeId, 'consignee'); }}
          >
            {shipment.consigneeName}
          </button>
        </div>
        <div className="m-party-row">
          <span className="m-party-label">Shipper</span>
          <button
            className="m-party-name"
            onClick={(e) => { e.stopPropagation(); openTraderModal(shipment.shipperId, 'shipper'); }}
          >
            {shipment.shipperName}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="m-card-details">
          <div className="m-detail-grid">
            <div className="m-detail-item">
              <span className="m-detail-label">Bill of Lading</span>
              <span className="m-detail-value">{shipment.billOfLadingNo}</span>
            </div>
            <div className="m-detail-item">
              <span className="m-detail-label">Country of Origin</span>
              <span className="m-detail-value">{shipment.countryOfOrigin}</span>
            </div>
            <div className="m-detail-item">
              <span className="m-detail-label">Port of Origin</span>
              <span className="m-detail-value">{shipment.portOfOrigin}</span>
            </div>
            <div className="m-detail-item">
              <span className="m-detail-label">Port of Destination</span>
              <span className="m-detail-value">{shipment.portOfDestination}</span>
            </div>
            <div className="m-detail-item">
              <span className="m-detail-label">Quantity</span>
              <span className="m-detail-value">{shipment.quantity} {shipment.quantityUnit}</span>
            </div>
            <div className="m-detail-item">
              <span className="m-detail-label">Weight</span>
              <span className="m-detail-value">{shipment.weightKg} KG</span>
            </div>
            {shipment.notifyPartyName && (
              <div className="m-detail-item">
                <span className="m-detail-label">Notify Party</span>
                <span className="m-detail-value">{shipment.notifyPartyName}</span>
              </div>
            )}
            <div className="m-detail-item">
              <span className="m-detail-label">Data Type</span>
              <span className="m-detail-value">{shipment.dataType.toUpperCase()}</span>
            </div>
          </div>
        </div>
      )}

      <div className="m-card-expand-hint">
        {expanded ? 'Tap to collapse' : 'Tap for details'}
      </div>

      <style jsx>{`
        .m-shipment-card {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 14px;
          cursor: pointer;
          transition: box-shadow 0.15s;
        }
        .m-shipment-card:active {
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
        }
        .m-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }
        .m-card-date {
          font-size: 0.78rem;
          color: var(--text-secondary);
        }
        .m-card-value {
          font-size: 0.875rem;
          font-weight: 700;
          color: #059669;
        }
        .m-card-hs {
          font-size: 0.75rem;
          color: #2563eb;
          font-family: monospace;
          font-weight: 500;
          margin-bottom: 4px;
        }
        .m-card-product {
          font-size: 0.82rem;
          color: var(--text-primary);
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 10px;
        }
        .m-card-parties {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .m-party-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .m-party-label {
          font-size: 0.7rem;
          color: var(--text-secondary);
          min-width: 65px;
          flex-shrink: 0;
        }
        .m-party-name {
          font-size: 0.78rem;
          color: #2563eb;
          font-weight: 500;
          background: none;
          border: none;
          padding: 4px 0;
          cursor: pointer;
          text-align: left;
          min-height: 28px;
        }
        .m-card-details {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--border-color);
        }
        .m-detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .m-detail-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .m-detail-label {
          font-size: 0.68rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .m-detail-value {
          font-size: 0.78rem;
          color: var(--text-primary);
          font-weight: 500;
        }
        .m-card-expand-hint {
          text-align: center;
          font-size: 0.68rem;
          color: var(--text-secondary);
          margin-top: 8px;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}

// ============ MOBILE TRADER CARD ============

function MobileTraderCard({
  trader,
  role,
}: {
  trader: TraderSummary;
  role: 'consignee' | 'shipper';
}) {
  const { openTraderModal } = useEximData();

  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  return (
    <div className="m-trader-card" onClick={() => openTraderModal(trader.id, role)}>
      <div className="m-trader-name">{trader.name}</div>
      <div className="m-trader-meta">
        {trader.city && <span>{trader.city}</span>}
        {trader.city && trader.country && <span className="m-dot">&middot;</span>}
        <span>{trader.country}</span>
        <span className="m-dot">&middot;</span>
        <span>{trader.totalShipments} shipments</span>
      </div>
      <div className="m-trader-value">Total: {formatValue(trader.totalValueUSD)}</div>
      {trader.topProducts.length > 0 && (
        <div className="m-trader-products">
          {trader.topProducts.slice(0, 2).map((p, i) => (
            <span key={i} className="m-product-tag">{p.substring(0, 35)}</span>
          ))}
        </div>
      )}

      <style jsx>{`
        .m-trader-card {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 14px;
          cursor: pointer;
          transition: box-shadow 0.15s;
        }
        .m-trader-card:active {
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
        }
        .m-trader-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #2563eb;
          margin-bottom: 4px;
        }
        .m-trader-meta {
          font-size: 0.75rem;
          color: var(--text-secondary);
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 6px;
        }
        .m-dot { opacity: 0.5; }
        .m-trader-value {
          font-size: 0.82rem;
          font-weight: 600;
          color: #059669;
          margin-bottom: 8px;
        }
        .m-trader-products {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .m-product-tag {
          font-size: 0.72rem;
          color: var(--text-secondary);
          line-height: 1.3;
        }
      `}</style>
    </div>
  );
}

// ============ MOBILE SUMMARY CHARTS ============

function MobileSummaryCharts() {
  const { countries, hsCodes } = useEximData();

  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  const maxCountryValue = countries.length > 0 ? countries[0].valueUSD : 1;
  const maxHSValue = hsCodes.length > 0 ? hsCodes[0].valueUSD : 1;

  return (
    <div className="m-summary">
      <div className="m-summary-section">
        <h3 className="m-section-title">Top Countries</h3>
        {countries.slice(0, 6).map(c => (
          <div key={c.country} className="m-bar-row">
            <div className="m-bar-info">
              <span className="m-bar-name">{c.country}</span>
              <span className="m-bar-meta">{c.shipments} shipments</span>
            </div>
            <div className="m-bar-track">
              <div
                className="m-bar-fill blue"
                style={{ width: `${(c.valueUSD / maxCountryValue) * 100}%` }}
              />
            </div>
            <span className="m-bar-value">{formatValue(c.valueUSD)}</span>
          </div>
        ))}
      </div>

      <div className="m-summary-section">
        <h3 className="m-section-title">Top HS Codes</h3>
        {hsCodes.slice(0, 6).map(h => (
          <div key={h.hsnCode} className="m-bar-row">
            <div className="m-bar-info">
              <span className="m-bar-name hs">{h.hsnCode}</span>
              <span className="m-bar-meta">{h.description.substring(0, 30)}...</span>
            </div>
            <div className="m-bar-track">
              <div
                className="m-bar-fill green"
                style={{ width: `${(h.valueUSD / maxHSValue) * 100}%` }}
              />
            </div>
            <span className="m-bar-value">{formatValue(h.valueUSD)}</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .m-summary {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .m-summary-section {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 16px;
        }
        .m-section-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 14px;
        }
        .m-bar-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }
        .m-bar-row:last-child { margin-bottom: 0; }
        .m-bar-info {
          width: 90px;
          min-width: 90px;
          display: flex;
          flex-direction: column;
        }
        .m-bar-name {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .m-bar-name.hs {
          color: #2563eb;
          font-family: monospace;
        }
        .m-bar-meta {
          font-size: 0.65rem;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .m-bar-track {
          flex: 1;
          height: 18px;
          background: var(--bg-secondary, #f1f5f9);
          border-radius: 4px;
          overflow: hidden;
        }
        .m-bar-fill {
          height: 100%;
          border-radius: 4px;
          min-width: 4px;
          transition: width 0.3s;
        }
        .m-bar-fill.blue {
          background: linear-gradient(90deg, #2563eb, #3b82f6);
        }
        .m-bar-fill.green {
          background: linear-gradient(90deg, #059669, #10b981);
        }
        .m-bar-value {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--text-primary);
          min-width: 50px;
          text-align: right;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}

// ============ MOBILE SEARCH SECTION ============

function MobileSearchSection() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { handleSearch, loading, searchParams } = useEximData();

  return (
    <>
      <button className="m-search-trigger" onClick={() => setSheetOpen(true)}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <span className="m-search-text">
          {searchParams ? `${searchParams.country} ${searchParams.dataType} - ${searchParams.searchTerms.join(', ') || 'All'}` : 'Search trade data...'}
        </span>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <BottomSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Search EX-IM Data"
        snapPoints={[0.75, 0.92]}
      >
        <div className="m-search-sheet-inner">
          <EximSearchBar
            onSearch={(params) => {
              handleSearch(params);
              setSheetOpen(false);
            }}
            loading={loading}
          />
        </div>
      </BottomSheet>

      <style jsx>{`
        .m-search-trigger {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1.5px solid var(--border-color);
          background: var(--bg-primary);
          cursor: pointer;
          min-height: 48px;
          text-align: left;
        }
        .m-search-trigger:active {
          border-color: #2563eb;
        }
        .m-search-text {
          flex: 1;
          font-size: 0.875rem;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .m-search-sheet-inner {
          padding: 4px 16px 20px;
        }
      `}</style>
    </>
  );
}

// ============ MOBILE SHIPMENTS LIST ============

function MobileShipmentsList() {
  const { shipments, totalCount, page, handlePageChange, sortField, sortDir, handleSortChange, handleExportCSV } = useEximData();
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const currentSortId = SORT_OPTIONS.find(o => o.field === sortField && o.direction === sortDir)?.id || 'date-desc';
  const hasMore = page * RESULTS_PER_PAGE < totalCount;

  return (
    <div className="m-shipments-list">
      <MobileFilterChips onOpenFilters={() => setFilterSheetOpen(true)} />
      <MobileFilterSheet isOpen={filterSheetOpen} onClose={() => setFilterSheetOpen(false)} />

      <div className="m-list-controls">
        <span className="m-result-count">{totalCount.toLocaleString()} results</span>
        <div className="m-controls-right">
          <button className="m-export-btn" onClick={handleExportCSV}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
          <select
            className="m-sort-select"
            value={currentSortId}
            onChange={(e) => {
              const option = SORT_OPTIONS.find(o => o.id === e.target.value);
              if (option) handleSortChange(option.field, option.direction);
            }}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="m-cards-list">
        {shipments.map(s => (
          <MobileShipmentCard key={s.id} shipment={s} />
        ))}
      </div>

      {hasMore && (
        <button className="m-load-more" onClick={() => handlePageChange(page + 1)}>
          Load More
        </button>
      )}

      {shipments.length === 0 && (
        <div className="m-empty">No shipments found for the current search.</div>
      )}

      <style jsx>{`
        .m-shipments-list {
          display: flex;
          flex-direction: column;
        }
        .m-list-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .m-result-count {
          font-size: 0.78rem;
          color: var(--text-secondary);
          font-weight: 500;
        }
        .m-controls-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .m-export-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          cursor: pointer;
          color: var(--text-secondary);
        }
        .m-sort-select {
          padding: 6px 8px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          font-size: 0.75rem;
          color: var(--text-primary);
          max-width: 140px;
          min-height: 36px;
        }
        .m-cards-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .m-load-more {
          margin-top: 16px;
          padding: 14px;
          width: 100%;
          border-radius: 10px;
          border: 1.5px solid #2563eb;
          background: transparent;
          color: #2563eb;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          min-height: 48px;
        }
        .m-load-more:active {
          background: rgba(37, 99, 235, 0.05);
        }
        .m-empty {
          text-align: center;
          padding: 40px 20px;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
}

// ============ MAIN: MOBILE EXIM DATA ============

export default function MobileEximData() {
  const { hasSearched, loading, activeTab, consignees, shippers, traderModal, closeTraderModal, handleViewShipments, openTraderModal } = useEximData();

  return (
    <AppLayout>
      <div className="m-exim-page">
        <div className="content-header">
          <h1>EX-IM Data</h1>
        </div>

        <MobileSearchSection />

        {hasSearched && (
          <>
            <MobileStatsStrip />
            <MobileTabPills />

            {activeTab === 'shipments' && <MobileShipmentsList />}

            {activeTab === 'summary' && <MobileSummaryCharts />}

            {activeTab === 'consignee' && (
              <div className="m-trader-list">
                {consignees.length === 0 && (
                  <div className="m-empty-tab">No consignees found.</div>
                )}
                {consignees.map(c => (
                  <MobileTraderCard key={c.id} trader={c} role="consignee" />
                ))}
              </div>
            )}

            {activeTab === 'shipper' && (
              <div className="m-trader-list">
                {shippers.length === 0 && (
                  <div className="m-empty-tab">No shippers found.</div>
                )}
                {shippers.map(s => (
                  <MobileTraderCard key={s.id} trader={s} role="shipper" />
                ))}
              </div>
            )}
          </>
        )}

        {!hasSearched && (
          <div className="m-empty-state">
            <div className="m-empty-icon">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.25">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <h3 className="m-empty-title">Search Global Trade Data</h3>
            <p className="m-empty-desc">
              Tap the search bar above to explore import-export shipment records worldwide.
            </p>
          </div>
        )}

        {loading && hasSearched && (
          <div className="m-loading">
            <div className="m-spinner" />
            <span>Loading...</span>
          </div>
        )}

        {/* Trader Detail — rendered as BottomSheet on mobile */}
        {traderModal.isOpen && traderModal.trader && (
          <BottomSheet
            isOpen={traderModal.isOpen}
            onClose={closeTraderModal}
            title={traderModal.trader.name}
            snapPoints={[0.55, 0.92]}
          >
            <MobileTraderDetail />
          </BottomSheet>
        )}
      </div>

      <style jsx>{`
        .m-exim-page {
          padding: 16px;
          padding-bottom: calc(80px + env(safe-area-inset-bottom));
          position: relative;
        }
        .content-header {
          margin-bottom: 14px;
        }
        .content-header h1 {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }
        .m-trader-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .m-empty-tab {
          text-align: center;
          padding: 40px 20px;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }
        .m-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
        }
        .m-empty-icon {
          color: var(--text-secondary);
          opacity: 0.3;
          margin-bottom: 16px;
        }
        .m-empty-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 6px;
        }
        .m-empty-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          max-width: 300px;
          line-height: 1.5;
          margin: 0;
        }
        .m-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 40px 0;
          font-size: 0.82rem;
          color: var(--text-secondary);
        }
        .m-spinner {
          width: 28px;
          height: 28px;
          border: 3px solid var(--border-color);
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: m-spin 0.8s linear infinite;
        }
        @keyframes m-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </AppLayout>
  );
}

// ============ MOBILE TRADER DETAIL (inside BottomSheet) ============

function MobileTraderDetail() {
  const { traderModal, handleViewShipments } = useEximData();
  const trader = traderModal.trader;
  if (!trader) return null;

  const formatValue = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const maxProductValue = trader.productBreakdown.length > 0 ? trader.productBreakdown[0].value : 1;

  return (
    <div className="m-td-content">
      {/* Meta */}
      <div className="m-td-meta">
        <span>ID: {trader.id}</span>
        {trader.city && <span>{trader.city}</span>}
        <span>{trader.country}</span>
      </div>

      {/* Stats Grid 2x2 */}
      <div className="m-td-stats">
        <div className="m-td-stat">
          <span className="m-td-stat-val">{trader.totalShipments}</span>
          <span className="m-td-stat-label">Shipments</span>
        </div>
        <div className="m-td-stat">
          <span className="m-td-stat-val">{formatValue(trader.totalValueUSD)}</span>
          <span className="m-td-stat-label">Total Value</span>
        </div>
        <div className="m-td-stat">
          <span className="m-td-stat-val">{formatDate(trader.firstShipmentDate)}</span>
          <span className="m-td-stat-label">Active Since</span>
        </div>
        <div className="m-td-stat">
          <span className="m-td-stat-val">{formatDate(trader.lastShipmentDate)}</span>
          <span className="m-td-stat-label">Last Shipment</span>
        </div>
      </div>

      {/* Top Products */}
      {trader.productBreakdown.length > 0 && (
        <div className="m-td-section">
          <h4 className="m-td-section-title">Top Products</h4>
          {trader.productBreakdown.slice(0, 4).map((p, i) => (
            <div key={i} className="m-td-product-row">
              <div className="m-td-product-info">
                <span className="m-td-product-name">{p.product.substring(0, 40)}</span>
                <span className="m-td-product-hs">HS: {p.hsnCode}</span>
              </div>
              <div className="m-td-bar-track">
                <div className="m-td-bar-fill" style={{ width: `${(p.value / maxProductValue) * 100}%` }} />
              </div>
              <span className="m-td-product-val">{formatValue(p.value)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Countries */}
      {trader.countryBreakdown.length > 0 && (
        <div className="m-td-section">
          <h4 className="m-td-section-title">
            {traderModal.role === 'consignee' ? 'Countries of Origin' : 'Destination Countries'}
          </h4>
          <div className="m-td-country-tags">
            {trader.countryBreakdown.map((c, i) => (
              <span key={i} className="m-td-country-tag">
                {c.country} <strong>{c.percentage}%</strong>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent Shipments */}
      {trader.recentShipments.length > 0 && (
        <div className="m-td-section">
          <h4 className="m-td-section-title">Recent Shipments</h4>
          {trader.recentShipments.slice(0, 3).map(s => (
            <div key={s.id} className="m-td-shipment-mini">
              <div className="m-td-mini-top">
                <span>{formatDate(s.date)}</span>
                <span className="m-td-mini-val">{formatValue(s.valueUSD)}</span>
              </div>
              <div className="m-td-mini-hs">HS: {s.hsnCode}</div>
              <div className="m-td-mini-prod">{s.productDescription.substring(0, 50)}</div>
            </div>
          ))}
        </div>
      )}

      {/* Action */}
      <button
        className="m-td-view-all"
        onClick={() => handleViewShipments(trader.name, traderModal.role)}
      >
        View All Shipments
      </button>

      <style jsx>{`
        .m-td-content {
          padding: 0 20px 20px;
        }
        .m-td-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-bottom: 16px;
        }
        .m-td-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: var(--border-color);
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 16px;
        }
        .m-td-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 14px 8px;
          background: var(--bg-primary);
          text-align: center;
        }
        .m-td-stat-val {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .m-td-stat-label {
          font-size: 0.68rem;
          color: var(--text-secondary);
          margin-top: 2px;
        }
        .m-td-section {
          margin-bottom: 16px;
        }
        .m-td-section-title {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 10px;
        }
        .m-td-product-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .m-td-product-info {
          width: 100px;
          min-width: 100px;
          display: flex;
          flex-direction: column;
        }
        .m-td-product-name {
          font-size: 0.72rem;
          color: var(--text-primary);
          line-height: 1.3;
        }
        .m-td-product-hs {
          font-size: 0.65rem;
          color: var(--text-secondary);
          font-family: monospace;
        }
        .m-td-bar-track {
          flex: 1;
          height: 14px;
          background: var(--bg-secondary, #f1f5f9);
          border-radius: 3px;
          overflow: hidden;
        }
        .m-td-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #2563eb, #60a5fa);
          border-radius: 3px;
          min-width: 3px;
        }
        .m-td-product-val {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--text-primary);
          min-width: 55px;
          text-align: right;
          white-space: nowrap;
        }
        .m-td-country-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .m-td-country-tag {
          padding: 4px 10px;
          background: var(--bg-secondary, #f1f5f9);
          border-radius: 16px;
          font-size: 0.72rem;
          color: var(--text-primary);
        }
        .m-td-country-tag strong {
          color: #2563eb;
        }
        .m-td-shipment-mini {
          padding: 10px;
          background: var(--bg-secondary, #f8fafc);
          border-radius: 8px;
          margin-bottom: 8px;
        }
        .m-td-mini-top {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          color: var(--text-secondary);
          margin-bottom: 4px;
        }
        .m-td-mini-val {
          font-weight: 600;
          color: #059669;
        }
        .m-td-mini-hs {
          font-size: 0.7rem;
          color: #2563eb;
          font-family: monospace;
          margin-bottom: 2px;
        }
        .m-td-mini-prod {
          font-size: 0.75rem;
          color: var(--text-primary);
          line-height: 1.3;
        }
        .m-td-view-all {
          width: 100%;
          padding: 14px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          min-height: 48px;
          margin-top: 8px;
        }
        .m-td-view-all:active {
          background: #1d4ed8;
        }
      `}</style>
    </div>
  );
}
