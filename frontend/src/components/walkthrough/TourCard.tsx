'use client';

import type { CardComponentProps } from 'nextstepjs';
import { useMobile } from '@/hooks/useMobile';

export default function TourCard({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  skipTour,
  arrow,
}: CardComponentProps) {
  const { isMobile } = useMobile();

  return (
    <div className={`tour-card ${isMobile ? 'mobile' : 'desktop'}`}>
      {isMobile && <div className="tour-drag-handle" />}

      <div className="tour-header">
        <span className="tour-badge">
          Step {currentStep + 1} of {totalSteps}
        </span>
        {skipTour && (
          <button className="tour-close" onClick={skipTour} aria-label="Skip tour">
            ✕
          </button>
        )}
      </div>

      <h3 className="tour-title">{step.title}</h3>

      <div className="tour-body">{step.content}</div>

      <div className={`tour-actions ${isMobile ? 'stacked' : ''}`}>
        {isMobile ? (
          <>
            <button className="tour-next" onClick={nextStep}>
              {currentStep + 1 === totalSteps ? 'Finish' : 'Next'}
            </button>
            {currentStep > 0 && (
              <button className="tour-prev" onClick={prevStep}>
                Previous
              </button>
            )}
          </>
        ) : (
          <>
            {currentStep > 0 && (
              <button className="tour-prev" onClick={prevStep}>
                ← Previous
              </button>
            )}
            <button className="tour-next" onClick={nextStep}>
              {currentStep + 1 === totalSteps ? 'Finish Tour' : 'Next →'}
            </button>
          </>
        )}
      </div>

      {!isMobile && arrow}

      <style jsx>{`
        .tour-card {
          background: rgba(255, 255, 255, 0.97);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(0, 0, 0, 0.06);
          font-family: var(--font-inter, inherit);
        }

        .tour-card.desktop {
          border-radius: 16px;
          padding: 24px 28px;
          max-width: 420px;
          width: 420px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15),
                      0 0 0 1px rgba(0, 0, 0, 0.05);
        }

        .tour-card.mobile {
          border-radius: 20px 20px 0 0;
          padding: 12px 20px 20px;
          padding-bottom: calc(20px + env(safe-area-inset-bottom, 0px));
          width: 100%;
          max-width: 100%;
          box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.15);
        }

        .tour-drag-handle {
          width: 36px;
          height: 4px;
          background: #d1d5db;
          border-radius: 2px;
          margin: 0 auto 14px;
        }

        .tour-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .tour-badge {
          display: inline-block;
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
          letter-spacing: 0.02em;
        }

        .tour-close {
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }
        .tour-close:hover {
          background: #f3f4f6;
          color: #6b7280;
        }

        .tour-title {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 12px;
          line-height: 1.3;
        }

        .tour-body {
          margin-bottom: 20px;
        }

        .tour-body :global(.tour-description) {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 14px;
          line-height: 1.5;
        }

        .tour-body :global(.tour-highlights) {
          list-style: none;
          padding: 0;
          margin: 0 0 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .tour-body :global(.tour-highlights li) {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 14px;
          color: #374151;
          line-height: 1.4;
        }

        .tour-body :global(.tour-highlights li::before) {
          content: '✓';
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          min-width: 20px;
          background: #ecfdf5;
          color: #059669;
          border-radius: 50%;
          font-size: 11px;
          font-weight: 700;
          margin-top: 1px;
        }

        .tour-body :global(.tour-tip) {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          background: #eff6ff;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 13px;
          color: #1d4ed8;
          line-height: 1.4;
        }

        .tour-body :global(.tour-tip strong) {
          white-space: nowrap;
        }

        .tour-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .tour-actions.stacked {
          flex-direction: column;
          gap: 8px;
        }

        .tour-next {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
          border: none;
          border-radius: 10px;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }
        .tour-actions.stacked .tour-next {
          width: 100%;
          padding: 14px;
          min-height: 48px;
        }
        .tour-next:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
        }
        .tour-next:active {
          transform: scale(0.98);
        }

        .tour-prev {
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          font-size: 13px;
          padding: 8px 12px;
          font-family: inherit;
          transition: color 0.15s;
        }
        .tour-actions.stacked .tour-prev {
          min-height: 44px;
        }
        .tour-prev:hover {
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .tour-title {
            font-size: 18px;
          }
          .tour-body :global(.tour-description) {
            font-size: 13px;
          }
          .tour-body :global(.tour-highlights li) {
            font-size: 13px;
          }
          .tour-body :global(.tour-tip) {
            font-size: 12px;
            padding: 8px 12px;
          }
        }
      `}</style>
    </div>
  );
}
