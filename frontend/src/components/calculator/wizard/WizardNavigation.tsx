'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Calculator, SkipForward } from 'lucide-react';
import styles from './WizardNavigation.module.css';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  onNext?: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  isLastStep?: boolean;
  isOptionalStep?: boolean;
  isLoading?: boolean;
}

export default function WizardNavigation({
  currentStep,
  totalSteps,
  canProceed,
  onNext,
  onBack,
  onSkip,
  isLastStep = false,
  isOptionalStep = false,
  isLoading = false,
}: WizardNavigationProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (currentStep > 1) {
      router.back();
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
  };

  return (
    <div className={styles.navigationContainer}>
      <div className={styles.navigationContent}>
        {/* Back Button */}
        {currentStep > 1 && (
          <button
            type="button"
            onClick={handleBack}
            className={styles.btnBack}
            disabled={isLoading}
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
        )}

        {/* Cancel Button for Step 1 */}
        {currentStep === 1 && (
          <button
            type="button"
            onClick={() => router.push('/cost-calculator')}
            className={styles.btnCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
        )}

        <div className={styles.rightButtons}>
          {/* Skip Button for Optional Steps */}
          {isOptionalStep && !isLastStep && (
            <button
              type="button"
              onClick={handleSkip}
              className={styles.btnSkip}
              disabled={isLoading}
            >
              <span>Skip this step</span>
              <SkipForward size={18} />
            </button>
          )}

          {/* Continue/Calculate Button */}
          {isLastStep ? (
            <button
              type="submit"
              className={styles.btnCalculate}
              disabled={!canProceed || isLoading}
            >
              {isLoading ? (
                <>
                  <span className={styles.spinner}></span>
                  <span>Calculating...</span>
                </>
              ) : (
                <>
                  <Calculator size={20} />
                  <span>Calculate Landed Cost</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className={styles.btnNext}
              disabled={!canProceed || isLoading}
            >
              <span>Continue</span>
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className={styles.mobileBottomBar}>
        <div className={styles.mobileNavigation}>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className={styles.mobileBack}
              disabled={isLoading}
            >
              <ArrowLeft size={20} />
            </button>
          )}

          <div className={styles.mobileStepIndicator}>
            {currentStep} / {totalSteps}
          </div>

          {isLastStep ? (
            <button
              type="submit"
              className={styles.mobileCalculate}
              disabled={!canProceed || isLoading}
            >
              {isLoading ? (
                <span className={styles.spinner}></span>
              ) : (
                <Calculator size={20} />
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className={styles.mobileNext}
              disabled={!canProceed || isLoading}
            >
              <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}