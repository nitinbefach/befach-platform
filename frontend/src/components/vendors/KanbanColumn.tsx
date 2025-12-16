'use client';

import { useState } from 'react';
import { Vendor } from '@/lib/vendors';
import { RelationshipStage, RELATIONSHIP_STAGE_CONFIG } from '@/lib/savedSuppliers';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  stage: RelationshipStage;
  vendors: Vendor[];
  onCardClick: (vendor: Vendor) => void;
  onDrop: (vendorId: string, fromStage: RelationshipStage, toStage: RelationshipStage) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, vendor: Vendor) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  draggingVendorId: string | null;
}

export function KanbanColumn({
  stage,
  vendors,
  onCardClick,
  onDrop,
  onDragStart,
  onDragEnd,
  draggingVendorId
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const config = RELATIONSHIP_STAGE_CONFIG[stage];

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Only set drag over false if leaving the column entirely
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const vendorId = e.dataTransfer.getData('vendorId');
    const fromStage = e.dataTransfer.getData('fromStage') as RelationshipStage;

    if (vendorId && fromStage !== stage) {
      onDrop(vendorId, fromStage, stage);
    }
  };

  return (
    <div
      className={`kanban-column ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="column-header">
        <div className="header-left">
          <span className="stage-icon" style={{ background: `${config.color}20`, color: config.color }}>
            {config.icon}
          </span>
          <span className="stage-name">{config.label}</span>
        </div>
        <span className="vendor-count">{vendors.length}</span>
      </div>

      {/* Column Content */}
      <div className="column-content">
        {vendors.length === 0 ? (
          <div className="empty-column">
            <p>No vendors in this stage</p>
            <span>Drag a vendor here</span>
          </div>
        ) : (
          vendors.map(vendor => (
            <KanbanCard
              key={vendor.id}
              vendor={vendor}
              onClick={() => onCardClick(vendor)}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              isDragging={draggingVendorId === vendor.id}
            />
          ))
        )}

        {/* Drop Zone Indicator */}
        {isDragOver && (
          <div className="drop-indicator">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Drop here to move to {config.label}</span>
          </div>
        )}
      </div>

      <style jsx>{`
        .kanban-column {
          display: flex;
          flex-direction: column;
          min-width: 280px;
          max-width: 320px;
          background: var(--bg-tertiary);
          border-radius: 12px;
          border: 2px solid transparent;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .kanban-column.drag-over {
          border-color: var(--accent-primary);
          background: rgba(249, 115, 22, 0.05);
        }

        .column-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border-bottom: 1px solid var(--border-color);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .stage-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }

        .stage-name {
          font-weight: 600;
          font-size: 14px;
          color: var(--text-primary);
        }

        .vendor-count {
          background: var(--bg-secondary);
          color: var(--text-secondary);
          font-size: 12px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 12px;
          min-width: 28px;
          text-align: center;
        }

        .column-content {
          flex: 1;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          overflow-y: auto;
          max-height: calc(100vh - 380px);
          min-height: 200px;
        }

        .empty-column {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 120px;
          color: var(--text-muted);
          text-align: center;
          border: 2px dashed var(--border-color);
          border-radius: 10px;
          background: var(--bg-secondary);
        }

        .empty-column p {
          font-size: 13px;
          margin: 0 0 4px 0;
        }

        .empty-column span {
          font-size: 11px;
          opacity: 0.7;
        }

        .drop-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 20px;
          border: 2px dashed var(--accent-primary);
          border-radius: 10px;
          background: rgba(249, 115, 22, 0.1);
          color: var(--accent-primary);
          font-size: 12px;
          font-weight: 500;
          animation: pulse 1s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        /* Custom scrollbar for column content */
        .column-content::-webkit-scrollbar {
          width: 6px;
        }

        .column-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .column-content::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 3px;
        }

        .column-content::-webkit-scrollbar-thumb:hover {
          background: var(--text-muted);
        }
      `}</style>
    </div>
  );
}

export default KanbanColumn;
