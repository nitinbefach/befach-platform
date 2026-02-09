'use client';

import { AppLayout } from '@/components/layout';
import {
  EximSearchBar,
  EximStatsPills,
  EximFiltersSidebar,
  ShipmentTable,
  ConsigneeTab,
  ShipperTab,
  SummaryTab,
  TraderDetailModal,
} from '@/components/exim';
import { useEximData, TABS } from './EximDataContext';

export default function WebEximData() {
  const {
    hasSearched,
    loading,
    handleSearch,
    shipments,
    totalCount,
    stats,
    consignees,
    shippers,
    countries,
    hsCodes,
    page,
    sortField,
    sortDir,
    handlePageChange,
    handleSortChange,
    sidebarFilters,
    sidebarCollapsed,
    setSidebarCollapsed,
    handleFilterChange,
    activeTab,
    setActiveTab,
    traderModal,
    openTraderModal,
    closeTraderModal,
    handleViewShipments,
    handleExportCSV,
    totalValue,
  } = useEximData();

  return (
    <AppLayout>
      <div className="exim-page">
        {/* Header */}
        <div className="content-header">
          <h1>EX-IM Data</h1>
          <p>Search global import-export trade data by product, HS code, consignee, or shipper</p>
        </div>

        {/* Search Bar */}
        <EximSearchBar onSearch={handleSearch} loading={loading} />

        {/* Results Section */}
        {hasSearched && (
          <>
            {/* Stats Pills */}
            <EximStatsPills stats={stats} />

            {/* Tabs */}
            <div className="tabs-bar">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'shipments' && (
                <div className="shipments-layout">
                  <EximFiltersSidebar
                    filters={sidebarFilters}
                    onChange={handleFilterChange}
                    collapsed={sidebarCollapsed}
                    onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                  />
                  <ShipmentTable
                    shipments={shipments}
                    totalCount={totalCount}
                    page={page}
                    onPageChange={handlePageChange}
                    onSortChange={handleSortChange}
                    onConsigneeClick={(id) => openTraderModal(id, 'consignee')}
                    onShipperClick={(id) => openTraderModal(id, 'shipper')}
                    onExportCSV={handleExportCSV}
                    sortField={sortField}
                    sortDir={sortDir}
                  />
                </div>
              )}

              {activeTab === 'summary' && (
                <SummaryTab
                  countries={countries}
                  hsCodes={hsCodes}
                  totalValue={totalValue}
                />
              )}

              {activeTab === 'consignee' && (
                <ConsigneeTab
                  consignees={consignees}
                  onConsigneeClick={(id) => openTraderModal(id, 'consignee')}
                />
              )}

              {activeTab === 'shipper' && (
                <ShipperTab
                  shippers={shippers}
                  onShipperClick={(id) => openTraderModal(id, 'shipper')}
                />
              )}
            </div>
          </>
        )}

        {/* Empty state before search */}
        {!hasSearched && (
          <div className="empty-state">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.25">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <h3 className="empty-title">Search Global Trade Data</h3>
            <p className="empty-desc">
              Select a country, choose your search criteria, and enter keywords to explore
              import-export shipment records, consignees, and shippers worldwide.
            </p>
          </div>
        )}

        {/* Loading overlay */}
        {loading && hasSearched && (
          <div className="loading-overlay">
            <div className="loading-spinner" />
            <span>Loading results...</span>
          </div>
        )}

        {/* Trader Detail Modal */}
        <TraderDetailModal
          trader={traderModal.trader}
          role={traderModal.role}
          isOpen={traderModal.isOpen}
          onClose={closeTraderModal}
          onViewShipments={handleViewShipments}
        />
      </div>

      <style jsx>{`
        .exim-page {
          padding: 24px 32px;
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
        }
        .content-header {
          margin-bottom: 24px;
        }
        .content-header h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 4px;
        }
        .content-header p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin: 0;
        }

        /* Tabs */
        .tabs-bar {
          display: flex;
          gap: 2px;
          border-bottom: 2px solid var(--border-color);
          margin-bottom: 20px;
          overflow-x: auto;
        }
        .tab-btn {
          padding: 10px 20px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s;
        }
        .tab-btn:hover {
          color: var(--text-primary);
          background: var(--bg-secondary, #f8fafc);
        }
        .tab-btn.active {
          color: #2563eb;
          border-bottom-color: #2563eb;
          font-weight: 600;
          background: rgba(37, 99, 235, 0.05);
          border-radius: 6px 6px 0 0;
        }

        /* Shipments layout: sidebar + table */
        .shipments-layout {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        /* Tab content */
        .tab-content {
          min-height: 300px;
        }

        /* Empty state */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          text-align: center;
        }
        .empty-icon {
          color: var(--text-secondary);
          opacity: 0.3;
          margin-bottom: 20px;
        }
        .empty-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 8px;
        }
        .empty-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          max-width: 480px;
          line-height: 1.5;
          margin: 0;
        }

        /* Loading overlay */
        .loading-overlay {
          position: absolute;
          top: 200px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 24px;
          background: var(--bg-primary);
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          z-index: 10;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--border-color);
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .exim-page {
            padding: 20px;
          }
          .shipments-layout {
            flex-direction: column;
          }
        }
      `}</style>
    </AppLayout>
  );
}
