'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Logo } from '@/components/ui';
import { useOnboarding, goalOptions, typeOptions } from './useOnboarding';

const slideVariants = {
  enter: { x: 40, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -40, opacity: 0 },
};

export default function Onboarding() {
  const {
    step,
    companyName,
    companyType,
    selectedGoals,
    setCompanyName,
    setCompanyType,
    handleProfileSubmit,
    handleGoalToggle,
    handleGoalsSubmit,
    handleGoBack,
    canSubmitProfile,
  } = useOnboarding();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === 'profile') inputRef.current?.focus();
  }, [step]);

  return (
    <div className="onboarding">
      {/* Brand Panel — desktop only */}
      <aside className="brand-panel">
        <div className="brand-overlay" />
        <div className="brand-content">
          <Logo size="large" linkTo="" />
          <p className="brand-tagline">Your trade intelligence platform</p>
        </div>
      </aside>

      {/* Form Area */}
      <main className="form-area">
        {/* Mobile header */}
        <header className="mobile-header">
          <Logo size="small" linkTo="" />
        </header>

        {/* Progress Dots */}
        <div className="progress-dots">
          <span className={`dot ${step === 'profile' ? 'active' : 'completed'}`} />
          <span className={`dot ${step === 'goals' ? 'active' : ''}`} />
        </div>

        {/* Form Content */}
        <div className="form-content">
          <AnimatePresence mode="wait">
            {step === 'profile' && (
              <motion.div
                key="profile"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="step"
              >
                <h1>Welcome to Befach</h1>
                <p className="subtitle">Tell us about your business to get started</p>

                <div className="field">
                  <label htmlFor="company-name">Business name</label>
                  <input
                    ref={inputRef}
                    id="company-name"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Trading Co."
                    onKeyDown={(e) => e.key === 'Enter' && canSubmitProfile && handleProfileSubmit()}
                  />
                </div>

                <div className="field">
                  <label>Business type</label>
                  <div className="type-cards">
                    {(['individual', 'company'] as const).map(type => {
                      const opt = typeOptions[type];
                      const Icon = opt.icon;
                      return (
                        <button
                          key={type}
                          type="button"
                          className={`type-card ${companyType === type ? 'selected' : ''}`}
                          onClick={() => setCompanyType(type)}
                        >
                          <div className="type-icon">
                            <Icon size={20} />
                          </div>
                          <div className="type-info">
                            <strong>{opt.label}</strong>
                            <span>{opt.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  className="btn-primary"
                  onClick={handleProfileSubmit}
                  disabled={!canSubmitProfile}
                >
                  Continue
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            )}

            {step === 'goals' && (
              <motion.div
                key="goals"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="step"
              >
                <h1>What brings you here?</h1>
                <p className="subtitle">Select all that apply — we&apos;ll personalize your dashboard</p>

                <div className="goals-grid">
                  {goalOptions.map((goal, i) => {
                    const Icon = goal.icon;
                    const isSelected = selectedGoals.includes(goal.id);
                    return (
                      <button
                        key={goal.id}
                        type="button"
                        className={`goal-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleGoalToggle(goal.id)}
                        style={{ animationDelay: `${i * 0.05}s` }}
                      >
                        <div className="goal-icon">
                          <Icon size={20} />
                        </div>
                        <span className="goal-label">{goal.label}</span>
                        <span className="goal-check">
                          {isSelected && (
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="step-actions">
                  <button className="btn-back" onClick={handleGoBack}>Back</button>
                  <button className="btn-primary" onClick={handleGoalsSubmit}>
                    Get started
                    <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <style jsx>{`
        .onboarding {
          display: flex;
          min-height: 100vh;
          min-height: 100dvh;
          background: #ffffff;
        }

        /* ── Brand Panel (desktop) ── */
        .brand-panel {
          display: none;
        }

        /* ── Form Area ── */
        .form-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          min-height: 100dvh;
        }

        /* Mobile header */
        .mobile-header {
          padding: 16px 20px;
          border-bottom: 1px solid #f1f5f9;
        }

        /* Progress */
        .progress-dots {
          display: flex;
          gap: 8px;
          justify-content: center;
          padding: 24px 20px 0;
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #e2e8f0;
          transition: all 0.3s ease;
        }
        .dot.active {
          width: 24px;
          border-radius: 4px;
          background: #f97316;
        }
        .dot.completed {
          background: #10b981;
        }

        /* Form content */
        .form-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 20px;
          padding-bottom: calc(32px + env(safe-area-inset-bottom, 0px));
        }

        /* Step */
        h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 8px;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        .subtitle {
          color: #64748b;
          font-size: 0.95rem;
          margin: 0 0 36px;
          line-height: 1.5;
        }

        /* Fields */
        .field {
          margin-bottom: 28px;
        }
        .field label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: #475569;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .field input[type="text"] {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 1rem;
          color: #0f172a;
          background: #ffffff;
          transition: all 0.2s;
          -webkit-appearance: none;
        }
        .field input::placeholder {
          color: #94a3b8;
        }
        .field input:focus {
          outline: none;
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.08);
        }

        /* Type Cards */
        .type-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .type-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-left: 3px solid transparent;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.15s;
          text-align: left;
          width: 100%;
          -webkit-tap-highlight-color: transparent;
        }
        .type-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
        }
        .type-card.selected {
          border-color: #fed7aa;
          border-left-color: #f97316;
          background: rgba(249, 115, 22, 0.03);
        }
        .type-card:active {
          transform: scale(0.98);
        }
        .type-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #64748b;
          transition: all 0.15s;
        }
        .type-card.selected .type-icon {
          background: #fff7ed;
          color: #f97316;
        }
        .type-info {
          min-width: 0;
        }
        .type-info strong {
          display: block;
          font-size: 0.9rem;
          color: #0f172a;
          font-weight: 600;
        }
        .type-info span {
          display: block;
          font-size: 0.78rem;
          color: #94a3b8;
          margin-top: 2px;
          line-height: 1.3;
        }

        /* Goals Grid */
        .goals-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
          margin-bottom: 32px;
        }
        .goal-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-left: 3px solid transparent;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.15s;
          text-align: left;
          width: 100%;
          -webkit-tap-highlight-color: transparent;
          animation: goalSlideIn 0.3s ease both;
        }
        @keyframes goalSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .goal-card:hover {
          border-color: #cbd5e1;
        }
        .goal-card.selected {
          border-color: #fed7aa;
          border-left-color: #f97316;
          background: rgba(249, 115, 22, 0.03);
        }
        .goal-card:active {
          transform: scale(0.98);
        }
        .goal-icon {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #64748b;
          transition: all 0.15s;
        }
        .goal-card.selected .goal-icon {
          background: #fff7ed;
          color: #f97316;
        }
        .goal-label {
          flex: 1;
          font-size: 0.9rem;
          color: #0f172a;
          line-height: 1.3;
        }
        .goal-check {
          width: 22px;
          height: 22px;
          border: 1.5px solid #e2e8f0;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: transparent;
          transition: all 0.15s;
        }
        .goal-card.selected .goal-check {
          background: #f97316;
          border-color: #f97316;
          color: white;
        }

        /* Buttons */
        .btn-primary {
          width: 100%;
          padding: 14px 24px;
          background: #f97316;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          -webkit-tap-highlight-color: transparent;
        }
        .btn-primary:hover:not(:disabled) {
          background: #ea580c;
          box-shadow: 0 2px 8px rgba(249, 115, 22, 0.2);
        }
        .btn-primary:active:not(:disabled) {
          transform: scale(0.98);
        }
        .btn-primary:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .step-actions {
          display: flex;
          gap: 12px;
        }
        .btn-back {
          padding: 14px 20px;
          background: #f8fafc;
          color: #475569;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
          -webkit-tap-highlight-color: transparent;
        }
        .btn-back:hover {
          background: #f1f5f9;
        }
        .btn-back:active {
          transform: scale(0.98);
        }
        .step-actions .btn-primary {
          flex: 1;
        }

        /* ── Desktop (>768px) ── */
        @media (min-width: 769px) {
          .brand-panel {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: fixed;
            left: 0;
            top: 0;
            width: 40%;
            height: 100vh;
            background: #0f172a;
            background-image: url('https://images.unsplash.com/photo-1494412574643-ff11b0a5eb19?w=800&q=80');
            background-size: cover;
            background-position: center;
            overflow: hidden;
          }
          .brand-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.75) 100%);
          }
          .brand-content {
            position: relative;
            z-index: 1;
            text-align: center;
          }
          .brand-tagline {
            color: #94a3b8;
            font-size: 1.05rem;
            margin-top: 16px;
            font-weight: 400;
            letter-spacing: 0.01em;
          }

          .form-area {
            margin-left: 40%;
          }
          .mobile-header {
            display: none;
          }
          .progress-dots {
            padding: 40px 40px 0;
            justify-content: flex-start;
          }
          .form-content {
            padding: 40px;
            max-width: 540px;
          }
          h1 {
            font-size: 2rem;
          }
          .goals-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        /* ── Compact mobile ── */
        @media (max-width: 480px) {
          h1 { font-size: 1.5rem; }
          .subtitle { font-size: 0.88rem; }
          .type-cards { grid-template-columns: 1fr; }
          .form-content { padding: 24px 16px; }
        }
      `}</style>
    </div>
  );
}
