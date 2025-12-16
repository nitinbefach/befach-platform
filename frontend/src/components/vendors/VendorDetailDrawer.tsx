'use client';

import { useState, useEffect } from 'react';
import { Vendor, addDocument, removeDocument, addActivity, transitionVendorStage } from '@/lib/vendors';
import { RelationshipStage, RELATIONSHIP_STAGE_CONFIG, formatCurrency, formatDate, getRelativeTime } from '@/lib/savedSuppliers';
import { HealthScoreBadge } from './HealthScoreBadge';
import { VendorScorecard } from './VendorScorecard';
import { PerformanceChart } from './PerformanceChart';
import { ActivityTimeline } from './ActivityTimeline';
import { DocumentManager } from './DocumentManager';
import { RelationshipStageBadge, StageTransitionModal } from '@/components/suppliers';

interface VendorDetailDrawerProps {
  vendor: Vendor | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedVendor: Vendor) => void;
  defaultTab?: 'overview' | 'performance' | 'documents' | 'activity' | 'notes';
}

type Tab = 'overview' | 'performance' | 'documents' | 'activity' | 'notes';

export function VendorDetailDrawer({
  vendor,
  isOpen,
  onClose,
  onUpdate,
  defaultTab = 'overview'
}: VendorDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab);
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState('');

  // Reset tab and notes when vendor changes
  useEffect(() => {
    if (vendor) {
      setActiveTab(defaultTab);
      setNotesValue(vendor.notes || '');
      setEditingNotes(false);
    }
  }, [vendor?.id, defaultTab]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!vendor) return null;

  const stageConfig = RELATIONSHIP_STAGE_CONFIG[vendor.relationshipStage];

  const handleStageTransition = (vendorId: string, newStage: RelationshipStage, reason?: string) => {
    try {
      const updated = transitionVendorStage(vendorId, newStage, reason);
      onUpdate(updated);
      setIsStageModalOpen(false);
    } catch (error) {
      console.error('Failed to transition stage:', error);
    }
  };

  const handleAddDocument = (doc: Parameters<typeof addDocument>[1]) => {
    const newDoc = addDocument(vendor.id, doc);
    // Refresh vendor data
    const { getVendor } = require('@/lib/vendors');
    const updated = getVendor(vendor.id);
    if (updated) onUpdate(updated);
  };

  const handleRemoveDocument = (docId: string) => {
    removeDocument(vendor.id, docId);
    const { getVendor } = require('@/lib/vendors');
    const updated = getVendor(vendor.id);
    if (updated) onUpdate(updated);
  };

  const handleAddNote = (note: string) => {
    addActivity(vendor.id, {
      type: 'note',
      title: 'Note added',
      description: note
    });
    const { getVendor } = require('@/lib/vendors');
    const updated = getVendor(vendor.id);
    if (updated) onUpdate(updated);
  };

  const handleSaveNotes = () => {
    const { updateVendor } = require('@/lib/vendors');
    const updated = updateVendor(vendor.id, { notes: notesValue });
    onUpdate(updated);
    setEditingNotes(false);
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'performance', label: 'Performance', icon: '📊' },
    { id: 'documents', label: 'Documents', icon: '📄' },
    { id: 'activity', label: 'Activity', icon: '🕐' },
    { id: 'notes', label: 'Notes', icon: '📝' }
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`drawer-backdrop ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`vendor-drawer ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="drawer-header">
          <div className="header-content">
            <button className="close-btn" onClick={onClose}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="vendor-info">
              <div className="vendor-name-row">
                <h2>{vendor.name}</h2>
                {vendor.verified && <span className="verified">✓ Verified</span>}
              </div>
              <div className="vendor-meta">
                <span className="location">{vendor.countryFlag} {vendor.location}</span>
                <span className="dot">•</span>
                <span className="category">{vendor.category}</span>
              </div>
            </div>

            <div className="header-actions">
              <HealthScoreBadge
                score={vendor.healthScore}
                breakdown={vendor.healthScoreBreakdown}
                size="lg"
                showGrade
              />
            </div>
          </div>

          {/* Stage & Quick Stats */}
          <div className="header-stats">
            <div className="stage-section" onClick={() => setIsStageModalOpen(true)}>
              <RelationshipStageBadge
                stage={vendor.relationshipStage}
                size="md"
                clickable
              />
              <span className="stage-date">Since {formatDate(vendor.stageChangedAt)}</span>
            </div>

            <div className="quick-stats">
              <div className="stat">
                <span className="stat-value">{vendor.totalOrders}</span>
                <span className="stat-label">Orders</span>
              </div>
              <div className="stat">
                <span className="stat-value">{formatCurrency(vendor.totalOrderValue)}</span>
                <span className="stat-label">Total Value</span>
              </div>
              <div className="stat">
                <span className="stat-value">{vendor.activeDeals}</span>
                <span className="stat-label">Active Deals</span>
              </div>
              <div className="stat">
                <span className="stat-value">{getRelativeTime(vendor.lastContactedDate)}</span>
                <span className="stat-label">Last Contact</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="drawer-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="drawer-content">
          {activeTab === 'overview' && (
            <div className="tab-overview">
              {/* Contact Info */}
              <div className="section">
                <h3>📧 Contact Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Contact Person</span>
                    <span className="info-value">{vendor.contactPerson || '—'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email</span>
                    <span className="info-value">
                      {vendor.email ? (
                        <a href={`mailto:${vendor.email}`}>{vendor.email}</a>
                      ) : '—'}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phone</span>
                    <span className="info-value">{vendor.phone || '—'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Website</span>
                    <span className="info-value">
                      {vendor.website ? (
                        <a href={`https://${vendor.website}`} target="_blank" rel="noopener noreferrer">
                          {vendor.website}
                        </a>
                      ) : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Specialization */}
              <div className="section">
                <h3>🏭 Specialization</h3>
                <p className="specialization">{vendor.specialization}</p>
              </div>

              {/* Tags */}
              <div className="section">
                <h3>🏷️ Tags</h3>
                <div className="tags-list">
                  {vendor.tags.length > 0 ? (
                    vendor.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))
                  ) : (
                    <span className="no-data">No tags</span>
                  )}
                </div>
              </div>

              {/* Health Score (Compact) */}
              <div className="section">
                <h3>💪 Health Score</h3>
                <VendorScorecard vendor={vendor} compact showPeriodSelector={false} />
              </div>

              {/* Recent Activity */}
              <div className="section">
                <h3>🕐 Recent Activity</h3>
                <ActivityTimeline
                  activities={vendor.activities}
                  limit={3}
                  showFilters={false}
                  showAddNote={false}
                />
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="tab-performance">
              <VendorScorecard vendor={vendor} />
              <div className="chart-section">
                <h3>📈 Performance Trends</h3>
                <PerformanceChart performanceHistory={vendor.performanceHistory} height={250} />
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="tab-documents">
              <DocumentManager
                documents={vendor.documents}
                onAdd={handleAddDocument}
                onRemove={handleRemoveDocument}
              />
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="tab-activity">
              <ActivityTimeline
                activities={vendor.activities}
                showAddNote
                onAddNote={handleAddNote}
              />
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="tab-notes">
              <div className="notes-section">
                <div className="notes-header">
                  <h3>📝 Vendor Notes</h3>
                  {!editingNotes ? (
                    <button className="edit-btn" onClick={() => setEditingNotes(true)}>
                      Edit
                    </button>
                  ) : (
                    <div className="edit-actions">
                      <button className="cancel-btn" onClick={() => {
                        setEditingNotes(false);
                        setNotesValue(vendor.notes || '');
                      }}>
                        Cancel
                      </button>
                      <button className="save-btn" onClick={handleSaveNotes}>
                        Save
                      </button>
                    </div>
                  )}
                </div>

                {editingNotes ? (
                  <textarea
                    className="notes-editor"
                    value={notesValue}
                    onChange={(e) => setNotesValue(e.target.value)}
                    placeholder="Add notes about this vendor..."
                    rows={10}
                    autoFocus
                  />
                ) : (
                  <div className="notes-content">
                    {vendor.notes || (
                      <span className="no-data">No notes yet. Click "Edit" to add some.</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stage Transition Modal */}
      <StageTransitionModal
        isOpen={isStageModalOpen}
        onClose={() => setIsStageModalOpen(false)}
        supplier={vendor}
        onTransition={handleStageTransition}
      />

      <style jsx>{`
        .drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          z-index: 999;
        }

        .drawer-backdrop.visible {
          opacity: 1;
          visibility: visible;
        }

        .vendor-drawer {
          position: fixed;
          top: 0;
          right: 0;
          width: 600px;
          max-width: 100%;
          height: 100vh;
          background: var(--bg-primary);
          box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
          transform: translateX(100%);
          transition: transform 0.3s ease;
          z-index: 1000;
          display: flex;
          flex-direction: column;
        }

        .vendor-drawer.open {
          transform: translateX(0);
        }

        .drawer-header {
          padding: 20px;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
        }

        .header-content {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .close-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .close-btn svg {
          width: 18px;
          height: 18px;
        }

        .close-btn:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .vendor-info {
          flex: 1;
        }

        .vendor-name-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .vendor-name-row h2 {
          font-size: 20px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .verified {
          padding: 4px 8px;
          background: rgba(16, 185, 129, 0.15);
          color: #10B981;
          font-size: 11px;
          font-weight: 500;
          border-radius: 4px;
        }

        .vendor-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 4px;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .dot {
          opacity: 0.5;
        }

        .header-stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
        }

        .stage-section {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .stage-date {
          font-size: 12px;
          color: var(--text-muted);
        }

        .quick-stats {
          display: flex;
          gap: 24px;
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .stat-label {
          font-size: 11px;
          color: var(--text-muted);
        }

        .drawer-tabs {
          display: flex;
          gap: 4px;
          padding: 12px 20px;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: transparent;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab-btn:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .tab-btn.active {
          background: var(--bg-primary);
          color: var(--text-primary);
          font-weight: 500;
        }

        .tab-icon {
          font-size: 14px;
        }

        .drawer-content {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .section {
          margin-bottom: 24px;
        }

        .section h3 {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 12px 0;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-label {
          font-size: 12px;
          color: var(--text-muted);
        }

        .info-value {
          font-size: 14px;
          color: var(--text-primary);
        }

        .info-value a {
          color: var(--accent-primary);
        }

        .specialization {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.5;
        }

        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tag {
          padding: 6px 12px;
          background: rgba(249, 115, 22, 0.1);
          color: #F97316;
          font-size: 12px;
          border-radius: 16px;
        }

        .no-data {
          color: var(--text-muted);
          font-style: italic;
          font-size: 13px;
        }

        .chart-section {
          margin-top: 24px;
        }

        .chart-section h3 {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 12px 0;
        }

        .notes-section {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 16px;
        }

        .notes-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .notes-header h3 {
          margin: 0;
        }

        .edit-btn {
          padding: 6px 14px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          font-size: 13px;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .edit-actions {
          display: flex;
          gap: 8px;
        }

        .cancel-btn, .save-btn {
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
        }

        .cancel-btn {
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
        }

        .save-btn {
          background: var(--accent-primary);
          border: none;
          color: white;
        }

        .notes-editor {
          width: 100%;
          padding: 12px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 14px;
          line-height: 1.6;
          resize: vertical;
        }

        .notes-editor:focus {
          outline: none;
          border-color: var(--accent-primary);
        }

        .notes-content {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
          white-space: pre-wrap;
        }

        @media (max-width: 640px) {
          .vendor-drawer {
            width: 100%;
          }

          .quick-stats {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}

export default VendorDetailDrawer;
