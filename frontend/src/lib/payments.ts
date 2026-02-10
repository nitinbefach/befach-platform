// Payments — Mock Data, CRUD Helpers, localStorage Persistence

import type {
  PaymentRecord,
  PaymentStatus,
  PaymentSegment,
  PaymentFilters,
  SavedPaymentSource,
  GatewayConfig,
  BeneficiaryDetails,
  FXRate,
  FXHistoryPoint,
  RateAlert,
  PaymentTimelineEvent,
} from '@/types/payments';
import { calculateFees, getMethodConfig, MOCK_FX_RATES } from './paymentConstants';
import { safeStorage } from '@/lib/safeStorage';

// ─── Storage Keys ───────────────────────────────────────────────────────

const PAYMENTS_KEY = 'befach_payments';
const SOURCES_KEY = 'befach_payment_sources';
const GATEWAYS_KEY = 'befach_gateways';
const ALERTS_KEY = 'befach_rate_alerts';

// ─── Demo Payment Sources ───────────────────────────────────────────────

const DEMO_SOURCES: SavedPaymentSource[] = [
  {
    id: 'src-1',
    type: 'bank_account',
    label: 'HDFC Bank — Savings',
    bankName: 'HDFC Bank',
    accountNumber: '****4523',
    isDefault: true,
  },
  {
    id: 'src-2',
    type: 'bank_account',
    label: 'ICICI Bank — Current',
    bankName: 'ICICI Bank',
    accountNumber: '****8901',
    isDefault: false,
  },
  {
    id: 'src-3',
    type: 'upi',
    label: 'UPI — nitin@okaxis',
    upiId: 'nitin@okaxis',
    isDefault: false,
  },
];

// ─── Demo Gateways ──────────────────────────────────────────────────────

const DEMO_GATEWAYS: GatewayConfig[] = [
  {
    id: 'gw-wise',
    name: 'Wise Business',
    description: 'Low-cost international transfers with real exchange rates',
    icon: '💚',
    enabled: true,
    connected: true,
    connectedEmail: 'nitin@befach.com',
  },
  {
    id: 'gw-razorpay',
    name: 'Razorpay',
    description: 'Accept & send domestic payments via UPI, cards, netbanking',
    icon: '💳',
    enabled: true,
    connected: true,
    connectedEmail: 'payments@befach.com',
  },
  {
    id: 'gw-paypal',
    name: 'PayPal Business',
    description: 'Globally accepted payment platform',
    icon: '🅿️',
    enabled: false,
    connected: false,
  },
  {
    id: 'gw-stripe',
    name: 'Stripe Connect',
    description: 'Marketplace payments with 135+ currencies',
    icon: '💜',
    enabled: false,
    connected: false,
  },
  {
    id: 'gw-cashfree',
    name: 'Cashfree',
    description: 'Fast domestic payouts and UPI collections',
    icon: '🟢',
    enabled: false,
    connected: false,
  },
];

// ─── Demo Payment Records ───────────────────────────────────────────────

function createTimeline(status: PaymentStatus, createdAt: string): PaymentTimelineEvent[] {
  const created = new Date(createdAt);
  const events: PaymentTimelineEvent[] = [
    { timestamp: createdAt, status: 'initiated', description: 'Payment initiated' },
  ];

  if (['processing', 'completed', 'failed', 'on_hold'].includes(status)) {
    const d = new Date(created);
    d.setHours(d.getHours() + 2);
    events.push({ timestamp: d.toISOString(), status: 'processing', description: 'Payment is being processed by the gateway' });
  }

  if (status === 'completed') {
    const d = new Date(created);
    d.setDate(d.getDate() + 2);
    events.push({ timestamp: d.toISOString(), status: 'completed', description: 'Payment successfully delivered to beneficiary' });
  }

  if (status === 'failed') {
    const d = new Date(created);
    d.setDate(d.getDate() + 1);
    events.push({ timestamp: d.toISOString(), status: 'failed', description: 'Payment failed — insufficient funds or bank rejection' });
  }

  if (status === 'on_hold') {
    const d = new Date(created);
    d.setDate(d.getDate() + 1);
    events.push({ timestamp: d.toISOString(), status: 'on_hold', description: 'Payment on hold — compliance review in progress' });
  }

  return events;
}

const DEMO_PAYMENTS: PaymentRecord[] = [
  {
    id: 'PAY-2024-001',
    segment: 'international',
    status: 'completed',
    supplierId: 'sup-1',
    supplierName: 'Apex Trading Co.',
    supplierBankDetails: {
      accountName: 'Apex Trading Co. Ltd',
      bankName: 'Bank of China',
      accountNumber: '****7890',
      swiftCode: 'BKCHCNBJ',
      country: 'China',
      currency: 'USD',
    },
    amount: 12500,
    currency: 'USD',
    amountInINR: 1043125,
    fxRate: 83.45,
    method: 'wise',
    methodLabel: 'Wise Business',
    fees: 100,
    totalDebit: 1043225,
    purpose: 'Order payment — Organic Turmeric Powder (500kg)',
    orderId: 'ORD-2024-0847',
    invoiceNumber: 'INV-APX-2024-112',
    referenceNumber: 'BFP-INT-20241115-001',
    createdAt: '2024-11-15T10:30:00Z',
    estimatedArrival: '2024-11-17',
    completedAt: '2024-11-17T08:00:00Z',
    timeline: [],
  },
  {
    id: 'PAY-2024-002',
    segment: 'international',
    status: 'completed',
    supplierId: 'sup-2',
    supplierName: 'Global Spice Exports',
    supplierBankDetails: {
      accountName: 'Global Spice Exports Pte Ltd',
      bankName: 'DBS Bank',
      accountNumber: '****3456',
      swiftCode: 'DBSSSGSG',
      country: 'Singapore',
      currency: 'USD',
    },
    amount: 8750,
    currency: 'USD',
    amountInINR: 730187,
    fxRate: 83.45,
    method: 'swift_wire',
    methodLabel: 'SWIFT Wire Transfer',
    fees: 35,
    totalDebit: 730222,
    purpose: 'Order payment — Black Pepper Premium Grade',
    orderId: 'ORD-2024-0812',
    referenceNumber: 'BFP-INT-20241110-002',
    createdAt: '2024-11-10T14:00:00Z',
    estimatedArrival: '2024-11-14',
    completedAt: '2024-11-14T12:00:00Z',
    timeline: [],
  },
  {
    id: 'PAY-2024-003',
    segment: 'local',
    status: 'completed',
    supplierId: 'sup-3',
    supplierName: 'Kochi Cardamom Mills',
    supplierBankDetails: {
      accountName: 'Kochi Cardamom Mills Pvt Ltd',
      bankName: 'State Bank of India',
      accountNumber: '****6789',
      ifscCode: 'SBIN0001234',
      country: 'India',
      currency: 'INR',
    },
    amount: 325000,
    currency: 'INR',
    amountInINR: 325000,
    method: 'neft_rtgs',
    methodLabel: 'NEFT / RTGS',
    fees: 15,
    totalDebit: 325015,
    purpose: 'Advance payment — Cardamom green whole 200kg',
    orderId: 'ORD-2024-0790',
    referenceNumber: 'BFP-LOC-20241028-003',
    createdAt: '2024-10-28T09:15:00Z',
    estimatedArrival: '2024-10-28',
    completedAt: '2024-10-28T16:00:00Z',
    timeline: [],
  },
  {
    id: 'PAY-2024-004',
    segment: 'international',
    status: 'processing',
    supplierId: 'sup-4',
    supplierName: 'Vietnam Agri Export JSC',
    supplierBankDetails: {
      accountName: 'Vietnam Agri Export Joint Stock Co.',
      bankName: 'Vietcombank',
      accountNumber: '****2345',
      swiftCode: 'BFTVVNVX',
      country: 'Vietnam',
      currency: 'USD',
    },
    amount: 22000,
    currency: 'USD',
    amountInINR: 1835900,
    fxRate: 83.45,
    method: 'wise',
    methodLabel: 'Wise Business',
    fees: 176,
    totalDebit: 1836076,
    purpose: 'Order payment — Cashew kernels W320 (2 tons)',
    orderId: 'ORD-2024-0901',
    invoiceNumber: 'INV-VAE-2024-089',
    referenceNumber: 'BFP-INT-20241205-004',
    createdAt: '2024-12-05T11:00:00Z',
    estimatedArrival: '2024-12-07',
    timeline: [],
  },
  {
    id: 'PAY-2024-005',
    segment: 'local',
    status: 'completed',
    supplierName: 'Rajkot Groundnut Traders',
    supplierBankDetails: {
      accountName: 'Rajkot Groundnut Traders',
      bankName: 'Bank of Baroda',
      accountNumber: '****5678',
      ifscCode: 'BARB0RAJKOT',
      country: 'India',
      currency: 'INR',
    },
    amount: 180000,
    currency: 'INR',
    amountInINR: 180000,
    method: 'upi',
    methodLabel: 'UPI',
    fees: 0,
    totalDebit: 180000,
    purpose: 'Groundnut oil — bulk order Q4',
    referenceNumber: 'BFP-LOC-20241020-005',
    createdAt: '2024-10-20T08:45:00Z',
    estimatedArrival: '2024-10-20',
    completedAt: '2024-10-20T08:46:00Z',
    timeline: [],
  },
  {
    id: 'PAY-2024-006',
    segment: 'international',
    status: 'failed',
    supplierName: 'Dhaka Textiles Ltd',
    supplierBankDetails: {
      accountName: 'Dhaka Textiles Ltd',
      bankName: 'Sonali Bank',
      accountNumber: '****1122',
      swiftCode: 'BSONBDDH',
      country: 'Bangladesh',
      currency: 'USD',
    },
    amount: 5600,
    currency: 'USD',
    amountInINR: 467320,
    fxRate: 83.45,
    method: 'paypal',
    methodLabel: 'PayPal Business',
    fees: 168,
    totalDebit: 467488,
    purpose: 'Jute bag samples order',
    referenceNumber: 'BFP-INT-20241118-006',
    createdAt: '2024-11-18T15:30:00Z',
    estimatedArrival: '2024-11-19',
    timeline: [],
  },
  {
    id: 'PAY-2024-007',
    segment: 'local',
    status: 'processing',
    supplierName: 'Mumbai Packaging Solutions',
    supplierBankDetails: {
      accountName: 'Mumbai Packaging Solutions Pvt Ltd',
      bankName: 'Axis Bank',
      accountNumber: '****3344',
      ifscCode: 'UTIB0002345',
      country: 'India',
      currency: 'INR',
    },
    amount: 95000,
    currency: 'INR',
    amountInINR: 95000,
    method: 'razorpay',
    methodLabel: 'Razorpay',
    fees: 1900,
    totalDebit: 96900,
    purpose: 'Custom packaging for export consignment',
    orderId: 'ORD-2024-0875',
    referenceNumber: 'BFP-LOC-20241202-007',
    createdAt: '2024-12-02T12:20:00Z',
    estimatedArrival: '2024-12-02',
    timeline: [],
  },
  {
    id: 'PAY-2024-008',
    segment: 'international',
    status: 'on_hold',
    supplierName: 'Sri Lanka Tea Estates',
    supplierBankDetails: {
      accountName: 'Sri Lanka Tea Estates PLC',
      bankName: 'Commercial Bank of Ceylon',
      accountNumber: '****5566',
      swiftCode: 'CABORKLX',
      country: 'Sri Lanka',
      currency: 'USD',
    },
    amount: 15000,
    currency: 'USD',
    amountInINR: 1251750,
    fxRate: 83.45,
    method: 'escrow',
    methodLabel: 'Escrow',
    fees: 225,
    totalDebit: 1251975,
    purpose: 'Escrow deposit — Ceylon tea first shipment',
    referenceNumber: 'BFP-INT-20241125-008',
    createdAt: '2024-11-25T09:00:00Z',
    estimatedArrival: 'On milestone release',
    timeline: [],
  },
  {
    id: 'PAY-2024-009',
    segment: 'local',
    status: 'completed',
    supplierName: 'Nashik Grape Wines Co.',
    supplierBankDetails: {
      accountName: 'Nashik Grape Wines Co.',
      bankName: 'Kotak Mahindra Bank',
      accountNumber: '****7788',
      ifscCode: 'KKBK0000123',
      country: 'India',
      currency: 'INR',
    },
    amount: 450000,
    currency: 'INR',
    amountInINR: 450000,
    method: 'neft_rtgs',
    methodLabel: 'NEFT / RTGS',
    fees: 15,
    totalDebit: 450015,
    purpose: 'Grape concentrate — processing plant order',
    orderId: 'ORD-2024-0865',
    invoiceNumber: 'INV-NGW-2024-034',
    referenceNumber: 'BFP-LOC-20241105-009',
    createdAt: '2024-11-05T10:00:00Z',
    estimatedArrival: '2024-11-05',
    completedAt: '2024-11-05T17:00:00Z',
    timeline: [],
  },
  {
    id: 'PAY-2024-010',
    segment: 'international',
    status: 'completed',
    supplierName: 'Turkish Dried Fruits Corp',
    supplierBankDetails: {
      accountName: 'Turkish Dried Fruits Corp',
      bankName: 'Garanti BBVA',
      accountNumber: '****9900',
      swiftCode: 'TGBATRIS',
      iban: 'TR12 0006 2000 0000 0012 3456 78',
      country: 'Turkey',
      currency: 'EUR',
    },
    amount: 6800,
    currency: 'EUR',
    amountInINR: 617576,
    fxRate: 90.82,
    method: 'swift_wire',
    methodLabel: 'SWIFT Wire Transfer',
    fees: 35,
    totalDebit: 617611,
    purpose: 'Dried apricots & figs — bulk import',
    orderId: 'ORD-2024-0833',
    referenceNumber: 'BFP-INT-20241022-010',
    createdAt: '2024-10-22T13:00:00Z',
    estimatedArrival: '2024-10-26',
    completedAt: '2024-10-25T10:00:00Z',
    timeline: [],
  },
  {
    id: 'PAY-2024-011',
    segment: 'international',
    status: 'initiated',
    supplierName: 'Dubai Gold Spices FZE',
    supplierBankDetails: {
      accountName: 'Dubai Gold Spices FZE',
      bankName: 'Emirates NBD',
      accountNumber: '****4455',
      swiftCode: 'EABORUAE',
      country: 'UAE',
      currency: 'AED',
    },
    amount: 35000,
    currency: 'AED',
    amountInINR: 795200,
    fxRate: 22.72,
    method: 'wise',
    methodLabel: 'Wise Business',
    fees: 280,
    totalDebit: 795480,
    purpose: 'Saffron premium grade — 5kg order',
    referenceNumber: 'BFP-INT-20241208-011',
    createdAt: '2024-12-08T16:00:00Z',
    estimatedArrival: '2024-12-10',
    timeline: [],
  },
  {
    id: 'PAY-2024-012',
    segment: 'local',
    status: 'cancelled',
    supplierName: 'Jaipur Handicraft Exports',
    supplierBankDetails: {
      accountName: 'Jaipur Handicraft Exports',
      bankName: 'Punjab National Bank',
      accountNumber: '****6677',
      ifscCode: 'PUNB0123400',
      country: 'India',
      currency: 'INR',
    },
    amount: 120000,
    currency: 'INR',
    amountInINR: 120000,
    method: 'cheque',
    methodLabel: 'Cheque',
    fees: 0,
    totalDebit: 120000,
    purpose: 'Decorative brass items — cancelled by supplier',
    referenceNumber: 'BFP-LOC-20241112-012',
    createdAt: '2024-11-12T11:00:00Z',
    estimatedArrival: '2024-11-16',
    timeline: [],
  },
];

// Add timelines to each
DEMO_PAYMENTS.forEach(p => {
  p.timeline = createTimeline(p.status, p.createdAt);
});

// ─── localStorage CRUD ──────────────────────────────────────────────────

function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = safeStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  safeStorage.setItem(key, JSON.stringify(data));
}

// ─── Payments CRUD ──────────────────────────────────────────────────────

export function initializeDemoPayments(): void {
  if (typeof window === 'undefined') return;
  const existing = safeStorage.getItem(PAYMENTS_KEY);
  if (!existing) {
    saveToStorage(PAYMENTS_KEY, DEMO_PAYMENTS);
  }
  const existingSources = safeStorage.getItem(SOURCES_KEY);
  if (!existingSources) {
    saveToStorage(SOURCES_KEY, DEMO_SOURCES);
  }
  const existingGateways = safeStorage.getItem(GATEWAYS_KEY);
  if (!existingGateways) {
    saveToStorage(GATEWAYS_KEY, DEMO_GATEWAYS);
  }
}

export function getPayments(): PaymentRecord[] {
  initializeDemoPayments();
  return getFromStorage<PaymentRecord[]>(PAYMENTS_KEY, DEMO_PAYMENTS);
}

export function getPaymentById(id: string): PaymentRecord | undefined {
  return getPayments().find(p => p.id === id);
}

export function createPayment(data: Omit<PaymentRecord, 'id' | 'referenceNumber' | 'timeline' | 'createdAt'>): PaymentRecord {
  const payments = getPayments();
  const num = payments.length + 1;
  const segPrefix = data.segment === 'international' ? 'INT' : 'LOC';
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');

  const payment: PaymentRecord = {
    ...data,
    id: `PAY-2024-${String(num).padStart(3, '0')}`,
    referenceNumber: `BFP-${segPrefix}-${dateStr}-${String(num).padStart(3, '0')}`,
    createdAt: now.toISOString(),
    timeline: [
      { timestamp: now.toISOString(), status: 'initiated', description: 'Payment initiated' },
    ],
  };

  payments.unshift(payment);
  saveToStorage(PAYMENTS_KEY, payments);
  return payment;
}

export function filterPayments(payments: PaymentRecord[], filters: PaymentFilters): PaymentRecord[] {
  return payments.filter(p => {
    if (filters.segment && filters.segment !== 'all' && p.segment !== filters.segment) return false;
    if (filters.status && filters.status !== 'all' && p.status !== filters.status) return false;
    if (filters.currency && filters.currency !== 'all' && p.currency !== filters.currency) return false;

    if (filters.dateRange && filters.dateRange !== 'all') {
      const days = parseInt(filters.dateRange);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      if (new Date(p.createdAt) < cutoff) return false;
    }

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      if (
        !p.supplierName.toLowerCase().includes(q) &&
        !p.referenceNumber.toLowerCase().includes(q) &&
        !p.id.toLowerCase().includes(q) &&
        !(p.purpose || '').toLowerCase().includes(q)
      ) return false;
    }

    return true;
  });
}

// ─── Payment Sources CRUD ───────────────────────────────────────────────

export function getPaymentSources(): SavedPaymentSource[] {
  initializeDemoPayments();
  return getFromStorage<SavedPaymentSource[]>(SOURCES_KEY, DEMO_SOURCES);
}

export function addPaymentSource(source: SavedPaymentSource): void {
  const sources = getPaymentSources();
  if (source.isDefault) sources.forEach(s => (s.isDefault = false));
  sources.push(source);
  saveToStorage(SOURCES_KEY, sources);
}

export function removePaymentSource(id: string): void {
  const sources = getPaymentSources().filter(s => s.id !== id);
  saveToStorage(SOURCES_KEY, sources);
}

// ─── Gateways CRUD ──────────────────────────────────────────────────────

export function getGateways(): GatewayConfig[] {
  initializeDemoPayments();
  return getFromStorage<GatewayConfig[]>(GATEWAYS_KEY, DEMO_GATEWAYS);
}

export function toggleGateway(id: string): void {
  const gateways = getGateways();
  const gw = gateways.find(g => g.id === id);
  if (gw) {
    gw.enabled = !gw.enabled;
    saveToStorage(GATEWAYS_KEY, gateways);
  }
}

// ─── Rate Alerts CRUD ───────────────────────────────────────────────────

export function getRateAlerts(): RateAlert[] {
  return getFromStorage<RateAlert[]>(ALERTS_KEY, []);
}

export function addRateAlert(alert: RateAlert): void {
  const alerts = getRateAlerts();
  alerts.push(alert);
  saveToStorage(ALERTS_KEY, alerts);
}

export function removeRateAlert(id: string): void {
  const alerts = getRateAlerts().filter(a => a.id !== id);
  saveToStorage(ALERTS_KEY, alerts);
}

// ─── FX Rates & History ─────────────────────────────────────────────────

export function getFXRateComparison(from: string, to: string, amount: number): FXRate {
  const key = `${from}_${to}`;
  const mid = MOCK_FX_RATES[key] || (1 / (MOCK_FX_RATES[`${to}_${from}`] || 1));

  return {
    from,
    to,
    midMarket: mid,
    wiseRate: mid * 0.997,       // ~0.3% markup
    paypalRate: mid * 0.985,     // ~1.5% markup
    bankRate: mid * 0.978,       // ~2.2% markup
    updatedAt: new Date().toISOString(),
  };
}

export function generateFXHistory(from: string, to: string, days: number): FXHistoryPoint[] {
  const key = `${from}_${to}`;
  const baseRate = MOCK_FX_RATES[key] || (1 / (MOCK_FX_RATES[`${to}_${from}`] || 1));
  const points: FXHistoryPoint[] = [];
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    // Random walk simulation with slight upward trend
    const variance = (Math.random() - 0.48) * baseRate * 0.008;
    const trend = (days - i) * baseRate * 0.00005;
    const rate = baseRate + variance + trend - (days * baseRate * 0.00005 / 2);
    points.push({
      date: date.toISOString().slice(0, 10),
      rate: Math.round(rate * 10000) / 10000,
    });
  }
  return points;
}

// ─── Stats Helpers ──────────────────────────────────────────────────────

export function getPaymentStats(payments: PaymentRecord[]) {
  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const thisMonth = payments.filter(
    p => new Date(p.createdAt) >= thirtyDaysAgo && p.status === 'completed'
  );

  const pending = payments.filter(
    p => p.status === 'initiated' || p.status === 'processing'
  );

  const completedPayments = payments.filter(p => p.status === 'completed' && p.completedAt);
  let avgDays = 0;
  if (completedPayments.length > 0) {
    const totalDays = completedPayments.reduce((sum, p) => {
      const created = new Date(p.createdAt).getTime();
      const completed = new Date(p.completedAt!).getTime();
      return sum + (completed - created) / (1000 * 60 * 60 * 24);
    }, 0);
    avgDays = Math.round((totalDays / completedPayments.length) * 10) / 10;
  }

  return {
    totalPaidThisMonth: thisMonth.reduce((sum, p) => sum + p.amountInINR, 0),
    pendingCount: pending.length,
    pendingValue: pending.reduce((sum, p) => sum + p.amountInINR, 0),
    avgProcessingDays: avgDays,
  };
}

// ─── Export CSV ──────────────────────────────────────────────────────────

export function exportPaymentsCSV(payments: PaymentRecord[]): void {
  const headers = ['Payment ID', 'Date', 'Supplier', 'Amount', 'Currency', 'INR Equivalent', 'Method', 'Status', 'Reference', 'Purpose'];
  const rows = payments.map(p => [
    p.id,
    new Date(p.createdAt).toLocaleDateString(),
    p.supplierName,
    p.amount,
    p.currency,
    p.amountInINR,
    p.methodLabel,
    p.status,
    p.referenceNumber,
    p.purpose,
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `befach-payments-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
