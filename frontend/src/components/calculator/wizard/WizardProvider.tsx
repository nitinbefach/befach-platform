'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CalculationInput } from '@/utils/calculatorUtils';

interface WizardContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  formData: Partial<CalculationInput>;
  updateFormData: (data: Partial<CalculationInput>) => void;
  resetFormData: () => void;
  canProceed: (step: number) => boolean;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CalculationInput>>({
    currency: 'USD',
    quantity: 1,
    unitPrice: 0,
    fobValue: 0,
    weight: 0,
    weightUnit: 'kg',
    shippingMethod: 'sea',
    destinationCountry: 'India',
    customsClearance: 5000,
    customFreight: 0,
    customInsurance: 0,
    portCharges: 0,
    inlandTransport: 0,
    otherCharges: 0,
  });

  const updateFormData = (data: Partial<CalculationInput>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const resetFormData = () => {
    setFormData({
      currency: 'USD',
      quantity: 1,
      unitPrice: 0,
      fobValue: 0,
      weight: 0,
      weightUnit: 'kg',
      shippingMethod: 'sea',
      destinationCountry: 'India',
      customsClearance: 5000,
      customFreight: 0,
      customInsurance: 0,
      portCharges: 0,
      inlandTransport: 0,
      otherCharges: 0,
    });
    setCurrentStep(1);
  };

  const canProceed = (step: number): boolean => {
    switch (step) {
      case 1: // Product Details
        return !!(
          formData.productName &&
          formData.hsnCode &&
          formData.quantity &&
          formData.quantity > 0 &&
          formData.unitPrice !== undefined &&
          formData.unitPrice >= 0
        );
      case 2: // Shipping Information
        return !!(
          formData.shippingMethod &&
          formData.originCountry
        );
      case 3: // Additional Costs - always can proceed (optional step)
        return true;
      case 4: // Review - can always proceed if reached
        return true;
      default:
        return false;
    }
  };

  return (
    <WizardContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        formData,
        updateFormData,
        resetFormData,
        canProceed,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}