'use client';

/**
 * MockDashboard — Pure CSS/JSX mini-dashboard visual
 *
 * Renders a different mock visual based on `mockType`:
 * - cost: duty/freight/tax breakdown bars
 * - tracking: horizontal milestone timeline
 * - compliance: checklist with check/warning states
 * - workflow: 3-step pipeline flow
 *
 * To customize visuals, edit the render functions below.
 */

interface MockDashboardProps {
  mockType: 'cost' | 'tracking' | 'compliance' | 'workflow';
  accentColor: string;
  dark?: boolean;
}

export default function MockDashboard({ mockType, accentColor, dark = false }: MockDashboardProps) {
  const textColor = dark ? '#e5e7eb' : '#374151';
  const mutedColor = dark ? '#9ca3af' : '#6b7280';
  const bgColor = dark ? '#1f2937' : '#f9fafb';
  const cardBg = dark ? '#111827' : '#ffffff';
  const borderColor = dark ? '#374151' : '#e5e7eb';

  return (
    <div className="mock-dashboard">
      {/* Browser chrome */}
      <div className="mock-chrome">
        <div className="mock-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <div className="mock-url-bar">
          <span>app.befach.com</span>
        </div>
      </div>

      {/* Content area */}
      <div className="mock-content">
        {mockType === 'cost' && <CostMock accent={accentColor} textColor={textColor} mutedColor={mutedColor} />}
        {mockType === 'tracking' && <TrackingMock accent={accentColor} textColor={textColor} mutedColor={mutedColor} />}
        {mockType === 'compliance' && <ComplianceMock accent={accentColor} textColor={textColor} mutedColor={mutedColor} />}
        {mockType === 'workflow' && <WorkflowMock accent={accentColor} textColor={textColor} mutedColor={mutedColor} />}
      </div>

      <style jsx>{`
        .mock-dashboard {
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid ${borderColor};
          background: ${cardBg};
          box-shadow: 0 4px 24px rgba(0, 0, 0, ${dark ? '0.3' : '0.06'});
        }
        .mock-chrome {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          background: ${bgColor};
          border-bottom: 1px solid ${borderColor};
        }
        .mock-dots {
          display: flex;
          gap: 6px;
        }
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .dot-red { background: #ef4444; }
        .dot-yellow { background: #f59e0b; }
        .dot-green { background: #22c55e; }
        .mock-url-bar {
          flex: 1;
          background: ${cardBg};
          border-radius: 6px;
          padding: 4px 12px;
          font-size: 0.7rem;
          color: ${mutedColor};
          border: 1px solid ${borderColor};
        }
        .mock-content {
          padding: 20px;
          min-height: 200px;
        }
      `}</style>
    </div>
  );
}

/* ---- Mock sub-components ---- */

function CostMock({ accent, textColor, mutedColor }: { accent: string; textColor: string; mutedColor: string }) {
  const items = [
    { label: 'Product Cost', value: '₹4,20,000', pct: 62 },
    { label: 'Customs Duty', value: '₹1,05,000', pct: 16 },
    { label: 'Freight & Insurance', value: '₹89,000', pct: 13 },
    { label: 'IGST', value: '₹62,000', pct: 9 },
  ];

  return (
    <div>
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: textColor, marginBottom: 4 }}>
        Landed Cost Breakdown
      </div>
      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: accent, marginBottom: 16 }}>
        ₹6,76,000
      </div>
      {items.map((item) => (
        <div key={item.label} style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', marginBottom: 3 }}>
            <span style={{ color: mutedColor }}>{item.label}</span>
            <span style={{ color: textColor, fontWeight: 600 }}>{item.value}</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: `${accent}15`, overflow: 'hidden' }}>
            <div style={{ width: `${item.pct}%`, height: '100%', borderRadius: 3, background: accent, transition: 'width 0.6s ease' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function TrackingMock({ accent, textColor, mutedColor }: { accent: string; textColor: string; mutedColor: string }) {
  const milestones = [
    { label: 'Booked', status: 'done' },
    { label: 'In Transit', status: 'done' },
    { label: 'Customs', status: 'active' },
    { label: 'Delivered', status: 'pending' },
  ];

  return (
    <div>
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: textColor, marginBottom: 4 }}>
        Shipment #BF-2024-0847
      </div>
      <div style={{ fontSize: '0.68rem', color: mutedColor, marginBottom: 20 }}>
        Shanghai → Mumbai · ETA: Mar 15
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, position: 'relative' }}>
        {milestones.map((m, i) => (
          <div key={m.label} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
            {/* Connector line */}
            {i < milestones.length - 1 && (
              <div style={{
                position: 'absolute', top: 8, left: '50%', right: '-50%', height: 2,
                background: m.status === 'done' ? accent : `${accent}30`,
                zIndex: 0,
              }} />
            )}
            {/* Dot */}
            <div style={{
              width: 18, height: 18, borderRadius: '50%', margin: '0 auto 8px',
              position: 'relative', zIndex: 1,
              background: m.status === 'pending' ? `${accent}20` : accent,
              border: m.status === 'active' ? `3px solid ${accent}40` : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {m.status === 'done' && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <div style={{ fontSize: '0.62rem', color: m.status === 'active' ? accent : mutedColor, fontWeight: m.status === 'active' ? 700 : 500 }}>
              {m.label}
            </div>
          </div>
        ))}
      </div>
      {/* Status card */}
      <div style={{
        marginTop: 20, padding: '10px 14px', borderRadius: 10,
        background: `${accent}10`, border: `1px solid ${accent}25`,
        fontSize: '0.68rem', color: textColor,
      }}>
        <span style={{ fontWeight: 700, color: accent }}>In Customs</span> — Awaiting clearance at Mumbai port. Est. 2 days.
      </div>
    </div>
  );
}

function ComplianceMock({ accent, textColor, mutedColor }: { accent: string; textColor: string; mutedColor: string }) {
  const checks = [
    { label: 'HS Code Classification', status: 'pass' },
    { label: 'Restricted Party Screening', status: 'pass' },
    { label: 'Certificate of Origin', status: 'warning' },
    { label: 'Import License Validity', status: 'pass' },
    { label: 'Customs Declaration', status: 'pass' },
  ];

  return (
    <div>
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: textColor, marginBottom: 4 }}>
        Compliance Check
      </div>
      <div style={{ fontSize: '0.68rem', color: mutedColor, marginBottom: 16 }}>
        Pre-shipment verification · 4/5 passed
      </div>
      {checks.map((c) => (
        <div key={c.label} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 0', borderBottom: `1px solid ${accent}10`,
        }}>
          <div style={{
            width: 20, height: 20, borderRadius: 6, flexShrink: 0,
            background: c.status === 'pass' ? '#22c55e18' : '#f59e0b18',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {c.status === 'pass' ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 6L5 8L9 4" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 4V6.5M6 8.5H6.005" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </div>
          <span style={{ fontSize: '0.68rem', color: textColor, flex: 1 }}>{c.label}</span>
          <span style={{
            fontSize: '0.6rem', fontWeight: 600, padding: '2px 8px', borderRadius: 20,
            background: c.status === 'pass' ? '#22c55e15' : '#f59e0b15',
            color: c.status === 'pass' ? '#22c55e' : '#f59e0b',
          }}>
            {c.status === 'pass' ? 'Passed' : 'Review'}
          </span>
        </div>
      ))}
    </div>
  );
}

function WorkflowMock({ accent, textColor, mutedColor }: { accent: string; textColor: string; mutedColor: string }) {
  const steps = [
    { label: 'Order Confirmed', sub: 'PO #2024-0312', done: true },
    { label: 'Quality Check', sub: 'Inspection pending', done: false },
    { label: 'Ship & Deliver', sub: 'Awaiting dispatch', done: false },
  ];

  return (
    <div>
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: textColor, marginBottom: 4 }}>
        Workflow Pipeline
      </div>
      <div style={{ fontSize: '0.68rem', color: mutedColor, marginBottom: 16 }}>
        Standardized process · 3 stages
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
        {steps.map((s, i) => (
          <div key={s.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
            <div style={{
              width: '100%', padding: '14px 10px', borderRadius: 12, textAlign: 'center',
              background: s.done ? `${accent}12` : `${accent}06`,
              border: `1.5px solid ${s.done ? accent : `${accent}25`}`,
              position: 'relative',
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', margin: '0 auto 8px',
                background: s.done ? accent : `${accent}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.6rem', fontWeight: 700, color: s.done ? '#fff' : accent,
              }}>
                {s.done ? '✓' : i + 1}
              </div>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: textColor, marginBottom: 2 }}>
                {s.label}
              </div>
              <div style={{ fontSize: '0.58rem', color: mutedColor }}>{s.sub}</div>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                position: 'absolute', right: -4, top: '50%', transform: 'translateY(-50%)',
                color: accent, fontSize: '0.8rem', fontWeight: 700,
              }}>
                →
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Role badges */}
      <div style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
        {['Admin', 'Ops Manager', 'Compliance'].map((role) => (
          <span key={role} style={{
            fontSize: '0.58rem', padding: '3px 10px', borderRadius: 20,
            background: `${accent}10`, color: accent, fontWeight: 600,
          }}>
            {role}
          </span>
        ))}
      </div>
    </div>
  );
}
