'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import InternationalBooking from './components/InternationalBooking';
import LocalBooking from './components/LocalBooking';
import { bookingStorage } from '@/lib/bookingStorage';
import { BookingRecord, BookingSegment, BookingStatus } from '@/types/booking';
import { formatCurrency, getPortLabel, getCityLabel } from '@/lib/bookingConstants';
import { Ship, Truck, ArrowLeft, Package, Plane, MapPin, Calendar, Trash2, Globe } from 'lucide-react';
import { Suspense } from 'react';
import { useMobile } from '@/hooks/useMobile';
import { useTour } from '@/hooks/useTour';
import { bookShipmentTourSteps, mobileBookShipmentTourSteps } from '@/lib/tourSteps';
import TourFAB from '@/components/walkthrough/TourFAB';
import Joyride from 'react-joyride';
import { joyrideStyles, BefachTooltip } from '@/lib/tourConfig';

type ActiveSegment = null | 'international' | 'local';
type Tab = 'new' | 'bookings';
type Filter = 'all' | BookingSegment | BookingStatus;

function BookShipmentContent() {
  const { isMobile } = useMobile();
  const tourSteps = isMobile ? mobileBookShipmentTourSteps : bookShipmentTourSteps;
  const { run, startTour, handleJoyrideCallback } = useTour({ tourId: 'book-shipment', steps: tourSteps });
  const [tab, setTab] = useState<Tab>('new');
  const [activeSegment, setActiveSegment] = useState<ActiveSegment>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    setBookings(bookingStorage.getAll());
  }, []);

  const refreshBookings = () => {
    setBookings(bookingStorage.getAll());
  };

  const handleBackFromWizard = () => {
    setActiveSegment(null);
    refreshBookings();
  };

  const handleDelete = (id: string) => {
    bookingStorage.delete(id);
    refreshBookings();
  };

  const filteredBookings = bookings.filter(b => {
    if (filter === 'all') return true;
    if (filter === 'international' || filter === 'local') return b.segment === filter;
    return b.status === filter;
  });

  const statusColor = (s: BookingStatus) => {
    const map: Record<BookingStatus, string> = {
      draft: '#6b7280',
      confirmed: '#3b82f6',
      in_transit: '#f59e0b',
      delivered: '#10b981',
      cancelled: '#ef4444',
    };
    return map[s] || '#6b7280';
  };

  const statusLabel = (s: BookingStatus) =>
    s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());

  // Render wizard if segment selected
  if (activeSegment === 'international') {
    return (
      <AppLayout>
        <div className="page-container">
          <InternationalBooking onBack={handleBackFromWizard} />
        </div>
        <style jsx>{`
          .page-container { max-width: 900px; padding: 20px; }
          @media (max-width: 768px) { .page-container { padding: 14px; padding-bottom: 100px; } }
          @media (max-width: 480px) { .page-container { padding: 12px; padding-bottom: 100px; } }
        `}</style>
      </AppLayout>
    );
  }
  if (activeSegment === 'local') {
    return (
      <AppLayout>
        <div className="page-container">
          <LocalBooking onBack={handleBackFromWizard} />
        </div>
        <style jsx>{`
          .page-container { max-width: 900px; padding: 20px; }
          @media (max-width: 768px) { .page-container { padding: 14px; padding-bottom: 100px; } }
          @media (max-width: 480px) { .page-container { padding: 12px; padding-bottom: 100px; } }
        `}</style>
      </AppLayout>
    );
  }

  return (
    <AppLayout>      <div className="page-container">
        <div id="booking-header" className="content-header">
          <h1>Book Shipment</h1>
          <p>Book international freight or local logistics with competitive carrier quotes</p>        </div>

        {/* Tabs */}
        <div id="booking-tabs" className="tabs-container">
          <button
            className={`tab-btn ${tab === 'new' ? 'active' : ''}`}
            onClick={() => setTab('new')}
          >
            <Package size={16} /> New Booking
          </button>
          <button
            className={`tab-btn ${tab === 'bookings' ? 'active' : ''}`}
            onClick={() => { setTab('bookings'); refreshBookings(); }}
          >
            <Calendar size={16} /> My Bookings
            {bookings.length > 0 && <span className="badge">{bookings.length}</span>}
          </button>
        </div>

        {/* New Booking Tab */}
        {tab === 'new' && (
          <div id="booking-segments" className="segment-cards">
            <button className="segment-card" onClick={() => setActiveSegment('international')}>
              <div className="segment-icons">
                <Ship size={28} />
                <Plane size={22} />
              </div>
              <h3>International Freight</h3>
              <p className="segment-desc">Book ocean & air cargo across borders</p>
              <ul className="segment-features">
                <li>FCL / LCL / Air Freight</li>
                <li>20+ global ports</li>
                <li>Competitive multi-carrier quotes</li>
                <li>End-to-end documentation</li>
              </ul>
              <span className="segment-cta">Start Booking →</span>
            </button>

            <button className="segment-card" onClick={() => setActiveSegment('local')}>
              <div className="segment-icons">
                <Truck size={28} />
              </div>
              <h3>Local Logistics</h3>
              <p className="segment-desc">Domestic freight across India</p>
              <ul className="segment-features">
                <li>FTL / PTL — mini truck to trailer</li>
                <li>Pan-India coverage — 12+ cities</li>
                <li>Same-day & express available</li>
                <li>Loading/unloading assistance</li>
              </ul>
              <span className="segment-cta">Start Booking →</span>
            </button>
          </div>
        )}

        {/* My Bookings Tab */}
        {tab === 'bookings' && (
          <div className="bookings-section">
            <div className="filter-bar">
              {[
                { id: 'all' as Filter, label: 'All' },
                { id: 'international' as Filter, label: 'International' },
                { id: 'local' as Filter, label: 'Local' },
                { id: 'confirmed' as Filter, label: 'Confirmed' },
                { id: 'in_transit' as Filter, label: 'In Transit' },
                { id: 'delivered' as Filter, label: 'Delivered' },
              ].map(f => (
                <button
                  key={f.id}
                  className={`filter-chip ${filter === f.id ? 'active' : ''}`}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {filteredBookings.length === 0 ? (
              <div className="empty-state">
                <Package size={48} strokeWidth={1} />
                <h3>No bookings yet</h3>
                <p>Your freight bookings will appear here</p>
                <button className="empty-cta" onClick={() => setTab('new')}>
                  Create New Booking
                </button>
              </div>
            ) : (
              <div className="bookings-list">
                {filteredBookings.map(b => {
                  const isIntl = b.segment === 'international';
                  const intlData = isIntl ? (b.data as any) : null;
                  const localData = !isIntl ? (b.data as any) : null;
                  const origin = isIntl ? getPortLabel(intlData.originPort) : getCityLabel(localData.pickupCity);
                  const dest = isIntl ? getPortLabel(intlData.destinationPort) : getCityLabel(localData.deliveryCity);

                  return (
                    <div key={b.id} className="booking-card">
                      <div className="booking-header">
                        <div className="booking-ref">
                          <span className="segment-tag">{isIntl ? <><Globe size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> International</> : 'Local'}</span>
                          <span className="ref">{b.referenceNumber}</span>
                        </div>
                        <div className="status-badge" style={{ color: statusColor(b.status), background: `${statusColor(b.status)}15` }}>
                          {statusLabel(b.status)}
                        </div>
                      </div>

                      <div className="booking-route">
                        <MapPin size={14} />
                        <span>{origin}</span>
                        <span className="route-arrow">→</span>
                        <span>{dest}</span>
                      </div>

                      <div className="booking-meta">
                        <span>{b.selectedQuote.logo} {b.selectedQuote.carrier}</span>
                        <span>{b.selectedQuote.transitDays}d transit</span>
                        <span className="booking-price">{formatCurrency(b.selectedQuote.price, b.selectedQuote.currency)}</span>
                        <span className="booking-date">{new Date(b.createdAt).toLocaleDateString()}</span>
                      </div>

                      <button className="delete-btn" onClick={() => handleDelete(b.id)} title="Delete booking">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .page-container { max-width: 960px; padding: 20px; }
        .content-header { margin-bottom: 24px; }
        .content-header h1 { font-size: 1.5rem; font-weight: 700; color: var(--text-primary, #1f2937); margin: 0 0 6px; }
        .content-header p { font-size: 0.9rem; color: var(--text-secondary, #6b7280); margin: 0; }

        .tabs-container {
          display: flex;
          gap: 4px;
          background: var(--bg-tertiary, #f3f4f6);
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 24px;
          width: fit-content;
        }
        .tab-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          border-radius: 10px;
          border: none;
          background: none;
          font-size: 0.88rem;
          font-weight: 500;
          cursor: pointer;
          color: var(--text-secondary, #6b7280);
          transition: all 0.15s;
        }
        .tab-btn.active {
          background: var(--bg-secondary, #fff);
          color: var(--text-primary, #1f2937);
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
          font-weight: 600;
        }
        .badge {
          background: var(--accent-primary, #f97316);
          color: white;
          font-size: 0.68rem;
          padding: 2px 7px;
          border-radius: 10px;
          font-weight: 600;
        }

        .segment-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .segment-card {
          background: var(--bg-secondary, #fff);
          border: 2px solid var(--border-color, #e5e7eb);
          border-radius: 16px;
          padding: 28px;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
        }
        .segment-card:hover {
          border-color: var(--accent-primary, #f97316);
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(249, 115, 22, 0.12);
        }
        .segment-icons {
          display: flex;
          gap: 8px;
          color: var(--accent-primary, #f97316);
          margin-bottom: 16px;
        }
        .segment-card h3 {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary, #1f2937);
          margin: 0 0 8px;
        }
        .segment-desc {
          color: var(--text-secondary, #6b7280);
          font-size: 0.88rem;
          margin: 0 0 16px;
        }
        .segment-features {
          list-style: none;
          padding: 0;
          margin: 0 0 20px;
          flex: 1;
        }
        .segment-features li {
          font-size: 0.82rem;
          color: var(--text-secondary, #6b7280);
          padding: 5px 0;
          padding-left: 18px;
          position: relative;
        }
        .segment-features li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: 600;
          font-size: 0.75rem;
        }
        .segment-cta {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--accent-primary, #f97316);
        }

        .filter-bar {
          display: flex;
          gap: 6px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .filter-chip {
          padding: 7px 16px;
          border-radius: 20px;
          font-size: 0.8rem;
          border: 1px solid var(--border-color, #e5e7eb);
          background: var(--bg-secondary, #fff);
          cursor: pointer;
          color: var(--text-secondary, #6b7280);
          transition: all 0.15s;
        }
        .filter-chip.active {
          background: var(--accent-primary, #f97316);
          color: white;
          border-color: var(--accent-primary, #f97316);
        }

        .empty-state {
          text-align: center;
          padding: 48px 20px;
          color: var(--text-muted, #9ca3af);
        }
        .empty-state h3 { color: var(--text-primary, #1f2937); margin: 16px 0 8px; }
        .empty-state p { font-size: 0.88rem; margin: 0 0 20px; }
        .empty-cta {
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
        }

        .bookings-list { display: flex; flex-direction: column; gap: 12px; }
        .booking-card {
          background: var(--bg-secondary, #fff);
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 12px;
          padding: 18px;
          transition: all 0.15s;
          position: relative;
        }
        .booking-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }
        .booking-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .booking-ref {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .segment-tag {
          font-size: 0.72rem;
          background: var(--bg-tertiary, #f3f4f6);
          padding: 3px 8px;
          border-radius: 4px;
          color: var(--text-secondary, #6b7280);
        }
        .ref {
          font-family: monospace;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-primary, #1f2937);
        }
        .status-badge {
          font-size: 0.72rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 6px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .booking-route {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.88rem;
          color: var(--text-primary, #1f2937);
          margin-bottom: 10px;
        }
        .route-arrow { color: var(--text-muted, #9ca3af); }
        .booking-meta {
          display: flex;
          gap: 16px;
          font-size: 0.8rem;
          color: var(--text-secondary, #6b7280);
          flex-wrap: wrap;
        }
        .booking-price {
          font-weight: 600;
          color: var(--accent-primary, #f97316);
        }
        .booking-date { margin-left: auto; }
        .delete-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          color: var(--text-muted, #9ca3af);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          opacity: 0;
          transition: all 0.15s;
        }
        .booking-card:hover .delete-btn { opacity: 1; }
        .delete-btn:hover { color: #ef4444; background: rgba(239, 68, 68, 0.08); }

        @media (max-width: 768px) {
          .page-container { padding: 14px; padding-bottom: 100px; }
          .content-header h1 { font-size: 1.25rem; }
          .segment-cards { grid-template-columns: 1fr; gap: 14px; }
          .segment-card { padding: 20px; }
          .tabs-container { width: 100%; }
          .tab-btn { flex: 1; justify-content: center; padding: 12px 14px; font-size: 0.84rem; }
          .filter-chip { padding: 10px 16px; font-size: 0.82rem; }
          .booking-card { padding: 16px; }
          .booking-meta { gap: 8px; font-size: 0.78rem; }
          .booking-date { margin-left: 0; }
          .booking-route { flex-wrap: wrap; font-size: 0.84rem; }
          .delete-btn { opacity: 1; padding: 8px; }
          .empty-cta { width: 100%; padding: 14px 24px; }
        }
        @media (max-width: 480px) {
          .page-container { padding: 12px; padding-bottom: 100px; }
          .segment-card { padding: 16px; }
          .segment-card h3 { font-size: 1.05rem; }
          .segment-desc { font-size: 0.82rem; }
          .segment-features li { font-size: 0.78rem; }
          .segment-cta { font-size: 0.85rem; }
          .booking-header { flex-direction: column; align-items: flex-start; gap: 6px; }
          .booking-route { font-size: 0.8rem; }
          .ref { font-size: 0.82rem; }
          .status-badge { font-size: 0.68rem; }
          .filter-bar { gap: 5px; }
          .filter-chip { padding: 8px 12px; font-size: 0.78rem; }
        }
      `}</style>
      <Joyride
        steps={tourSteps}
        run={run}
        continuous
        showProgress
        showSkipButton
        scrollToFirstStep
        callback={handleJoyrideCallback}
        tooltipComponent={BefachTooltip}
        styles={joyrideStyles}
      />
      {!run && <TourFAB onStart={startTour} />}
    </AppLayout>
  );
}

export default function BookShipmentPage() {
  return (
    <Suspense fallback={null}>
      <BookShipmentContent />
    </Suspense>
  );
}
