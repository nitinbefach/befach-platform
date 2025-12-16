'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/layout/PublicLayout';
import { Calculator, Search, BarChart3, FileCheck, Truck, Bot, ArrowRight, CheckCircle } from 'lucide-react';

const services = [
  {
    icon: Calculator,
    title: 'Landing Cost Calculator',
    description: 'Calculate exact import costs including duties, taxes, freight, and handling charges before you commit to any order.',
    link: '/cost-calculator',
    linkText: 'Calculate Now',
    features: ['Instant cost breakdown', 'Multiple currency support', 'Duty & tax estimation']
  },
  {
    icon: Search,
    title: 'Supplier Discovery',
    description: 'Access our network of 850+ verified suppliers across 50+ countries. Find the right partner for your products.',
    link: '/smart-sourcing',
    linkText: 'Find Suppliers',
    features: ['Verified suppliers', 'Quality ratings', 'Direct communication']
  },
  {
    icon: BarChart3,
    title: 'Market Intelligence',
    description: 'Real-time trade data, market trends, and insights to help you make informed sourcing decisions.',
    link: '/market-insights',
    linkText: 'View Insights',
    features: ['EX-IM data analysis', 'Trend forecasting', 'Competitor insights']
  },
  {
    icon: FileCheck,
    title: 'Compliance & Documentation',
    description: 'Navigate complex import regulations with our compliance tools. Get document checklists and expert guidance.',
    link: '/compliance-tools',
    linkText: 'Check Compliance',
    features: ['Document checklists', 'Regulation updates', 'Expert guidance']
  },
  {
    icon: Truck,
    title: 'Logistics Management',
    description: 'End-to-end shipment tracking from factory to your warehouse. Real-time updates and delivery estimates.',
    link: '/logistics-tracking',
    linkText: 'Track Shipment',
    features: ['Real-time tracking', 'Carrier comparison', 'Delivery alerts']
  },
  {
    icon: Bot,
    title: 'AI Trade Assistant',
    description: 'Get instant answers to your import questions. Our AI assistant is trained on trade regulations and best practices.',
    link: '/ai-assistant',
    linkText: 'Ask AI',
    features: ['24/7 availability', 'Regulation expertise', 'Best practices']
  },
];

export default function ServicesPage() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setDarkMode(savedTheme === 'dark');
  }, []);

  return (
    <PublicLayout>
      <div className={`services-page ${darkMode ? 'dark' : ''}`}>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-bg"></div>
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <span className="hero-badge">Comprehensive Solutions</span>
            <h1>Our Services</h1>
            <p>Everything you need to import with confidence. From cost calculation to delivery tracking.</p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="section services-section">
          <div className="container">
            <div className="services-grid">
              {services.map((service, idx) => (
                <div key={idx} className="service-card">
                  <div className="service-icon">
                    <service.icon size={28} />
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <ul className="service-features">
                    {service.features.map((feature, fidx) => (
                      <li key={fidx}>
                        <CheckCircle size={16} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href={service.link} className="service-link">
                    {service.linkText}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="section process-section">
          <div className="container">
            <div className="section-header">
              <h2>How It Works</h2>
              <p>Start your import journey in 4 simple steps</p>
            </div>
            <div className="process-grid">
              <div className="process-step">
                <div className="step-number">1</div>
                <h4>Discover Suppliers</h4>
                <p>Search our verified supplier network to find the right products and partners.</p>
              </div>
              <div className="process-step">
                <div className="step-number">2</div>
                <h4>Calculate Costs</h4>
                <p>Use our calculators to get accurate landed costs before placing orders.</p>
              </div>
              <div className="process-step">
                <div className="step-number">3</div>
                <h4>Ensure Compliance</h4>
                <p>Get guidance on documentation and regulatory requirements.</p>
              </div>
              <div className="process-step">
                <div className="step-number">4</div>
                <h4>Track Shipments</h4>
                <p>Monitor your orders from factory to delivery with real-time updates.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section cta-section">
          <div className="container">
            <div className="cta-card">
              <h2>Need a Custom Solution?</h2>
              <p>Talk to our team about your specific import requirements. We're here to help you succeed.</p>
              <div className="cta-buttons">
                <Link href="/contact" className="cta-btn primary">Contact Us</Link>
                <Link href="/onboarding" className="cta-btn secondary">Get Started Free</Link>
              </div>
            </div>
          </div>
        </section>

        <style jsx>{`
          .services-page {
            background: #ffffff;
          }

          .services-page.dark {
            background: #0f0f0f;
          }

          /* Hero Section */
          .hero-section {
            position: relative;
            padding: 120px 24px 100px;
            text-align: center;
            overflow: hidden;
          }

          .hero-bg {
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #92400e 100%);
          }

          .hero-overlay {
            position: absolute;
            inset: 0;
            background: url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80');
            background-size: cover;
            background-position: center;
            opacity: 0.15;
          }

          .hero-content {
            position: relative;
            z-index: 1;
            max-width: 800px;
            margin: 0 auto;
          }

          .hero-badge {
            display: inline-block;
            background: rgba(255,255,255,0.2);
            color: white;
            padding: 8px 20px;
            border-radius: 50px;
            font-size: 0.875rem;
            font-weight: 600;
            margin-bottom: 20px;
          }

          .hero-section h1 {
            font-size: 3rem;
            font-weight: 800;
            color: white;
            margin-bottom: 16px;
          }

          .hero-section p {
            font-size: 1.25rem;
            color: rgba(255,255,255,0.9);
            max-width: 600px;
            margin: 0 auto;
          }

          /* Container */
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
          }

          /* Section */
          .section {
            padding: 80px 0;
          }

          .section-header {
            text-align: center;
            margin-bottom: 48px;
          }

          .section-header h2 {
            font-size: 2.25rem;
            font-weight: 700;
            color: #1c1917;
            margin-bottom: 12px;
          }

          .services-page.dark .section-header h2 {
            color: #ffffff;
          }

          .section-header p {
            font-size: 1.125rem;
            color: #78716c;
          }

          .services-page.dark .section-header p {
            color: #a8a29e;
          }

          /* Services Section */
          .services-section {
            background: #faf9f7;
          }

          .services-page.dark .services-section {
            background: #141414;
          }

          .services-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }

          .service-card {
            background: white;
            padding: 32px;
            border-radius: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.06);
            border: 1px solid #f0eeeb;
            transition: all 0.3s ease;
          }

          .services-page.dark .service-card {
            background: #1a1a1a;
            border-color: #2a2a2a;
          }

          .service-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 12px 40px rgba(0,0,0,0.1);
          }

          .service-icon {
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            color: #f59e0b;
          }

          .services-page.dark .service-icon {
            background: linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(217,119,6,0.15) 100%);
          }

          .service-card h3 {
            font-size: 1.25rem;
            font-weight: 700;
            color: #1c1917;
            margin-bottom: 12px;
          }

          .services-page.dark .service-card h3 {
            color: #ffffff;
          }

          .service-card p {
            font-size: 0.9375rem;
            color: #78716c;
            line-height: 1.7;
            margin-bottom: 16px;
          }

          .services-page.dark .service-card p {
            color: #a8a29e;
          }

          .service-features {
            list-style: none;
            margin-bottom: 20px;
          }

          .service-features li {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.875rem;
            color: #57534e;
            margin-bottom: 8px;
          }

          .services-page.dark .service-features li {
            color: #a8a29e;
          }

          .service-features li :global(svg) {
            color: #16a34a;
            flex-shrink: 0;
          }

          .service-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #f59e0b;
            font-weight: 600;
            font-size: 0.9375rem;
            text-decoration: none;
            transition: gap 0.2s;
          }

          .service-link:hover {
            gap: 12px;
          }

          /* Process Section */
          .process-section {
            background: #ffffff;
          }

          .services-page.dark .process-section {
            background: #0f0f0f;
          }

          .process-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 32px;
          }

          .process-step {
            text-align: center;
            position: relative;
          }

          .process-step::after {
            content: '';
            position: absolute;
            top: 28px;
            right: -16px;
            width: calc(100% - 56px);
            height: 2px;
            background: linear-gradient(90deg, #f59e0b 0%, rgba(245,158,11,0.2) 100%);
          }

          .process-step:last-child::after {
            display: none;
          }

          .step-number {
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 1.5rem;
            font-weight: 700;
            color: white;
            box-shadow: 0 4px 15px rgba(245,158,11,0.3);
          }

          .process-step h4 {
            font-size: 1.125rem;
            font-weight: 700;
            color: #1c1917;
            margin-bottom: 8px;
          }

          .services-page.dark .process-step h4 {
            color: #ffffff;
          }

          .process-step p {
            font-size: 0.9rem;
            color: #78716c;
            line-height: 1.6;
          }

          .services-page.dark .process-step p {
            color: #a8a29e;
          }

          /* CTA Section */
          .cta-section {
            background: #faf9f7;
          }

          .services-page.dark .cta-section {
            background: #141414;
          }

          .cta-card {
            background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%);
            padding: 64px;
            border-radius: 24px;
            text-align: center;
          }

          .services-page.dark .cta-card {
            background: linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(217,119,6,0.1) 100%);
          }

          .cta-card h2 {
            font-size: 2rem;
            font-weight: 700;
            color: #1c1917;
            margin-bottom: 12px;
          }

          .services-page.dark .cta-card h2 {
            color: #ffffff;
          }

          .cta-card p {
            font-size: 1.125rem;
            color: #57534e;
            margin-bottom: 32px;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
          }

          .services-page.dark .cta-card p {
            color: #d6d3d1;
          }

          .cta-buttons {
            display: flex;
            gap: 16px;
            justify-content: center;
          }

          .cta-btn {
            display: inline-block;
            padding: 16px 36px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.2s;
          }

          .cta-btn.primary {
            background: #f59e0b;
            color: white;
            box-shadow: 0 4px 14px rgba(245,158,11,0.4);
          }

          .cta-btn.primary:hover {
            background: #d97706;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(245,158,11,0.5);
          }

          .cta-btn.secondary {
            background: white;
            color: #1c1917;
            border: 2px solid #e5e7eb;
          }

          .services-page.dark .cta-btn.secondary {
            background: rgba(255,255,255,0.1);
            color: white;
            border-color: rgba(255,255,255,0.2);
          }

          .cta-btn.secondary:hover {
            border-color: #f59e0b;
            color: #f59e0b;
          }

          /* Responsive */
          @media (max-width: 1024px) {
            .services-grid {
              grid-template-columns: repeat(2, 1fr);
            }

            .process-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 40px;
            }

            .process-step::after {
              display: none;
            }
          }

          @media (max-width: 768px) {
            .hero-section h1 {
              font-size: 2.25rem;
            }

            .section {
              padding: 60px 0;
            }

            .services-grid,
            .process-grid {
              grid-template-columns: 1fr;
            }

            .cta-card {
              padding: 40px 24px;
            }

            .cta-buttons {
              flex-direction: column;
            }

            .cta-btn {
              text-align: center;
            }
          }
        `}</style>
      </div>
    </PublicLayout>
  );
}
