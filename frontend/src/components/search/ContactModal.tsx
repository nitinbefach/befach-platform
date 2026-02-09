'use client';

import { useState } from 'react';
import { Supplier } from '@/lib/suppliers';
import { Modal } from '@/components/ui';
import { saveSupplierFromSearch } from '@/lib/savedSuppliers';

interface ContactModalProps {
  supplier: Supplier;
  isOpen: boolean;
  onClose: () => void;
  searchQuery?: string;
}

export default function ContactModal({
  supplier,
  isOpen,
  onClose,
  searchQuery = '',
}: ContactModalProps) {
  const [formData, setFormData] = useState({
    subject: 'inquiry',
    product: searchQuery,
    quantity: '',
    targetPrice: '',
    message: '',
    alsoSubmitRequirement: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Store in localStorage for demo
    const contacts = JSON.parse(localStorage.getItem('befach-contacted-suppliers') || '[]');
    contacts.push({
      supplierId: supplier.id,
      supplierName: supplier.companyName,
      ...formData,
      sentAt: new Date().toISOString(),
    });
    localStorage.setItem('befach-contacted-suppliers', JSON.stringify(contacts));

    // Auto-save supplier to Our Vendors
    saveSupplierFromSearch({
      id: supplier.id,
      companyName: supplier.companyName,
      location: supplier.location,
      contacts: supplier.contacts,
      catalogue: supplier.catalogue,
      metrics: supplier.metrics,
      website: supplier.website,
      description: supplier.description,
    }, 'contact');

    setIsSubmitting(false);
    alert(`Message sent to ${supplier.companyName}!`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Contact ${supplier.companyName}`}
    >
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Subject *</label>
          <select
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          >
            <option value="inquiry">Product Inquiry</option>
            <option value="quote">Request Quote</option>
            <option value="sample">Sample Request</option>
            <option value="partnership">Partnership Discussion</option>
          </select>
        </div>

        <div className="form-group">
          <label>Product/Service *</label>
          <input
            type="text"
            value={formData.product}
            onChange={(e) => setFormData({ ...formData, product: e.target.value })}
            placeholder="e.g., LED Bulbs 9W, Vitamin D3 Softgels"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="text"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="e.g., 10,000 pieces"
            />
          </div>
          <div className="form-group">
            <label>Target Price</label>
            <input
              type="text"
              value={formData.targetPrice}
              onChange={(e) => setFormData({ ...formData, targetPrice: e.target.value })}
              placeholder="e.g., $2.50/unit"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Message *</label>
          <textarea
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Describe your requirements in detail..."
            required
          />
        </div>

        <div className="form-checkbox">
          <input
            type="checkbox"
            id="also-submit"
            checked={formData.alsoSubmitRequirement}
            onChange={(e) =>
              setFormData({ ...formData, alsoSubmitRequirement: e.target.checked })
            }
          />
          <label htmlFor="also-submit">
            Also submit as requirement (get quotes from other suppliers)
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>

      <style jsx>{`
        .contact-form {
          padding: 10px 0;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 6px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 0.95rem;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #f97316;
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: var(--text-muted);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-checkbox {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-bottom: 20px;
        }

        .form-checkbox input {
          accent-color: #f97316;
          width: 18px;
          height: 18px;
        }

        .form-checkbox label {
          font-size: 0.9rem;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
        }

        .btn-cancel {
          flex: 1;
          padding: 14px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          color: var(--text-secondary);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-cancel:hover {
          background: var(--bg-hover);
        }

        .btn-submit {
          flex: 1;
          padding: 14px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          border: none;
          border-radius: 10px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
        }

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @media (max-width: 500px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Modal>
  );
}
