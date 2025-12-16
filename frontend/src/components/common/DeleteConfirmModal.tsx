'use client';

import { useState } from 'react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  itemName: string;
  itemType?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPermanent?: boolean; // If true, shows permanent delete warning
}

export default function DeleteConfirmModal({
  isOpen,
  title,
  itemName,
  itemType = 'item',
  onConfirm,
  onCancel,
  isPermanent = false,
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    await onConfirm();
    setIsDeleting(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isDeleting) {
      onCancel();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container">
        {/* Icon */}
        <div className={`modal-icon ${isPermanent ? 'danger' : 'warning'}`}>
          {isPermanent ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          )}
        </div>

        {/* Content */}
        <h2>{title}</h2>
        <p className="item-name">{itemName}</p>

        {/* Info Message */}
        <div className={`info-box ${isPermanent ? 'danger' : 'info'}`}>
          {isPermanent ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <span>This action cannot be undone. The {itemType} will be permanently deleted.</span>
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              <span>This {itemType} will be moved to the <strong>Recycle Bin</strong> where you can restore it within 30 days.</span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="modal-actions">
          <button
            className="btn-cancel"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className={`btn-delete ${isPermanent ? 'permanent' : ''}`}
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="spinner"></span>
                Deleting...
              </>
            ) : isPermanent ? (
              'Delete Permanently'
            ) : (
              'Move to Recycle Bin'
            )}
          </button>
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
          z-index: 1100;
          padding: 20px;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-container {
          background: var(--card-bg);
          border-radius: 16px;
          padding: 28px;
          width: 100%;
          max-width: 420px;
          text-align: center;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .modal-icon.warning {
          background: rgba(245, 158, 11, 0.1);
        }

        .modal-icon.warning svg {
          width: 28px;
          height: 28px;
          color: #F59E0B;
        }

        .modal-icon.danger {
          background: rgba(239, 68, 68, 0.1);
        }

        .modal-icon.danger svg {
          width: 28px;
          height: 28px;
          color: #EF4444;
        }

        h2 {
          color: var(--text-primary);
          font-size: 1.25rem;
          margin: 0 0 8px;
        }

        .item-name {
          color: var(--text-secondary);
          font-size: 0.95rem;
          margin: 0 0 20px;
          word-break: break-word;
        }

        .info-box {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 8px;
          margin-bottom: 24px;
          text-align: left;
        }

        .info-box.info {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .info-box.info svg {
          color: #3B82F6;
          flex-shrink: 0;
          width: 18px;
          height: 18px;
          margin-top: 1px;
        }

        .info-box.info span {
          color: #1E40AF;
          font-size: 0.85rem;
          line-height: 1.5;
        }

        .info-box.danger {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .info-box.danger svg {
          color: #EF4444;
          flex-shrink: 0;
          width: 18px;
          height: 18px;
          margin-top: 1px;
        }

        .info-box.danger span {
          color: #991B1B;
          font-size: 0.85rem;
          line-height: 1.5;
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
          transition: all 0.2s;
        }

        .btn-cancel:hover:not(:disabled) {
          border-color: var(--text-secondary);
          color: var(--text-primary);
        }

        .btn-delete {
          flex: 1;
          padding: 12px 20px;
          background: #F59E0B;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .btn-delete:hover:not(:disabled) {
          background: #D97706;
        }

        .btn-delete.permanent {
          background: #EF4444;
        }

        .btn-delete.permanent:hover:not(:disabled) {
          background: #DC2626;
        }

        .btn-cancel:disabled,
        .btn-delete:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
