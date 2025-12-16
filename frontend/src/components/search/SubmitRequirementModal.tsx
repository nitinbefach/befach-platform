'use client';
import { useState } from 'react';
import { Modal } from '@/components/ui';
import { CATEGORIES, COUNTRIES } from '@/lib/suppliers';
import { createRequirement, addRequirementToStorage } from '@/lib/requirements';

interface Props { isOpen: boolean; onClose: () => void; searchQuery?: string; }

export default function SubmitRequirementModal({ isOpen, onClose, searchQuery = '' }: Props) {
  const [formData, setFormData] = useState({ productName: searchQuery, category: '', hsnCode: '', quantity: '', unit: 'pieces', targetPrice: '', specifications: '', preferredCountries: [] as string[] });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const requirement = createRequirement({
      type: 'single',
      products: [{ id: `PROD-${Date.now()}`, name: formData.productName, hsnCode: formData.hsnCode, quantity: formData.quantity, unit: formData.unit, specifications: formData.specifications, targetPrice: formData.targetPrice, currency: 'USD' }],
      urgency: 'standard',
      preferredCountries: formData.preferredCountries,
      title: formData.productName,
    });
    addRequirementToStorage(requirement);
    await new Promise(r => setTimeout(r, 500));
    setIsSubmitting(false);
    alert('Requirement submitted! We\'ll notify you within 24-48 hours.');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Your Requirement">
      <form onSubmit={handleSubmit}>
        <div className="form-group"><label>Product Name *</label><input type="text" value={formData.productName} onChange={e => setFormData({...formData, productName: e.target.value})} placeholder="e.g., LED Bulb 9W" required /></div>
        <div className="form-row">
          <div className="form-group"><label>Category *</label><select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required><option value="">Select</option>{CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select></div>
          <div className="form-group"><label>HSN Code</label><input type="text" value={formData.hsnCode} onChange={e => setFormData({...formData, hsnCode: e.target.value})} placeholder="e.g., 8539.50" /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Quantity *</label><input type="text" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} placeholder="e.g., 10000" required /></div>
          <div className="form-group"><label>Unit</label><select value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}><option value="pieces">Pieces</option><option value="kg">KG</option><option value="boxes">Boxes</option></select></div>
        </div>
        <div className="form-group"><label>Target Price</label><input type="text" value={formData.targetPrice} onChange={e => setFormData({...formData, targetPrice: e.target.value})} placeholder="e.g., $2.50" /></div>
        <div className="form-group"><label>Specifications</label><textarea rows={3} value={formData.specifications} onChange={e => setFormData({...formData, specifications: e.target.value})} placeholder="Product specifications..." /></div>
        <div className="form-group"><label>Preferred Countries</label><div className="chips">{COUNTRIES.slice(0,5).map(c => <label key={c.code} className="chip"><input type="checkbox" checked={formData.preferredCountries.includes(c.name)} onChange={() => setFormData({...formData, preferredCountries: formData.preferredCountries.includes(c.name) ? formData.preferredCountries.filter(x=>x!==c.name) : [...formData.preferredCountries, c.name]})} />{c.flag} {c.name}</label>)}</div></div>
        <div className="info-box">ℹ️ Our team will find matching suppliers within 24-48 hours.</div>
        <div className="form-actions"><button type="button" className="btn-cancel" onClick={onClose}>Cancel</button><button type="submit" className="btn-submit" disabled={isSubmitting}>{isSubmitting ? 'Sharing...' : 'Share Requirement'}</button></div>
      </form>
      <style jsx>{`
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 6px; }
        .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 12px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-primary); font-size: 0.95rem; }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: none; border-color: #f97316; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .chip { display: flex; align-items: center; gap: 6px; background: var(--bg-secondary); padding: 8px 12px; border-radius: 20px; font-size: 0.85rem; cursor: pointer; }
        .chip:has(input:checked) { background: rgba(249,115,22,0.1); color: #f97316; }
        .chip input { accent-color: #f97316; }
        .info-box { display: flex; gap: 10px; background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.2); padding: 12px; border-radius: 10px; font-size: 0.9rem; color: #60a5fa; margin-bottom: 20px; }
        .form-actions { display: flex; gap: 12px; padding-top: 16px; border-top: 1px solid var(--border-color); }
        .btn-cancel { flex: 1; padding: 14px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 10px; color: var(--text-secondary); font-weight: 500; cursor: pointer; }
        .btn-submit { flex: 1; padding: 14px; background: linear-gradient(135deg, #f97316, #ea580c); border: none; border-radius: 10px; color: white; font-weight: 600; cursor: pointer; }
        .btn-submit:disabled { opacity: 0.7; }
        @media (max-width: 500px) { .form-row { grid-template-columns: 1fr; } }
      `}</style>
    </Modal>
  );
}
