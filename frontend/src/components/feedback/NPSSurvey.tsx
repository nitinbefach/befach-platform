'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { submitFeedback, getSentiment, getSessionId } from '@/lib/feedback';

interface NPSSurveyProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export default function NPSSurvey({ isOpen, onClose, onComplete }: NPSSurveyProps) {
  const [step, setStep] = useState(1);
  const [score, setScore] = useState<number | null>(null);
  const [reason, setReason] = useState('');
  const [priorities, setPriorities] = useState<string[]>([]);

  const features = [
    'Cost Calculator',
    'Supplier Search',
    'Vendor Management',
    'Shipment Tracking',
    'Market Insights'
  ];

  const getScoreColor = (val: number) => {
    if (val <= 6) return '#ef4444'; // Detractor
    if (val <= 8) return '#f59e0b'; // Passive
    return '#10b981'; // Promoter
  };

  const getScoreLabel = (val: number) => {
    if (val <= 6) return 'Detractor';
    if (val <= 8) return 'Passive';
    return 'Promoter';
  };

  const togglePriority = (feature: string) => {
    setPriorities(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const handleSubmit = () => {
    if (score === null) return;

    submitFeedback({
      type: 'nps',
      feature: 'overall-satisfaction',
      response: score,
      sentiment: getSentiment('nps', score),
      comments: reason || undefined,
      metadata: { priorities, npsCategory: getScoreLabel(score).toLowerCase() },
      sessionId: getSessionId()
    });

    // Reset
    setStep(1);
    setScore(null);
    setReason('');
    setPriorities([]);
    onComplete?.();
    onClose();
  };

  const handleClose = () => {
    setStep(1);
    setScore(null);
    setReason('');
    setPriorities([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="How likely are you to recommend Befach?">
      <div className="nps-survey">
        {/* Step indicator */}
        <div className="steps">
          {[1, 2, 3].map(s => (
            <div key={s} className={`step-dot ${step >= s ? 'active' : ''}`}>
              {s}
            </div>
          ))}
        </div>

        {/* Step 1: NPS Score */}
        {step === 1 && (
          <div className="step-content">
            <p className="step-description">
              On a scale of 0-10, how likely are you to recommend Befach to a colleague?
            </p>
            <div className="nps-grid">
              {Array.from({ length: 11 }, (_, i) => i).map(val => (
                <button
                  key={val}
                  className={`nps-btn ${score === val ? 'selected' : ''}`}
                  style={{
                    borderColor: score === val ? getScoreColor(val) : undefined,
                    background: score === val ? getScoreColor(val) : undefined,
                    color: score === val ? 'white' : undefined
                  }}
                  onClick={() => setScore(val)}
                >
                  {val}
                </button>
              ))}
            </div>
            <div className="nps-labels">
              <span>Not likely at all</span>
              <span>Extremely likely</span>
            </div>
            {score !== null && (
              <div className="score-badge" style={{ background: `${getScoreColor(score)}15`, color: getScoreColor(score), borderColor: getScoreColor(score) }}>
                {getScoreLabel(score)} ({score}/10)
              </div>
            )}
          </div>
        )}

        {/* Step 2: Reason */}
        {step === 2 && (
          <div className="step-content">
            <p className="step-description">
              What&apos;s the main reason for your score?
            </p>
            <textarea
              className="reason-input"
              placeholder="Your feedback helps us improve Befach..."
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              autoFocus
            />
          </div>
        )}

        {/* Step 3: Feature priorities */}
        {step === 3 && (
          <div className="step-content">
            <p className="step-description">
              Which features are most valuable to you? (Select all that apply)
            </p>
            <div className="feature-list">
              {features.map(feature => (
                <button
                  key={feature}
                  className={`feature-toggle ${priorities.includes(feature) ? 'active' : ''}`}
                  onClick={() => togglePriority(feature)}
                >
                  <span className="toggle-indicator">
                    {priorities.includes(feature) ? <Check size={14} /> : ''}
                  </span>
                  <span>{feature}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="nav-buttons">
          {step > 1 && (
            <button className="nav-btn secondary" onClick={() => setStep(s => s - 1)}>
              Back
            </button>
          )}
          <div style={{ flex: 1 }} />
          {step < 3 ? (
            <button
              className="nav-btn primary"
              disabled={step === 1 && score === null}
              onClick={() => setStep(s => s + 1)}
            >
              Next
            </button>
          ) : (
            <button className="nav-btn submit" onClick={handleSubmit}>
              Submit
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .nps-survey {
          padding: 0 24px 24px;
        }
        .steps {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 24px;
        }
        .step-dot {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          border: 2px solid #e5e7eb;
          color: #9ca3af;
          transition: all 0.2s ease;
        }
        .step-dot.active {
          border-color: #f97316;
          background: #f97316;
          color: white;
        }

        .step-content {
          min-height: 180px;
        }
        .step-description {
          font-size: 15px;
          color: #4b5563;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        /* NPS Grid */
        .nps-grid {
          display: grid;
          grid-template-columns: repeat(11, 1fr);
          gap: 6px;
        }
        .nps-btn {
          padding: 10px 0;
          border: 2px solid #e5e7eb;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          transition: all 0.2s ease;
        }
        .nps-btn:hover {
          transform: scale(1.1);
          border-color: #d1d5db;
        }
        .nps-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
          font-size: 11px;
          color: #9ca3af;
        }
        .score-badge {
          display: inline-block;
          margin-top: 16px;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          border: 1px solid;
        }

        /* Reason textarea */
        .reason-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          resize: vertical;
          font-family: inherit;
        }
        .reason-input:focus {
          outline: none;
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        /* Feature toggles */
        .feature-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .feature-toggle {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          color: #374151;
          transition: all 0.2s ease;
          text-align: left;
        }
        .feature-toggle:hover {
          border-color: #f97316;
        }
        .feature-toggle.active {
          border-color: #f97316;
          background: #fff7ed;
        }
        .toggle-indicator {
          width: 20px;
          height: 20px;
          border: 2px solid #d1d5db;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          flex-shrink: 0;
        }
        .feature-toggle.active .toggle-indicator {
          border-color: #f97316;
          background: #f97316;
          color: white;
        }

        /* Navigation */
        .nav-buttons {
          display: flex;
          gap: 12px;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid #f3f4f6;
        }
        .nav-btn {
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
        }
        .nav-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .nav-btn.secondary {
          background: #f3f4f6;
          color: #6b7280;
        }
        .nav-btn.secondary:hover {
          background: #e5e7eb;
        }
        .nav-btn.primary {
          background: #f97316;
          color: white;
        }
        .nav-btn.primary:hover:not(:disabled) {
          background: #ea580c;
        }
        .nav-btn.submit {
          background: #10b981;
          color: white;
        }
        .nav-btn.submit:hover {
          background: #059669;
        }

        @media (max-width: 480px) {
          .nps-grid {
            grid-template-columns: repeat(6, 1fr);
          }
        }
      `}</style>
    </Modal>
  );
}
