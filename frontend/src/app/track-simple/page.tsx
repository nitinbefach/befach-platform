'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import Link from 'next/link';

interface TrackingInfo {
  orderId: string;
  product: string;
  status: 'processing' | 'shipped' | 'in_transit' | 'customs' | 'delivered';
  estimatedDelivery: string;
  timeline: Array<{
    status: string;
    date: string;
    location?: string;
    completed: boolean;
    current?: boolean;
  }>;
  shipmentDetails: {
    carrier: string;
    trackingNumber: string;
    origin: string;
    destination: string;
    weight: string;
  };
}

const mockOrders: Record<string, TrackingInfo> = {
  'ORD-2024-0847': {
    orderId: 'ORD-2024-0847',
    product: 'Organic Turmeric Powder',
    status: 'in_transit',
    estimatedDelivery: 'December 5, 2024',
    timeline: [
      { status: 'Order Placed', date: 'Nov 15, 2024', completed: true },
      { status: 'Processing', date: 'Nov 16, 2024', completed: true },
      { status: 'Shipped from Origin', date: 'Nov 20, 2024', location: 'Ho Chi Minh City, Vietnam', completed: true },
      { status: 'In Transit', date: 'Nov 24, 2024', location: 'Singapore Port', completed: true, current: true },
      { status: 'Customs Clearance', date: 'Expected Dec 2', completed: false },
      { status: 'Out for Delivery', date: 'Expected Dec 4', completed: false },
      { status: 'Delivered', date: 'Expected Dec 5', completed: false },
    ],
    shipmentDetails: {
      carrier: 'Maersk Line',
      trackingNumber: 'MAEU123456789',
      origin: 'Ho Chi Minh City, Vietnam',
      destination: 'Mumbai, India',
      weight: '2,500 kg'
    }
  },
  'ORD-2024-0812': {
    orderId: 'ORD-2024-0812',
    product: 'Black Pepper - Premium Grade',
    status: 'customs',
    estimatedDelivery: 'December 1, 2024',
    timeline: [
      { status: 'Order Placed', date: 'Nov 10, 2024', completed: true },
      { status: 'Processing', date: 'Nov 11, 2024', completed: true },
      { status: 'Shipped from Origin', date: 'Nov 14, 2024', location: 'Kochi, Kerala', completed: true },
      { status: 'In Transit', date: 'Nov 18, 2024', completed: true },
      { status: 'Customs Clearance', date: 'Nov 26, 2024', location: 'JNPT Mumbai', completed: true, current: true },
      { status: 'Out for Delivery', date: 'Expected Nov 30', completed: false },
      { status: 'Delivered', date: 'Expected Dec 1', completed: false },
    ],
    shipmentDetails: {
      carrier: 'Road Transport',
      trackingNumber: 'RT-MH-2024-8812',
      origin: 'Kochi, Kerala',
      destination: 'Delhi, India',
      weight: '1,000 kg'
    }
  }
};

export default function TrackSimplePage() {
  const [searchId, setSearchId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<TrackingInfo | null>(null);
  const [activeOrders] = useState<TrackingInfo[]>(Object.values(mockOrders));
  const [error, setError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const order = mockOrders[searchId.toUpperCase()];
    if (order) {
      setSelectedOrder(order);
    } else {
      setError('Order not found. Please check the order ID.');
    }
  };

  const getStatusColor = (status: TrackingInfo['status']) => {
    const colors = {
      processing: '#3b82f6',
      shipped: '#8b5cf6',
      in_transit: '#f59e0b',
      customs: '#ef4444',
      delivered: '#10b981'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusLabel = (status: TrackingInfo['status']) => {
    const labels = {
      processing: 'Processing',
      shipped: 'Shipped',
      in_transit: 'In Transit',
      customs: 'Customs Clearance',
      delivered: 'Delivered'
    };
    return labels[status] || status;
  };

  return (
    <AppLayout>
      <div className="content-header">
        <h1>📦 Track Your Shipment</h1>
        <p>Enter your order ID or select from your active orders</p>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input 
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter Order ID (e.g., ORD-2024-0847)"
            className="search-input"
          />
          <button type="submit" className="btn-primary">Track</button>
        </form>
        {error && <p className="search-error">{error}</p>}
      </div>

      {/* Active Orders Quick Select */}
      {!selectedOrder && (
        <div className="active-orders">
          <h2>Your Active Orders</h2>
          <div className="orders-grid">
            {activeOrders.map(order => (
              <div 
                key={order.orderId}
                className="order-card"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="order-card-header">
                  <span className="order-id">{order.orderId}</span>
                  <span 
                    className="status-badge"
                    style={{ background: getStatusColor(order.status) }}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </div>
                <h3>{order.product}</h3>
                <p className="eta">ETA: {order.estimatedDelivery}</p>
                <button className="track-btn">Track This Order →</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tracking Details */}
      {selectedOrder && (
        <div className="tracking-details">
          <button className="back-btn" onClick={() => setSelectedOrder(null)}>
            ← Back to Orders
          </button>

          <div className="tracking-header">
            <div>
              <span className="order-id-large">{selectedOrder.orderId}</span>
              <h2>{selectedOrder.product}</h2>
            </div>
            <span 
              className="status-badge-large"
              style={{ background: getStatusColor(selectedOrder.status) }}
            >
              {getStatusLabel(selectedOrder.status)}
            </span>
          </div>

          <div className="tracking-grid">
            {/* Timeline */}
            <div className="timeline-card">
              <h3>📍 Tracking Timeline</h3>
              <div className="timeline">
                {selectedOrder.timeline.map((step, idx) => (
                  <div 
                    key={idx}
                    className={`timeline-item ${step.completed ? 'completed' : ''} ${step.current ? 'current' : ''}`}
                  >
                    <div className="timeline-marker">
                      {step.completed ? '✓' : (idx + 1)}
                    </div>
                    <div className="timeline-content">
                      <strong>{step.status}</strong>
                      <span className="timeline-date">{step.date}</span>
                      {step.location && <span className="timeline-location">📍 {step.location}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipment Details */}
            <div className="details-card">
              <h3>📋 Shipment Details</h3>
              <div className="detail-item">
                <label>Carrier</label>
                <span>{selectedOrder.shipmentDetails.carrier}</span>
              </div>
              <div className="detail-item">
                <label>Tracking Number</label>
                <span className="tracking-num">{selectedOrder.shipmentDetails.trackingNumber}</span>
              </div>
              <div className="detail-item">
                <label>Origin</label>
                <span>{selectedOrder.shipmentDetails.origin}</span>
              </div>
              <div className="detail-item">
                <label>Destination</label>
                <span>{selectedOrder.shipmentDetails.destination}</span>
              </div>
              <div className="detail-item">
                <label>Weight</label>
                <span>{selectedOrder.shipmentDetails.weight}</span>
              </div>
              <div className="detail-item highlight">
                <label>Estimated Delivery</label>
                <span>{selectedOrder.estimatedDelivery}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="actions-card">
              <h3>🔧 Quick Actions</h3>
              <Link href="/documents" className="action-btn">
                📄 View Documents
              </Link>
              <Link href="/chat-support" className="action-btn">
                💬 Chat with Support
              </Link>
              <button className="action-btn" onClick={() => window.print()}>
                🖨️ Print Tracking Details
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .search-section {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 30px;
        }
        .search-form {
          display: flex;
          gap: 15px;
          max-width: 600px;
        }
        .search-input {
          flex: 1;
          padding: 14px 20px;
          border: 2px solid var(--border-color);
          border-radius: 10px;
          font-size: 1em;
          background: var(--bg-primary);
          color: var(--text-primary);
        }
        .search-input:focus {
          outline: none;
          border-color: var(--accent-primary);
        }
        .search-error {
          color: #ef4444;
          margin-top: 10px;
          font-size: 0.9em;
        }
        .active-orders h2 {
          color: var(--text-primary);
          margin-bottom: 20px;
        }
        .orders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }
        .order-card {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s;
          border: 2px solid transparent;
        }
        .order-card:hover {
          border-color: var(--accent-primary);
          transform: translateY(-3px);
        }
        .order-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .order-id {
          font-size: 0.85em;
          color: var(--text-secondary);
          font-family: monospace;
        }
        .status-badge {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.8em;
          color: white;
          font-weight: 600;
        }
        .order-card h3 {
          color: var(--text-primary);
          font-size: 1.1em;
          margin-bottom: 8px;
        }
        .eta {
          color: var(--text-secondary);
          font-size: 0.9em;
          margin-bottom: 15px;
        }
        .track-btn {
          background: var(--bg-tertiary);
          border: none;
          padding: 8px 15px;
          border-radius: 6px;
          color: var(--accent-primary);
          font-weight: 600;
          cursor: pointer;
          font-size: 0.9em;
        }
        .back-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          margin-bottom: 20px;
          font-size: 0.95em;
        }
        .back-btn:hover {
          color: var(--accent-primary);
        }
        .tracking-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
        }
        .order-id-large {
          font-family: monospace;
          color: var(--text-secondary);
          font-size: 0.9em;
        }
        .tracking-header h2 {
          color: var(--text-primary);
          margin-top: 5px;
        }
        .status-badge-large {
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9em;
          color: white;
          font-weight: 600;
        }
        .tracking-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 25px;
        }
        .timeline-card, .details-card, .actions-card {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 25px;
        }
        .timeline-card h3, .details-card h3, .actions-card h3 {
          color: var(--text-primary);
          margin-bottom: 20px;
          font-size: 1.1em;
        }
        .timeline {
          position: relative;
        }
        .timeline-item {
          display: flex;
          gap: 15px;
          padding-bottom: 25px;
          position: relative;
        }
        .timeline-item:last-child {
          padding-bottom: 0;
        }
        .timeline-item::before {
          content: '';
          position: absolute;
          left: 16px;
          top: 35px;
          bottom: 0;
          width: 2px;
          background: var(--border-color);
        }
        .timeline-item:last-child::before {
          display: none;
        }
        .timeline-item.completed::before {
          background: var(--accent-primary);
        }
        .timeline-marker {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: var(--bg-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85em;
          color: var(--text-secondary);
          flex-shrink: 0;
          z-index: 1;
        }
        .timeline-item.completed .timeline-marker {
          background: var(--accent-primary);
          color: white;
        }
        .timeline-item.current .timeline-marker {
          background: var(--accent-primary);
          color: white;
          box-shadow: 0 0 0 4px rgba(255, 107, 53, 0.2);
        }
        .timeline-content {
          padding-top: 5px;
        }
        .timeline-content strong {
          color: var(--text-primary);
          display: block;
        }
        .timeline-date {
          color: var(--text-secondary);
          font-size: 0.85em;
          display: block;
          margin-top: 3px;
        }
        .timeline-location {
          color: var(--text-muted);
          font-size: 0.85em;
          display: block;
          margin-top: 3px;
        }
        .detail-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid var(--border-color);
        }
        .detail-item:last-child {
          border-bottom: none;
        }
        .detail-item label {
          color: var(--text-secondary);
          font-size: 0.9em;
        }
        .detail-item span {
          color: var(--text-primary);
          font-weight: 500;
        }
        .detail-item.highlight {
          background: rgba(255, 107, 53, 0.05);
          margin: 0 -25px;
          padding: 15px 25px;
          border-radius: 0 0 12px 12px;
        }
        .detail-item.highlight span {
          color: var(--accent-primary);
          font-weight: 600;
        }
        .tracking-num {
          font-family: monospace;
          font-size: 0.95em;
        }
        .actions-card {
          grid-column: 2;
          grid-row: 2;
        }
        .action-btn {
          display: block;
          width: 100%;
          padding: 12px 15px;
          background: var(--bg-tertiary);
          border: none;
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 0.95em;
          text-align: left;
          cursor: pointer;
          margin-bottom: 10px;
          text-decoration: none;
          transition: all 0.2s;
        }
        .action-btn:last-child {
          margin-bottom: 0;
        }
        .action-btn:hover {
          background: var(--accent-primary);
          color: white;
        }
        @media (max-width: 768px) {
          .tracking-grid {
            grid-template-columns: 1fr;
          }
          .actions-card {
            grid-column: 1;
            grid-row: auto;
          }
          .search-form {
            flex-direction: column;
          }
        }
      `}</style>
    </AppLayout>
  );
}

