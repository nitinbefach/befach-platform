'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Package, Box, Truck, Database, FileCheck,
  Calculator, Ship, BarChart3, Bot, FileText, ChevronDown,
  CheckCircle2, Search, MapPin, Mail, Phone, ArrowRight,
  X, Info, Globe, DollarSign, Send, ArrowLeft, TrendingUp,
  Menu, Play, Zap, Shield, Users, Star
} from 'lucide-react';

// Feature tabs for the interactive widget
const FEATURES = [
  { id: 'landed-cost', title: 'Landed Cost', short: 'Cost Calc', icon: Calculator, color: 'bg-orange-500' },
  { id: 'shipping-rates', title: 'Shipping Rates', short: 'Shipping', icon: Ship, color: 'bg-amber-500' },
  { id: 'exim-data', title: 'EXIM Data', short: 'Trade Data', icon: Globe, color: 'bg-emerald-500' },
  { id: 'taxes-duties', title: 'Taxes & Duties', short: 'Compliance', icon: FileCheck, color: 'bg-amber-500' },
];

const countries = [
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪' },
];

const shippingModes = [
  { id: 'express', name: 'Express', days: '2-4 days' },
  { id: 'standard', name: 'Standard', days: '5-7 days' },
  { id: 'economy', name: 'Economy', days: '10-15 days' },
];

const carriers = [
  { id: 'dhl', name: 'DHL Express', color: '#FFCC00', textColor: '#D40511', rating: 4.8 },
  { id: 'fedex', name: 'FedEx', color: '#4D148C', textColor: '#FF6600', rating: 4.7 },
  { id: 'ups', name: 'UPS', color: '#351C15', textColor: '#FFB500', rating: 4.6 },
  { id: 'shiprocket', name: 'Shiprocket', color: '#8B5CF6', textColor: '#FFFFFF', rating: 4.5 },
  { id: 'aramex', name: 'Aramex', color: '#E31E24', textColor: '#FFFFFF', rating: 4.4 },
];

const testimonials = [
  { id: 1, name: 'Rajesh Kumar', role: 'CEO, TechImports India', text: 'Befach transformed our sourcing process. We reduced costs by 25% and improved delivery times significantly.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80' },
  { id: 2, name: 'Sarah Chen', role: 'Director, Global Trade Co.', text: 'The EX-IM data analytics helped us identify new markets we never considered. Outstanding platform!', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80' },
  { id: 3, name: 'Michael Roberts', role: 'Founder, Import Solutions', text: 'Their customs clearance tools are exceptional. No more delays or compliance issues for our shipments.', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80' },
];

const trustedCompanies = ['Amazon', 'Flipkart', 'Alibaba', 'Walmart', 'Tata'];

export default function HomePage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState('landed-cost');

  // Calculator states
  const [calcOrigin, setCalcOrigin] = useState('CN');
  const [calcDest, setCalcDest] = useState('IN');
  const [calcValue, setCalcValue] = useState('25000');
  const [calcResult, setCalcResult] = useState<{duties: number; freight: number; total: number} | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Shipping states
  const [shipWeight, setShipWeight] = useState('10');
  const [shipMode, setShipMode] = useState('standard');
  const [shipResults, setShipResults] = useState<any[] | null>(null);

  // Chat states
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const value = parseFloat(calcValue) || 0;
      const duties = Math.round(value * 0.12 * 100) / 100;
      const freight = Math.round(value * 0.08 * 100) / 100;
      setCalcResult({
        duties,
        freight,
        total: Math.round((value + duties + freight) * 100) / 100
      });
      setIsCalculating(false);
    }, 800);
  };

  const handleShippingCalc = () => {
    const weight = parseFloat(shipWeight) || 1;
    const baseRates: Record<string, Record<string, number>> = {
      express: { dhl: 45, fedex: 42, ups: 40, shiprocket: 35, aramex: 38 },
      standard: { dhl: 28, fedex: 26, ups: 25, shiprocket: 20, aramex: 22 },
      economy: { dhl: 18, fedex: 16, ups: 15, shiprocket: 12, aramex: 14 },
    };
    const results = carriers.map(c => ({
      ...c,
      price: Math.round(baseRates[shipMode][c.id] * weight * 100) / 100,
      days: shippingModes.find(m => m.id === shipMode)?.days || '5-7 days'
    })).sort((a, b) => a.price - b.price);
    setShipResults(results);
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput('');
    setIsChatLoading(true);

    setTimeout(() => {
      let response = '';
      if (userMsg.toLowerCase().includes('duty') || userMsg.toLowerCase().includes('tax')) {
        response = `Import duties vary by product and HS Code:\n\n• Basic Customs Duty: 5-100%\n• IGST: 18% on assessable value\n• Social Welfare Surcharge: 10%\n\nProvide your HS Code for exact rates.`;
      } else if (userMsg.toLowerCase().includes('export') || userMsg.toLowerCase().includes('import')) {
        response = `India Trade Data 2024:\n\n📊 Top Exports: Petroleum ($87B), Gems ($38B), Pharma ($25B)\n📊 Top Imports: Crude Oil ($158B), Electronics ($85B)\n\nSpecify a product for detailed analysis.`;
      } else {
        response = `I can help you with:\n\n• Import/Export duty rates\n• HS Code classification\n• Trade statistics by country\n• Shipping cost estimates\n\nWhat would you like to know?`;
      }
      setChatMessages(prev => [...prev, { role: 'bot', content: response }]);
      setIsChatLoading(false);
    }, 1200);
  };

  return (
    <div className="home-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/" className="nav-logo">
            <img src="/logo.png" alt="Befach International" className="logo-image" />
          </Link>

          <div className="nav-links">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/cost-calculator">Cost Calculator</Link>
            <Link href="/shipping-calculator">Shipping</Link>
            <Link href="/market-insights">EXIM Data</Link>
            <Link href="/smart-sourcing">Sourcing</Link>
          </div>

          <div className="nav-actions">
            <Link href="/login" className="nav-login">Log in</Link>
            <Link href="/onboarding" className="nav-cta">Get Started Free</Link>
          </div>

          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/cost-calculator">Cost Calculator</Link>
            <Link href="/shipping-calculator">Shipping</Link>
            <Link href="/market-insights">EXIM Data</Link>
            <Link href="/smart-sourcing">Sourcing</Link>
            <div className="mobile-divider"></div>
            <Link href="/login">Log in</Link>
            <Link href="/onboarding" className="mobile-cta">Get Started Free</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              <span>New: AI-Powered HS Code Classification</span>
            </div>

            <h1 className="hero-title">
              Global trade logistics,{' '}
              <span className="gradient-text">simplified.</span>
            </h1>

            <p className="hero-description">
              Stop guessing your margins. Calculate landed costs, compare shipping rates,
              and manage compliance all in one platform.
            </p>

            <div className="hero-cta-group">
              <Link href="/onboarding" className="btn-primary">
                Start Free Trial
              </Link>
              <button className="btn-secondary">
                <div className="play-icon">
                  <Play size={12} fill="currentColor" />
                </div>
                Watch Demo
              </button>
            </div>

            <div className="hero-trust">
              <div className="trust-item">
                <CheckCircle2 size={16} className="check-icon" />
                <span>No credit card required</span>
              </div>
              <div className="trust-item">
                <CheckCircle2 size={16} className="check-icon" />
                <span>14-day free trial</span>
              </div>
            </div>
          </div>

          {/* Interactive Widget */}
          <div className="hero-widget">
            <div className="widget-card">
              <div className="widget-gradient-bar"></div>

              {/* Widget Tabs */}
              <div className="widget-tabs">
                {FEATURES.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFeature(f.id)}
                    className={`widget-tab ${activeFeature === f.id ? 'active' : ''}`}
                  >
                    <f.icon size={16} />
                    <span>{f.short}</span>
                  </button>
                ))}
              </div>

              {/* Widget Content */}
              <div className="widget-content">
                {activeFeature === 'landed-cost' && (
                  <div className="widget-panel">
                    <h3>Estimate Landed Cost</h3>
                    <div className="calc-grid">
                      <div className="calc-field">
                        <label>Origin</label>
                        <div className="select-box">
                          <span className="flag">{countries.find(c => c.code === calcOrigin)?.flag}</span>
                          <select value={calcOrigin} onChange={(e) => setCalcOrigin(e.target.value)}>
                            {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="calc-field">
                        <label>Destination</label>
                        <div className="select-box">
                          <span className="flag">{countries.find(c => c.code === calcDest)?.flag}</span>
                          <select value={calcDest} onChange={(e) => setCalcDest(e.target.value)}>
                            {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="calc-field full">
                      <label>Product Value (USD)</label>
                      <input
                        type="text"
                        value={`$ ${calcValue}`}
                        onChange={(e) => setCalcValue(e.target.value.replace(/[^0-9]/g, ''))}
                      />
                    </div>

                    {calcResult ? (
                      <div className="result-box">
                        <div className="result-row">
                          <span>Duties (Est.)</span>
                          <span className="value">${calcResult.duties.toLocaleString()}</span>
                        </div>
                        <div className="result-row">
                          <span>Freight (Est.)</span>
                          <span className="value">${calcResult.freight.toLocaleString()}</span>
                        </div>
                        <div className="result-divider"></div>
                        <div className="result-row total">
                          <span>Total Landed</span>
                          <span className="value">${calcResult.total.toLocaleString()}</span>
                        </div>
                      </div>
                    ) : (
                      <button className="widget-btn" onClick={handleCalculate} disabled={isCalculating}>
                        {isCalculating ? 'Calculating...' : 'Calculate Now'}
                      </button>
                    )}
                    {calcResult && (
                      <button className="widget-btn secondary" onClick={() => setCalcResult(null)}>
                        Reset
                      </button>
                    )}
                  </div>
                )}

                {activeFeature === 'shipping-rates' && (
                  <div className="widget-panel">
                    <h3>Compare Carrier Rates</h3>
                    <div className="calc-grid">
                      <div className="calc-field">
                        <label>Weight (kg)</label>
                        <input
                          type="number"
                          value={shipWeight}
                          onChange={(e) => setShipWeight(e.target.value)}
                          placeholder="10"
                        />
                      </div>
                      <div className="calc-field">
                        <label>Mode</label>
                        <select value={shipMode} onChange={(e) => setShipMode(e.target.value)}>
                          {shippingModes.map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {shipResults ? (
                      <div className="carrier-list">
                        {shipResults.slice(0, 3).map((r, i) => (
                          <div key={r.id} className={`carrier-row ${i === 0 ? 'best' : ''}`}>
                            {i === 0 && <span className="best-tag">Best Price</span>}
                            <div className="carrier-info">
                              <div className="carrier-logo" style={{ background: r.color }}>
                                <span style={{ color: r.textColor }}>{r.id.slice(0,3).toUpperCase()}</span>
                              </div>
                              <div>
                                <div className="carrier-name">{r.name}</div>
                                <div className="carrier-days">{r.days}</div>
                              </div>
                            </div>
                            <div className="carrier-price">${r.price}</div>
                          </div>
                        ))}
                        <button className="widget-btn secondary" onClick={() => setShipResults(null)}>
                          Reset
                        </button>
                      </div>
                    ) : (
                      <button className="widget-btn" onClick={handleShippingCalc}>
                        Get Rates
                      </button>
                    )}
                  </div>
                )}

                {activeFeature === 'exim-data' && (
                  <div className="widget-panel">
                    <h3>Search Trade Data</h3>
                    <div className="search-box">
                      <Search size={16} />
                      <input type="text" placeholder="Search by HS Code, Product, or Company..." />
                    </div>
                    <div className="data-grid">
                      <div className="data-card">
                        <span className="data-label">Top Exporter</span>
                        <span className="data-value">China</span>
                      </div>
                      <div className="data-card">
                        <span className="data-label">YoY Trend</span>
                        <span className="data-value green">
                          <TrendingUp size={14} /> +12%
                        </span>
                      </div>
                    </div>
                    <div className="chart-placeholder">
                      <BarChart3 size={24} />
                      <span>Data Visualization Preview</span>
                    </div>
                    <button className="widget-btn" onClick={() => router.push('/market-insights')}>
                      Explore Full Data
                    </button>
                  </div>
                )}

                {activeFeature === 'taxes-duties' && (
                  <div className="widget-panel chat-panel">
                    <h3>Ask About Taxes & Duties</h3>
                    <div className="chat-area">
                      {chatMessages.length === 0 ? (
                        <div className="chat-empty">
                          <Bot size={32} />
                          <p>Ask about customs duties, HS codes, or compliance</p>
                          <div className="chat-suggestions">
                            <button onClick={() => setChatInput('What is import duty on electronics?')}>
                              Import duty on electronics
                            </button>
                            <button onClick={() => setChatInput('How to find HS Code?')}>
                              How to find HS Code
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="chat-messages">
                          {chatMessages.map((msg, i) => (
                            <div key={i} className={`chat-msg ${msg.role}`}>
                              {msg.role === 'bot' && <div className="bot-avatar"><Bot size={14} /></div>}
                              <div className="msg-content">
                                {msg.content.split('\n').map((line, j) => <p key={j}>{line}</p>)}
                              </div>
                            </div>
                          ))}
                          {isChatLoading && (
                            <div className="chat-msg bot">
                              <div className="bot-avatar"><Bot size={14} /></div>
                              <div className="msg-content typing">
                                <span></span><span></span><span></span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="chat-input">
                      <input
                        type="text"
                        placeholder="Type your question..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                      />
                      <button onClick={handleChatSend} disabled={!chatInput.trim()}>
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="trusted-section">
        <div className="trusted-container">
          <p>Trusted by leading importers and exporters</p>
          <div className="trusted-logos">
            {trustedCompanies.map((company) => (
              <span key={company} className="company-logo">{company}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="features-section">
        <div className="features-container">
          <div className="section-header">
            <h2>Everything you need to ship cross-border</h2>
            <p>One platform to manage the entire lifecycle of your international shipments.</p>
          </div>

          <div className="bento-grid">
            {/* Main Feature */}
            <div className="bento-main">
              <div className="bento-glow"></div>
              <div className="bento-content">
                <div className="bento-badge">Befach Ecosystem</div>
                <h3>Command Center for Global Logistics</h3>
                <p>Seamlessly integrate rates, duties, and data into your workflow.</p>
                <Link href="/onboarding" className="bento-cta">Get Started Now</Link>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="bento-card">
              <div className="bento-icon blue">
                <Calculator size={20} />
              </div>
              <h4>Landed Cost</h4>
              <p>Calculate profit margins with precision.</p>
            </div>

            <div className="bento-card">
              <div className="bento-icon indigo">
                <Ship size={20} />
              </div>
              <h4>Shipping Rates</h4>
              <p>Real-time quotes from top carriers.</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '70%' }}></div>
              </div>
            </div>

            <div className="bento-card">
              <div className="bento-icon emerald">
                <Globe size={20} />
              </div>
              <h4>Global EXIM Data</h4>
              <p>Find buyers & suppliers worldwide.</p>
            </div>

            <div className="bento-card amber">
              <div className="bento-icon amber-icon">
                <FileCheck size={20} />
              </div>
              <h4>Taxes & Duties</h4>
              <p>Automated compliance checks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number">500K+</span>
            <span className="stat-label">Shipments Tracked</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">200+</span>
            <span className="stat-label">Countries Covered</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">Carrier Partners</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">99.8%</span>
            <span className="stat-label">Accuracy Rate</span>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <div className="section-header">
            <h2>Loved by trade professionals</h2>
            <p>See what our customers have to say about Befach.</p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((t) => (
              <div key={t.id} className="testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />)}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <img src={t.image} alt={t.name} />
                  <div>
                    <span className="author-name">{t.name}</span>
                    <span className="author-role">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to simplify your global trade?</h2>
          <p>Join thousands of businesses already using Befach to streamline their operations.</p>
          <div className="cta-buttons">
            <Link href="/onboarding" className="btn-primary large">Start Free Trial</Link>
            <Link href="/contact" className="btn-outline large">Talk to Sales</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              <img src="/logo.png" alt="Befach International" className="footer-logo-image" />
            </Link>
            <p>Your trusted partner for global trade solutions. We connect businesses worldwide with quality products and seamless logistics.</p>
          </div>

          <div className="footer-links">
            <div className="footer-col">
              <h4>Platform</h4>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/cost-calculator">Cost Calculator</Link>
              <Link href="/shipping-calculator">Shipping Rates</Link>
              <Link href="/market-insights">EXIM Data</Link>
            </div>
            <div className="footer-col">
              <h4>Solutions</h4>
              <Link href="/smart-sourcing">Smart Sourcing</Link>
              <Link href="/logistics-tracking">Logistics Tracking</Link>
              <Link href="/compliance-tools">Compliance Tools</Link>
              <Link href="/ai-assistant">AI Assistant</Link>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <Link href="/about">About Us</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/login">Login</Link>
              <Link href="/onboarding">Sign Up</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 Befach International. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .home-page {
          min-height: 100vh;
          background: #ffffff;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #1f2937;
        }

        /* Navbar */
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #f3f4f6;
        }

        .nav-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .logo-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 1.1rem;
        }

        .logo-image {
          height: 40px;
          width: auto;
          object-fit: contain;
        }

        .footer-logo-image {
          height: 32px;
          width: auto;
          object-fit: contain;
        }

        .mobile-divider {
          height: 1px;
          background: #e5e7eb;
          margin: 8px 0;
        }

        .nav-logo span {
          font-weight: 700;
          font-size: 1.125rem;
          color: #111827;
          letter-spacing: -0.02em;
        }

        .nav-links {
          display: none;
          align-items: center;
          gap: 32px;
        }

        .nav-links a {
          color: #4b5563;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: color 0.2s;
        }

        .nav-links a:hover {
          color: #f59e0b;
        }

        .nav-actions {
          display: none;
          align-items: center;
          gap: 16px;
        }

        .nav-login {
          color: #4b5563;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .nav-cta {
          background: #111827;
          color: white;
          padding: 10px 20px;
          border-radius: 10px;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 600;
          transition: background 0.2s;
        }

        .nav-cta:hover {
          background: #1f2937;
        }

        .mobile-menu-btn {
          display: block;
          background: none;
          border: none;
          color: #374151;
          cursor: pointer;
        }

        .mobile-menu {
          padding: 16px 24px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          border-top: 1px solid #f3f4f6;
        }

        .mobile-menu a {
          color: #374151;
          text-decoration: none;
          font-weight: 500;
        }

        .mobile-cta {
          background: #111827;
          color: white !important;
          padding: 12px 20px;
          border-radius: 10px;
          text-align: center;
        }

        @media (min-width: 768px) {
          .nav-links {
            display: flex;
          }
          .nav-actions {
            display: flex;
          }
          .mobile-menu-btn {
            display: none;
          }
        }

        /* Hero */
        .hero {
          padding: 60px 24px 80px;
          background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 800px;
          height: 800px;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-container {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 48px;
        }

        .hero-content {
          max-width: 560px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: #fff7ed;
          border: 1px solid #fed7aa;
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 500;
          color: #d97706;
          margin-bottom: 24px;
        }

        .badge-dot {
          position: relative;
          width: 8px;
          height: 8px;
        }

        .badge-dot::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #fb923c;
          border-radius: 50%;
          animation: ping 1.5s infinite;
        }

        .badge-dot::after {
          content: '';
          position: absolute;
          inset: 0;
          background: #f59e0b;
          border-radius: 50%;
        }

        @keyframes ping {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }

        .hero-title {
          font-size: 2.75rem;
          font-weight: 800;
          line-height: 1.1;
          color: #111827;
          letter-spacing: -0.03em;
          margin-bottom: 20px;
        }

        .gradient-text {
          background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          font-size: 1.1rem;
          line-height: 1.7;
          color: #6b7280;
          margin-bottom: 32px;
        }

        .hero-cta-group {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 24px;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 28px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.95rem;
          text-decoration: none;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(245, 158, 11, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
        }

        .btn-primary.large {
          padding: 16px 32px;
          font-size: 1rem;
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 24px;
          background: white;
          color: #374151;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .btn-outline {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 28px;
          background: transparent;
          color: #374151;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.95rem;
          text-decoration: none;
          transition: all 0.2s;
        }

        .btn-outline:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .btn-outline.large {
          padding: 16px 32px;
          font-size: 1rem;
        }

        .play-icon {
          width: 24px;
          height: 24px;
          background: #f3f4f6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-trust {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: #6b7280;
          font-weight: 500;
        }

        .check-icon {
          color: #10b981;
        }

        /* Widget */
        .hero-widget {
          width: 100%;
          max-width: 520px;
        }

        .widget-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.12);
          border: 1px solid #f3f4f6;
          overflow: hidden;
          position: relative;
        }

        .widget-gradient-bar {
          height: 4px;
          background: linear-gradient(90deg, #f59e0b 0%, #ea580c 50%, #dc2626 100%);
        }

        .widget-tabs {
          display: flex;
          background: #f9fafb;
          border-bottom: 1px solid #f3f4f6;
        }

        .widget-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 14px 8px;
          background: none;
          border: none;
          font-size: 0.75rem;
          font-weight: 500;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
          border-top: 2px solid transparent;
        }

        .widget-tab:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .widget-tab.active {
          background: white;
          color: #f59e0b;
          border-top-color: #f59e0b;
        }

        .widget-tab span {
          display: none;
        }

        @media (min-width: 480px) {
          .widget-tab span {
            display: inline;
          }
        }

        .widget-content {
          padding: 24px;
          min-height: 320px;
        }

        .widget-panel {
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .widget-panel h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 20px;
        }

        .calc-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }

        .calc-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .calc-field.full {
          grid-column: span 2;
        }

        .calc-field label {
          font-size: 0.7rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .select-box {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
        }

        .select-box .flag {
          font-size: 1.1rem;
        }

        .select-box select {
          flex: 1;
          background: none;
          border: none;
          font-size: 0.9rem;
          font-weight: 500;
          color: #111827;
          cursor: pointer;
          outline: none;
        }

        .calc-field input,
        .calc-field select {
          padding: 10px 12px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-size: 0.9rem;
          color: #111827;
          outline: none;
          transition: border-color 0.2s;
        }

        .calc-field input:focus,
        .calc-field select:focus {
          border-color: #f59e0b;
        }

        .result-box {
          background: #fff7ed;
          border: 1px solid #fed7aa;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
        }

        .result-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          color: #4b5563;
          padding: 6px 0;
        }

        .result-row .value {
          font-weight: 600;
          color: #111827;
        }

        .result-row.total {
          font-weight: 700;
          color: #b45309;
          font-size: 1rem;
        }

        .result-row.total .value {
          color: #b45309;
        }

        .result-divider {
          height: 1px;
          background: #fdba74;
          margin: 8px 0;
        }

        .widget-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .widget-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        .widget-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .widget-btn.secondary {
          background: #f3f4f6;
          color: #374151;
          margin-top: 8px;
        }

        .widget-btn.secondary:hover {
          background: #e5e7eb;
          box-shadow: none;
        }

        /* Carrier List */
        .carrier-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .carrier-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          transition: all 0.2s;
          position: relative;
        }

        .carrier-row:hover {
          border-color: #f59e0b;
        }

        .carrier-row.best {
          background: #fff7ed;
          border-color: #f59e0b;
        }

        .best-tag {
          position: absolute;
          top: -8px;
          right: 12px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          font-size: 0.6rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .carrier-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .carrier-logo {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.6rem;
          font-weight: 700;
        }

        .carrier-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: #111827;
        }

        .carrier-days {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .carrier-price {
          font-size: 1rem;
          font-weight: 700;
          color: #111827;
        }

        /* Search & Data */
        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          margin-bottom: 16px;
        }

        .search-box input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          font-size: 0.875rem;
        }

        .search-box svg {
          color: #9ca3af;
        }

        .data-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }

        .data-card {
          background: #f9fafb;
          border-radius: 10px;
          padding: 14px;
          text-align: center;
        }

        .data-label {
          display: block;
          font-size: 0.7rem;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .data-value {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          font-weight: 700;
          color: #111827;
        }

        .data-value.green {
          color: #059669;
        }

        .chart-placeholder {
          height: 100px;
          background: #f3f4f6;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #9ca3af;
          font-size: 0.8rem;
          margin-bottom: 16px;
        }

        /* Chat Panel */
        .chat-panel {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .chat-area {
          flex: 1;
          min-height: 180px;
          max-height: 200px;
          overflow-y: auto;
          margin-bottom: 12px;
        }

        .chat-empty {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #6b7280;
        }

        .chat-empty svg {
          color: #d1d5db;
          margin-bottom: 12px;
        }

        .chat-empty p {
          font-size: 0.85rem;
          margin-bottom: 16px;
        }

        .chat-suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
        }

        .chat-suggestions button {
          padding: 8px 12px;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          font-size: 0.75rem;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
        }

        .chat-suggestions button:hover {
          background: #e5e7eb;
        }

        .chat-messages {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .chat-msg {
          display: flex;
          gap: 8px;
          animation: fadeIn 0.3s ease;
        }

        .chat-msg.user {
          justify-content: flex-end;
        }

        .chat-msg.user .msg-content {
          background: #f59e0b;
          color: white;
          border-radius: 12px 12px 4px 12px;
        }

        .chat-msg.bot .msg-content {
          background: #f3f4f6;
          color: #374151;
          border-radius: 12px 12px 12px 4px;
        }

        .bot-avatar {
          width: 24px;
          height: 24px;
          background: #f59e0b;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .msg-content {
          padding: 10px 14px;
          max-width: 85%;
        }

        .msg-content p {
          margin: 0;
          font-size: 0.8rem;
          line-height: 1.5;
        }

        .msg-content p:empty {
          height: 6px;
        }

        .msg-content.typing {
          display: flex;
          gap: 4px;
          padding: 14px 18px;
        }

        .msg-content.typing span {
          width: 6px;
          height: 6px;
          background: #9ca3af;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out;
        }

        .msg-content.typing span:nth-child(1) { animation-delay: 0s; }
        .msg-content.typing span:nth-child(2) { animation-delay: 0.2s; }
        .msg-content.typing span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1.2); opacity: 1; }
        }

        .chat-input {
          display: flex;
          gap: 8px;
        }

        .chat-input input {
          flex: 1;
          padding: 12px 16px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-size: 0.875rem;
          outline: none;
        }

        .chat-input input:focus {
          border-color: #f59e0b;
        }

        .chat-input button {
          width: 44px;
          height: 44px;
          background: #f59e0b;
          border: none;
          border-radius: 10px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .chat-input button:hover:not(:disabled) {
          background: #d97706;
        }

        .chat-input button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (min-width: 1024px) {
          .hero-container {
            flex-direction: row;
            align-items: center;
            gap: 64px;
          }

          .hero-content {
            flex: 1;
          }

          .hero-widget {
            flex: 1;
            max-width: 520px;
          }

          .hero-title {
            font-size: 3.5rem;
          }
        }

        /* Trusted Section */
        .trusted-section {
          padding: 40px 24px;
          background: #f9fafb;
          border-top: 1px solid #f3f4f6;
          border-bottom: 1px solid #f3f4f6;
        }

        .trusted-container {
          max-width: 1280px;
          margin: 0 auto;
          text-align: center;
        }

        .trusted-container p {
          font-size: 0.85rem;
          color: #9ca3af;
          margin-bottom: 20px;
          font-weight: 500;
        }

        .trusted-logos {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 32px;
        }

        .company-logo {
          font-size: 1.25rem;
          font-weight: 700;
          color: #d1d5db;
          letter-spacing: -0.02em;
        }

        /* Features Section */
        .features-section {
          padding: 80px 24px;
        }

        .features-container {
          max-width: 1280px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .section-header h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 12px;
          letter-spacing: -0.02em;
        }

        .section-header p {
          font-size: 1rem;
          color: #6b7280;
        }

        .bento-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        @media (min-width: 768px) {
          .bento-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .bento-grid {
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: repeat(2, 1fr);
          }

          .bento-main {
            grid-column: span 2;
            grid-row: span 2;
          }
        }

        .bento-main {
          background: #111827;
          border-radius: 24px;
          padding: 32px;
          position: relative;
          overflow: hidden;
          min-height: 300px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .bento-glow {
          position: absolute;
          top: 0;
          right: 0;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 70%);
        }

        .bento-content {
          position: relative;
          z-index: 1;
        }

        .bento-badge {
          display: inline-block;
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 500;
          color: white;
          margin-bottom: 20px;
        }

        .bento-main h3 {
          font-size: 1.75rem;
          font-weight: 700;
          color: white;
          margin-bottom: 12px;
        }

        .bento-main p {
          color: #9ca3af;
          margin-bottom: 24px;
        }

        .bento-cta {
          display: inline-block;
          padding: 14px 28px;
          background: white;
          color: #111827;
          border-radius: 12px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }

        .bento-cta:hover {
          background: #f3f4f6;
        }

        .bento-card {
          background: white;
          border: 1px solid #f3f4f6;
          border-radius: 24px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          transition: all 0.2s;
        }

        .bento-card:hover {
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
          transform: translateY(-2px);
        }

        .bento-card.amber {
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
          border-color: #fde68a;
        }

        .bento-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 16px;
          transition: transform 0.2s;
        }

        .bento-card:hover .bento-icon {
          transform: scale(1.1);
        }

        .bento-icon.blue {
          background: #f59e0b;
        }

        .bento-icon.indigo {
          background: #6366f1;
        }

        .bento-icon.emerald {
          background: #10b981;
        }

        .bento-icon.amber-icon {
          background: white;
          color: #d97706;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .bento-card h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 6px;
        }

        .bento-card p {
          font-size: 0.8rem;
          color: #6b7280;
        }

        .progress-bar {
          height: 4px;
          background: #e5e7eb;
          border-radius: 2px;
          margin-top: auto;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #6366f1;
          border-radius: 2px;
        }

        /* Stats Section */
        .stats-section {
          padding: 60px 24px;
          background: #f9fafb;
        }

        .stats-container {
          max-width: 1000px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
        }

        @media (min-width: 768px) {
          .stats-container {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 2.5rem;
          font-weight: 800;
          color: #111827;
          letter-spacing: -0.03em;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #6b7280;
        }

        /* Testimonials */
        .testimonials-section {
          padding: 80px 24px;
        }

        .testimonials-container {
          max-width: 1280px;
          margin: 0 auto;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        @media (min-width: 768px) {
          .testimonials-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .testimonial-card {
          background: white;
          border: 1px solid #f3f4f6;
          border-radius: 20px;
          padding: 28px;
          transition: all 0.2s;
        }

        .testimonial-card:hover {
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
        }

        .testimonial-stars {
          display: flex;
          gap: 4px;
          margin-bottom: 16px;
        }

        .testimonial-text {
          font-size: 0.95rem;
          color: #374151;
          line-height: 1.7;
          margin-bottom: 20px;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .testimonial-author img {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
        }

        .author-name {
          display: block;
          font-weight: 600;
          color: #111827;
          font-size: 0.9rem;
        }

        .author-role {
          display: block;
          font-size: 0.8rem;
          color: #6b7280;
        }

        /* CTA Section */
        .cta-section {
          padding: 80px 24px;
          background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
          text-align: center;
        }

        .cta-container {
          max-width: 600px;
          margin: 0 auto;
        }

        .cta-section h2 {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          margin-bottom: 12px;
        }

        .cta-section p {
          color: #9ca3af;
          margin-bottom: 32px;
        }

        .cta-buttons {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
        }

        .cta-buttons .btn-outline {
          border-color: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .cta-buttons .btn-outline:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
        }

        /* Footer */
        .footer {
          background: #f9fafb;
          border-top: 1px solid #f3f4f6;
          padding: 60px 24px 24px;
        }

        .footer-container {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
        }

        @media (min-width: 768px) {
          .footer-container {
            grid-template-columns: 2fr 3fr;
          }
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .footer-logo .logo-icon {
          width: 28px;
          height: 28px;
          font-size: 0.9rem;
        }

        .footer-logo span {
          font-weight: 700;
          color: #111827;
        }

        .footer-brand p {
          color: #6b7280;
          font-size: 0.9rem;
          max-width: 280px;
        }

        .footer-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .footer-col h4 {
          font-weight: 600;
          color: #111827;
          margin-bottom: 16px;
          font-size: 0.9rem;
        }

        .footer-col a {
          display: block;
          color: #6b7280;
          text-decoration: none;
          font-size: 0.85rem;
          margin-bottom: 10px;
          transition: color 0.2s;
        }

        .footer-col a:hover {
          color: #f59e0b;
        }

        .footer-bottom {
          max-width: 1280px;
          margin: 40px auto 0;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
        }

        .footer-bottom p {
          font-size: 0.85rem;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}
