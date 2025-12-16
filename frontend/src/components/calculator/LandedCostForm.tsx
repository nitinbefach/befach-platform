'use client';

import React, { useState, useEffect } from 'react';
import { CalculationInput, getAvailableCurrencies, getShippingMethods, searchHSNCodes, getDutyRates } from '@/utils/calculatorUtils';
import { Search, Calculator, Info, Package, Truck, CreditCard, RotateCcw } from 'lucide-react';
import styles from './LandedCostForm.module.css';

interface LandedCostFormProps {
  onCalculate: (input: CalculationInput) => void;
  initialValues?: Partial<CalculationInput>;
}

export default function LandedCostForm({ onCalculate, initialValues }: LandedCostFormProps) {
  const [formData, setFormData] = useState<CalculationInput>({
    productName: initialValues?.productName || '',
    hsnCode: initialValues?.hsnCode || '',
    quantity: initialValues?.quantity || 1,
    unitPrice: initialValues?.unitPrice || 0,
    fobValue: initialValues?.fobValue || 0,
    currency: initialValues?.currency || 'USD',
    weight: initialValues?.weight || 0,
    weightUnit: initialValues?.weightUnit || 'kg',
    shippingMethod: initialValues?.shippingMethod || 'sea',
    originCountry: initialValues?.originCountry || '',
    destinationCountry: initialValues?.destinationCountry || 'India',
    portOfLoading: initialValues?.portOfLoading || '',
    portOfDischarge: initialValues?.portOfDischarge || '',
    containerType: initialValues?.containerType || '',
    customFreight: initialValues?.customFreight || 0,
    customInsurance: initialValues?.customInsurance || 0,
    portCharges: initialValues?.portCharges || 0,
    customsClearance: initialValues?.customsClearance || 5000,
    inlandTransport: initialValues?.inlandTransport || 0,
    otherCharges: initialValues?.otherCharges || 0,
  });

  const [hsnSuggestions, setHsnSuggestions] = useState<any[]>([]);
  const [showHsnDropdown, setShowHsnDropdown] = useState(false);
  const [dutyInfo, setDutyInfo] = useState<{ bcd: number; igst: number; description: string } | null>(null);

  const currencies = getAvailableCurrencies();
  const shippingMethods = getShippingMethods();

  // Calculate FOB value when quantity or unit price changes
  useEffect(() => {
    const fobValue = formData.quantity * formData.unitPrice;
    setFormData(prev => ({ ...prev, fobValue }));
  }, [formData.quantity, formData.unitPrice]);

  // Update duty info when HSN code changes
  useEffect(() => {
    if (formData.hsnCode.length >= 2) {
      const rates = getDutyRates(formData.hsnCode);
      setDutyInfo(rates);
    } else {
      setDutyInfo(null);
    }
  }, [formData.hsnCode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['quantity', 'unitPrice', 'fobValue', 'weight', 'customFreight', 'customInsurance',
               'portCharges', 'customsClearance', 'inlandTransport', 'otherCharges'].includes(name)
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleHsnSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, hsnCode: value }));

    if (value.length >= 2) {
      const suggestions = searchHSNCodes(value);
      setHsnSuggestions(suggestions);
      setShowHsnDropdown(suggestions.length > 0);
    } else {
      setShowHsnDropdown(false);
    }
  };

  const selectHsnCode = (code: string, description: string) => {
    setFormData(prev => ({ ...prev, hsnCode: code }));
    setShowHsnDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(formData);
  };

  const handleReset = () => {
    setFormData({
      productName: '',
      hsnCode: '',
      quantity: 1,
      unitPrice: 0,
      fobValue: 0,
      currency: 'USD',
      weight: 0,
      weightUnit: 'kg',
      shippingMethod: 'sea',
      originCountry: '',
      destinationCountry: 'India',
      portOfLoading: '',
      portOfDischarge: '',
      containerType: '',
      customFreight: 0,
      customInsurance: 0,
      portCharges: 0,
      customsClearance: 5000,
      inlandTransport: 0,
      otherCharges: 0,
    });
    setDutyInfo(null);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.calculatorGrid}>
      {/* Left Column */}
      <div className={styles.leftColumn}>
        {/* Product Details Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Package className={styles.icon} />
            <h2 className={styles.cardTitle}>Product Details</h2>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Product Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="e.g., LED Bulbs"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              HSN Code <span className={styles.required}>*</span>
              {dutyInfo && (
                <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--accent-primary)' }}>
                  (BCD: {dutyInfo.bcd}%, IGST: {dutyInfo.igst}%)
                </span>
              )}
            </label>
            <div className={styles.inputWithIcon}>
              <input
                type="text"
                name="hsnCode"
                value={formData.hsnCode}
                onChange={handleHsnSearch}
                required
                className={styles.input}
                placeholder="Type to search..."
              />
              <Search className={`${styles.inputIcon} ${styles.iconSm}`} />
              {showHsnDropdown && (
                <div className={styles.hsnSuggestions}>
                  {hsnSuggestions.map((item, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => selectHsnCode(item.code, item.description)}
                      className={styles.hsnSuggestion}
                    >
                      <div>
                        <span className={styles.hsnCode}>{item.code}</span>
                        <span className={styles.hsnDescription}>{item.description}</span>
                      </div>
                      <div className={styles.hsnDuty}>
                        BCD: {item.dutyRate}%, IGST: {item.igstRate}%
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Quantity <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="1"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Unit Price</label>
              <div className={styles.inputGroup}>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className={styles.inputAddonSelect}
                >
                  {currencies.map(curr => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  name="unitPrice"
                  value={formData.unitPrice}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={`${styles.label} ${styles.labelWithIcon}`}>
              Total FOB Value
              <Info className={styles.iconSm} title="Free on Board value" />
            </label>
            <div className={styles.inputGroup}>
              <div className={styles.inputAddon}>{formData.currency}</div>
              <input
                type="number"
                name="fobValue"
                value={formData.fobValue}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="0.00"
                readOnly
                style={{ backgroundColor: 'var(--bg-tertiary)' }}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Weight</label>
            <div className={styles.inputGroup}>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="0"
              />
              <select
                name="weightUnit"
                value={formData.weightUnit}
                onChange={handleChange}
                className={styles.inputAddonSelect}
              >
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
                <option value="mt">ton</option>
              </select>
            </div>
          </div>
        </div>

        {/* Shipping Information Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Truck className={styles.icon} />
            <h2 className={styles.cardTitle}>Shipping Information</h2>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Shipping Method <span className={styles.required}>*</span>
            </label>
            <select
              name="shippingMethod"
              value={formData.shippingMethod}
              onChange={handleChange}
              required
              className={styles.select}
            >
              {shippingMethods.map(method => (
                <option key={method.value} value={method.value}>
                  {method.label} - {method.description}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Origin Country <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="originCountry"
              value={formData.originCountry}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="e.g., China"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Port of Loading</label>
            <input
              type="text"
              name="portOfLoading"
              value={formData.portOfLoading}
              onChange={handleChange}
              className={styles.input}
              placeholder="e.g., Shanghai"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Port of Discharge</label>
            <input
              type="text"
              name="portOfDischarge"
              value={formData.portOfDischarge}
              onChange={handleChange}
              className={styles.input}
              placeholder="e.g., Mumbai"
            />
          </div>

          {formData.shippingMethod === 'sea' && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Container Type</label>
              <select
                name="containerType"
                value={formData.containerType}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">Select container</option>
                <option value="20ft">20' Standard</option>
                <option value="40ft">40' Standard</option>
                <option value="40hc">40' High Cube</option>
                <option value="lcl">LCL (Less than Container)</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Right Column */}
      <div className={styles.rightColumn}>
        {/* Additional Costs Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <CreditCard className={styles.icon} />
            <h2 className={styles.cardTitle}>Additional Costs</h2>
            <span className={styles.optionalBadge}>Optional</span>
          </div>

          <p className={styles.helperText}>Leave blank for auto-calculation where applicable</p>

          <div className={styles.costsGrid}>
            <div className={styles.costRow}>
              <label className={`${styles.costLabel} ${styles.labelWithIcon}`}>
                Custom Freight (₹)
                <Info className={styles.iconSm} title="Override auto calculation" />
              </label>
              <input
                type="number"
                name="customFreight"
                value={formData.customFreight || ''}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={styles.costInput}
                placeholder="0"
              />
            </div>

            <div className={styles.costRow}>
              <label className={styles.costLabel}>Custom Insurance (₹)</label>
              <input
                type="number"
                name="customInsurance"
                value={formData.customInsurance || ''}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={styles.costInput}
                placeholder="0"
              />
            </div>

            <div className={styles.costRow}>
              <label className={styles.costLabel}>Port Charges (₹)</label>
              <input
                type="number"
                name="portCharges"
                value={formData.portCharges || ''}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={styles.costInput}
                placeholder="0"
              />
            </div>

            <div className={styles.costRow}>
              <label className={styles.costLabel}>Customs Clearance (₹)</label>
              <input
                type="number"
                name="customsClearance"
                value={formData.customsClearance}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={styles.costInput}
              />
            </div>

            <div className={styles.costRow}>
              <label className={styles.costLabel}>Inland Transport (₹)</label>
              <input
                type="number"
                name="inlandTransport"
                value={formData.inlandTransport || ''}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={styles.costInput}
                placeholder="0"
              />
            </div>

            <div className={styles.costRow}>
              <label className={styles.costLabel}>Other Charges (₹)</label>
              <input
                type="number"
                name="otherCharges"
                value={formData.otherCharges || ''}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={styles.costInput}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons Card */}
        <div className={`${styles.card} ${styles.buttonCard}`}>
          <button
            type="submit"
            disabled={!formData.productName || !formData.hsnCode || formData.fobValue <= 0}
            className={styles.btnPrimary}
          >
            <Calculator size={20} />
            Calculate Landed Cost
          </button>
          <button
            type="button"
            onClick={handleReset}
            className={styles.btnSecondary}
          >
            <RotateCcw size={16} />
            Reset Form
          </button>
        </div>
      </div>
    </form>
  );
}