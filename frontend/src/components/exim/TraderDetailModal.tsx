'use client';

import { TraderDetail } from '@/types/exim';

interface TraderDetailModalProps {
  trader: TraderDetail | null;
  role: 'consignee' | 'shipper';
  isOpen: boolean;
  onClose: () => void;
  onViewShipments: (name: string, role: 'consignee' | 'shipper') => void;
}

export default function TraderDetailModal({ trader, role, isOpen, onClose, onViewShipments }: TraderDetailModalProps) {
  if (!isOpen || !trader) return null;

  const formatValue = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const maxProductValue = trader.productBreakdown.length > 0 ? trader.productBreakdown[0].value : 1;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="header-info">
            <h2 className="trader-name">{trader.name}</h2>
            <div className="trader-meta">
              <span className="meta-item">ID: {trader.id}</span>
              {trader.city && <span className="meta-item">{trader.city}</span>}
              <span className="meta-item">{trader.country}</span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">{trader.totalShipments}</span>
            <span className="stat-label">Total Shipments</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{formatValue(trader.totalValueUSD)}</span>
            <span className="stat-label">Total Value</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{formatDate(trader.firstShipmentDate)}</span>
            <span className="stat-label">Active Since</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{formatDate(trader.lastShipmentDate)}</span>
            <span className="stat-label">Last Shipment</span>
          </div>
        </div>

        {/* Product Breakdown */}
        <div className="section">
          <h3 className="section-title">Top Products</h3>
          <div className="breakdown-list">
            {trader.productBreakdown.slice(0, 5).map((p, i) => (
              <div key={i} className="breakdown-row">
                <div className="breakdown-info">
                  <span className="breakdown-name">{p.product.substring(0, 50)}...</span>
                  <span className="breakdown-hs">HS: {p.hsnCode}</span>
                </div>
                <div className="breakdown-bar-track">
                  <div className="breakdown-bar-fill" style={{ width: `${(p.value / maxProductValue) * 100}%` }} />
                </div>
                <div className="breakdown-value">
                  <span>{formatValue(p.value)}</span>
                  <span className="breakdown-pct">{p.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Country Breakdown */}
        <div className="section">
          <h3 className="section-title">{role === 'consignee' ? 'Countries of Origin' : 'Destination Countries'}</h3>
          <div className="country-tags">
            {trader.countryBreakdown.map((c, i) => (
              <span key={i} className="country-tag">
                {c.country} <strong>{c.percentage}%</strong>
              </span>
            ))}
          </div>
        </div>

        {/* Recent Shipments */}
        <div className="section">
          <h3 className="section-title">Recent Shipments</h3>
          <div className="mini-table-scroll">
            <table className="mini-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>HS Code</th>
                  <th>Product</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {trader.recentShipments.map(s => (
                  <tr key={s.id}>
                    <td>{formatDate(s.date)}</td>
                    <td className="hs-code">{s.hsnCode}</td>
                    <td className="product-cell">{s.productDescription.substring(0, 50)}...</td>
                    <td className="value-cell">{formatValue(s.valueUSD)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action */}
        <div className="modal-actions">
          <button
            className="view-all-btn"
            onClick={() => onViewShipments(trader.name, role)}
          >
            View All Shipments for {trader.name.substring(0, 25)}...
          </button>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 40px 20px;
          overflow-y: auto;
        }
        .modal-content {
          background: var(--bg-primary);
          border-radius: 14px;
          width: 100%;
          max-width: 700px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          overflow: hidden;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 24px 24px 16px;
          border-bottom: 1px solid var(--border-color);
        }
        .trader-name {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 4px;
        }
        .trader-meta {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .meta-item {
          font-size: 0.78rem;
          color: var(--text-secondary);
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0 4px;
          line-height: 1;
        }
        .close-btn:hover {
          color: var(--text-primary);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: var(--border-color);
          border-bottom: 1px solid var(--border-color);
        }
        .stat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px 8px;
          background: var(--bg-primary);
          text-align: center;
        }
        .stat-value {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .stat-label {
          font-size: 0.7rem;
          color: var(--text-secondary);
          margin-top: 2px;
        }
        .section {
          padding: 16px 24px;
          border-bottom: 1px solid var(--border-color);
        }
        .section-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 12px;
        }
        .breakdown-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .breakdown-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .breakdown-info {
          width: 160px;
          min-width: 160px;
          display: flex;
          flex-direction: column;
        }
        .breakdown-name {
          font-size: 0.76rem;
          color: var(--text-primary);
          line-height: 1.3;
        }
        .breakdown-hs {
          font-size: 0.68rem;
          color: var(--text-secondary);
          font-family: monospace;
        }
        .breakdown-bar-track {
          flex: 1;
          height: 16px;
          background: var(--bg-secondary, #f1f5f9);
          border-radius: 4px;
          overflow: hidden;
        }
        .breakdown-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #f97316, #fb923c);
          border-radius: 4px;
          min-width: 4px;
        }
        .breakdown-value {
          width: 80px;
          min-width: 80px;
          text-align: right;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-primary);
          display: flex;
          flex-direction: column;
        }
        .breakdown-pct {
          font-size: 0.68rem;
          font-weight: 400;
          color: var(--text-secondary);
        }
        .country-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .country-tag {
          padding: 4px 12px;
          background: var(--bg-secondary, #f1f5f9);
          border-radius: 20px;
          font-size: 0.78rem;
          color: var(--text-primary);
        }
        .country-tag strong {
          color: #f97316;
        }
        .mini-table-scroll {
          overflow-x: auto;
        }
        .mini-table {
          width: 100%;
          border-collapse: collapse;
        }
        .mini-table th {
          padding: 8px 10px;
          text-align: left;
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          border-bottom: 1px solid var(--border-color);
        }
        .mini-table td {
          padding: 8px 10px;
          font-size: 0.78rem;
          color: var(--text-primary);
          border-bottom: 1px solid var(--border-color);
        }
        .hs-code {
          color: #f97316;
          font-family: monospace;
          font-weight: 500;
        }
        .product-cell {
          max-width: 250px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .value-cell {
          font-weight: 600;
          text-align: right;
          white-space: nowrap;
        }
        .modal-actions {
          padding: 16px 24px;
        }
        .view-all-btn {
          width: 100%;
          padding: 12px;
          background: #f97316;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
        }
        .view-all-btn:hover {
          background: #ea580c;
        }
        @media (max-width: 768px) {
          .modal-overlay {
            padding: 20px 10px;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .breakdown-info {
            width: 100px;
            min-width: 100px;
          }
          .section {
            padding: 14px 16px;
          }
        }
      `}</style>
    </div>
  );
}
