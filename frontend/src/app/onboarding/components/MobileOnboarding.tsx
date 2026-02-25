'use client';

import { Logo } from '@/components/ui';
import { useOnboarding, goalOptions, typeOptions } from './useOnboarding';

export default function MobileOnboarding() {
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

  const stepIndex = step === 'profile' ? 0 : 1;
  const stepLabels = ['Profile', 'Goals'];

  return (
    <div className="m-onboarding">
      <header className="m-header">
        <Logo size="small" />
      </header>

      {/* Progress */}
      <div className="m-progress">
        <div className="m-progress-text">
          <span className="m-progress-label">{stepLabels[stepIndex]}</span>
          <span className="m-progress-count">{stepIndex + 1}/3</span>
        </div>
        <div className="m-progress-track">
          <div
            className="m-progress-fill"
            style={{ width: `${((stepIndex + 1) / 3) * 100}%` }}
          />
        </div>
      </div>

      <div className="m-body">

        {/* STEP 1: PROFILE */}
        {step === 'profile' && (
          <div className="m-step">
            <div className="m-step-header">
              <h1>Welcome to Befach</h1>
              <p>Set up your account</p>
            </div>

            <div className="m-form">
              <div className="m-field">
                <label htmlFor="company-name">Business Name</label>
                <input
                  id="company-name"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Trading Co."
                  enterKeyHint="next"
                />
              </div>

              <div className="m-field">
                <label>Business Type</label>
                <div className="m-type-stack">
                  {(['individual', 'company'] as const).map(type => {
                    const opt = typeOptions[type];
                    const Icon = opt.icon;
                    return (
                      <button
                        key={type}
                        type="button"
                        className={`m-type-card ${companyType === type ? 'selected' : ''}`}
                        onClick={() => setCompanyType(type)}
                      >
                        <div className="m-type-icon-wrap">
                          <Icon size={20} />
                        </div>
                        <div className="m-type-text">
                          <strong>{opt.label}</strong>
                          <span>{opt.desc}</span>
                        </div>
                        <div className="m-type-radio">
                          <div className="m-type-radio-dot" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="m-footer">
              <button
                className="m-btn-primary"
                onClick={handleProfileSubmit}
                disabled={!canSubmitProfile}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: GOALS */}
        {step === 'goals' && (
          <div className="m-step">
            <div className="m-step-header">
              <h1>Your goals</h1>
              <p>Select what matters to you</p>
            </div>

            <div className="m-goals">
              {goalOptions.map(goal => {
                const isSelected = selectedGoals.includes(goal.id);
                const Icon = goal.icon;
                return (
                  <button
                    key={goal.id}
                    type="button"
                    className={`m-goal-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleGoalToggle(goal.id)}
                  >
                    <div className="m-goal-icon-wrap">
                      <Icon size={18} />
                    </div>
                    <span className="m-goal-label">{goal.label}</span>
                    <span className="m-goal-check">
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

            <div className="m-footer m-footer-split">
              <button className="m-btn-back" onClick={handleGoBack}>
                Back
              </button>
              <button className="m-btn-primary" onClick={handleGoalsSubmit}>
                Continue
              </button>
            </div>
          </div>
        )}

      </div>

      <style jsx>{`
        .m-onboarding {
          min-height: 100vh;
          min-height: 100dvh;
          background: var(--bg-primary);
          display: flex;
          flex-direction: column;
          -webkit-font-smoothing: antialiased;
        }

        .m-header {
          display: flex;
          align-items: center;
          padding: 14px 20px;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
        }

        /* Progress */
        .m-progress {
          padding: 16px 20px 12px;
          background: var(--bg-secondary);
        }
        .m-progress-text {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 8px;
        }
        .m-progress-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-primary);
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }
        .m-progress-count {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-variant-numeric: tabular-nums;
        }
        .m-progress-track {
          height: 3px;
          background: var(--border-color);
          border-radius: 2px;
          overflow: hidden;
        }
        .m-progress-fill {
          height: 100%;
          background: var(--accent-primary);
          border-radius: 2px;
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Body */
        .m-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        .m-step {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 24px 20px;
          padding-bottom: calc(24px + env(safe-area-inset-bottom, 0px));
        }
        .m-step-center {
          align-items: center;
          text-align: center;
        }

        /* Step Header */
        .m-step-header {
          margin-bottom: 28px;
        }
        .m-step-header h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 6px;
          line-height: 1.2;
        }
        .m-step-header p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.4;
        }

        /* Form */
        .m-form { flex: 1; }
        .m-field { margin-bottom: 24px; }
        .m-field label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .m-field input[type="text"] {
          width: 100%;
          padding: 14px 16px;
          border: 1.5px solid var(--border-color);
          border-radius: 10px;
          font-size: 1rem;
          background: var(--card-bg);
          color: var(--text-primary);
          transition: border-color 0.2s;
          -webkit-appearance: none;
        }
        .m-field input[type="text"]:focus {
          outline: none;
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }
        .m-field input::placeholder {
          color: var(--text-muted);
        }

        /* Type Selector */
        .m-type-stack {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .m-type-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px;
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.15s;
          text-align: left;
          width: 100%;
          min-height: 56px;
          -webkit-tap-highlight-color: transparent;
        }
        .m-type-card:active { transform: scale(0.98); }
        .m-type-card.selected {
          border-color: var(--accent-primary);
          background: rgba(249, 115, 22, 0.04);
        }
        .m-type-icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: var(--bg-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--text-secondary);
          transition: all 0.15s;
        }
        .m-type-card.selected .m-type-icon-wrap {
          background: rgba(249, 115, 22, 0.1);
          color: var(--accent-primary);
        }
        .m-type-text { flex: 1; min-width: 0; }
        .m-type-text strong {
          display: block;
          font-size: 0.95rem;
          color: var(--text-primary);
          font-weight: 600;
        }
        .m-type-text span {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.3;
        }
        .m-type-radio {
          width: 20px;
          height: 20px;
          border: 2px solid var(--border-color);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.15s;
        }
        .m-type-card.selected .m-type-radio {
          border-color: var(--accent-primary);
        }
        .m-type-radio-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: transparent;
          transition: background 0.15s;
        }
        .m-type-card.selected .m-type-radio-dot {
          background: var(--accent-primary);
        }

        /* Goals */
        .m-goals {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .m-goal-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          background: var(--card-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.15s;
          text-align: left;
          width: 100%;
          min-height: 52px;
          -webkit-tap-highlight-color: transparent;
        }
        .m-goal-card:active { transform: scale(0.98); }
        .m-goal-card.selected {
          border-color: var(--accent-primary);
          background: rgba(249, 115, 22, 0.04);
        }
        .m-goal-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: var(--bg-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--text-secondary);
          transition: all 0.15s;
        }
        .m-goal-card.selected .m-goal-icon-wrap {
          background: rgba(249, 115, 22, 0.1);
          color: var(--accent-primary);
        }
        .m-goal-label {
          flex: 1;
          font-size: 0.9rem;
          color: var(--text-primary);
          line-height: 1.3;
        }
        .m-goal-check {
          width: 22px;
          height: 22px;
          border: 1.5px solid var(--border-color);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: transparent;
          transition: all 0.15s;
        }
        .m-goal-card.selected .m-goal-check {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          color: white;
        }

        /* Footer */
        .m-footer { margin-top: auto; padding-top: 20px; }
        .m-footer-split { display: flex; gap: 10px; }

        /* Buttons */
        .m-btn-primary {
          width: 100%;
          padding: 15px 24px;
          background: var(--accent-gradient);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          -webkit-tap-highlight-color: transparent;
          min-height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 2px;
        }
        .m-btn-primary:active { transform: scale(0.97); }
        .m-btn-primary:disabled { opacity: 0.4; pointer-events: none; }
        .m-btn-sub { font-size: 0.75rem; font-weight: 400; opacity: 0.85; }
        .m-btn-back {
          flex-shrink: 0;
          padding: 15px 20px;
          background: var(--bg-tertiary);
          color: var(--text-primary);
          border: none;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          min-height: 50px;
          -webkit-tap-highlight-color: transparent;
        }
        .m-btn-back:active { transform: scale(0.97); }
        .m-footer-split .m-btn-primary { flex: 1; }
        .m-btn-text {
          width: 100%;
          padding: 14px;
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          min-height: 48px;
        }
        .m-btn-text:active { color: var(--text-primary); }

      `}</style>
    </div>
  );
}
