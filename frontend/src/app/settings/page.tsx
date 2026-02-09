'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout';
import { useFeedbackTrigger } from '@/hooks/useFeedbackTrigger';
import { useUser } from '@/context/UserModeContext';

const allSidebarItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'my-orders', label: 'My Orders' },
  { id: 'submit-requirement', label: 'Submit Requirement' },
  { id: 'smart-sourcing', label: 'Smart Sourcing' },
  { id: 'saved-suppliers', label: 'Saved Suppliers' },
  { id: 'market-insights', label: 'Market Insights' },
  { id: 'cost-calculator', label: 'Cost Calculator' },
  { id: 'compliance-tools', label: 'Compliance Tools' },
  { id: 'ai-assistant', label: 'AI Assistant' },
  { id: 'track-shipment', label: 'Track Shipments' },
  { id: 'documents', label: 'Documents' },
  { id: 'team-management', label: 'Team Members' },
  { id: 'reports', label: 'Reports' },
  { id: 'api-settings', label: 'API Settings' },
];

export default function SettingsPage() {
  const { organization, subscription, sidebarPreferences, updateSidebarPreferences, logout } = useUser();
  const { triggerTimeBasedFeedback, promptElement } = useFeedbackTrigger();

  useEffect(() => {
    triggerTimeBasedFeedback('settings', 25000);
  }, [triggerTimeBasedFeedback]);
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    shipmentTracking: true,
    priceAlerts: true,
    supplierMessages: true,
    regulatoryUpdates: true,
    marketingEmails: false,
  });

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const handleNotificationChange = (key: string) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const togglePinnedItem = (itemId: string) => {
    const currentPinned = sidebarPreferences.pinnedItems;
    const newPinned = currentPinned.includes(itemId)
      ? currentPinned.filter(id => id !== itemId)
      : [...currentPinned, itemId];
    updateSidebarPreferences({ pinnedItems: newPinned });
  };

  const isPinned = (itemId: string) => sidebarPreferences.pinnedItems.includes(itemId);

  return (
    <AppLayout searchPlaceholder="Search settings...">
      <div className="content-header">
        <h1>Settings</h1>
      </div>

      {/* Account Overview */}
      <div className="settings-section">
        <h2>Account Overview</h2>
        <div className="account-grid">
          <div className="account-card">
            <div className="account-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 21h18M3 10h18M3 3h18M9 21v-9M15 21v-9M9 3v6M15 3v6"></path>
              </svg>
            </div>
            <div className="account-info">
              <label>Organization</label>
              <span>{organization?.name || 'Not set'}</span>
            </div>
          </div>
          <div className="account-card">
            <div className="account-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
            </div>
            <div className="account-info">
              <label>Plan</label>
              <span>{subscription?.plan || 'Free'}</span>
            </div>
          </div>
          <div className="account-card">
            <div className="account-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div className="account-info">
              <label>Team Seats</label>
              <span>{subscription?.seats || 1} members</span>
            </div>
          </div>
          <div className="account-card">
            <div className="account-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
            </div>
            <div className="account-info">
              <label>Business Type</label>
              <span>{organization?.type === 'company' ? 'Company' : 'Individual'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Customization */}
      <div className="settings-section">
        <h2>Customize Sidebar</h2>
        <p className="section-desc">Pin your most-used features to Quick Access in the sidebar</p>
        
        <div className="pinned-items">
          <h4>Quick Access Items ({sidebarPreferences.pinnedItems.length} pinned)</h4>
          <div className="items-grid">
            {allSidebarItems.map(item => (
              <label 
                key={item.id}
                className={`item-toggle ${isPinned(item.id) ? 'pinned' : ''}`}
              >
                <input 
                  type="checkbox"
                  checked={isPinned(item.id)}
                  onChange={() => togglePinnedItem(item.id)}
                />
                <span className="item-checkbox">
                  {isPinned(item.id) && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </span>
                <span className="item-label">{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Settings */}
      <div className="settings-section">
        <h2>Profile Information</h2>
        <form className="settings-form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" defaultValue="John Smith" />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" defaultValue="john.smith@company.com" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Company Name</label>
              <input type="text" defaultValue={organization?.name || ''} />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" defaultValue="+91 98765 43210" />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-submit">Save Changes</button>
            <button type="button" className="btn-cancel">Cancel</button>
          </div>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="settings-section">
        <h2>Notifications</h2>
        <div className="notifications-grid">
          {[
            { key: 'orderUpdates', title: 'Order Updates' },
            { key: 'shipmentTracking', title: 'Shipment Tracking' },
            { key: 'priceAlerts', title: 'Price Alerts' },
            { key: 'supplierMessages', title: 'Supplier Messages' },
            { key: 'regulatoryUpdates', title: 'Regulatory Updates' },
            { key: 'marketingEmails', title: 'Marketing Emails' },
          ].map((item) => (
            <div key={item.key} className="notification-item">
              <div className="notification-info">
                <h4>{item.title}</h4>
              </div>
              <label className="toggle">
                <input 
                  type="checkbox" 
                  checked={notifications[item.key as keyof typeof notifications]}
                  onChange={() => handleNotificationChange(item.key)}
                />
                <span className="slider"></span>
              </label>
            </div>
          ))}
        </div>
        <button type="button" className="btn-submit" style={{ marginTop: '20px' }}>
          Save Preferences
        </button>
      </div>

      {/* Quick Links */}
      <div className="settings-section">
        <h2>Quick Links</h2>
        <div className="quick-links">
          <Link href="/team-management" className="quick-link-card">
            <div className="link-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div>
              <h4>Team Management</h4>
            </div>
            <span className="link-arrow">→</span>
          </Link>
          <Link href="/api-settings" className="quick-link-card">
            <div className="link-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </div>
            <div>
              <h4>API Settings</h4>
            </div>
            <span className="link-arrow">→</span>
          </Link>
          <Link href="/billing-history" className="quick-link-card">
            <div className="link-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
            </div>
            <div>
              <h4>Billing</h4>
            </div>
            <span className="link-arrow">→</span>
          </Link>
        </div>
      </div>

      {/* Security */}
      <div className="settings-section">
        <h2>Security</h2>
        <div className="security-options">
          <div className="security-item">
            <div className="security-info">
              <h4>Change Password</h4>
            </div>
            <button className="btn-outline">Change</button>
          </div>
          <div className="security-item">
            <div className="security-info">
              <h4>Two-Factor Authentication</h4>
            </div>
            <button className="btn-outline">Enable</button>
          </div>
          <div className="security-item">
            <div className="security-info">
              <h4>Active Sessions</h4>
              <p>View and manage logged-in devices</p>
            </div>
            <button className="btn-outline">View</button>
          </div>
        </div>
      </div>

      {/* Logout Section */}
      <div className="settings-section logout-section">
        <h2>Logout</h2>
        <div className="logout-content">
          <div className="logout-info">
            <p>Sign out of your account. You&apos;ll need to log in again when you return.</p>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="settings-section danger">
        <h2>Danger Zone</h2>
        <div className="danger-options">
          <div className="danger-item">
            <div className="danger-info">
              <h4>Export Account Data</h4>
              <p>Download all your account data</p>
            </div>
            <button className="btn-danger-outline">Export</button>
          </div>
          <div className="danger-item">
            <div className="danger-info">
              <h4>Delete Account</h4>
              <p>Permanently delete your account and data</p>
            </div>
            <button className="btn-danger">Delete</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .settings-section {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 25px;
        }
        .settings-section.danger {
          border-left: 4px solid #ef4444;
        }
        .settings-section.logout-section {
          border-left: 4px solid var(--accent-primary);
        }
        .settings-section h2 {
          color: var(--text-primary);
          margin-bottom: 20px;
          font-size: 1.2em;
        }
        .section-desc {
          color: var(--text-secondary);
          margin-bottom: 20px;
        }
        .account-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
        }
        .account-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px;
          background: var(--bg-tertiary);
          border-radius: 10px;
        }
        .account-icon-wrap {
          width: 40px;
          height: 40px;
          background: var(--accent-gradient);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .account-icon-wrap svg {
          width: 20px;
          height: 20px;
        }
        .account-info label {
          display: block;
          color: var(--text-secondary);
          font-size: 0.8em;
        }
        .account-info span {
          color: var(--text-primary);
          font-weight: 600;
        }
        .pinned-items h4 {
          color: var(--text-primary);
          margin-bottom: 15px;
        }
        .items-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .item-toggle {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 15px;
          background: var(--bg-tertiary);
          border: 2px solid var(--border-color);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .item-toggle:hover {
          border-color: var(--accent-primary);
        }
        .item-toggle.pinned {
          border-color: var(--accent-primary);
          background: rgba(255, 107, 53, 0.05);
        }
        .item-toggle input {
          display: none;
        }
        .item-checkbox {
          width: 20px;
          height: 20px;
          border: 2px solid var(--border-color);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .item-toggle.pinned .item-checkbox {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
        }
        .item-checkbox svg {
          width: 12px;
          height: 12px;
          color: white;
        }
        .item-label {
          flex: 1;
          color: var(--text-primary);
          font-size: 0.9em;
        }
        .settings-form {
          max-width: 700px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        .form-actions {
          display: flex;
          gap: 15px;
          margin-top: 25px;
        }
        .notifications-grid {
          display: grid;
          gap: 12px;
        }
        .notification-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: var(--bg-tertiary);
          border-radius: 10px;
        }
        .notification-info h4 {
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .notification-info p {
          color: var(--text-secondary);
          font-size: 0.85em;
          margin: 0;
        }
        .toggle {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 28px;
        }
        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--border-color);
          transition: 0.3s;
          border-radius: 28px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
        }
        input:checked + .slider {
          background: var(--accent-gradient);
        }
        input:checked + .slider:before {
          transform: translateX(22px);
        }
        .quick-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }
        .quick-link-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          background: var(--bg-tertiary);
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.2s;
          border: 2px solid transparent;
        }
        .quick-link-card:hover {
          border-color: var(--accent-primary);
          background: rgba(255, 107, 53, 0.05);
        }
        .link-icon-wrap {
          width: 44px;
          height: 44px;
          background: var(--bg-secondary);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-primary);
        }
        .link-icon-wrap svg {
          width: 22px;
          height: 22px;
        }
        .quick-link-card h4 {
          color: var(--text-primary);
          margin-bottom: 3px;
        }
        .quick-link-card p {
          color: var(--text-secondary);
          font-size: 0.85em;
          margin: 0;
        }
        .link-arrow {
          margin-left: auto;
          color: var(--text-muted);
          font-size: 1.2em;
        }
        .security-options, .danger-options {
          display: grid;
          gap: 12px;
        }
        .security-item, .danger-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: var(--bg-tertiary);
          border-radius: 10px;
        }
        .danger-item {
          background: #fef2f2;
        }
        .security-info h4, .danger-info h4 {
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .danger-info h4 {
          color: #dc2626;
        }
        .security-info p, .danger-info p {
          color: var(--text-secondary);
          font-size: 0.85em;
          margin: 0;
        }
        .danger-info p {
          color: #991b1b;
        }
        .btn-outline {
          background: transparent;
          border: 2px solid var(--border-color);
          color: var(--text-primary);
          padding: 8px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9em;
        }
        .btn-outline:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }
        .btn-danger-outline {
          background: transparent;
          border: 2px solid #dc2626;
          color: #dc2626;
          padding: 8px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9em;
        }
        .btn-danger {
          background: #dc2626;
          border: none;
          color: white;
          padding: 8px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9em;
        }
        .logout-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: var(--bg-tertiary);
          border-radius: 10px;
        }
        .logout-info p {
          color: var(--text-secondary);
          margin: 0;
        }
        .btn-logout {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--accent-gradient);
          color: white;
          border: none;
          padding: 12px 28px;
          border-radius: 10px;
          font-size: 1em;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }
        .btn-logout:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 53, 0.3);
        }
        @media (max-width: 900px) {
          .account-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .items-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .quick-links {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 768px) {
          .settings-section {
            padding: 16px;
            margin-bottom: 16px;
          }
          .settings-section h2 {
            font-size: 1rem;
            margin-bottom: 12px;
          }
          .quick-links {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .quick-link-card {
            padding: 12px;
          }
          .quick-link-card p {
            display: none;
          }
          .notification-item {
            padding: 10px 0;
          }
          .notification-info p {
            display: none;
          }
          .security-info p {
            display: none;
          }
        }
        @media (max-width: 600px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          .items-grid {
            grid-template-columns: 1fr;
          }
          .quick-links {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      {promptElement}
    </AppLayout>
  );
}
