'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import { Users, Globe, TrendingUp, Shield, Package, DollarSign, FileCheck, Truck } from 'lucide-react';

export default function AboutPage() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setDarkMode(savedTheme === 'dark');
  }, []);

  return (
    <PublicLayout>
      <div className={`about-page ${darkMode ? 'dark' : ''}`}>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-bg"></div>
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1>About Befach International</h1>
            <p>Simplifying global trade for Indian businesses since 2020</p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="section mission-section">
          <div className="container">
            <div className="section-header">
              <h2>Our Mission</h2>
              <p>Empowering businesses to trade globally without boundaries</p>
            </div>
            <div className="mission-content">
              <div className="mission-text">
                <p>
                  We believe every Indian business deserves access to global markets. Our mission is to
                  democratize international trade by making it simple, transparent, and accessible for
                  businesses of all sizes.
                </p>
                <p>
                  By combining cutting-edge technology with deep trade expertise, we're breaking down
                  the barriers that have traditionally kept small and medium businesses from participating
                  in the global economy.
                </p>
              </div>
              <div className="mission-image">
                <img src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=600&q=80" alt="Global Trade" />
              </div>
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="section services-section">
          <div className="container">
            <div className="section-header">
              <h2>What We Do</h2>
              <p>Comprehensive solutions for all your import-export needs</p>
            </div>
            <div className="services-grid">
              <div className="service-card">
                <div className="service-icon">
                  <Globe size={28} />
                </div>
                <h3>Supplier Discovery</h3>
                <p>Connect with verified suppliers from 50+ countries with confidence</p>
              </div>
              <div className="service-card">
                <div className="service-icon">
                  <DollarSign size={28} />
                </div>
                <h3>Cost Transparency</h3>
                <p>Know your exact landed costs before you commit to any order</p>
              </div>
              <div className="service-card">
                <div className="service-icon">
                  <FileCheck size={28} />
                </div>
                <h3>Compliance Support</h3>
                <p>Navigate customs and regulations with expert guidance</p>
              </div>
              <div className="service-card">
                <div className="service-icon">
                  <Truck size={28} />
                </div>
                <h3>End-to-End Tracking</h3>
                <p>Track your shipments in real-time from factory to warehouse</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="section stats-section">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-value">5,000+</span>
                <span className="stat-label">Businesses Served</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">$2.4B</span>
                <span className="stat-label">Trade Facilitated</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">850+</span>
                <span className="stat-label">Verified Suppliers</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">35%</span>
                <span className="stat-label">Avg. Cost Savings</span>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="section why-section">
          <div className="container">
            <div className="section-header">
              <h2>Why Choose Befach?</h2>
              <p>We're not just a platform, we're your trade partner</p>
            </div>
            <div className="why-grid">
              <div className="why-card">
                <Shield size={32} />
                <h3>Trusted & Secure</h3>
                <p>All suppliers are verified and transactions are protected</p>
              </div>
              <div className="why-card">
                <TrendingUp size={32} />
                <h3>Data-Driven Insights</h3>
                <p>Make informed decisions with real-time market analytics</p>
              </div>
              <div className="why-card">
                <Users size={32} />
                <h3>Expert Support</h3>
                <p>Dedicated team to assist you at every step</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section cta-section">
          <div className="container">
            <div className="cta-card">
              <h2>Ready to Start Importing?</h2>
              <p>Join thousands of businesses who trust Befach for their import needs</p>
              <Link href="/onboarding" className="cta-btn">Get Started Free</Link>
            </div>
          </div>
        </section>

        <style jsx>{`
          .about-page {
            background: #ffffff;
          }

          .about-page.dark {
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
            background: url('https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1920&q=80');
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

          .hero-section h1 {
            font-size: 3rem;
            font-weight: 800;
            color: white;
            margin-bottom: 16px;
          }

          .hero-section p {
            font-size: 1.25rem;
            color: rgba(255,255,255,0.9);
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

          .about-page.dark .section-header h2 {
            color: #ffffff;
          }

          .section-header p {
            font-size: 1.125rem;
            color: #78716c;
          }

          .about-page.dark .section-header p {
            color: #a8a29e;
          }

          /* Mission Section */
          .mission-section {
            background: #faf9f7;
          }

          .about-page.dark .mission-section {
            background: #141414;
          }

          .mission-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 48px;
            align-items: center;
          }

          .mission-text p {
            font-size: 1.125rem;
            color: #57534e;
            line-height: 1.8;
            margin-bottom: 20px;
          }

          .about-page.dark .mission-text p {
            color: #a8a29e;
          }

          .mission-image {
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.15);
          }

          .mission-image img {
            width: 100%;
            height: 350px;
            object-fit: cover;
          }

          /* Services Section */
          .services-section {
            background: #ffffff;
          }

          .about-page.dark .services-section {
            background: #0f0f0f;
          }

          .services-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
          }

          .service-card {
            background: #faf9f7;
            padding: 32px 24px;
            border-radius: 16px;
            text-align: center;
            transition: all 0.3s ease;
            border: 1px solid #f0eeeb;
          }

          .about-page.dark .service-card {
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
            margin: 0 auto 20px;
            color: #f59e0b;
          }

          .about-page.dark .service-icon {
            background: linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(217,119,6,0.15) 100%);
          }

          .service-card h3 {
            font-size: 1.125rem;
            font-weight: 700;
            color: #1c1917;
            margin-bottom: 12px;
          }

          .about-page.dark .service-card h3 {
            color: #ffffff;
          }

          .service-card p {
            font-size: 0.9rem;
            color: #78716c;
            line-height: 1.6;
          }

          .about-page.dark .service-card p {
            color: #a8a29e;
          }

          /* Stats Section */
          .stats-section {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          }

          .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 32px;
          }

          .stat-card {
            text-align: center;
            padding: 24px;
          }

          .stat-value {
            display: block;
            font-size: 3rem;
            font-weight: 800;
            color: white;
            margin-bottom: 8px;
          }

          .stat-label {
            font-size: 1rem;
            color: rgba(255,255,255,0.85);
          }

          /* Why Section */
          .why-section {
            background: #faf9f7;
          }

          .about-page.dark .why-section {
            background: #141414;
          }

          .why-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 32px;
          }

          .why-card {
            background: white;
            padding: 40px 32px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.06);
            border: 1px solid #f0eeeb;
            transition: all 0.3s ease;
          }

          .about-page.dark .why-card {
            background: #1a1a1a;
            border-color: #2a2a2a;
          }

          .why-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 40px rgba(0,0,0,0.1);
          }

          .why-card :global(svg) {
            color: #f59e0b;
            margin-bottom: 20px;
          }

          .why-card h3 {
            font-size: 1.25rem;
            font-weight: 700;
            color: #1c1917;
            margin-bottom: 12px;
          }

          .about-page.dark .why-card h3 {
            color: #ffffff;
          }

          .why-card p {
            font-size: 0.95rem;
            color: #78716c;
            line-height: 1.6;
          }

          .about-page.dark .why-card p {
            color: #a8a29e;
          }

          /* CTA Section */
          .cta-section {
            background: #ffffff;
          }

          .about-page.dark .cta-section {
            background: #0f0f0f;
          }

          .cta-card {
            background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%);
            padding: 64px;
            border-radius: 24px;
            text-align: center;
          }

          .about-page.dark .cta-card {
            background: linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(217,119,6,0.1) 100%);
          }

          .cta-card h2 {
            font-size: 2rem;
            font-weight: 700;
            color: #1c1917;
            margin-bottom: 12px;
          }

          .about-page.dark .cta-card h2 {
            color: #ffffff;
          }

          .cta-card p {
            font-size: 1.125rem;
            color: #57534e;
            margin-bottom: 32px;
          }

          .about-page.dark .cta-card p {
            color: #d6d3d1;
          }

          .cta-btn {
            display: inline-block;
            background: #f59e0b;
            color: white;
            padding: 16px 40px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.2s;
            box-shadow: 0 4px 14px rgba(245,158,11,0.4);
          }

          .cta-btn:hover {
            background: #d97706;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(245,158,11,0.5);
          }

          /* Responsive */
          @media (max-width: 1024px) {
            .services-grid {
              grid-template-columns: repeat(2, 1fr);
            }

            .stats-grid {
              grid-template-columns: repeat(2, 1fr);
            }

            .why-grid {
              grid-template-columns: repeat(2, 1fr);
            }

            .mission-content {
              grid-template-columns: 1fr;
            }

            .mission-image {
              order: -1;
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
            .stats-grid,
            .why-grid {
              grid-template-columns: 1fr;
            }

            .stat-value {
              font-size: 2.5rem;
            }

            .cta-card {
              padding: 40px 24px;
            }
          }
        `}</style>
      </div>
    </PublicLayout>
  );
}
