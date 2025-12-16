'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserModeContext';
import { Logo, DarkModeToggle } from '@/components/ui';

type Step = 'profile' | 'goals' | 'tour-choice';

const goalOptions = [
  { id: 'source-products', label: 'Source products from suppliers', icon: '🔍' },
  { id: 'track-shipments', label: 'Track shipments and logistics', icon: '🚚' },
  { id: 'calculate-costs', label: 'Calculate import costs and duties', icon: '💰' },
  { id: 'market-research', label: 'Research market trends', icon: '📊' },
  { id: 'manage-compliance', label: 'Manage compliance and documents', icon: '📋' },
  { id: 'team-collaboration', label: 'Collaborate with my team', icon: '👥' },
];

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>('profile');
  const [companyName, setCompanyName] = useState('');
  const [companyType, setCompanyType] = useState<'individual' | 'company'>('company');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const { login, completeOnboarding, completeTour } = useUser();
  const router = useRouter();

  const handleProfileSubmit = () => {
    if (companyName.trim()) {
      login({
        name: companyName,
        type: companyType,
        teamSize: '1',
        primaryGoals: []
      });
      setStep('goals');
    }
  };

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals(prev =>
      prev.includes(goalId)
        ? prev.filter(g => g !== goalId)
        : [...prev, goalId]
    );
  };

  const handleGoalsSubmit = () => {
    setStep('tour-choice');
  };

  const handleStartTour = () => {
    completeOnboarding();
    router.push('/dashboard?tour=true');
  };

  const handleSkipTour = () => {
    completeOnboarding();
    completeTour();
    router.push('/dashboard');
  };

  return (
    <div className="onboarding-container">
      {/* Header */}
      <header className="onboarding-header">
        <Logo size="medium" />
        <DarkModeToggle />
      </header>

      {/* Progress */}
      <div className="progress-bar">
        <div className={`progress-step ${step === 'profile' ? 'active' : 'completed'}`}>
          <span className="step-num">1</span>
          <span className="step-label">Profile</span>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step === 'goals' ? 'active' : step === 'tour-choice' ? 'completed' : ''}`}>
          <span className="step-num">2</span>
          <span className="step-label">Goals</span>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step === 'tour-choice' ? 'active' : ''}`}>
          <span className="step-num">3</span>
          <span className="step-label">Get Started</span>
        </div>
      </div>

      {/* Content */}
      <div className="onboarding-content">
        {step === 'profile' && (
          <div className="step-content">
            <h1>Welcome to Befach!</h1>
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
                  <label className={`type-option ${companyType === 'individual' ? 'selected' : ''}`}>
                    <input 
                      type="radio"
                      name="type"
                      value="individual"
                      checked={companyType === 'individual'}
                      onChange={() => setCompanyType('individual')}
                    />
                    <span className="type-icon">👤</span>
                    <div>
                      <strong>Individual</strong>
                      <p>Sole proprietor or freelancer</p>
                    </div>
                  </label>
                  <label className={`type-option ${companyType === 'company' ? 'selected' : ''}`}>
                    <input 
                      type="radio"
                      name="type"
                      value="company"
                      checked={companyType === 'company'}
                      onChange={() => setCompanyType('company')}
                    />
                    <span className="type-icon">🏢</span>
                    <div>
                      <strong>Company</strong>
                      <p>Registered business entity</p>
                    </div>
                  </label>
                </div>
              </div>

              <button 
                className="btn-continue"
                onClick={handleProfileSubmit}
                disabled={!companyName.trim()}
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
              {goalOptions.map(goal => (
                <label 
                  key={goal.id}
                  className={`goal-option ${selectedGoals.includes(goal.id) ? 'selected' : ''}`}
                >
                  <input 
                    type="checkbox"
                    checked={selectedGoals.includes(goal.id)}
                    onChange={() => handleGoalToggle(goal.id)}
                  />
                  <span className="goal-icon">{goal.icon}</span>
                  <span className="goal-label">{goal.label}</span>
                  <span className="goal-check">✓</span>
                </label>
              ))}
            </div>

            <div className="step-actions">
              <button className="btn-back" onClick={() => setStep('profile')}>
                Back
              </button>
              <button 
                className="btn-continue"
                onClick={handleGoalsSubmit}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 'tour-choice' && (
          <div className="step-content tour-choice">
            <div className="tour-icon">🎉</div>
            <h1>You&apos;re all set!</h1>
            <p className="step-subtitle">Would you like a quick tour of the platform?</p>

            <div className="tour-options">
              <button className="btn-tour" onClick={handleStartTour}>
                <span className="tour-btn-icon">🎯</span>
                <div>
                  <strong>Take the Tour</strong>
                  <p>2 minute interactive walkthrough</p>
                </div>
              </button>
              
              <button className="btn-skip" onClick={handleSkipTour}>
                <span className="tour-btn-icon">🚀</span>
                <div>
                  <strong>Skip for Now</strong>
                  <p>Jump straight to the dashboard</p>
                </div>
              </button>
            </div>

            <p className="tour-note">
              You can always access the tour later from Settings
            </p>
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
        .progress-step.active {
          color: var(--accent-primary);
        }
        .progress-step.completed {
          color: #10b981;
        }
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
        .step-label {
          font-size: 0.9em;
        }
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
        .onboarding-form {
          text-align: left;
        }
        .onboarding-form .form-group {
          margin-bottom: 25px;
        }
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
        .type-option:hover {
          border-color: var(--accent-primary);
        }
        .type-option.selected {
          border-color: var(--accent-primary);
          background: rgba(255, 107, 53, 0.05);
        }
        .type-option input {
          display: none;
        }
        .type-icon {
          font-size: 2em;
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
          transition: all 0.3s;
          margin-top: 20px;
        }
        .btn-continue:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 53, 0.3);
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
        .goal-option:hover {
          border-color: var(--accent-primary);
        }
        .goal-option.selected {
          border-color: var(--accent-primary);
          background: rgba(255, 107, 53, 0.05);
        }
        .goal-option input {
          display: none;
        }
        .goal-icon {
          font-size: 1.5em;
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
          font-size: 0.8em;
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
        .tour-choice {
          max-width: 500px;
        }
        .tour-icon {
          font-size: 4em;
          margin-bottom: 20px;
        }
        .tour-options {
          display: grid;
          gap: 15px;
          margin-top: 30px;
        }
        .btn-tour, .btn-skip {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px 25px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s;
          text-align: left;
          width: 100%;
        }
        .btn-tour {
          background: var(--accent-gradient);
          color: white;
          border: none;
        }
        .btn-tour:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3);
        }
        .btn-skip {
          background: var(--card-bg);
          color: var(--text-primary);
          border: 2px solid var(--border-color);
        }
        .btn-skip:hover {
          border-color: var(--accent-primary);
        }
        .tour-btn-icon {
          font-size: 1.8em;
        }
        .btn-tour strong, .btn-skip strong {
          display: block;
          font-size: 1.1em;
        }
        .btn-tour p {
          opacity: 0.9;
          font-size: 0.9em;
          margin: 3px 0 0 0;
        }
        .btn-skip p {
          color: var(--text-secondary);
          font-size: 0.9em;
          margin: 3px 0 0 0;
        }
        .tour-note {
          color: var(--text-muted);
          font-size: 0.9em;
          margin-top: 25px;
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

