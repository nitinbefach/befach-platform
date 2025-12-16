'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserModeContext';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  position: 'center' | 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Befach!',
    description: 'Let us show you around the platform. This tour will take about 2 minutes.',
    position: 'center'
  },
  {
    id: 'sidebar',
    title: 'Navigation Sidebar',
    description: 'Access all features from here. You can pin your favorite items for quick access.',
    target: '.sidebar',
    position: 'right'
  },
  {
    id: 'submit-requirement',
    title: 'Submit Requirements',
    description: 'Need products? Submit your requirement and we\'ll help you find the best suppliers.',
    target: '[href="/submit-requirement"]',
    position: 'right'
  },
  {
    id: 'tools',
    title: 'Powerful Tools',
    description: 'Use our calculators, market insights, and compliance tools to make informed decisions.',
    target: '.nav-section:nth-child(5)',
    position: 'right'
  },
  {
    id: 'tracking',
    title: 'Track Everything',
    description: 'Monitor your shipments in real-time and access all your documents in one place.',
    target: '[href="/logistics-tracking"]',
    position: 'right'
  },
  {
    id: 'customize',
    title: 'Customize Your Experience',
    description: 'Pin frequently used features to Quick Access by hovering over items and clicking the pin icon.',
    position: 'center'
  },
  {
    id: 'complete',
    title: 'You\'re Ready!',
    description: 'Start by submitting your first requirement or exploring the dashboard.',
    position: 'center'
  }
];

interface GuidedTourProps {
  onComplete: () => void;
}

export default function GuidedTour({ onComplete }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const { completeTour } = useUser();

  const step = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setIsVisible(false);
    completeTour();
    onComplete();
  };

  useEffect(() => {
    // Highlight target element if specified
    if (step.target) {
      const el = document.querySelector(step.target);
      if (el) {
        el.classList.add('tour-highlight');
        return () => el.classList.remove('tour-highlight');
      }
    }
  }, [step.target]);

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div className="tour-overlay" onClick={handleSkip} />

      {/* Tour Modal */}
      <div className={`tour-modal ${step.position}`}>
        <div className="tour-header">
          <span className="tour-step-indicator">
            {currentStep + 1} of {tourSteps.length}
          </span>
          <button className="tour-close" onClick={handleSkip}>
            Skip Tour
          </button>
        </div>

        <div className="tour-content">
          <h3>{step.title}</h3>
          <p>{step.description}</p>
        </div>

        <div className="tour-actions">
          {!isFirstStep && (
            <button className="tour-btn-secondary" onClick={handlePrev}>
              Previous
            </button>
          )}
          <button className="tour-btn-primary" onClick={handleNext}>
            {isLastStep ? 'Get Started' : 'Next'}
          </button>
        </div>

        <div className="tour-dots">
          {tourSteps.map((_, idx) => (
            <span 
              key={idx} 
              className={`tour-dot ${idx === currentStep ? 'active' : ''} ${idx < currentStep ? 'completed' : ''}`}
              onClick={() => setCurrentStep(idx)}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .tour-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 9998;
          cursor: pointer;
        }
        .tour-modal {
          position: fixed;
          z-index: 9999;
          background: var(--card-bg);
          border-radius: 16px;
          padding: 25px;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: tourFadeIn 0.3s ease;
        }
        .tour-modal.center {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .tour-modal.right {
          top: 50%;
          left: 320px;
          transform: translateY(-50%);
        }
        @keyframes tourFadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        .tour-modal.right {
          animation: tourSlideRight 0.3s ease;
        }
        @keyframes tourSlideRight {
          from {
            opacity: 0;
            transform: translateY(-50%) translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
        }
        .tour-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .tour-step-indicator {
          background: var(--accent-gradient);
          color: white;
          padding: 5px 12px;
          border-radius: 15px;
          font-size: 0.8em;
          font-weight: 600;
        }
        .tour-close {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 0.9em;
        }
        .tour-close:hover {
          color: var(--text-primary);
        }
        .tour-content h3 {
          color: var(--text-primary);
          font-size: 1.3em;
          margin-bottom: 10px;
        }
        .tour-content p {
          color: var(--text-secondary);
          line-height: 1.6;
        }
        .tour-actions {
          display: flex;
          gap: 12px;
          margin-top: 25px;
        }
        .tour-btn-primary, .tour-btn-secondary {
          flex: 1;
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tour-btn-primary {
          background: var(--accent-gradient);
          color: white;
          border: none;
        }
        .tour-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
        }
        .tour-btn-secondary {
          background: var(--bg-tertiary);
          color: var(--text-primary);
          border: none;
        }
        .tour-btn-secondary:hover {
          background: var(--border-color);
        }
        .tour-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 20px;
        }
        .tour-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--border-color);
          cursor: pointer;
          transition: all 0.2s;
        }
        .tour-dot.active {
          background: var(--accent-primary);
          width: 24px;
          border-radius: 4px;
        }
        .tour-dot.completed {
          background: var(--accent-secondary);
        }
        @media (max-width: 768px) {
          .tour-modal.right {
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
      <style jsx global>{`
        .tour-highlight {
          position: relative;
          z-index: 9998;
          box-shadow: 0 0 0 4px var(--accent-primary), 0 0 0 8px rgba(255, 107, 53, 0.2);
          border-radius: 8px;
        }
      `}</style>
    </>
  );
}

