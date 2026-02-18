'use client';

import { Search, ClipboardList, MessageCircle, CheckCircle, BarChart3 } from 'lucide-react';
import { RequirementStatus, STATUS_CONFIG } from '@/lib/requirements';

interface RequirementStatsProps {
  stats: Record<RequirementStatus, number>;
  onFilterClick: (status: RequirementStatus | null) => void;
  activeFilter: RequirementStatus | null;
}

export default function RequirementStats({
  stats,
  onFilterClick,
  activeFilter,
}: RequirementStatsProps) {
  const statCards: { status: RequirementStatus; icon: React.ReactNode }[] = [
    { status: 'matching', icon: <Search size={16} /> },
    { status: 'quoted', icon: <ClipboardList size={16} /> },
    { status: 'negotiating', icon: <MessageCircle size={16} /> },
    { status: 'completed', icon: <CheckCircle size={16} /> },
  ];

  const totalActive = stats.matching + stats.quoted + stats.negotiating;

  return (
    <div className="stats-container">
      {/* Total Active Card */}
      <div
        className={`stat-card total ${activeFilter === null ? 'active' : ''}`}
        onClick={() => onFilterClick(null)}
      >
        <div className="stat-icon"><BarChart3 size={16} /></div>
        <div className="stat-content">
          <span className="stat-value">{totalActive}</span>
          <span className="stat-label">Active</span>
        </div>
      </div>

      {/* Status Cards */}
      {statCards.map(({ status, icon }) => {
        const config = STATUS_CONFIG[status];
        const count = stats[status];

        return (
          <div
            key={status}
            className={`stat-card ${activeFilter === status ? 'active' : ''}`}
            onClick={() => onFilterClick(status)}
            style={{
              '--accent-color': config.color,
              '--accent-bg': config.bgColor,
            } as React.CSSProperties}
          >
            <div className="stat-icon">{icon}</div>
            <div className="stat-content">
              <span className="stat-value">{count}</span>
              <span className="stat-label">{config.label}</span>
            </div>
            {count > 0 && status === 'matching' && (
              <div className="pulse-indicator" style={{ backgroundColor: config.color }} />
            )}
          </div>
        );
      })}

      <style jsx>{`
        .stats-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 16px;
        }

        .stat-card {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 2px solid transparent;
          position: relative;
          overflow: hidden;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .stat-card.active {
          border-color: var(--accent-color, var(--accent-primary));
          background: var(--accent-bg, rgba(249, 115, 22, 0.05));
        }

        .stat-card.total {
          --accent-color: var(--accent-primary);
          --accent-bg: rgba(249, 115, 22, 0.05);
        }

        .stat-icon {
          font-size: 1.5rem;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
          white-space: nowrap;
        }

        .pulse-indicator {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.3);
          }
        }

        @media (max-width: 768px) {
          .stats-container {
            grid-template-columns: repeat(2, 1fr);
          }

          .stat-card.total {
            grid-column: span 2;
          }
        }
      `}</style>
    </div>
  );
}
