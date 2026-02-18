'use client';

import { TraderSummary } from '@/types/exim';

interface ConsigneeTabProps {
  consignees: TraderSummary[];
  onConsigneeClick: (id: string) => void;
}

export default function ConsigneeTab({ consignees, onConsigneeClick }: ConsigneeTabProps) {
  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  if (consignees.length === 0) {
    return (
      <div className="empty-state">
        <p>No consignees found for the current search.</p>
        <style jsx>{`
          .empty-state { text-align: center; padding: 48px 20px; color: var(--text-secondary); }
        `}</style>
      </div>
    );
  }

  return (
    <div className="consignee-tab">
      <div className="trader-table-scroll">
        <table className="trader-table">
          <thead>
            <tr>
              <th>Consignee Name</th>
              <th>City</th>
              <th>Shipments</th>
              <th>Total Value</th>
              <th>Top Products</th>
              <th>Active Since</th>
            </tr>
          </thead>
          <tbody>
            {consignees.map(c => (
              <tr key={c.id} className="trader-row">
                <td>
                  <button className="trader-name" onClick={() => onConsigneeClick(c.id)}>
                    {c.name}
                    <span className="trader-id">ID: {c.id}</span>
                  </button>
                </td>
                <td className="cell-city">{c.city}</td>
                <td className="cell-shipments">{c.totalShipments}</td>
                <td className="cell-value">{formatValue(c.totalValueUSD)}</td>
                <td className="cell-products">
                  {c.topProducts.map((p, i) => (
                    <span key={i} className="product-tag">{p.substring(0, 30)}...</span>
                  ))}
                </td>
                <td className="cell-date">
                  {new Date(c.firstShipmentDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .consignee-tab {
          width: 100%;
        }
        .trader-table-scroll {
          overflow-x: auto;
          border: 1px solid var(--border-color);
          border-radius: 8px;
        }
        .trader-table {
          width: 100%;
          min-width: 800px;
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
          color: #f97316;
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          text-align: left;
          padding: 0;
          line-height: 1.3;
        }
        .trader-name:hover {
          text-decoration: underline;
        }
        .trader-id {
          display: block;
          font-size: 0.72rem;
          font-weight: 400;
          color: var(--text-secondary);
          margin-top: 2px;
        }
        .cell-city {
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
