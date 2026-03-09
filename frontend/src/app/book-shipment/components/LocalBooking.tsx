'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  LocalBookingData,
  INITIAL_LOCAL,
  BookingQuote,
  BookingRecord,
} from '@/types/booking';
import {
  INDIAN_CITIES,
  VEHICLE_TYPES,
  MATERIAL_TYPES,
  URGENCY_OPTIONS,
  generateLocalQuotes,
  formatCurrency,
  getCityLabel,
} from '@/lib/bookingConstants';
import { bookingStorage } from '@/lib/bookingStorage';
import QuoteCard from './QuoteCard';
import BookingSuccess from './BookingSuccess';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { captureFeatureAction } from '@/lib/posthogEvents';

interface LocalBookingProps {
  onBack: () => void;
}

const STEPS = ['Route & Vehicle', 'Cargo Details', 'Compare & Book'];

export default function LocalBooking({ onBack }: LocalBookingProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<LocalBookingData>(INITIAL_LOCAL);
  const [quotes, setQuotes] = useState<BookingQuote[]>([]);
  const [sortBy, setSortBy] = useState<'price' | 'transit' | 'rating'>('price');
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [savedBooking, setSavedBooking] = useState<BookingRecord | null>(null);
  const [showConfirmForm, setShowConfirmForm] = useState(false);

  // City search
  const [pickupSearch, setPickupSearch] = useState('');
  const [deliverySearch, setDeliverySearch] = useState('');
  const [showPickupDD, setShowPickupDD] = useState(false);
  const [showDeliveryDD, setShowDeliveryDD] = useState(false);
  const pickupRef = useRef<HTMLDivElement>(null);
  const deliveryRef = useRef<HTMLDivElement>(null);

  const updateField = useCallback(<K extends keyof LocalBookingData>(
    key: K,
    value: LocalBookingData[K]
  ) => {
    setForm(prev => ({ ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pickupRef.current && !pickupRef.current.contains(e.target as Node)) setShowPickupDD(false);
      if (deliveryRef.current && !deliveryRef.current.contains(e.target as Node)) setShowDeliveryDD(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredPickup = INDIAN_CITIES.filter(c =>
    c.name.toLowerCase().includes(pickupSearch.toLowerCase()) ||
    c.state.toLowerCase().includes(pickupSearch.toLowerCase())
  );
  const filteredDelivery = INDIAN_CITIES.filter(c =>
    c.name.toLowerCase().includes(deliverySearch.toLowerCase()) ||
    c.state.toLowerCase().includes(deliverySearch.toLowerCase())
  );

  const canGoNext = () => {
    if (step === 0) return form.pickupCity && form.deliveryCity && form.pickupDate;
    if (step === 1) return form.weight;
    return true;
  };

  const handleNext = () => {
    if (step === 1) {
      // Generate quotes
      setLoading(true);
      setTimeout(() => {
        const generated = generateLocalQuotes(
          form.pickupCity,
          form.deliveryCity,
          form.vehicleType,
          form.vehicleCount,
          form.urgency,
        );
        setQuotes(generated);
        setLoading(false);
        setStep(2);
      }, 1200);
      return;
    }
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const handleSelectQuote = (quoteId: string) => {
    updateField('selectedQuoteId', quoteId);
    setShowConfirmForm(true);
  };

  const handleBook = () => {
    const selectedQuote = quotes.find(q => q.id === form.selectedQuoteId);
    if (!selectedQuote) return;

    setBooking(true);
    setTimeout(() => {
      const record = bookingStorage.save('local', form, selectedQuote);
      setSavedBooking(record);
      setBooking(false);
      captureFeatureAction('shipment', 'booked', { segment: 'local' });
    }, 1500);
  };

  const sortedQuotes = [...quotes].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'transit') return a.transitDays - b.transitDays;
    return b.rating - a.rating;
  });

  if (savedBooking) {
    return (
      <BookingSuccess
        booking={savedBooking}
        onViewBookings={onBack}
        onNewBooking={() => {
          setForm(INITIAL_LOCAL);
          setStep(0);
          setQuotes([]);
          setSavedBooking(null);
          setShowConfirmForm(false);
        }}
        onTrackShipment={() => { window.location.href = '/track-shipment'; }}
      />
    );
  }

  return (
    <div className="local-booking">
      {/* Progress bar */}
      <div className="progress-bar">
        {STEPS.map((s, i) => (
          <div key={i} className={`progress-step ${i <= step ? 'active' : ''} ${i < step ? 'completed' : ''}`}>
            <div className="step-dot">{i < step ? '✓' : i + 1}</div>
            <span className="step-label">{s}</span>
          </div>
        ))}
      </div>

      {/* Step 1: Route & Vehicle */}
      {step === 0 && (
        <div className="form-section">
          <h3 className="section-heading">Pickup & Delivery</h3>

          <div className="form-row">
            <div className="form-group" ref={pickupRef}>
              <label>Pickup City *</label>
              <input
                type="text"
                className="input"
                placeholder="Search city..."
                value={showPickupDD ? pickupSearch : (form.pickupCity ? getCityLabel(form.pickupCity) : '')}
                onChange={(e) => { setPickupSearch(e.target.value); setShowPickupDD(true); }}
                onFocus={() => { setShowPickupDD(true); setPickupSearch(''); }}
              />
              {showPickupDD && (
                <div className="dropdown">
                  {filteredPickup.map(c => (
                    <div
                      key={c.id}
                      className={`dropdown-item ${form.pickupCity === c.id ? 'selected' : ''}`}
                      onClick={() => { updateField('pickupCity', c.id); setShowPickupDD(false); }}
                    >
                      {c.name}, {c.state}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Pickup Address</label>
              <input
                type="text"
                className="input"
                placeholder="Full address"
                value={form.pickupAddress}
                onChange={(e) => updateField('pickupAddress', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" ref={deliveryRef}>
              <label>Delivery City *</label>
              <input
                type="text"
                className="input"
                placeholder="Search city..."
                value={showDeliveryDD ? deliverySearch : (form.deliveryCity ? getCityLabel(form.deliveryCity) : '')}
                onChange={(e) => { setDeliverySearch(e.target.value); setShowDeliveryDD(true); }}
                onFocus={() => { setShowDeliveryDD(true); setDeliverySearch(''); }}
              />
              {showDeliveryDD && (
                <div className="dropdown">
                  {filteredDelivery.map(c => (
                    <div
                      key={c.id}
                      className={`dropdown-item ${form.deliveryCity === c.id ? 'selected' : ''}`}
                      onClick={() => { updateField('deliveryCity', c.id); setShowDeliveryDD(false); }}
                    >
                      {c.name}, {c.state}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Delivery Address</label>
              <input
                type="text"
                className="input"
                placeholder="Full address"
                value={form.deliveryAddress}
                onChange={(e) => updateField('deliveryAddress', e.target.value)}
              />
            </div>
          </div>

          <h3 className="section-heading">Vehicle Type</h3>
          <div className="vehicle-grid">
            {VEHICLE_TYPES.map(v => (
              <button
                key={v.id}
                className={`vehicle-btn ${form.vehicleType === v.id ? 'active' : ''}`}
                onClick={() => updateField('vehicleType', v.id)}
              >
                <span className="vehicle-icon">{v.icon}</span>
                <span className="vehicle-name">{v.name}</span>
                <span className="vehicle-cap">{v.capacity}</span>
                <span className="vehicle-price">{v.priceRange}</span>
              </button>
            ))}
          </div>

          <div className="form-row three-col">
            <div className="form-group">
              <label>Number of Vehicles</label>
              <input
                type="number"
                className="input"
                min={1}
                max={20}
                value={form.vehicleCount}
                onChange={(e) => updateField('vehicleCount', parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="form-group">
              <label>Pickup Date *</label>
              <input
                type="date"
                className="input"
                value={form.pickupDate}
                onChange={(e) => updateField('pickupDate', e.target.value)}
              />
            </div>
          </div>

          <h3 className="section-heading">Delivery Urgency</h3>
          <div className="urgency-grid">
            {URGENCY_OPTIONS.map(u => (
              <button
                key={u.id}
                className={`urgency-btn ${form.urgency === u.id ? 'active' : ''}`}
                onClick={() => updateField('urgency', u.id)}
              >
                <span className="urgency-icon">{u.icon}</span>
                <span className="urgency-name">{u.name}</span>
                <span className="urgency-time">{u.time}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Cargo Details */}
      {step === 1 && (
        <div className="form-section">
          <h3 className="section-heading">Material Type</h3>
          <div className="material-grid">
            {MATERIAL_TYPES.map(m => (
              <button
                key={m.id}
                className={`material-btn ${form.materialType === m.id ? 'active' : ''}`}
                onClick={() => updateField('materialType', m.id)}
              >
                <span className="material-icon">{m.icon}</span>
                <span className="material-name">{m.name}</span>
                <span className="material-desc">{m.description}</span>
              </button>
            ))}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Total Weight (kg) *</label>
              <input
                type="number"
                className="input"
                placeholder="e.g. 2500"
                value={form.weight}
                onChange={(e) => updateField('weight', e.target.value)}
              />
            </div>
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

          <div className="toggles-row">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={form.loadingHelp}
                onChange={(e) => updateField('loadingHelp', e.target.checked)}
              />
              <span>Loading/unloading help needed (+₹1,500–3,000)</span>
            </label>
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={form.insurance}
                onChange={(e) => updateField('insurance', e.target.checked)}
              />
              <span>Cargo insurance (+1.5% of cargo value)</span>
            </label>
          </div>

          <div className="form-group">
            <label>Special Instructions</label>
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

      {/* Step 3: Compare & Book */}
      {step === 2 && (
        <div className="form-section">
          <h3 className="section-heading">Compare Local Logistics Quotes</h3>

          {loading ? (
            <div className="loading-state">
              <Loader2 size={32} className="spinner-icon" />
              <p>Getting quotes from logistics providers...</p>
            </div>
          ) : (
            <>
              <div className="sort-bar">
                <span className="sort-label">Sort by:</span>
                {[
                  { id: 'price' as const, label: 'Price' },
                  { id: 'transit' as const, label: 'Delivery Time' },
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
                    onSelect={() => handleSelectQuote(q.id)}
                    bestValue={i === 0 && sortBy === 'price'}
                  />
                ))}
              </div>

              {showConfirmForm && form.selectedQuoteId && (
                <div className="confirm-section">
                  <h4 className="confirm-heading">Contact Details for Pickup</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Name</label>
                      <input type="text" className="input" placeholder="Full name" value={form.contact.name} onChange={(e) => updateField('contact', { ...form.contact, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Company</label>
                      <input type="text" className="input" placeholder="Company name" value={form.contact.company} onChange={(e) => updateField('contact', { ...form.contact, company: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone</label>
                      <input type="tel" className="input" placeholder="+91-..." value={form.contact.phone} onChange={(e) => updateField('contact', { ...form.contact, phone: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" className="input" placeholder="email@example.com" value={form.contact.email} onChange={(e) => updateField('contact', { ...form.contact, email: e.target.value })} />
                    </div>
                  </div>
                  <button
                    className="book-btn"
                    onClick={handleBook}
                    disabled={booking}
                  >
                    {booking ? <><Loader2 size={16} className="spinner-icon" /> Confirming...</> : 'Confirm Booking'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="nav-buttons">
        <button className="nav-btn back" onClick={step === 0 ? onBack : () => { setStep(s => s - 1); setShowConfirmForm(false); }}>
          <ArrowLeft size={16} /> {step === 0 ? 'Back' : 'Previous'}
        </button>
        {step < 2 && (
          <button className="nav-btn next" onClick={handleNext} disabled={!canGoNext() || loading}>
            {loading ? <><Loader2 size={16} className="spinner-icon" /> Finding Quotes...</> : <>Next <ArrowRight size={16} /></>}
          </button>
        )}
      </div>

      <style jsx>{`
        .local-booking { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }

        .progress-bar {
          display: flex;
          justify-content: center;
          margin-bottom: 28px;
        }
        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          max-width: 180px;
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
          font-size: 0.75rem;
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
          margin: 0 0 16px;
        }
        .section-heading + .section-heading { margin-top: 24px; }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        .three-col { grid-template-columns: 1fr 1fr; }
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
        }
        .dropdown-item:hover { background: var(--bg-tertiary, #f3f4f6); }
        .dropdown-item.selected { background: rgba(249, 115, 22, 0.08); color: var(--accent-primary, #f97316); }

        .vehicle-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 24px;
        }
        .vehicle-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 14px 8px;
          border: 2px solid var(--border-color, #e5e7eb);
          border-radius: 10px;
          background: var(--bg-secondary, #fff);
          cursor: pointer;
          transition: all 0.15s;
        }
        .vehicle-btn:hover { border-color: var(--accent-primary, #f97316); }
        .vehicle-btn.active {
          border-color: var(--accent-primary, #f97316);
          background: rgba(249, 115, 22, 0.06);
        }
        .vehicle-icon { font-size: 1.5rem; }
        .vehicle-name { font-size: 0.82rem; font-weight: 600; color: var(--text-primary, #1f2937); }
        .vehicle-cap { font-size: 0.72rem; color: var(--text-secondary, #6b7280); }
        .vehicle-price { font-size: 0.68rem; color: var(--text-muted, #9ca3af); }

        .urgency-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 16px;
        }
        .urgency-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 14px;
          border: 2px solid var(--border-color, #e5e7eb);
          border-radius: 10px;
          background: var(--bg-secondary, #fff);
          cursor: pointer;
          transition: all 0.15s;
        }
        .urgency-btn:hover { border-color: var(--accent-primary, #f97316); }
        .urgency-btn.active {
          border-color: var(--accent-primary, #f97316);
          background: rgba(249, 115, 22, 0.06);
        }
        .urgency-icon { font-size: 1.3rem; }
        .urgency-name { font-size: 0.85rem; font-weight: 600; color: var(--text-primary, #1f2937); }
        .urgency-time { font-size: 0.72rem; color: var(--text-secondary, #6b7280); }

        .material-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
          margin-bottom: 24px;
        }
        .material-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 14px 6px;
          border: 2px solid var(--border-color, #e5e7eb);
          border-radius: 10px;
          background: var(--bg-secondary, #fff);
          cursor: pointer;
          transition: all 0.15s;
        }
        .material-btn:hover { border-color: var(--accent-primary, #f97316); }
        .material-btn.active {
          border-color: var(--accent-primary, #f97316);
          background: rgba(249, 115, 22, 0.06);
        }
        .material-icon { font-size: 1.4rem; }
        .material-name { font-size: 0.78rem; font-weight: 600; color: var(--text-primary, #1f2937); }
        .material-desc { font-size: 0.65rem; color: var(--text-muted, #9ca3af); }

        .toggles-row {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 16px;
        }
        .toggle-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 0.85rem;
          color: var(--text-primary, #1f2937);
        }

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

        .confirm-section {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 2px solid var(--accent-primary, #f97316);
          animation: fadeIn 0.3s ease;
        }
        .confirm-heading {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary, #1f2937);
          margin: 0 0 16px;
        }
        .book-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
          margin-top: 8px;
        }
        .book-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
        }
        .book-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

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
        .nav-btn.next {
          background: linear-gradient(135deg, #f97316, #ea580c);
          border: none;
          color: white;
        }
        .nav-btn.next:hover {
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
          .local-booking { padding-bottom: 100px; }
          .form-section { padding: 16px; }
          .form-row { grid-template-columns: 1fr; }
          .vehicle-grid { grid-template-columns: repeat(2, 1fr); }
          .vehicle-btn { padding: 16px 10px; min-height: 44px; }
          .urgency-grid { grid-template-columns: 1fr; }
          .urgency-btn { flex-direction: row; padding: 14px; gap: 10px; min-height: 44px; }
          .material-grid { grid-template-columns: repeat(3, 1fr); }
          .material-btn { padding: 14px 6px; min-height: 44px; }
          .input { padding: 12px 14px; min-height: 44px; font-size: 0.9rem; }
          .dropdown-item { padding: 12px 14px; min-height: 44px; }
          .nav-buttons { flex-direction: column-reverse; }
          .nav-btn { justify-content: center; width: 100%; padding: 14px 24px; min-height: 48px; }
          .book-btn { min-height: 48px; padding: 16px; }
          .sort-btn { padding: 8px 16px; min-height: 40px; }
          .confirm-section { margin-top: 16px; padding-top: 16px; }
          .progress-bar { gap: 2px; }
          .step-dot { width: 32px; height: 32px; font-size: 0.75rem; }
        }
        @media (max-width: 480px) {
          .material-grid { grid-template-columns: repeat(2, 1fr); }
          .vehicle-grid { grid-template-columns: repeat(2, 1fr); }
          .form-section { padding: 12px; }
          .section-title { font-size: 0.85rem; }
          .step-label { display: none; }
          .step-dot { width: 28px; height: 28px; font-size: 0.7rem; }
          .progress-bar { gap: 0; }
          .vehicle-name { font-size: 0.78rem; }
          .vehicle-cap, .vehicle-range { font-size: 0.62rem; }
          .material-desc { display: none; }
          .urgency-btn { padding: 12px 8px; }
        }
      `}</style>
    </div>
  );
}
