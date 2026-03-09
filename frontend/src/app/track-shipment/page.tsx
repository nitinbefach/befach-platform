'use client';

/**
 * Track Shipment Page
 *
 * Platform-integrated tracking portal with:
 * - AppLayout with sidebar navigation
 * - My Shipments quick access section
 * - Animated search interface
 * - Detailed shipment timeline
 * - Mobile-optimized design with BottomNav
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { AppLayout } from '@/components/layout';
import { useFeedbackTrigger } from '@/hooks/useFeedbackTrigger';
import { trackShipment, ShipmentTracking, formatShipmentNumber, getTimelineStatusColor } from '@/lib/tracking';
import { usePrefersReducedMotion, useMobile } from '@/hooks/useMobile';
import { Suspense } from 'react';
import { useTour } from '@/hooks/useTour';
import { trackShipmentTourSteps, mobileTrackShipmentTourSteps } from '@/lib/tourSteps';
import TourFAB from '@/components/walkthrough/TourFAB';
import { Package, Ship, MapPin, Clock, ChevronRight, Bookmark, Calendar, Check, Info } from 'lucide-react';
import { safeStorage } from '@/lib/safeStorage';
import { captureFeatureAction } from '@/lib/posthogEvents';

// Types for tracked shipments
interface TrackedShipment {
  id: string;
  trackingNumber: string;
  type: 'container' | 'bl' | 'booking';
  origin: string;
  destination: string;
  status: 'in-transit' | 'arrived' | 'customs' | 'delivered';
  eta: string;
  lastUpdate: string;
  carrier?: string;
}

// Status color mapping
const statusColors: Record<string, string> = {
  'in-transit': '#3b82f6',
  'arrived': '#10b981',
  'customs': '#f59e0b',
  'delivered': '#22c55e'
};

// Mock data for demonstration
const mockTrackedShipments: TrackedShipment[] = [
  {
    id: '1',
    trackingNumber: 'MAEU123456789',
    type: 'container',
    origin: 'Shanghai, CN',
    destination: 'Mumbai, IN',
    status: 'in-transit',
    eta: 'Feb 12, 2026',
    lastUpdate: '2 hours ago',
    carrier: 'Maersk Line'
  },
  {
    id: '2',
    trackingNumber: 'BL-2024-78901',
    type: 'bl',
    origin: 'Rotterdam, NL',
    destination: 'Chennai, IN',
    status: 'customs',
    eta: 'Feb 8, 2026',
    lastUpdate: '1 day ago',
    carrier: 'MSC'
  },
  {
    id: '3',
    trackingNumber: 'COSCO987654',
    type: 'container',
    origin: 'Ningbo, CN',
    destination: 'JNPT, IN',
    status: 'arrived',
    eta: 'Feb 5, 2026',
    lastUpdate: '3 hours ago',
    carrier: 'COSCO'
  }
];

// ShipmentCard Component
function ShipmentCard({
  shipment,
  onClick,
  variant = 'full'
}: {
  shipment: TrackedShipment;
  onClick: () => void;
  variant?: 'compact' | 'full';
}) {
  return (
    <button className={`shipment-card ${variant}`} onClick={onClick}>
      <div className="shipment-header">
        <span className="tracking-num">{shipment.trackingNumber}</span>
        <span
          className="status-pill"
          style={{
            backgroundColor: `${statusColors[shipment.status]}15`,
            color: statusColors[shipment.status]
          }}
        >
          {shipment.status.replace('-', ' ')}
        </span>
      </div>
      <div className="shipment-route">
        <MapPin size={14} />
        {shipment.origin} → {shipment.destination}
      </div>
      {variant === 'full' && (
        <>
          <div className="shipment-eta">
            <Clock size={14} />
            ETA: {shipment.eta}
          </div>
          {shipment.carrier && (
            <div className="shipment-carrier">
              <Ship size={14} />
              {shipment.carrier}
            </div>
          )}
        </>
      )}
      <div className="shipment-updated">Updated {shipment.lastUpdate}</div>
    </button>
  );
}

// MyShipmentsSection Component
function MyShipmentsSection({
  shipments,
  onTrack,
  isMobile
}: {
  shipments: TrackedShipment[];
  onTrack: (trackingNumber: string) => void;
  isMobile: boolean;
}) {
  if (shipments.length === 0) {
    return (
      <div className="empty-shipments">
        <div className="empty-icon">
          <Package size={48} strokeWidth={1.5} />
        </div>
        <h3>No shipments tracked yet</h3>
        <p>Enter a tracking number below to start tracking your shipments</p>
      </div>
    );
  }

  return (
    <section className="my-shipments-section">
      <div className="section-header">
        <h2>
          <Package size={20} />
          My Shipments
        </h2>
        <Link href="/my-orders" className="view-all-link">
          View All <ChevronRight size={16} />
        </Link>
      </div>
      <div className={isMobile ? "shipments-stack" : "shipments-grid"}>
        {shipments.slice(0, isMobile ? 3 : 4).map(shipment => (
          <ShipmentCard
            key={shipment.id}
            shipment={shipment}
            onClick={() => onTrack(shipment.trackingNumber)}
            variant={isMobile ? 'compact' : 'full'}
          />
        ))}
      </div>
    </section>
  );
}

function TrackShipmentContent() {
  const { triggerTimeBasedFeedback, promptElement } = useFeedbackTrigger();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [shipmentData, setShipmentData] = useState<ShipmentTracking | null>(null);
  const [expandedStage, setExpandedStage] = useState<string | null>('5');

  useEffect(() => {
    triggerTimeBasedFeedback('shipment-tracking', 20000);
  }, [triggerTimeBasedFeedback]);
  const [trackedShipments, setTrackedShipments] = useState<TrackedShipment[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  const prefersReducedMotion = usePrefersReducedMotion();
  const { isMobile } = useMobile();
  const tourSteps = isMobile ? mobileTrackShipmentTourSteps : trackShipmentTourSteps;
  const { startTour, isActive: tourActive } = useTour({ tourId: 'track-shipment', steps: tourSteps });

  // Load tracked shipments from localStorage
  useEffect(() => {
    const saved = safeStorage.getItem('tracked_shipments');
    if (saved) {
      try {
        setTrackedShipments(JSON.parse(saved));
      } catch {
        // Use mock data if parse fails
        setTrackedShipments(mockTrackedShipments);
      }
    } else {
      // Use mock data for demonstration
      setTrackedShipments(mockTrackedShipments);
    }
  }, []);

  // Check if current shipment is saved
  useEffect(() => {
    if (shipmentData) {
      const exists = trackedShipments.some(
        s => s.trackingNumber === shipmentData.shipmentNumber
      );
      setIsSaved(exists);
    }
  }, [shipmentData, trackedShipments]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = await trackShipment(trackingNumber);
      if (data) {
        setShipmentData(data);
        captureFeatureAction('shipment', 'tracked', { tracking_number: trackingNumber });
      } else {
        setError('No shipment found with this tracking number. Try: 0037');
      }
    } catch (err) {
      setError('Failed to track shipment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickTrack = (trackingNum: string) => {
    setTrackingNumber(trackingNum);
    // Simulate tracking with the number
    setIsLoading(true);
    setError('');
    trackShipment(trackingNum).then(data => {
      if (data) {
        setShipmentData(data);
      }
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  };

  const handleTrackAnother = () => {
    setShipmentData(null);
    setTrackingNumber('');
    setError('');
    setIsSaved(false);
  };

  const handleSaveShipment = () => {
    if (!shipmentData) return;

    const newShipment: TrackedShipment = {
      id: crypto.randomUUID(),
      trackingNumber: shipmentData.shipmentNumber,
      type: 'container',
      origin: `${shipmentData.origin.city}, ${shipmentData.origin.country}`,
      destination: `${shipmentData.destination.city}, ${shipmentData.destination.country}`,
      status: shipmentData.progress === 100 ? 'delivered' : 'in-transit',
      eta: shipmentData.estimatedDelivery,
      lastUpdate: 'Just now',
      carrier: shipmentData.carrier
    };

    const updated = [newShipment, ...trackedShipments.filter(s => s.trackingNumber !== newShipment.trackingNumber)];
    setTrackedShipments(updated);
    safeStorage.setItem('tracked_shipments', JSON.stringify(updated));
    setIsSaved(true);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }
    }
  };

  return (
    <AppLayout>      <div className={`track-page ${isMobile ? 'mobile' : 'web'}`}>
        {/* My Shipments Section - Always visible at top */}
        {!shipmentData && (
          <motion.div
            id="track-shipments"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <MyShipmentsSection
              shipments={trackedShipments}
              onTrack={handleQuickTrack}
              isMobile={isMobile}
            />
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {!shipmentData ? (
            /* ========== SEARCH VIEW ========== */
            <motion.div
              key="search"
              id="track-search"
              className="search-view"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              variants={containerVariants}
            >
              <motion.div className="search-container" variants={itemVariants}>
                {/* Package Icon */}
                <motion.div
                  className="tracking-icon"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </motion.div>

                {/* Title */}
                <motion.h1 className="search-title" variants={itemVariants}>
                  Track a Shipment
                </motion.h1>

                {/* Subtitle - hidden on mobile via CSS */}
                <motion.p className="search-subtitle" variants={itemVariants}>
                  Enter your BL, container, or booking number.
                </motion.p>

                {/* Search Form */}
                <motion.form onSubmit={handleTrack} className="search-form" variants={itemVariants}>
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number (e.g., 0037)"
                      className="tracking-input"
                      disabled={isLoading}
                    />
                    <motion.button
                      type="submit"
                      className="track-btn"
                      disabled={isLoading}
                      whileHover={!prefersReducedMotion ? { scale: 1.02 } : undefined}
                      whileTap={!prefersReducedMotion ? { scale: 0.98 } : undefined}
                    >
                      {isLoading ? <span className="btn-spinner" /> : 'Track'}
                    </motion.button>
                  </div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        className="error-msg"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.form>

                {/* Quick Tip */}
                <motion.p className="quick-tip-text" variants={itemVariants}>
                  Try: <strong>0037</strong> for a demo shipment
                </motion.p>
              </motion.div>
            </motion.div>
          ) : (
            /* ========== RESULTS VIEW ========== */
            <motion.div
              key="results"
              className="results-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Alert Banner */}
              {shipmentData.alerts && shipmentData.alerts.length > 0 && (
                <motion.div
                  className="alert-banner"
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="alert-icon"><Info size={14} /></span>
                  <strong>Important Note:</strong> {shipmentData.alerts[0].message}
                </motion.div>
              )}

              {/* Header */}
              <motion.div
                className="results-header"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="header-left">
                  <h1 className="shipment-number">Shipment {formatShipmentNumber(shipmentData.shipmentNumber)}</h1>
                  <p className="shipment-status">
                    Current Status: <strong>{shipmentData.currentStatus}</strong>
                    <span className="status-badge delivered">Delivered</span>
                  </p>
                </div>
                <div className="header-actions">
                  <motion.button
                    onClick={handleSaveShipment}
                    className={`save-btn ${isSaved ? 'saved' : ''}`}
                    disabled={isSaved}
                    whileHover={!isSaved ? { scale: 1.02 } : undefined}
                    whileTap={!isSaved ? { scale: 0.98 } : undefined}
                  >
                    <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
                    {isSaved ? 'Saved' : 'Save'}
                  </motion.button>
                  <motion.button
                    onClick={handleTrackAnother}
                    className="track-another-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                      <line x1="19" y1="12" x2="5" y2="12" />
                      <polyline points="12 19 5 12 12 5" />
                    </svg>
                    Track Another
                  </motion.button>
                </div>
              </motion.div>

              {/* Main Content */}
              <div className="results-content">
                {/* Left Column */}
                <div className="left-col">
                  {/* Summary Card */}
                  <motion.div
                    className="card summary-card"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2>Shipment Summary</h2>
                    <div className="freight-badge">
                      <span className="freight-icon"><Ship size={16} /></span>
                      <span>{shipmentData.carrier}</span>
                    </div>

                    <div className="route-section">
                      <div className="route-point">
                        <span className="point-label">From</span>
                        <strong>{shipmentData.origin.city}, {shipmentData.origin.country}</strong>
                      </div>
                      <div className="route-arrow">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </div>
                      <div className="route-point">
                        <span className="point-label">To</span>
                        <strong>{shipmentData.destination.city}, {shipmentData.destination.country}</strong>
                      </div>
                    </div>

                    <div className="progress-section">
                      <div className="progress-header">
                        <span>Shipment Progress</span>
                        <span className="progress-value">{shipmentData.progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <motion.div
                          className="progress-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${shipmentData.progress}%` }}
                          transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                        />
                      </div>
                    </div>

                    <div className="last-update">
                      <div className="update-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </div>
                      <div className="update-info">
                        <span className="update-label">Last Updated</span>
                        <strong>{shipmentData.lastUpdated}</strong>
                      </div>
                    </div>
                  </motion.div>

                  {/* Details Card */}
                  <motion.div
                    className="card details-card"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3><Package size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} /> Shipment Details</h3>
                    <div className="details-grid">
                      <div className="detail-item">
                        <span className="detail-label">Package Count</span>
                        <strong>{shipmentData.packages.count}</strong>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Package Type</span>
                        <strong>{shipmentData.packages.type}</strong>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Weight</span>
                        <strong>{shipmentData.packages.weight}</strong>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Dimensions</span>
                        <strong>{shipmentData.packages.dimensions}</strong>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">HS Code</span>
                        <strong>{shipmentData.packages.hsCode}</strong>
                      </div>
                    </div>

                    <div className="contents-section">
                      <span className="detail-label">Package Contents</span>
                      <div className="contents-box">{shipmentData.packages.contents}</div>
                    </div>

                    <div className="delivery-estimate">
                      <div className="estimate-icon"><Calendar size={18} /></div>
                      <div className="estimate-info">
                        <span className="estimate-label">Estimated Delivery</span>
                        <strong>{shipmentData.estimatedDelivery}</strong>
                        <span className="estimate-days">{shipmentData.daysFromPickup} days from pickup</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Contact Card */}
                  <motion.div
                    className="card contact-card"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3>Contact Information</h3>
                    <div className="contacts-grid">
                      <div className="contact-item">
                        <span className="contact-label">Shipper</span>
                        <strong>{shipmentData.contacts.shipper.name}</strong>
                        <p>{shipmentData.contacts.shipper.address}</p>
                      </div>
                      <div className="contact-item">
                        <span className="contact-label">Buyer</span>
                        <strong>{shipmentData.contacts.buyer.name}</strong>
                        <p>{shipmentData.contacts.buyer.address}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Right Column - Timeline */}
                <div className="right-col">
                  <motion.div
                    className="card timeline-card"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="timeline-header">
                      <h2>Shipment Timeline</h2>
                      <span className="timeline-progress">{shipmentData.progress}% Complete</span>
                    </div>

                    <div className="timeline">
                      {shipmentData.timeline.map((event, index) => (
                        <motion.div
                          key={event.id}
                          className={`timeline-item ${event.status}`}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                        >
                          <div className="timeline-indicator">
                            <span
                              className={`status-dot ${event.status}`}
                              style={{ backgroundColor: getTimelineStatusColor(event.status) }}
                            >
                              {event.status === 'completed' && <Check size={14} />}
                            </span>
                            {index < shipmentData.timeline.length - 1 && <div className="timeline-line" />}
                          </div>

                          <div className="timeline-content">
                            <span className={`event-badge ${event.status}`}>
                              {event.status === 'completed' ? 'Completed' :
                               event.status === 'in_progress' ? 'In Progress' : 'Pending'}
                            </span>
                            <h4>{event.title}</h4>
                            {event.description && <p className="event-desc">{event.description}</p>}
                            {event.location && (
                              <p className="event-location">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                  <circle cx="12" cy="10" r="3" />
                                </svg>
                                {event.location}
                              </p>
                            )}

                            {/* Substages */}
                            {event.substages && (
                              <div className="substages">
                                <button
                                  className="substages-toggle"
                                  onClick={() => setExpandedStage(expandedStage === event.id ? null : event.id)}
                                >
                                  <span>View sub-stages ({event.substages.length})</span>
                                  <motion.span animate={{ rotate: expandedStage === event.id ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                    ▼
                                  </motion.span>
                                </button>

                                <AnimatePresence>
                                  {expandedStage === event.id && (
                                    <motion.div
                                      className="substages-list"
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.3 }}
                                    >
                                      {event.substages.map((substage) => (
                                        <div key={substage.id} className={`substage-item ${substage.status}`}>
                                          <span
                                            className="substage-dot"
                                            style={{ backgroundColor: getTimelineStatusColor(substage.status) }}
                                          >
                                            {substage.status === 'completed' && <Check size={14} />}
                                          </span>
                                          <span className={`substage-status ${substage.status}`}>
                                            {substage.status === 'completed' ? 'Done' :
                                             substage.status === 'in_progress' ? 'Active' : 'Pending'}
                                          </span>
                                          <span className="substage-title">{substage.title}</span>
                                        </div>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Documents Card */}
                  <motion.div
                    className="card docs-card"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h3>Shipment Documents</h3>
                    <div className="no-docs">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="12" y1="18" x2="12" y2="12" />
                        <line x1="9" y1="15" x2="15" y2="15" />
                      </svg>
                      <p>No documents available yet</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .track-page {
          min-height: calc(100vh - 80px);
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .track-page.mobile {
          padding: 16px;
          padding-bottom: calc(16px + 80px); /* Account for BottomNav */
        }

        /* ========== MY SHIPMENTS SECTION ========== */
        .my-shipments-section {
          margin-bottom: 32px;
        }

        .my-shipments-section .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .my-shipments-section .section-header h2 {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary, #1f2937);
          margin: 0;
        }

        .view-all-link {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #f97316;
          font-size: 0.9rem;
          font-weight: 500;
          text-decoration: none;
          transition: opacity 0.2s;
        }

        .view-all-link:hover {
          opacity: 0.8;
        }

        .shipments-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .shipments-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .shipment-card {
          background: var(--bg-secondary, #ffffff);
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 12px;
          padding: 16px;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
        }

        .shipment-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          border-color: #f97316;
        }

        .shipment-card .shipment-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }

        .shipment-card .tracking-num {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary, #1f2937);
        }

        .shipment-card .status-pill {
          font-size: 0.7rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
          text-transform: capitalize;
        }

        .shipment-card .shipment-route,
        .shipment-card .shipment-eta,
        .shipment-card .shipment-carrier {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: var(--text-secondary, #6b7280);
          margin-bottom: 6px;
        }

        .shipment-card .shipment-updated {
          font-size: 0.75rem;
          color: var(--text-tertiary, #9ca3af);
          margin-top: 8px;
        }

        .shipment-card.compact .shipment-header {
          margin-bottom: 8px;
        }

        .empty-shipments {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background: var(--bg-secondary, #ffffff);
          border: 2px dashed var(--border-color, #e5e7eb);
          border-radius: 16px;
          text-align: center;
          margin-bottom: 32px;
        }

        .empty-shipments .empty-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          color: #f97316;
        }

        .empty-shipments h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary, #1f2937);
          margin: 0 0 8px 0;
        }

        .empty-shipments p {
          font-size: 0.9rem;
          color: var(--text-secondary, #6b7280);
          margin: 0;
        }

        /* ========== SEARCH VIEW STYLES ========== */
        .search-view {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background: var(--bg-secondary, #ffffff);
          border-radius: 20px;
          border: 1px solid var(--border-color, #e5e7eb);
        }

        .search-container {
          position: relative;
          z-index: 1;
          max-width: 580px;
          width: 100%;
          text-align: center;
        }

        .tracking-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
          background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(249, 115, 22, 0.15);
        }

        .tracking-icon svg {
          width: 40px;
          height: 40px;
          color: #f97316;
        }

        .search-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 12px;
          letter-spacing: -0.02em;
        }

        .search-subtitle {
          color: #6b7280;
          font-size: 1.1rem;
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .search-form {
          width: 100%;
        }

        .input-wrapper {
          display: flex;
          align-items: center;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 16px;
          padding: 6px 6px 6px 20px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .input-wrapper:focus-within {
          border-color: #f97316;
          box-shadow: 0 8px 30px rgba(249, 115, 22, 0.15);
        }

        .input-icon {
          color: #9ca3af;
          margin-right: 12px;
          flex-shrink: 0;
        }

        .input-icon svg {
          width: 22px;
          height: 22px;
        }

        .tracking-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 1.05rem;
          color: #1f2937;
          background: transparent;
          padding: 14px 0;
        }

        .tracking-input::placeholder {
          color: #9ca3af;
        }

        .track-btn {
          padding: 14px 32px;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 100px;
        }

        .track-btn:hover:not(:disabled) {
          box-shadow: 0 8px 20px rgba(249, 115, 22, 0.35);
        }

        .track-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .error-msg {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 16px;
          padding: 12px 20px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          color: #dc2626;
          font-size: 0.9rem;
        }

        .error-msg svg {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }

        .quick-tip-text {
          margin-top: 24px;
          color: #9ca3af;
          font-size: 0.85rem;
          text-align: center;
        }

        .quick-tip-text strong {
          color: #f97316;
        }

        /* ========== RESULTS VIEW STYLES ========== */
        .results-view {
          padding: 0;
        }

        .alert-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 24px;
          background: linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%);
          color: #1e40af;
          font-size: 0.95rem;
          border-left: 4px solid #3b82f6;
        }

        .alert-icon {
          font-size: 1.25rem;
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 32px;
          background: white;
          border-bottom: 1px solid #e5e7eb;
        }

        .shipment-number {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .shipment-status {
          color: #6b7280;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .status-badge {
          display: inline-flex;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .status-badge.delivered {
          background: #d1fae5;
          color: #047857;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .save-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .save-btn:hover:not(:disabled) {
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.35);
        }

        .save-btn.saved {
          background: #d1fae5;
          color: #047857;
          cursor: default;
        }

        .track-another-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: var(--bg-secondary, white);
          color: #3b82f6;
          border: 2px solid #3b82f6;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .track-another-btn:hover {
          background: #3b82f6;
          color: white;
        }

        .results-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          padding: 24px 32px;
        }

        .left-col, .right-col {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          border: 1px solid #f1f5f9;
        }

        .card h2, .card h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 20px;
        }

        /* Summary Card */
        .freight-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: #f8fafc;
          border-radius: 10px;
          margin-bottom: 24px;
        }

        .freight-icon {
          font-size: 1.25rem;
        }

        .route-section {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          padding: 16px;
          background: #fafafa;
          border-radius: 12px;
        }

        .route-point {
          flex: 1;
        }

        .route-point .point-label {
          display: block;
          font-size: 0.8rem;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }

        .route-point strong {
          color: #1f2937;
          font-size: 0.95rem;
        }

        .route-arrow {
          color: #d1d5db;
        }

        .route-arrow svg {
          width: 24px;
          height: 24px;
        }

        .progress-section {
          margin-bottom: 24px;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 0.9rem;
        }

        .progress-header span:first-child {
          color: #6b7280;
        }

        .progress-value {
          font-weight: 600;
          color: #f97316;
        }

        .progress-bar {
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #f97316 0%, #fb923c 100%);
          border-radius: 4px;
        }

        .last-update {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #eff6ff;
          border-radius: 12px;
          border-left: 4px solid #3b82f6;
        }

        .update-icon {
          width: 40px;
          height: 40px;
          background: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3b82f6;
        }

        .update-icon svg {
          width: 20px;
          height: 20px;
        }

        .update-label {
          display: block;
          font-size: 0.8rem;
          color: #6b7280;
          margin-bottom: 2px;
        }

        .update-info strong {
          color: #1f2937;
          font-size: 0.95rem;
        }

        /* Details Card */
        .details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }

        .detail-item {
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
        }

        .detail-label {
          display: block;
          font-size: 0.8rem;
          color: #9ca3af;
          margin-bottom: 4px;
        }

        .detail-item strong {
          color: #1f2937;
          font-size: 0.95rem;
        }

        .contents-section {
          margin-bottom: 20px;
        }

        .contents-box {
          margin-top: 8px;
          padding: 14px;
          background: #f8fafc;
          border-radius: 8px;
          color: #374151;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .delivery-estimate {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px;
          background: #d1fae5;
          border-radius: 12px;
        }

        .estimate-icon {
          font-size: 2rem;
        }

        .estimate-label {
          display: block;
          font-size: 0.8rem;
          color: #065f46;
          margin-bottom: 2px;
        }

        .estimate-info strong {
          display: block;
          color: #047857;
          font-size: 1.05rem;
          margin-bottom: 2px;
        }

        .estimate-days {
          font-size: 0.8rem;
          color: #059669;
        }

        /* Contact Card */
        .contacts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .contact-item {
          padding: 16px;
          background: #f8fafc;
          border-radius: 10px;
        }

        .contact-label {
          display: block;
          font-size: 0.8rem;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }

        .contact-item strong {
          display: block;
          color: #1f2937;
          margin-bottom: 6px;
        }

        .contact-item p {
          font-size: 0.85rem;
          color: #6b7280;
          line-height: 1.5;
          margin: 0;
        }

        /* Timeline Card */
        .timeline-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .timeline-progress {
          font-size: 0.85rem;
          color: #f97316;
          font-weight: 600;
          padding: 6px 12px;
          background: #fff7ed;
          border-radius: 20px;
        }

        .timeline {
          display: flex;
          flex-direction: column;
        }

        .timeline-item {
          display: flex;
          position: relative;
        }

        .timeline-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-right: 16px;
        }

        .status-dot {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: bold;
          color: white;
          flex-shrink: 0;
          z-index: 1;
        }

        .status-dot.pending {
          background: white !important;
          border: 2px solid #d1d5db;
          color: #d1d5db;
        }

        .timeline-line {
          width: 2px;
          flex: 1;
          background: #e5e7eb;
          margin: 6px 0;
          min-height: 50px;
        }

        .timeline-content {
          flex: 1;
          padding-bottom: 28px;
        }

        .event-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }

        .event-badge.completed {
          background: #d1fae5;
          color: #047857;
        }

        .event-badge.in_progress {
          background: #ede9fe;
          color: #7c3aed;
        }

        .event-badge.pending {
          background: #f3f4f6;
          color: #6b7280;
        }

        .timeline-content h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .event-desc {
          font-size: 0.9rem;
          color: #6b7280;
          margin: 0 0 8px 0;
          line-height: 1.5;
        }

        .event-location {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: #3b82f6;
          margin: 0;
        }

        /* Substages */
        .substages {
          margin-top: 12px;
        }

        .substages-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 10px 14px;
          background: #f8fafc;
          border: none;
          border-radius: 8px;
          font-size: 0.85rem;
          color: #6b7280;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .substages-toggle:hover {
          background: #f1f5f9;
        }

        .substages-list {
          margin-top: 10px;
          padding-left: 16px;
          border-left: 2px solid #e5e7eb;
          overflow: hidden;
        }

        .substage-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 0;
        }

        .substage-dot {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.55rem;
          font-weight: bold;
          color: white;
          flex-shrink: 0;
        }

        .substage-item.pending .substage-dot {
          background: white !important;
          border: 2px solid #d1d5db;
        }

        .substage-status {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          min-width: 50px;
        }

        .substage-status.completed { color: #047857; }
        .substage-status.in_progress { color: #7c3aed; }
        .substage-status.pending { color: #9ca3af; }

        .substage-title {
          flex: 1;
          font-size: 0.85rem;
          color: #374151;
        }

        /* Documents Card */
        .no-docs {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 20px;
          color: #9ca3af;
        }

        .no-docs svg {
          margin-bottom: 12px;
          opacity: 0.5;
        }

        .no-docs p {
          font-size: 0.9rem;
          margin: 0;
        }

        /* ========== RESPONSIVE ========== */
        @media (max-width: 1200px) {
          .shipments-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 1024px) {
          .shipments-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .results-content {
            grid-template-columns: 1fr;
            padding: 20px;
          }
        }

        @media (max-width: 768px) {
          .track-page {
            padding: 16px;
          }

          .track-page.mobile {
            padding-bottom: calc(16px + 80px);
          }

          .shipments-grid {
            grid-template-columns: 1fr;
          }

          .search-view {
            padding: 24px 16px;
            border-radius: 16px;
          }

          .search-title {
            font-size: 1.5rem;
          }

          .search-subtitle {
            display: none;
          }

          .input-wrapper {
            flex-direction: column;
            padding: 16px;
            gap: 12px;
          }

          .input-icon {
            display: none;
          }

          .tracking-input {
            width: 100%;
            text-align: center;
          }

          .track-btn {
            width: 100%;
            padding: 14px;
          }

          .results-header {
            flex-direction: column;
            gap: 12px;
            padding: 16px;
          }

          .header-actions {
            flex-direction: row;
            width: 100%;
            gap: 8px;
          }

          .save-btn,
          .track-another-btn {
            flex: 1;
            justify-content: center;
            padding: 10px;
            font-size: 0.85rem;
          }

          .shipment-number {
            font-size: 1.25rem;
          }

          .shipment-status {
            font-size: 0.85rem;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }

          .contacts-grid {
            grid-template-columns: 1fr;
          }

          /* Keep route horizontal on mobile - compact single line */
          .route-section {
            flex-direction: row;
            gap: 8px;
            align-items: center;
          }

          .route-point {
            flex: 1;
          }

          .route-point strong {
            font-size: 0.85rem;
          }

          .point-label {
            font-size: 0.7rem;
          }

          .route-arrow {
            transform: none;
            flex-shrink: 0;
          }

          /* Larger timeline text */
          .timeline-desc {
            font-size: 0.875rem;
          }

          .timeline-location {
            font-size: 0.8rem;
          }

          .tracking-icon {
            width: 56px;
            height: 56px;
          }

          .tracking-icon svg {
            width: 28px;
            height: 28px;
          }

          .my-shipments-section .section-header h2 {
            font-size: 1rem;
          }

          /* Compact cards on mobile */
          .card {
            padding: 16px;
          }

          .card h2 {
            font-size: 1rem;
          }

          .shipment-card {
            padding: 12px;
          }

          .tracking-num {
            font-size: 0.8rem;
          }
        }

        /* ========== DARK MODE ========== */
        [data-theme="dark"] .track-page {
          background: transparent;
        }

        [data-theme="dark"] .search-view {
          background: var(--bg-secondary, #1c1c1c);
          border-color: var(--border-color, #2a2a2a);
        }

        [data-theme="dark"] .search-title,
        [data-theme="dark"] .shipment-number,
        [data-theme="dark"] .my-shipments-section .section-header h2 {
          color: #f5f5f4;
        }

        [data-theme="dark"] .search-subtitle {
          color: #a8a29e;
        }

        [data-theme="dark"] .input-wrapper {
          background: #262626;
          border-color: #3a3a3a;
        }

        [data-theme="dark"] .tracking-input {
          color: #f5f5f4;
        }

        [data-theme="dark"] .quick-tip-text {
          color: #78716c;
        }

        [data-theme="dark"] .shipment-card {
          background: var(--bg-secondary, #1c1c1c);
          border-color: var(--border-color, #2a2a2a);
        }

        [data-theme="dark"] .shipment-card:hover {
          border-color: #f97316;
        }

        [data-theme="dark"] .shipment-card .tracking-num {
          color: #f5f5f4;
        }

        [data-theme="dark"] .empty-shipments {
          background: var(--bg-secondary, #1c1c1c);
          border-color: var(--border-color, #3a3a3a);
        }

        [data-theme="dark"] .empty-shipments h3 {
          color: #f5f5f4;
        }

        [data-theme="dark"] .card {
          background: #1c1c1c;
          border-color: #2a2a2a;
        }

        [data-theme="dark"] .card h2,
        [data-theme="dark"] .card h3,
        [data-theme="dark"] .card h4 {
          color: #f5f5f4;
        }

        [data-theme="dark"] .results-header {
          background: #1c1c1c;
          border-color: #2a2a2a;
        }

        [data-theme="dark"] .track-another-btn {
          background: #262626;
          border-color: #3b82f6;
        }

        [data-theme="dark"] .detail-item,
        [data-theme="dark"] .contact-item,
        [data-theme="dark"] .freight-badge,
        [data-theme="dark"] .route-section,
        [data-theme="dark"] .contents-box {
          background: #262626;
        }

        [data-theme="dark"] .detail-item strong,
        [data-theme="dark"] .contact-item strong,
        [data-theme="dark"] .route-point strong,
        [data-theme="dark"] .update-info strong {
          color: #f5f5f4;
        }

        [data-theme="dark"] .substages-toggle {
          background: #262626;
        }

        [data-theme="dark"] .substages-toggle:hover {
          background: #333333;
        }
      `}</style>
      {promptElement}
      {!tourActive && <TourFAB onStart={startTour} />}
    </AppLayout>
  );
}

export default function TrackShipmentPage() {
  return (
    <Suspense fallback={null}>
      <TrackShipmentContent />
    </Suspense>
  );
}
