'use client';

import { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { useMobile } from '@/hooks/useMobile';
import { useFeedbackTrigger } from '@/hooks/useFeedbackTrigger';
import { useTour } from '@/hooks/useTour';
import { submitRequirementTourSteps, mobileSubmitRequirementTourSteps } from '@/lib/tourSteps';
import TourFAB from '@/components/walkthrough/TourFAB';
import {
  createRequirement,
  addRequirementToStorage,
  Requirement,
  STATUS_CONFIG,
  UrgencyLevel,
} from '@/lib/requirements';
import { Package, ClipboardList, Search, CheckCircle, FolderOpen, Clock, Zap, Flame, Lightbulb, FileText, Download, BarChart3 } from 'lucide-react';

type TabType = 'single' | 'bulk';

interface SingleProductForm {
  productName: string;
  hsnCode: string;
  category: string;
  quantity: string;
  unit: string;
  targetPrice: string;
  currency: string;
  specifications: string;
  preferredCountries: string[];
  deliveryDeadline: string;
}


interface UploadedProduct {
  id: string;
  name: string;
  hsnCode: string;
  quantity: string;
  unit: string;
}

const categories = [
  'Electronics',
  'Textiles & Apparel',
  'Food & Beverages',
  'Machinery & Equipment',
  'Chemicals',
  'Automotive Parts',
  'Building Materials',
  'Medical & Healthcare',
  'Consumer Goods',
  'Raw Materials',
  'Other'
];

const countries = [
  'China',
  'India',
  'Vietnam',
  'Bangladesh',
  'Thailand',
  'Indonesia',
  'Taiwan',
  'South Korea',
  'Japan',
  'Malaysia',
  'Turkey',
  'Germany',
  'USA',
  'Any'
];

const units = [
  { value: 'pcs', label: 'Pieces (pcs)' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'mt', label: 'Metric Tons (MT)' },
  { value: 'lbs', label: 'Pounds (lbs)' },
  { value: 'meters', label: 'Meters (m)' },
  { value: 'sq_meters', label: 'Square Meters (m²)' },
  { value: 'liters', label: 'Liters (L)' },
  { value: 'containers_20', label: 'Containers (20ft)' },
  { value: 'containers_40', label: 'Containers (40ft)' },
];

function SubmitRequirementContent() {
  const router = useRouter();
  const { isMobile } = useMobile();
  const tourSteps = isMobile ? mobileSubmitRequirementTourSteps : submitRequirementTourSteps;
  const { startTour, isActive: tourActive } = useTour({ tourId: 'submit-requirement', steps: tourSteps });
  const { triggerFeedback, promptElement } = useFeedbackTrigger();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<TabType>('single');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedRequirement, setSubmittedRequirement] = useState<Requirement | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  // Single Product Form State
  const [singleForm, setSingleForm] = useState<SingleProductForm>({
    productName: '',
    hsnCode: '',
    category: '',
    quantity: '',
    unit: 'pcs',
    targetPrice: '',
    currency: 'USD',
    specifications: '',
    preferredCountries: [],
    deliveryDeadline: ''
  });

  // Urgency State (shared between tabs)
  const [urgency, setUrgency] = useState<UrgencyLevel>('standard');

  // Bulk Upload State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedProducts, setParsedProducts] = useState<UploadedProduct[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);


  // Handlers
  const handleSingleFormChange = (field: keyof SingleProductForm, value: string | string[]) => {
    setSingleForm(prev => ({ ...prev, [field]: value }));
  };


  const handleCountryToggle = (country: string) => {
    setSingleForm(prev => ({
      ...prev,
      preferredCountries: prev.preferredCountries.includes(country)
        ? prev.preferredCountries.filter(c => c !== country)
        : [...prev.preferredCountries, country]
    }));
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.xlsx'))) {
      setUploadedFile(file);
      // Simulate parsing
      simulateParsing(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      simulateParsing(file);
    }
  };

  const simulateParsing = (file: File) => {
    // Simulate parsing CSV/Excel - in real app, use papaparse or xlsx library
    setTimeout(() => {
      setParsedProducts([
        { id: '1', name: 'LED Bulbs 9W', hsnCode: '8539', quantity: '5000', unit: 'pcs' },
        { id: '2', name: 'Mobile Phone Chargers', hsnCode: '8504', quantity: '2000', unit: 'pcs' },
        { id: '3', name: 'Cotton Fabric Rolls', hsnCode: '5208', quantity: '500', unit: 'meters' },
      ]);
    }, 500);
  };

  const handleSubmitSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create requirement using the library
    const requirement = createRequirement({
      type: 'single',
      products: [{
        id: `PROD-${Date.now()}`,
        name: singleForm.productName,
        hsnCode: singleForm.hsnCode,
        quantity: singleForm.quantity,
        unit: singleForm.unit,
        specifications: singleForm.specifications,
        targetPrice: singleForm.targetPrice,
        currency: singleForm.currency,
      }],
      urgency,
      preferredCountries: singleForm.preferredCountries,
    });

    // Store in localStorage
    addRequirementToStorage(requirement);

    setIsSubmitting(false);
    setSubmittedRequirement(requirement);
    setRedirectCountdown(5);
    setSubmitted(true);
    triggerFeedback('submit-requirement');
  };

  const handleSubmitBulk = async () => {
    if (parsedProducts.length === 0) return;
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create requirement using the library
    const requirement = createRequirement({
      type: 'bulk',
      products: parsedProducts.map(p => ({
        id: p.id,
        name: p.name,
        hsnCode: p.hsnCode,
        quantity: p.quantity,
        unit: p.unit,
      })),
      urgency,
      preferredCountries: [],
    });

    // Store in localStorage
    addRequirementToStorage(requirement);

    setIsSubmitting(false);
    setSubmittedRequirement(requirement);
    setRedirectCountdown(5);
    setSubmitted(true);
    triggerFeedback('submit-requirement');
  };


  const handleReset = useCallback(() => {
    setSubmitted(false);
    setSubmittedRequirement(null);
    setRedirectCountdown(5);
    setSingleForm({
      productName: '',
      hsnCode: '',
      category: '',
      quantity: '',
      unit: 'pcs',
      targetPrice: '',
      currency: 'USD',
      specifications: '',
      preferredCountries: [],
      deliveryDeadline: ''
    });
    setUrgency('standard');
    setUploadedFile(null);
    setParsedProducts([]);
  }, []);

  // Auto-redirect countdown
  useEffect(() => {
    if (!submitted || redirectCountdown <= 0) return;

    const timer = setTimeout(() => {
      setRedirectCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [submitted, redirectCountdown]);

  // Redirect when countdown reaches 0
  useEffect(() => {
    if (submitted && redirectCountdown === 0) {
      router.push('/my-requirements');
    }
  }, [submitted, redirectCountdown, router]);

  // Success Screen with Timeline
  if (submitted && submittedRequirement) {
    const statusConfig = STATUS_CONFIG[submittedRequirement.status];
    const isBulk = submittedRequirement.type === 'bulk';
    const productCount = submittedRequirement.products.length;

    return (
      <AppLayout>
        <div className="success-container">
          <div className="success-content">
            {/* Success Header */}
            <div className="success-header">
              <div className="success-check">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1>Requirement Shared!</h1>
              <p className="req-id">
                <span className="label">Reference:</span>
                <span className="id">{submittedRequirement.id}</span>
              </p>
            </div>

            {/* Product Summary */}
            <div className="product-summary">
              <div className="summary-icon">{isBulk ? <Package size={20} /> : <ClipboardList size={20} />}</div>
              <div className="summary-text">
                <span className="product-name">{submittedRequirement.title}</span>
                {productCount > 1 && (
                  <span className="product-count">{productCount} products</span>
                )}
              </div>
            </div>

            {/* Current Status */}
            <div className="current-status" style={{ borderColor: statusConfig.color }}>
              <div className="status-indicator">
                <div className="pulse-dot" style={{ backgroundColor: statusConfig.color }}></div>
                <span style={{ color: statusConfig.color }}>{statusConfig.label}</span>
              </div>
              <p className="status-desc">{statusConfig.description}</p>
            </div>

            {/* Visual Timeline */}
            <div className="timeline-section">
              <h3>What happens next?</h3>
              <div className="timeline">
                <div className="timeline-item active">
                  <div className="timeline-dot active">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="timeline-content">
                    <span className="timeline-time">Now</span>
                    <span className="timeline-label">Submitted</span>
                  </div>
                </div>
                <div className="timeline-connector"></div>
                <div className="timeline-item upcoming">
                  <div className="timeline-dot"><Search size={16} /></div>
                  <div className="timeline-content">
                    <span className="timeline-time">~24 hours</span>
                    <span className="timeline-label">Supplier Matching</span>
                  </div>
                </div>
                <div className="timeline-connector"></div>
                <div className="timeline-item upcoming">
                  <div className="timeline-dot"><ClipboardList size={16} /></div>
                  <div className="timeline-content">
                    <span className="timeline-time">~48 hours</span>
                    <span className="timeline-label">Quotes Received</span>
                  </div>
                </div>
                <div className="timeline-connector"></div>
                <div className="timeline-item upcoming">
                  <div className="timeline-dot"><CheckCircle size={16} /></div>
                  <div className="timeline-content">
                    <span className="timeline-time">~72 hours</span>
                    <span className="timeline-label">Deal Finalized</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Estimated Time */}
            <div className="estimated-box">
              <div className="estimated-icon">⏱️</div>
              <div className="estimated-content">
                <span className="estimated-label">Estimated time to first quote</span>
                <span className="estimated-value">{submittedRequirement.estimatedTime.displayText}</span>
              </div>
            </div>

            {/* Matched Suppliers Preview */}
            <div className="matches-preview">
              <div className="matches-count">
                <span className="count">{submittedRequirement.matchCount}</span>
                <span className="text">suppliers already matched</span>
              </div>
              <div className="matches-note">
                You&apos;ll be notified when quotes arrive
              </div>
            </div>

            {/* Actions */}
            <div className="success-actions">
              <button
                className="btn-primary"
                onClick={() => router.push('/my-requirements')}
              >
                View My Requirements →
              </button>
              <button className="btn-secondary" onClick={handleReset}>
                Share Another Requirement
              </button>
            </div>

            {/* Redirect Notice */}
            <div className="redirect-notice">
              <span>Redirecting to My Requirements in </span>
              <span className="countdown">{redirectCountdown}s</span>
              <button
                className="cancel-redirect"
                onClick={() => setRedirectCountdown(-1)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        <style jsx>{`
          .success-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 80vh;
            padding: 40px 20px;
          }

          .success-content {
            width: 100%;
            max-width: 520px;
          }

          .success-header {
            text-align: center;
            margin-bottom: 24px;
          }

          .success-check {
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, #10B981 0%, #059669 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
            animation: scaleIn 0.4s ease-out;
          }

          .success-check svg {
            width: 32px;
            height: 32px;
            color: white;
          }

          @keyframes scaleIn {
            0% { transform: scale(0); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }

          .success-header h1 {
            color: var(--text-primary);
            font-size: 1.6rem;
            margin: 0 0 8px;
          }

          .req-id {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }

          .req-id .label {
            color: var(--text-muted);
            font-size: 0.9rem;
          }

          .req-id .id {
            font-family: monospace;
            background: var(--bg-tertiary);
            padding: 4px 10px;
            border-radius: 4px;
            color: var(--text-primary);
            font-size: 0.85rem;
          }

          .product-summary {
            display: flex;
            align-items: center;
            gap: 12px;
            background: var(--card-bg);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 16px;
          }

          .summary-icon {
            font-size: 1.8rem;
          }

          .summary-text {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .product-name {
            color: var(--text-primary);
            font-weight: 600;
          }

          .product-count {
            color: var(--text-muted);
            font-size: 0.85rem;
          }

          .current-status {
            background: var(--card-bg);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 24px;
            border-left: 4px solid;
          }

          .status-indicator {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 6px;
          }

          .pulse-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            animation: pulse 1.5s ease-in-out infinite;
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.2); }
          }

          .status-indicator span {
            font-weight: 600;
            font-size: 0.95rem;
          }

          .status-desc {
            color: var(--text-secondary);
            font-size: 0.9rem;
            margin: 0;
          }

          .timeline-section {
            background: var(--card-bg);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 16px;
          }

          .timeline-section h3 {
            color: var(--text-primary);
            font-size: 0.95rem;
            margin: 0 0 16px;
          }

          .timeline {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
          }

          .timeline-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
            position: relative;
          }

          .timeline-dot {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--bg-tertiary);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.1rem;
            margin-bottom: 8px;
            border: 2px solid var(--border-color);
          }

          .timeline-dot.active {
            background: linear-gradient(135deg, #10B981 0%, #059669 100%);
            border: none;
          }

          .timeline-dot.active svg {
            width: 18px;
            height: 18px;
            color: white;
          }

          .timeline-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .timeline-time {
            color: var(--text-muted);
            font-size: 0.75rem;
          }

          .timeline-label {
            color: var(--text-secondary);
            font-size: 0.8rem;
            font-weight: 500;
          }

          .timeline-item.active .timeline-label {
            color: #10B981;
          }

          .timeline-connector {
            flex: 0.6;
            height: 2px;
            background: var(--border-color);
            margin-top: 20px;
          }

          .estimated-box {
            display: flex;
            align-items: center;
            gap: 12px;
            background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%);
            border: 1px solid #fed7aa;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 16px;
          }

          .estimated-icon {
            font-size: 1.5rem;
          }

          .estimated-content {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .estimated-label {
            color: #92400e;
            font-size: 0.85rem;
          }

          .estimated-value {
            color: #78350f;
            font-weight: 700;
            font-size: 1.1rem;
          }

          .matches-preview {
            background: var(--card-bg);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 24px;
            text-align: center;
          }

          .matches-count {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-bottom: 6px;
          }

          .matches-count .count {
            font-size: 1.5rem;
            font-weight: 700;
            color: #8B5CF6;
          }

          .matches-count .text {
            color: var(--text-primary);
            font-weight: 500;
          }

          .matches-note {
            color: var(--text-muted);
            font-size: 0.85rem;
          }

          .success-actions {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 16px;
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
            padding: 12px 24px;
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

          .redirect-notice {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            color: var(--text-muted);
            font-size: 0.85rem;
          }

          .countdown {
            color: var(--accent-primary);
            font-weight: 600;
          }

          .cancel-redirect {
            background: none;
            border: none;
            color: var(--text-muted);
            text-decoration: underline;
            cursor: pointer;
            font-size: 0.85rem;
            padding: 0;
            margin-left: 8px;
          }

          .cancel-redirect:hover {
            color: var(--text-secondary);
          }

          @media (max-width: 500px) {
            .timeline {
              flex-wrap: wrap;
              gap: 16px;
            }

            .timeline-connector {
              display: none;
            }

            .timeline-item {
              flex: 0 0 calc(50% - 8px);
            }
          }
        `}</style>
      </AppLayout>
    );
  }

  return (
    <AppLayout>      <div className="page-container">
        {/* Header */}
        <div id="req-header" className="content-header">
          <h1>Share Your Requirement</h1>
          <p>Tell us what you need and we&apos;ll find the best suppliers for you</p>        </div>

        {/* Tabs */}
        <div id="req-tabs" className="tabs-container">
          <button
            className={`tab ${activeTab === 'single' ? 'active' : ''}`}
            onClick={() => setActiveTab('single')}
          >
            <span className="tab-icon"><Search size={16} /></span>
            <span className="tab-label">Single Product</span>
          </button>
          <button
            className={`tab ${activeTab === 'bulk' ? 'active' : ''}`}
            onClick={() => setActiveTab('bulk')}
          >
            <span className="tab-icon"><FolderOpen size={16} /></span>
            <span className="tab-label">Bulk Upload</span>
          </button>
        </div>

        {/* Tab Content */}
        <div id="req-form" className="tab-content">
          {/* Single Product Tab */}
          {activeTab === 'single' && (
            <form onSubmit={handleSubmitSingle} className="form-container">
              <div className="form-main">
                <div className="form-card">
                  <h3>Product Details</h3>

                  <div className="form-group">
                    <label>Product Name *</label>
                    <input
                      type="text"
                      value={singleForm.productName}
                      onChange={(e) => handleSingleFormChange('productName', e.target.value)}
                      placeholder="e.g., LED Bulbs 9W, Cotton T-Shirts, Steel Pipes"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>HSN Code (Optional)</label>
                      <input
                        type="text"
                        value={singleForm.hsnCode}
                        onChange={(e) => handleSingleFormChange('hsnCode', e.target.value)}
                        placeholder="e.g., 8539, 6109"
                      />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <select
                        value={singleForm.category}
                        onChange={(e) => handleSingleFormChange('category', e.target.value)}
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Quantity *</label>
                      <input
                        type="number"
                        value={singleForm.quantity}
                        onChange={(e) => handleSingleFormChange('quantity', e.target.value)}
                        placeholder="Enter quantity"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Unit</label>
                      <select
                        value={singleForm.unit}
                        onChange={(e) => handleSingleFormChange('unit', e.target.value)}
                      >
                        {units.map(u => (
                          <option key={u.value} value={u.value}>{u.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Target Price (Optional)</label>
                      <div className="input-with-addon">
                        <select
                          value={singleForm.currency}
                          onChange={(e) => handleSingleFormChange('currency', e.target.value)}
                          className="currency-select"
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="INR">INR</option>
                          <option value="CNY">CNY</option>
                        </select>
                        <input
                          type="number"
                          value={singleForm.targetPrice}
                          onChange={(e) => handleSingleFormChange('targetPrice', e.target.value)}
                          placeholder="Price per unit"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Delivery Deadline</label>
                      <input
                        type="date"
                        value={singleForm.deliveryDeadline}
                        onChange={(e) => handleSingleFormChange('deliveryDeadline', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Preferred Countries</label>
                    <div className="country-chips">
                      {countries.map(country => (
                        <button
                          key={country}
                          type="button"
                          className={`chip ${singleForm.preferredCountries.includes(country) ? 'active' : ''}`}
                          onClick={() => handleCountryToggle(country)}
                        >
                          {country}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Specifications (Optional)</label>
                    <textarea
                      value={singleForm.specifications}
                      onChange={(e) => handleSingleFormChange('specifications', e.target.value)}
                      placeholder="Any specific requirements? Quality standards, certifications, packaging, etc."
                      rows={3}
                    />
                  </div>

                  {/* Urgency Selector */}
                  <div className="form-group">
                    <label>Urgency Level</label>
                    <div className="urgency-options">
                      <button
                        type="button"
                        className={`urgency-btn ${urgency === 'standard' ? 'active' : ''}`}
                        onClick={() => setUrgency('standard')}
                      >
                        <span className="urgency-icon"><Clock size={14} /></span>
                        <span className="urgency-label">Standard</span>
                        <span className="urgency-time">3-5 days</span>
                      </button>
                      <button
                        type="button"
                        className={`urgency-btn urgent ${urgency === 'urgent' ? 'active' : ''}`}
                        onClick={() => setUrgency('urgent')}
                      >
                        <span className="urgency-icon"><Zap size={14} /></span>
                        <span className="urgency-label">Urgent</span>
                        <span className="urgency-time">1-2 days</span>
                      </button>
                      <button
                        type="button"
                        className={`urgency-btn critical ${urgency === 'critical' ? 'active' : ''}`}
                        onClick={() => setUrgency('critical')}
                      >
                        <span className="urgency-icon"><Flame size={14} /></span>
                        <span className="urgency-label">Critical</span>
                        <span className="urgency-time">&lt;24 hours</span>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={isSubmitting || !singleForm.productName || !singleForm.quantity}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner"></span>
                        Finding Suppliers...
                      </>
                    ) : (
                      <>Find Suppliers →</>
                    )}
                  </button>
                </div>
              </div>

              <div className="form-sidebar">
                <div className="sidebar-card highlight">
                  <h4><Zap size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} /> Instant Matching</h4>
                  <p>Our AI finds the best suppliers in <strong>seconds</strong>, not days.</p>
                </div>
                <div className="sidebar-card">
                  <h4><Lightbulb size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} /> Tips</h4>
                  <ul>
                    <li>Be specific about specs</li>
                    <li>Add HSN code for better matches</li>
                    <li>Select preferred countries</li>
                  </ul>
                </div>
              </div>
            </form>
          )}

          {/* Bulk Upload Tab */}
          {activeTab === 'bulk' && (
            <div className="form-container">
              <div className="form-main">
                <div className="form-card">
                  <h3>Upload Product List</h3>
                  <p className="form-description">
                    Upload a CSV or Excel file with your product list. We&apos;ll find suppliers for each.
                  </p>

                  <div
                    className={`upload-zone ${isDragOver ? 'drag-over' : ''} ${uploadedFile ? 'has-file' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileSelect}
                      hidden
                    />
                    {uploadedFile ? (
                      <div className="file-info">
                        <span className="file-icon"><FileText size={14} /></span>
                        <span className="file-name">{uploadedFile.name}</span>
                        <button
                          type="button"
                          className="remove-file"
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadedFile(null);
                            setParsedProducts([]);
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="upload-icon"><FolderOpen size={20} /></span>
                        <p>Drag & drop your file here</p>
                        <p className="upload-hint">or click to browse</p>
                        <span className="file-types">Supports: .xlsx, .csv (max 5MB)</span>
                      </>
                    )}
                  </div>

                  <a href="#" className="download-template">
                    <Download size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Download template file
                  </a>

                  {parsedProducts.length > 0 && (
                    <div className="parsed-products">
                      <h4>Preview ({parsedProducts.length} products found)</h4>
                      <table className="preview-table">
                        <thead>
                          <tr>
                            <th>Product Name</th>
                            <th>HSN Code</th>
                            <th>Quantity</th>
                            <th>Unit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {parsedProducts.map(p => (
                            <tr key={p.id}>
                              <td>{p.name}</td>
                              <td>{p.hsnCode}</td>
                              <td>{p.quantity}</td>
                              <td>{p.unit}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Urgency Selector for Bulk */}
                      <div className="form-group">
                        <label>Urgency Level</label>
                        <div className="urgency-options">
                          <button
                            type="button"
                            className={`urgency-btn ${urgency === 'standard' ? 'active' : ''}`}
                            onClick={() => setUrgency('standard')}
                          >
                            <span className="urgency-icon"><Clock size={14} /></span>
                            <span className="urgency-label">Standard</span>
                            <span className="urgency-time">3-5 days</span>
                          </button>
                          <button
                            type="button"
                            className={`urgency-btn urgent ${urgency === 'urgent' ? 'active' : ''}`}
                            onClick={() => setUrgency('urgent')}
                          >
                            <span className="urgency-icon"><Zap size={14} /></span>
                            <span className="urgency-label">Urgent</span>
                            <span className="urgency-time">1-2 days</span>
                          </button>
                          <button
                            type="button"
                            className={`urgency-btn critical ${urgency === 'critical' ? 'active' : ''}`}
                            onClick={() => setUrgency('critical')}
                          >
                            <span className="urgency-icon"><Flame size={14} /></span>
                            <span className="urgency-label">Critical</span>
                            <span className="urgency-time">&lt;24 hours</span>
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn-submit"
                        onClick={handleSubmitBulk}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner"></span>
                            Processing...
                          </>
                        ) : (
                          <>Find Suppliers for All →</>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-sidebar">
                <div className="sidebar-card highlight">
                  <h4><BarChart3 size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} /> Bulk Processing</h4>
                  <p>Upload up to <strong>100 products</strong> at once. Save hours of manual work.</p>
                </div>
                <div className="sidebar-card">
                  <h4><ClipboardList size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} /> Template Format</h4>
                  <p>Required columns:</p>
                  <ul>
                    <li>Product Name</li>
                    <li>HSN Code</li>
                    <li>Quantity</li>
                    <li>Unit</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <style jsx>{`
        .page-container {
          max-width: 1100px;
        }

        .tabs-container {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          background: var(--card-bg);
          padding: 6px;
          border-radius: 12px;
          width: fit-content;
        }

        .tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: transparent;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .tab:hover {
          background: var(--bg-tertiary);
        }

        .tab.active {
          background: var(--accent-gradient);
          color: white;
        }

        .tab-icon {
          font-size: 1.1rem;
        }

        .tab-content {
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .form-container {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 24px;
        }

        .form-main {
          min-width: 0;
        }

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

        .input-with-addon {
          display: flex;
        }

        .currency-select {
          width: 80px !important;
          border-radius: 8px 0 0 8px !important;
          border-right: none !important;
        }

        .input-with-addon input {
          border-radius: 0 8px 8px 0 !important;
        }

        .country-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .urgency-options {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .urgency-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 16px 12px;
          background: var(--bg-tertiary);
          border: 2px solid var(--border-color);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .urgency-btn:hover {
          border-color: var(--accent-primary);
        }

        .urgency-btn.active {
          border-color: var(--accent-primary);
          background: rgba(249, 115, 22, 0.1);
        }

        .urgency-btn.urgent.active {
          border-color: #F59E0B;
          background: rgba(245, 158, 11, 0.1);
        }

        .urgency-btn.critical.active {
          border-color: #EF4444;
          background: rgba(239, 68, 68, 0.1);
        }

        .urgency-icon {
          font-size: 1.5rem;
        }

        .urgency-label {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.9rem;
        }

        .urgency-time {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .urgency-btn.active .urgency-label {
          color: var(--accent-primary);
        }

        .urgency-btn.urgent.active .urgency-label {
          color: #F59E0B;
        }

        .urgency-btn.critical.active .urgency-label {
          color: #EF4444;
        }

        .chip {
          padding: 6px 14px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.85rem;
          color: var(--text-secondary);
          transition: all 0.2s;
        }

        .chip:hover {
          border-color: var(--accent-primary);
        }

        .chip.active {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          color: white;
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

        .form-sidebar {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .sidebar-card {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 18px;
        }

        .sidebar-card.highlight {
          background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%);
          border: 1px solid #fed7aa;
        }

        .sidebar-card h4 {
          color: var(--text-primary);
          margin-bottom: 10px;
          font-size: 0.95rem;
        }

        .sidebar-card p {
          color: var(--text-secondary);
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
          color: var(--text-secondary);
          font-size: 0.85rem;
          margin-bottom: 6px;
        }

        /* Upload Zone */
        .upload-zone {
          border: 2px dashed var(--border-color);
          border-radius: 12px;
          padding: 40px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 16px;
        }

        .upload-zone:hover,
        .upload-zone.drag-over {
          border-color: var(--accent-primary);
          background: rgba(249, 115, 22, 0.05);
        }

        .upload-zone.has-file {
          border-style: solid;
          background: var(--bg-tertiary);
          padding: 20px;
        }

        .upload-icon {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 12px;
        }

        .upload-zone p {
          margin: 0;
          color: var(--text-primary);
          font-weight: 500;
        }

        .upload-hint {
          color: var(--text-secondary) !important;
          font-weight: 400 !important;
          font-size: 0.9rem;
          margin-top: 4px !important;
        }

        .file-types {
          display: block;
          margin-top: 12px;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .file-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .file-icon {
          font-size: 1.5rem;
        }

        .file-name {
          flex: 1;
          text-align: left;
          color: var(--text-primary);
          font-weight: 500;
        }

        .remove-file {
          background: var(--bg-tertiary);
          border: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .remove-file:hover {
          background: #ef4444;
          color: white;
        }

        .download-template {
          color: var(--accent-primary);
          text-decoration: none;
          font-size: 0.9rem;
          display: inline-block;
          margin-bottom: 24px;
        }

        .download-template:hover {
          text-decoration: underline;
        }

        .parsed-products h4 {
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .preview-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }

        .preview-table th,
        .preview-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }

        .preview-table th {
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 0.85rem;
        }

        .preview-table td {
          color: var(--text-primary);
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .form-container {
            grid-template-columns: 1fr;
          }
          .form-row {
            grid-template-columns: 1fr;
          }
          .tabs-container {
            width: 100%;
            overflow-x: auto;
          }
          .tab-label {
            display: none;
          }
          .tab {
            padding: 12px 16px;
          }
        }
      `}</style>
      {!tourActive && <TourFAB onStart={startTour} />}
      {promptElement}
    </AppLayout>
  );
}

export default function SubmitRequirementPage() {
  return (
    <Suspense fallback={null}>
      <SubmitRequirementContent />
    </Suspense>
  );
}
