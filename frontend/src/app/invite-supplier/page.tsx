'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { useFeedbackTrigger } from '@/hooks/useFeedbackTrigger';
import {
  CATEGORIES,
  COUNTRIES,
  getInvitations,
  createInvitation,
  createBulkInvitations,
  resendInvitation,
  cancelInvitation,
  getInviteLink,
  getPendingInvitationsCount,
  SupplierInvitation,
  CreateInvitationInput,
} from '@/lib/suppliers';
import { saveSupplierFromInvitation } from '@/lib/savedSuppliers';

type TabType = 'single' | 'bulk' | 'invitations';
type InvitationFilter = 'all' | 'pending' | 'accepted' | 'expired' | 'cancelled';

interface BulkUploadRow {
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  category?: string;
  country?: string;
  isValid: boolean;
  errors: string[];
}

export default function InviteSupplierPage() {
  const router = useRouter();
  const { triggerFeedback, promptElement } = useFeedbackTrigger();

  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>('single');
  const [pendingCount, setPendingCount] = useState(0);

  // Single Invite state
  const [singleForm, setSingleForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    category: '',
    country: '',
    website: '',
    personalMessage: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastInvitation, setLastInvitation] = useState<SupplierInvitation | null>(null);

  // Bulk Upload state
  const [bulkData, setBulkData] = useState<BulkUploadRow[]>([]);
  const [uploadError, setUploadError] = useState('');
  const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);
  const [bulkSuccess, setBulkSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // My Invitations state
  const [invitations, setInvitations] = useState<SupplierInvitation[]>([]);
  const [filter, setFilter] = useState<InvitationFilter>('all');

  // Load invitations and pending count
  useEffect(() => {
    const loadData = () => {
      const data = getInvitations();
      setInvitations(data);
      setPendingCount(getPendingInvitationsCount());
    };
    loadData();
  }, [activeTab, submitted, bulkSuccess]);

  // Handle single form change
  const handleFormChange = (field: keyof typeof singleForm, value: string) => {
    setSingleForm(prev => ({ ...prev, [field]: value }));
  };

  // Submit single invitation
  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const invitation = createInvitation({
      companyName: singleForm.companyName,
      contactName: singleForm.contactName,
      contactEmail: singleForm.email,
      phone: singleForm.phone || undefined,
      category: singleForm.category || undefined,
      country: singleForm.country || undefined,
      website: singleForm.website || undefined,
      personalMessage: singleForm.personalMessage || undefined,
    });

    // Auto-save supplier to Our Vendors
    saveSupplierFromInvitation({
      id: invitation.id,
      companyName: invitation.companyName,
      contactName: invitation.contactName,
      contactEmail: invitation.contactEmail,
      phone: invitation.phone,
      category: invitation.category,
      country: invitation.country,
      website: invitation.website,
    });

    setLastInvitation(invitation);
    setIsSubmitting(false);
    setSubmitted(true);
    triggerFeedback('invite-supplier');
  };

  // Reset single form
  const handleReset = () => {
    setSubmitted(false);
    setLastInvitation(null);
    setSingleForm({
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      category: '',
      country: '',
      website: '',
      personalMessage: '',
    });
  };

  // Download CSV template
  const downloadTemplate = () => {
    const headers = 'company_name,contact_name,email,phone,category,country';
    const example1 = 'Shenzhen Tech Co.,John Smith,john@company.com,+86 123 456 7890,Electronics,China';
    const example2 = 'Mumbai Exports Ltd.,Raj Kumar,raj@exports.in,,Textiles & Apparel,India';
    const csv = `${headers}\n${example1}\n${example2}`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'befach_supplier_invite_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Parse CSV file
  const parseCSV = (text: string): BulkUploadRow[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
    const rows: BulkUploadRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row: BulkUploadRow = {
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        category: '',
        country: '',
        isValid: true,
        errors: [],
      };

      headers.forEach((header, idx) => {
        const value = values[idx] || '';
        if (header.includes('company')) row.companyName = value;
        else if (header.includes('contact') || header.includes('name')) row.contactName = value;
        else if (header.includes('email')) row.email = value;
        else if (header.includes('phone')) row.phone = value;
        else if (header.includes('category')) row.category = value;
        else if (header.includes('country')) row.country = value;
      });

      // Validate
      if (!row.companyName) {
        row.isValid = false;
        row.errors.push('Company name is required');
      }
      if (!row.email) {
        row.isValid = false;
        row.errors.push('Email is required');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
        row.isValid = false;
        row.errors.push('Invalid email format');
      }

      rows.push(row);
    }

    return rows;
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = parseCSV(text);

      if (parsed.length === 0) {
        setUploadError('No valid data found in file. Make sure your CSV has headers and data rows.');
        return;
      }

      setBulkData(parsed);
    };

    reader.onerror = () => {
      setUploadError('Failed to read file. Please try again.');
    };

    reader.readAsText(file);
  };

  // Handle bulk submit
  const handleBulkSubmit = async () => {
    const validRows = bulkData.filter(row => row.isValid);
    if (validRows.length === 0) return;

    setIsBulkSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const inputs: CreateInvitationInput[] = validRows.map(row => ({
      companyName: row.companyName,
      contactName: row.contactName,
      contactEmail: row.email,
      phone: row.phone || undefined,
      category: row.category || undefined,
      country: row.country || undefined,
    }));

    const invitations = createBulkInvitations(inputs);

    // Auto-save all suppliers to Our Vendors
    invitations.forEach(invitation => {
      saveSupplierFromInvitation({
        id: invitation.id,
        companyName: invitation.companyName,
        contactName: invitation.contactName,
        contactEmail: invitation.contactEmail,
        phone: invitation.phone,
        category: invitation.category,
        country: invitation.country,
        website: invitation.website,
      });
    });

    setIsBulkSubmitting(false);
    setBulkSuccess(true);
    setBulkData([]);
    triggerFeedback('invite-supplier');
  };

  // Handle resend invitation
  const handleResend = (id: string) => {
    resendInvitation(id);
    setInvitations(getInvitations());
  };

  // Handle cancel invitation
  const handleCancel = (id: string) => {
    if (confirm('Are you sure you want to cancel this invitation?')) {
      cancelInvitation(id);
      setInvitations(getInvitations());
    }
  };

  // Copy invite link
  const copyInviteLink = (invitation: SupplierInvitation) => {
    navigator.clipboard.writeText(getInviteLink(invitation));
    alert('Invite link copied to clipboard!');
  };

  // Filter invitations
  const filteredInvitations = invitations.filter(inv =>
    filter === 'all' ? true : inv.status === filter
  );

  // Calculate days left
  const getDaysLeft = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  // Get status badge color
  const getStatusColor = (status: SupplierInvitation['status']) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'accepted': return 'status-accepted';
      case 'expired': return 'status-expired';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  // Success Screen for Single Invite
  if (submitted && lastInvitation) {
    return (
      <AppLayout>
        <div className="success-container">
          <div className="success-content">
            <div className="success-icon">✅</div>
            <h1>Invitation Sent!</h1>
            <p className="success-subtitle">
              We&apos;ve sent an invitation to <strong>{lastInvitation.companyName}</strong>
            </p>

            <div className="email-preview">
              <div className="email-header">
                <span className="email-label">Email Preview</span>
              </div>
              <div className="email-body">
                <p><strong>To:</strong> {lastInvitation.contactEmail}</p>
                <p><strong>Subject:</strong> You&apos;re invited to join Befach!</p>
                <div className="email-content">
                  <p>Hi {lastInvitation.contactName || 'there'},</p>
                  <p>You&apos;ve been invited to join Befach, the B2B sourcing platform.</p>
                  {lastInvitation.personalMessage && (
                    <div className="personal-msg">
                      <em>&quot;{lastInvitation.personalMessage}&quot;</em>
                    </div>
                  )}
                  <p>Click the link below to complete your registration:</p>
                  <p className="invite-link">{getInviteLink(lastInvitation)}</p>
                </div>
              </div>
            </div>

            <div className="success-actions">
              <button
                className="btn-secondary"
                onClick={() => { handleReset(); setActiveTab('invitations'); }}
              >
                View My Invitations
              </button>
              <button className="btn-primary" onClick={handleReset}>
                Invite Another →
              </button>
            </div>
          </div>
        </div>

        <style jsx>{`
          .success-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 70vh;
            padding: 40px 20px;
          }
          .success-content {
            text-align: center;
            max-width: 560px;
            width: 100%;
          }
          .success-icon {
            font-size: 4rem;
            margin-bottom: 20px;
          }
          .success-content h1 {
            color: var(--text-primary);
            margin-bottom: 12px;
            font-size: 1.8rem;
          }
          .success-subtitle {
            color: var(--text-secondary);
            font-size: 1.05rem;
            margin-bottom: 24px;
          }
          .success-subtitle strong {
            color: var(--accent-primary);
          }
          .email-preview {
            background: var(--card-bg);
            border-radius: 12px;
            overflow: hidden;
            text-align: left;
            margin-bottom: 24px;
          }
          .email-header {
            background: var(--bg-secondary);
            padding: 12px 16px;
            border-bottom: 1px solid var(--border-color);
          }
          .email-label {
            font-size: 0.85rem;
            color: var(--text-secondary);
            font-weight: 500;
          }
          .email-body {
            padding: 16px;
          }
          .email-body p {
            margin: 8px 0;
            font-size: 0.9rem;
            color: var(--text-secondary);
          }
          .email-content {
            background: var(--bg-secondary);
            border-radius: 8px;
            padding: 16px;
            margin-top: 12px;
          }
          .email-content p {
            color: var(--text-primary);
          }
          .personal-msg {
            background: rgba(249, 115, 22, 0.1);
            padding: 12px;
            border-radius: 6px;
            border-left: 3px solid var(--accent-primary);
            margin: 12px 0;
          }
          .invite-link {
            color: var(--accent-primary) !important;
            word-break: break-all;
          }
          .success-actions {
            display: flex;
            gap: 12px;
            justify-content: center;
          }
          .btn-primary {
            padding: 14px 28px;
            background: var(--accent-gradient);
            color: white;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.2s;
          }
          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
          }
          .btn-secondary {
            padding: 14px 28px;
            background: transparent;
            color: var(--text-secondary);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          }
          .btn-secondary:hover {
            border-color: var(--accent-primary);
            color: var(--accent-primary);
          }
        `}</style>
      </AppLayout>
    );
  }

  // Bulk Success Screen
  if (bulkSuccess) {
    return (
      <AppLayout>
        <div className="success-container">
          <div className="success-content">
            <div className="success-icon">📧</div>
            <h1>Invitations Sent!</h1>
            <p className="success-subtitle">
              All invitations have been sent successfully.
            </p>
            <div className="success-actions">
              <button
                className="btn-secondary"
                onClick={() => { setBulkSuccess(false); setActiveTab('invitations'); }}
              >
                View My Invitations
              </button>
              <button className="btn-primary" onClick={() => setBulkSuccess(false)}>
                Upload More →
              </button>
            </div>
          </div>
        </div>

        <style jsx>{`
          .success-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 70vh;
            padding: 40px 20px;
          }
          .success-content {
            text-align: center;
            max-width: 480px;
          }
          .success-icon {
            font-size: 4rem;
            margin-bottom: 20px;
          }
          .success-content h1 {
            color: var(--text-primary);
            margin-bottom: 12px;
            font-size: 1.8rem;
          }
          .success-subtitle {
            color: var(--text-secondary);
            font-size: 1.05rem;
            margin-bottom: 30px;
          }
          .success-actions {
            display: flex;
            gap: 12px;
            justify-content: center;
          }
          .btn-primary {
            padding: 14px 28px;
            background: var(--accent-gradient);
            color: white;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.2s;
          }
          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
          }
          .btn-secondary {
            padding: 14px 28px;
            background: transparent;
            color: var(--text-secondary);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          }
          .btn-secondary:hover {
            border-color: var(--accent-primary);
            color: var(--accent-primary);
          }
        `}</style>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="page-container">
        {/* Header */}
        <div className="content-header">
          <h1>Invite Your Suppliers</h1>
          <p>Bring your trusted suppliers to Befach and manage them in one place</p>
        </div>

        {/* Tab Navigation */}
        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === 'single' ? 'active' : ''}`}
            onClick={() => setActiveTab('single')}
          >
            Single Invite
          </button>
          <button
            className={`tab-btn ${activeTab === 'bulk' ? 'active' : ''}`}
            onClick={() => setActiveTab('bulk')}
          >
            Bulk Upload
          </button>
          <button
            className={`tab-btn ${activeTab === 'invitations' ? 'active' : ''}`}
            onClick={() => setActiveTab('invitations')}
          >
            My Invitations
            {pendingCount > 0 && <span className="tab-badge">{pendingCount}</span>}
          </button>
        </div>

        {/* Main Content Area */}
        <div className="content-layout">
          <div className="main-content">
            {/* Tab 1: Single Invite */}
            {activeTab === 'single' && (
              <form onSubmit={handleSingleSubmit} className="form-card">
                <h3>Supplier Details</h3>
                <p className="form-description">
                  Enter your supplier&apos;s details below. They&apos;ll receive an email invitation to join Befach.
                </p>

                <div className="form-row">
                  <div className="form-group">
                    <label>Company Name *</label>
                    <input
                      type="text"
                      value={singleForm.companyName}
                      onChange={(e) => handleFormChange('companyName', e.target.value)}
                      placeholder="e.g., Shenzhen Electronics Co."
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact Name *</label>
                    <input
                      type="text"
                      value={singleForm.contactName}
                      onChange={(e) => handleFormChange('contactName', e.target.value)}
                      placeholder="e.g., John Smith"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={singleForm.email}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      placeholder="supplier@example.com"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={singleForm.phone}
                      onChange={(e) => handleFormChange('phone', e.target.value)}
                      placeholder="+86 123 456 7890"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={singleForm.category}
                      onChange={(e) => handleFormChange('category', e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.icon} {cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <select
                      value={singleForm.country}
                      onChange={(e) => handleFormChange('country', e.target.value)}
                    >
                      <option value="">Select Country</option>
                      {COUNTRIES.map(country => (
                        <option key={country.code} value={country.name}>{country.flag} {country.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="url"
                    value={singleForm.website}
                    onChange={(e) => handleFormChange('website', e.target.value)}
                    placeholder="https://www.example.com"
                  />
                </div>

                <div className="form-group">
                  <label>Personal Message</label>
                  <textarea
                    value={singleForm.personalMessage}
                    onChange={(e) => handleFormChange('personalMessage', e.target.value)}
                    placeholder="Add a personal note to your invitation..."
                    rows={3}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-submit"
                  disabled={isSubmitting || !singleForm.companyName || !singleForm.contactName || !singleForm.email}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Sending Invitation...
                    </>
                  ) : (
                    <>Send Invitation →</>
                  )}
                </button>
              </form>
            )}

            {/* Tab 2: Bulk Upload */}
            {activeTab === 'bulk' && (
              <div className="form-card">
                <h3>Bulk Upload Suppliers</h3>
                <p className="form-description">
                  Upload a CSV file to invite multiple suppliers at once.
                </p>

                {/* Step 1: Download Template */}
                <div className="upload-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Download Template</h4>
                    <p>Get our CSV template with the required format</p>
                    <button className="btn-template" onClick={downloadTemplate}>
                      📥 Download Template
                    </button>
                  </div>
                </div>

                {/* Step 2: Upload File */}
                <div className="upload-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Upload Your File</h4>
                    <p>Fill in the template and upload it here</p>

                    <div
                      className="upload-zone"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="upload-icon">📁</div>
                      <p>Click to upload or drag and drop</p>
                      <span>CSV files only</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                      />
                    </div>

                    {uploadError && (
                      <div className="upload-error">{uploadError}</div>
                    )}
                  </div>
                </div>

                {/* Step 3: Preview & Send */}
                {bulkData.length > 0 && (
                  <div className="upload-step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h4>Preview & Send</h4>
                      <p>{bulkData.length} suppliers found • {bulkData.filter(r => r.isValid).length} valid</p>

                      <div className="preview-table-wrapper">
                        <table className="preview-table">
                          <thead>
                            <tr>
                              <th></th>
                              <th>Company Name</th>
                              <th>Contact</th>
                              <th>Email</th>
                              <th>Country</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bulkData.map((row, idx) => (
                              <tr key={idx} className={row.isValid ? '' : 'invalid-row'}>
                                <td>{row.isValid ? '✓' : '⚠️'}</td>
                                <td>{row.companyName || <span className="missing">Missing</span>}</td>
                                <td>{row.contactName || <span className="missing">—</span>}</td>
                                <td>{row.email || <span className="missing">Missing</span>}</td>
                                <td>{row.country || <span className="missing">—</span>}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="preview-actions">
                        <button
                          className="btn-cancel"
                          onClick={() => setBulkData([])}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn-submit"
                          onClick={handleBulkSubmit}
                          disabled={isBulkSubmitting || bulkData.filter(r => r.isValid).length === 0}
                        >
                          {isBulkSubmitting ? (
                            <>
                              <span className="spinner"></span>
                              Sending...
                            </>
                          ) : (
                            <>Send {bulkData.filter(r => r.isValid).length} Invitations</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: My Invitations */}
            {activeTab === 'invitations' && (
              <div className="invitations-section">
                {/* Filter Tabs */}
                <div className="filter-tabs">
                  {(['all', 'pending', 'accepted', 'expired'] as InvitationFilter[]).map(f => (
                    <button
                      key={f}
                      className={`filter-btn ${filter === f ? 'active' : ''}`}
                      onClick={() => setFilter(f)}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                      {f === 'all' && ` (${invitations.length})`}
                      {f === 'pending' && ` (${invitations.filter(i => i.status === 'pending').length})`}
                    </button>
                  ))}
                </div>

                {/* Invitations List */}
                {filteredInvitations.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <h3>No invitations {filter !== 'all' ? `with status "${filter}"` : 'yet'}</h3>
                    <p>
                      {filter === 'all'
                        ? 'Start inviting your suppliers to see them here.'
                        : 'Try a different filter or invite more suppliers.'}
                    </p>
                    {filter === 'all' && (
                      <button
                        className="btn-primary"
                        onClick={() => setActiveTab('single')}
                      >
                        Invite Your First Supplier
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="invitations-list">
                    {filteredInvitations.map(inv => (
                      <div key={inv.id} className="invitation-card">
                        <div className="invitation-header">
                          <h4>{inv.companyName}</h4>
                          <span className={`status-badge ${getStatusColor(inv.status)}`}>
                            {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                          </span>
                        </div>

                        <div className="invitation-details">
                          <span>📧 {inv.contactEmail}</span>
                          {inv.country && <span>📍 {inv.country}</span>}
                          {inv.category && <span>💼 {inv.category}</span>}
                        </div>

                        <div className="invitation-meta">
                          <span>Invited: {new Date(inv.invitedAt).toLocaleDateString()}</span>
                          {inv.status === 'pending' && (
                            <span className="expires-info">
                              Expires: {new Date(inv.expiresAt).toLocaleDateString()} ({getDaysLeft(inv.expiresAt)} days left)
                            </span>
                          )}
                          {inv.resendCount > 0 && (
                            <span className="resend-count">Resent {inv.resendCount}x</span>
                          )}
                        </div>

                        <div className="invitation-actions">
                          {(inv.status === 'pending' || inv.status === 'expired') && (
                            <button
                              className="action-btn"
                              onClick={() => handleResend(inv.id)}
                            >
                              🔄 Resend
                            </button>
                          )}
                          {inv.status === 'pending' && (
                            <button
                              className="action-btn cancel"
                              onClick={() => handleCancel(inv.id)}
                            >
                              ✕ Cancel
                            </button>
                          )}
                          <button
                            className="action-btn"
                            onClick={() => copyInviteLink(inv)}
                          >
                            🔗 Copy Link
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>


        </div>
      </div>

      <style jsx>{`
        .page-container {
          max-width: 1100px;
        }

        /* Tabs */
        .tabs-container {
          display: flex;
          gap: 4px;
          background: var(--bg-secondary);
          padding: 4px;
          border-radius: 10px;
          margin-bottom: 24px;
          width: fit-content;
        }

        .tab-btn {
          padding: 10px 20px;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tab-btn:hover {
          color: var(--text-primary);
          background: var(--bg-primary);
        }

        .tab-btn.active {
          background: var(--card-bg);
          color: var(--accent-primary);
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .tab-badge {
          background: var(--accent-primary);
          color: white;
          font-size: 0.75rem;
          padding: 2px 8px;
          border-radius: 10px;
          font-weight: 600;
        }

        /* Layout */
        .content-layout {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 24px;
        }

        .main-content {
          min-width: 0;
        }

        /* Form Card */
        .form-card {
          background: var(--card-bg);
          border-radius: 16px;
          padding: 28px;
        }

        .form-card h3 {
          color: var(--text-primary);
          margin-bottom: 8px;
          font-size: 1.2rem;
        }

        .form-description {
          color: var(--text-secondary);
          margin-bottom: 24px;
          font-size: 0.95rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-group {
          margin-bottom: 18px;
        }

        .form-group label {
          display: block;
          color: var(--text-primary);
          font-weight: 500;
          margin-bottom: 6px;
          font-size: 0.9rem;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px 14px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        .btn-submit {
          width: 100%;
          padding: 14px 24px;
          background: var(--accent-gradient);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
          margin-top: 8px;
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Bulk Upload Steps */
        .upload-step {
          display: flex;
          gap: 16px;
          padding: 20px 0;
          border-bottom: 1px solid var(--border-color);
        }

        .upload-step:last-child {
          border-bottom: none;
        }

        .step-number {
          width: 32px;
          height: 32px;
          background: var(--accent-primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          flex-shrink: 0;
        }

        .step-content {
          flex: 1;
        }

        .step-content h4 {
          color: var(--text-primary);
          margin-bottom: 4px;
          font-size: 1rem;
        }

        .step-content > p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 12px;
        }

        .btn-template {
          padding: 10px 20px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-primary);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-template:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }

        .upload-zone {
          border: 2px dashed var(--border-color);
          border-radius: 12px;
          padding: 40px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .upload-zone:hover {
          border-color: var(--accent-primary);
          background: rgba(249, 115, 22, 0.05);
        }

        .upload-icon {
          font-size: 2.5rem;
          margin-bottom: 12px;
        }

        .upload-zone p {
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .upload-zone span {
          color: var(--text-secondary);
          font-size: 0.85rem;
        }

        .upload-error {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
          padding: 12px;
          border-radius: 8px;
          margin-top: 12px;
          font-size: 0.9rem;
        }

        /* Preview Table */
        .preview-table-wrapper {
          overflow-x: auto;
          margin: 16px 0;
        }

        .preview-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }

        .preview-table th,
        .preview-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }

        .preview-table th {
          background: var(--bg-secondary);
          color: var(--text-secondary);
          font-weight: 500;
        }

        .preview-table td {
          color: var(--text-primary);
        }

        .preview-table .invalid-row {
          background: rgba(239, 68, 68, 0.05);
        }

        .missing {
          color: var(--text-tertiary);
          font-style: italic;
        }

        .preview-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 16px;
        }

        .btn-cancel {
          padding: 12px 24px;
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-secondary);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-cancel:hover {
          border-color: #ef4444;
          color: #ef4444;
        }

        /* Invitations Section */
        .invitations-section {
          background: var(--card-bg);
          border-radius: 16px;
          padding: 24px;
        }

        .filter-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 8px 16px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          color: var(--text-secondary);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-btn:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }

        .filter-btn.active {
          background: rgba(249, 115, 22, 0.1);
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .empty-state p {
          color: var(--text-secondary);
          margin-bottom: 20px;
        }

        .btn-primary {
          padding: 12px 24px;
          background: var(--accent-gradient);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
        }

        /* Invitation Cards */
        .invitations-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .invitation-card {
          background: var(--bg-secondary);
          border-radius: 12px;
          padding: 20px;
          border: 1px solid var(--border-color);
        }

        .invitation-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .invitation-header h4 {
          color: var(--text-primary);
          font-size: 1.05rem;
          margin: 0;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .status-pending {
          background: rgba(234, 179, 8, 0.15);
          color: #eab308;
        }

        .status-accepted {
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
        }

        .status-expired {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
        }

        .status-cancelled {
          background: rgba(107, 114, 128, 0.15);
          color: #6b7280;
        }

        .invitation-details {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 12px;
        }

        .invitation-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          font-size: 0.85rem;
          color: var(--text-tertiary);
          padding-top: 12px;
          border-top: 1px solid var(--border-color);
          margin-bottom: 12px;
        }

        .expires-info {
          color: #eab308;
        }

        .resend-count {
          color: var(--accent-primary);
        }

        .invitation-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .action-btn {
          padding: 8px 16px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-secondary);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }

        .action-btn.cancel:hover {
          border-color: #ef4444;
          color: #ef4444;
        }

        /* Sidebar */
        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .sidebar-card {
          background: #ffffff;
          border-radius: 12px;
          padding: 18px;
          border: 1px solid var(--border-color);
        }

        .sidebar-card.highlight {
          background: #ffffff;
        }

        .sidebar-card h4 {
          color: #1a1a2e;
          margin-bottom: 10px;
          font-size: 0.95rem;
        }

        .sidebar-card p {
          color: #64748b;
          font-size: 0.9rem;
          line-height: 1.5;
          margin: 0;
        }

        .sidebar-card strong {
          color: var(--accent-primary);
        }

        .sidebar-card ul {
          padding-left: 16px;
          margin: 8px 0 0;
        }

        .sidebar-card li {
          color: #64748b;
          font-size: 0.85rem;
          margin-bottom: 6px;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .content-layout {
            grid-template-columns: 1fr;
          }
          .sidebar {
            flex-direction: row;
            flex-wrap: wrap;
          }
          .sidebar-card {
            flex: 1;
            min-width: 200px;
          }
        }

        @media (max-width: 600px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          .tabs-container {
            width: 100%;
          }
          .tab-btn {
            flex: 1;
            justify-content: center;
            padding: 10px 12px;
            font-size: 0.85rem;
          }
        }
      `}</style>
      {promptElement}
    </AppLayout>
  );
}
