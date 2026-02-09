'use client';

import { useState, useCallback } from 'react';
import Modal from '@/components/ui/Modal';
import { submitFeedback, getSessionId, SURVEY_DEFINITIONS, type SurveyQuestion } from '@/lib/feedback';

interface SurveyWizardProps {
  surveyType: 'vendor_management' | 'cost_calculator' | 'general';
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export default function SurveyWizard({ surveyType, isOpen, onClose, onComplete }: SurveyWizardProps) {
  const survey = SURVEY_DEFINITIONS[surveyType];
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, unknown>>({});
  const [startTime] = useState(Date.now());
  const [error, setError] = useState('');

  const question = survey?.questions[currentStep];
  const totalSteps = survey?.questions.length || 0;
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  const setResponse = useCallback((value: unknown) => {
    setResponses(prev => ({ ...prev, [question.id]: value }));
    setError('');
  }, [question?.id]);

  const handleNext = () => {
    if (question.required && !responses[question.id]) {
      setError('Please answer this question before continuing.');
      return;
    }
    setError('');
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setError('');
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (question.required && !responses[question.id]) {
      setError('Please answer this question before submitting.');
      return;
    }

    const completionTime = Date.now() - startTime;
    const answeredCount = Object.keys(responses).length;
    const completionRate = (answeredCount / totalSteps) * 100;

    submitFeedback({
      type: 'survey',
      feature: surveyType.replace('_', '-'),
      response: responses,
      sentiment: 'neutral',
      surveyType,
      completionTime,
      completionRate: Math.round(completionRate),
      sessionId: getSessionId()
    });

    // Reset and close
    setCurrentStep(0);
    setResponses({});
    setError('');
    onComplete?.();
    onClose();
  };

  const handleClose = () => {
    setCurrentStep(0);
    setResponses({});
    setError('');
    onClose();
  };

  if (!survey || !question) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={survey.title}>
      <div className="survey-wizard">
        {/* Progress bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-text">Question {currentStep + 1} of {totalSteps}</span>
        </div>

        {/* Question */}
        <div className="question-container">
          <h3 className="question-text">{question.question}</h3>
          {!question.required && <span className="optional-tag">Optional</span>}

          {/* Question renderers */}
          {question.type === 'multiple_choice' && (
            <div className="options-list">
              {question.options?.map(option => (
                <button
                  key={option}
                  className={`option-btn ${responses[question.id] === option ? 'selected' : ''}`}
                  onClick={() => setResponse(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {question.type === 'scale' && (
            <div className="scale-container">
              <div className="scale-buttons">
                {Array.from({ length: (question.max || 5) - (question.min || 1) + 1 }, (_, i) => (question.min || 1) + i).map(val => (
                  <button
                    key={val}
                    className={`scale-btn ${responses[question.id] === val ? 'selected' : ''}`}
                    onClick={() => setResponse(val)}
                  >
                    {val}
                  </button>
                ))}
              </div>
              {question.labels && (
                <div className="scale-labels">
                  <span>{question.labels[0]}</span>
                  <span>{question.labels[1]}</span>
                </div>
              )}
            </div>
          )}

          {question.type === 'text' && (
            <textarea
              className="text-input"
              placeholder={question.placeholder || 'Enter your response...'}
              rows={4}
              value={(responses[question.id] as string) || ''}
              onChange={(e) => setResponse(e.target.value)}
            />
          )}

          {question.type === 'binary' && (
            <div className="binary-buttons">
              {question.options?.map(option => (
                <button
                  key={option}
                  className={`binary-btn ${responses[question.id] === option ? 'selected' : ''}`}
                  onClick={() => setResponse(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {question.type === 'checkbox' && (
            <div className="checkbox-list">
              {question.options?.map(option => {
                const currentValues = (responses[question.id] as string[]) || [];
                const isChecked = currentValues.includes(option);
                return (
                  <label key={option} className={`checkbox-item ${isChecked ? 'checked' : ''}`}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        const updated = isChecked
                          ? currentValues.filter(v => v !== option)
                          : [...currentValues, option];
                        setResponse(updated);
                      }}
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>
          )}

          {error && <p className="error-msg">{error}</p>}
        </div>

        {/* Navigation */}
        <div className="nav-buttons">
          {currentStep > 0 && (
            <button className="nav-btn secondary" onClick={handlePrev}>Previous</button>
          )}
          <div style={{ flex: 1 }} />
          {currentStep < totalSteps - 1 ? (
            <button className="nav-btn primary" onClick={handleNext}>Next</button>
          ) : (
            <button className="nav-btn primary submit" onClick={handleSubmit}>Submit Survey</button>
          )}
        </div>
      </div>

      <style jsx>{`
        .survey-wizard {
          padding: 0 24px 24px;
        }
        .progress-container {
          margin-bottom: 24px;
        }
        .progress-bar {
          height: 4px;
          background: #e5e7eb;
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        .progress-fill {
          height: 100%;
          background: #f97316;
          border-radius: 2px;
          transition: width 0.3s ease;
        }
        .progress-text {
          font-size: 12px;
          color: #9ca3af;
        }

        .question-container {
          min-height: 200px;
        }
        .question-text {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
          line-height: 1.4;
        }
        .optional-tag {
          font-size: 12px;
          color: #9ca3af;
          display: block;
          margin-bottom: 16px;
        }

        /* Multiple choice */
        .options-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 16px;
        }
        .option-btn {
          padding: 12px 16px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 8px;
          text-align: left;
          cursor: pointer;
          font-size: 14px;
          color: #374151;
          transition: all 0.2s ease;
        }
        .option-btn:hover {
          border-color: #f97316;
          background: #fff7ed;
        }
        .option-btn.selected {
          border-color: #f97316;
          background: #f97316;
          color: white;
        }

        /* Scale */
        .scale-container {
          margin-top: 16px;
        }
        .scale-buttons {
          display: flex;
          gap: 8px;
        }
        .scale-btn {
          flex: 1;
          padding: 12px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          color: #6b7280;
          transition: all 0.2s ease;
        }
        .scale-btn:hover {
          border-color: #f97316;
          color: #f97316;
        }
        .scale-btn.selected {
          border-color: #f97316;
          background: #f97316;
          color: white;
        }
        .scale-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
          font-size: 12px;
          color: #9ca3af;
        }

        /* Text */
        .text-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          resize: vertical;
          margin-top: 16px;
          font-family: inherit;
        }
        .text-input:focus {
          outline: none;
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        /* Binary */
        .binary-buttons {
          display: flex;
          gap: 12px;
          margin-top: 16px;
        }
        .binary-btn {
          flex: 1;
          padding: 14px;
          border: 2px solid #e5e7eb;
          background: white;
          border-radius: 10px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 600;
          color: #374151;
          transition: all 0.2s ease;
        }
        .binary-btn:hover {
          border-color: #f97316;
        }
        .binary-btn.selected {
          border-color: #f97316;
          background: #f97316;
          color: white;
        }

        /* Checkbox */
        .checkbox-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 16px;
        }
        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          color: #374151;
          transition: all 0.2s ease;
        }
        .checkbox-item:hover {
          border-color: #f97316;
          background: #fff7ed;
        }
        .checkbox-item.checked {
          border-color: #f97316;
          background: #fff7ed;
        }
        .checkbox-item input {
          accent-color: #f97316;
        }

        /* Error */
        .error-msg {
          color: #ef4444;
          font-size: 13px;
          margin-top: 8px;
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
          transition: all 0.2s ease;
        }
        .nav-btn.secondary {
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          color: #6b7280;
        }
        .nav-btn.secondary:hover {
          background: #e5e7eb;
        }
        .nav-btn.primary {
          background: #f97316;
          border: none;
          color: white;
        }
        .nav-btn.primary:hover {
          background: #ea580c;
        }
        .nav-btn.submit {
          background: #10b981;
        }
        .nav-btn.submit:hover {
          background: #059669;
        }
      `}</style>
    </Modal>
  );
}
