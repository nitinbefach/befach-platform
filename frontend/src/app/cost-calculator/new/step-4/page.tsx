'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaCheckCircle, FaEdit, FaCalculator, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useWizard } from '@/components/calculator/wizard/WizardProvider';
import WizardNavigation from '@/components/calculator/wizard/WizardNavigation';
import { historyStorage } from '@/lib/historyStorage';
import calculatorService from '@/services/calculatorService';
import { CalculationInput, CalculationResult } from '@/types/calculator';
import styles from './page.module.css';

export default function Step4ReviewPage() {
  const router = useRouter();
  const { formData, currentStep, setCurrentStep } = useWizard();
  const [isCalculating, setIsCalculating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    setCurrentStep(4);
    validateData();
  }, [setCurrentStep]);

  const validateData = () => {
    const errors: string[] = [];

    // Check required fields from Step 1
    if (!formData.productName) errors.push('Product name is missing');
    if (!formData.hsnCode) errors.push('HSN code is missing');
    if (!formData.fobValue) errors.push('FOB value is missing');
    if (!formData.currency) errors.push('Currency is missing');

    // Check required fields from Step 2
    if (!formData.shippingMode) errors.push('Shipping mode is missing');
    if (!formData.originPort) errors.push('Origin port is missing');
    if (!formData.destinationPort) errors.push('Destination port is missing');
    if (!formData.freightCost) errors.push('Freight cost is missing');

    setValidationErrors(errors);
  };

  const handleCalculate = async () => {
    if (validationErrors.length > 0) {
      alert('Please complete all required fields before calculating.');
      return;
    }

    setIsCalculating(true);

    try {
      // Calculate result values
      const fobValue = parseFloat(formData.fobValue || '0');
      const freightCost = parseFloat(formData.freightCost || '0');
      const insuranceAmount = parseFloat(formData.insuranceAmount || '0');
      const additionalCosts = parseFloat(formData.totalAdditionalCosts || '0');
      const duty = calculateEstimatedDuty();
      const gst = calculateEstimatedGST();
      const cifValue = fobValue + freightCost + insuranceAmount;
      const totalLandedCost = calculateTotalLandedCost();

      // Calculate breakdown percentages
      const breakdownPercentages = {
        fob: (fobValue / totalLandedCost) * 100,
        freight: (freightCost / totalLandedCost) * 100,
        insurance: (insuranceAmount / totalLandedCost) * 100,
        duty: (duty / totalLandedCost) * 100,
        gst: (gst / totalLandedCost) * 100,
        additional: (additionalCosts / totalLandedCost) * 100,
      };

      // Prepare input data for API
      const calculationInput: CalculationInput = {
        productDetails: {
          productName: formData.productName || '',
          hsnCode: formData.hsnCode || '',
          fobValue: fobValue,
          currency: formData.currency || 'USD',
          weight: formData.weight ? parseFloat(formData.weight) : undefined,
          volume: formData.volume ? parseFloat(formData.volume) : undefined,
          units: formData.units ? parseInt(formData.units) : undefined,
          productDescription: formData.productDescription || '',
        },
        shippingDetails: {
          shippingMode: formData.shippingMode as 'air' | 'sea' | 'land' || 'sea',
          originPort: formData.originPort || '',
          destinationPort: formData.destinationPort || '',
          transitDays: formData.estimatedDays ? parseInt(formData.estimatedDays) : undefined,
          freightCost: freightCost,
          insuranceRequired: formData.insuranceRequired === 'yes' || formData.insuranceRequired === true,
          insuranceAmount: insuranceAmount,
        },
        additionalCosts: {
          packingCharges: formData.packingCharges ? parseFloat(formData.packingCharges) : 0,
          inlandFreight: formData.inlandFreight ? parseFloat(formData.inlandFreight) : 0,
          clearanceCharges: formData.clearanceCharges ? parseFloat(formData.clearanceCharges) : 0,
          bankCharges: formData.bankCharges ? parseFloat(formData.bankCharges) : 0,
          commissionRate: formData.commissionRate ? parseFloat(formData.commissionRate) : 0,
          customCharges: formData.customCharges || [],
        }
      };

      // Prepare result data for API
      const calculationResult: CalculationResult = {
        cifValue: {
          fobValue: fobValue,
          freight: freightCost,
          insurance: insuranceAmount,
          totalCif: cifValue,
        },
        duties: {
          dutyRate: formData.dutyRate ? parseFloat(formData.dutyRate) : 0,
          basicCustomsDuty: duty,
          socialWelfareSurcharge: duty * 0.10, // 10% of BCD
          igst: gst,
          totalDuty: duty + (duty * 0.10) + gst,
        },
        additionalCosts: {
          packingCharges: formData.packingCharges ? parseFloat(formData.packingCharges) : 0,
          inlandFreight: formData.inlandFreight ? parseFloat(formData.inlandFreight) : 0,
          clearanceCharges: formData.clearanceCharges ? parseFloat(formData.clearanceCharges) : 0,
          bankCharges: formData.bankCharges ? parseFloat(formData.bankCharges) : 0,
          commissionCharges: formData.commissionRate ? (fobValue * parseFloat(formData.commissionRate) / 100) : 0,
          customCharges: formData.customCharges || [],
          totalAdditional: additionalCosts,
        },
        totalCost: {
          landedCost: totalLandedCost,
          costBreakdown: breakdownPercentages,
        },
        metrics: {
          dutyAsPercentage: (duty / totalLandedCost) * 100,
          freightAsPercentage: (freightCost / totalLandedCost) * 100,
          savingsOpportunity: totalLandedCost * 0.05, // 5% potential savings
        }
      };

      // Save to backend API (with localStorage fallback)
      const savedRecord = await calculatorService.saveCalculation(calculationInput, calculationResult);

      // Also save to localStorage for redundancy (already handled in fallback)
      historyStorage.save({
        input: formData as any,
        result: {
          cifValue,
          customsDuty: duty,
          gst,
          totalLandedCost,
          breakdownPercentages,
        },
        metadata: {
          calculatedAt: new Date().toISOString(),
          isFavorite: false,
          tags: [],
        }
      });

      // Simulate calculation time for better UX
      setTimeout(() => {
        // Navigate to results page with calculation ID
        router.push(`/cost-calculator/results/${savedRecord.id}`);
      }, 1500);
    } catch (error) {
      console.error('Error during calculation:', error);
      setIsCalculating(false);
      alert('An error occurred while saving your calculation. Please try again.');
    }
  };

  const handleEdit = (step: number) => {
    router.push(`/cost-calculator/new/step-${step}`);
  };

  const handleBack = () => {
    router.push('/cost-calculator/new/step-3');
  };

  const formatCurrency = (value: string | number | undefined, currency = 'USD') => {
    if (!value) return '-';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(num);
  };

  const calculateEstimatedDuty = () => {
    if (!formData.fobValue || !formData.dutyRate) return 0;
    return (parseFloat(formData.fobValue) * parseFloat(formData.dutyRate)) / 100;
  };

  const calculateEstimatedGST = () => {
    if (!formData.fobValue) return 0;
    const fobValue = parseFloat(formData.fobValue);
    const duty = calculateEstimatedDuty();
    const assessableValue = fobValue + duty;
    return assessableValue * 0.18; // 18% GST
  };

  const calculateTotalLandedCost = () => {
    const fobValue = parseFloat(formData.fobValue || '0');
    const freightCost = parseFloat(formData.freightCost || '0');
    const insuranceAmount = parseFloat(formData.insuranceAmount || '0');
    const additionalCosts = parseFloat(formData.totalAdditionalCosts || '0');
    const duty = calculateEstimatedDuty();
    const gst = calculateEstimatedGST();

    return fobValue + freightCost + insuranceAmount + additionalCosts + duty + gst;
  };

  return (
    <>
      <div className={styles.stepContainer}>
        <div className={styles.stepHeader}>
          <div className={styles.stepIcon}>
            <FaCheckCircle />
          </div>
          <div>
            <h1 className={styles.stepTitle}>Review & Calculate</h1>
            <p className={styles.stepDescription}>
              Review all details and calculate your total landed cost
            </p>
          </div>
        </div>

        {validationErrors.length > 0 && (
          <div className={styles.errorAlert}>
            <FaExclamationTriangle className={styles.errorIcon} />
            <div>
              <div className={styles.errorTitle}>Missing Required Information</div>
              <ul className={styles.errorList}>
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className={styles.reviewContent}>
          {/* Product Details Section */}
          <div className={styles.reviewSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Product Details</h3>
              <button
                type="button"
                className={styles.editBtn}
                onClick={() => handleEdit(1)}
              >
                <FaEdit /> Edit
              </button>
            </div>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Product Name</span>
                <span className={styles.detailValue}>{formData.productName || '-'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>HSN Code</span>
                <span className={styles.detailValue}>{formData.hsnCode || '-'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>FOB Value</span>
                <span className={styles.detailValue}>
                  {formatCurrency(formData.fobValue, formData.currency || 'USD')}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Weight</span>
                <span className={styles.detailValue}>
                  {formData.weight ? `${formData.weight} kg` : '-'}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Basic Duty Rate</span>
                <span className={styles.detailValue}>
                  {formData.dutyRate ? `${formData.dutyRate}%` : '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Information Section */}
          <div className={styles.reviewSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Shipping Information</h3>
              <button
                type="button"
                className={styles.editBtn}
                onClick={() => handleEdit(2)}
              >
                <FaEdit /> Edit
              </button>
            </div>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Shipping Mode</span>
                <span className={styles.detailValue}>
                  {formData.shippingMode ? formData.shippingMode.toUpperCase() : '-'}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Origin Port</span>
                <span className={styles.detailValue}>{formData.originPort || '-'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Destination Port</span>
                <span className={styles.detailValue}>{formData.destinationPort || '-'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Transit Days</span>
                <span className={styles.detailValue}>
                  {formData.estimatedDays ? `${formData.estimatedDays} days` : '-'}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Freight Cost</span>
                <span className={styles.detailValue}>
                  {formatCurrency(formData.freightCost)}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Insurance</span>
                <span className={styles.detailValue}>
                  {formData.insuranceRequired
                    ? formatCurrency(formData.insuranceAmount)
                    : 'Not Required'}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Costs Section */}
          <div className={styles.reviewSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Additional Costs</h3>
              <button
                type="button"
                className={styles.editBtn}
                onClick={() => handleEdit(3)}
              >
                <FaEdit /> Edit
              </button>
            </div>
            {(!formData.totalAdditionalCosts || formData.totalAdditionalCosts === '0') ? (
              <div className={styles.noAdditional}>No additional costs added</div>
            ) : (
              <>
                <div className={styles.detailsGrid}>
                  {formData.packingCharges && formData.packingCharges !== '0' && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Packing Charges</span>
                      <span className={styles.detailValue}>
                        {formatCurrency(formData.packingCharges)}
                      </span>
                    </div>
                  )}
                  {formData.inlandFreight && formData.inlandFreight !== '0' && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Inland Freight</span>
                      <span className={styles.detailValue}>
                        {formatCurrency(formData.inlandFreight)}
                      </span>
                    </div>
                  )}
                  {formData.bankCharges && formData.bankCharges !== '0' && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Bank Charges</span>
                      <span className={styles.detailValue}>{formData.bankCharges}%</span>
                    </div>
                  )}
                  {formData.commissionRate && formData.commissionRate !== '0' && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Commission Rate</span>
                      <span className={styles.detailValue}>{formData.commissionRate}%</span>
                    </div>
                  )}
                </div>
                {formData.customCharges && formData.customCharges.length > 0 && (
                  <div className={styles.customChargesList}>
                    {formData.customCharges.map((charge: any, index: number) => (
                      <div key={index} className={styles.customCharge}>
                        <span>{charge.name}</span>
                        <span>
                          {charge.type === 'percentage'
                            ? `${charge.amount}%`
                            : formatCurrency(charge.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <div className={styles.additionalTotal}>
                  <span>Total Additional Costs</span>
                  <span>{formatCurrency(formData.totalAdditionalCosts)}</span>
                </div>
              </>
            )}
          </div>

          {/* Estimated Cost Breakdown */}
          <div className={styles.costBreakdown}>
            <h3 className={styles.breakdownTitle}>
              <FaCalculator className={styles.breakdownIcon} />
              Estimated Cost Breakdown
            </h3>
            <div className={styles.breakdownContent}>
              <div className={styles.breakdownItem}>
                <span>FOB Value</span>
                <span>{formatCurrency(formData.fobValue)}</span>
              </div>
              <div className={styles.breakdownItem}>
                <span>Freight Cost</span>
                <span>{formatCurrency(formData.freightCost)}</span>
              </div>
              <div className={styles.breakdownItem}>
                <span>Insurance</span>
                <span>{formatCurrency(formData.insuranceAmount || 0)}</span>
              </div>
              <div className={styles.breakdownItem}>
                <span>Additional Costs</span>
                <span>{formatCurrency(formData.totalAdditionalCosts || 0)}</span>
              </div>
              <div className={styles.breakdownDivider}></div>
              <div className={styles.breakdownItem}>
                <span>Estimated Customs Duty ({formData.dutyRate || 0}%)</span>
                <span>{formatCurrency(calculateEstimatedDuty())}</span>
              </div>
              <div className={styles.breakdownItem}>
                <span>Estimated GST (18%)</span>
                <span>{formatCurrency(calculateEstimatedGST())}</span>
              </div>
              <div className={styles.breakdownDivider}></div>
              <div className={styles.breakdownTotal}>
                <span>Total Landed Cost</span>
                <span>{formatCurrency(calculateTotalLandedCost())}</span>
              </div>
            </div>
            <div className={styles.disclaimer}>
              <FaInfoCircle className={styles.disclaimerIcon} />
              <span>
                This is an estimate based on the provided information. Actual costs may vary
                depending on current exchange rates, regulatory changes, and other factors.
              </span>
            </div>
          </div>
        </div>
      </div>

      <WizardNavigation
        onNext={handleCalculate}
        onBack={handleBack}
        canProceed={validationErrors.length === 0}
        isLastStep={true}
        isLoading={isCalculating}
      />
    </>
  );
}