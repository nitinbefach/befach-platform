'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui';
import {
  RelationshipStage,
  RELATIONSHIP_STAGE_CONFIG,
  SavedSupplier,
  getAvailableTransitions
} from '@/lib/savedSuppliers';
import { RelationshipStageBadge } from './RelationshipStageBadge';
import { Calendar } from 'lucide-react';



interface StageTransitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: SavedSupplier | null;
  onTransition: (supplierId: string, newStage: RelationshipStage, reason?: string) => void;
  preselectedStage?: RelationshipStage; // For Kanban drag-drop
}

export function StageTransitionModal({
  isOpen,
  onClose,
  supplier,
  onTransition,
  preselectedStage
}: StageTransitionModalProps) {
  const [selectedStage, setSelectedStage] = useState<RelationshipStage | null>(preselectedStage || null);
  const [reason, setReason] = useState('');
  const [scheduleFollowUp, setScheduleFollowUp] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('');

  // Update selected stage when preselectedStage changes (for Kanban drag-drop)
  useEffect(() => {
    if (preselectedStage) {
      setSelectedStage(preselectedStage);
    }
  }, [preselectedStage]);

  if (!supplier) return null;

  const availableTransitions = getAvailableTransitions(supplier.relationshipStage);

  const handleTransition = () => {
    if (!selectedStage) return;
    onTransition(supplier.id, selectedStage, reason || undefined);
    // Reset state
    setSelectedStage(null);
    setReason('');
    setScheduleFollowUp(false);
    setFollowUpDate('');
    onClose();
  };

  const handleClose = () => {
    setSelectedStage(null);
    setReason('');
    setScheduleFollowUp(false);
    setFollowUpDate('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Change Relationship Stage">
      <div className="transition-modal">
        {/* Current Stage */}
        <div className="current-stage">
          <label>Current Stage</label>
          <RelationshipStageBadge stage={supplier.relationshipStage} size="lg" />
        </div>

        {/* Available Transitions */}
        <div className="new-stage">
          <label>Move to</label>
          <div className="stage-options">
            {availableTransitions.map(stage => {
              const config = RELATIONSHIP_STAGE_CONFIG[stage];
              const isSelected = selectedStage === stage;

              return (
                <button
                  key={stage}
                  type="button"
                  className={`stage-option ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedStage(stage)}
                  style={{
                    '--stage-color': config.color,
                    '--stage-bg': config.bgColor
                  } as React.CSSProperties}
                >
                  <span className="stage-icon">{config.icon}</span>
                  <div className="stage-info">
                    <span className="stage-label">{config.label}</span>
                    <span className="stage-desc">{config.description}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reason (optional) */}
        <div className="reason-section">
          <label>Reason (optional)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Add a note about this change..."
            rows={2}
          />
        </div>

        {/* Schedule Follow-up */}
        <div className="followup-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={scheduleFollowUp}
              onChange={(e) => setScheduleFollowUp(e.target.checked)}
            />
            <span>Schedule a follow-up</span>
          </label>
          {scheduleFollowUp && (
            <input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          )}
        </div>

        {/* Actions */}
        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={handleClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-confirm"
            onClick={handleTransition}
            disabled={!selectedStage}
          >
            Update Stage
          </button>
        </div>
      </div>

      <style jsx>{`
        .transition-modal {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .current-stage,
        .new-stage,
        .reason-section,
        .followup-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .stage-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .stage-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: var(--bg-tertiary);
          border: 2px solid var(--border-color);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .stage-option:hover {
          border-color: var(--stage-color);
          background: var(--stage-bg);
        }

        .stage-option.selected {
          border-color: var(--stage-color);
          background: var(--stage-bg);
          box-shadow: 0 0 0 2px var(--stage-color)30;
        }

        .stage-icon {
          font-size: 1.5rem;
        }

        .stage-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .stage-label {
          font-weight: 600;
          color: var(--text-primary);
        }

        .stage-desc {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .reason-section textarea {
          padding: 12px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-primary);
          resize: none;
          font-size: 0.9rem;
        }

        .reason-section textarea:focus {
          outline: none;
          border-color: #f97316;
        }

        .followup-section {
          padding: 12px;
          background: var(--bg-tertiary);
          border-radius: 8px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          color: var(--text-primary);
        }

        .checkbox-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #f97316;
        }

        .followup-section input[type="date"] {
          margin-top: 10px;
          padding: 10px 12px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-primary);
          width: 100%;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
        }

        .btn-cancel {
          flex: 1;
          padding: 12px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-secondary);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-cancel:hover {
          background: var(--bg-tertiary);
        }

        .btn-confirm {
          flex: 1;
          padding: 12px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-confirm:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-confirm:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
        }
      `}</style>
    </Modal>
  );
}

export default StageTransitionModal;
