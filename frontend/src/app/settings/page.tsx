'use client';

import { useState, useEffect, Suspense } from 'react';
import { AppLayout } from '@/components/layout';
import { useMobile } from '@/hooks/useMobile';
import { useFeedbackTrigger } from '@/hooks/useFeedbackTrigger';
import { useTour } from '@/hooks/useTour';
import { settingsTourSteps, mobileSettingsTourSteps } from '@/lib/tourSteps';
import TourFAB from '@/components/walkthrough/TourFAB';
import Joyride from 'react-joyride';
import { joyrideStyles, BefachTooltip } from '@/lib/tourConfig';
import { useUser } from '@/context/UserModeContext';
import {
  Building2, Users, Lock, Smartphone, Monitor, ChevronRight,
  LogOut, Download, Trash2, CreditCard, Code2, Pin, PinOff,
} from 'lucide-react';
import { captureFeatureAction } from '@/lib/posthogEvents';

const allSidebarItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'my-orders', label: 'My Orders' },
  { id: 'submit-requirement', label: 'Submit Requirement' },
  { id: 'smart-sourcing', label: 'Smart Sourcing' },
  { id: 'saved-suppliers', label: 'Saved Suppliers' },
  { id: 'market-insights', label: 'Market Insights' },
  { id: 'cost-calculator', label: 'Cost Calculator' },
  { id: 'compliance-tools', label: 'Compliance Tools' },
  { id: 'track-shipment', label: 'Track Shipments' },
  { id: 'documents', label: 'Documents' },
  { id: 'team-management', label: 'Team Members' },
  { id: 'reports', label: 'Reports' },
  { id: 'api-settings', label: 'API Settings' },
];

function SettingsContent() {
  const { isMobile } = useMobile();
  const tourSteps = isMobile ? mobileSettingsTourSteps : settingsTourSteps;
  const { run, startTour, handleJoyrideCallback } = useTour({ tourId: 'settings', steps: tourSteps });
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
    captureFeatureAction('settings', 'updated', { action: 'toggle_pin', item: itemId });
  };

  const isPinned = (itemId: string) => sidebarPreferences.pinnedItems.includes(itemId);

  const planName = subscription?.plan
    ? subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)
    : 'Free';

  const initials = 'JS';

  return (
    <AppLayout searchPlaceholder="Search settings...">
      <div className="content-header">
        <h1>Settings</h1>
      </div>

      {/* Profile Banner */}
      <div id="settings-profile" className="profile-banner">
        <div className="profile-left">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-identity">
            <h2>John Smith</h2>
            <span className="profile-email">john.smith@company.com</span>
          </div>
        </div>
        <div className="profile-meta">
          <div className="meta-chip">
            <Building2 size={14} />
            <span>{organization?.name || 'Not set'}</span>
          </div>
          <div className="meta-chip plan">
            <span>{planName} Plan</span>
          </div>
          <div className="meta-chip">
            <Users size={14} />
            <span>{subscription?.seats || 1} seat{(subscription?.seats || 1) > 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Two-column layout for desktop */}
      <div id="settings-grid" className="settings-grid">
        {/* Left column */}
        <div className="settings-col">

          {/* Profile Information */}
          <section className="card">
            <div className="card-head">
              <h3>Profile Information</h3>
            </div>
            <form className="profile-form">
              <div className="field-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" defaultValue="John Smith" />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" defaultValue="john.smith@company.com" />
                </div>
              </div>
              <div className="field-row">
                <div className="form-group">
                  <label>Company</label>
                  <input type="text" defaultValue={organization?.name || ''} />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" defaultValue="+91 98765 43210" />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-submit">Save Changes</button>
                <button type="button" className="btn-cancel">Cancel</button>
              </div>
            </form>
          </section>

          {/* Notifications */}
          <section id="settings-notifications" className="card">
            <div className="card-head">
              <h3>Notifications</h3>
            </div>
            <div className="notif-list">
              {[
                { key: 'orderUpdates', title: 'Order updates', desc: 'Status changes on your orders' },
                { key: 'shipmentTracking', title: 'Shipment tracking', desc: 'Real-time shipment alerts' },
                { key: 'priceAlerts', title: 'Price alerts', desc: 'When prices match your targets' },
                { key: 'supplierMessages', title: 'Supplier messages', desc: 'New messages from suppliers' },
                { key: 'regulatoryUpdates', title: 'Regulatory updates', desc: 'Compliance & duty changes' },
                { key: 'marketingEmails', title: 'Marketing', desc: 'Product news & tips' },
              ].map((item) => (
                <label key={item.key} className="notif-row">
                  <div className="notif-text">
                    <span className="notif-title">{item.title}</span>
                    <span className="notif-desc">{item.desc}</span>
                  </div>
                  <div className="toggle-wrap">
                    <input
                      type="checkbox"
                      checked={notifications[item.key as keyof typeof notifications]}
                      onChange={() => handleNotificationChange(item.key)}
                    />
                    <span className="toggle-track">
                      <span className="toggle-thumb" />
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Sidebar Customization */}
          <section className="card">
            <div className="card-head">
              <h3>Quick Access</h3>
              <span className="head-badge">{sidebarPreferences.pinnedItems.length} pinned</span>
            </div>
            <p className="card-desc">Pin features you use often to the sidebar.</p>
            <div className="pin-grid">
              {allSidebarItems.map(item => {
                const pinned = isPinned(item.id);
                return (
                  <button
                    key={item.id}
                    className={`pin-item ${pinned ? 'active' : ''}`}
                    onClick={() => togglePinnedItem(item.id)}
                  >
                    {pinned ? <PinOff size={13} /> : <Pin size={13} />}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="settings-col narrow">

          {/* Quick Links */}
          <section className="card">
            <div className="card-head">
              <h3>Manage</h3>
            </div>
            <div className="link-list">
              <a href="/team-management" className="link-row">
                <Users size={16} />
                <span>Team Management</span>
                <ChevronRight size={15} />
              </a>
              <a href="/api-settings" className="link-row">
                <Code2 size={16} />
                <span>API Settings</span>
                <ChevronRight size={15} />
              </a>
              <a href="/billing-history" className="link-row">
                <CreditCard size={16} />
                <span>Billing & Invoices</span>
                <ChevronRight size={15} />
              </a>
            </div>
          </section>

          {/* Security */}
          <section className="card">
            <div className="card-head">
              <h3>Security</h3>
            </div>
            <div className="link-list">
              <button className="link-row" type="button">
                <Lock size={16} />
                <span>Change password</span>
                <ChevronRight size={15} />
              </button>
              <button className="link-row" type="button">
                <Smartphone size={16} />
                <span>Two-factor authentication</span>
                <span className="row-badge off">Off</span>
              </button>
              <button className="link-row" type="button">
                <Monitor size={16} />
                <span>Active sessions</span>
                <span className="row-badge">1 device</span>
              </button>
            </div>
          </section>

          {/* Logout */}
          <section className="card">
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          </section>

          {/* Danger Zone */}
          <section className="card danger-card">
            <div className="card-head">
              <h3>Danger Zone</h3>
            </div>
            <div className="danger-list">
              <div className="danger-row">
                <div>
                  <h4>Export data</h4>
                  <p>Download all your account data</p>
                </div>
                <button className="btn-ghost-danger" type="button">
                  <Download size={14} /> Export
                </button>
              </div>
              <div className="danger-row">
                <div>
                  <h4>Delete account</h4>
                  <p>This action cannot be undone</p>
                </div>
                <button className="btn-solid-danger" type="button">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        /* Profile Banner */
        .profile-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 20px 24px;
          margin-bottom: 20px;
        }

        .profile-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .profile-avatar {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
          font-weight: 700;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          letter-spacing: 0.5px;
        }

        .profile-identity h2 {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 2px;
          line-height: 1.3;
        }

        .profile-email {
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .profile-meta {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .meta-chip {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 500;
          background: var(--bg-secondary);
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
        }

        .meta-chip.plan {
          background: rgba(249, 115, 22, 0.1);
          color: #f97316;
          border-color: rgba(249, 115, 22, 0.2);
          font-weight: 600;
        }

        /* Two-column grid */
        .settings-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 20px;
          align-items: start;
        }

        .settings-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Card base */
        .card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 20px;
        }

        .card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .card-head h3 {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .head-badge {
          font-size: 0.72rem;
          font-weight: 600;
          padding: 3px 9px;
          border-radius: 6px;
          background: rgba(249, 115, 22, 0.1);
          color: #f97316;
        }

        .card-desc {
          font-size: 0.82rem;
          color: var(--text-muted);
          margin: -8px 0 14px;
          line-height: 1.4;
        }

        /* Profile form */
        .profile-form {
          display: flex;
          flex-direction: column;
        }

        .field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 14px;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 6px;
        }

        .form-actions .btn-submit,
        .form-actions .btn-cancel {
          flex: 0;
          padding: 9px 22px;
          font-size: 0.85rem;
        }

        /* Notifications */
        .notif-list {
          display: flex;
          flex-direction: column;
        }

        .notif-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 11px 0;
          cursor: pointer;
          border-bottom: 1px solid var(--border-color);
        }

        .notif-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .notif-row:first-child {
          padding-top: 0;
        }

        .notif-text {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .notif-title {
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .notif-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        /* Toggle switch */
        .toggle-wrap {
          position: relative;
          flex-shrink: 0;
        }

        .toggle-wrap input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-track {
          display: block;
          width: 40px;
          height: 22px;
          border-radius: 12px;
          background: var(--border-color);
          transition: background 0.2s;
          position: relative;
          cursor: pointer;
        }

        .toggle-thumb {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          transition: transform 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
        }

        .toggle-wrap input:checked + .toggle-track {
          background: #f97316;
        }

        .toggle-wrap input:checked + .toggle-track .toggle-thumb {
          transform: translateX(18px);
        }

        /* Pin grid */
        .pin-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .pin-item {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: none;
          color: var(--text-secondary);
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.15s;
          font-weight: 500;
        }

        .pin-item:hover {
          border-color: var(--text-muted);
          color: var(--text-primary);
        }

        .pin-item.active {
          background: rgba(249, 115, 22, 0.1);
          border-color: rgba(249, 115, 22, 0.3);
          color: #f97316;
        }

        /* Link list (manage + security) */
        .link-list {
          display: flex;
          flex-direction: column;
        }

        .link-row {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 10px;
          padding: 11px 2px;
          border: none;
          background: none;
          text-decoration: none;
          color: var(--text-primary);
          font-size: 0.88rem;
          font-weight: 500;
          cursor: pointer;
          border-bottom: 1px solid var(--border-color);
          transition: color 0.15s;
          text-align: left;
          width: 100%;
        }

        .link-row:last-child {
          border-bottom: none;
        }

        .link-row:hover {
          color: #f97316;
        }

        .link-row span:first-of-type {
          flex: 1;
        }

        .row-badge {
          font-size: 0.72rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 6px;
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        }

        .row-badge.off {
          background: var(--bg-secondary);
          color: var(--text-muted);
        }

        /* Logout */
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 11px 0;
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 0.88rem;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.15s;
        }

        .logout-btn:hover {
          color: #ef4444;
        }

        /* Danger zone */
        .danger-card {
          border-color: rgba(239, 68, 68, 0.2);
        }

        .danger-card .card-head h3 {
          color: #ef4444;
          font-size: 0.88rem;
        }

        .danger-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .danger-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .danger-row h4 {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 2px;
        }

        .danger-row p {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin: 0;
        }

        .btn-ghost-danger {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 7px 14px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: none;
          color: var(--text-secondary);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }

        .btn-ghost-danger:hover {
          border-color: #ef4444;
          color: #ef4444;
        }

        .btn-solid-danger {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 7px 14px;
          border-radius: 8px;
          border: none;
          background: #ef4444;
          color: white;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }

        .btn-solid-danger:hover {
          background: #dc2626;
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .settings-grid {
            grid-template-columns: 1fr 300px;
            gap: 16px;
          }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .profile-banner {
            flex-direction: column;
            align-items: flex-start;
            gap: 14px;
            padding: 16px;
            margin-bottom: 14px;
          }

          .profile-meta {
            gap: 6px;
          }

          .meta-chip {
            font-size: 0.72rem;
            padding: 4px 9px;
          }

          .settings-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .card {
            padding: 16px;
          }

          .field-row {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .notif-desc {
            display: none;
          }

          .notif-row {
            padding: 9px 0;
          }

          .pin-grid {
            gap: 5px;
          }

          .pin-item {
            padding: 5px 10px;
            font-size: 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .profile-banner {
            padding: 14px;
          }

          .profile-avatar {
            width: 44px;
            height: 44px;
            font-size: 0.95rem;
          }

          .profile-identity h2 {
            font-size: 1rem;
          }

          .card {
            padding: 14px;
            border-radius: 10px;
          }

          .card-head h3 {
            font-size: 0.9rem;
          }

          .form-actions {
            flex-direction: column;
          }

          .form-actions .btn-submit,
          .form-actions .btn-cancel {
            flex: 1;
            text-align: center;
          }
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
      {promptElement}
    </AppLayout>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsContent />
    </Suspense>
  );
}
