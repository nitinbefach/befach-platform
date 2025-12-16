'use client';

import { useState } from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import Modal from '../ui/Modal';

interface AppLayoutProps {
  children: React.ReactNode;
  searchPlaceholder?: string;
}

export default function AppLayout({ children, searchPlaceholder }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="app-container">
      <TopBar
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        onGetStarted={() => setModalOpen(true)}
        searchPlaceholder={searchPlaceholder}
      />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="main-content">
        {children}
      </main>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Get Started with BEFACH">
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem' }}>
          Join 5,000+ businesses simplifying their global trade operations
        </p>
        <form>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Enter your name" required />
          </div>
          <div className="form-group">
            <label>Business Email</label>
            <input type="email" placeholder="you@company.com" required />
          </div>
          <div className="form-group">
            <label>Company Name</label>
            <input type="text" placeholder="Your company name" required />
          </div>
          <div className="form-group">
            <label>Import Volume</label>
            <select required>
              <option value="">Select monthly volume</option>
              <option value="0-50k">$0 - $50,000</option>
              <option value="50k-200k">$50,000 - $200,000</option>
              <option value="200k-1m">$200,000 - $1M</option>
              <option value="1m+">$1M+</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-submit">Start Free Trial</button>
          </div>
        </form>
      </Modal>

      <style jsx>{`
        .app-container {
          display: grid;
          grid-template-columns: 70px 1fr;
          grid-template-rows: 64px 1fr;
          height: 100vh;
          width: 100vw;
        }
        .main-content {
          grid-column: 2;
          grid-row: 2;
          overflow-y: auto;
          padding: 28px;
          background: var(--bg-primary);
        }
        @media (max-width: 1024px) {
          .app-container {
            grid-template-columns: 1fr;
          }
          .main-content {
            grid-column: 1;
          }
        }
        @media (max-width: 768px) {
          .main-content {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}
