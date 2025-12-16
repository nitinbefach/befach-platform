'use client';

import { useState, useMemo } from 'react';
import {
  VendorDocument,
  DOCUMENT_TYPE_CONFIG,
  isDocumentExpiringSoon,
  isDocumentExpired,
  getDocumentStats
} from '@/lib/vendors';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui';

interface DocumentManagerProps {
  documents: VendorDocument[];
  onAdd?: (document: Omit<VendorDocument, 'id' | 'uploadedAt'>) => void;
  onUpdate?: (documentId: string, updates: Partial<VendorDocument>) => void;
  onRemove?: (documentId: string) => void;
  readOnly?: boolean;
}

type DocumentFilter = VendorDocument['type'] | 'all' | 'expiring';

export function DocumentManager({
  documents,
  onAdd,
  onUpdate,
  onRemove,
  readOnly = false
}: DocumentManagerProps) {
  const [filter, setFilter] = useState<DocumentFilter>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<VendorDocument | null>(null);
  const [newDoc, setNewDoc] = useState({
    type: 'other' as VendorDocument['type'],
    name: '',
    description: '',
    externalLink: '',
    expiryDate: '',
    tags: ''
  });

  // Document stats
  const stats = useMemo(() => getDocumentStats(documents), [documents]);

  // Filter documents
  const filteredDocuments = useMemo(() => {
    if (filter === 'all') return documents;
    if (filter === 'expiring') return documents.filter(d => isDocumentExpiringSoon(d));
    return documents.filter(d => d.type === filter);
  }, [documents, filter]);

  // Sort by uploaded date (newest first)
  const sortedDocuments = useMemo(() =>
    [...filteredDocuments].sort((a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    ),
    [filteredDocuments]
  );

  const handleAddDocument = () => {
    if (!newDoc.name.trim() || !onAdd) return;

    onAdd({
      type: newDoc.type,
      name: newDoc.name.trim(),
      description: newDoc.description.trim() || undefined,
      externalLink: newDoc.externalLink.trim() || undefined,
      expiryDate: newDoc.expiryDate || undefined,
      status: 'active',
      tags: newDoc.tags.split(',').map(t => t.trim()).filter(Boolean)
    });

    setIsAddModalOpen(false);
    setNewDoc({
      type: 'other',
      name: '',
      description: '',
      externalLink: '',
      expiryDate: '',
      tags: ''
    });
  };

  const getStatusBadge = (doc: VendorDocument) => {
    if (isDocumentExpired(doc)) {
      return <span className="status-badge expired">Expired</span>;
    }
    if (isDocumentExpiringSoon(doc)) {
      return <span className="status-badge expiring">Expiring Soon</span>;
    }
    if (doc.status === 'pending') {
      return <span className="status-badge pending">Pending</span>;
    }
    return <span className="status-badge active">Active</span>;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="document-manager">
      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat">
          <span className="stat-value active">{stats.active}</span>
          <span className="stat-label">Active</span>
        </div>
        <div className="stat">
          <span className="stat-value warning">{stats.expiringSoon}</span>
          <span className="stat-label">Expiring</span>
        </div>
        <div className="stat">
          <span className="stat-value danger">{stats.expired}</span>
          <span className="stat-label">Expired</span>
        </div>
      </div>

      {/* Header */}
      <div className="manager-header">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          {stats.expiringSoon > 0 && (
            <button
              className={`filter-tab warning ${filter === 'expiring' ? 'active' : ''}`}
              onClick={() => setFilter('expiring')}
            >
              <AlertTriangle size={12} /> Expiring ({stats.expiringSoon})
            </button>
          )}
          {Object.keys(DOCUMENT_TYPE_CONFIG).map(type => {
            const count = documents.filter(d => d.type === type).length;
            if (count === 0) return null;
            const config = DOCUMENT_TYPE_CONFIG[type as VendorDocument['type']];
            const IconComponent = config.icon;
            return (
              <button
                key={type}
                className={`filter-tab ${filter === type ? 'active' : ''}`}
                onClick={() => setFilter(type as VendorDocument['type'])}
              >
                <IconComponent size={12} /> {config.label} ({count})
              </button>
            );
          })}
        </div>

        {!readOnly && onAdd && (
          <button className="add-doc-btn" onClick={() => setIsAddModalOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Document
          </button>
        )}
      </div>

      {/* Documents List */}
      {sortedDocuments.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <p>No documents found</p>
          {!readOnly && onAdd && (
            <button onClick={() => setIsAddModalOpen(true)}>Add your first document</button>
          )}
        </div>
      ) : (
        <div className="documents-list">
          {sortedDocuments.map(doc => {
            const config = DOCUMENT_TYPE_CONFIG[doc.type];
            const IconComponent = config.icon;
            const isExpired = isDocumentExpired(doc);
            const isExpiring = isDocumentExpiringSoon(doc);

            return (
              <div
                key={doc.id}
                className={`document-item ${isExpired ? 'expired' : ''} ${isExpiring ? 'expiring' : ''}`}
              >
                <div className="doc-icon" style={{ background: `${config.color}15`, color: config.color }}>
                  <IconComponent size={20} />
                </div>

                <div className="doc-content">
                  <div className="doc-header">
                    <h4 className="doc-name">{doc.name}</h4>
                    {getStatusBadge(doc)}
                  </div>

                  {doc.description && (
                    <p className="doc-description">{doc.description}</p>
                  )}

                  <div className="doc-meta">
                    <span className="doc-type">{config.label}</span>
                    <span className="dot">•</span>
                    <span className="doc-date">Added {formatDate(doc.uploadedAt)}</span>
                    {doc.expiryDate && (
                      <>
                        <span className="dot">•</span>
                        <span className={`doc-expiry ${isExpired ? 'expired' : ''} ${isExpiring ? 'warning' : ''}`}>
                          {isExpired ? 'Expired' : 'Expires'} {formatDate(doc.expiryDate)}
                        </span>
                      </>
                    )}
                  </div>

                  {doc.tags.length > 0 && (
                    <div className="doc-tags">
                      {doc.tags.map(tag => (
                        <span key={tag} className="doc-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="doc-actions">
                  {doc.externalLink && (
                    <a
                      href={doc.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-btn view"
                      title="View document"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  )}
                  {!readOnly && onRemove && (
                    <button
                      className="action-btn delete"
                      onClick={() => onRemove(doc.id)}
                      title="Remove document"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Document Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Document">
        <div className="add-doc-form">
          <div className="form-group">
            <label>Document Type</label>
            <select
              value={newDoc.type}
              onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value as VendorDocument['type'] })}
            >
              {Object.entries(DOCUMENT_TYPE_CONFIG).map(([type, config]) => (
                <option key={type} value={type}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Document Name *</label>
            <input
              type="text"
              placeholder="e.g., Supply Agreement 2024"
              value={newDoc.name}
              onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Brief description of this document..."
              rows={2}
              value={newDoc.description}
              onChange={(e) => setNewDoc({ ...newDoc, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>External Link</label>
            <input
              type="url"
              placeholder="https://..."
              value={newDoc.externalLink}
              onChange={(e) => setNewDoc({ ...newDoc, externalLink: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Expiry Date</label>
            <input
              type="date"
              value={newDoc.expiryDate}
              onChange={(e) => setNewDoc({ ...newDoc, expiryDate: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input
              type="text"
              placeholder="contract, active, 2024"
              value={newDoc.tags}
              onChange={(e) => setNewDoc({ ...newDoc, tags: e.target.value })}
            />
          </div>

          <div className="modal-actions">
            <button className="btn-cancel" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
            <button
              className="btn-submit"
              onClick={handleAddDocument}
              disabled={!newDoc.name.trim()}
            >
              Add Document
            </button>
          </div>
        </div>
      </Modal>

      <style jsx>{`
        .document-manager {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          overflow: hidden;
        }

        .stats-bar {
          display: flex;
          gap: 20px;
          padding: 16px 20px;
          background: var(--bg-tertiary);
          border-bottom: 1px solid var(--border-color);
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-value {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-value.active {
          color: #10B981;
        }

        .stat-value.warning {
          color: #F59E0B;
        }

        .stat-value.danger {
          color: #EF4444;
        }

        .stat-label {
          font-size: 11px;
          color: var(--text-secondary);
        }

        .manager-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-color);
        }

        .filter-tabs {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }

        .filter-tab {
          padding: 6px 10px;
          background: transparent;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .filter-tab:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .filter-tab.active {
          background: var(--bg-tertiary);
          color: var(--text-primary);
          font-weight: 500;
        }

        .filter-tab.warning {
          color: #F59E0B;
        }

        .add-doc-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: var(--accent-primary);
          border: none;
          border-radius: 6px;
          color: white;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
        }

        .empty-state {
          padding: 40px;
          text-align: center;
          color: var(--text-secondary);
        }

        .empty-state svg {
          opacity: 0.5;
          margin-bottom: 12px;
        }

        .empty-state p {
          margin: 0 0 16px 0;
        }

        .empty-state button {
          padding: 8px 16px;
          background: var(--accent-primary);
          border: none;
          border-radius: 6px;
          color: white;
          cursor: pointer;
        }

        .documents-list {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .document-item {
          display: flex;
          gap: 14px;
          padding: 14px;
          background: var(--bg-tertiary);
          border-radius: 10px;
          border: 1px solid transparent;
          transition: all 0.2s;
        }

        .document-item:hover {
          border-color: var(--border-color);
        }

        .document-item.expiring {
          border-color: rgba(245, 158, 11, 0.3);
        }

        .document-item.expired {
          border-color: rgba(239, 68, 68, 0.3);
          opacity: 0.7;
        }

        .doc-icon {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .doc-content {
          flex: 1;
          min-width: 0;
        }

        .doc-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 4px;
        }

        .doc-name {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
          margin: 0;
        }

        .status-badge {
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 500;
        }

        .status-badge.active {
          background: rgba(16, 185, 129, 0.15);
          color: #10B981;
        }

        .status-badge.pending {
          background: rgba(59, 130, 246, 0.15);
          color: #3B82F6;
        }

        .status-badge.expiring {
          background: rgba(245, 158, 11, 0.15);
          color: #F59E0B;
        }

        .status-badge.expired {
          background: rgba(239, 68, 68, 0.15);
          color: #EF4444;
        }

        .doc-description {
          font-size: 13px;
          color: var(--text-secondary);
          margin: 0 0 6px 0;
          line-height: 1.4;
        }

        .doc-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--text-muted);
        }

        .dot {
          opacity: 0.5;
        }

        .doc-expiry.expired {
          color: #EF4444;
        }

        .doc-expiry.warning {
          color: #F59E0B;
        }

        .doc-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-top: 8px;
        }

        .doc-tag {
          padding: 2px 8px;
          background: var(--bg-secondary);
          border-radius: 4px;
          font-size: 11px;
          color: var(--text-secondary);
        }

        .doc-actions {
          display: flex;
          gap: 6px;
          flex-shrink: 0;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: none;
          background: var(--bg-secondary);
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-btn svg {
          width: 16px;
          height: 16px;
        }

        .action-btn:hover {
          background: var(--bg-primary);
        }

        .action-btn.delete:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
        }

        /* Modal Form Styles */
        .add-doc-form {
          padding: 4px 0;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          margin-bottom: 6px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 14px;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--accent-primary);
        }

        .modal-actions {
          display: flex;
          gap: 10px;
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
          margin-top: 20px;
        }

        .btn-cancel {
          flex: 1;
          padding: 10px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .btn-submit {
          flex: 1;
          padding: 10px;
          background: var(--accent-primary);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

export default DocumentManager;
