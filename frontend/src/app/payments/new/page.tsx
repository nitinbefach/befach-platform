'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useMobile } from '@/hooks/useMobile';
import { getSavedSuppliers, type SavedSupplier } from '@/lib/savedSuppliers';
import { createPayment } from '@/lib/payments';
import {
  CURRENCIES,
  PAYMENT_METHODS,
  getMethodsForSegment,
  calculateFees,
  getEstimatedArrival,
  formatPaymentCurrency,
  convertAmount,
  getFXRate,
  COMPLIANCE_NOTICES,
  type MethodConfig,
} from '@/lib/paymentConstants';
import type { PaymentSegment, MakePaymentFormData, BeneficiaryDetails } from '@/types/payments';
import { ArrowLeft, ArrowRight, Check, Send, Download, RefreshCw } from 'lucide-react';
import { captureFeatureAction } from '@/lib/posthogEvents';

const INITIAL_FORM: MakePaymentFormData = {
  segment: 'international',
  supplierName: '',
  manualEntry: false,
  beneficiary: {
    accountName: '',
    bankName: '',
    accountNumber: '',
    country: '',
    currency: 'USD',
  },
  amount: '',
  currency: 'USD',
  purpose: '',
  method: '',
};

export default function MakePaymentPage() {
  const { isMobile } = useMobile();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<MakePaymentFormData>(INITIAL_FORM);
  const [suppliers, setSuppliers] = useState<SavedSupplier[]>([]);
  const [success, setSuccess] = useState(false);
  const [paymentRef, setPaymentRef] = useState('');

  useEffect(() => {
    setSuppliers(getSavedSuppliers());
  }, []);

  const updateForm = (updates: Partial<MakePaymentFormData>) => {
    setForm(prev => ({ ...prev, ...updates }));
  };

  const updateBeneficiary = (updates: Partial<BeneficiaryDetails>) => {
    setForm(prev => ({
      ...prev,
      beneficiary: { ...prev.beneficiary, ...updates },
    }));
  };

  const handleSupplierSelect = (supplierId: string) => {
    if (supplierId === 'manual') {
      updateForm({ supplierId: undefined, supplierName: '', manualEntry: true });
      return;
    }
    const supplier = suppliers.find(s => s.id === supplierId);
    if (supplier) {
      updateForm({
        supplierId: supplier.id,
        supplierName: supplier.name,
        manualEntry: false,
      });
    }
  };

  const handleSegmentChange = (segment: PaymentSegment) => {
    updateForm({
      segment,
      method: '',
      currency: segment === 'local' ? 'INR' : 'USD',
    });
  };

  const selectedMethod = PAYMENT_METHODS.find(m => m.id === form.method);
  const amount = parseFloat(form.amount) || 0;
  const fees = form.method ? calculateFees(amount, form.method) : 0;
  const fxRate = form.currency !== 'INR' ? getFXRate(form.currency, 'INR') : 1;
  const amountInINR = form.currency !== 'INR' ? convertAmount(amount, form.currency, 'INR') : amount;
  const totalDebit = amountInINR + fees;
  const estimatedArrival = form.method ? getEstimatedArrival(form.method) : '';

  const canProceedStep1 = form.supplierName.trim() && form.amount && parseFloat(form.amount) > 0 && form.purpose.trim();
  const canProceedStep2 = form.method !== '';

  const handleConfirm = () => {
    const payment = createPayment({
      segment: form.segment,
      status: 'initiated',
      supplierId: form.supplierId,
      supplierName: form.supplierName,
      supplierBankDetails: form.beneficiary,
      amount,
      currency: form.currency,
      amountInINR,
      fxRate: fxRate !== 1 ? fxRate : undefined,
      method: form.method as any,
      methodLabel: selectedMethod?.label || '',
      fees,
      totalDebit,
      purpose: form.purpose,
      orderId: form.orderId,
      invoiceNumber: form.invoiceNumber,
      estimatedArrival,
    });
    setPaymentRef(payment.referenceNumber);
    setSuccess(true);
    captureFeatureAction('payment', 'initiated', { segment: form.segment, method: form.method });
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setStep(1);
    setSuccess(false);
    setPaymentRef('');
  };

  // ─── Success State ──────────────────────────────────────────────────
  if (success) {
    return (
      <AppLayout>
        <div className="page-container">
          <div className="success-screen">
            <div className="success-icon">
              <Check size={48} />
            </div>
            <h2>Payment Initiated!</h2>
            <p className="success-ref">{paymentRef}</p>
            <p className="success-detail">
              {formatPaymentCurrency(amount, form.currency)} to {form.supplierName}
            </p>
            <p className="success-arrival">Estimated arrival: {estimatedArrival}</p>
            <div className="success-actions">
              <a href="/payments/history" className="btn-primary">
                <Send size={16} /> Track Payment
              </a>
              <button className="btn-secondary" onClick={handleReset}>
                <RefreshCw size={16} /> Make Another Payment
              </button>
            </div>
          </div>
        </div>
        <style jsx>{`
          .page-container { max-width: 600px; padding: 20px; margin: 0 auto; }
          .success-screen { text-align: center; padding: 60px 20px; }
          .success-icon {
            width: 96px; height: 96px; border-radius: 50%;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white; display: flex; align-items: center; justify-content: center;
            margin: 0 auto 24px;
          }
          .success-screen h2 { font-size: 1.5rem; color: var(--text-primary); margin: 0 0 8px; }
          .success-ref { font-family: monospace; font-size: 1rem; color: var(--accent-primary, #f97316); font-weight: 600; margin: 0 0 8px; }
          .success-detail { color: var(--text-secondary); font-size: 1rem; margin: 0 0 4px; }
          .success-arrival { color: var(--text-muted); font-size: 0.88rem; margin: 0 0 32px; }
          .success-actions { display: flex; flex-direction: column; gap: 12px; max-width: 300px; margin: 0 auto; }
          .btn-primary, .btn-secondary {
            display: flex; align-items: center; justify-content: center; gap: 8px;
            padding: 14px 24px; border-radius: 10px; font-weight: 600; font-size: 0.9rem;
            cursor: pointer; text-decoration: none; border: none;
          }
          .btn-primary { background: linear-gradient(135deg, #f97316, #ea580c); color: white; }
          .btn-secondary { background: var(--bg-tertiary); color: var(--text-primary); }
          @media (max-width: 768px) {
            .page-container { padding: 14px; padding-bottom: 100px; }
            .success-screen { padding: 40px 10px; }
          }
        `}</style>
      </AppLayout>
    );
  }

  const stepLabels = ['Payment Details', 'Choose Method', 'Review & Confirm'];

  return (
    <AppLayout>
      <div className="page-container">
        <div className="content-header">
          <h1>Make a Payment</h1>
          <p>Send payment to your supplier — international or domestic</p>
        </div>

        {/* Step Indicator — inline to fix styled-jsx scoping */}
        {isMobile ? (
          <div className="step-mobile">
            <div className="step-mobile-bar">
              <div className="step-mobile-fill" style={{ width: `${(step / 3) * 100}%` }} />
            </div>
            <span className="step-mobile-text">Step {step} of 3 — {stepLabels[step - 1]}</span>
          </div>
        ) : (
          <div className="step-indicator">
            {stepLabels.map((label, i) => (
              <div key={i} className={`step-item ${i + 1 <= step ? 'active' : ''} ${i + 1 < step ? 'done' : ''}`}>
                <div className="step-number">{i + 1 < step ? <Check size={14} /> : i + 1}</div>
                <span className="step-label">{label}</span>
                {i < 2 && <div className="step-line" />}
              </div>
            ))}
          </div>
        )}

        {/* ─── STEP 1 ───────────────────────────────────────────── */}
        {step === 1 && (
          <div className="form-card">
            {/* Segment Toggle */}
            <div className="segment-toggle">
              <button
                className={`segment-btn ${form.segment === 'international' ? 'active' : ''}`}
                onClick={() => handleSegmentChange('international')}
              >
                International
              </button>
              <button
                className={`segment-btn ${form.segment === 'local' ? 'active' : ''}`}
                onClick={() => handleSegmentChange('local')}
              >
                Local (Domestic)
              </button>
            </div>

            {/* Supplier */}
            <div className="form-group">
              <label>Supplier</label>
              <select
                value={form.supplierId || (form.manualEntry ? 'manual' : '')}
                onChange={(e) => handleSupplierSelect(e.target.value)}
              >
                <option value="">Select a supplier...</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
                <option value="manual">+ Enter manually</option>
              </select>
            </div>

            {form.manualEntry && (
              <div className="form-group">
                <label>Supplier Name</label>
                <input
                  type="text"
                  value={form.supplierName}
                  onChange={(e) => updateForm({ supplierName: e.target.value })}
                  placeholder="Enter supplier name"
                />
              </div>
            )}

            {/* Amount + Currency */}
            <div className="form-row">
              <div className="form-group flex-2">
                <label>Amount</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => updateForm({ amount: e.target.value })}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group flex-1">
                <label>Currency</label>
                <select
                  value={form.currency}
                  onChange={(e) => updateForm({ currency: e.target.value })}
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                  ))}
                </select>
              </div>
            </div>

            {form.currency !== 'INR' && amount > 0 && (
              <div className="fx-preview">
                {formatPaymentCurrency(amount, form.currency)} = {formatPaymentCurrency(amountInINR, 'INR')}
                <span className="fx-rate">Rate: 1 {form.currency} = {fxRate.toFixed(2)} INR</span>
              </div>
            )}

            {/* Purpose */}
            <div className="form-group">
              <label>Purpose / Description</label>
              <input
                type="text"
                value={form.purpose}
                onChange={(e) => updateForm({ purpose: e.target.value })}
                placeholder="e.g. Order payment — Organic Turmeric Powder"
              />
            </div>

            {/* Optional fields */}
            <div className="form-row">
              <div className="form-group flex-1">
                <label>Order / PO Number <span className="optional">(optional)</span></label>
                <input
                  type="text"
                  value={form.orderId || ''}
                  onChange={(e) => updateForm({ orderId: e.target.value })}
                  placeholder="ORD-2024-0001"
                />
              </div>
              <div className="form-group flex-1">
                <label>Invoice Number <span className="optional">(optional)</span></label>
                <input
                  type="text"
                  value={form.invoiceNumber || ''}
                  onChange={(e) => updateForm({ invoiceNumber: e.target.value })}
                  placeholder="INV-2024-001"
                />
              </div>
            </div>

            {form.manualEntry && (
              <>
                <h3 className="section-title">Beneficiary Bank Details</h3>
                <div className="form-group">
                  <label>Bank Name</label>
                  <input
                    type="text"
                    value={form.beneficiary.bankName}
                    onChange={(e) => updateBeneficiary({ bankName: e.target.value })}
                    placeholder="Bank of China"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group flex-1">
                    <label>Account Number</label>
                    <input
                      type="text"
                      value={form.beneficiary.accountNumber}
                      onChange={(e) => updateBeneficiary({ accountNumber: e.target.value })}
                      placeholder="Account number"
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label>{form.segment === 'international' ? 'SWIFT Code' : 'IFSC Code'}</label>
                    <input
                      type="text"
                      value={form.segment === 'international' ? form.beneficiary.swiftCode || '' : form.beneficiary.ifscCode || ''}
                      onChange={(e) =>
                        form.segment === 'international'
                          ? updateBeneficiary({ swiftCode: e.target.value })
                          : updateBeneficiary({ ifscCode: e.target.value })
                      }
                      placeholder={form.segment === 'international' ? 'BKCHCNBJ' : 'SBIN0001234'}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="form-actions">
              <div />
              <button className="btn-next" disabled={!canProceedStep1} onClick={() => setStep(2)}>
                Continue <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 2 ───────────────────────────────────────────── */}
        {step === 2 && (
          <div className="form-card">
            <h3 className="section-title">
              {form.segment === 'international' ? 'International Payment Methods' : 'Domestic Payment Methods'}
            </h3>
            <div className="method-grid">
              {getMethodsForSegment(form.segment).map((method: MethodConfig) => (
                <button
                  key={method.id}
                  className={`method-card ${form.method === method.id ? 'selected' : ''}`}
                  onClick={() => updateForm({ method: method.id })}
                >
                  <div className="method-top">
                    <span className="method-icon">{method.icon}</span>
                    <div className="method-info">
                      <span className="method-name">{method.label}</span>
                      <span className="method-desc">{method.description}</span>
                    </div>
                  </div>
                  <div className="method-meta">
                    <span className="method-fee">Fee: {method.feeRange}</span>
                    <span className="method-speed">{method.speed}</span>
                  </div>
                  {form.method === method.id && (
                    <div className="method-check"><Check size={16} /></div>
                  )}
                </button>
              ))}
            </div>

            <div className="form-actions">
              <button className="btn-back" onClick={() => setStep(1)}>
                <ArrowLeft size={16} /> Back
              </button>
              <button className="btn-next" disabled={!canProceedStep2} onClick={() => setStep(3)}>
                Continue <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 3 ───────────────────────────────────────────── */}
        {step === 3 && (
          <div className="form-card">
            <h3 className="section-title">Review Payment</h3>

            <div className="review-section">
              <div className="review-row">
                <span className="review-label">Supplier</span>
                <span className="review-value">{form.supplierName}</span>
              </div>
              <div className="review-row">
                <span className="review-label">Payment Type</span>
                <span className="review-value">{form.segment === 'international' ? 'International' : 'Local (Domestic)'}</span>
              </div>
              <div className="review-row">
                <span className="review-label">Amount</span>
                <span className="review-value review-amount">{formatPaymentCurrency(amount, form.currency)}</span>
              </div>
              {form.currency !== 'INR' && (
                <>
                  <div className="review-row">
                    <span className="review-label">FX Rate</span>
                    <span className="review-value">1 {form.currency} = {fxRate.toFixed(2)} INR</span>
                  </div>
                  <div className="review-row">
                    <span className="review-label">INR Equivalent</span>
                    <span className="review-value">{formatPaymentCurrency(amountInINR, 'INR')}</span>
                  </div>
                </>
              )}
              <div className="review-row">
                <span className="review-label">Method</span>
                <span className="review-value">{selectedMethod?.icon} {selectedMethod?.label}</span>
              </div>
              <div className="review-row">
                <span className="review-label">Fees</span>
                <span className="review-value">{formatPaymentCurrency(fees, 'INR')}</span>
              </div>
              <div className="review-row total">
                <span className="review-label">Total Debit</span>
                <span className="review-value review-amount">{formatPaymentCurrency(totalDebit, 'INR')}</span>
              </div>
              <div className="review-row">
                <span className="review-label">Est. Arrival</span>
                <span className="review-value">{estimatedArrival}</span>
              </div>
              <div className="review-row">
                <span className="review-label">Purpose</span>
                <span className="review-value">{form.purpose}</span>
              </div>
              {form.orderId && (
                <div className="review-row">
                  <span className="review-label">Order</span>
                  <span className="review-value">{form.orderId}</span>
                </div>
              )}
            </div>

            <div className="compliance-notice">
              {form.segment === 'international' ? COMPLIANCE_NOTICES.international : COMPLIANCE_NOTICES.local}
            </div>

            <div className="form-actions">
              <button className="btn-back" onClick={() => setStep(2)}>
                <ArrowLeft size={16} /> Back
              </button>
              <button className="btn-confirm" onClick={handleConfirm}>
                <Send size={16} /> Confirm Payment
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .page-container { max-width: 900px; padding: 20px; }
        .content-header { margin-bottom: 24px; }
        .content-header h1 { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin: 0 0 6px; }
        .content-header p { font-size: 0.9rem; color: var(--text-secondary); margin: 0; }

        /* Step Indicator — Desktop */
        .step-indicator { display: flex; align-items: center; margin-bottom: 28px; gap: 0; }
        .step-item { display: flex; align-items: center; gap: 8px; }
        .step-number {
          width: 28px; height: 28px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.78rem; font-weight: 600;
          background: var(--bg-tertiary); color: var(--text-muted);
          transition: all 0.2s;
        }
        .step-item.active .step-number { background: var(--accent-primary, #f97316); color: white; }
        .step-item.done .step-number { background: #10b981; color: white; }
        .step-label { font-size: 0.82rem; color: var(--text-muted); font-weight: 500; }
        .step-item.active .step-label { color: var(--text-primary); font-weight: 600; }
        .step-line { width: 60px; height: 2px; background: var(--border-color); margin: 0 8px; }
        .step-item.done + .step-item .step-line,
        .step-item.active .step-line { background: var(--accent-primary, #f97316); }

        /* Step Indicator — Mobile */
        .step-mobile { margin-bottom: 20px; }
        .step-mobile-bar { height: 4px; background: var(--bg-tertiary); border-radius: 2px; overflow: hidden; margin-bottom: 8px; }
        .step-mobile-fill { height: 100%; background: linear-gradient(90deg, #f97316, #ea580c); border-radius: 2px; transition: width 0.3s; }
        .step-mobile-text { font-size: 0.82rem; color: var(--text-secondary); font-weight: 500; }

        /* Form Card */
        .form-card {
          background: var(--card-bg, var(--bg-secondary, #fff));
          border-radius: 16px;
          padding: 28px;
          border: 1px solid var(--border-color);
        }

        /* Segment Toggle */
        .segment-toggle {
          display: flex; gap: 4px;
          background: var(--bg-tertiary); border-radius: 12px; padding: 4px;
          margin-bottom: 24px;
        }
        .segment-btn {
          flex: 1; padding: 12px 16px; border-radius: 10px; border: none;
          font-size: 0.88rem; font-weight: 500; cursor: pointer;
          background: none; color: var(--text-secondary);
          transition: all 0.15s;
        }
        .segment-btn.active {
          background: var(--bg-secondary, #fff); color: var(--text-primary);
          box-shadow: 0 1px 3px rgba(0,0,0,0.08); font-weight: 600;
        }

        /* Form Fields */
        .form-group { margin-bottom: 18px; }
        .form-group label { display: block; font-size: 0.82rem; color: var(--text-secondary); font-weight: 500; margin-bottom: 6px; }
        .form-group input, .form-group select {
          width: 100%; padding: 12px 14px; border: 2px solid var(--border-color);
          border-radius: 10px; font-size: 0.9rem; color: var(--text-primary);
          background: var(--bg-secondary, #fff); transition: border-color 0.15s;
        }
        .form-group input:focus, .form-group select:focus {
          outline: none; border-color: var(--accent-primary, #f97316);
        }
        .optional { color: var(--text-muted); font-weight: 400; }

        .form-row { display: flex; gap: 16px; }
        .flex-1 { flex: 1; }
        .flex-2 { flex: 2; }

        .section-title { font-size: 1rem; color: var(--text-primary); margin: 24px 0 16px; font-weight: 600; }

        .fx-preview {
          background: var(--bg-tertiary); padding: 12px 16px; border-radius: 10px;
          font-size: 0.9rem; color: var(--text-primary); font-weight: 600;
          margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center;
        }
        .fx-rate { font-size: 0.78rem; color: var(--text-muted); font-weight: 400; }

        /* Method Grid */
        .method-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 24px; }
        .method-card {
          background: var(--bg-secondary, #fff); border: 2px solid var(--border-color);
          border-radius: 14px; padding: 18px; text-align: left; cursor: pointer;
          transition: all 0.2s; position: relative;
        }
        .method-card:hover { border-color: var(--accent-primary, #f97316); transform: translateY(-2px); }
        .method-card.selected { border-color: var(--accent-primary, #f97316); background: rgba(249,115,22,0.04); }
        .method-top { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 12px; }
        .method-icon { font-size: 1.5rem; }
        .method-info { display: flex; flex-direction: column; }
        .method-name { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); }
        .method-desc { font-size: 0.78rem; color: var(--text-secondary); margin-top: 2px; }
        .method-meta { display: flex; gap: 16px; font-size: 0.78rem; }
        .method-fee { color: var(--accent-primary, #f97316); font-weight: 600; }
        .method-speed { color: var(--text-muted); }
        .method-check {
          position: absolute; top: 12px; right: 12px;
          width: 24px; height: 24px; border-radius: 50%;
          background: var(--accent-primary, #f97316); color: white;
          display: flex; align-items: center; justify-content: center;
        }

        /* Review */
        .review-section {
          border: 1px solid var(--border-color); border-radius: 12px;
          overflow: hidden; margin-bottom: 20px;
        }
        .review-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 18px; border-bottom: 1px solid var(--border-color);
        }
        .review-row:last-child { border-bottom: none; }
        .review-row.total { background: var(--bg-tertiary); }
        .review-label { font-size: 0.85rem; color: var(--text-secondary); }
        .review-value { font-size: 0.88rem; color: var(--text-primary); font-weight: 500; text-align: right; }
        .review-amount { font-size: 1rem; font-weight: 700; color: var(--accent-primary, #f97316); }

        .compliance-notice {
          background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px;
          padding: 14px 16px; font-size: 0.8rem; color: #92400e;
          line-height: 1.5; margin-bottom: 24px;
        }

        /* Actions */
        .form-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 24px; }
        .btn-back, .btn-next, .btn-confirm {
          display: flex; align-items: center; gap: 6px;
          padding: 12px 24px; border-radius: 10px; font-size: 0.9rem; font-weight: 600;
          cursor: pointer; border: none; transition: all 0.15s;
        }
        .btn-back { background: var(--bg-tertiary); color: var(--text-primary); }
        .btn-next { background: linear-gradient(135deg, #f97316, #ea580c); color: white; }
        .btn-next:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-confirm { background: linear-gradient(135deg, #10b981, #059669); color: white; }

        @media (max-width: 768px) {
          .page-container { padding: 14px; padding-bottom: 100px; }
          .content-header h1 { font-size: 1.25rem; }
          .form-card { padding: 20px; border-radius: 14px; }
          .form-row { flex-direction: column; gap: 0; }
          .method-grid { grid-template-columns: 1fr; }
          .method-card { padding: 16px; }
          .method-top { flex-direction: row; align-items: center; }
          .form-actions { flex-direction: column-reverse; gap: 10px; }
          .btn-back, .btn-next, .btn-confirm { width: 100%; justify-content: center; padding: 14px; }
          .fx-preview { flex-direction: column; gap: 4px; text-align: center; }
          .review-row { padding: 12px 14px; }
          .segment-btn { padding: 12px 10px; font-size: 0.84rem; }
        }
        @media (max-width: 480px) {
          .page-container { padding: 12px; padding-bottom: 100px; }
          .form-card { padding: 16px; }
          .method-desc { display: none; }
          .review-label { font-size: 0.78rem; }
          .review-value { font-size: 0.82rem; }
          .compliance-notice { font-size: 0.75rem; padding: 12px; }
        }
      `}</style>
    </AppLayout>
  );
}
