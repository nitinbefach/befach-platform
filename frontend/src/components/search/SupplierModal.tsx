'use client';

import { useState } from 'react';
import { Supplier, formatPrice, formatLeadTime } from '@/lib/suppliers';
import { Modal } from '@/components/ui';

interface SupplierModalProps {
  supplier: Supplier;
  isOpen: boolean;
  onClose: () => void;
  onContact: () => void;
  onChat: () => void;
}

type TabType = 'overview' | 'products' | 'reviews';

export default function SupplierModal({
  supplier,
  isOpen,
  onClose,
  onContact,
  onChat,
}: SupplierModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const mainCatalogue = supplier.catalogue[0];
  const allProducts = supplier.catalogue.flatMap((c) => c.products);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="supplier-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="supplier-avatar">{supplier.companyName.charAt(0)}</div>
          <div className="supplier-info">
            <h2>{supplier.companyName}</h2>
            <div className="supplier-rating">
              {'★'.repeat(Math.floor(supplier.metrics.avgRating))}
              {'☆'.repeat(5 - Math.floor(supplier.metrics.avgRating))}
              <span>
                {supplier.metrics.avgRating.toFixed(1)} ({supplier.metrics.reviewCount} reviews)
              </span>
            </div>
            <div className="supplier-location">
              📍 {supplier.location.city}, {supplier.location.country}
            </div>
          </div>
          <div className="header-badges">
            {supplier.partnerStatus === 'premium' && (
              <span className="premium-badge">⭐ Premium Partner</span>
            )}
            <span className="verified-badge">✓ Verified</span>
          </div>
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
            className={`tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Products & Pricing ({allProducts.length})
          </button>
          <button
            className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
        </div>

        {/* Tab Content */}
        <div className="modal-body">
          {activeTab === 'overview' && (
            <>
              <div className="detail-section">
                <h4>About</h4>
                <p>{supplier.description}</p>
              </div>

              <div className="detail-section">
                <h4>Key Metrics</h4>
                <div className="metrics-grid">
                  <div className="metric">
                    <span className="metric-value">{supplier.metrics.responseRate}%</span>
                    <span className="metric-label">Response Rate</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">{supplier.metrics.onTimeDelivery}%</span>
                    <span className="metric-label">On-Time Delivery</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">{supplier.metrics.totalOrders}</span>
                    <span className="metric-label">Total Orders</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">{supplier.employeeCount}</span>
                    <span className="metric-label">Employees</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Certifications</h4>
                <div className="certs-list">
                  {supplier.certifications.map((cert) => (
                    <span key={cert.name} className="cert-badge">
                      {cert.verified && '✓'} {cert.name}
                      {cert.validUntil && (
                        <small> (Valid until {cert.validUntil})</small>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h4>Company Info</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Founded</span>
                    <span className="info-value">{supplier.foundedYear}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Category</span>
                    <span className="info-value">{mainCatalogue?.category}</span>
                  </div>
                  {supplier.website && (
                    <div className="info-item">
                      <span className="info-label">Website</span>
                      <span className="info-value">{supplier.website}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'products' && (
            <div className="products-tab">
              {allProducts.map((product) => (
                <div key={product.id} className="product-item">
                  <div className="product-main">
                    <h5>{product.name}</h5>
                    <p>{product.description}</p>
                    <div className="product-specs">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <span key={key} className="spec">
                          {key}: <strong>{value}</strong>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="product-pricing">
                    <div className="base-price">
                      {formatPrice(product.pricing.basePrice)}/{product.pricing.unit}
                    </div>
                    <div className="product-details">
                      <span>MOQ: {product.moq}</span>
                      <span>Lead: {formatLeadTime(product.leadTime)}</span>
                    </div>
                    <div className="bulk-pricing">
                      <strong>Bulk Pricing:</strong>
                      {product.pricing.bulkPricing.slice(0, 3).map((tier) => (
                        <div key={tier.minQty} className="tier">
                          {tier.minQty}+ @ {formatPrice(tier.price)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="reviews-tab">
              <div className="reviews-summary">
                <div className="rating-big">
                  <span className="rating-value">{supplier.metrics.avgRating.toFixed(1)}</span>
                  <div className="rating-stars">
                    {'★'.repeat(Math.floor(supplier.metrics.avgRating))}
                    {'☆'.repeat(5 - Math.floor(supplier.metrics.avgRating))}
                  </div>
                  <span className="rating-count">{supplier.metrics.reviewCount} reviews</span>
                </div>
              </div>
              <div className="reviews-placeholder">
                <p>📝 Review details coming soon...</p>
                <p className="placeholder-text">
                  This supplier has been verified by Befach with{' '}
                  {supplier.metrics.reviewCount} positive reviews from buyers.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          <button className="btn-contact" onClick={onContact}>
            ✉ Contact Supplier
          </button>
          <button className="btn-chat" onClick={onChat}>
            💬 Start Chat
          </button>
        </div>
      </div>

      <style jsx>{`
        .supplier-modal {
          padding: 0;
        }

        .modal-header {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 20px;
        }

        .supplier-avatar {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }

        .supplier-info {
          flex: 1;
        }

        .supplier-info h2 {
          margin: 0 0 6px;
          font-size: 1.25rem;
          color: var(--text-primary);
        }

        .supplier-rating {
          color: #fbbf24;
          font-size: 0.9rem;
          margin-bottom: 4px;
        }

        .supplier-rating span {
          color: var(--text-muted);
          margin-left: 6px;
        }

        .supplier-location {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .header-badges {
          display: flex;
          flex-direction: column;
          gap: 6px;
          align-items: flex-end;
        }

        .verified-badge {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .premium-badge {
          background: rgba(249, 115, 22, 0.1);
          color: #f97316;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .modal-tabs {
          display: flex;
          gap: 4px;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 20px;
        }

        .tab {
          padding: 12px 20px;
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .tab:hover {
          color: var(--text-primary);
        }

        .tab.active {
          color: #f97316;
          border-bottom-color: #f97316;
        }

        .modal-body {
          min-height: 300px;
          max-height: 400px;
          overflow-y: auto;
        }

        .detail-section {
          margin-bottom: 24px;
        }

        .detail-section h4 {
          color: var(--text-muted);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 0 12px;
        }

        .detail-section p {
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .metric {
          background: var(--bg-secondary);
          padding: 16px;
          border-radius: 10px;
          text-align: center;
        }

        .metric-value {
          display: block;
          font-size: 1.25rem;
          font-weight: 700;
          color: #f97316;
        }

        .metric-label {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .certs-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .cert-badge {
          background: rgba(59, 130, 246, 0.1);
          color: #60a5fa;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.85rem;
        }

        .cert-badge small {
          opacity: 0.7;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-label {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .info-value {
          color: var(--text-primary);
          font-weight: 500;
        }

        /* Products Tab */
        .product-item {
          display: flex;
          gap: 20px;
          padding: 16px;
          background: var(--bg-secondary);
          border-radius: 12px;
          margin-bottom: 12px;
        }

        .product-main {
          flex: 1;
        }

        .product-main h5 {
          margin: 0 0 6px;
          color: var(--text-primary);
          font-size: 1rem;
        }

        .product-main p {
          margin: 0 0 10px;
          color: var(--text-secondary);
          font-size: 0.85rem;
        }

        .product-specs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .spec {
          font-size: 0.75rem;
          color: var(--text-muted);
          background: var(--card-bg);
          padding: 4px 8px;
          border-radius: 4px;
        }

        .spec strong {
          color: var(--text-primary);
        }

        .product-pricing {
          min-width: 150px;
          text-align: right;
        }

        .base-price {
          font-size: 1.1rem;
          font-weight: 700;
          color: #22c55e;
          margin-bottom: 8px;
        }

        .product-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 10px;
        }

        .bulk-pricing {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .bulk-pricing strong {
          display: block;
          margin-bottom: 4px;
        }

        .tier {
          color: var(--text-muted);
        }

        /* Reviews Tab */
        .reviews-summary {
          text-align: center;
          padding: 20px;
          background: var(--bg-secondary);
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .rating-big .rating-value {
          font-size: 3rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .rating-stars {
          color: #fbbf24;
          font-size: 1.5rem;
        }

        .rating-count {
          display: block;
          color: var(--text-muted);
          margin-top: 4px;
        }

        .reviews-placeholder {
          text-align: center;
          padding: 40px;
          color: var(--text-muted);
        }

        .placeholder-text {
          font-size: 0.9rem;
          max-width: 300px;
          margin: 0 auto;
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          padding-top: 20px;
          border-top: 1px solid var(--border-color);
          margin-top: 20px;
        }

        .modal-footer button {
          flex: 1;
          padding: 14px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-contact {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #60a5fa;
        }

        .btn-contact:hover {
          background: #3b82f6;
          color: white;
        }

        .btn-chat {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          border: none;
          color: white;
        }

        .btn-chat:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
        }

        @media (max-width: 600px) {
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .product-item {
            flex-direction: column;
          }

          .product-pricing {
            text-align: left;
          }
        }
      `}</style>
    </Modal>
  );
}
