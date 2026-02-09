'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  InternationalBookingData,
  INITIAL_INTERNATIONAL,
  BookingQuote,
  BookingRecord,
} from '@/types/booking';
import {
  PORTS,
  CONTAINER_TYPES,
  INCOTERMS,
  generateInternationalQuotes,
  formatCurrency,
  getPortLabel,
} from '@/lib/bookingConstants';
import { bookingStorage } from '@/lib/bookingStorage';
import QuoteCard from './QuoteCard';
import BookingSuccess from './BookingSuccess';
import { ArrowLeft, ArrowRight, Ship, Plane, Package, Loader2 } from 'lucide-react';

interface InternationalBookingProps {
  onBack: () => void;
}

const STEPS = ['Route & Mode', 'Cargo Details', 'Compare Quotes', 'Confirm & Book'];

export default function InternationalBooking({ onBack }: InternationalBookingProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<InternationalBookingData>(INITIAL_INTERNATIONAL);
  const [quotes, setQuotes] = useState<BookingQuote[]>([]);
  const [sortBy, setSortBy] = useState<'price' | 'transit' | 'rating'>('price');
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [savedBooking, setSavedBooking] = useState<BookingRecord | null>(null);

  // Port search state
  const [originSearch, setOriginSearch] = useState('');
  const [destSearch, setDestSearch] = useState('');
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const originRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  const updateField = useCallback(<K extends keyof InternationalBookingData>(
    key: K,
    value: InternationalBookingData[K]
  ) => {
    setForm(prev => ({ ...prev, [key]: value }));
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (originRef.current && !originRef.current.contains(e.target as Node)) setShowOriginDropdown(false);
      if (destRef.current && !destRef.current.contains(e.target as Node)) setShowDestDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Filter ports for sea/air
  const availablePorts = PORTS.filter(p =>
    form.freightMode === 'air' ? (p.type === 'air' || p.type === 'both') : true
  );

  const filteredOriginPorts = availablePorts.filter(p =>
    p.name.toLowerCase().includes(originSearch.toLowerCase()) ||
    p.code.toLowerCase().includes(originSearch.toLowerCase())
  );
  const filteredDestPorts = availablePorts.filter(p =>
    p.name.toLowerCase().includes(destSearch.toLowerCase()) ||
    p.code.toLowerCase().includes(destSearch.toLowerCase())
  );

  // Step validation
  const canGoNext = () => {
    if (step === 0) return form.originPort && form.destinationPort && form.shippingDate;
    if (step === 1) return form.commodity && form.weight;
    if (step === 2) return form.selectedQuoteId;
    return true;
  };

  const handleNext = () => {
    if (step === 1) {
      // Generate quotes when moving to step 3
      setLoading(true);
      setTimeout(() => {
        const generated = generateInternationalQuotes(
          form.freightMode,
          form.originPort,
          form.destinationPort,
          form.containerType,
          form.containerQty,
          parseFloat(form.weight) || 100,
        );
        setQuotes(generated);
        setLoading(false);
        setStep(2);
      }, 1500);
      return;
    }
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBook = () => {
    const selectedQuote = quotes.find(q => q.id === form.selectedQuoteId);
    if (!selectedQuote) return;

    setBooking(true);
    setTimeout(() => {
      const record = bookingStorage.save('international', form, selectedQuote);
      setSavedBooking(record);
      setBooking(false);
    }, 2000);
  };

  const sortedQuotes = [...quotes].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'transit') return a.transitDays - b.transitDays;
    return b.rating - a.rating;
  });

  // Success screen
  if (savedBooking) {
    return (
      <BookingSuccess
        booking={savedBooking}
        onViewBookings={onBack}
        onNewBooking={() => {
          setForm(INITIAL_INTERNATIONAL);
          setStep(0);
          setQuotes([]);
          setSavedBooking(null);
        }}
        onTrackShipment={() => {
          window.location.href = '/track-shipment';
        }}
      />
    );
  }

  return (
    <div className="intl-booking">
      {/* Progress bar */}
      <div className="progress-bar">
        {STEPS.map((s, i) => (
          <div key={i} className={`progress-step ${i <= step ? 'active' : ''} ${i < step ? 'completed' : ''}`}>
            <div className="step-dot">{i < step ? '✓' : i + 1}</div>
            <span className="step-label">{s}</span>
          </div>
        ))}
      </div>

      {/* Step 1: Route & Mode */}
      {step === 0 && (
        <div className="form-section">
          <h3 className="section-heading">Freight Mode</h3>
          <div className="mode-grid">
            {[
              { id: 'fcl' as const, name: 'FCL', desc: 'Full Container Load', icon: <Ship size={20} /> },
              { id: 'lcl' as const, name: 'LCL', desc: 'Less than Container', icon: <Package size={20} /> },
              { id: 'air' as const, name: 'Air Freight', desc: '3–7 days', icon: <Plane size={20} /> },
            ].map(mode => (
              <button
                key={mode.id}
                className={`mode-btn ${form.freightMode === mode.id ? 'active' : ''}`}
                onClick={() => updateField('freightMode', mode.id)}
              >
                {mode.icon}
                <span className="mode-name">{mode.name}</span>
                <span className="mode-desc">{mode.desc}</span>
              </button>
            ))}
          </div>

          <div className="form-row">
            <div className="form-group" ref={originRef}>
              <label>Origin Port *</label>
              <input
                type="text"
                className="input"
                placeholder="Search port..."
                value={showOriginDropdown ? originSearch : (form.originPort ? getPortLabel(form.originPort) : '')}
                onChange={(e) => { setOriginSearch(e.target.value); setShowOriginDropdown(true); }}
                onFocus={() => { setShowOriginDropdown(true); setOriginSearch(''); }}
              />
              {showOriginDropdown && (
                <div className="dropdown">
                  {filteredOriginPorts.map(p => (
                    <div
                      key={p.code}
                      className={`dropdown-item ${form.originPort === p.code ? 'selected' : ''}`}
                      onClick={() => { updateField('originPort', p.code); setShowOriginDropdown(false); }}
                    >
                      {p.name} ({p.code}) — {p.country}
                    </div>
                  ))}
                  {filteredOriginPorts.length === 0 && <div className="dropdown-empty">No ports found</div>}
                </div>
              )}
            </div>

            <div className="form-group" ref={destRef}>
              <label>Destination Port *</label>
              <input
                type="text"
                className="input"
                placeholder="Search port..."
                value={showDestDropdown ? destSearch : (form.destinationPort ? getPortLabel(form.destinationPort) : '')}
                onChange={(e) => { setDestSearch(e.target.value); setShowDestDropdown(true); }}
                onFocus={() => { setShowDestDropdown(true); setDestSearch(''); }}
              />
              {showDestDropdown && (
                <div className="dropdown">
                  {filteredDestPorts.map(p => (
                    <div
                      key={p.code}
                      className={`dropdown-item ${form.destinationPort === p.code ? 'selected' : ''}`}
                      onClick={() => { updateField('destinationPort', p.code); setShowDestDropdown(false); }}
                    >
                      {p.name} ({p.code}) — {p.country}
                    </div>
                  ))}
                  {filteredDestPorts.length === 0 && <div className="dropdown-empty">No ports found</div>}
                </div>
              )}
            </div>
          </div>

          {form.freightMode === 'fcl' && (
            <div className="form-row">
              <div className="form-group">
                <label>Container Type</label>
                <select
                  className="input"
                  value={form.containerType}
                  onChange={(e) => updateField('containerType', e.target.value as any)}
                >
                  {CONTAINER_TYPES.map(c => (
                    <option key={c.id} value={c.id}>{c.name} — {c.capacity}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  className="input"
                  min={1}
                  max={50}
                  value={form.containerQty}
                  onChange={(e) => updateField('containerQty', parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label>Preferred Shipping Date *</label>
              <input
                type="date"
                className="input"
                value={form.shippingDate}
                onChange={(e) => updateField('shippingDate', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Cargo Details */}
      {step === 1 && (
        <div className="form-section">
          <h3 className="section-heading">Cargo Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Commodity Description *</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Electronics Components"
                value={form.commodity}
                onChange={(e) => updateField('commodity', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>HS Code</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. 8542.31"
                value={form.hsCode}
                onChange={(e) => updateField('hsCode', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Total Weight (kg) *</label>
              <input
                type="number"
                className="input"
                placeholder="e.g. 5000"
                value={form.weight}
                onChange={(e) => updateField('weight', e.target.value)}
              />
            </div>
            {form.freightMode === 'lcl' && (
              <div className="form-group">
                <label>Total Volume (CBM)</label>
                <input
                  type="number"
                  className="input"
                  placeholder="e.g. 12"
                  value={form.volume}
                  onChange={(e) => updateField('volume', e.target.value)}
                />
              </div>
            )}
            <div className="form-group">
              <label>Number of Packages</label>
              <input
                type="number"
                className="input"
                min={1}
                value={form.packages}
                onChange={(e) => updateField('packages', parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          <div className="toggle-row">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={form.hazardous}
                onChange={(e) => updateField('hazardous', e.target.checked)}
              />
              <span className="toggle-text">⚠️ Contains hazardous goods</span>
            </label>
          </div>

          <div className="form-group">
            <label>Special Handling Notes</label>
            <textarea
              className="input textarea"
              rows={3}
              placeholder="Any special requirements..."
              value={form.specialNotes}
              onChange={(e) => updateField('specialNotes', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Step 3: Compare Quotes */}
      {step === 2 && (
        <div className="form-section">
          <h3 className="section-heading">Compare Freight Quotes</h3>

          {loading ? (
            <div className="loading-state">
              <Loader2 size={32} className="spinner-icon" />
              <p>Finding best rates from carriers...</p>
            </div>
          ) : (
            <>
              <div className="sort-bar">
                <span className="sort-label">Sort by:</span>
                {[
                  { id: 'price' as const, label: 'Price (Low→High)' },
                  { id: 'transit' as const, label: 'Transit Time' },
                  { id: 'rating' as const, label: 'Rating' },
                ].map(s => (
                  <button
                    key={s.id}
                    className={`sort-btn ${sortBy === s.id ? 'active' : ''}`}
                    onClick={() => setSortBy(s.id)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="quotes-grid">
                {sortedQuotes.map((q, i) => (
                  <QuoteCard
                    key={q.id}
                    quote={q}
                    selected={form.selectedQuoteId === q.id}
                    onSelect={() => updateField('selectedQuoteId', q.id)}
                    bestValue={i === 0 && sortBy === 'price'}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Step 4: Confirm & Book */}
      {step === 3 && (
        <div className="form-section">
          <h3 className="section-heading">Confirm Your Booking</h3>

          {/* Summary */}
          {(() => {
            const selectedQuote = quotes.find(q => q.id === form.selectedQuoteId);
            return selectedQuote ? (
              <div className="summary-card">
                <div className="summary-route">
                  {getPortLabel(form.originPort)} → {getPortLabel(form.destinationPort)}
                </div>
                <div className="summary-details">
                  <span>{selectedQuote.carrier}</span>
                  <span>{selectedQuote.transitDays} days</span>
                  <span className="summary-price">{formatCurrency(selectedQuote.price, 'USD')}</span>
                </div>
              </div>
            ) : null;
          })()}

          <h4 className="sub-heading">Shipper Details</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input type="text" className="input" placeholder="Full name" value={form.shipper.name} onChange={(e) => updateField('shipper', { ...form.shipper, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Company</label>
              <input type="text" className="input" placeholder="Company name" value={form.shipper.company} onChange={(e) => updateField('shipper', { ...form.shipper, company: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Address</label>
              <input type="text" className="input" placeholder="Full address" value={form.shipper.address} onChange={(e) => updateField('shipper', { ...form.shipper, address: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" className="input" placeholder="+91-..." value={form.shipper.phone} onChange={(e) => updateField('shipper', { ...form.shipper, phone: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" className="input" placeholder="email@example.com" value={form.shipper.email} onChange={(e) => updateField('shipper', { ...form.shipper, email: e.target.value })} />
            </div>
          </div>

          <h4 className="sub-heading">Consignee Details</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input type="text" className="input" placeholder="Full name" value={form.consignee.name} onChange={(e) => updateField('consignee', { ...form.consignee, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Company</label>
              <input type="text" className="input" placeholder="Company name" value={form.consignee.company} onChange={(e) => updateField('consignee', { ...form.consignee, company: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Address</label>
              <input type="text" className="input" placeholder="Full address" value={form.consignee.address} onChange={(e) => updateField('consignee', { ...form.consignee, address: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" className="input" placeholder="+91-..." value={form.consignee.phone} onChange={(e) => updateField('consignee', { ...form.consignee, phone: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" className="input" placeholder="email@example.com" value={form.consignee.email} onChange={(e) => updateField('consignee', { ...form.consignee, email: e.target.value })} />
            </div>
          </div>

          <h4 className="sub-heading">Trade Terms</h4>
          <div className="incoterms-grid">
            {INCOTERMS.map(inc => (
              <button
                key={inc.id}
                className={`incoterm-btn ${form.incoterm === inc.id ? 'active' : ''}`}
                onClick={() => updateField('incoterm', inc.id)}
              >
                <span className="incoterm-id">{inc.id}</span>
                <span className="incoterm-desc">{inc.description}</span>
              </button>
            ))}
          </div>

          <div className="form-group">
            <label>Special Instructions</label>
            <textarea
              className="input textarea"
              rows={3}
              placeholder="Any additional instructions..."
              value={form.instructions}
              onChange={(e) => updateField('instructions', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="nav-buttons">
        <button className="nav-btn back" onClick={step === 0 ? onBack : () => setStep(s => s - 1)}>
          <ArrowLeft size={16} /> {step === 0 ? 'Back' : 'Previous'}
        </button>

        {step < 3 ? (
          <button
            className="nav-btn next"
            onClick={handleNext}
            disabled={!canGoNext() || loading}
          >
            {loading ? <><Loader2 size={16} className="spinner-icon" /> Finding Quotes...</> : <>Next <ArrowRight size={16} /></>}
          </button>
        ) : (
          <button
            className="nav-btn book"
            onClick={handleBook}
            disabled={booking}
          >
            {booking ? <><Loader2 size={16} className="spinner-icon" /> Confirming...</> : 'Confirm Booking'}
          </button>
        )}
      </div>

      <style jsx>{`
        .intl-booking { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }

        .progress-bar {
          display: flex;
          justify-content: center;
          gap: 0;
          margin-bottom: 28px;
          padding: 0 10px;
        }
        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          position: relative;
          max-width: 160px;
        }
        .step-dot {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 6px;
          border: 2px solid var(--border-color, #e5e7eb);
          color: var(--text-muted, #9ca3af);
          background: var(--bg-secondary, #fff);
          z-index: 1;
        }
        .progress-step.active .step-dot {
          border-color: var(--accent-primary, #f97316);
          color: var(--accent-primary, #f97316);
          background: rgba(249, 115, 22, 0.08);
        }
        .progress-step.completed .step-dot {
          border-color: #10b981;
          color: white;
          background: #10b981;
        }
        .step-label {
          font-size: 0.72rem;
          color: var(--text-muted, #9ca3af);
          text-align: center;
        }
        .progress-step.active .step-label { color: var(--accent-primary, #f97316); font-weight: 600; }
        .progress-step.completed .step-label { color: #10b981; }

        .form-section {
          background: var(--bg-secondary, #fff);
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 20px;
        }
        .section-heading {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-primary, #1f2937);
          margin: 0 0 20px;
        }
        .sub-heading {
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--text-primary, #1f2937);
          margin: 24px 0 12px;
          padding-top: 16px;
          border-top: 1px solid var(--border-color, #e5e7eb);
        }

        .mode-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }
        .mode-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 16px 12px;
          border: 2px solid var(--border-color, #e5e7eb);
          border-radius: 10px;
          background: var(--bg-secondary, #fff);
          cursor: pointer;
          transition: all 0.15s;
          color: var(--text-secondary, #6b7280);
        }
        .mode-btn:hover { border-color: var(--accent-primary, #f97316); }
        .mode-btn.active {
          border-color: var(--accent-primary, #f97316);
          background: rgba(249, 115, 22, 0.06);
          color: var(--accent-primary, #f97316);
        }
        .mode-name { font-size: 0.9rem; font-weight: 600; }
        .mode-desc { font-size: 0.72rem; color: var(--text-muted, #9ca3af); }
        .mode-btn.active .mode-desc { color: var(--accent-primary, #f97316); }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        .form-group { position: relative; }
        .form-group label {
          display: block;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-secondary, #6b7280);
          margin-bottom: 6px;
        }
        .input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 8px;
          font-size: 0.88rem;
          transition: border-color 0.15s;
          background: var(--bg-secondary, #fff);
          color: var(--text-primary, #1f2937);
          box-sizing: border-box;
        }
        .input:focus { outline: none; border-color: var(--accent-primary, #f97316); box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1); }
        .textarea { resize: vertical; font-family: inherit; }
        select.input { cursor: pointer; }

        .dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: var(--bg-secondary, #fff);
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 8px;
          max-height: 200px;
          overflow-y: auto;
          z-index: 50;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          margin-top: 4px;
        }
        .dropdown-item {
          padding: 10px 12px;
          font-size: 0.85rem;
          cursor: pointer;
          color: var(--text-primary, #1f2937);
          transition: background 0.1s;
        }
        .dropdown-item:hover { background: var(--bg-tertiary, #f3f4f6); }
        .dropdown-item.selected { background: rgba(249, 115, 22, 0.08); color: var(--accent-primary, #f97316); }
        .dropdown-empty { padding: 12px; font-size: 0.85rem; color: var(--text-muted, #9ca3af); text-align: center; }

        .toggle-row { margin-bottom: 16px; }
        .toggle-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 0.88rem;
        }
        .toggle-text { color: var(--text-primary, #1f2937); }

        .loading-state {
          text-align: center;
          padding: 48px 0;
          color: var(--text-secondary, #6b7280);
        }
        .loading-state p { margin-top: 12px; font-size: 0.9rem; }

        .sort-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .sort-label { font-size: 0.82rem; color: var(--text-secondary, #6b7280); }
        .sort-btn {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.8rem;
          border: 1px solid var(--border-color, #e5e7eb);
          background: var(--bg-secondary, #fff);
          cursor: pointer;
          color: var(--text-secondary, #6b7280);
          transition: all 0.15s;
        }
        .sort-btn.active {
          background: var(--accent-primary, #f97316);
          color: white;
          border-color: var(--accent-primary, #f97316);
        }

        .quotes-grid { display: flex; flex-direction: column; gap: 14px; }

        .summary-card {
          background: linear-gradient(135deg, rgba(249, 115, 22, 0.08), rgba(234, 88, 12, 0.04));
          border: 1px solid rgba(249, 115, 22, 0.2);
          border-radius: 10px;
          padding: 16px;
          margin-bottom: 20px;
        }
        .summary-route {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary, #1f2937);
          margin-bottom: 8px;
        }
        .summary-details {
          display: flex;
          gap: 16px;
          font-size: 0.85rem;
          color: var(--text-secondary, #6b7280);
        }
        .summary-price { color: var(--accent-primary, #f97316); font-weight: 700; }

        .incoterms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 10px;
          margin-bottom: 20px;
        }
        .incoterm-btn {
          text-align: left;
          padding: 12px;
          border: 2px solid var(--border-color, #e5e7eb);
          border-radius: 8px;
          background: var(--bg-secondary, #fff);
          cursor: pointer;
          transition: all 0.15s;
        }
        .incoterm-btn:hover { border-color: var(--accent-primary, #f97316); }
        .incoterm-btn.active {
          border-color: var(--accent-primary, #f97316);
          background: rgba(249, 115, 22, 0.06);
        }
        .incoterm-id { display: block; font-size: 0.9rem; font-weight: 700; color: var(--text-primary, #1f2937); }
        .incoterm-desc { font-size: 0.72rem; color: var(--text-muted, #9ca3af); }
        .incoterm-btn.active .incoterm-id { color: var(--accent-primary, #f97316); }

        .nav-buttons {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-top: 8px;
        }
        .nav-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
        }
        .nav-btn.back {
          background: var(--bg-secondary, #fff);
          border: 1px solid var(--border-color, #e5e7eb);
          color: var(--text-secondary, #6b7280);
        }
        .nav-btn.back:hover { border-color: var(--text-secondary, #6b7280); }
        .nav-btn.next, .nav-btn.book {
          background: linear-gradient(135deg, #f97316, #ea580c);
          border: none;
          color: white;
        }
        .nav-btn.next:hover, .nav-btn.book:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
        }
        .nav-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        :global(.spinner-icon) { animation: spin 1s linear infinite; }

        @media (max-width: 768px) {
          .intl-booking { padding-bottom: 100px; }
          .form-section { padding: 16px; }
          .form-row { grid-template-columns: 1fr; }
          .mode-grid { grid-template-columns: 1fr; gap: 8px; }
          .mode-btn { flex-direction: row; padding: 14px; gap: 10px; }
          .progress-bar { gap: 2px; }
          .step-label { font-size: 0.62rem; }
          .step-dot { width: 32px; height: 32px; font-size: 0.75rem; }
          .input { padding: 12px 14px; min-height: 44px; font-size: 0.9rem; }
          .dropdown-item { padding: 12px 14px; min-height: 44px; }
          .incoterms-grid { grid-template-columns: 1fr; }
          .incoterm-option { padding: 14px; }
          .nav-buttons { flex-direction: column-reverse; }
          .nav-btn { justify-content: center; width: 100%; padding: 14px 24px; min-height: 48px; }
          .summary-details { flex-direction: column; gap: 4px; }
          .confirm-btn { min-height: 48px; padding: 14px 24px; }
          .contact-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .step-label { display: none; }
          .step-dot { width: 28px; height: 28px; font-size: 0.7rem; }
          .progress-bar { gap: 0; }
          .form-section { padding: 12px; }
          .section-title { font-size: 0.85rem; }
          .mode-btn { padding: 12px; }
          .mode-name { font-size: 0.82rem; }
          .mode-desc { display: none; }
          .incoterm-desc { display: none; }
          .summary-card { padding: 14px; }
          .summary-row { font-size: 0.82rem; }
        }
      `}</style>
    </div>
  );
}
