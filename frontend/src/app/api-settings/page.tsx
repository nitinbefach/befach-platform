'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Modal } from '@/components/ui';
import { Plug, Key, Check, Copy, Bell, BookOpen, BarChart3, AlertTriangle } from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  type: 'production' | 'test';
  createdAt: string;
  lastUsed?: string;
  status: 'active' | 'revoked';
}

const mockApiKeys: ApiKey[] = [
  {
    id: '1',
    name: 'Production Key',
    key: 'bf_prod_sk_1234567890abcdef',
    type: 'production',
    createdAt: 'Oct 15, 2024',
    lastUsed: '2 hours ago',
    status: 'active'
  },
  {
    id: '2',
    name: 'Test Key',
    key: 'bf_test_sk_0987654321fedcba',
    type: 'test',
    createdAt: 'Oct 15, 2024',
    lastUsed: 'Yesterday',
    status: 'active'
  }
];

export default function ApiSettingsPage() {
  const [apiKeys, setApiKeys] = useState(mockApiKeys);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyType, setNewKeyType] = useState<'production' | 'test'>('test');
  const [createdKey, setCreatedKey] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState('https://yourapp.com/webhooks/befach');
  const [webhookEvents, setWebhookEvents] = useState({
    'order.created': true,
    'order.shipped': true,
    'order.delivered': true,
    'shipment.update': true,
    'document.ready': false
  });

  const maskKey = (key: string) => {
    return key.slice(0, 12) + '••••••••••••';
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreateKey = () => {
    const newKey = `bf_${newKeyType}_sk_${Math.random().toString(36).substring(2, 18)}`;
    const key: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName || `${newKeyType === 'production' ? 'Production' : 'Test'} Key`,
      key: newKey,
      type: newKeyType,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'active'
    };

    setApiKeys([...apiKeys, key]);
    setCreatedKey(newKey);
    setShowCreateModal(false);
    setShowKeyModal(true);
    setNewKeyName('');
  };

  const handleRevokeKey = (id: string) => {
    if (confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      setApiKeys(apiKeys.map(k => k.id === id ? { ...k, status: 'revoked' } : k));
    }
  };

  const handleRegenerateKey = (id: string) => {
    if (confirm('Regenerating this key will invalidate the old key. Continue?')) {
      const newKey = `bf_${apiKeys.find(k => k.id === id)?.type}_sk_${Math.random().toString(36).substring(2, 18)}`;
      setApiKeys(apiKeys.map(k => k.id === id ? { ...k, key: newKey } : k));
      setCreatedKey(newKey);
      setShowKeyModal(true);
    }
  };

  const handleSaveWebhook = () => {
    alert('Webhook settings saved!');
  };

  return (
    <AppLayout>
      <div className="content-header">
        <div>
          <h1><Plug size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} /> API Settings</h1>
          <p>Manage your API keys and webhook configurations</p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
          + Create API Key
        </button>
      </div>

      {/* API Keys Section */}
      <div className="section">
        <h2><Key size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} /> API Keys</h2>
        <p className="section-desc">
          Use these keys to authenticate API requests from your applications.
        </p>

        <div className="keys-list">
          {apiKeys.map(key => (
            <div key={key.id} className={`key-card ${key.status}`}>
              <div className="key-info">
                <div className="key-header">
                  <h4>{key.name}</h4>
                  <span className={`key-type ${key.type}`}>
                    {key.type === 'production' ? <><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#ef4444', marginRight: 6 }} /> Production</> : <><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#eab308', marginRight: 6 }} /> Test</>}
                  </span>
                </div>
                <div className="key-value">
                  <code>{maskKey(key.key)}</code>
                  <button 
                    className="copy-btn"
                    onClick={() => copyKey(key.key)}
                  >
                    {copiedKey === key.key ? <><Check size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Copied</> : <><Copy size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Copy</>}
                  </button>
                </div>
                <div className="key-meta">
                  <span>Created: {key.createdAt}</span>
                  {key.lastUsed && <span>Last used: {key.lastUsed}</span>}
                  <span className={`status ${key.status}`}>
                    {key.status === 'active' ? 'Active' : 'Revoked'}
                  </span>
                </div>
              </div>

              {key.status === 'active' && (
                <div className="key-actions">
                  <button 
                    className="action-btn"
                    onClick={() => handleRegenerateKey(key.id)}
                  >
                    Regenerate
                  </button>
                  <button 
                    className="action-btn danger"
                    onClick={() => handleRevokeKey(key.id)}
                  >
                    Revoke
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Webhooks Section */}
      <div className="section">
        <h2><Bell size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} /> Webhooks</h2>
        <p className="section-desc">
          Receive real-time notifications when events happen in your account.
        </p>

        <div className="webhook-config">
          <div className="form-group">
            <label>Webhook URL</label>
            <input 
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://yourapp.com/webhooks/befach"
            />
          </div>

          <div className="form-group">
            <label>Events to Send</label>
            <div className="events-list">
              {Object.entries(webhookEvents).map(([event, enabled]) => (
                <label key={event} className="event-checkbox">
                  <input 
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => setWebhookEvents({
                      ...webhookEvents,
                      [event]: e.target.checked
                    })}
                  />
                  <span className="event-name">{event}</span>
                  <span className="event-desc">
                    {event === 'order.created' && 'When a new order is placed'}
                    {event === 'order.shipped' && 'When an order is shipped'}
                    {event === 'order.delivered' && 'When an order is delivered'}
                    {event === 'shipment.update' && 'When shipment status changes'}
                    {event === 'document.ready' && 'When a document is ready'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button className="btn-primary" onClick={handleSaveWebhook}>
            Save Webhook Settings
          </button>
        </div>
      </div>

      {/* Documentation Link */}
      <div className="docs-section">
        <div className="docs-content">
          <span className="docs-icon"><BookOpen size={20} /></span>
          <div>
            <h3>API Documentation</h3>
            <p>Learn how to integrate Befach APIs into your applications</p>
          </div>
        </div>
        <a href="#" className="docs-link">View Documentation →</a>
      </div>

      {/* Rate Limits Info */}
      <div className="rate-limits">
        <h3><BarChart3 size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} /> Rate Limits</h3>
        <div className="limits-grid">
          <div className="limit-item">
            <span className="limit-value">1,000</span>
            <span className="limit-label">Requests/minute (Test)</span>
          </div>
          <div className="limit-item">
            <span className="limit-value">10,000</span>
            <span className="limit-label">Requests/minute (Production)</span>
          </div>
          <div className="limit-item">
            <span className="limit-value">100</span>
            <span className="limit-label">Webhook retries</span>
          </div>
        </div>
      </div>

      {/* Create Key Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New API Key"
      >
        <div className="form-group">
          <label>Key Name (optional)</label>
          <input 
            type="text"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="e.g., Integration Key"
          />
        </div>
        <div className="form-group">
          <label>Environment</label>
          <div className="radio-group">
            <label className={`radio-option ${newKeyType === 'test' ? 'selected' : ''}`}>
              <input 
                type="radio"
                name="keyType"
                value="test"
                checked={newKeyType === 'test'}
                onChange={() => setNewKeyType('test')}
              />
              <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#eab308', marginRight: 6 }} /> Test</span>
              <small>For development and testing</small>
            </label>
            <label className={`radio-option ${newKeyType === 'production' ? 'selected' : ''}`}>
              <input 
                type="radio"
                name="keyType"
                value="production"
                checked={newKeyType === 'production'}
                onChange={() => setNewKeyType('production')}
              />
              <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#ef4444', marginRight: 6 }} /> Production</span>
              <small>For live applications</small>
            </label>
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={() => setShowCreateModal(false)}>
            Cancel
          </button>
          <button className="btn-submit" onClick={handleCreateKey}>
            Create Key
          </button>
        </div>
      </Modal>

      {/* Show Key Modal */}
      <Modal
        isOpen={showKeyModal}
        onClose={() => setShowKeyModal(false)}
        title="Your New API Key"
      >
        <div className="key-display">
          <p className="key-warning">
            <AlertTriangle size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Make sure to copy your API key now. You won&apos;t be able to see it again!
          </p>
          <div className="key-box">
            <code>{createdKey}</code>
            <button 
              className="copy-btn"
              onClick={() => copyKey(createdKey)}
            >
              {copiedKey === createdKey ? <><Check size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Copied!</> : <><Copy size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Copy</>}
            </button>
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-submit" onClick={() => setShowKeyModal(false)}>
            Done
          </button>
        </div>
      </Modal>

      <style jsx>{`
        .section {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 25px;
        }
        .section h2 {
          color: var(--text-primary);
          margin-bottom: 8px;
        }
        .section-desc {
          color: var(--text-secondary);
          margin-bottom: 20px;
        }
        .keys-list {
          display: grid;
          gap: 15px;
        }
        .key-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: var(--bg-tertiary);
          border-radius: 10px;
          border: 2px solid transparent;
        }
        .key-card.revoked {
          opacity: 0.6;
        }
        .key-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
        }
        .key-header h4 {
          color: var(--text-primary);
          margin: 0;
        }
        .key-type {
          font-size: 0.8em;
          padding: 3px 8px;
          border-radius: 6px;
          background: var(--card-bg);
        }
        .key-value {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .key-value code {
          font-family: monospace;
          background: var(--card-bg);
          padding: 8px 12px;
          border-radius: 6px;
          color: var(--text-primary);
        }
        .copy-btn {
          background: var(--accent-primary);
          color: white;
          border: none;
          padding: 8px 14px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85em;
        }
        .key-meta {
          display: flex;
          gap: 15px;
          color: var(--text-muted);
          font-size: 0.85em;
        }
        .key-meta .status.active {
          color: #10b981;
        }
        .key-meta .status.revoked {
          color: #ef4444;
        }
        .key-actions {
          display: flex;
          gap: 10px;
        }
        .action-btn {
          background: var(--card-bg);
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          color: var(--text-primary);
          cursor: pointer;
        }
        .action-btn.danger:hover {
          background: #dc2626;
          color: white;
        }
        .webhook-config {
          max-width: 600px;
        }
        .events-list {
          display: grid;
          gap: 10px;
        }
        .event-checkbox {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: var(--bg-tertiary);
          border-radius: 8px;
          cursor: pointer;
        }
        .event-checkbox input {
          width: 18px;
          height: 18px;
        }
        .event-name {
          font-family: monospace;
          color: var(--text-primary);
          font-size: 0.9em;
        }
        .event-desc {
          color: var(--text-muted);
          font-size: 0.85em;
          margin-left: auto;
        }
        .docs-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 25px;
        }
        .docs-content {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .docs-icon {
          font-size: 2em;
        }
        .docs-content h3 {
          color: white;
          margin-bottom: 5px;
        }
        .docs-content p {
          color: rgba(255,255,255,0.8);
          margin: 0;
        }
        .docs-link {
          background: white;
          color: #667eea;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
        }
        .rate-limits {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 25px;
        }
        .rate-limits h3 {
          color: var(--text-primary);
          margin-bottom: 20px;
        }
        .limits-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .limit-item {
          text-align: center;
          padding: 20px;
          background: var(--bg-tertiary);
          border-radius: 10px;
        }
        .limit-value {
          display: block;
          font-size: 1.8em;
          font-weight: 700;
          color: var(--accent-primary);
          margin-bottom: 5px;
        }
        .limit-label {
          color: var(--text-secondary);
          font-size: 0.9em;
        }
        .radio-group {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }
        .radio-option {
          border: 2px solid var(--border-color);
          border-radius: 10px;
          padding: 15px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .radio-option.selected {
          border-color: var(--accent-primary);
          background: rgba(255, 107, 53, 0.05);
        }
        .radio-option input {
          display: none;
        }
        .radio-option span {
          display: block;
          color: var(--text-primary);
          font-weight: 600;
          margin-bottom: 5px;
        }
        .radio-option small {
          color: var(--text-secondary);
          font-size: 0.85em;
        }
        .key-display {
          text-align: center;
        }
        .key-warning {
          color: #f59e0b;
          background: #fffbeb;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .key-box {
          display: flex;
          align-items: center;
          gap: 15px;
          justify-content: center;
          background: var(--bg-tertiary);
          padding: 20px;
          border-radius: 10px;
        }
        .key-box code {
          font-family: monospace;
          font-size: 1em;
          color: var(--text-primary);
          word-break: break-all;
        }
        @media (max-width: 768px) {
          .key-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
          .key-actions {
            width: 100%;
          }
          .limits-grid {
            grid-template-columns: 1fr;
          }
          .radio-group {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </AppLayout>
  );
}

