'use client';

import { Supplier, SearchResult, formatLeadTime, isSupplierSaved, saveSupplier, unsaveSupplier } from '@/lib/suppliers';
import { useState, useEffect } from 'react';

interface SupplierCardProps {
  result: SearchResult;
  onView: (supplier: Supplier) => void;
  onContact: (supplier: Supplier) => void;
  onChat: (supplier: Supplier) => void;
}

export default function SupplierCard({ result, onView, onContact, onChat }: SupplierCardProps) {
  const { supplier, matchScore, matchedProducts } = result;
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setIsSaved(isSupplierSaved(supplier.id));
  }, [supplier.id]);

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaved) {
      unsaveSupplier(supplier.id);
    } else {
      saveSupplier(supplier.id);
    }
    setIsSaved(!isSaved);
  };

  const topProducts = matchedProducts.slice(0, 3);
  const mainCatalogue = supplier.catalogue[0];
  const leadTime = mainCatalogue?.products[0]?.leadTime;

  return (
    <div className="supplier-card">
      <div className="card-header">
        <div className="supplier-avatar">
          {supplier.companyName.charAt(0)}
        </div>
        <div className="supplier-info">
          <h3>{supplier.companyName}</h3>
          <div className="supplier-rating">
            {'★'.repeat(Math.floor(supplier.metrics.avgRating))}
            {'☆'.repeat(5 - Math.floor(supplier.metrics.avgRating))}
            <span>{supplier.metrics.avgRating.toFixed(1)} ({supplier.metrics.reviewCount} reviews)</span>
          </div>
          <div className="supplier-location">
            📍 {supplier.location.city}, {supplier.location.country}
          </div>
        </div>
        <div className="card-badges">
          {supplier.partnerStatus === 'premium' && (
            <span className="premium-badge">⭐ Premium</span>
          )}
          <span className="verified-badge">✓ Verified</span>
          <button
            className={`save-btn ${isSaved ? 'saved' : ''}`}
            onClick={handleSaveToggle}
            title={isSaved ? 'Remove from saved' : 'Save supplier'}
          >
            {isSaved ? '❤️' : '🤍'}
          </button>
        </div>
      </div>

      <div className="match-score">
        <div className="score-bar">
          <div className="score-fill" style={{ width: `${matchScore}%` }}></div>
        </div>
        <span className="score-text">{matchScore}% Match</span>
      </div>

      <div className="card-body">
        <div className="supplier-stats">
          <span>✓ {supplier.metrics.responseRate}% Response</span>
          <span>📦 MOQ: {mainCatalogue?.products[0]?.moq || 'N/A'}</span>
          {leadTime && <span>🚚 {formatLeadTime(leadTime)}</span>}
        </div>

        <div className="supplier-products">
          <strong>Products:</strong>{' '}
          {topProducts.map((mp, i) => (
            <span key={mp.product.id}>
              {mp.product.name}
              {i < topProducts.length - 1 && ', '}
            </span>
          ))}
          {matchedProducts.length > 3 && ` +${matchedProducts.length - 3} more`}
        </div>

        <div className="supplier-certs">
          {supplier.certifications.slice(0, 4).map((cert) => (
            <span key={cert.name} className="cert-badge">
              {cert.verified && '✓'} {cert.name}
            </span>
          ))}
          {supplier.certifications.length > 4 && (
            <span className="cert-more">+{supplier.certifications.length - 4}</span>
          )}
        </div>
      </div>

      <div className="card-actions">
        <button className="btn-view" onClick={() => onView(supplier)}>
          👁 View
        </button>
        <button className="btn-contact" onClick={() => onContact(supplier)}>
          ✉ Contact
        </button>
        <button className="btn-chat" onClick={() => onChat(supplier)}>
          💬 Chat
        </button>
      </div>

      <style jsx>{`
        .supplier-card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 20px;
          transition: all 0.2s;
        }

        .supplier-card:hover {
          border-color: rgba(249, 115, 22, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .card-header {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          position: relative;
          margin-bottom: 12px;
        }

        .supplier-avatar {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }

        .supplier-info {
          flex: 1;
          min-width: 0;
        }

        .supplier-info h3 {
          margin: 0 0 4px;
          font-size: 1rem;
          color: var(--text-primary);
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .supplier-rating {
          color: #fbbf24;
          font-size: 0.8rem;
          margin-bottom: 2px;
        }

        .supplier-rating span {
          color: var(--text-muted);
          margin-left: 6px;
        }

        .supplier-location {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .card-badges {
          display: flex;
          flex-direction: column;
          gap: 6px;
          align-items: flex-end;
        }

        .verified-badge {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .premium-badge {
          background: rgba(249, 115, 22, 0.1);
          color: #f97316;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .save-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
          opacity: 0.6;
          transition: all 0.2s;
          padding: 0;
        }

        .save-btn:hover,
        .save-btn.saved {
          opacity: 1;
        }

        .match-score {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }

        .score-bar {
          flex: 1;
          height: 6px;
          background: var(--bg-secondary);
          border-radius: 3px;
          overflow: hidden;
        }

        .score-fill {
          height: 100%;
          background: linear-gradient(90deg, #f97316, #22c55e);
          border-radius: 3px;
          transition: width 0.5s ease-out;
        }

        .score-text {
          font-size: 0.8rem;
          font-weight: 600;
          color: #22c55e;
          white-space: nowrap;
        }

        .card-body {
          padding-top: 12px;
          border-top: 1px solid var(--border-color);
        }

        .supplier-stats {
          display: flex;
          gap: 14px;
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 10px;
          flex-wrap: wrap;
        }

        .supplier-products {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 10px;
          line-height: 1.4;
        }

        .supplier-products strong {
          color: var(--text-primary);
        }

        .supplier-certs {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .cert-badge {
          background: rgba(59, 130, 246, 0.1);
          color: #60a5fa;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.7rem;
        }

        .cert-more {
          color: var(--text-muted);
          font-size: 0.7rem;
          padding: 3px 6px;
        }

        .card-actions {
          display: flex;
          gap: 8px;
          margin-top: 16px;
        }

        .card-actions button {
          flex: 1;
          padding: 10px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-view {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
        }

        .btn-view:hover {
          background: var(--bg-hover);
        }

        .btn-contact {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #60a5fa;
        }

        .btn-contact:hover {
          background: rgba(59, 130, 246, 0.2);
        }

        .btn-chat {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #22c55e;
        }

        .btn-chat:hover {
          background: rgba(34, 197, 94, 0.2);
        }

        @media (max-width: 480px) {
          .card-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
