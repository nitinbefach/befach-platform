'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calculator, Truck, Search, Bot } from 'lucide-react';

export default function InteractiveDemo() {
  return (
    <section className="demo-section" id="demo">
      <div className="demo-container">
        <div className="demo-header">
          <p className="section-label">Check it out</p>
          <h2 className="section-title">Watch trade get simple</h2>
          <p className="section-subtitle">Try our core tools — sign up free to unlock full access and see how Befach simplifies your trade operations.</p>
        </div>
        <div className="demo-grid">
          <CostCalculatorCard />
          <RateCheckerCard />
          <HSCodeCard />
          <AIAssistantCard />
        </div>
      </div>

      <style jsx>{`
        .demo-section {
          padding: 80px 0;
          background: var(--landing-light-bg);
        }

        .demo-container {
          max-width: var(--landing-container);
          margin: 0 auto;
          padding: 0 clamp(16px, 4vw, 48px);
        }

        .demo-header {
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

        .demo-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          align-items: stretch;
        }

        @media (max-width: 1024px) {
          .demo-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .demo-grid {
            grid-template-columns: 1fr;
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            gap: 16px;
            padding-bottom: 16px;
            -webkit-overflow-scrolling: touch;
          }

          .demo-section {
            padding: 48px 0;
          }
        }

        @media (max-width: 480px) {
          .demo-section {
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

// ===== Card 1: Cost Calculator =====
function CostCalculatorCard() {
  const router = useRouter();
  const [origin, setOrigin] = useState('');
  const [dest, setDest] = useState('');
  const [value, setValue] = useState('');

  const handleClick = () => {
    router.push('/onboarding?redirect=/cost-calculator');
  };

  return (
    <DemoCard icon={Calculator} iconColor="orange" title="Cost Calculator">
      <div className="demo-form">
        <div className="demo-row">
          <select value={origin} onChange={e => setOrigin(e.target.value)}>
            <option value="">Origin</option>
            <option value="CN">China</option>
            <option value="IN">India</option>
            <option value="VN">Vietnam</option>
            <option value="DE">Germany</option>
          </select>
          <select value={dest} onChange={e => setDest(e.target.value)}>
            <option value="">Destination</option>
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="AE">UAE</option>
            <option value="AU">Australia</option>
          </select>
        </div>
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Product value (USD)"
          inputMode="numeric"
        />
        <button className="demo-btn" onClick={handleClick}>Calculate Landed Cost</button>
      </div>
    </DemoCard>
  );
}

// ===== Card 2: Rate Checker =====
function RateCheckerCard() {
  const router = useRouter();
  const [weight, setWeight] = useState('');
  const [mode, setMode] = useState('express');

  const handleClick = () => {
    router.push('/onboarding?redirect=/shipping-calculator');
  };

  return (
    <DemoCard icon={Truck} iconColor="blue" title="Rate Checker">
      <div className="demo-form">
        <input
          type="text"
          value={weight}
          onChange={e => setWeight(e.target.value)}
          placeholder="Weight (kg)"
          inputMode="numeric"
        />
        <div className="mode-selector">
          {['express', 'standard', 'economy'].map(m => (
            <button
              key={m}
              className={`mode-option ${mode === m ? 'active' : ''}`}
              onClick={() => setMode(m)}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
        <button className="demo-btn" onClick={handleClick}>Compare Rates</button>
      </div>
    </DemoCard>
  );
}

// ===== Card 3: HS Code Lookup =====
function HSCodeCard() {
  const router = useRouter();
  const [input, setInput] = useState('');

  const handleClick = () => {
    router.push('/onboarding?redirect=/compliance-tools');
  };

  return (
    <DemoCard icon={Search} iconColor="green" title="HS Code Lookup">
      <div className="demo-form">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Describe your product..."
        />
        <button className="demo-btn" onClick={handleClick}>Classify Product</button>
      </div>
    </DemoCard>
  );
}

// ===== Card 4: AI Assistant =====
function AIAssistantCard() {
  const router = useRouter();
  const [input, setInput] = useState('');

  const handleClick = () => {
    router.push('/onboarding?redirect=/ai-assistant');
  };

  return (
    <DemoCard icon={Bot} iconColor="purple" title="AI Assistant">
      <div className="demo-form">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask anything about trade..."
        />
        <button className="demo-btn" onClick={handleClick}>Ask Befach AI</button>
      </div>
    </DemoCard>
  );
}

// ===== Shared Demo Card wrapper =====
function DemoCard({ icon: Icon, iconColor, title, children }: {
  icon: any; iconColor: string; title: string; children: React.ReactNode;
}) {
  const bgMap: Record<string, string> = {
    orange: '#fef3c7',
    blue: '#dbeafe',
    green: '#dcfce7',
    purple: '#ede9fe',
  };
  const colorMap: Record<string, string> = {
    orange: 'var(--landing-primary-end)',
    blue: '#2563eb',
    green: '#16a34a',
    purple: '#7c3aed',
  };

  return (
    <>
      <div className="demo-card">
        <div className="demo-card-icon" style={{ background: bgMap[iconColor] }}>
          <Icon size={20} style={{ color: colorMap[iconColor] }} />
        </div>
        <h3>{title}</h3>
        {children}
      </div>
      <style jsx>{`
        .demo-card {
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid var(--landing-border);
          padding: 24px;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
        }

        .demo-card:hover {
          border-color: var(--landing-primary-start);
        }

        .demo-card-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }

        .demo-card h3 {
          font-size: 0.95rem;
          font-weight: 700;
          margin-bottom: 14px;
          color: var(--landing-text-heading);
        }

        @media (max-width: 768px) {
          .demo-card {
            min-width: 300px;
            scroll-snap-align: center;
            flex-shrink: 0;
          }
        }

        @media (max-width: 480px) {
          .demo-card {
            min-width: 270px;
          }

          .demo-card h3 {
            font-size: 0.88rem;
          }
        }
      `}</style>

      <style jsx global>{`
        .demo-form {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .demo-form select,
        .demo-form input {
          width: 100%;
          padding: 9px 12px;
          border: 1px solid var(--landing-border);
          border-radius: 6px;
          font-size: 0.82rem;
          color: var(--landing-text-heading);
          background: #ffffff;
          outline: none;
          transition: border-color 0.2s;
          font-family: inherit;
        }

        .demo-form select:focus,
        .demo-form input:focus {
          border-color: var(--landing-primary-start);
        }

        .demo-form .demo-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .demo-btn {
          padding: 10px 16px;
          background: var(--landing-primary-end);
          color: #ffffff;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.82rem;
          transition: all 0.25s;
          margin-top: auto;
          border: none;
          cursor: pointer;
          font-family: inherit;
        }

        .demo-btn:hover {
          background: linear-gradient(135deg, #d97706, #b45309);
        }

        .mode-selector {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
          background: var(--landing-light-bg);
          padding: 3px;
          border-radius: 6px;
        }

        .mode-option {
          padding: 6px 8px;
          text-align: center;
          font-size: 0.72rem;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          color: var(--landing-text-muted);
          border: none;
          background: none;
          font-family: inherit;
        }

        .mode-option.active {
          background: #ffffff;
          color: var(--landing-text-heading);
        }

        .mode-option:hover {
          color: var(--landing-text-heading);
        }

        @media (max-width: 480px) {
          .demo-form .demo-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
