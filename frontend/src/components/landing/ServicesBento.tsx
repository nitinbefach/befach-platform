'use client';

import {
  Receipt, Ship, TrendingUp, Factory, FileCheck2,
  Sparkles, PackageCheck, Wallet, Users, Check
} from 'lucide-react';

export default function ServicesBento() {
  return (
    <section className="services-section" id="services">
      <div className="services-container">
        <div className="services-header">
          <p className="section-label">Platform</p>
          <h2 className="section-title">Everything you need to trade globally</h2>
          <p className="section-subtitle">One platform. Eight powerful tools. Zero guesswork.</p>
        </div>
        <div className="bento-grid">
          {/* Row 1 */}
          <BentoCard icon={Receipt} iconColor="orange" title="Landed Cost Calculator" span2>
            <p>Instantly calculate total import costs including duties, taxes, freight, and insurance for any product to any country.</p>
            <div className="bento-visual">
              <div className="mini-bars">
                <div className="mini-bar" style={{ height: '60%', background: '#fde68a' }}>
                  <span className="mini-bar-label">Product</span>
                </div>
                <div className="mini-bar" style={{ height: '35%', background: '#f59e0b' }}>
                  <span className="mini-bar-label">Duty</span>
                </div>
                <div className="mini-bar" style={{ height: '20%', background: '#d97706' }}>
                  <span className="mini-bar-label">Tax</span>
                </div>
                <div className="mini-bar" style={{ height: '25%', background: '#b45309' }}>
                  <span className="mini-bar-label">Freight</span>
                </div>
                <div className="mini-bar" style={{ height: '10%', background: '#92400e' }}>
                  <span className="mini-bar-label">Ins.</span>
                </div>
              </div>
            </div>
          </BentoCard>

          <BentoCard icon={Ship} iconColor="blue" title="Shipping & Logistics">
            <p>Compare rates, book shipments, and track cargo across 50+ carriers in real time.</p>
            <div className="bento-visual">
              <div className="carrier-strip">
                <span className="carrier-badge">DHL</span>
                <span className="carrier-badge">FedEx</span>
                <span className="carrier-badge">Maersk</span>
                <span className="carrier-badge">UPS</span>
                <span className="carrier-badge">+46</span>
              </div>
            </div>
          </BentoCard>

          <BentoCard icon={TrendingUp} iconColor="indigo" title="EXIM Intelligence">
            <p>Access real-time trade data, market trends, and competitor insights.</p>
            <div className="bento-visual">
              <svg className="mini-trend" viewBox="0 0 200 50" preserveAspectRatio="none">
                <polyline points="0,40 20,38 50,30 80,32 110,20 140,22 170,10 200,8" style={{ stroke: '#4f46e5', fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }} />
                <polyline points="0,45 20,42 50,40 80,38 110,35 140,30 170,28 200,25" style={{ stroke: '#a5b4fc', fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', strokeDasharray: '4 3' }} />
              </svg>
            </div>
          </BentoCard>

          {/* Row 2 */}
          <BentoCard icon={Factory} iconColor="teal" title="Smart Sourcing">
            <p>Find verified suppliers and manufacturers across the globe with quality guarantees.</p>
            <div className="bento-visual">
              <div className="stat-badge">
                <Users size={16} style={{ color: 'var(--landing-primary-end)' }} />
                850+ verified suppliers
              </div>
            </div>
          </BentoCard>

          <BentoCard icon={FileCheck2} iconColor="green" title="Compliance Tools">
            <p>Stay compliant with automated document checks, restricted party screening, and audit trails.</p>
            <div className="bento-visual">
              <div className="mini-checklist">
                <div className="check-item">
                  <div className="check-dot"><Check size={10} style={{ color: '#16a34a' }} /></div>
                  Import license verified
                </div>
                <div className="check-item">
                  <div className="check-dot"><Check size={10} style={{ color: '#16a34a' }} /></div>
                  HS code validated
                </div>
                <div className="check-item">
                  <div className="check-dot"><Check size={10} style={{ color: '#16a34a' }} /></div>
                  Sanctions screening clear
                </div>
              </div>
            </div>
          </BentoCard>

          <BentoCard icon={Sparkles} iconColor="purple" title="AI Trade Assistant" span2>
            <p>Get instant answers to complex trade questions, document drafting, and regulatory guidance powered by AI.</p>
            <div className="bento-visual">
              <div className="chat-preview">
                <div className="chat-msg user">What&apos;s the import duty on lithium batteries to the EU?</div>
                <div className="chat-msg bot">Lithium-ion batteries (HS 8507.60) have a 2.7% MFN duty rate when imported to the EU. Additional anti-dumping duties may apply for certain origins.</div>
              </div>
            </div>
          </BentoCard>

          {/* Row 3 */}
          <BentoCard icon={PackageCheck} iconColor="red" title="Order Management" span2>
            <p>Track every order from purchase to delivery with milestone notifications, document management, and team collaboration.</p>
          </BentoCard>

          <BentoCard icon={Wallet} iconColor="pink" title="Payments & Invoicing" span2>
            <p>Generate pro-forma invoices, manage multi-currency payments, and automate reconciliation across all your trade transactions.</p>
          </BentoCard>
        </div>
      </div>

      <style jsx>{`
        .services-section {
          padding: 80px 0;
          background: #ffffff;
        }

        .services-container {
          max-width: var(--landing-container);
          margin: 0 auto;
          padding: 0 clamp(16px, 4vw, 48px);
        }

        .services-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .section-label {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--landing-primary-end);
          margin-bottom: 12px;
        }

        .section-title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 16px;
          color: var(--landing-text-heading);
        }

        .section-subtitle {
          font-size: clamp(1rem, 2vw, 1.15rem);
          color: var(--landing-text-body);
          max-width: 600px;
          line-height: 1.7;
          margin: 0 auto;
        }

        .bento-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: auto auto auto;
          gap: 16px;
        }

        @media (max-width: 1024px) {
          .bento-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .bento-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .services-section {
            padding: 48px 0;
          }

          .services-header {
            margin-bottom: 32px;
          }
        }

        @media (max-width: 480px) {
          .services-section {
            padding: 32px 0;
          }

          .section-label {
            font-size: 0.72rem;
            margin-bottom: 8px;
          }

          .section-title {
            font-size: 1.4rem;
            margin-bottom: 10px;
          }

          .section-subtitle {
            font-size: 0.88rem;
          }
        }
      `}</style>
    </section>
  );
}

function BentoCard({ icon: Icon, iconColor, title, span2, children }: {
  icon: any; iconColor: string; title: string; span2?: boolean; children: React.ReactNode;
}) {
  const bgMap: Record<string, string> = {
    orange: '#fef3c7', blue: '#dbeafe', green: '#dcfce7', purple: '#ede9fe',
    red: '#fee2e2', teal: '#ccfbf1', indigo: '#e0e7ff', pink: '#fce7f3',
  };
  const colorMap: Record<string, string> = {
    orange: 'var(--landing-primary-end)', blue: '#2563eb', green: '#16a34a', purple: '#7c3aed',
    red: '#dc2626', teal: '#0d9488', indigo: '#4f46e5', pink: '#db2777',
  };

  return (
    <>
      <div className={`bento-card ${span2 ? 'span-2' : ''}`}>
        <div className="bento-icon" style={{ background: bgMap[iconColor] }}>
          <Icon size={18} style={{ color: colorMap[iconColor] }} />
        </div>
        <h3>{title}</h3>
        {children}
      </div>
      <style jsx>{`
        .bento-card {
          background: #ffffff;
          border: 1px solid var(--landing-border);
          border-radius: 12px;
          padding: 24px;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
        }

        .bento-card:hover {
          border-color: var(--landing-primary-start);
        }

        .bento-card.span-2 {
          grid-column: span 2;
        }

        .bento-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
          flex-shrink: 0;
        }

        .bento-card h3 {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 6px;
          color: var(--landing-text-heading);
        }

        .bento-card :global(p) {
          font-size: 0.82rem;
          color: var(--landing-text-body);
          line-height: 1.5;
          margin-bottom: 14px;
        }

        .bento-card :global(.bento-visual) {
          margin-top: auto;
          flex-shrink: 0;
        }

        @media (max-width: 1024px) {
          .bento-card.span-2 {
            grid-column: span 2;
          }
        }

        @media (max-width: 768px) {
          .bento-card.span-2 {
            grid-column: span 1;
          }
        }

        @media (max-width: 480px) {
          .bento-card {
            padding: 18px;
          }

          .bento-card h3 {
            font-size: 0.9rem;
          }

          .bento-card :global(p) {
            font-size: 0.78rem;
          }
        }
      `}</style>

      <style jsx global>{`
        .mini-bars {
          display: flex;
          align-items: flex-end;
          gap: 6px;
          height: 70px;
          padding-top: 10px;
        }

        .mini-bar {
          flex: 1;
          border-radius: 4px 4px 0 0;
          position: relative;
        }

        .mini-bar-label {
          position: absolute;
          bottom: -16px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.55rem;
          color: var(--landing-text-muted);
          white-space: nowrap;
        }

        .carrier-strip {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .carrier-badge {
          padding: 4px 10px;
          background: var(--landing-light-bg);
          border-radius: 4px;
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--landing-text-muted);
          letter-spacing: 0.03em;
        }

        .mini-trend {
          width: 100%;
          height: 50px;
        }

        .stat-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: var(--landing-light-bg);
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--landing-text-heading);
        }

        .mini-checklist {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .check-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          color: var(--landing-text-body);
        }

        .check-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #dcfce7;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .chat-preview {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .chat-msg {
          padding: 8px 12px;
          border-radius: 10px;
          font-size: 0.75rem;
          max-width: 85%;
          line-height: 1.4;
        }

        .chat-msg.user {
          background: var(--landing-primary-end);
          color: #ffffff;
          align-self: flex-end;
          border-radius: 10px 10px 4px 10px;
        }

        .chat-msg.bot {
          background: var(--landing-light-bg);
          color: var(--landing-text-heading);
          align-self: flex-start;
          border-radius: 10px 10px 10px 4px;
        }

        @media (max-width: 480px) {
          .mini-bar-label {
            display: none;
          }

          .mini-bars {
            height: 50px;
          }

          .stat-badge {
            font-size: 0.75rem;
            padding: 6px 10px;
          }

          .chat-msg {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </>
  );
}
