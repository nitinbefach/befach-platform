'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { ClipboardList } from 'lucide-react';
import RequirementCard from '@/components/requirements/RequirementCard';
import RequirementStats from '@/components/requirements/RequirementStats';
import RequirementFilters from '@/components/requirements/RequirementFilters';
import StatusBadge from '@/components/requirements/StatusBadge';
import EstimatedTime from '@/components/requirements/EstimatedTime';
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal';
import {
  Requirement,
  RequirementStatus,
  getStoredRequirements,
  saveRequirements,
  getRequirementStats,
  processDemoTransition,
  transitionStatus,
  formatDate,
  formatRelativeTime,
  STATUS_CONFIG,
} from '@/lib/requirements';
import { addToRecycleBin } from '@/lib/recycle-bin';
import { captureFeatureAction } from '@/lib/posthogEvents';

export default function MyRequirementsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const highlightId = searchParams.get('highlight');

  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [activeStatus, setActiveStatus] = useState<RequirementStatus | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null);
  const [isDevMode, setIsDevMode] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Requirement | null>(null);

  // Load requirements from localStorage
  useEffect(() => {
    const stored = getStoredRequirements();
    setRequirements(stored);

    // Check for dev mode
    const devParam = searchParams.get('dev');
    setIsDevMode(devParam === 'true');

    const timer = setTimeout(() => captureFeatureAction('requirements', 'reviewed'), 20000);
    return () => clearTimeout(timer);
  }, [searchParams]);

  // Demo mode: auto-progress status
  useEffect(() => {
    const interval = setInterval(() => {
      setRequirements((prev) => {
        let hasUpdates = false;
        const updated = prev.map((req) => {
          const transitioned = processDemoTransition(req);
          if (transitioned) {
            hasUpdates = true;
            return transitioned;
          }
          return req;
        });

        if (hasUpdates) {
          saveRequirements(updated);
        }
        return hasUpdates ? updated : prev;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Filter requirements
  const filteredRequirements = requirements.filter((req) => {
    // Status filter
    if (activeStatus && req.status !== activeStatus) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = req.title.toLowerCase().includes(query);
      const matchesProduct = req.products.some((p) =>
        p.name.toLowerCase().includes(query)
      );
      const matchesId = req.id.toLowerCase().includes(query);
      if (!matchesTitle && !matchesProduct && !matchesId) return false;
    }

    return true;
  });

  // Get stats
  const stats = getRequirementStats(requirements);

  // Handlers
  const handleNewRequirement = () => {
    router.push('/submit-requirement');
  };

  const handleViewDetails = (req: Requirement) => {
    setSelectedRequirement(req);
  };

  const handleCancelRequirement = (id: string) => {
    const reqToDelete = requirements.find(r => r.id === id);
    if (reqToDelete) {
      setDeleteTarget(reqToDelete);
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    // Add to recycle bin before removing
    const products = deleteTarget.products || [];
    const primaryProduct = products[0];
    addToRecycleBin(
      'requirement',
      deleteTarget.id,
      deleteTarget.title,
      deleteTarget, // Store full requirement data for restoration
      primaryProduct ? `${primaryProduct.name} - ${primaryProduct.quantity} ${primaryProduct.unit}` : undefined
    );

    // Remove from requirements list
    setRequirements((prev) => {
      const updated = prev.filter((req) => req.id !== deleteTarget.id);
      saveRequirements(updated);
      return updated;
    });

    setDeleteTarget(null);
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  const handleCloseModal = () => {
    setSelectedRequirement(null);
  };

  // Dev mode: force status transition
  const handleDevTransition = (id: string, newStatus: RequirementStatus) => {
    setRequirements((prev) => {
      const updated = prev.map((req) =>
        req.id === id ? transitionStatus(req, newStatus) : req
      );
      saveRequirements(updated);
      return updated;
    });
  };

  return (
    <AppLayout>
      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1>My Requirements</h1>
            <p>Track and manage all your sourcing requirements</p>
          </div>
          {isDevMode && (
            <span className="dev-badge">DEV MODE</span>
          )}
        </div>

        {/* Stats */}
        <RequirementStats
          stats={stats}
          onFilterClick={setActiveStatus}
          activeFilter={activeStatus}
        />

        {/* Filters */}
        <RequirementFilters
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNewRequirement={handleNewRequirement}
        />

        {/* Requirements List */}
        <div className="requirements-list">
          {filteredRequirements.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><ClipboardList size={48} /></div>
              <h3>No Requirements Found</h3>
              {requirements.length === 0 ? (
                <>
                  <p>Start sourcing products from verified suppliers around the world.</p>
                  <button className="btn-primary" onClick={handleNewRequirement}>
                    + Submit Your First Requirement
                  </button>
                </>
              ) : (
                <p>Try adjusting your filters or search query.</p>
              )}
            </div>
          ) : (
            filteredRequirements.map((req) => (
              <div key={req.id}>
                <RequirementCard
                  requirement={req}
                  onViewDetails={() => handleViewDetails(req)}
                  onCancel={() => handleCancelRequirement(req.id)}
                  isNew={req.id === highlightId}
                />
                {/* Dev Mode Controls */}
                {isDevMode && (
                  <div className="dev-controls">
                    <span>DEV:</span>
                    {req.status === 'matching' && (
                      <button onClick={() => handleDevTransition(req.id, 'quoted')}>
                        → Quoted
                      </button>
                    )}
                    {req.status === 'quoted' && (
                      <button onClick={() => handleDevTransition(req.id, 'negotiating')}>
                        → Negotiating
                      </button>
                    )}
                    {req.status === 'negotiating' && (
                      <button onClick={() => handleDevTransition(req.id, 'completed')}>
                        → Completed
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Detail Modal */}
        {selectedRequirement && (
          <RequirementDetailModal
            requirement={selectedRequirement}
            onClose={handleCloseModal}
          />
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={deleteTarget !== null}
          title="Cancel Requirement"
          itemName={deleteTarget?.title || ''}
          itemType="requirement"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </div>

      <style jsx>{`
        .page-container {
          max-width: 1200px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .page-header h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 4px;
        }

        .page-header p {
          color: var(--text-secondary);
          margin: 0;
        }

        .dev-badge {
          background: #ef4444;
          color: white;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .requirements-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: var(--card-bg);
          border-radius: 12px;
          border: 1px dashed var(--border-color);
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          color: var(--text-primary);
          margin: 0 0 8px;
        }

        .empty-state p {
          color: var(--text-secondary);
          margin: 0 0 20px;
        }

        .btn-primary {
          padding: 12px 24px;
          background: var(--accent-gradient);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
        }

        .dev-controls {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px dashed #ef4444;
          border-radius: 0 0 8px 8px;
          margin-top: -4px;
        }

        .dev-controls span {
          color: #ef4444;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .dev-controls button {
          padding: 4px 10px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 0.75rem;
          cursor: pointer;
        }

        .dev-controls button:hover {
          background: #dc2626;
        }
      `}</style>
    </AppLayout>
  );
}

// ============================================
// REQUIREMENT DETAIL MODAL
// ============================================

interface RequirementDetailModalProps {
  requirement: Requirement;
  onClose: () => void;
}

function RequirementDetailModal({ requirement, onClose }: RequirementDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'matches' | 'timeline'>('overview');

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <div className="header-left">
            <h2>{requirement.title}</h2>
            <div className="header-meta">
              <span className="req-id">{requirement.id}</span>
              <span className="separator">|</span>
              <span>Created: {formatDate(requirement.submittedAt)}</span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="modal-tabs">
          <button
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab ${activeTab === 'matches' ? 'active' : ''}`}
            onClick={() => setActiveTab('matches')}
          >
            Supplier Matches ({requirement.matchCount})
          </button>
          <button
            className={`tab ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            Timeline
          </button>
        </div>

        {/* Content */}
        <div className="modal-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              {/* Status Progress */}
              <div className="section">
                <h4>Status Progress</h4>
                <StatusProgressBar status={requirement.status} />
                <div className="status-info">
                  <StatusBadge status={requirement.status} showDescription />
                  <EstimatedTime estimatedTime={requirement.estimatedTime} showBasis />
                </div>
              </div>

              {/* Requirement Details */}
              <div className="section">
                <h4>Requirement Details</h4>
                <div className="details-grid">
                  {requirement.products.map((product) => (
                    <div key={product.id} className="detail-card">
                      <div className="detail-row">
                        <span className="label">Product</span>
                        <span className="value">{product.name}</span>
                      </div>
                      {product.hsnCode && (
                        <div className="detail-row">
                          <span className="label">HSN Code</span>
                          <span className="value">{product.hsnCode}</span>
                        </div>
                      )}
                      <div className="detail-row">
                        <span className="label">Quantity</span>
                        <span className="value">{product.quantity} {product.unit}</span>
                      </div>
                      {product.targetPrice && (
                        <div className="detail-row">
                          <span className="label">Target Price</span>
                          <span className="value">${product.targetPrice}/{product.unit}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Preferences */}
              {requirement.preferredCountries.length > 0 && (
                <div className="section">
                  <h4>Preferred Countries</h4>
                  <div className="country-chips">
                    {requirement.preferredCountries.map((country) => (
                      <span key={country} className="chip">{country}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'matches' && (
            <div className="matches-tab">
              {requirement.supplierMatches.length === 0 ? (
                <div className="empty-matches">
                  <p>No supplier matches yet. Check back soon!</p>
                </div>
              ) : (
                <div className="matches-list">
                  {requirement.supplierMatches.map((match) => (
                    <div key={match.id} className="match-card">
                      <div className="match-header">
                        <div className="supplier-info">
                          <h5>{match.supplierName}</h5>
                          <span className="country">{match.supplierCountry}</span>
                        </div>
                        <div className="match-score">
                          <span className="score">{match.matchScore}%</span>
                          <span className="label">Match</span>
                        </div>
                      </div>
                      {match.quotedPrice && (
                        <div className="quote-info">
                          <div className="quote-price">
                            <span className="price">${match.quotedPrice.toFixed(2)}</span>
                            <span className="label">per unit</span>
                          </div>
                          {match.leadTime && (
                            <div className="lead-time">
                              <span>{match.leadTime} days</span>
                              <span className="label">Lead time</span>
                            </div>
                          )}
                          {match.moq && (
                            <div className="moq">
                              <span>{match.moq.toLocaleString()}</span>
                              <span className="label">MOQ</span>
                            </div>
                          )}
                        </div>
                      )}
                      {/* Supplier Actions */}
                      <div className="supplier-actions">
                        <button
                          className={`action-btn shortlist ${match.status === 'shortlisted' ? 'active' : ''}`}
                          onClick={() => alert('Shortlist feature - would mark supplier as preferred')}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                          {match.status === 'shortlisted' ? 'Shortlisted' : 'Shortlist'}
                        </button>
                        <button
                          className="action-btn contact"
                          onClick={() => alert('Contact feature - would open chat/email with supplier')}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                          Contact
                        </button>
                        {match.quotedPrice && (
                          <button
                            className="action-btn accept"
                            onClick={() => alert('Accept Quote - would initiate order process')}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Accept Quote
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="timeline-tab">
              {requirement.timeline.map((event, index) => (
                <div key={event.id} className="timeline-item">
                  <div className="timeline-dot" />
                  {index < requirement.timeline.length - 1 && <div className="timeline-line" />}
                  <div className="timeline-content">
                    <span className="timeline-time">{formatRelativeTime(event.timestamp)}</span>
                    <h5>{event.title}</h5>
                    {event.description && <p>{event.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-container {
          background: var(--card-bg);
          border-radius: 16px;
          width: 100%;
          max-width: 700px;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-color);
        }

        .header-left h2 {
          font-size: 1.25rem;
          color: var(--text-primary);
          margin: 0 0 6px;
        }

        .header-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .req-id {
          font-family: monospace;
          color: var(--text-muted);
        }

        .separator {
          color: var(--border-color);
        }

        .close-btn {
          padding: 8px;
          background: none;
          border: none;
          cursor: pointer;
          border-radius: 6px;
          transition: background 0.2s;
        }

        .close-btn:hover {
          background: var(--bg-tertiary);
        }

        .close-btn svg {
          width: 20px;
          height: 20px;
          color: var(--text-secondary);
        }

        .modal-tabs {
          display: flex;
          gap: 4px;
          padding: 0 24px;
          border-bottom: 1px solid var(--border-color);
        }

        .tab {
          padding: 12px 16px;
          background: none;
          border: none;
          color: var(--text-secondary);
          font-weight: 500;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          transition: all 0.2s;
        }

        .tab:hover {
          color: var(--text-primary);
        }

        .tab.active {
          color: var(--accent-primary);
          border-bottom-color: var(--accent-primary);
        }

        .modal-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }

        .section {
          margin-bottom: 24px;
        }

        .section h4 {
          color: var(--text-primary);
          font-size: 0.9rem;
          font-weight: 600;
          margin: 0 0 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-info {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-top: 16px;
        }

        .details-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .detail-card {
          background: var(--bg-secondary);
          padding: 16px;
          border-radius: 8px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
        }

        .detail-row:not(:last-child) {
          border-bottom: 1px solid var(--border-color);
        }

        .detail-row .label {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .detail-row .value {
          color: var(--text-primary);
          font-weight: 500;
        }

        .country-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .chip {
          padding: 6px 12px;
          background: var(--bg-tertiary);
          border-radius: 16px;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .empty-matches {
          text-align: center;
          padding: 40px;
          color: var(--text-secondary);
        }

        .matches-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .match-card {
          background: var(--bg-secondary);
          padding: 16px;
          border-radius: 8px;
        }

        .match-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .supplier-info h5 {
          margin: 0 0 4px;
          color: var(--text-primary);
        }

        .supplier-info .country {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .match-score {
          text-align: right;
        }

        .match-score .score {
          font-size: 1.25rem;
          font-weight: 700;
          color: #8B5CF6;
        }

        .match-score .label {
          display: block;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .quote-info {
          display: flex;
          gap: 24px;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--border-color);
        }

        .quote-info > div {
          display: flex;
          flex-direction: column;
        }

        .quote-info .price {
          font-size: 1.1rem;
          font-weight: 600;
          color: #10B981;
        }

        .quote-info .label {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .supplier-actions {
          display: flex;
          gap: 8px;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--border-color);
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn svg {
          width: 16px;
          height: 16px;
        }

        .action-btn:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }

        .action-btn.shortlist:hover,
        .action-btn.shortlist.active {
          border-color: #F59E0B;
          color: #F59E0B;
          background: rgba(245, 158, 11, 0.1);
        }

        .action-btn.shortlist.active svg {
          fill: #F59E0B;
        }

        .action-btn.contact:hover {
          border-color: #3B82F6;
          color: #3B82F6;
          background: rgba(59, 130, 246, 0.1);
        }

        .action-btn.accept {
          background: #10B981;
          border-color: #10B981;
          color: white;
        }

        .action-btn.accept:hover {
          background: #059669;
          border-color: #059669;
        }

        .timeline-tab {
          position: relative;
        }

        .timeline-item {
          position: relative;
          padding-left: 28px;
          padding-bottom: 20px;
        }

        .timeline-dot {
          position: absolute;
          left: 0;
          top: 4px;
          width: 12px;
          height: 12px;
          background: var(--accent-primary);
          border-radius: 50%;
        }

        .timeline-line {
          position: absolute;
          left: 5px;
          top: 16px;
          bottom: 0;
          width: 2px;
          background: var(--border-color);
        }

        .timeline-content {
          padding-left: 8px;
        }

        .timeline-time {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .timeline-content h5 {
          margin: 4px 0;
          color: var(--text-primary);
        }

        .timeline-content p {
          margin: 0;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}

// ============================================
// STATUS PROGRESS BAR
// ============================================

function StatusProgressBar({ status }: { status: RequirementStatus }) {
  const steps: RequirementStatus[] = ['matching', 'quoted', 'negotiating', 'completed'];
  const currentIndex = steps.indexOf(status);

  return (
    <div className="progress-bar-container">
      {steps.map((step, index) => {
        const config = STATUS_CONFIG[step];
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step} className="step">
            <div
              className={`step-dot ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
              style={{ backgroundColor: isCompleted || isCurrent ? config.color : undefined }}
            />
            <span className={`step-label ${isCurrent ? 'current' : ''}`}>
              {config.label}
            </span>
            {index < steps.length - 1 && (
              <div
                className={`step-line ${isCompleted ? 'completed' : ''}`}
                style={{ backgroundColor: isCompleted ? config.color : undefined }}
              />
            )}
          </div>
        );
      })}

      <style jsx>{`
        .progress-bar-container {
          display: flex;
          align-items: center;
          gap: 0;
          padding: 16px 0;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          flex: 1;
        }

        .step-dot {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }

        .step-dot.current {
          box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.2);
        }

        .step-dot.completed::after,
        .step-dot.current::after {
          content: '';
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
        }

        .step-label {
          margin-top: 8px;
          font-size: 0.75rem;
          color: var(--text-muted);
          text-align: center;
        }

        .step-label.current {
          color: var(--accent-primary);
          font-weight: 600;
        }

        .step-line {
          position: absolute;
          top: 12px;
          left: calc(50% + 12px);
          width: calc(100% - 24px);
          height: 2px;
          background: var(--border-color);
        }
      `}</style>
    </div>
  );
}
