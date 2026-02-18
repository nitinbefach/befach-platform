'use client';

import { useState } from 'react';
import { ShipmentRecord, EximSortField, SortDirection } from '@/types/exim';
import { SORT_OPTIONS, RESULTS_PER_PAGE } from '@/lib/eximConstants';

interface ShipmentTableProps {
  shipments: ShipmentRecord[];
  totalCount: number;
  page: number;
  onPageChange: (page: number) => void;
  onSortChange: (field: string, dir: string) => void;
  onConsigneeClick: (id: string) => void;
  onShipperClick: (id: string) => void;
  onExportCSV: () => void;
  sortField: string;
  sortDir: string;
}

export default function ShipmentTable({
  shipments, totalCount, page, onPageChange, onSortChange,
  onConsigneeClick, onShipperClick, onExportCSV, sortField, sortDir,
}: ShipmentTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const totalPages = Math.ceil(totalCount / RESULTS_PER_PAGE);

  const toggleExpand = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  };

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const option = SORT_OPTIONS.find(o => o.id === e.target.value);
    if (option) {
      onSortChange(option.field, option.direction);
    }
  };

  const currentSortId = SORT_OPTIONS.find(o => o.field === sortField && o.direction === sortDir)?.id || 'date-desc';

  return (
    <div className="shipment-table-wrapper">
      {/* Table controls */}
      <div className="table-controls">
        <span className="result-count">
          Showing {((page - 1) * RESULTS_PER_PAGE) + 1}–{Math.min(page * RESULTS_PER_PAGE, totalCount)} of {totalCount.toLocaleString()} shipments
        </span>
        <div className="controls-right">
          <button className="export-btn" onClick={onExportCSV}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export CSV
          </button>
          <select className="sort-select" value={currentSortId} onChange={handleSort}>
            {SORT_OPTIONS.map(o => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-scroll">
        <table className="shipment-table">
          <thead>
            <tr>
              <th className="col-expand"></th>
              <th className="col-date">Date</th>
              <th className="col-hs">HS Code</th>
              <th className="col-product">Product</th>
              <th className="col-consignee">Consignee Name</th>
              <th className="col-shipper">Shipper Name</th>
              <th className="col-value">Value (USD)</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map(s => (
              <>
                <tr key={s.id} className={`table-row ${expandedRow === s.id ? 'expanded' : ''}`}>
                  <td className="col-expand">
                    <button className="expand-btn" onClick={() => toggleExpand(s.id)}>
                      {expandedRow === s.id ? '−' : '+'}
                    </button>
                  </td>
                  <td className="col-date">{formatDate(s.date)}</td>
                  <td className="col-hs">
                    <span className="hs-link">{s.hsnCode}</span>
                  </td>
                  <td className="col-product">
                    <span className="product-text">{s.productDescription}</span>
                  </td>
                  <td className="col-consignee">
                    <button className="trader-link" onClick={() => onConsigneeClick(s.consigneeId)}>
                      {s.consigneeName}
                      <span className="trader-id"> - ID - {s.consigneeId}</span>
                    </button>
                  </td>
                  <td className="col-shipper">
                    <button className="trader-link" onClick={() => onShipperClick(s.shipperId)}>
                      {s.shipperName}
                    </button>
                  </td>
                  <td className="col-value">{formatValue(s.valueUSD)}</td>
                </tr>
                {expandedRow === s.id && (
                  <tr key={`${s.id}-detail`} className="detail-row">
                    <td colSpan={7}>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <span className="detail-label">Bill of Lading</span>
                          <span className="detail-value">{s.billOfLadingNo}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Country of Origin</span>
                          <span className="detail-value">{s.countryOfOrigin}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Port of Origin</span>
                          <span className="detail-value">{s.portOfOrigin}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Port of Destination</span>
                          <span className="detail-value">{s.portOfDestination}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Quantity</span>
                          <span className="detail-value">{s.quantity.toLocaleString()} {s.quantityUnit}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Weight</span>
                          <span className="detail-value">{s.weightKg.toLocaleString()} KG</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Notify Party</span>
                          <span className="detail-value">{s.notifyPartyName}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Data Type</span>
                          <span className="detail-value type-badge">{s.dataType.toUpperCase()}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button className="page-btn" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            &laquo; Prev
          </button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 7) {
              pageNum = i + 1;
            } else if (page <= 4) {
              pageNum = i + 1;
            } else if (page >= totalPages - 3) {
              pageNum = totalPages - 6 + i;
            } else {
              pageNum = page - 3 + i;
            }
            return (
              <button
                key={pageNum}
                className={`page-btn ${pageNum === page ? 'active' : ''}`}
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
          <button className="page-btn" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
            Next &raquo;
          </button>
        </div>
      )}

      <style jsx>{`
        .shipment-table-wrapper {
          flex: 1;
          min-width: 0;
        }
        .table-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .result-count {
          font-size: 0.813rem;
          color: var(--text-secondary);
        }
        .controls-right {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .export-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          font-size: 0.8rem;
          color: var(--text-primary);
          cursor: pointer;
          font-weight: 500;
        }
        .export-btn:hover {
          background: var(--bg-secondary);
        }
        .sort-select {
          padding: 7px 10px;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          font-size: 0.8rem;
          background: var(--bg-primary);
          color: var(--text-primary);
          cursor: pointer;
        }
        .table-scroll {
          overflow-x: auto;
          border: 1px solid var(--border-color);
          border-radius: 8px;
        }
        .shipment-table {
          width: 100%;
          min-width: 900px;
          border-collapse: collapse;
        }
        .shipment-table thead {
          background: #f97316;
          color: white;
        }
        .shipment-table th {
          padding: 12px 14px;
          text-align: left;
          font-size: 0.8rem;
          font-weight: 600;
          white-space: nowrap;
          border-bottom: 2px solid #ea580c;
        }
        .shipment-table td {
          padding: 12px 14px;
          font-size: 0.813rem;
          color: var(--text-primary);
          border-bottom: 1px solid var(--border-color);
          vertical-align: top;
        }
        .table-row:hover {
          background: var(--bg-secondary, #f8fafc);
        }
        .table-row.expanded {
          background: var(--bg-secondary, #f8fafc);
        }
        .col-expand {
          width: 36px;
          text-align: center;
          padding: 12px 6px !important;
        }
        .expand-btn {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid #f97316;
          background: white;
          color: #f97316;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
        .expand-btn:hover {
          background: #f97316;
          color: white;
        }
        .col-date {
          white-space: nowrap;
          width: 100px;
        }
        .col-hs {
          width: 90px;
        }
        .hs-link {
          color: #f97316;
          font-weight: 500;
          cursor: pointer;
        }
        .hs-link:hover {
          text-decoration: underline;
        }
        .col-product {
          max-width: 320px;
        }
        .product-text {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          font-size: 0.78rem;
          line-height: 1.4;
          color: var(--text-primary);
        }
        .col-consignee, .col-shipper {
          min-width: 160px;
        }
        .trader-link {
          background: none;
          border: none;
          color: #f97316;
          font-size: 0.8rem;
          cursor: pointer;
          text-align: left;
          padding: 0;
          font-weight: 500;
          line-height: 1.3;
        }
        .trader-link:hover {
          text-decoration: underline;
        }
        .trader-id {
          font-weight: 400;
          font-size: 0.72rem;
          color: var(--text-secondary);
          display: block;
        }
        .col-value {
          white-space: nowrap;
          text-align: right;
          font-weight: 600;
          width: 110px;
        }
        .detail-row td {
          padding: 0 14px 16px;
          background: var(--bg-secondary, #f8fafc);
        }
        .detail-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          padding: 14px;
          background: var(--bg-primary);
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }
        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .detail-label {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .detail-value {
          font-size: 0.8rem;
          color: var(--text-primary);
          font-weight: 500;
        }
        .type-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 700;
          background: rgba(249, 115, 22, 0.12);
          color: #ea580c;
        }
        .pagination {
          display: flex;
          justify-content: center;
          gap: 4px;
          margin-top: 16px;
          flex-wrap: wrap;
        }
        .page-btn {
          padding: 6px 12px;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 0.8rem;
          cursor: pointer;
        }
        .page-btn:hover:not(:disabled) {
          background: var(--bg-secondary);
        }
        .page-btn.active {
          background: #f97316;
          color: white;
          border-color: #f97316;
        }
        .page-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        @media (max-width: 768px) {
          .table-controls {
            flex-direction: column;
            align-items: flex-start;
          }
          .detail-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
