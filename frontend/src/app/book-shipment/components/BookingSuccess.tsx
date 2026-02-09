'use client';

import { BookingRecord } from '@/types/booking';
import { formatCurrency, getPortLabel, getCityLabel } from '@/lib/bookingConstants';
import { InternationalBookingData, LocalBookingData } from '@/types/booking';
import { CheckCircle, MapPin, ArrowRight, FileText, Package, Truck, ClipboardList } from 'lucide-react';

interface BookingSuccessProps {
  booking: BookingRecord;
  onViewBookings: () => void;
  onNewBooking: () => void;
  onTrackShipment: () => void;
}

export default function BookingSuccess({ booking, onViewBookings, onNewBooking, onTrackShipment }: BookingSuccessProps) {
  const isIntl = booking.segment === 'international';
  const intlData = isIntl ? (booking.data as InternationalBookingData) : null;
  const localData = !isIntl ? (booking.data as LocalBookingData) : null;

  const origin = isIntl
    ? getPortLabel(intlData!.originPort)
    : getCityLabel(localData!.pickupCity);
  const destination = isIntl
    ? getPortLabel(intlData!.destinationPort)
    : getCityLabel(localData!.deliveryCity);

  const milestones = [
    { label: 'Booking Confirmed', status: 'completed' as const, icon: CheckCircle },
    { label: 'Documents Ready', status: 'pending' as const, icon: FileText },
    { label: 'In Transit', status: 'pending' as const, icon: Truck },
    { label: 'Delivered', status: 'pending' as const, icon: Package },
  ];

  const documents = isIntl
    ? ['Bill of Lading', 'Commercial Invoice', 'Packing List', 'Certificate of Origin']
    : ['Lorry Receipt', 'E-Way Bill'];

  return (
    <div className="success-container">
      <div className="success-icon">
        <CheckCircle size={56} strokeWidth={1.5} />
      </div>

      <h2 className="success-title">Booking Confirmed!</h2>
      <p className="success-subtitle">Your {isIntl ? 'international freight' : 'local logistics'} booking has been placed successfully.</p>

      <div className="ref-number">
        {booking.referenceNumber}
      </div>

      {/* Route summary */}
      <div className="route-summary">
        <div className="route-point">
          <MapPin size={16} />
          <span>{origin}</span>
        </div>
        <ArrowRight size={18} className="route-arrow" />
        <div className="route-point">
          <MapPin size={16} />
          <span>{destination}</span>
        </div>
      </div>

      <div className="details-grid">
        <div className="detail-card">
          <span className="detail-label">Carrier</span>
          <span className="detail-value">{booking.selectedQuote.logo} {booking.selectedQuote.carrier}</span>
        </div>
        <div className="detail-card">
          <span className="detail-label">Total Cost</span>
          <span className="detail-value price">{formatCurrency(booking.selectedQuote.price, booking.selectedQuote.currency)}</span>
        </div>
        <div className="detail-card">
          <span className="detail-label">Transit Time</span>
          <span className="detail-value">{booking.selectedQuote.transitDays} {booking.selectedQuote.transitDays === 1 ? 'day' : 'days'}</span>
        </div>
        <div className="detail-card">
          <span className="detail-label">Service</span>
          <span className="detail-value">{booking.selectedQuote.serviceType}</span>
        </div>
      </div>

      {/* Timeline milestones */}
      <div className="timeline-section">
        <h3 className="section-title">Shipment Timeline</h3>
        <div className="timeline">
          {milestones.map((m, i) => {
            const Icon = m.icon;
            return (
              <div key={i} className={`milestone ${m.status}`}>
                <div className="milestone-icon">
                  <Icon size={16} />
                </div>
                <span className="milestone-label">{m.label}</span>
                {i < milestones.length - 1 && <div className="milestone-connector" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Document checklist */}
      <div className="docs-section">
        <h3 className="section-title">
          <ClipboardList size={16} /> Required Documents
        </h3>
        <div className="docs-list">
          {documents.map((doc, i) => (
            <div key={i} className="doc-item">
              <FileText size={14} />
              <span>{doc}</span>
              <span className="doc-status">Pending</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="actions">
        <button className="btn-primary" onClick={onTrackShipment}>
          <Truck size={16} /> Track Shipment
        </button>
        <button className="btn-secondary" onClick={onViewBookings}>
          View My Bookings
        </button>
        <button className="btn-ghost" onClick={onNewBooking}>
          New Booking
        </button>
      </div>

      <style jsx>{`
        .success-container {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
          padding: 20px 0;
        }
        .success-icon {
          color: #10b981;
          margin-bottom: 16px;
          animation: scaleIn 0.5s ease;
        }
        @keyframes scaleIn {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        .success-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary, #1f2937);
          margin: 0 0 8px;
        }
        .success-subtitle {
          color: var(--text-secondary, #6b7280);
          font-size: 0.9rem;
          margin: 0 0 20px;
        }
        .ref-number {
          display: inline-block;
          background: var(--bg-tertiary, #f3f4f6);
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 8px;
          padding: 10px 24px;
          font-family: monospace;
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--accent-primary, #f97316);
          letter-spacing: 1px;
          margin-bottom: 24px;
        }
        .route-summary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .route-point {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9rem;
          color: var(--text-primary, #1f2937);
          font-weight: 500;
        }
        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 28px;
          text-align: left;
        }
        .detail-card {
          background: var(--bg-tertiary, #f3f4f6);
          border-radius: 10px;
          padding: 14px;
        }
        .detail-label {
          display: block;
          font-size: 0.72rem;
          text-transform: uppercase;
          color: var(--text-muted, #9ca3af);
          margin-bottom: 4px;
          letter-spacing: 0.5px;
        }
        .detail-value {
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--text-primary, #1f2937);
        }
        .detail-value.price {
          color: var(--accent-primary, #f97316);
          font-size: 1.05rem;
        }
        .section-title {
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--text-primary, #1f2937);
          margin: 0 0 14px;
          display: flex;
          align-items: center;
          gap: 6px;
          justify-content: center;
        }
        .timeline-section {
          margin-bottom: 28px;
        }
        .timeline {
          display: flex;
          justify-content: center;
          gap: 0;
          position: relative;
        }
        .milestone {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          position: relative;
          max-width: 120px;
        }
        .milestone-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          z-index: 1;
        }
        .milestone.completed .milestone-icon {
          background: #10b981;
          color: white;
        }
        .milestone.pending .milestone-icon {
          background: var(--bg-tertiary, #f3f4f6);
          color: var(--text-muted, #9ca3af);
          border: 2px solid var(--border-color, #e5e7eb);
        }
        .milestone-label {
          font-size: 0.72rem;
          color: var(--text-secondary, #6b7280);
          text-align: center;
        }
        .milestone.completed .milestone-label {
          color: #10b981;
          font-weight: 600;
        }
        .milestone-connector {
          position: absolute;
          top: 18px;
          left: 60%;
          width: 80%;
          height: 2px;
          background: var(--border-color, #e5e7eb);
          z-index: 0;
        }
        .milestone.completed .milestone-connector {
          background: #10b981;
        }
        .docs-section {
          margin-bottom: 28px;
          text-align: left;
        }
        .docs-list {
          background: var(--bg-secondary, #fff);
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 10px;
          overflow: hidden;
        }
        .doc-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          font-size: 0.85rem;
          color: var(--text-primary, #1f2937);
          border-bottom: 1px solid var(--border-color, #e5e7eb);
        }
        .doc-item:last-child { border-bottom: none; }
        .doc-status {
          margin-left: auto;
          font-size: 0.72rem;
          color: var(--text-muted, #9ca3af);
          background: var(--bg-tertiary, #f3f4f6);
          padding: 3px 8px;
          border-radius: 4px;
        }
        .actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: center;
        }
        .btn-primary {
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
          border: none;
          padding: 14px 32px;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          max-width: 300px;
          justify-content: center;
          transition: all 0.2s;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
        }
        .btn-secondary {
          background: var(--bg-secondary, #fff);
          border: 2px solid var(--border-color, #e5e7eb);
          padding: 12px 32px;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          color: var(--text-primary, #1f2937);
          width: 100%;
          max-width: 300px;
          transition: all 0.15s;
        }
        .btn-secondary:hover {
          border-color: var(--accent-primary, #f97316);
          color: var(--accent-primary, #f97316);
        }
        .btn-ghost {
          background: none;
          border: none;
          color: var(--text-secondary, #6b7280);
          font-size: 0.85rem;
          cursor: pointer;
          padding: 8px;
        }
        .btn-ghost:hover {
          color: var(--accent-primary, #f97316);
        }

        @media (max-width: 768px) {
          .success-title { font-size: 1.25rem; }
          .ref-number { font-size: 1rem; padding: 8px 18px; }
          .details-grid { grid-template-columns: 1fr; gap: 8px; }
          .timeline { flex-wrap: wrap; gap: 4px; }
          .milestone { max-width: 100px; }
          .milestone-label { font-size: 0.7rem; }
          .milestone-connector { display: none; }
          .btn-primary, .btn-secondary { max-width: 100%; width: 100%; min-height: 48px; }
          .btn-primary { padding: 14px 24px; }
          .btn-secondary { padding: 12px 24px; }
          .doc-item { padding: 14px 16px; min-height: 44px; }
        }
        @media (max-width: 480px) {
          .route-summary { flex-direction: column; gap: 8px; }
          .route-point { font-size: 0.85rem; }
          .detail-card { padding: 12px; }
          .detail-value { font-size: 0.85rem; }
          .success-subtitle { font-size: 0.82rem; }
          .milestone { max-width: 70px; }
          .milestone-icon { width: 30px; height: 30px; }
        }
      `}</style>
    </div>
  );
}
