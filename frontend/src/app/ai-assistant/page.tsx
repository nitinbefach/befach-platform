'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout';
import { Modal } from '@/components/ui';

export default function AIAssistantPage() {
  const [chatModal, setChatModal] = useState(false);

  return (
    <AppLayout searchPlaceholder="Ask AI anything...">
      <div className="content-header">
        <h1>AI Assistant</h1>
        <p>Get instant answers on trade regulations, product recommendations, and documentation needs</p>
      </div>

      {/* STATS */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">Questions Answered</div>
              <div className="stat-value">4,523</div>
              <div className="stat-trend">↑ 342 this week</div>
            </div>
            <div className="stat-icon-box" style={{ background: 'linear-gradient(135deg, #ff6b35 0%, #ff5722 100%)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">Avg Response Time</div>
              <div className="stat-value">1.2s</div>
              <div className="stat-trend">↓ 45% faster</div>
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
              <div className="stat-label">Accuracy Rate</div>
              <div className="stat-value">98.7%</div>
              <div className="stat-trend">↑ 2.3% improvement</div>
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
              <div className="stat-label">Active Chats</div>
              <div className="stat-value">18</div>
              <div className="stat-trend">↑ 4 new today</div>
            </div>
            <div className="stat-icon-box" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="quick-actions" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <h2>Ask Our AI Assistant</h2>
        <p>Get instant answers about trade regulations, documentation, suppliers, and more</p>
        <div className="action-buttons">
          <button className="btn-white" onClick={() => setChatModal(true)}>Start New Chat</button>
          <a href="#" className="btn-outline">View Chat History</a>
          <a href="#" className="btn-outline">Browse Topics</a>
        </div>
      </div>

      {/* RECENT QUERIES */}
      <div className="insights-panel">
        <div className="panel-header">
          <h3 className="panel-title">Recent Queries</h3>
          <span className="live-badge">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
              <circle cx="4" cy="4" r="4"/>
            </svg>
            LIVE
          </span>
        </div>

        <div className="insights-list">
          <div className="insight-item">
            <div className="insight-info">
              <h4>What documents are needed for importing electronics from China?</h4>
              <p>Answered 2 minutes ago</p>
            </div>
            <div className="insight-value">
              <span className="status-badge success">Resolved</span>
            </div>
          </div>

          <div className="insight-item">
            <div className="insight-info">
              <h4>Calculate duty for HSN code 8539 from Vietnam</h4>
              <p>Answered 15 minutes ago</p>
            </div>
            <div className="insight-value">
              <span className="status-badge success">Resolved</span>
            </div>
          </div>

          <div className="insight-item">
            <div className="insight-info">
              <h4>Find reliable LED bulb suppliers in Shenzhen</h4>
              <p>Answered 1 hour ago</p>
            </div>
            <div className="insight-value">
              <span className="status-badge success">Resolved</span>
            </div>
          </div>

          <div className="insight-item">
            <div className="insight-info">
              <h4>What are the latest GST rates for imported textiles?</h4>
              <p>Answered 2 hours ago</p>
            </div>
            <div className="insight-value">
              <span className="status-badge success">Resolved</span>
            </div>
          </div>

          <div className="insight-item">
            <div className="insight-info">
              <h4>How to file BOE for first-time importers?</h4>
              <p>Answered 3 hours ago</p>
            </div>
            <div className="insight-value">
              <span className="status-badge success">Resolved</span>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="features-section">
        <h2 className="section-title">AI Assistant Capabilities</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <h3>Trade Regulations</h3>
            <p>Get instant answers on import/export regulations, duty rates, and compliance requirements.</p>
            <span className="feature-link">Ask Now →</span>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
            <h3>Supplier Discovery</h3>
            <p>Find and evaluate suppliers based on your specific product requirements and preferences.</p>
            <span className="feature-link">Find Suppliers →</span>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
            </div>
            <h3>Documentation Help</h3>
            <p>Learn about required documents, filling procedures, and compliance documentation.</p>
            <span className="feature-link">Get Help →</span>
          </div>
        </div>
      </div>

      {/* POPULAR QUESTIONS */}
      <div className="features-section">
        <h2 className="section-title">Popular Questions</h2>
        <div className="features-grid">
          <div className="feature-card" onClick={() => setChatModal(true)}>
            <h3>How do I calculate import duties?</h3>
            <p>Learn about duty calculation based on HSN codes, CIF value, and country of origin.</p>
            <span className="feature-link">Ask AI →</span>
          </div>

          <div className="feature-card" onClick={() => setChatModal(true)}>
            <h3>What is the best shipping method?</h3>
            <p>Compare air freight, sea freight, and express shipping for your specific needs.</p>
            <span className="feature-link">Ask AI →</span>
          </div>

          <div className="feature-card" onClick={() => setChatModal(true)}>
            <h3>How to verify supplier credentials?</h3>
            <p>Learn best practices for verifying supplier authenticity and reliability.</p>
            <span className="feature-link">Ask AI →</span>
          </div>
        </div>
      </div>

      <Modal isOpen={chatModal} onClose={() => setChatModal(false)} title="Start Chat with AI Assistant">
        <p style={{ color: '#5a6c7d', marginBottom: '30px' }}>Ask anything about trade, regulations, suppliers, or documentation</p>
        <form>
          <div className="form-group">
            <label>Your Question</label>
            <textarea placeholder="Type your question here..." required style={{ minHeight: '100px', resize: 'vertical' }}></textarea>
          </div>
          <div className="form-group">
            <label>Category (Optional)</label>
            <select>
              <option value="">Select category</option>
              <option value="regulations">Trade Regulations</option>
              <option value="suppliers">Supplier Discovery</option>
              <option value="documentation">Documentation</option>
              <option value="costs">Cost Calculation</option>
              <option value="logistics">Logistics & Shipping</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={() => setChatModal(false)}>Cancel</button>
            <button type="submit" className="btn-submit">Ask AI</button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}

