'use client';

import React from 'react';
import { Check } from 'lucide-react';
import styles from './WizardProgress.module.css';

interface Step {
  number: number;
  label: string;
  description?: string;
}

interface WizardProgressProps {
  currentStep: number;
  steps: Step[];
}

export default function WizardProgress({ currentStep, steps }: WizardProgressProps) {
  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressBar}>
        {steps.map((step, index) => {
          const isCompleted = step.number < currentStep;
          const isActive = step.number === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.number}>
              <div className={styles.stepWrapper}>
                <div
                  className={`${styles.step} ${
                    isCompleted ? styles.completed : ''
                  } ${isActive ? styles.active : ''}`}
                >
                  <div className={styles.stepCircle}>
                    {isCompleted ? (
                      <Check size={16} />
                    ) : (
                      <span className={styles.stepNumber}>{step.number}</span>
                    )}
                  </div>
                  <div className={styles.stepContent}>
                    <div className={styles.stepLabel}>{step.label}</div>
                    {step.description && (
                      <div className={styles.stepDescription}>{step.description}</div>
                    )}
                  </div>
                </div>
                {!isLast && (
                  <div
                    className={`${styles.connector} ${
                      isCompleted ? styles.connectorCompleted : ''
                    }`}
                  />
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile Progress Bar */}
      <div className={styles.mobileProgress}>
        <div className={styles.mobileBar}>
          <div
            className={styles.mobileBarFill}
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
        <div className={styles.mobileText}>
          Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.label}
        </div>
      </div>
    </div>
  );
}