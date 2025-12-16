'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaShip, FaPlane, FaTruck, FaInfoCircle, FaMapMarkerAlt, FaRoute, FaDollarSign } from 'react-icons/fa';
import { useWizard } from '@/components/calculator/wizard/WizardProvider';
import WizardNavigation from '@/components/calculator/wizard/WizardNavigation';
import styles from './page.module.css';

const shippingModes = [
  {
    id: 'sea',
    name: 'Sea Freight',
    icon: FaShip,
    description: '20-35 days',
    baseRate: 0.02, // per kg
  },
  {
    id: 'air',
    name: 'Air Freight',
    icon: FaPlane,
    description: '3-7 days',
    baseRate: 0.15, // per kg
  },
  {
    id: 'road',
    name: 'Road Transport',
    icon: FaTruck,
    description: '7-15 days',
    baseRate: 0.05, // per kg
  },
];

const commonPorts = {
  origin: [
    { code: 'SHA', name: 'Shanghai, China', country: 'CN' },
    { code: 'SZX', name: 'Shenzhen, China', country: 'CN' },
    { code: 'HKG', name: 'Hong Kong', country: 'HK' },
    { code: 'SIN', name: 'Singapore', country: 'SG' },
    { code: 'DXB', name: 'Dubai, UAE', country: 'AE' },
  ],
  destination: [
    { code: 'BOM', name: 'Mumbai (JNPT)', country: 'IN' },
    { code: 'DEL', name: 'Delhi (ICD)', country: 'IN' },
    { code: 'MAA', name: 'Chennai', country: 'IN' },
    { code: 'CCU', name: 'Kolkata', country: 'IN' },
    { code: 'BLR', name: 'Bangalore (ICD)', country: 'IN' },
  ],
};

export default function Step2ShippingPage() {
  const router = useRouter();
  const { formData, updateFormData, currentStep, setCurrentStep } = useWizard();

  const [shippingMode, setShippingMode] = useState(formData.shippingMode || 'sea');
  const [originPort, setOriginPort] = useState(formData.originPort || '');
  const [destinationPort, setDestinationPort] = useState(formData.destinationPort || '');
  const [estimatedDays, setEstimatedDays] = useState(formData.estimatedDays || '');
  const [freightCost, setFreightCost] = useState(formData.freightCost || '');
  const [insuranceRequired, setInsuranceRequired] = useState(formData.insuranceRequired || false);
  const [insuranceRate, setInsuranceRate] = useState(formData.insuranceRate || '0.5');

  const [searchOrigin, setSearchOrigin] = useState('');
  const [searchDestination, setSearchDestination] = useState('');
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);

  useEffect(() => {
    setCurrentStep(2);
  }, [setCurrentStep]);

  const handleModeSelect = (mode: string) => {
    setShippingMode(mode);
    const selectedMode = shippingModes.find(m => m.id === mode);
    if (selectedMode) {
      const days = mode === 'sea' ? '30' : mode === 'air' ? '5' : '10';
      setEstimatedDays(days);

      // Calculate estimated freight cost based on weight from step 1
      if (formData.weight) {
        const weight = parseFloat(formData.weight);
        const estimatedCost = (weight * selectedMode.baseRate * 100).toFixed(2);
        setFreightCost(estimatedCost);
      }
    }
  };

  const handleOriginSelect = (port: typeof commonPorts.origin[0]) => {
    setOriginPort(`${port.code} - ${port.name}`);
    setSearchOrigin(port.name);
    setShowOriginDropdown(false);
  };

  const handleDestinationSelect = (port: typeof commonPorts.destination[0]) => {
    setDestinationPort(`${port.code} - ${port.name}`);
    setSearchDestination(port.name);
    setShowDestinationDropdown(false);
  };

  const calculateInsuranceAmount = () => {
    if (!insuranceRequired || !formData.fobValue) return 0;
    const fobValue = parseFloat(formData.fobValue);
    const rate = parseFloat(insuranceRate) / 100;
    return (fobValue * 1.1 * rate).toFixed(2); // 110% of FOB value
  };

  const handleNext = () => {
    updateFormData({
      shippingMode,
      originPort,
      destinationPort,
      estimatedDays,
      freightCost,
      insuranceRequired,
      insuranceRate,
      insuranceAmount: calculateInsuranceAmount(),
    });
    router.push('/cost-calculator/new/step-3');
  };

  const handleBack = () => {
    router.push('/cost-calculator/new/step-1');
  };

  return (
    <>
      <div className={styles.stepContainer}>
        <div className={styles.stepHeader}>
          <div className={styles.stepIcon}>
            <FaShip />
          </div>
          <div>
            <h1 className={styles.stepTitle}>Shipping Information</h1>
            <p className={styles.stepDescription}>
              Select your shipping method and route details
            </p>
          </div>
        </div>

        <div className={styles.formContent}>
          {/* Shipping Mode Selection */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Shipping Mode <span className={styles.required}>*</span>
            </label>
            <div className={styles.modeGrid}>
              {shippingModes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    className={`${styles.modeCard} ${shippingMode === mode.id ? styles.modeCardActive : ''}`}
                    onClick={() => handleModeSelect(mode.id)}
                  >
                    <Icon className={styles.modeIcon} />
                    <div className={styles.modeName}>{mode.name}</div>
                    <div className={styles.modeDesc}>{mode.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Port Selection */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <FaMapMarkerAlt className={styles.labelIcon} />
                Origin Port <span className={styles.required}>*</span>
              </label>
              <div className={styles.portInputWrapper}>
                <input
                  type="text"
                  className={styles.input}
                  value={searchOrigin}
                  onChange={(e) => {
                    setSearchOrigin(e.target.value);
                    setShowOriginDropdown(true);
                  }}
                  onFocus={() => setShowOriginDropdown(true)}
                  placeholder="Select or search origin port"
                />
                {showOriginDropdown && (
                  <div className={styles.portDropdown}>
                    {commonPorts.origin
                      .filter(port =>
                        port.name.toLowerCase().includes(searchOrigin.toLowerCase()) ||
                        port.code.toLowerCase().includes(searchOrigin.toLowerCase())
                      )
                      .map((port) => (
                        <button
                          key={port.code}
                          type="button"
                          className={styles.portOption}
                          onClick={() => handleOriginSelect(port)}
                        >
                          <div className={styles.portCode}>{port.code}</div>
                          <div className={styles.portName}>{port.name}</div>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <FaRoute className={styles.labelIcon} />
                Destination Port <span className={styles.required}>*</span>
              </label>
              <div className={styles.portInputWrapper}>
                <input
                  type="text"
                  className={styles.input}
                  value={searchDestination}
                  onChange={(e) => {
                    setSearchDestination(e.target.value);
                    setShowDestinationDropdown(true);
                  }}
                  onFocus={() => setShowDestinationDropdown(true)}
                  placeholder="Select or search destination port"
                />
                {showDestinationDropdown && (
                  <div className={styles.portDropdown}>
                    {commonPorts.destination
                      .filter(port =>
                        port.name.toLowerCase().includes(searchDestination.toLowerCase()) ||
                        port.code.toLowerCase().includes(searchDestination.toLowerCase())
                      )
                      .map((port) => (
                        <button
                          key={port.code}
                          type="button"
                          className={styles.portOption}
                          onClick={() => handleDestinationSelect(port)}
                        >
                          <div className={styles.portCode}>{port.code}</div>
                          <div className={styles.portName}>{port.name}</div>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Transit Time and Freight Cost */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Estimated Transit Days <span className={styles.optional}>(Optional)</span>
              </label>
              <input
                type="number"
                className={styles.input}
                value={estimatedDays}
                onChange={(e) => setEstimatedDays(e.target.value)}
                placeholder="e.g., 30"
              />
              <div className={styles.helpText}>
                Typical transit time for {shippingMode} freight
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <FaDollarSign className={styles.labelIcon} />
                Freight Cost (USD) <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                className={styles.input}
                value={freightCost}
                onChange={(e) => setFreightCost(e.target.value)}
                placeholder="Enter freight charges"
                step="0.01"
              />
              <div className={styles.helpText}>
                Total freight charges including handling
              </div>
            </div>
          </div>

          {/* Insurance Section */}
          <div className={styles.insuranceSection}>
            <div className={styles.insuranceHeader}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={insuranceRequired}
                  onChange={(e) => setInsuranceRequired(e.target.checked)}
                  className={styles.checkbox}
                />
                <span>Marine Insurance Required</span>
              </label>
              <FaInfoCircle className={styles.infoIcon} title="Insurance is recommended for high-value shipments" />
            </div>

            {insuranceRequired && (
              <div className={styles.insuranceDetails}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Insurance Rate (%) <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    className={styles.input}
                    value={insuranceRate}
                    onChange={(e) => setInsuranceRate(e.target.value)}
                    placeholder="0.5"
                    step="0.01"
                    min="0"
                    max="5"
                  />
                  <div className={styles.helpText}>
                    Typically 0.3% - 0.7% of 110% FOB value
                  </div>
                </div>

                {formData.fobValue && (
                  <div className={styles.calculatedField}>
                    <div className={styles.calcLabel}>
                      Estimated Insurance Premium
                    </div>
                    <div className={styles.calcValue}>
                      ${calculateInsuranceAmount()}
                    </div>
                    <div className={styles.calcSubtext}>
                      Based on 110% of FOB value
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <WizardNavigation
        onNext={handleNext}
        onBack={handleBack}
        canProceed={!!shippingMode && !!originPort && !!destinationPort && !!freightCost}
      />
    </>
  );
}