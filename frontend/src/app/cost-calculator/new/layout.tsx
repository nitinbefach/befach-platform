'use client';

import { AppLayout } from '@/components/layout';
import { WizardProvider } from '@/components/calculator/wizard/WizardProvider';
import WizardProgress from '@/components/calculator/wizard/WizardProgress';
import Link from 'next/link';
import { Home } from 'lucide-react';
import styles from './layout.module.css';

const wizardSteps = [
  { number: 1, label: 'Product Details', description: 'Basic information' },
  { number: 2, label: 'Shipping', description: 'Method & routes' },
  { number: 3, label: 'Additional Costs', description: 'Optional charges' },
  { number: 4, label: 'Review', description: 'Confirm & calculate' },
];

export default function WizardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get current step from URL
  const getCurrentStep = () => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.includes('/step-1')) return 1;
      if (path.includes('/step-2')) return 2;
      if (path.includes('/step-3')) return 3;
      if (path.includes('/review')) return 4;
      return 1;
    }
    return 1;
  };

  return (
    <AppLayout searchPlaceholder="Search products...">
      <WizardProvider>
        <div className={styles.wizardContainer}>
          {/* Breadcrumb */}
          <div className={styles.breadcrumb}>
            <Link href="/cost-calculator" className={styles.breadcrumbLink}>
              <Home size={16} />
              <span>Cost Calculator</span>
            </Link>
            <span className={styles.separator}>/</span>
            <span className={styles.current}>New Calculation</span>
          </div>

          {/* Progress Indicator */}
          <WizardProgress currentStep={getCurrentStep()} steps={wizardSteps} />

          {/* Content */}
          <div className={styles.wizardContent}>
            {children}
          </div>
        </div>
      </WizardProvider>
    </AppLayout>
  );
}