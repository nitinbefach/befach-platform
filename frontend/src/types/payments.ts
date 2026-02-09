// Payments — Type Definitions

// ─── Enums & Literal Types ─────────────────────────────────────────────

export type PaymentSegment = 'international' | 'local';

export type PaymentStatus =
  | 'initiated'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'on_hold';

export type InternationalMethod =
  | 'swift_wire'
  | 'wise'
  | 'paypal'
  | 'letter_of_credit'
  | 'escrow';

export type LocalMethod =
  | 'upi'
  | 'neft_rtgs'
  | 'razorpay'
  | 'cheque';

export type PaymentMethodType = InternationalMethod | LocalMethod;

// ─── Core Interfaces ────────────────────────────────────────────────────

export interface BeneficiaryDetails {
  accountName: string;
  bankName: string;
  accountNumber: string;
  ifscCode?: string;       // local (India)
  swiftCode?: string;      // international
  iban?: string;            // international
  upiId?: string;          // UPI
  country: string;
  currency: string;
}

export interface PaymentTimelineEvent {
  timestamp: string;
  status: string;
  description: string;
}

export interface PaymentRecord {
  id: string;
  segment: PaymentSegment;
  status: PaymentStatus;

  // Supplier info
  supplierId?: string;
  supplierName: string;
  supplierBankDetails: BeneficiaryDetails;

  // Amount
  amount: number;
  currency: string;
  amountInINR: number;
  fxRate?: number;

  // Method & fees
  method: PaymentMethodType;
  methodLabel: string;
  fees: number;
  totalDebit: number;

  // References
  purpose: string;
  orderId?: string;
  invoiceNumber?: string;
  referenceNumber: string;

  // Timeline
  createdAt: string;
  estimatedArrival: string;
  completedAt?: string;

  // Tracking
  timeline: PaymentTimelineEvent[];
}

// ─── Saved Sources & Methods ────────────────────────────────────────────

export interface SavedPaymentSource {
  id: string;
  type: 'bank_account' | 'upi' | 'card';
  label: string;
  bankName?: string;
  accountNumber?: string;  // masked
  upiId?: string;
  cardLast4?: string;
  isDefault: boolean;
}

export interface GatewayConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  connected: boolean;
  connectedEmail?: string;
}

// ─── FX Rates ───────────────────────────────────────────────────────────

export interface FXRate {
  from: string;
  to: string;
  midMarket: number;
  wiseRate: number;
  paypalRate: number;
  bankRate: number;
  updatedAt: string;
}

export interface FXHistoryPoint {
  date: string;
  rate: number;
}

export interface RateAlert {
  id: string;
  from: string;
  to: string;
  targetRate: number;
  direction: 'above' | 'below';
  createdAt: string;
  active: boolean;
}

// ─── Filters ────────────────────────────────────────────────────────────

export interface PaymentFilters {
  segment?: PaymentSegment | 'all';
  status?: PaymentStatus | 'all';
  dateRange?: '30' | '90' | '365' | 'all';
  currency?: string | 'all';
  searchQuery?: string;
}

// ─── Make Payment Form ──────────────────────────────────────────────────

export interface MakePaymentFormData {
  // Step 1
  segment: PaymentSegment;
  supplierId?: string;
  supplierName: string;
  manualEntry: boolean;
  beneficiary: BeneficiaryDetails;
  amount: string;
  currency: string;
  purpose: string;
  orderId?: string;
  invoiceNumber?: string;

  // Step 2
  method: PaymentMethodType | '';

  // Step 3 — computed from above
}
