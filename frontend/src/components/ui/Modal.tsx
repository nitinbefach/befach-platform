'use client';

import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  hideHeader?: boolean;
}

export default function Modal({ isOpen, onClose, title, children, className = '', hideHeader = false }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay active ${className}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal-container ${className}`}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        {!hideHeader && title && (
          <div className="modal-header">
            <h2>{title}</h2>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

