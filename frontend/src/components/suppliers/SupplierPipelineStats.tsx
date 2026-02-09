'use client';

import {
  RelationshipStage,
  RELATIONSHIP_STAGE_CONFIG,
  PipelineStats,
  formatCurrency
} from '@/lib/savedSuppliers';

interface SupplierPipelineStatsProps {
  stats: PipelineStats;
  onStageClick?: (stage: RelationshipStage) => void;
  activeStages?: RelationshipStage[];
}

export function SupplierPipelineStats({
  stats,
  onStageClick,
  activeStages = []
}: SupplierPipelineStatsProps) {
  const mainStages: RelationshipStage[] = ['contacted', 'negotiating', 'deal_active', 'deal_completed'];

  return (
    <div className="pipeline-stats">
      {/* Pipeline Visualization */}
      <div className="pipeline-header">
        <h2>Supplier Pipeline</h2>
        <span className="total-count">{stats.totalSuppliers} suppliers</span>
      </div>

      {/* Stage Cards */}
      <div className="stage-cards">
        {mainStages.map((stage, index) => {
          const config = RELATIONSHIP_STAGE_CONFIG[stage];
          const count = stats.byStage[stage];
          const isActive = activeStages.includes(stage);
          const Icon = config.icon;

          return (
            <div key={stage} className="stage-card-wrapper">
              <button
                className={`stage-card ${isActive ? 'active' : ''}`}
                onClick={() => onStageClick?.(stage)}
                style={{
                  '--stage-color': config.color,
                  '--stage-bg': config.bgColor
                } as React.CSSProperties}
              >
                <div className="card-header">
                  <span className="stage-icon"><Icon size={16} /></span>
                  <span className="stage-count">{count}</span>
                </div>
                <span className="stage-label">{config.label}</span>
              </button>
              {index < mainStages.length - 1 && (
                <div className="stage-connector">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="quick-stat">
          <div className="stat-value">{formatCurrency(stats.activeDealValue)}</div>
          <div className="stat-label">Active Deal Value</div>
        </div>
        <div className="quick-stat">
          <div className="stat-value">{stats.conversionRate}%</div>
          <div className="stat-label">Conversion Rate</div>
        </div>
        <div className="quick-stat">
          <div className="stat-value warning">{stats.overdueFollowUps}</div>
          <div className="stat-label">Overdue Follow-ups</div>
        </div>
        <div className="quick-stat">
          <div className="stat-value">{stats.newContactsThisMonth}</div>
          <div className="stat-label">New This Month</div>
        </div>
      </div>

      {/* On Hold / Blocked Summary */}
      {(stats.byStage.on_hold > 0 || stats.byStage.blocked > 0) && (
        <div className="secondary-stats">
          {stats.byStage.on_hold > 0 && (
            <button
              className={`secondary-badge on-hold ${activeStages.includes('on_hold') ? 'active' : ''}`}
              onClick={() => onStageClick?.('on_hold')}
            >
              <span>⏸️</span>
              <span>{stats.byStage.on_hold} On Hold</span>
            </button>
          )}
          {stats.byStage.blocked > 0 && (
            <button
              className={`secondary-badge blocked ${activeStages.includes('blocked') ? 'active' : ''}`}
              onClick={() => onStageClick?.('blocked')}
            >
              <span>🚫</span>
              <span>{stats.byStage.blocked} Blocked</span>
            </button>
          )}
        </div>
      )}

      <style jsx>{`
        .pipeline-stats {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .pipeline-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .pipeline-header h2 {
          font-size: 1.2rem;
          color: var(--text-primary);
          margin: 0;
        }

        .total-count {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .stage-cards {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          margin-bottom: 24px;
          overflow-x: auto;
          padding: 8px 0;
        }

        .stage-card-wrapper {
          display: flex;
          align-items: center;
        }

        .stage-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px 24px;
          background: var(--bg-tertiary);
          border: 2px solid var(--border-color);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 100px;
        }

        .stage-card:hover {
          border-color: var(--stage-color);
          background: var(--stage-bg);
          transform: translateY(-2px);
        }

        .stage-card.active {
          border-color: var(--stage-color);
          background: var(--stage-bg);
          box-shadow: 0 4px 12px var(--stage-color)30;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stage-icon {
          font-size: 1.2rem;
        }

        .stage-count {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--stage-color);
        }

        .stage-label {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .stage-connector {
          color: var(--text-muted);
          opacity: 0.5;
          margin: 0 4px;
        }

        .quick-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          padding: 16px;
          background: var(--bg-tertiary);
          border-radius: 12px;
        }

        .quick-stat {
          text-align: center;
        }

        .stat-value {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-value.warning {
          color: #ef4444;
        }

        .stat-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-top: 4px;
        }

        .secondary-stats {
          display: flex;
          gap: 12px;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
        }

        .secondary-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .secondary-badge:hover,
        .secondary-badge.active {
          border-color: var(--text-secondary);
        }

        .secondary-badge.on-hold:hover,
        .secondary-badge.on-hold.active {
          background: rgba(107, 114, 128, 0.15);
          border-color: #6B7280;
          color: #6B7280;
        }

        .secondary-badge.blocked:hover,
        .secondary-badge.blocked.active {
          background: rgba(239, 68, 68, 0.15);
          border-color: #EF4444;
          color: #EF4444;
        }

        @media (max-width: 768px) {
          .pipeline-stats {
            padding: 16px;
            margin-bottom: 16px;
            border-radius: 12px;
          }

          .pipeline-header {
            margin-bottom: 12px;
          }

          .pipeline-header h2 {
            font-size: 1rem;
          }

          .total-count {
            font-size: 0.8rem;
          }

          /* Horizontal scroll strip on mobile */
          .stage-cards {
            justify-content: flex-start;
            gap: 0;
            margin-bottom: 16px;
            margin-left: -16px;
            margin-right: -16px;
            padding-left: 16px;
            padding-right: 16px;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }

          .stage-cards::-webkit-scrollbar {
            display: none;
          }

          .stage-card {
            min-width: 80px;
            padding: 10px 14px;
            gap: 4px;
            flex-shrink: 0;
          }

          .stage-count {
            font-size: 1.25rem;
          }

          .stage-label {
            font-size: 0.75rem;
          }

          .stage-connector {
            display: none;
          }

          /* 2x2 quick stats */
          .quick-stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            padding: 12px;
          }

          .stat-value {
            font-size: 1.1rem;
          }

          .stat-label {
            font-size: 0.7rem;
          }

          .secondary-stats {
            margin-top: 12px;
            padding-top: 12px;
          }

          .secondary-badge {
            font-size: 0.8rem;
            padding: 6px 12px;
          }
        }
      `}</style>
    </div>
  );
}

export default SupplierPipelineStats;
