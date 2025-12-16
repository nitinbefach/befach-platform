'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout';
import { Modal } from '@/components/ui';

export default function LogisticsTrackingPage() {
  const [trackingModal, setTrackingModal] = useState(false);

  return (
    <AppLayout searchPlaceholder="Search by tracking number, order ID...">
      <div className="content-header">
        <h1>Logistics Tracking</h1>
        <p>Real-time shipment tracking across all carriers with automated delivery notifications</p>
      </div>

      {/* STATS */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">Active Shipments</div>
              <div className="stat-value">342</div>
              <div className="stat-trend">↑ 28 new today</div>
            </div>
            <div className="stat-icon-box" style={{ background: 'linear-gradient(135deg, #ff6b35 0%, #ff5722 100%)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">In Transit</div>
              <div className="stat-value">256</div>
              <div className="stat-trend">↑ 15% on schedule</div>
            </div>
            <div className="stat-icon-box" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">Delivered This Week</div>
              <div className="stat-value">127</div>
              <div className="stat-trend">↑ 98% on time</div>
            </div>
            <div className="stat-icon-box" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">Avg Delivery Time</div>
              <div className="stat-value">18d</div>
              <div className="stat-trend">↓ 3 days faster</div>
            </div>
            <div className="stat-icon-box" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="quick-actions">
        <h2>Track Your Shipments</h2>
        <p>Enter tracking numbers to monitor your shipments in real-time across all carriers</p>
        <div className="action-buttons">
          <button className="btn-white" onClick={() => setTrackingModal(true)}>Add Tracking Number</button>
          <a href="#" className="btn-outline">View All Shipments</a>
          <a href="#" className="btn-outline">Download Report</a>
        </div>
      </div>

      {/* ACTIVE SHIPMENTS */}
      <div className="insights-panel">
        <div className="panel-header">
          <h3 className="panel-title">Active Shipments</h3>
          <span className="live-badge">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
              <circle cx="4" cy="4" r="4"/>
            </svg>
            LIVE
          </span>
        </div>

        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Tracking Number</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Carrier</th>
                <th>ETA</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>MSKU4523789012</strong><br/><small>Order #ORD-2847</small></td>
                <td>Shanghai, China</td>
                <td>Mumbai, India</td>
                <td>Maersk Line</td>
                <td><strong>Dec 3, 2025</strong></td>
                <td><span className="status-badge success">In Transit</span></td>
              </tr>
              <tr>
                <td><strong>CMAU9876543210</strong><br/><small>Order #ORD-2846</small></td>
                <td>Hanoi, Vietnam</td>
                <td>Delhi, India</td>
                <td>CMA CGM</td>
                <td><strong>Dec 5, 2025</strong></td>
                <td><span className="status-badge info">Customs Clearance</span></td>
              </tr>
              <tr>
                <td><strong>OOLU5647382910</strong><br/><small>Order #ORD-2845</small></td>
                <td>Dhaka, Bangladesh</td>
                <td>Chennai, India</td>
                <td>OOCL</td>
                <td><strong>Nov 30, 2025</strong></td>
                <td><span className="status-badge warning">Port Arrival</span></td>
              </tr>
              <tr>
                <td><strong>HLCU1234567890</strong><br/><small>Order #ORD-2844</small></td>
                <td>Shenzhen, China</td>
                <td>Bangalore, India</td>
                <td>Hapag-Lloyd</td>
                <td><strong>Dec 1, 2025</strong></td>
                <td><span className="status-badge success">In Transit</span></td>
              </tr>
              <tr>
                <td><strong>MSCU8765432109</strong><br/><small>Order #ORD-2843</small></td>
                <td>Taipei, Taiwan</td>
                <td>Kolkata, India</td>
                <td>MSC</td>
                <td><strong>Dec 7, 2025</strong></td>
                <td><span className="status-badge success">In Transit</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FEATURES */}
      <div className="features-section">
        <h2 className="section-title">Logistics Tracking Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <h3>Real-Time Alerts</h3>
            <p>Get instant notifications for shipment updates, delays, and delivery confirmations.</p>
            <span className="feature-link">Configure Alerts →</span>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <h3>Multi-Carrier Support</h3>
            <p>Track shipments from Maersk, CMA CGM, MSC, OOCL, and 50+ other carriers in one place.</p>
            <span className="feature-link">View Carriers →</span>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <h3>Delivery Analytics</h3>
            <p>Track on-time delivery rates, average transit times, and carrier performance metrics.</p>
            <span className="feature-link">View Analytics →</span>
          </div>
        </div>
      </div>

      <Modal isOpen={trackingModal} onClose={() => setTrackingModal(false)} title="Add Tracking Number">
        <p style={{ color: '#5a6c7d', marginBottom: '30px' }}>Enter your shipment tracking details</p>
        <form>
          <div className="form-group">
            <label>Tracking Number</label>
            <input type="text" placeholder="Enter tracking number" required />
          </div>
          <div className="form-group">
            <label>Carrier</label>
            <select required>
              <option value="">Select carrier</option>
              <option value="maersk">Maersk Line</option>
              <option value="cmacgm">CMA CGM</option>
              <option value="msc">MSC</option>
              <option value="oocl">OOCL</option>
              <option value="hapag">Hapag-Lloyd</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Order Reference (Optional)</label>
            <input type="text" placeholder="Your order reference number" />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={() => setTrackingModal(false)}>Cancel</button>
            <button type="submit" className="btn-submit">Start Tracking</button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}

