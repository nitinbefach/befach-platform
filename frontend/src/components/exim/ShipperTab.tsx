'use client';

import { TraderSummary } from '@/types/exim';

interface ShipperTabProps {
  shippers: TraderSummary[];
  onShipperClick: (id: string) => void;
}

export default function ShipperTab({ shippers, onShipperClick }: ShipperTabProps) {
  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  if (shippers.length === 0) {
    return (
      <div className="empty-state">
        <p>No shippers found for the current search.</p>
        <style jsx>{`
          .empty-state { text-align: center; padding: 48px 20px; color: var(--text-secondary); }
        `}</style>
      </div>
    );
  }

  return (
    <div className="shipper-tab">
      <div className="trader-table-scroll">
        <table className="trader-table">
          <thead>
            <tr>
              <th>Shipper Name</th>
              <th>Country</th>
              <th>Shipments</th>
              <th>Total Value</th>
              <th>Top Products</th>
              <th>Last Shipment</th>
            </tr>
          </thead>
          <tbody>
            {shippers.map(s => (
              <tr key={s.id} className="trader-row">
                <td>
                  <button className="trader-name" onClick={() => onShipperClick(s.id)}>
                    {s.name}
                  </button>
                </td>
                <td className="cell-country">{s.country}</td>
                <td className="cell-shipments">{s.totalShipments}</td>
                <td className="cell-value">{formatValue(s.totalValueUSD)}</td>
                <td className="cell-products">
                  {s.topProducts.map((p, i) => (
                    <span key={i} className="product-tag">{p.substring(0, 30)}...</span>
                  ))}
                </td>
                <td className="cell-date">
                  {new Date(s.lastShipmentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .shipper-tab {
          width: 100%;
        }
        .trader-table-scroll {
          overflow-x: auto;
          border: 1px solid var(--border-color);
          border-radius: 8px;
        }
        .trader-table {
          width: 100%;
          min-width: 750px;
          border-collapse: collapse;
        }
        .trader-table thead {
          background: #f1f5f9;
        }
        .trader-table th {
          padding: 12px 14px;
          text-align: left;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.3px;
          border-bottom: 2px solid var(--border-color);
        }
        .trader-table td {
          padding: 14px;
          font-size: 0.84rem;
          border-bottom: 1px solid var(--border-color);
          vertical-align: top;
        }
        .trader-row:hover {
          background: var(--bg-secondary, #f8fafc);
        }
        .trader-name {
          background: none;
          border: none;
          color: #2563eb;
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          text-align: left;
          padding: 0;
        }
        .trader-name:hover {
          text-decoration: underline;
        }
        .cell-country {
          color: var(--text-secondary);
        }
        .cell-shipments {
          font-weight: 600;
          text-align: center;
        }
        .cell-value {
          font-weight: 600;
          color: #059669;
          white-space: nowrap;
        }
        .cell-products {
          max-width: 200px;
        }
        .product-tag {
          display: block;
          font-size: 0.72rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }
        .cell-date {
          white-space: nowrap;
          color: var(--text-secondary);
          font-size: 0.8rem;
        }
      `}</style>
    </div>
  );
}
