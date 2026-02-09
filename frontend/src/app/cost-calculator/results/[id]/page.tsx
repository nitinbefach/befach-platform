'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FaCheckCircle,
  FaDownload,
  FaPrint,
  FaShare,
  FaCalculator,
  FaArrowLeft,
  FaRedo,
  FaChartPie,
  FaMoneyBillWave,
  FaShip,
  FaExclamationCircle
} from 'react-icons/fa';
import { historyStorage, type CalculationRecord } from '@/lib/historyStorage';
import calculatorService from '@/services/calculatorService';
import styles from './page.module.css';

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const [calculation, setCalculation] = useState<CalculationRecord | null>(null);
  const [loading, setLoading] = useState(true);

  // Convert API record format to legacy format for backward compatibility
  const convertAPIToLegacy = (apiRecord: any): CalculationRecord => {
    return {
      id: apiRecord.id,
      version: apiRecord.version || 1,
      input: {
        productName: apiRecord.input.productDetails.productName,
        hsnCode: apiRecord.input.productDetails.hsnCode,
        fobValue: apiRecord.input.productDetails.fobValue.toString(),
        currency: apiRecord.input.productDetails.currency,
        weight: apiRecord.input.productDetails.weight?.toString(),
        dutyRate: apiRecord.result.duties.dutyRate.toString(),
        shippingMode: apiRecord.input.shippingDetails.shippingMode,
        originPort: apiRecord.input.shippingDetails.originPort,
        destinationPort: apiRecord.input.shippingDetails.destinationPort,
        estimatedDays: apiRecord.input.shippingDetails.transitDays?.toString(),
        freightCost: apiRecord.input.shippingDetails.freightCost.toString(),
        insuranceRequired: apiRecord.input.shippingDetails.insuranceRequired,
        insuranceAmount: apiRecord.input.shippingDetails.insuranceAmount?.toString(),
        packingCharges: apiRecord.input.additionalCosts.packingCharges?.toString(),
        inlandFreight: apiRecord.input.additionalCosts.inlandFreight?.toString(),
        customCharges: apiRecord.input.additionalCosts.customCharges,
        totalAdditionalCosts: apiRecord.result.additionalCosts.totalAdditional?.toString() || '0'
      },
      result: {
        cifValue: apiRecord.result.cifValue.totalCif,
        customsDuty: apiRecord.result.duties.basicCustomsDuty,
        gst: apiRecord.result.duties.igst,
        totalLandedCost: apiRecord.result.totalCost.landedCost,
        breakdownPercentages: apiRecord.result.totalCost.costBreakdown || {}
      },
      metadata: apiRecord.metadata
    };
  };

  useEffect(() => {
    const fetchCalculation = async () => {
      try {
        // Try fetching from API first
        const apiRecord = await calculatorService.getCalculationById(params.id as string);

        if (apiRecord) {
          // Convert API format to legacy format for display
          const convertedRecord = convertAPIToLegacy(apiRecord);
          setCalculation(convertedRecord);
        } else {
          // If not found in API, try localStorage
          const localRecord = historyStorage.get(params.id as string);
          if (localRecord) {
            setCalculation(localRecord);
          }
        }
      } catch (error) {
        console.error('Error fetching calculation from API, falling back to localStorage:', error);
        // Fallback to localStorage on error
        const localRecord = historyStorage.get(params.id as string);
        if (localRecord) {
          setCalculation(localRecord);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCalculation();
  }, [params.id]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading calculation results...</div>
      </div>
    );
  }

  if (!calculation || !calculation.result) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <FaExclamationCircle className={styles.notFoundIcon} />
          <h2>Calculation Not Found</h2>
          <p>This calculation could not be found or has expired.</p>
          <Link href="/cost-calculator" className={styles.btnPrimary}>
            Start New Calculation
          </Link>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: string | number | undefined, currency = 'USD') => {
    if (!value) return '$0.00';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(num);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!calculation?.result) return;
    // Generate CSV specific to this calculation
    const csvContent = `
Product Details
Product Name,${calculation.input.productName}
HSN Code,${calculation.input.hsnCode}
FOB Value,${formatCurrency(calculation.input.fobValue, calculation.input.currency)}
Weight,${calculation.input.weight ? calculation.input.weight + ' kg' : 'N/A'}
Duty Rate,${calculation.input.dutyRate}%

Shipping Information
Mode,${calculation.input.shippingMode.toUpperCase()}
Origin,${calculation.input.originPort}
Destination,${calculation.input.destinationPort}
Transit Days,${calculation.input.estimatedDays || 'N/A'}
Freight Cost,${formatCurrency(calculation.input.freightCost)}
Insurance,${calculation.input.insuranceRequired ? formatCurrency(calculation.input.insuranceAmount) : 'Not Required'}

Cost Breakdown
FOB Value,${formatCurrency(calculation.input.fobValue)}
Freight Cost,${formatCurrency(calculation.input.freightCost)}
Insurance,${formatCurrency(calculation.input.insuranceAmount || 0)}
Additional Costs,${formatCurrency(calculation.input.totalAdditionalCosts || 0)}
CIF Value,${formatCurrency(calculation.result.cifValue)}
Customs Duty,${formatCurrency(calculation.result.customsDuty)}
GST (18%),${formatCurrency(calculation.result.gst)}
Total Landed Cost,${formatCurrency(calculation.result.totalLandedCost)}

Calculated on: ${new Date(calculation.metadata.calculatedAt).toLocaleString()}
    `.trim();

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cost-calculation-${calculation.id}.csv`;
    a.click();
  };

  const costBreakdown = [
    { label: 'FOB Value', value: parseFloat(calculation.input.fobValue), color: '#3b82f6' },
    { label: 'Freight', value: parseFloat(calculation.input.freightCost), color: '#10b981' },
    { label: 'Insurance', value: parseFloat(calculation.input.insuranceAmount || '0'), color: '#f59e0b' },
    { label: 'Additional', value: parseFloat(calculation.input.totalAdditionalCosts || '0'), color: '#8b5cf6' },
    { label: 'Duty', value: calculation.result.customsDuty, color: '#ef4444' },
    { label: 'GST', value: calculation.result.gst, color: '#ec4899' },
  ];

  const total = calculation.result.totalLandedCost;

  return (
    <div className={styles.container}>
      {/* Success Header */}
      <div className={styles.successHeader}>
        <div className={styles.successIcon}>
          <FaCheckCircle />
        </div>
        <h1 className={styles.successTitle}>Calculation Complete!</h1>
        <p className={styles.successSubtitle}>
          Your import cost calculation has been successfully generated
        </p>
        <div className={styles.calculatedDate}>
          Calculated on: {new Date(calculation.metadata.calculatedAt).toLocaleString()}
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionBar}>
        <Link href="/cost-calculator" className={styles.actionBtn}>
          <FaArrowLeft /> Back to Calculator
        </Link>
        <Link href="/cost-calculator" className={styles.actionBtn}>
          <FaRedo /> New Calculation
        </Link>
        <button onClick={handlePrint} className={styles.actionBtn}>
          <FaPrint /> Print
        </button>
        <button onClick={handleDownload} className={styles.actionBtn}>
          <FaDownload /> Download CSV
        </button>
      </div>

      {/* Main Results Container */}
      <div className={styles.resultsGrid}>
        {/* Summary Card */}
        <div className={styles.summaryCard}>
          <div className={styles.cardHeader}>
            <FaMoneyBillWave className={styles.cardIcon} />
            <h2 className={styles.cardTitle}>Total Landed Cost</h2>
          </div>
          <div className={styles.totalCost}>
            {formatCurrency(total)}
          </div>
          <div className={styles.productInfo}>
            <div className={styles.productName}>{calculation.input.productName}</div>
            <div className={styles.hsnCode}>HSN: {calculation.input.hsnCode}</div>
          </div>
          <div className={styles.quickStats}>
            <div className={styles.stat}>
              <span>CIF Value</span>
              <span>{formatCurrency(calculation.result.cifValue)}</span>
            </div>
            <div className={styles.stat}>
              <span>Total Duty & Tax</span>
              <span>{formatCurrency(calculation.result.customsDuty + calculation.result.gst)}</span>
            </div>
            <div className={styles.stat}>
              <span>% of FOB</span>
              <span>{((total / parseFloat(calculation.input.fobValue) - 1) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Cost Breakdown Chart */}
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <FaChartPie className={styles.cardIcon} />
            <h2 className={styles.cardTitle}>Cost Distribution</h2>
          </div>
          <div className={styles.chartContainer}>
            <div className={styles.barChart}>
              {costBreakdown.map((item, index) => {
                const percentage = (item.value / total) * 100;
                return (
                  <div key={index} className={styles.barItem}>
                    <div className={styles.barLabel}>
                      <span>{item.label}</span>
                      <span>{formatCurrency(item.value)}</span>
                    </div>
                    <div className={styles.barBackground}>
                      <div
                        className={styles.barFill}
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                    <div className={styles.barPercentage}>
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className={styles.breakdownCard}>
          <div className={styles.cardHeader}>
            <FaCalculator className={styles.cardIcon} />
            <h2 className={styles.cardTitle}>Detailed Calculation</h2>
          </div>
          <div className={styles.breakdownTable}>
            <div className={styles.breakdownSection}>
              <h3>Base Costs</h3>
              <div className={styles.breakdownRow}>
                <span>FOB Value ({calculation.input.currency})</span>
                <span>{formatCurrency(calculation.input.fobValue)}</span>
              </div>
              <div className={styles.breakdownRow}>
                <span>Ocean/Air Freight</span>
                <span>{formatCurrency(calculation.input.freightCost)}</span>
              </div>
              {calculation.input.insuranceRequired && (
                <div className={styles.breakdownRow}>
                  <span>Marine Insurance</span>
                  <span>{formatCurrency(calculation.input.insuranceAmount)}</span>
                </div>
              )}
              <div className={styles.breakdownRowTotal}>
                <span>CIF Value</span>
                <span>{formatCurrency(calculation.result.cifValue)}</span>
              </div>
            </div>

            {calculation.input.totalAdditionalCosts && calculation.input.totalAdditionalCosts !== '0' && (
              <div className={styles.breakdownSection}>
                <h3>Additional Costs</h3>
                {calculation.input.packingCharges && calculation.input.packingCharges !== '0' && (
                  <div className={styles.breakdownRow}>
                    <span>Packing Charges</span>
                    <span>{formatCurrency(calculation.input.packingCharges)}</span>
                  </div>
                )}
                {calculation.input.inlandFreight && calculation.input.inlandFreight !== '0' && (
                  <div className={styles.breakdownRow}>
                    <span>Inland Freight</span>
                    <span>{formatCurrency(calculation.input.inlandFreight)}</span>
                  </div>
                )}
                {calculation.input.customCharges && calculation.input.customCharges.map((charge: any, index: number) => (
                  <div key={index} className={styles.breakdownRow}>
                    <span>{charge.name}</span>
                    <span>
                      {charge.type === 'percentage'
                        ? formatCurrency((parseFloat(calculation.input.fobValue) * parseFloat(charge.amount)) / 100)
                        : formatCurrency(charge.amount)}
                    </span>
                  </div>
                ))}
                <div className={styles.breakdownRowTotal}>
                  <span>Total Additional</span>
                  <span>{formatCurrency(calculation.input.totalAdditionalCosts)}</span>
                </div>
              </div>
            )}

            <div className={styles.breakdownSection}>
              <h3>Duties & Taxes</h3>
              <div className={styles.breakdownRow}>
                <span>Basic Customs Duty ({calculation.input.dutyRate}%)</span>
                <span>{formatCurrency(calculation.result.customsDuty)}</span>
              </div>
              <div className={styles.breakdownRow}>
                <span>Integrated GST (18%)</span>
                <span>{formatCurrency(calculation.result.gst)}</span>
              </div>
              <div className={styles.breakdownRowTotal}>
                <span>Total Duty & Tax</span>
                <span>{formatCurrency(calculation.result.customsDuty + calculation.result.gst)}</span>
              </div>
            </div>

            <div className={styles.grandTotal}>
              <span>Total Landed Cost</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Details */}
        <div className={styles.shippingCard}>
          <div className={styles.cardHeader}>
            <FaShip className={styles.cardIcon} />
            <h2 className={styles.cardTitle}>Shipping Details</h2>
          </div>
          <div className={styles.shippingDetails}>
            <div className={styles.shippingRow}>
              <span>Mode</span>
              <span className={styles.badge}>
                {calculation.input.shippingMode.toUpperCase()}
              </span>
            </div>
            <div className={styles.shippingRow}>
              <span>Origin</span>
              <span>{calculation.input.originPort}</span>
            </div>
            <div className={styles.shippingRow}>
              <span>Destination</span>
              <span>{calculation.input.destinationPort}</span>
            </div>
            {calculation.input.estimatedDays && (
              <div className={styles.shippingRow}>
                <span>Transit Time</span>
                <span>{calculation.input.estimatedDays} days</span>
              </div>
            )}
            {calculation.input.weight && (
              <div className={styles.shippingRow}>
                <span>Weight</span>
                <span>{calculation.input.weight} kg</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className={styles.tipsSection}>
        <h3>
          <FaExclamationCircle /> Important Notes
        </h3>
        <ul>
          <li>This calculation is an estimate based on the information provided</li>
          <li>Actual costs may vary due to exchange rate fluctuations</li>
          <li>Additional charges may apply based on specific port regulations</li>
          <li>GST credit may be available for registered businesses</li>
        </ul>
      </div>
    </div>
  );
}