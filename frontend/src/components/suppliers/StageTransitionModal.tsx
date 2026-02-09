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
  const [hoveredStage, setHoveredStage] = useState<RelationshipStage | null>(null);

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
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Current Stage */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <label style={{
            fontSize: '0.9rem',
            fontWeight: 500,
            color: 'var(--text-secondary)'
          }}>Current Stage</label>
          <RelationshipStageBadge stage={supplier.relationshipStage} size="lg" />
        </div>

        {/* Available Transitions */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <label style={{
            fontSize: '0.9rem',
            fontWeight: 500,
            color: 'var(--text-secondary)'
          }}>Move to</label>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            {availableTransitions.map(stage => {
              const config = RELATIONSHIP_STAGE_CONFIG[stage];
              const isSelected = selectedStage === stage;
              const isHovered = hoveredStage === stage;
              const Icon = config.icon;

              return (
                <button
                  key={stage}
                  type="button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 16px',
                    background: isSelected
                      ? config.bgColor
                      : (isHovered ? config.bgColor : 'var(--bg-tertiary)'),
                    border: `2px solid ${
                      isSelected ? config.color : (isHovered ? config.color : 'var(--border-color)')
                    }`,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'left',
                    boxShadow: isSelected ? `0 0 0 2px ${config.color}30` : 'none'
                  }}
                  onClick={() => setSelectedStage(stage)}
                  onMouseEnter={() => setHoveredStage(stage)}
                  onMouseLeave={() => setHoveredStage(null)}
                >
                  <span style={{ fontSize: '1.5rem' }}><Icon size={20} /></span>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}>
                    <span style={{
                      fontWeight: 600,
                      color: 'var(--text-primary)'
                    }}>{config.label}</span>
                    <span style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)'
                    }}>{config.description}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reason (optional) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <label style={{
            fontSize: '0.9rem',
            fontWeight: 500,
            color: 'var(--text-secondary)'
          }}>Reason (optional)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Add a note about this change..."
            rows={2}
            style={{
              padding: '12px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              resize: 'none',
              fontSize: '0.9rem',
              outline: 'none',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#f97316';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
          />
        </div>

        {/* Schedule Follow-up */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '12px',
          background: 'var(--bg-tertiary)',
          borderRadius: '8px'
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            color: 'var(--text-primary)'
          }}>
            <input
              type="checkbox"
              checked={scheduleFollowUp}
              onChange={(e) => setScheduleFollowUp(e.target.checked)}
              style={{
                width: '18px',
                height: '18px',
                accentColor: '#f97316'
              }}
            />
            <span>Schedule a follow-up</span>
          </label>
          {scheduleFollowUp && (
            <input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              style={{
                marginTop: '10px',
                padding: '10px 12px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                width: '100%'
              }}
            />
          )}
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '12px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-color)'
        }}>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '12px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onClick={handleClose}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-tertiary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-secondary)';
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '12px',
              background: !selectedStage ? '#d3d3d3' : 'linear-gradient(135deg, #f97316, #ea580c)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontWeight: 600,
              cursor: !selectedStage ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: !selectedStage ? 0.5 : 1,
              transform: 'translateY(0)',
              boxShadow: 'none'
            }}
            onClick={handleTransition}
            disabled={!selectedStage}
            onMouseEnter={(e) => {
              if (selectedStage) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(249, 115, 22, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Update Stage
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default StageTransitionModal;