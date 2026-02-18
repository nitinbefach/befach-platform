'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useMobile } from '@/hooks/useMobile';
import {
  getPaymentSources,
  getGateways,
  toggleGateway,
} from '@/lib/payments';
import { getSavedSuppliers, type SavedSupplier } from '@/lib/savedSuppliers';
import type { SavedPaymentSource, GatewayConfig } from '@/types/payments';
import { Plus, Edit3, Trash2, Check, CreditCard, Building2, Zap } from 'lucide-react';

type TabId = 'sources' | 'beneficiaries' | 'gateways';

export default function PaymentMethodsPage() {
  const { isMobile } = useMobile();
  const [activeTab, setActiveTab] = useState<TabId>('sources');
  const [sources, setSources] = useState<SavedPaymentSource[]>([]);
  const [gateways, setGateways] = useState<GatewayConfig[]>([]);
  const [suppliers, setSuppliers] = useState<SavedSupplier[]>([]);

  useEffect(() => {
    setSources(getPaymentSources());
    setGateways(getGateways());
    setSuppliers(getSavedSuppliers().slice(0, 8));
  }, []);

  const handleToggleGateway = (id: string) => {
    toggleGateway(id);
    setGateways(getGateways());
  };

  const getSourceIcon = (source: SavedPaymentSource) => {
    // Bank-specific branded logos
    if (source.type === 'bank_account' && source.bankName) {
      const name = source.bankName.toLowerCase();
      if (name.includes('hdfc')) {
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="#004B8D" />
            <text x="20" y="26" textAnchor="middle" fill="white" fontSize="16" fontWeight="700" fontFamily="Arial, sans-serif">H</text>
            <rect x="6" y="30" width="28" height="3" rx="1.5" fill="#ED1C24" />
          </svg>
        );
      }
      if (name.includes('icici')) {
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="#B02A30" />
            <text x="20" y="26" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="Arial, sans-serif">ICICI</text>
          </svg>
        );
      }
      if (name.includes('sbi') || name.includes('state bank')) {
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="#22409A" />
            <text x="20" y="26" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="Arial, sans-serif">SBI</text>
          </svg>
        );
      }
      if (name.includes('axis')) {
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="#97144D" />
            <text x="20" y="26" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="Arial, sans-serif">AXIS</text>
          </svg>
        );
      }
      if (name.includes('kotak')) {
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="#ED1C24" />
            <text x="20" y="26" textAnchor="middle" fill="white" fontSize="16" fontWeight="700" fontFamily="Arial, sans-serif">K</text>
          </svg>
        );
      }
      // Generic bank
      return (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="10" fill="#6366f1" />
          <path d="M20 10L30 16V18H10V16L20 10Z" fill="white" />
          <rect x="13" y="20" width="3" height="8" rx="0.5" fill="white" />
          <rect x="18.5" y="20" width="3" height="8" rx="0.5" fill="white" />
          <rect x="24" y="20" width="3" height="8" rx="0.5" fill="white" />
          <rect x="10" y="29" width="20" height="2" rx="1" fill="white" />
        </svg>
      );
    }
    if (source.type === 'upi') {
      return (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="10" fill="#fff" stroke="#e5e7eb" strokeWidth="1" />
          <path d="M14 28L18.5 12H22L17.5 28H14Z" fill="#097939" />
          <path d="M19 28L23.5 12H27L22.5 28H19Z" fill="#ED752E" />
        </svg>
      );
    }
    if (source.type === 'card') {
      return (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="10" fill="#1a1a2e" />
          <rect x="8" y="13" width="24" height="14" rx="2" fill="none" stroke="white" strokeWidth="1.5" />
          <line x1="8" y1="18" x2="32" y2="18" stroke="white" strokeWidth="1.5" />
          <rect x="11" y="22" width="8" height="2" rx="1" fill="#f97316" />
        </svg>
      );
    }
    return null;
  };

  const getSourceTypeName = (type: SavedPaymentSource['type']) => {
    switch (type) {
      case 'bank_account': return 'Bank Account';
      case 'upi': return 'UPI';
      case 'card': return 'Card';
    }
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: 'sources', label: 'Sources' },
    { id: 'beneficiaries', label: 'Beneficiaries' },
    { id: 'gateways', label: 'Gateways' },
  ];

  const showSources = !isMobile || activeTab === 'sources';
  const showBeneficiaries = !isMobile || activeTab === 'beneficiaries';
  const showGateways = !isMobile || activeTab === 'gateways';

  return (
    <AppLayout>
      <div className="page-container">
        <div className="content-header">
          <h1>Payment Methods</h1>
          <p>Manage your payment sources, supplier bank details, and connected gateways</p>
        </div>

        {/* Tab Bar — mobile only */}
        {isMobile && (
          <div className="tab-bar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* ─── Sources Section ──────────────────────────────────── */}
        {showSources && (
          <div className="section-card">
            <div className="section-card-header">
              <div className="section-icon-wrap"><CreditCard size={18} /></div>
              <div>
                <h2 className="section-heading">Your Payment Sources</h2>
                <p className="section-desc">Bank accounts, UPI IDs, and cards used for outgoing payments</p>
              </div>
            </div>
            <div className="source-grid">
              {sources.map(source => (
                <div key={source.id} className="source-card">
                  <div className="source-top-row">
                    <div className="source-icon">{getSourceIcon(source)}</div>
                    <div className="source-info">
                      <span className="source-label">{source.label}</span>
                      <span className="source-type">{getSourceTypeName(source.type)}</span>
                    </div>
                    {source.isDefault && (
                      <span className="default-badge"><Check size={11} /> Default</span>
                    )}
                  </div>
                  <div className="source-details">
                    {source.bankName && <span className="source-detail-item">{source.bankName} {source.accountNumber}</span>}
                    {source.upiId && <span className="source-detail-item">{source.upiId}</span>}
                  </div>
                  <div className="source-actions">
                    <button className="source-action-btn"><Edit3 size={13} /> Edit</button>
                    <button className="source-action-btn danger"><Trash2 size={13} /> Remove</button>
                  </div>
                </div>
              ))}
              <button className="add-card">
                <Plus size={20} />
                <span>Add Payment Source</span>
              </button>
            </div>
          </div>
        )}

        {/* ─── Beneficiaries Section ────────────────────────────── */}
        {showBeneficiaries && (
          <div className="section-card">
            <div className="section-card-header">
              <div className="section-icon-wrap"><Building2 size={18} /></div>
              <div>
                <h2 className="section-heading">Supplier Bank Details</h2>
                <p className="section-desc">Saved beneficiary details for quick payments to your suppliers</p>
              </div>
            </div>

            {isMobile ? (
              <div className="beneficiary-cards">
                {suppliers.map(s => (
                  <div key={s.id} className="beneficiary-card">
                    <div className="ben-name">{s.name}</div>
                    <div className="ben-detail">{s.location ? `${s.location}` : 'India'}</div>
                    <div className="ben-detail">Contact: {s.contactPerson || s.email || '—'}</div>
                    <div className="ben-actions">
                      <button className="icon-btn-sm"><Edit3 size={13} /> Edit</button>
                      <button className="icon-btn-sm danger"><Trash2 size={13} /> Remove</button>
                    </div>
                  </div>
                ))}
                <button className="add-card compact">
                  <Plus size={18} />
                  <span>Add Beneficiary</span>
                </button>
              </div>
            ) : (
              <div className="table-wrap">
                <table className="ben-table">
                  <thead>
                    <tr>
                      <th>Supplier</th>
                      <th>Contact</th>
                      <th>Location</th>
                      <th>Specialization</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suppliers.map(s => (
                      <tr key={s.id}>
                        <td><span className="ben-table-name">{s.name}</span></td>
                        <td>{s.contactPerson || s.email || '—'}</td>
                        <td>{s.location || '—'}</td>
                        <td>{s.specialization || '—'}</td>
                        <td>
                          <div className="table-actions">
                            <button className="icon-btn-sm"><Edit3 size={13} /> Edit</button>
                            <button className="icon-btn-sm danger"><Trash2 size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="table-footer">
                  <button className="add-btn"><Plus size={16} /> Add Beneficiary</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── Gateways Section ─────────────────────────────────── */}
        {showGateways && (
          <div className="section-card">
            <div className="section-card-header">
              <div className="section-icon-wrap"><Zap size={18} /></div>
              <div>
                <h2 className="section-heading">Payment Gateways</h2>
                <p className="section-desc">Connect and manage your preferred payment providers</p>
              </div>
            </div>
            <div className="gateway-grid">
              {gateways.map(gw => (
                <div key={gw.id} className={`gateway-card ${gw.enabled ? 'enabled' : ''}`}>
                  <div className="gw-top">
                    <span className="gw-icon">{gw.icon}</span>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={gw.enabled}
                        onChange={() => handleToggleGateway(gw.id)}
                      />
                      <span className="toggle-slider" />
                    </label>
                  </div>
                  <span className="gw-name">{gw.name}</span>
                  <span className="gw-desc">{gw.description}</span>
                  {gw.connected && gw.connectedEmail ? (
                    <span className="gw-connected"><Check size={12} /> {gw.connectedEmail}</span>
                  ) : (
                    <span className="gw-not-connected">Not connected</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .page-container { max-width: 1000px; padding: 20px; }
        .content-header { margin-bottom: 28px; }
        .content-header h1 { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin: 0 0 6px; }
        .content-header p { font-size: 0.9rem; color: var(--text-secondary); margin: 0; }

        /* Tab Bar (mobile) */
        .tab-bar {
          display: flex; gap: 4px;
          background: var(--bg-tertiary); border-radius: 12px; padding: 4px;
          margin-bottom: 20px;
        }
        .tab-btn {
          flex: 1; padding: 12px 12px; border-radius: 10px; border: none;
          font-size: 0.85rem; font-weight: 500; cursor: pointer;
          background: none; color: var(--text-secondary); transition: all 0.15s;
        }
        .tab-btn.active {
          background: var(--bg-secondary, #fff); color: var(--text-primary);
          box-shadow: 0 1px 3px rgba(0,0,0,0.08); font-weight: 600;
        }

        /* Section Cards */
        .section-card {
          background: var(--card-bg, var(--bg-secondary, #fff));
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 24px;
        }
        .section-card-header {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          margin-bottom: 24px;
          padding-bottom: 18px;
          border-bottom: 1px solid var(--border-color);
        }
        .section-icon-wrap {
          width: 40px; height: 40px; border-radius: 10px;
          background: linear-gradient(135deg, rgba(249,115,22,0.1), rgba(234,88,12,0.05));
          color: var(--accent-primary, #f97316);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .section-heading { font-size: 1.05rem; color: var(--text-primary); margin: 0 0 3px; font-weight: 600; }
        .section-desc { font-size: 0.82rem; color: var(--text-secondary); margin: 0; }

        /* Sources Grid */
        .source-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .source-card {
          border: 1px solid var(--border-color); border-radius: 12px;
          padding: 18px; transition: all 0.15s;
          background: var(--bg-secondary, #fff);
        }
        .source-card:hover { border-color: var(--accent-primary, #f97316); box-shadow: 0 2px 8px rgba(249,115,22,0.08); }
        .source-top-row { display: flex; gap: 12px; align-items: center; margin-bottom: 12px; }
        .source-icon { width: 40px; height: 40px; flex-shrink: 0; border-radius: 10px; overflow: hidden; }
        .source-info { display: flex; flex-direction: column; flex: 1; }
        .source-label { font-size: 0.92rem; font-weight: 600; color: var(--text-primary); }
        .source-type { font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500; }
        .default-badge {
          display: inline-flex; align-items: center; gap: 3px;
          background: var(--accent-primary, #f97316); color: white;
          padding: 3px 8px; border-radius: 8px; font-size: 0.68rem; font-weight: 600;
        }
        .source-details {
          padding: 10px 12px;
          background: var(--bg-tertiary);
          border-radius: 8px;
          margin-bottom: 12px;
        }
        .source-detail-item {
          font-size: 0.82rem; color: var(--text-secondary);
          font-family: monospace;
        }
        .source-actions { display: flex; gap: 8px; }
        .source-action-btn {
          display: inline-flex; align-items: center; gap: 4px;
          background: var(--bg-tertiary); border: none; padding: 6px 12px;
          border-radius: 6px; color: var(--text-secondary); cursor: pointer;
          font-size: 0.78rem; font-weight: 500; transition: all 0.15s;
        }
        .source-action-btn:hover { color: var(--accent-primary, #f97316); background: rgba(249,115,22,0.08); }
        .source-action-btn.danger:hover { color: #ef4444; background: rgba(239,68,68,0.06); }

        .add-card {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          border: 2px dashed var(--border-color); border-radius: 12px;
          background: none; color: var(--text-muted); font-size: 0.88rem;
          padding: 32px 18px; cursor: pointer; transition: all 0.15s;
          min-height: 100px;
        }
        .add-card:hover { border-color: var(--accent-primary, #f97316); color: var(--accent-primary, #f97316); }
        .add-card.compact { padding: 14px; min-height: auto; }

        /* Beneficiary Table */
        .table-wrap {
          border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden;
          background: var(--bg-secondary, #fff);
        }
        .ben-table { width: 100%; border-collapse: collapse; }
        .ben-table th {
          text-align: left; padding: 12px 18px; background: var(--bg-tertiary);
          color: var(--text-secondary); font-size: 0.78rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.3px;
        }
        .ben-table td {
          padding: 14px 18px; border-bottom: 1px solid var(--border-color);
          font-size: 0.88rem; color: var(--text-primary);
        }
        .ben-table tr:last-child td { border-bottom: none; }
        .ben-table tr:hover { background: var(--bg-tertiary); }
        .ben-table-name { font-weight: 600; }
        .table-actions { display: flex; gap: 6px; }
        .icon-btn-sm {
          display: inline-flex; align-items: center; gap: 4px;
          background: var(--bg-tertiary); border: none; padding: 6px 10px;
          border-radius: 6px; color: var(--text-secondary); cursor: pointer; font-size: 0.78rem;
          transition: all 0.15s;
        }
        .icon-btn-sm:hover { color: var(--accent-primary, #f97316); background: rgba(249,115,22,0.08); }
        .icon-btn-sm.danger:hover { color: #ef4444; background: rgba(239,68,68,0.06); }
        .table-footer { padding: 14px 18px; border-top: 1px solid var(--border-color); }
        .add-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--bg-tertiary); border: none; padding: 8px 16px;
          border-radius: 8px; color: var(--text-primary); cursor: pointer;
          font-size: 0.85rem; font-weight: 500; transition: all 0.15s;
        }
        .add-btn:hover { background: var(--accent-primary, #f97316); color: white; }

        /* Beneficiary Cards (mobile) */
        .beneficiary-cards { display: flex; flex-direction: column; gap: 12px; }
        .beneficiary-card {
          border: 1px solid var(--border-color); border-radius: 12px; padding: 16px;
          background: var(--bg-secondary, #fff);
        }
        .ben-name { font-size: 0.92rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px; }
        .ben-detail { font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 2px; }
        .ben-actions { display: flex; gap: 8px; margin-top: 10px; }

        /* Gateways — Grid on Desktop */
        .gateway-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .gateway-card {
          border: 1px solid var(--border-color); border-radius: 14px;
          padding: 20px; display: flex; flex-direction: column; gap: 6px;
          transition: all 0.15s; background: var(--bg-secondary, #fff);
        }
        .gateway-card.enabled { border-color: rgba(249,115,22,0.3); background: rgba(249,115,22,0.02); }
        .gateway-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .gw-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
        .gw-icon { font-size: 2rem; }
        .gw-name { font-size: 0.95rem; font-weight: 600; color: var(--text-primary); }
        .gw-desc { font-size: 0.78rem; color: var(--text-secondary); line-height: 1.4; }
        .gw-connected {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 0.72rem; color: #10b981; font-weight: 500; margin-top: 4px;
        }
        .gw-not-connected { font-size: 0.72rem; color: var(--text-muted); margin-top: 4px; }

        /* Toggle Switch */
        .toggle { position: relative; display: inline-block; width: 44px; height: 24px; flex-shrink: 0; }
        .toggle input { opacity: 0; width: 0; height: 0; }
        .toggle-slider {
          position: absolute; cursor: pointer; inset: 0;
          background: var(--bg-tertiary); border-radius: 24px;
          transition: 0.2s; border: 1px solid var(--border-color);
        }
        .toggle-slider::before {
          content: ''; position: absolute;
          height: 18px; width: 18px; left: 2px; bottom: 2px;
          background: white; border-radius: 50%; transition: 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
        }
        .toggle input:checked + .toggle-slider { background: var(--accent-primary, #f97316); border-color: var(--accent-primary, #f97316); }
        .toggle input:checked + .toggle-slider::before { transform: translateX(20px); }

        @media (max-width: 768px) {
          .page-container { padding: 14px; padding-bottom: 100px; }
          .content-header h1 { font-size: 1.25rem; }
          .section-card { padding: 0; border-radius: 0; margin-bottom: 0; border: none; background: none; }
          .section-card-header { display: none; }
          .source-grid { grid-template-columns: 1fr; gap: 10px; }
          .source-card { padding: 14px; }
          .add-card { min-height: auto; padding: 18px; }
          .gateway-grid { grid-template-columns: 1fr; gap: 10px; }
          .gateway-card { padding: 14px; flex-direction: row; align-items: center; gap: 12px; flex-wrap: wrap; }
          .gw-top { flex: none; margin-bottom: 0; flex-direction: row; gap: 10px; }
          .gw-icon { font-size: 1.5rem; }
          .gw-name { flex: 1; font-size: 0.9rem; }
          .gw-desc { width: 100%; margin-top: 0; font-size: 0.75rem; }
          .gw-connected, .gw-not-connected { width: 100%; }
          .beneficiary-card { padding: 14px; }
          .icon-btn-sm { padding: 8px 12px; font-size: 0.8rem; }
        }
        @media (max-width: 480px) {
          .page-container { padding: 12px; padding-bottom: 100px; }
          .source-details { padding: 8px 10px; }
          .source-action-btn { padding: 6px 10px; font-size: 0.75rem; }
        }
      `}</style>
    </AppLayout>
  );
}
