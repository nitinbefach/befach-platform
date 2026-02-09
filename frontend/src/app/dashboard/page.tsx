'use client';

import { Suspense, useEffect } from 'react';
import { useMobile } from '@/hooks/useMobile';
import { useFeedbackTrigger } from '@/hooks/useFeedbackTrigger';
import { DashboardProvider, WebDashboard, MobileDashboard } from './components';

function DashboardContent() {
  const { isMobile } = useMobile();
  const { triggerNPSCheck, npsElement } = useFeedbackTrigger();

  useEffect(() => {
    triggerNPSCheck();
  }, [triggerNPSCheck]);

  return (
    <>
      {isMobile ? <MobileDashboard /> : <WebDashboard />}
      {npsElement}
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
