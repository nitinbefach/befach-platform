'use client';

import { Supplier, SearchResult, formatLeadTime, isSupplierSaved, saveSupplier, unsaveSupplier } from '@/lib/suppliers';
import { useState, useEffect } from 'react';
import { Star, MapPin, Check, Heart, Package, Truck, Eye, Mail, MessageCircle } from 'lucide-react';

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
      {/* Top row: badges */}
      <div className="card-top-row">
        <div className="badge-row">
          {supplier.partnerStatus === 'premium' && (
            <span className="premium-badge">
              <Star size={10} style={{ fill: '#f59e0b', color: '#f59e0b' }} /> Premium
            </span>
          )}
          <span className="verified-badge">
            <Check size={10} /> Verified
          </span>
        </div>
        <button
          className={`save-btn ${isSaved ? 'saved' : ''}`}
          onClick={handleSaveToggle}
          title={isSaved ? 'Remove from saved' : 'Save supplier'}
        >
          <Heart size={16} style={isSaved ? { color: '#ef4444', fill: '#ef4444' } : {}} />
        </button>
      </div>

      {/* Header: avatar + info */}
      <div className="card-header">
        <div className="supplier-avatar">
          {supplier.companyName.charAt(0)}
        </div>
        <div className="supplier-info">
          <h3 title={supplier.companyName}>{supplier.companyName}</h3>
          <div className="supplier-rating">
            <div className="stars-row">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  size={13}
                  style={i < Math.floor(supplier.metrics.avgRating)
                    ? { color: '#f59e0b', fill: '#f59e0b' }
                    : { color: '#d1d5db' }
                  }
                />
              ))}
            </div>
            <span className="rating-text">
              {supplier.metrics.avgRating.toFixed(1)} ({supplier.metrics.reviewCount} reviews)
            </span>
          </div>
          <div className="supplier-location">
            <MapPin size={13} />
            <span>{supplier.location.city}, {supplier.location.country}</span>
          </div>
        </div>
      </div>

      {/* Match score */}
      <div className="match-score">
        <div className="score-bar">
          <div className="score-fill" style={{ width: `${matchScore}%` }} />
        </div>
        <span className="score-text">{matchScore}% Match</span>
      </div>

      {/* Stats */}
      <div className="card-body">
        <div className="supplier-stats">
          <div className="stat-item">
            <Check size={13} />
            <span>{supplier.metrics.responseRate}% Response</span>
          </div>
          <div className="stat-item">
            <Package size={13} />
            <span>MOQ: {mainCatalogue?.products[0]?.moq || 'N/A'}</span>
          </div>
          {leadTime && (
            <div className="stat-item">
              <Truck size={13} />
              <span>{formatLeadTime(leadTime)}</span>
            </div>
          )}
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
              {cert.verified && <Check size={10} />} {cert.name}
            </span>
          ))}
          {supplier.certifications.length > 4 && (
            <span className="cert-more">+{supplier.certifications.length - 4}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="card-actions">
        <button className="btn-view" onClick={() => onView(supplier)}>
          <Eye size={14} /> View
        </button>
        <button className="btn-contact" onClick={() => onContact(supplier)}>
          <Mail size={14} /> Contact
        </button>
        <button className="btn-chat" onClick={() => onChat(supplier)}>
          <MessageCircle size={14} /> Chat
        </button>
      </div>

      <style jsx>{`
        .supplier-card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          padding: 18px;
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
        }

        .supplier-card:hover {
          border-color: rgba(249, 115, 22, 0.4);
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
        }

        /* Top row: badges + save */
        .card-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        .badge-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .premium-badge {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          background: rgba(249, 115, 22, 0.1);
          color: #f97316;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        .verified-badge {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        .save-btn {
          background: none;
          border: none;
          cursor: pointer;
          opacity: 0.4;
          transition: all 0.2s;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
        }

        .save-btn:hover,
        .save-btn.saved {
          opacity: 1;
        }

        /* Header */
        .card-header {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 14px;
        }

        .supplier-avatar {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.15rem;
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
          font-size: 0.95rem;
          color: var(--text-primary);
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.3;
        }

        .supplier-rating {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 3px;
        }

        .stars-row {
          display: flex;
          align-items: center;
          gap: 1px;
          line-height: 1;
        }

        .rating-text {
          font-size: 0.75rem;
          color: var(--text-muted);
          white-space: nowrap;
        }

        .supplier-location {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.78rem;
          color: var(--text-secondary);
          line-height: 1;
        }

        /* Match score */
        .match-score {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }

        .score-bar {
          flex: 1;
          height: 5px;
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
          font-size: 0.78rem;
          font-weight: 600;
          color: #22c55e;
          white-space: nowrap;
        }

        /* Body */
        .card-body {
          padding-top: 12px;
          border-top: 1px solid var(--border-color);
          flex: 1;
        }

        .supplier-stats {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.78rem;
          color: var(--text-secondary);
          white-space: nowrap;
        }

        .supplier-products {
          font-size: 0.82rem;
          color: var(--text-secondary);
          margin-bottom: 10px;
          line-height: 1.5;
        }

        .supplier-products strong {
          color: var(--text-primary);
          font-weight: 600;
        }

        .supplier-certs {
          display: flex;
          align-items: center;
          gap: 5px;
          flex-wrap: wrap;
        }

        .cert-badge {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          background: rgba(59, 130, 246, 0.08);
          color: #60a5fa;
          padding: 3px 7px;
          border-radius: 4px;
          font-size: 0.68rem;
          font-weight: 500;
        }

        .cert-more {
          color: var(--text-muted);
          font-size: 0.68rem;
          padding: 3px 4px;
        }

        /* Actions */
        .card-actions {
          display: flex;
          gap: 8px;
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px solid var(--border-color);
        }

        .card-actions button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 9px 8px;
          border-radius: 8px;
          font-size: 0.82rem;
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
          background: rgba(59, 130, 246, 0.08);
          border: 1px solid rgba(59, 130, 246, 0.2);
          color: #60a5fa;
        }

        .btn-contact:hover {
          background: rgba(59, 130, 246, 0.18);
        }

        .btn-chat {
          background: rgba(34, 197, 94, 0.08);
          border: 1px solid rgba(34, 197, 94, 0.2);
          color: #22c55e;
        }

        .btn-chat:hover {
          background: rgba(34, 197, 94, 0.18);
        }

        @media (max-width: 768px) {
          .supplier-card {
            padding: 14px;
          }

          .supplier-avatar {
            width: 40px;
            height: 40px;
            font-size: 1.05rem;
            border-radius: 8px;
          }

          .supplier-info h3 {
            font-size: 0.9rem;
          }

          .stars-row {
            gap: 0;
          }

          .supplier-stats {
            gap: 10px;
          }

          .stat-item {
            font-size: 0.75rem;
          }

          .card-actions button {
            padding: 8px 6px;
            font-size: 0.78rem;
          }
        }

        @media (max-width: 480px) {
          .supplier-card {
            padding: 12px;
          }

          .card-header {
            gap: 10px;
          }

          .supplier-avatar {
            width: 36px;
            height: 36px;
            font-size: 0.95rem;
          }

          .supplier-info h3 {
            font-size: 0.85rem;
          }

          .supplier-rating {
            flex-wrap: wrap;
            gap: 4px;
          }

          .rating-text {
            font-size: 0.7rem;
          }

          .card-actions {
            gap: 6px;
          }

          .card-actions button {
            padding: 8px 4px;
            font-size: 0.75rem;
            gap: 3px;
          }
        }
      `}</style>
    </div>
  );
}
