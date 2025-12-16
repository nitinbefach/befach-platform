'use client';

import { useState, useMemo } from 'react';
import { Vendor } from '@/lib/vendors';
import { RelationshipStage, RELATIONSHIP_STAGE_CONFIG } from '@/lib/savedSuppliers';
import { KanbanColumn } from './KanbanColumn';
import { StageTransitionModal } from '@/components/suppliers';

interface PipelineKanbanProps {
  vendors: Vendor[];
  onVendorClick: (vendor: Vendor) => void;
  onStageTransition: (vendorId: string, newStage: RelationshipStage, reason?: string) => void;
}

// Pipeline stages in order
const PIPELINE_STAGES: RelationshipStage[] = [
  'contacted',
  'negotiating',
  'deal_active',
  'deal_completed',
  'on_hold',
  'blocked'
];

export function PipelineKanban({
  vendors,
  onVendorClick,
  onStageTransition
}: PipelineKanbanProps) {
  const [draggingVendorId, setDraggingVendorId] = useState<string | null>(null);
  const [pendingTransition, setPendingTransition] = useState<{
    vendor: Vendor;
    fromStage: RelationshipStage;
    toStage: RelationshipStage;
  } | null>(null);

  // Group vendors by stage
  const vendorsByStage = useMemo(() => {
    const grouped: Record<RelationshipStage, Vendor[]> = {
      contacted: [],
      negotiating: [],
      deal_active: [],
      deal_completed: [],
      on_hold: [],
      blocked: []
    };

    vendors.forEach(vendor => {
      if (grouped[vendor.relationshipStage]) {
        grouped[vendor.relationshipStage].push(vendor);
      }
    });

    return grouped;
  }, [vendors]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, vendor: Vendor) => {
    setDraggingVendorId(vendor.id);
  };

  const handleDragEnd = () => {
    setDraggingVendorId(null);
  };

  const handleDrop = (vendorId: string, fromStage: RelationshipStage, toStage: RelationshipStage) => {
    // Find the vendor
    const vendor = vendors.find(v => v.id === vendorId);
    if (!vendor || fromStage === toStage) return;

    // Show transition modal for confirmation
    setPendingTransition({
      vendor,
      fromStage,
      toStage
    });
  };

  const handleConfirmTransition = (vendorId: string, newStage: RelationshipStage, reason?: string) => {
    onStageTransition(vendorId, newStage, reason);
    setPendingTransition(null);
  };

  const handleCancelTransition = () => {
    setPendingTransition(null);
  };

  return (
    <div className="pipeline-kanban">
      {/* Kanban Board */}
      <div className="kanban-board">
        {PIPELINE_STAGES.map(stage => (
          <KanbanColumn
            key={stage}
            stage={stage}
            vendors={vendorsByStage[stage]}
            onCardClick={onVendorClick}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            draggingVendorId={draggingVendorId}
          />
        ))}
      </div>

      {/* Stage Transition Modal */}
      {pendingTransition && (
        <StageTransitionModal
          isOpen={true}
          onClose={handleCancelTransition}
          supplier={pendingTransition.vendor}
          onTransition={handleConfirmTransition}
          preselectedStage={pendingTransition.toStage}
        />
      )}

      <style jsx>{`
        .pipeline-kanban {
          width: 100%;
          overflow: hidden;
        }

        .kanban-board {
          display: flex;
          gap: 16px;
          padding: 4px;
          overflow-x: auto;
          overflow-y: hidden;
          min-height: calc(100vh - 340px);
        }

        /* Custom scrollbar for horizontal scroll */
        .kanban-board::-webkit-scrollbar {
          height: 8px;
        }

        .kanban-board::-webkit-scrollbar-track {
          background: var(--bg-tertiary);
          border-radius: 4px;
        }

        .kanban-board::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 4px;
        }

        .kanban-board::-webkit-scrollbar-thumb:hover {
          background: var(--text-muted);
        }

        /* Responsive adjustments */
        @media (max-width: 1200px) {
          .kanban-board {
            padding-bottom: 16px;
          }
        }

        @media (max-width: 768px) {
          .kanban-board {
            min-height: auto;
          }
        }
      `}</style>
    </div>
  );
}

export default PipelineKanban;
