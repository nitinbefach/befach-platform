'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout';
import { Modal } from '@/components/ui';

export default function MyOrdersPage() {
  const [orderModal, setOrderModal] = useState(false);

  return (
    <AppLayout searchPlaceholder="Search orders...">
      <div className="content-header">
        <h1>My Orders</h1>
        <p>View and manage all your import orders and shipments</p>
      </div>

      {/* STATS */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">Total Orders</div>
              <div className="stat-value">1,847</div>
              <div className="stat-trend">↑ 124 this month</div>
            </div>
            <div className="stat-icon-box" style={{ background: 'linear-gradient(135deg, #ff6b35 0%, #ff5722 100%)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">In Progress</div>
              <div className="stat-value">342</div>
              <div className="stat-trend">↑ 28 active</div>
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
              <div className="stat-label">Completed</div>
              <div className="stat-value">1,476</div>
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
              <div className="stat-label">Total Value</div>
              <div className="stat-value">$2.4M</div>
              <div className="stat-trend">↑ 23% this year</div>
            </div>
            <div className="stat-icon-box" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="quick-actions">
        <h2>Manage Your Orders</h2>
        <p>Track shipments, view order details, and manage your import operations</p>
        <div className="action-buttons">
          <button className="btn-white" onClick={() => setOrderModal(true)}>Create New Order</button>
          <a href="#" className="btn-outline">Export Orders</a>
          <a href="#" className="btn-outline">View Reports</a>
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="insights-panel">
        <div className="panel-header">
          <h3 className="panel-title">Recent Orders</h3>
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
                <th>Order ID</th>
                <th>Product</th>
                <th>Supplier</th>
                <th>Order Value</th>
                <th>Order Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>ORD-2847</strong><br/><small>10 items</small></td>
                <td><strong>LED Bulbs 9W</strong><br/><small>1000 pcs</small></td>
                <td>Shenzhen Lighting Co.</td>
                <td><strong style={{ color: '#ff6b35' }}>$3,728</strong></td>
                <td>Nov 15, 2025</td>
                <td><span className="status-badge success">In Transit</span></td>
              </tr>
              <tr>
                <td><strong>ORD-2846</strong><br/><small>5 items</small></td>
                <td><strong>Mobile Chargers</strong><br/><small>500 pcs</small></td>
                <td>Vietnam Tech Electronics</td>
                <td><strong style={{ color: '#ff6b35' }}>$1,600</strong></td>
                <td>Nov 12, 2025</td>
                <td><span className="status-badge info">Customs</span></td>
              </tr>
              <tr>
                <td><strong>ORD-2845</strong><br/><small>8 items</small></td>
                <td><strong>Cotton Fabric</strong><br/><small>2000 meters</small></td>
                <td>Dhaka Textiles Ltd.</td>
                <td><strong style={{ color: '#ff6b35' }}>$4,154</strong></td>
                <td>Nov 10, 2025</td>
                <td><span className="status-badge success">Delivered</span></td>
              </tr>
              <tr>
                <td><strong>ORD-2844</strong><br/><small>12 items</small></td>
                <td><strong>Bluetooth Speakers</strong><br/><small>300 pcs</small></td>
                <td>Guangzhou Audio Tech</td>
                <td><strong style={{ color: '#ff6b35' }}>$5,695</strong></td>
                <td>Nov 8, 2025</td>
                <td><span className="status-badge warning">Processing</span></td>
              </tr>
              <tr>
                <td><strong>ORD-2843</strong><br/><small>15 items</small></td>
                <td><strong>Solar Panels 300W</strong><br/><small>100 pcs</small></td>
                <td>Taiwan Solar Industries</td>
                <td><strong style={{ color: '#ff6b35' }}>$9,782</strong></td>
                <td>Nov 5, 2025</td>
                <td><span className="status-badge success">In Transit</span></td>
              </tr>
              <tr>
                <td><strong>ORD-2842</strong><br/><small>6 items</small></td>
                <td><strong>Power Banks</strong><br/><small>800 pcs</small></td>
                <td>Shenzhen Power Tech</td>
                <td><strong style={{ color: '#ff6b35' }}>$2,450</strong></td>
                <td>Nov 3, 2025</td>
                <td><span className="status-badge success">Delivered</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FEATURES */}
      <div className="features-section">
        <h2 className="section-title">Order Management Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <h3>Order Tracking</h3>
            <p>Real-time tracking of all your orders from placement to delivery with status updates.</p>
            <span className="feature-link">Track Orders →</span>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
            </div>
            <h3>Invoice Management</h3>
            <p>View, download, and manage all order invoices and related documentation.</p>
            <span className="feature-link">View Invoices →</span>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <h3>Smart Alerts</h3>
            <p>Get notifications for order status changes, delays, and delivery updates.</p>
            <span className="feature-link">Manage Alerts →</span>
          </div>
        </div>
      </div>

      <Modal isOpen={orderModal} onClose={() => setOrderModal(false)} title="Create New Order">
        <p style={{ color: '#5a6c7d', marginBottom: '30px' }}>Start a new import order</p>
        <form>
          <div className="form-group">
            <label>Product Name</label>
            <input type="text" placeholder="Enter product name" required />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input type="number" placeholder="Enter quantity" required />
          </div>
          <div className="form-group">
            <label>Supplier</label>
            <select required>
              <option value="">Select supplier</option>
              <option value="supplier1">Shenzhen Lighting Co.</option>
              <option value="supplier2">Vietnam Tech Electronics</option>
              <option value="supplier3">Dhaka Textiles Ltd.</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Estimated Value (USD)</label>
            <input type="number" placeholder="Enter estimated value" required />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={() => setOrderModal(false)}>Cancel</button>
            <button type="submit" className="btn-submit">Create Order</button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}

