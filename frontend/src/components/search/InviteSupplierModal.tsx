'use client';
import { useState } from 'react';
import { Modal } from '@/components/ui';
import { CATEGORIES, addInvitation } from '@/lib/suppliers';
import { FolderOpen, Download } from 'lucide-react';

interface Props { isOpen: boolean; onClose: () => void; }

export default function InviteSupplierModal({ isOpen, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'single'|'bulk'>('single');
  const [formData, setFormData] = useState({ companyName: '', contactEmail: '', contactName: '', category: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    addInvitation({ companyName: formData.companyName, contactEmail: formData.contactEmail, contactName: formData.contactName, category: formData.category, message: formData.message });
    await new Promise(r => setTimeout(r, 500));
    setIsSubmitting(false);
    alert('Invitation sent!');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Supplier">
      <p className="subtitle">Bring your existing suppliers to Befach</p>
      <div className="tabs">
        <button className={activeTab === 'single' ? 'active' : ''} onClick={() => setActiveTab('single')}>Single Invite</button>
        <button className={activeTab === 'bulk' ? 'active' : ''} onClick={() => setActiveTab('bulk')}>Bulk Upload</button>
      </div>
      {activeTab === 'single' ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Company Name *</label><input type="text" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} placeholder="e.g., ABC Manufacturing Co." required /></div>
          <div className="form-group"><label>Contact Email *</label><input type="email" value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} placeholder="e.g., sales@company.com" required /></div>
          <div className="form-group"><label>Contact Name</label><input type="text" value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} placeholder="e.g., John Smith" /></div>
          <div className="form-group"><label>Product Category</label><select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}><option value="">Select</option>{CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select></div>
          <div className="form-group"><label>Personal Message</label><textarea rows={3} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="Add a personal note..." /></div>
          <div className="form-actions"><button type="button" className="btn-cancel" onClick={onClose}>Cancel</button><button type="submit" className="btn-submit" disabled={isSubmitting}>{isSubmitting ? 'Sending...' : 'Send Invitation'}</button></div>
        </form>
      ) : (
        <div className="bulk-upload">
          <div className="upload-box">
            <div className="upload-icon"><FolderOpen size={24} /></div>
            <h4>Upload Supplier List</h4>
            <p>Download our template, fill in supplier details, and upload</p>
            <button className="btn-template"><Download size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Download Template</button>
            <div className="upload-area"><p>Drag & drop CSV/Excel file here or <span>browse</span></p></div>
          </div>
          <div className="form-actions"><button type="button" className="btn-cancel" onClick={onClose}>Cancel</button></div>
        </div>
      )}
      <style jsx>{`
        .subtitle { color: var(--text-secondary); margin: -10px 0 20px; }
        .tabs { display: flex; gap: 8px; margin-bottom: 24px; }
        .tabs button { flex: 1; padding: 12px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-secondary); cursor: pointer; }
        .tabs button.active { background: rgba(249,115,22,0.1); border-color: rgba(249,115,22,0.3); color: #fb923c; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 6px; }
        .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 12px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-primary); font-size: 0.95rem; }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: none; border-color: #f97316; }
        .form-actions { display: flex; gap: 12px; padding-top: 16px; border-top: 1px solid var(--border-color); }
        .btn-cancel { flex: 1; padding: 14px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 10px; color: var(--text-secondary); font-weight: 500; cursor: pointer; }
        .btn-submit { flex: 1; padding: 14px; background: linear-gradient(135deg, #f97316, #ea580c); border: none; border-radius: 10px; color: white; font-weight: 600; cursor: pointer; }
        .btn-submit:disabled { opacity: 0.7; }
        .bulk-upload { text-align: center; }
        .upload-box { background: var(--bg-secondary); border-radius: 12px; padding: 30px; margin-bottom: 20px; }
        .upload-icon { font-size: 3rem; margin-bottom: 10px; }
        .upload-box h4 { margin: 0 0 8px; color: var(--text-primary); }
        .upload-box p { color: var(--text-secondary); margin: 0 0 16px; }
        .btn-template { background: rgba(249,115,22,0.1); border: 1px solid rgba(249,115,22,0.3); color: #f97316; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-bottom: 16px; }
        .upload-area { border: 2px dashed var(--border-color); border-radius: 10px; padding: 24px; }
        .upload-area span { color: #f97316; cursor: pointer; }
      `}</style>
    </Modal>
  );
}
