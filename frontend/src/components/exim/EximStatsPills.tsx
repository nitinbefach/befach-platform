'use client';

import { EximStats } from '@/types/exim';
import { STAT_PILL_COLORS } from '@/lib/eximConstants';

interface EximStatsPillsProps {
  stats: EximStats | null;
}

const pillConfig = [
  { key: 'shipments', label: 'Shipments' },
  { key: 'consignees', label: 'Consignee' },
  { key: 'shippers', label: 'Shipper' },
  { key: 'countriesOfOrigin', label: 'Country of Origin' },
  { key: 'portsOfDestination', label: 'Port of Destination' },
  { key: 'hsCodes', label: 'HS Code' },
  { key: 'notifyParties', label: 'Notify Party Name' },
];

export default function EximStatsPills({ stats }: EximStatsPillsProps) {
  if (!stats) return null;

  return (
    <div className="stats-pills">
      {pillConfig.map(pill => {
        const value = stats[pill.key as keyof EximStats];
        const color = STAT_PILL_COLORS[pill.key] || '#6b7280';

        return (
          <div key={pill.key} className="stat-pill" style={{ background: color }}>
            <span className="pill-label">{pill.label}</span>
            <span className="pill-value">{value.toLocaleString()}</span>
            <span className="pill-arrow">&#9660;</span>
          </div>
        );
      })}

      <style jsx>{`
        .stats-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 16px 0;
        }
        .stat-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 6px;
          color: white;
          font-size: 0.813rem;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.15s;
          white-space: nowrap;
        }
        .stat-pill:hover {
          opacity: 0.9;
        }
        .pill-label {
          font-weight: 600;
        }
        .pill-value {
          font-weight: 400;
        }
        .pill-arrow {
          font-size: 0.6rem;
          opacity: 0.7;
        }
        @media (max-width: 1024px) {
          .stats-pills {
            flex-wrap: nowrap;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            gap: 6px;
          }
          .stats-pills::-webkit-scrollbar { display: none; }
          .stat-pill {
            padding: 6px 10px;
            font-size: 0.75rem;
            flex-shrink: 0;
          }
        }
      `}</style>
    </div>
  );
}
