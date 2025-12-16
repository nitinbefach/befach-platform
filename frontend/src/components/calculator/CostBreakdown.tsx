'use client';

import React, { useState } from 'react';
import { CalculationResult, CalculationInput, formatCurrency, saveCalculation } from '@/utils/calculatorUtils';
import { generateLandedCostPDF } from '@/utils/pdfExport';
import CostPieChart from './charts/CostPieChart';
import WaterfallChart from './charts/WaterfallChart';
import styles from './CostBreakdown.module.css';
import {
  PieChart as PieChartIcon,
  BarChart3,
  Download,
  Save,
  Share2,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Package,
  Ship,
  Shield,
  Receipt,
  DollarSign,
  FileText,
  AlertCircle,
  Activity,
  Calculator
} from 'lucide-react';

interface CostBreakdownProps {
  result: CalculationResult;
  input: CalculationInput;
  onSave?: () => void;
}

export default function CostBreakdown({ result, input, onSave }: CostBreakdownProps) {
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    breakdown: true,
    duties: true,
    additional: false,
    percentages: false,
  });

  const [chartType, setChartType] = useState<'bar' | 'pie' | 'waterfall'>('bar');

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSaveCalculation = () => {
    saveCalculation({ ...result, input });
    if (onSave) onSave();
  };

  const handleExportPDF = () => {
    generateLandedCostPDF(input, result, {
      includeCharts: true,
      includeBreakdown: true,
      includeMetadata: true,
      companyName: 'BEFACH International'
    });
  };

  const handleShare = () => {
    // Create a shareable summary
    const summary = `Landed Cost Calculation:
Product: ${input.productName}
HSN Code: ${input.hsnCode}
FOB Value: ${formatCurrency(result.fobValue)}
Total Landed Cost: ${formatCurrency(result.totalLandedCost)}
Per Unit Cost: ${formatCurrency(result.landedCostPerUnit)}`;

    navigator.clipboard.writeText(summary);
    alert('Calculation summary copied to clipboard!');
  };

  // Calculate percentages for visualization - now using percentage of total
  const costComponents = [
    { name: 'FOB Value', value: result.fobValue, color: '#F97316', icon: Package },
    { name: 'Freight', value: result.freight, color: '#10B981', icon: Ship },
    { name: 'Insurance', value: result.insurance, color: '#3B82F6', icon: Shield },
    { name: 'Duties & Taxes', value: result.totalDuties, color: '#EF4444', icon: Receipt },
    { name: 'Additional Charges', value: result.totalAdditionalCharges, color: '#8B5CF6', icon: DollarSign },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Calculator className={styles.titleIcon} />
          Cost Breakdown
        </h2>
        <div className={styles.actionButtons}>
          <button
            onClick={handleSaveCalculation}
            className={styles.btnSave}
          >
            <Save size={16} />
            Save
          </button>
          <button
            onClick={handleExportPDF}
            className={styles.btnExport}
          >
            <Download size={16} />
            PDF
          </button>
          <button
            onClick={handleShare}
            className={styles.btnShare}
          >
            <Share2 size={16} />
            Share
          </button>
        </div>
      </div>

      {/* Summary Section */}
      <div className={styles.section}>
        <button
          onClick={() => toggleSection('summary')}
          className={styles.sectionHeader}
        >
          <h3 className={styles.sectionTitle}>
            <TrendingUp className={styles.sectionIcon} />
            Summary
          </h3>
          {expandedSections.summary ?
            <ChevronUp className={styles.chevron} /> :
            <ChevronDown className={styles.chevron} />
          }
        </button>
        {expandedSections.summary && (
          <div className={styles.summaryGrid}>
            <div className={`${styles.summaryCard} ${styles.summaryCardPrimary}`}>
              <div className={styles.summaryLabel}>Total Landed Cost</div>
              <div className={`${styles.summaryValue} ${styles.summaryValuePrimary}`}>
                {formatCurrency(result.totalLandedCost)}
              </div>
            </div>
            <div className={`${styles.summaryCard} ${styles.summaryCardSuccess}`}>
              <div className={styles.summaryLabel}>Cost Per Unit</div>
              <div className={`${styles.summaryValue} ${styles.summaryValueSuccess}`}>
                {formatCurrency(result.landedCostPerUnit)}
              </div>
              <div className={styles.summarySubtext}>Qty: {input.quantity}</div>
            </div>
            <div className={`${styles.summaryCard} ${styles.summaryCardDanger}`}>
              <div className={styles.summaryLabel}>Total Duties & Taxes</div>
              <div className={`${styles.summaryValue} ${styles.summaryValueDanger}`}>
                {formatCurrency(result.totalDuties)}
              </div>
              <div className={styles.summarySubtext}>
                {result.dutyPercentage.toFixed(1)}% of total
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Visual Cost Components */}
      <div className={styles.section}>
        <div className={styles.chartControls}>
          <h3 className={styles.chartTitle}>
            <BarChart3 className={styles.sectionIcon} />
            Cost Components Visualization
          </h3>

          {/* Chart Type Toggle */}
          <div className={styles.chartToggle}>
            <button
              onClick={() => setChartType('bar')}
              className={`${styles.chartToggleBtn} ${
                chartType === 'bar' ? styles.chartToggleBtnActive : ''
              }`}
            >
              <BarChart3 size={14} />
              Bar
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={`${styles.chartToggleBtn} ${
                chartType === 'pie' ? styles.chartToggleBtnActive : ''
              }`}
            >
              <PieChartIcon size={14} />
              Pie
            </button>
            <button
              onClick={() => setChartType('waterfall')}
              className={`${styles.chartToggleBtn} ${
                chartType === 'waterfall' ? styles.chartToggleBtnActive : ''
              }`}
            >
              <Activity size={14} />
              Waterfall
            </button>
          </div>
        </div>

        {/* Chart Display */}
        {chartType === 'bar' && (
          <div className={styles.barChart}>
            {costComponents.map((component) => {
              const Icon = component.icon;
              const percentage = (component.value / result.totalLandedCost) * 100;
              // Use percentage of total for bar width instead of max component
              const barWidth = percentage;

              return (
                <div key={component.name} className={styles.barItem}>
                  <div className={styles.barHeader}>
                    <div className={styles.barLabel}>
                      <Icon className={styles.barIcon} />
                      <span>{component.name}</span>
                    </div>
                    <div className={styles.barValue}>
                      <span className={styles.barAmount}>
                        {formatCurrency(component.value)}
                      </span>
                      <span className={styles.barPercentage}>
                        ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{
                        width: `${Math.max(barWidth, 2)}%`,
                        backgroundColor: component.color,
                      }}
                    >
                      {barWidth > 10 && (
                        <span className={styles.barFillLabel}>
                          {percentage.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {chartType === 'pie' && (
          <CostPieChart
            data={{
              fobValue: result.fobValue,
              freight: result.freight,
              insurance: result.insurance,
              totalDuties: result.totalDuties,
              totalAdditionalCharges: result.totalAdditionalCharges
            }}
            currency={result.currency}
          />
        )}

        {chartType === 'waterfall' && (
          <WaterfallChart
            data={result}
            currency={result.currency}
          />
        )}
      </div>

      {/* Detailed Breakdown Section */}
      <div className={styles.section}>
        <button
          onClick={() => toggleSection('breakdown')}
          className={styles.sectionHeader}
        >
          <h3 className={styles.sectionTitle}>
            <FileText className={styles.sectionIcon} />
            Detailed Breakdown
          </h3>
          {expandedSections.breakdown ?
            <ChevronUp className={styles.chevron} /> :
            <ChevronDown className={styles.chevron} />
          }
        </button>
        {expandedSections.breakdown && (
          <div className={styles.detailTable}>
            <table>
              <tbody>
                <tr>
                  <td className={styles.detailLabel}>FOB Value ({input.currency})</td>
                  <td className={styles.detailValue}>{formatCurrency(result.fobValue)}</td>
                </tr>
                <tr>
                  <td className={styles.detailLabel}>
                    Freight Charges
                    <span className={styles.detailSubtext}>({input.shippingMethod})</span>
                  </td>
                  <td className={styles.detailValue}>{formatCurrency(result.freight)}</td>
                </tr>
                <tr>
                  <td className={styles.detailLabel}>Marine Insurance</td>
                  <td className={styles.detailValue}>{formatCurrency(result.insurance)}</td>
                </tr>
                <tr className={styles.detailRowHighlight}>
                  <td className={styles.detailLabel}>CIF Value</td>
                  <td className={styles.detailValue}>{formatCurrency(result.cifValue)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Duties & Taxes Section */}
      <div className={styles.section}>
        <button
          onClick={() => toggleSection('duties')}
          className={styles.sectionHeader}
        >
          <h3 className={styles.sectionTitle}>
            <Receipt className={styles.sectionIcon} />
            Duties & Taxes
          </h3>
          {expandedSections.duties ?
            <ChevronUp className={styles.chevron} /> :
            <ChevronDown className={styles.chevron} />
          }
        </button>
        {expandedSections.duties && (
          <div className={styles.detailTable} style={{ background: 'rgba(239, 68, 68, 0.03)' }}>
            <table>
              <tbody>
                <tr>
                  <td className={styles.detailLabel}>
                    Basic Customs Duty (BCD)
                    <AlertCircle className={styles.iconSm} style={{ display: 'inline', marginLeft: '4px', width: '14px', height: '14px' }} />
                  </td>
                  <td className={styles.detailValue}>{formatCurrency(result.basicCustomsDuty)}</td>
                </tr>
                <tr>
                  <td className={styles.detailLabel}>
                    Social Welfare Surcharge
                    <span className={styles.detailSubtext}>(10% of BCD)</span>
                  </td>
                  <td className={styles.detailValue}>{formatCurrency(result.socialWelfareSurcharge)}</td>
                </tr>
                <tr>
                  <td className={styles.detailLabel}>
                    IGST
                    <span className={styles.detailSubtext}>(18% on assessable value)</span>
                  </td>
                  <td className={styles.detailValue}>{formatCurrency(result.igst)}</td>
                </tr>
                <tr className={styles.detailRowHighlight} style={{ background: 'rgba(239, 68, 68, 0.05)' }}>
                  <td className={styles.detailLabel}>Total Duties & Taxes</td>
                  <td className={styles.detailValue} style={{ color: '#ef4444' }}>
                    {formatCurrency(result.totalDuties)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Additional Charges Section */}
      <div className={styles.section}>
        <button
          onClick={() => toggleSection('additional')}
          className={styles.sectionHeader}
        >
          <h3 className={styles.sectionTitle}>
            <DollarSign className={styles.sectionIcon} />
            Additional Charges
          </h3>
          {expandedSections.additional ?
            <ChevronUp className={styles.chevron} /> :
            <ChevronDown className={styles.chevron} />
          }
        </button>
        {expandedSections.additional && (
          <div className={styles.detailTable} style={{ background: 'rgba(139, 92, 246, 0.03)' }}>
            <table>
              <tbody>
                <tr>
                  <td className={styles.detailLabel}>Port Charges</td>
                  <td className={styles.detailValue}>{formatCurrency(result.portCharges)}</td>
                </tr>
                <tr>
                  <td className={styles.detailLabel}>Customs Clearance</td>
                  <td className={styles.detailValue}>{formatCurrency(result.customsClearance)}</td>
                </tr>
                <tr>
                  <td className={styles.detailLabel}>Inland Transport</td>
                  <td className={styles.detailValue}>{formatCurrency(result.inlandTransport)}</td>
                </tr>
                <tr>
                  <td className={styles.detailLabel}>Other Charges</td>
                  <td className={styles.detailValue}>{formatCurrency(result.otherCharges)}</td>
                </tr>
                <tr className={styles.detailRowHighlight} style={{ background: 'rgba(139, 92, 246, 0.05)' }}>
                  <td className={styles.detailLabel}>Total Additional Charges</td>
                  <td className={styles.detailValue} style={{ color: '#8b5cf6' }}>
                    {formatCurrency(result.totalAdditionalCharges)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Percentage Breakdown */}
      <div className={styles.section}>
        <button
          onClick={() => toggleSection('percentages')}
          className={styles.sectionHeader}
        >
          <h3 className={styles.sectionTitle}>
            <PieChartIcon className={styles.sectionIcon} />
            Percentage Analysis
          </h3>
          {expandedSections.percentages ?
            <ChevronUp className={styles.chevron} /> :
            <ChevronDown className={styles.chevron} />
          }
        </button>
        {expandedSections.percentages && (
          <div className={styles.percentageGrid}>
            <div className={styles.percentageItem}>
              <div className={styles.percentageValue} style={{ color: '#F97316' }}>
                {((result.fobValue / result.totalLandedCost) * 100).toFixed(1)}%
              </div>
              <div className={styles.percentageLabel}>FOB Value</div>
            </div>
            <div className={styles.percentageItem}>
              <div className={styles.percentageValue} style={{ color: '#10B981' }}>
                {result.freightPercentage.toFixed(1)}%
              </div>
              <div className={styles.percentageLabel}>Freight</div>
            </div>
            <div className={styles.percentageItem}>
              <div className={styles.percentageValue} style={{ color: '#EF4444' }}>
                {result.dutyPercentage.toFixed(1)}%
              </div>
              <div className={styles.percentageLabel}>Duties</div>
            </div>
            <div className={styles.percentageItem}>
              <div className={styles.percentageValue} style={{ color: '#8B5CF6' }}>
                {result.additionalChargesPercentage.toFixed(1)}%
              </div>
              <div className={styles.percentageLabel}>Additional</div>
            </div>
          </div>
        )}
      </div>

      {/* Final Total */}
      <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '2px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>Total Landed Cost</div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
              {formatCurrency(result.totalLandedCost)}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Exchange Rate: 1 {input.currency} = ₹{result.exchangeRate.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Calculation Metadata */}
      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <div>Product: {input.productName} | HSN: {input.hsnCode}</div>
          <div>Calculated at: {new Date(result.calculatedAt).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}