'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal';
import {
  DeletedItem,
  DeletedItemType,
  getRecycleBinItems,
  restoreFromRecycleBin,
  permanentlyDelete,
  emptyRecycleBin,
  formatDeletedTime,
  getDaysUntilExpiry,
  TYPE_LABELS,
} from '@/lib/recycle-bin';
import {
  Requirement,
  addRequirementToStorage,
} from '@/lib/requirements';

export default function RecycleBinPage() {
  const [items, setItems] = useState<DeletedItem[]>([]);
  const [filterType, setFilterType] = useState<DeletedItemType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    item: DeletedItem | null;
    isPermanent: boolean;
  }>({ isOpen: false, item: null, isPermanent: false });
  const [emptyBinModal, setEmptyBinModal] = useState(false);

  // Load items from storage
  useEffect(() => {
    setItems(getRecycleBinItems());
  }, []);

  // Filter items
  const filteredItems = items.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(query) ||
        item.originalId.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Group items by type
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {} as Record<DeletedItemType, DeletedItem[]>);

  // Handle restore
  const handleRestore = (item: DeletedItem) => {
    const restored = restoreFromRecycleBin(item.id);
    if (!restored) return;

    // Restore based on type
    if (restored.type === 'requirement') {
      const requirement = restored.data as Requirement;
      addRequirementToStorage(requirement);
    }
    // Add more type handlers as needed

    setItems(getRecycleBinItems());
  };

  // Handle permanent delete confirmation
  const handleDeleteClick = (item: DeletedItem) => {
    setDeleteModal({ isOpen: true, item, isPermanent: true });
  };

  // Handle permanent delete
  const handlePermanentDelete = () => {
    if (!deleteModal.item) return;
    permanentlyDelete(deleteModal.item.id);
    setItems(getRecycleBinItems());
    setDeleteModal({ isOpen: false, item: null, isPermanent: false });
  };

  // Handle empty bin
  const handleEmptyBin = () => {
    emptyRecycleBin();
    setItems([]);
    setEmptyBinModal(false);
  };

  // Get type counts
  const typeCounts = items.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <AppLayout>
      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1>Recycle Bin</h1>
            <p>Deleted items are stored here for 30 days before permanent deletion</p>
          </div>
          {items.length > 0 && (
            <button
              className="btn-empty"
              onClick={() => setEmptyBinModal(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              Empty Bin
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="stats-bar">
          <div className="stat-item total">
            <span className="stat-count">{items.length}</span>
            <span className="stat-label">Total Items</span>
          </div>
          {Object.entries(TYPE_LABELS).map(([type, config]) => (
            <button
              key={type}
              className={`stat-item ${filterType === type ? 'active' : ''}`}
              onClick={() => setFilterType(filterType === type ? 'all' : type as DeletedItemType)}
            >
              <span className="stat-icon">{config.icon}</span>
              <span className="stat-count">{typeCounts[type] || 0}</span>
              <span className="stat-label">{config.label}s</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="search-bar">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search deleted items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-btn" onClick={() => setSearchQuery('')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🗑️</div>
            <h3>Recycle Bin is Empty</h3>
            <p>Deleted items will appear here. You can restore them within 30 days.</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No Results Found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="items-list">
            {Object.entries(groupedItems).map(([type, typeItems]) => (
              <div key={type} className="type-section">
                <h3 className="section-title">
                  <span>{TYPE_LABELS[type as DeletedItemType].icon}</span>
                  {TYPE_LABELS[type as DeletedItemType].label}s ({typeItems.length})
                </h3>
                <div className="items-grid">
                  {typeItems.map((item) => {
                    const daysLeft = getDaysUntilExpiry(item.expiresAt);
                    return (
                      <div key={item.id} className="deleted-item">
                        <div className="item-header">
                          <span className="item-icon">
                            {TYPE_LABELS[item.type].icon}
                          </span>
                          <div className="item-info">
                            <h4>{item.title}</h4>
                            <span className="item-id">{item.originalId}</span>
                          </div>
                        </div>
                        {item.description && (
                          <p className="item-description">{item.description}</p>
                        )}
                        <div className="item-meta">
                          <span className="deleted-time">
                            Deleted {formatDeletedTime(item.deletedAt)}
                          </span>
                          <span className={`expiry ${daysLeft <= 7 ? 'warning' : ''}`}>
                            {daysLeft <= 0 ? 'Expiring today' : `${daysLeft} days left`}
                          </span>
                        </div>
                        <div className="item-actions">
                          <button
                            className="btn-restore"
                            onClick={() => handleRestore(item)}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                              <path d="M3 3v5h5" />
                            </svg>
                            Restore
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDeleteClick(item)}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          title="Delete Permanently?"
          itemName={deleteModal.item?.title || ''}
          itemType={deleteModal.item ? TYPE_LABELS[deleteModal.item.type].label.toLowerCase() : 'item'}
          onConfirm={handlePermanentDelete}
          onCancel={() => setDeleteModal({ isOpen: false, item: null, isPermanent: false })}
          isPermanent={true}
        />

        {/* Empty Bin Confirmation */}
        {emptyBinModal && (
          <div className="modal-backdrop" onClick={() => setEmptyBinModal(false)}>
            <div className="empty-bin-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-icon danger">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2>Empty Recycle Bin?</h2>
              <p>This will permanently delete all {items.length} items. This action cannot be undone.</p>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setEmptyBinModal(false)}>
                  Cancel
                </button>
                <button className="btn-confirm-delete" onClick={handleEmptyBin}>
                  Delete All Permanently
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .page-container {
          max-width: 1200px;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
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

        .btn-empty {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: transparent;
          border: 1px solid #EF4444;
          color: #EF4444;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-empty svg {
          width: 18px;
          height: 18px;
        }

        .btn-empty:hover {
          background: #EF4444;
          color: white;
        }

        .stats-bar {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .stat-item:hover {
          border-color: var(--accent-primary);
        }

        .stat-item.active {
          border-color: var(--accent-primary);
          background: rgba(249, 115, 22, 0.1);
        }

        .stat-item.total {
          cursor: default;
          background: var(--bg-tertiary);
        }

        .stat-item.total:hover {
          border-color: var(--border-color);
        }

        .stat-icon {
          font-size: 1.1rem;
        }

        .stat-count {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-label {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .search-bar {
          position: relative;
          margin-bottom: 24px;
        }

        .search-bar input {
          width: 100%;
          padding: 12px 16px 12px 44px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          color: var(--text-primary);
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        .search-bar input:focus {
          outline: none;
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          color: var(--text-muted);
        }

        .clear-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          padding: 4px;
          background: none;
          border: none;
          cursor: pointer;
        }

        .clear-btn svg {
          width: 18px;
          height: 18px;
          color: var(--text-muted);
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
          margin: 0;
        }

        .type-section {
          margin-bottom: 32px;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-primary);
          font-size: 1rem;
          margin: 0 0 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border-color);
        }

        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        .deleted-item {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 16px;
          border: 1px solid var(--border-color);
        }

        .item-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 8px;
        }

        .item-icon {
          font-size: 1.5rem;
        }

        .item-info h4 {
          color: var(--text-primary);
          font-size: 0.95rem;
          margin: 0 0 4px;
        }

        .item-id {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-family: monospace;
        }

        .item-description {
          color: var(--text-secondary);
          font-size: 0.85rem;
          margin: 0 0 12px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .item-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-color);
        }

        .deleted-time {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .expiry {
          font-size: 0.8rem;
          color: var(--text-secondary);
          padding: 2px 8px;
          background: var(--bg-tertiary);
          border-radius: 4px;
        }

        .expiry.warning {
          background: rgba(245, 158, 11, 0.1);
          color: #F59E0B;
        }

        .item-actions {
          display: flex;
          gap: 8px;
        }

        .btn-restore,
        .btn-delete {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-restore {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid #10B981;
          color: #10B981;
        }

        .btn-restore:hover {
          background: #10B981;
          color: white;
        }

        .btn-restore svg,
        .btn-delete svg {
          width: 16px;
          height: 16px;
        }

        .btn-delete {
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
        }

        .btn-delete:hover {
          border-color: #EF4444;
          color: #EF4444;
        }

        /* Empty Bin Modal */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1100;
          padding: 20px;
        }

        .empty-bin-modal {
          background: var(--card-bg);
          border-radius: 16px;
          padding: 28px;
          max-width: 420px;
          text-align: center;
        }

        .modal-icon.danger {
          width: 56px;
          height: 56px;
          background: rgba(239, 68, 68, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .modal-icon.danger svg {
          width: 28px;
          height: 28px;
          color: #EF4444;
        }

        .empty-bin-modal h2 {
          color: var(--text-primary);
          font-size: 1.25rem;
          margin: 0 0 8px;
        }

        .empty-bin-modal p {
          color: var(--text-secondary);
          margin: 0 0 24px;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
        }

        .btn-cancel {
          flex: 1;
          padding: 12px 20px;
          background: var(--bg-tertiary);
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-confirm-delete {
          flex: 1;
          padding: 12px 20px;
          background: #EF4444;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-confirm-delete:hover {
          background: #DC2626;
        }

        @media (max-width: 768px) {
          .stats-bar {
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: 8px;
          }

          .items-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </AppLayout>
  );
}
