// Payment Constants — Currencies, Method Configs, Status Colors

import type { PaymentMethodType, PaymentStatus, PaymentSegment } from '@/types/payments';

// ─── Currencies ─────────────────────────────────────────────────────────

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  flag: string;
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht', flag: '🇹🇭' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', flag: '🇲🇾' },
];

export const getCurrencyInfo = (code: string): CurrencyInfo =>
  CURRENCIES.find(c => c.code === code) || CURRENCIES[0];

export const formatPaymentCurrency = (amount: number, currencyCode: string): string => {
  const info = getCurrencyInfo(currencyCode);
  if (currencyCode === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return `${info.symbol}${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;
};

// ─── Payment Method Configs ─────────────────────────────────────────────

export interface MethodConfig {
  id: PaymentMethodType;
  label: string;
  description: string;
  icon: string;
  segment: PaymentSegment;
  feeRange: string;
  speed: string;
  feePercent: number;      // for fee calculation
  fixedFee: number;        // fixed fee in source currency
  estimatedDays: number;
}

export const PAYMENT_METHODS: MethodConfig[] = [
  // International methods
  {
    id: 'swift_wire',
    label: 'SWIFT Wire Transfer',
    description: 'Traditional bank-to-bank international transfer',
    icon: '',
    segment: 'international',
    feeRange: '$25–50',
    speed: '2–5 business days',
    feePercent: 0,
    fixedFee: 35,
    estimatedDays: 4,
  },
  {
    id: 'wise',
    label: 'Wise Business',
    description: 'Low-cost mid-market exchange rates, fast delivery',
    icon: '',
    segment: 'international',
    feeRange: '0.4–1.5%',
    speed: '1–2 business days',
    feePercent: 0.8,
    fixedFee: 0,
    estimatedDays: 2,
  },
  {
    id: 'paypal',
    label: 'PayPal Business',
    description: 'Widely accepted, instant to 1 day',
    icon: '',
    segment: 'international',
    feeRange: '2–4%',
    speed: 'Instant – 1 day',
    feePercent: 3,
    fixedFee: 0,
    estimatedDays: 1,
  },
  {
    id: 'letter_of_credit',
    label: 'Letter of Credit',
    description: 'Bank-guaranteed payment for high-value trade',
    icon: '',
    segment: 'international',
    feeRange: '1–3%',
    speed: '5–10 business days',
    feePercent: 2,
    fixedFee: 0,
    estimatedDays: 8,
  },
  {
    id: 'escrow',
    label: 'Escrow',
    description: 'Protected milestone payment — funds released on delivery',
    icon: '',
    segment: 'international',
    feeRange: '1–2%',
    speed: 'On milestone release',
    feePercent: 1.5,
    fixedFee: 0,
    estimatedDays: 0, // depends on milestone
  },
  // Local methods
  {
    id: 'upi',
    label: 'UPI',
    description: 'Instant bank-to-bank via UPI ID',
    icon: '',
    segment: 'local',
    feeRange: 'Free',
    speed: 'Instant',
    feePercent: 0,
    fixedFee: 0,
    estimatedDays: 0,
  },
  {
    id: 'neft_rtgs',
    label: 'NEFT / RTGS',
    description: 'Standard bank transfer within India',
    icon: '',
    segment: 'local',
    feeRange: 'Free – ₹25',
    speed: 'Same day',
    feePercent: 0,
    fixedFee: 15,
    estimatedDays: 1,
  },
  {
    id: 'razorpay',
    label: 'Razorpay',
    description: 'Pay via card, netbanking, or wallet',
    icon: '',
    segment: 'local',
    feeRange: '2%',
    speed: 'Instant',
    feePercent: 2,
    fixedFee: 0,
    estimatedDays: 0,
  },
  {
    id: 'cheque',
    label: 'Cheque',
    description: 'Traditional cheque payment (upload details)',
    icon: '',
    segment: 'local',
    feeRange: 'Free',
    speed: '3–5 business days',
    feePercent: 0,
    fixedFee: 0,
    estimatedDays: 4,
  },
];

export const getMethodConfig = (id: PaymentMethodType): MethodConfig =>
  PAYMENT_METHODS.find(m => m.id === id)!;

export const getMethodsForSegment = (segment: PaymentSegment): MethodConfig[] =>
  PAYMENT_METHODS.filter(m => m.segment === segment);

export const calculateFees = (amount: number, method: PaymentMethodType): number => {
  const config = getMethodConfig(method);
  return Math.round((amount * config.feePercent) / 100 + config.fixedFee);
};

export const getEstimatedArrival = (method: PaymentMethodType): string => {
  const config = getMethodConfig(method);
  if (config.estimatedDays === 0) return 'Instant';
  const arrival = new Date();
  arrival.setDate(arrival.getDate() + config.estimatedDays);
  return arrival.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

// ─── Status Colors ──────────────────────────────────────────────────────

export interface StatusStyle {
  bg: string;
  text: string;
  label: string;
}

export const STATUS_CONFIG: Record<PaymentStatus, StatusStyle> = {
  initiated: { bg: '#dbeafe', text: '#1e40af', label: 'Initiated' },
  processing: { bg: '#fef3c7', text: '#92400e', label: 'Processing' },
  completed: { bg: '#d1fae5', text: '#065f46', label: 'Completed' },
  failed: { bg: '#fee2e2', text: '#991b1b', label: 'Failed' },
  cancelled: { bg: '#f3f4f6', text: '#6b7280', label: 'Cancelled' },
  on_hold: { bg: '#ede9fe', text: '#5b21b6', label: 'On Hold' },
};

// ─── Compliance Text ────────────────────────────────────────────────────

export const COMPLIANCE_NOTICES = {
  international: 'This international payment is subject to FEMA (Foreign Exchange Management Act) regulations. All cross-border transactions are reported to the Reserve Bank of India. Ensure the payment purpose code is accurate.',
  local: 'This transaction is subject to applicable GST. A tax invoice will be generated for your records.',
};

// ─── Mock FX Rates (mid-market) ─────────────────────────────────────────

export const MOCK_FX_RATES: Record<string, number> = {
  'USD_INR': 83.45,
  'EUR_INR': 90.82,
  'GBP_INR': 105.67,
  'AED_INR': 22.72,
  'CNY_INR': 11.48,
  'JPY_INR': 0.558,
  'SGD_INR': 62.34,
  'THB_INR': 2.38,
  'MYR_INR': 17.89,
  'INR_USD': 0.01199,
  'INR_EUR': 0.01101,
  'INR_GBP': 0.00946,
};

export const getFXRate = (from: string, to: string): number => {
  if (from === to) return 1;
  const key = `${from}_${to}`;
  if (MOCK_FX_RATES[key]) return MOCK_FX_RATES[key];
  // Try reverse
  const reverseKey = `${to}_${from}`;
  if (MOCK_FX_RATES[reverseKey]) return 1 / MOCK_FX_RATES[reverseKey];
  return 1;
};

export const convertAmount = (amount: number, from: string, to: string): number => {
  return Math.round(amount * getFXRate(from, to) * 100) / 100;
};
