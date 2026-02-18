'use client';

import { Suspense } from 'react';
import { useMobile } from '@/hooks/useMobile';
import { WebOnboarding, MobileOnboarding } from './components';

function OnboardingContent() {
  const { isMobile } = useMobile();
  return isMobile ? <MobileOnboarding /> : <WebOnboarding />;
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<OnboardingLoadingState />}>
      <OnboardingContent />
    </Suspense>
  );
}

function OnboardingLoadingState() {
  return (
    <div className="onboarding-loading">
      <div className="loading-spinner" />
      <style jsx>{`
        .onboarding-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }
        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 2.5px solid var(--border-color, #e2e8f0);
          border-top-color: var(--accent-primary, #F97316);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
