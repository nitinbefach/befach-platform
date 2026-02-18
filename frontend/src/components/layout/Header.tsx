'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calculator, Ship, BarChart3, Box, Truck, FileCheck,
  Bot, FileText, Database, ChevronDown, Search, ArrowRight
} from 'lucide-react';
import { Logo } from '../ui';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('trade');

  const isActive = (path: string) => pathname === path;

  return (
    <header className="main-header">
      <div className="header-content">
        {/* Logo */}
        <Logo size="medium" />

        {/* Desktop Navigation */}
        <nav className="main-nav">
          <Link href="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          <Link href="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About Us</Link>
          <Link href="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>Products</Link>

          {/* Solutions Dropdown */}
          <div className="nav-dropdown">
            <button className="nav-link dropdown-trigger">
              Solutions
              <ChevronDown size={16} className="dropdown-icon" />
            </button>
            <div className="dropdown-menu">
              <div className="dropdown-content">
                {/* Left Sidebar - Tabs */}
                <div className="dropdown-sidebar">
                  <button
                    className={`dropdown-tab ${activeTab === 'trade' ? 'active' : ''}`}
                    onClick={() => setActiveTab('trade')}
                  >
                    Trade Intelligence
                  </button>
                  <button
                    className={`dropdown-tab ${activeTab === 'sourcing' ? 'active' : ''}`}
                    onClick={() => setActiveTab('sourcing')}
                  >
                    Sourcing & Logistics
                  </button>
                  <button
                    className={`dropdown-tab ${activeTab === 'tools' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tools')}
                  >
                    Tools & Support
                  </button>
                </div>

                {/* Right Content - Items */}
                <div className="dropdown-main">
                  {activeTab === 'trade' && (
                    <div className="dropdown-items">
                      <Link href="/cost-calculator" className="dropdown-item">
                        <div className="dropdown-icon-box">
                          <Calculator size={22} />
                        </div>
                        <div className="dropdown-item-content">
                          <h4>Cost Calculator</h4>
                          <p>Estimate your total landing costs.</p>
                        </div>
                        <ArrowRight size={18} className="dropdown-arrow" />
                      </Link>
                      <Link href="/shipping-calculator" className="dropdown-item">
                        <div className="dropdown-icon-box">
                          <Ship size={22} />
                        </div>
                        <div className="dropdown-item-content">
                          <h4>Shipping Calculator</h4>
                          <p>Compare rates from top carriers.</p>
                        </div>
                        <ArrowRight size={18} className="dropdown-arrow" />
                      </Link>
                      <Link href="/market-insights" className="dropdown-item">
                        <div className="dropdown-icon-box">
                          <BarChart3 size={22} />
                        </div>
                        <div className="dropdown-item-content">
                          <h4>Market Insights</h4>
                          <p>Get data-driven trade analysis.</p>
                        </div>
                        <ArrowRight size={18} className="dropdown-arrow" />
                      </Link>
                    </div>
                  )}
                  {activeTab === 'sourcing' && (
                    <div className="dropdown-items">
                      <Link href="/smart-sourcing" className="dropdown-item">
                        <div className="dropdown-icon-box">
                          <Box size={22} />
                        </div>
                        <div className="dropdown-item-content">
                          <h4>Smart Sourcing</h4>
                          <p>Find reliable suppliers globally.</p>
                        </div>
                        <ArrowRight size={18} className="dropdown-arrow" />
                      </Link>
                      <Link href="/track-shipment" className="dropdown-item">
                        <div className="dropdown-icon-box">
                          <Truck size={22} />
                        </div>
                        <div className="dropdown-item-content">
                          <h4>Track Shipments</h4>
                          <p>Real-time shipment visibility.</p>
                        </div>
                        <ArrowRight size={18} className="dropdown-arrow" />
                      </Link>
                      <Link href="/compliance-tools" className="dropdown-item">
                        <div className="dropdown-icon-box">
                          <FileCheck size={22} />
                        </div>
                        <div className="dropdown-item-content">
                          <h4>Compliance Tools</h4>
                          <p>Navigate customs with ease.</p>
                        </div>
                        <ArrowRight size={18} className="dropdown-arrow" />
                      </Link>
                    </div>
                  )}
                  {activeTab === 'tools' && (
                    <div className="dropdown-items">
                      <Link href="/ai-assistant" className="dropdown-item">
                        <div className="dropdown-icon-box">
                          <Bot size={22} />
                        </div>
                        <div className="dropdown-item-content">
                          <h4>AI Assistant</h4>
                          <p>Get instant answers 24/7.</p>
                        </div>
                        <ArrowRight size={18} className="dropdown-arrow" />
                      </Link>
                      <Link href="/documents" className="dropdown-item">
                        <div className="dropdown-icon-box">
                          <FileText size={22} />
                        </div>
                        <div className="dropdown-item-content">
                          <h4>Documents</h4>
                          <p>Manage all your paperwork in one place.</p>
                        </div>
                        <ArrowRight size={18} className="dropdown-arrow" />
                      </Link>
                      <Link href="/reports" className="dropdown-item">
                        <div className="dropdown-icon-box">
                          <Database size={22} />
                        </div>
                        <div className="dropdown-item-content">
                          <h4>Reports</h4>
                          <p>Generate custom shipping reports.</p>
                        </div>
                        <ArrowRight size={18} className="dropdown-arrow" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Link href="/services" className={`nav-link ${isActive('/services') ? 'active' : ''}`}>Services</Link>
          <Link href="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact Us</Link>
        </nav>

        {/* Right Actions */}
        <div className="header-actions">
          <button className="search-btn" aria-label="Search">
            <Search size={20} />
          </button>
          <Link href="/onboarding" className="login-btn">
            Login
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12"/>
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18"/>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="mobile-nav">
          <Link href="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link href="/about" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
          <Link href="/products" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Products</Link>
          <Link href="/services" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Services</Link>
          <Link href="/contact" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Contact Us</Link>
          <Link href="/onboarding" className="mobile-login-btn" onClick={() => setMobileMenuOpen(false)}>
            Login
          </Link>
        </nav>
      )}

      <style jsx>{`
        .main-header {
          background: #ffffff;
          border-bottom: 1px solid #e7e5e4;
          position: sticky;
          top: 0;
          z-index: 100;
        }


        .header-content {
          max-width: 1280px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: center;
          text-decoration: none;
        }

        .logo-image {
          height: 50px;
          width: auto;
          object-fit: contain;
        }

        .main-nav {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .nav-link {
          color: #1c1917;
          text-decoration: none;
          font-size: 0.9375rem;
          font-weight: 500;
          transition: color 0.2s;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px 0;
          position: relative;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: #f59e0b;
          transition: width 0.2s;
        }

        .nav-link:hover::after,
        .nav-link.active::after {
          width: 100%;
        }

        .nav-link:hover,
        .nav-link.active {
          color: #f59e0b;
        }


        /* Dropdown */
        .nav-dropdown {
          position: relative;
        }

        .dropdown-trigger {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .dropdown-icon {
          transition: transform 0.3s ease;
        }

        .nav-dropdown:hover .dropdown-icon {
          transform: rotate(180deg);
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(10px);
          padding-top: 20px;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition: all 0.3s ease;
          z-index: 1000;
        }

        .nav-dropdown:hover .dropdown-menu {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transform: translateX(-50%) translateY(0);
        }

        .dropdown-content {
          background: white;
          border-radius: 20px;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.2), 0 10px 30px -10px rgba(0, 0, 0, 0.1);
          display: flex;
          overflow: hidden;
          width: 680px;
          border: 1px solid rgba(0,0,0,0.06);
        }


        .dropdown-sidebar {
          width: 35%;
          background: linear-gradient(180deg, #faf9f7 0%, #f5f3f0 100%);
          padding: 20px;
          border-right: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }


        .dropdown-tab {
          width: 100%;
          text-align: left;
          font-weight: 500;
          padding: 14px 16px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.9rem;
          background: transparent;
          color: #4b5563;
        }


        .dropdown-tab:hover {
          background: rgba(245, 158, 11, 0.08);
          color: #d97706;
        }

        .dropdown-tab.active {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        .dropdown-main {
          width: 65%;
          padding: 20px 24px;
          background: white;
        }


        .dropdown-items {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          padding: 14px 16px;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .dropdown-item:hover {
          background: #fef7ed;
          border-color: rgba(245, 158, 11, 0.15);
        }


        .dropdown-icon-box {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%);
          border-radius: 12px;
          margin-right: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }


        .dropdown-item:hover .dropdown-icon-box {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        .dropdown-icon-box :global(svg) {
          color: #d97706;
          transition: color 0.2s ease;
        }


        .dropdown-item:hover .dropdown-icon-box :global(svg) {
          color: white;
        }

        .dropdown-item-content {
          flex: 1;
          min-width: 0;
        }

        .dropdown-item-content h4 {
          font-weight: 600;
          color: #1f2937;
          font-size: 0.9rem;
          margin-bottom: 4px;
          transition: color 0.2s ease;
        }


        .dropdown-item:hover .dropdown-item-content h4 {
          color: #d97706;
        }

        .dropdown-item-content p {
          font-size: 0.8125rem;
          color: #9ca3af;
          margin: 0;
          line-height: 1.4;
        }

        .dropdown-arrow {
          color: #d1d5db;
          margin-left: 8px;
          transition: all 0.2s ease;
          opacity: 0;
          transform: translateX(-4px);
        }

        .dropdown-item:hover .dropdown-arrow {
          color: #f59e0b;
          opacity: 1;
          transform: translateX(0);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .search-btn {
          background: none;
          border: none;
          color: #1c1917;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .search-btn:hover {
          background: #f5f5f4;
          color: #f59e0b;
        }



        .login-btn {
          background: transparent;
          color: #f59e0b;
          text-decoration: none;
          padding: 10px 24px;
          border: 2px solid #f59e0b;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .login-btn:hover {
          background: #f59e0b;
          color: white;
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: #1c1917;
          cursor: pointer;
          padding: 8px;
        }


        .mobile-nav {
          display: none;
          flex-direction: column;
          padding: 16px 24px;
          background: #faf9f7;
          border-top: 1px solid #e7e5e4;
        }


        .mobile-nav-link {
          color: #1c1917;
          text-decoration: none;
          padding: 12px 0;
          font-weight: 500;
          border-bottom: 1px solid #e7e5e4;
        }


        .mobile-login-btn {
          background: #f59e0b;
          color: white;
          text-decoration: none;
          padding: 12px;
          border-radius: 50px;
          font-weight: 600;
          text-align: center;
          margin-top: 16px;
        }

        @media (max-width: 1024px) {
          .main-nav {
            display: none;
          }

          .login-btn {
            display: none;
          }

          .mobile-menu-btn {
            display: block;
          }

          .mobile-nav {
            display: flex;
          }
        }
      `}</style>
    </header>
  );
}
