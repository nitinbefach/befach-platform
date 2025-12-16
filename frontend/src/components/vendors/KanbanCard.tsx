'use client';

import { Vendor } from '@/lib/vendors';
import { getRelativeTime } from '@/lib/savedSuppliers';
import { getScoreColor } from '@/lib/healthScore';

interface KanbanCardProps {
  vendor: Vendor;
  onClick: () => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, vendor: Vendor) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  isDragging?: boolean;
}

export function KanbanCard({
  vendor,
  onClick,
  onDragStart,
  onDragEnd,
  isDragging = false
}: KanbanCardProps) {
  const scoreColor = getScoreColor(vendor.healthScore);
  const lastActivity = vendor.activities?.[0]?.createdAt || vendor.lastContactedDate || vendor.savedAt;

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    // Set data for transfer
    e.dataTransfer.setData('vendorId', vendor.id);
    e.dataTransfer.setData('fromStage', vendor.relationshipStage);
    e.dataTransfer.effectAllowed = 'move';

    // Call parent handler
    onDragStart(e, vendor);
  };

  return (
    <div
      className={`kanban-card ${isDragging ? 'dragging' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
    >
      {/* Vendor Name */}
      <div className="card-name">
        {vendor.name}
        {vendor.verified && <span className="verified-icon">✓</span>}
      </div>

      {/* Health Score */}
      <div className="card-health">
        <span
          className="health-dot"
          style={{ backgroundColor: scoreColor }}
        />
        <span className="health-value" style={{ color: scoreColor }}>
          {vendor.healthScore}
        </span>
      </div>

      {/* Location */}
      <div className="card-location">
        <span className="flag">{vendor.countryFlag}</span>
        <span className="location-text">{vendor.location}</span>
      </div>

      {/* Last Activity */}
      <div className="card-activity">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span>{getRelativeTime(lastActivity)}</span>
      </div>

      <style jsx>{`
        .kanban-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          padding: 14px;
          cursor: grab;
          transition: all 0.2s ease;
          user-select: none;
        }

        .kanban-card:hover {
          border-color: var(--accent-primary);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .kanban-card:active {
          cursor: grabbing;
        }

        .kanban-card.dragging {
          opacity: 0.5;
          transform: rotate(3deg);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        .card-name {
          font-weight: 600;
          font-size: 14px;
          color: var(--text-primary);
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
          line-height: 1.3;
        }

        .verified-icon {
          font-size: 11px;
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
          padding: 2px 4px;
          border-radius: 4px;
        }

        .card-health {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }

        .health-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .health-value {
          font-weight: 700;
          font-size: 14px;
        }

        .card-location {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--text-secondary);
          margin-bottom: 6px;
        }

        .flag {
          font-size: 14px;
        }

        .location-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-activity {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: var(--text-muted);
        }

        .card-activity svg {
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}

export default KanbanCard;
