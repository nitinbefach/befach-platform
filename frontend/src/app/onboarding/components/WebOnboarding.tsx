'use client';

import { Logo } from '@/components/ui';
import { useOnboarding, goalOptions, typeOptions } from './useOnboarding';

export default function WebOnboarding() {
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

  return (
    <div className="onboarding-container">
      <header className="onboarding-header">
        <Logo size="medium" />
      </header>

      {/* Progress */}
      <div className="progress-bar">
        <div className={`progress-step ${step === 'profile' ? 'active' : 'completed'}`}>
          <span className="step-num">1</span>
          <span className="step-label">Profile</span>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step === 'goals' ? 'active' : ''}`}>
          <span className="step-num">2</span>
          <span className="step-label">Goals</span>
        </div>
      </div>

      {/* Content */}
      <div className="onboarding-content">
        {step === 'profile' && (
          <div className="step-content">
            <h1>Welcome to Befach</h1>
            <p className="step-subtitle">Let&apos;s set up your account in just a few steps</p>

            <div className="onboarding-form">
              <div className="form-group">
                <label>Company / Business Name *</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter your business name"
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Business Type</label>
                <div className="type-options">
                  {(['individual', 'company'] as const).map(type => {
                    const opt = typeOptions[type];
                    const Icon = opt.icon;
                    return (
                      <label key={type} className={`type-option ${companyType === type ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="type"
                          value={type}
                          checked={companyType === type}
                          onChange={() => setCompanyType(type)}
                        />
                        <div className="type-icon-wrap">
                          <Icon size={22} />
                        </div>
                        <div>
                          <strong>{opt.label}</strong>
                          <p>{opt.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <button
                className="btn-continue"
                onClick={handleProfileSubmit}
                disabled={!canSubmitProfile}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 'goals' && (
          <div className="step-content">
            <h1>What do you want to accomplish?</h1>
            <p className="step-subtitle">Select all that apply - this helps us personalize your experience</p>

            <div className="goals-grid">
              {goalOptions.map(goal => {
                const Icon = goal.icon;
                return (
                  <label
                    key={goal.id}
                    className={`goal-option ${selectedGoals.includes(goal.id) ? 'selected' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedGoals.includes(goal.id)}
                      onChange={() => handleGoalToggle(goal.id)}
                    />
                    <div className="goal-icon-wrap">
                      <Icon size={20} />
                    </div>
                    <span className="goal-label">{goal.label}</span>
                    <span className="goal-check">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="step-actions">
              <button className="btn-back" onClick={handleGoBack}>Back</button>
              <button className="btn-continue" onClick={handleGoalsSubmit}>Continue</button>
            </div>
          </div>
        )}

      </div>

      <style jsx>{`
        .onboarding-container {
          min-height: 100vh;
          background: var(--bg-primary);
          display: flex;
          flex-direction: column;
        }
        .onboarding-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 40px;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
        }
        .progress-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 30px 20px;
          background: var(--bg-secondary);
        }
        .progress-step {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
        }
        .progress-step.active { color: var(--accent-primary); }
        .progress-step.completed { color: #10b981; }
        .step-num {
          width: 28px;
          height: 28px;
          border: 2px solid currentColor;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.85em;
        }
        .progress-step.active .step-num,
        .progress-step.completed .step-num {
          background: currentColor;
          color: white;
        }
        .step-label { font-size: 0.9em; }
        .progress-line {
          width: 60px;
          height: 2px;
          background: var(--border-color);
        }
        .onboarding-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }
        .step-content {
          max-width: 600px;
          width: 100%;
          text-align: center;
        }
        .step-content h1 {
          color: var(--text-primary);
          font-size: 2em;
          margin-bottom: 10px;
        }
        .step-subtitle {
          color: var(--text-secondary);
          margin-bottom: 40px;
          font-size: 1.1em;
        }
        .onboarding-form { text-align: left; }
        .onboarding-form .form-group { margin-bottom: 25px; }
        .onboarding-form label {
          display: block;
          color: var(--text-primary);
          font-weight: 600;
          margin-bottom: 10px;
        }
        .onboarding-form input[type="text"] {
          width: 100%;
          padding: 16px;
          border: 2px solid var(--border-color);
          border-radius: 10px;
          font-size: 1.1em;
          background: var(--card-bg);
          color: var(--text-primary);
        }
        .onboarding-form input:focus {
          outline: none;
          border-color: var(--accent-primary);
        }
        .type-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        .type-option {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          border: 2px solid var(--border-color);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          background: var(--card-bg);
        }
        .type-option:hover { border-color: var(--accent-primary); }
        .type-option.selected {
          border-color: var(--accent-primary);
          background: rgba(249, 115, 22, 0.04);
        }
        .type-option input { display: none; }
        .type-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: var(--bg-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--text-secondary);
          transition: all 0.2s;
        }
        .type-option.selected .type-icon-wrap {
          background: rgba(249, 115, 22, 0.1);
          color: var(--accent-primary);
        }
        .type-option strong {
          display: block;
          color: var(--text-primary);
        }
        .type-option p {
          color: var(--text-secondary);
          font-size: 0.85em;
          margin: 3px 0 0 0;
        }
        .btn-continue {
          width: 100%;
          padding: 16px;
          background: var(--accent-gradient);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1.1em;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 20px;
        }
        .btn-continue:hover:not(:disabled) {
          box-shadow: 0 4px 16px rgba(249, 115, 22, 0.25);
        }
        .btn-continue:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .goals-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          text-align: left;
        }
        .goal-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 18px;
          border: 2px solid var(--border-color);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          background: var(--card-bg);
          position: relative;
        }
        .goal-option:hover { border-color: var(--accent-primary); }
        .goal-option.selected {
          border-color: var(--accent-primary);
          background: rgba(249, 115, 22, 0.04);
        }
        .goal-option input { display: none; }
        .goal-icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: var(--bg-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--text-secondary);
          transition: all 0.2s;
        }
        .goal-option.selected .goal-icon-wrap {
          background: rgba(249, 115, 22, 0.1);
          color: var(--accent-primary);
        }
        .goal-label {
          flex: 1;
          color: var(--text-primary);
          font-size: 0.95em;
        }
        .goal-check {
          width: 24px;
          height: 24px;
          border: 2px solid var(--border-color);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: transparent;
          transition: all 0.2s;
        }
        .goal-option.selected .goal-check {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          color: white;
        }
        .step-actions {
          display: flex;
          gap: 15px;
          margin-top: 40px;
        }
        .btn-back {
          flex: 1;
          padding: 16px;
          background: var(--bg-tertiary);
          color: var(--text-primary);
          border: none;
          border-radius: 10px;
          font-size: 1em;
          font-weight: 600;
          cursor: pointer;
        }
        .step-actions .btn-continue {
          flex: 2;
          margin-top: 0;
        }
        @media (max-width: 600px) {
          .type-options, .goals-grid {
            grid-template-columns: 1fr;
          }
          .onboarding-header {
            padding: 15px 20px;
          }
        }
      `}</style>
    </div>
  );
}
