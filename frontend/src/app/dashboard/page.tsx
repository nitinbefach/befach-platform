'use client';

import { Suspense, useEffect, useState } from 'react';
import { useNextStep } from 'nextstepjs';
import { useMobile } from '@/hooks/useMobile';
import { useFeedbackTrigger } from '@/hooks/useFeedbackTrigger';
import { shouldAutoTriggerWalkthrough, incrementFeatureVisit } from '@/lib/walkthroughStorage';
import { DashboardProvider, WebDashboard, MobileDashboard } from './components';

function DashboardContent() {
  const { isMobile } = useMobile();
  const { triggerNPSCheck, npsElement } = useFeedbackTrigger();
  const { startNextStep } = useNextStep();
  const [showTourButton, setShowTourButton] = useState(false);

  useEffect(() => {
    triggerNPSCheck();
  }, [triggerNPSCheck]);

  // Show "Take a Tour" button on first visit
  useEffect(() => {
    const shouldShow = shouldAutoTriggerWalkthrough('dashboard');
    incrementFeatureVisit('dashboard');
    setShowTourButton(shouldShow);
  }, []);

  return (
    <>
      {isMobile ? <MobileDashboard /> : <WebDashboard />}
      {npsElement}

      {showTourButton && (
        <div className={`tour-prompt ${isMobile ? 'mobile' : 'desktop'}`}>
          <div className="tour-prompt-content">
            <span className="tour-prompt-icon">🎯</span>
            <div>
              <p className="tour-prompt-title">New to Befach?</p>
              <p className="tour-prompt-desc">Take a quick tour of all features</p>
            </div>
          </div>
          <div className="tour-prompt-actions">
            <button
              className="tour-prompt-btn"
              onClick={() => {
                setShowTourButton(false);
                startNextStep('befach-tour');
              }}
            >
              Start Tour
            </button>
            <button
              className="tour-prompt-dismiss"
              onClick={() => setShowTourButton(false)}
            >
              Maybe later
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .tour-prompt {
          position: fixed;
          z-index: 900;
          background: rgba(255, 255, 255, 0.97);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(0, 0, 0, 0.06);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
        }
        .tour-prompt.desktop {
          bottom: 24px;
          right: 24px;
          border-radius: 16px;
          padding: 20px 24px;
          max-width: 320px;
        }
        .tour-prompt.mobile {
          bottom: 88px;
          left: 12px;
          right: 12px;
          border-radius: 16px;
          padding: 16px 20px;
        }
        .tour-prompt-content {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .tour-prompt-icon {
          font-size: 28px;
          line-height: 1;
        }
        .tour-prompt-title {
          margin: 0;
          font-size: 15px;
          font-weight: 700;
          color: #1f2937;
        }
        .tour-prompt-desc {
          margin: 2px 0 0;
          font-size: 13px;
          color: #6b7280;
        }
        .tour-prompt-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .tour-prompt-btn {
          flex: 1;
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
          border: none;
          border-radius: 10px;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }
        .tour-prompt-btn:hover {
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
        }
        .tour-prompt-dismiss {
          background: none;
          border: none;
          color: #9ca3af;
          font-size: 13px;
          cursor: pointer;
          font-family: inherit;
          padding: 8px;
        }
        .tour-prompt-dismiss:hover {
          color: #6b7280;
        }
      `}</style>
    </>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<DashboardLoadingState />}>
      <DashboardProvider>
        <DashboardContent />
      </DashboardProvider>
    </Suspense>
  );
}

function DashboardLoadingState() {
  return (
    <div className="dashboard-loading">
      <div className="loading-spinner" />
      <p>Loading dashboard...</p>
      <style jsx>{`
        .dashboard-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          gap: 1rem;
        }
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #f97316;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        p {
          color: #64748b;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
}
