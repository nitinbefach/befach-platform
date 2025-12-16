'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWizard } from '@/components/calculator/wizard/WizardProvider';
import WizardNavigation from '@/components/calculator/wizard/WizardNavigation';
import {
  getAvailableCurrencies,
  searchHSNCodes,
  getDutyRates,
} from '@/utils/calculatorUtils';
import { Package, Info, Search } from 'lucide-react';
import styles from './page.module.css';

export default function Step1ProductDetails() {
  const router = useRouter();
  const { formData, updateFormData, canProceed } = useWizard();

  const [hsnSuggestions, setHsnSuggestions] = useState<any[]>([]);
  const [showHsnDropdown, setShowHsnDropdown] = useState(false);
  const [dutyInfo, setDutyInfo] = useState<{ bcd: number; igst: number; description: string } | null>(null);

  const currencies = getAvailableCurrencies();

  // Calculate FOB value when quantity or unit price changes
  useEffect(() => {
    const fobValue = (formData.quantity || 0) * (formData.unitPrice || 0);
    updateFormData({ fobValue });
  }, [formData.quantity, formData.unitPrice]);

  // Update duty info when HSN code changes
  useEffect(() => {
    if (formData.hsnCode && formData.hsnCode.length >= 2) {
      const rates = getDutyRates(formData.hsnCode);
      setDutyInfo(rates);
    } else {
      setDutyInfo(null);
    }
  }, [formData.hsnCode]);

  const handleHsnSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateFormData({ hsnCode: value });

    if (value.length >= 2) {
      const suggestions = searchHSNCodes(value);
      setHsnSuggestions(suggestions);
      setShowHsnDropdown(suggestions.length > 0);
    } else {
      setShowHsnDropdown(false);
    }
  };

  const selectHsnCode = (code: string, description: string) => {
    updateFormData({ hsnCode: code });
    setShowHsnDropdown(false);
  };

  const handleNext = () => {
    if (canProceed(1)) {
      router.push('/cost-calculator/new/step-2');
    }
  };

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <Package className={styles.stepIcon} />
        <div>
          <h1 className={styles.stepTitle}>Product Details</h1>
          <p className={styles.stepDescription}>
            Enter basic information about the product you're importing
          </p>
        </div>
      </div>

      <div className={styles.formContent}>
        {/* Product Name */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Product Name <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            value={formData.productName || ''}
            onChange={(e) => updateFormData({ productName: e.target.value })}
            className={styles.input}
            placeholder="e.g., LED Bulbs, Solar Panels"
            required
          />
        </div>

        {/* HSN Code */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            HSN Code <span className={styles.required}>*</span>
            {dutyInfo && (
              <span className={styles.dutyInfo}>
                (BCD: {dutyInfo.bcd}%, IGST: {dutyInfo.igst}%)
              </span>
            )}
          </label>
          <div className={styles.inputWithIcon}>
            <input
              type="text"
              value={formData.hsnCode || ''}
              onChange={handleHsnSearch}
              className={styles.input}
              placeholder="Type to search HSN codes..."
              required
            />
            <Search className={styles.inputIcon} />

            {showHsnDropdown && (
              <div className={styles.hsnDropdown}>
                {hsnSuggestions.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectHsnCode(item.code, item.description)}
                    className={styles.hsnOption}
                  >
                    <div className={styles.hsnCode}>{item.code}</div>
                    <div className={styles.hsnDesc}>{item.description}</div>
                    <div className={styles.hsnRates}>
                      BCD: {item.dutyRate}%, IGST: {item.igstRate}%
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className={styles.helpText}>
            HSN code determines the customs duty rates for your product
          </div>
        </div>

        {/* Quantity and Unit Price Row */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Quantity <span className={styles.required}>*</span>
            </label>
            <input
              type="number"
              value={formData.quantity || ''}
              onChange={(e) => updateFormData({ quantity: parseInt(e.target.value) || 0 })}
              className={styles.input}
              placeholder="0"
              min="1"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Unit Price</label>
            <div className={styles.inputGroup}>
              <select
                value={formData.currency || 'USD'}
                onChange={(e) => updateFormData({ currency: e.target.value })}
                className={styles.selectAddon}
              >
                {currencies.map(curr => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={formData.unitPrice || ''}
                onChange={(e) => updateFormData({ unitPrice: parseFloat(e.target.value) || 0 })}
                className={styles.inputGroupField}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* FOB Value Display */}
        <div className={styles.calculatedField}>
          <div className={styles.calcLabel}>
            <span>Total FOB Value</span>
            <Info size={16} className={styles.infoIcon} title="Free on Board value" />
          </div>
          <div className={styles.calcValue}>
            {formData.currency} {((formData.fobValue || 0).toFixed(2))}
          </div>
          <div className={styles.calcSubtext}>
            This is the total value of your goods (Quantity × Unit Price)
          </div>
        </div>

        {/* Weight (Optional) */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Weight <span className={styles.optional}>(Optional)</span>
          </label>
          <div className={styles.inputGroup}>
            <input
              type="number"
              value={formData.weight || ''}
              onChange={(e) => updateFormData({ weight: parseFloat(e.target.value) || 0 })}
              className={styles.inputGroupField}
              placeholder="0"
              step="0.01"
              min="0"
            />
            <select
              value={formData.weightUnit || 'kg'}
              onChange={(e) => updateFormData({ weightUnit: e.target.value })}
              className={styles.selectAddon}
            >
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
              <option value="mt">MT</option>
            </select>
          </div>
          <div className={styles.helpText}>
            Weight helps calculate more accurate freight estimates
          </div>
        </div>
      </div>

      <WizardNavigation
        currentStep={1}
        totalSteps={4}
        canProceed={canProceed(1)}
        onNext={handleNext}
      />
    </div>
  );
}