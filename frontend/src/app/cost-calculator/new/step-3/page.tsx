'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaMoneyCheckAlt, FaInfoCircle, FaPlus, FaTrash, FaPercentage } from 'react-icons/fa';
import { useWizard } from '@/components/calculator/wizard/WizardProvider';
import WizardNavigation from '@/components/calculator/wizard/WizardNavigation';
import styles from './page.module.css';

interface CustomCharge {
  id: string;
  name: string;
  amount: string;
  type: 'fixed' | 'percentage';
}

const predefinedCharges = [
  { name: 'Customs Clearance', amount: '50', type: 'fixed' as const },
  { name: 'Port Handling', amount: '75', type: 'fixed' as const },
  { name: 'Documentation Fee', amount: '30', type: 'fixed' as const },
  { name: 'Inspection Charges', amount: '100', type: 'fixed' as const },
  { name: 'Warehouse Storage', amount: '25', type: 'fixed' as const },
  { name: 'Demurrage', amount: '0', type: 'fixed' as const },
];

export default function Step3AdditionalCostsPage() {
  const router = useRouter();
  const { formData, updateFormData, currentStep, setCurrentStep } = useWizard();

  const [packingCharges, setPackingCharges] = useState(formData.packingCharges || '');
  const [inlandFreight, setInlandFreight] = useState(formData.inlandFreight || '');
  const [bankCharges, setBankCharges] = useState(formData.bankCharges || '0.5');
  const [commissionRate, setCommissionRate] = useState(formData.commissionRate || '');
  const [customCharges, setCustomCharges] = useState<CustomCharge[]>(
    formData.customCharges || []
  );
  const [showAddCharge, setShowAddCharge] = useState(false);
  const [newChargeName, setNewChargeName] = useState('');
  const [newChargeAmount, setNewChargeAmount] = useState('');
  const [newChargeType, setNewChargeType] = useState<'fixed' | 'percentage'>('fixed');

  useEffect(() => {
    setCurrentStep(3);
  }, [setCurrentStep]);

  const handleAddPredefinedCharge = (charge: typeof predefinedCharges[0]) => {
    const newCharge: CustomCharge = {
      id: Date.now().toString(),
      name: charge.name,
      amount: charge.amount,
      type: charge.type,
    };
    setCustomCharges([...customCharges, newCharge]);
  };

  const handleAddCustomCharge = () => {
    if (!newChargeName || !newChargeAmount) return;

    const newCharge: CustomCharge = {
      id: Date.now().toString(),
      name: newChargeName,
      amount: newChargeAmount,
      type: newChargeType,
    };
    setCustomCharges([...customCharges, newCharge]);

    // Reset form
    setNewChargeName('');
    setNewChargeAmount('');
    setNewChargeType('fixed');
    setShowAddCharge(false);
  };

  const handleRemoveCharge = (id: string) => {
    setCustomCharges(customCharges.filter(charge => charge.id !== id));
  };

  const calculateTotalAdditional = () => {
    let total = 0;

    // Add fixed charges
    total += parseFloat(packingCharges || '0');
    total += parseFloat(inlandFreight || '0');

    // Add custom charges
    customCharges.forEach(charge => {
      if (charge.type === 'fixed') {
        total += parseFloat(charge.amount || '0');
      } else if (charge.type === 'percentage' && formData.fobValue) {
        const percentage = parseFloat(charge.amount || '0') / 100;
        total += parseFloat(formData.fobValue) * percentage;
      }
    });

    // Add percentage-based charges
    if (formData.fobValue) {
      const fobValue = parseFloat(formData.fobValue);
      total += fobValue * (parseFloat(bankCharges || '0') / 100);
      total += fobValue * (parseFloat(commissionRate || '0') / 100);
    }

    return total.toFixed(2);
  };

  const handleNext = () => {
    updateFormData({
      packingCharges,
      inlandFreight,
      bankCharges,
      commissionRate,
      customCharges,
      totalAdditionalCosts: calculateTotalAdditional(),
    });
    router.push('/cost-calculator/new/step-4');
  };

  const handleBack = () => {
    router.push('/cost-calculator/new/step-2');
  };

  const handleSkip = () => {
    updateFormData({
      packingCharges: '0',
      inlandFreight: '0',
      bankCharges: '0',
      commissionRate: '0',
      customCharges: [],
      totalAdditionalCosts: '0',
    });
    router.push('/cost-calculator/new/step-4');
  };

  return (
    <>
      <div className={styles.stepContainer}>
        <div className={styles.stepHeader}>
          <div className={styles.stepIcon}>
            <FaMoneyCheckAlt />
          </div>
          <div>
            <h1 className={styles.stepTitle}>Additional Costs</h1>
            <p className={styles.stepDescription}>
              Add any extra charges like packing, inland freight, or custom fees
            </p>
          </div>
        </div>

        <div className={styles.formContent}>
          {/* Standard Additional Costs */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Standard Charges</h3>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Packing Charges (USD) <span className={styles.optional}>(Optional)</span>
                </label>
                <input
                  type="number"
                  className={styles.input}
                  value={packingCharges}
                  onChange={(e) => setPackingCharges(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                />
                <div className={styles.helpText}>
                  Cost of packaging materials and labor
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Inland Freight (USD) <span className={styles.optional}>(Optional)</span>
                </label>
                <input
                  type="number"
                  className={styles.input}
                  value={inlandFreight}
                  onChange={(e) => setInlandFreight(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                />
                <div className={styles.helpText}>
                  Transportation from factory to port
                </div>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <FaPercentage className={styles.labelIcon} />
                  Bank Charges (%) <span className={styles.optional}>(Optional)</span>
                </label>
                <input
                  type="number"
                  className={styles.input}
                  value={bankCharges}
                  onChange={(e) => setBankCharges(e.target.value)}
                  placeholder="0.5"
                  step="0.01"
                  min="0"
                  max="5"
                />
                <div className={styles.helpText}>
                  Usually 0.5% - 1% of FOB value
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <FaPercentage className={styles.labelIcon} />
                  Commission Rate (%) <span className={styles.optional}>(Optional)</span>
                </label>
                <input
                  type="number"
                  className={styles.input}
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  max="10"
                />
                <div className={styles.helpText}>
                  Agent or broker commission if applicable
                </div>
              </div>
            </div>
          </div>

          {/* Quick Add Predefined Charges */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Quick Add Common Charges</h3>
            <div className={styles.quickAddGrid}>
              {predefinedCharges.map((charge) => (
                <button
                  key={charge.name}
                  type="button"
                  className={styles.quickAddBtn}
                  onClick={() => handleAddPredefinedCharge(charge)}
                >
                  <FaPlus className={styles.quickAddIcon} />
                  {charge.name}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Charges List */}
          {customCharges.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Added Charges</h3>
              <div className={styles.chargesList}>
                {customCharges.map((charge) => (
                  <div key={charge.id} className={styles.chargeItem}>
                    <div className={styles.chargeName}>{charge.name}</div>
                    <div className={styles.chargeAmount}>
                      {charge.type === 'percentage' ? (
                        <>{charge.amount}%</>
                      ) : (
                        <>${charge.amount}</>
                      )}
                    </div>
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => handleRemoveCharge(charge.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Custom Charge Form */}
          <div className={styles.section}>
            {!showAddCharge ? (
              <button
                type="button"
                className={styles.addCustomBtn}
                onClick={() => setShowAddCharge(true)}
              >
                <FaPlus /> Add Custom Charge
              </button>
            ) : (
              <div className={styles.addChargeForm}>
                <h3 className={styles.sectionTitle}>Add Custom Charge</h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Charge Name</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={newChargeName}
                      onChange={(e) => setNewChargeName(e.target.value)}
                      placeholder="e.g., Storage Fee"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Type</label>
                    <select
                      className={styles.input}
                      value={newChargeType}
                      onChange={(e) => setNewChargeType(e.target.value as 'fixed' | 'percentage')}
                    >
                      <option value="fixed">Fixed Amount</option>
                      <option value="percentage">Percentage of FOB</option>
                    </select>
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Amount {newChargeType === 'percentage' ? '(%)' : '(USD)'}
                    </label>
                    <input
                      type="number"
                      className={styles.input}
                      value={newChargeAmount}
                      onChange={(e) => setNewChargeAmount(e.target.value)}
                      placeholder={newChargeType === 'percentage' ? '0.00' : '0.00'}
                      step="0.01"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>&nbsp;</label>
                    <div className={styles.addChargeActions}>
                      <button
                        type="button"
                        className={styles.btnSave}
                        onClick={handleAddCustomCharge}
                      >
                        Add Charge
                      </button>
                      <button
                        type="button"
                        className={styles.btnCancel}
                        onClick={() => {
                          setShowAddCharge(false);
                          setNewChargeName('');
                          setNewChargeAmount('');
                          setNewChargeType('fixed');
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Total Summary */}
          <div className={styles.totalSummary}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>
                <FaInfoCircle className={styles.infoIcon} />
                Total Additional Costs
              </span>
              <span className={styles.totalAmount}>${calculateTotalAdditional()}</span>
            </div>
            <div className={styles.totalNote}>
              This will be added to your final landed cost calculation
            </div>
          </div>
        </div>
      </div>

      <WizardNavigation
        onNext={handleNext}
        onBack={handleBack}
        onSkip={handleSkip}
        canProceed={true} // Optional step, always can proceed
        showSkip={true}
      />
    </>
  );
}