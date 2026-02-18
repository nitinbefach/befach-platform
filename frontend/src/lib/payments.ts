// Payments — Mock Data, CRUD Helpers, localStorage Persistence

import type {
  PaymentRecord,
  PaymentSegment,
  PaymentFilters,
  SavedPaymentSource,
  GatewayConfig,
  BeneficiaryDetails,
  FXRate,
  FXHistoryPoint,
  RateAlert,
} from '@/types/payments';
import { calculateFees, getMethodConfig, MOCK_FX_RATES } from './paymentConstants';
import { safeStorage } from '@/lib/safeStorage';

// ─── Storage Keys ───────────────────────────────────────────────────────

const PAYMENTS_KEY = 'befach_payments';
const SOURCES_KEY = 'befach_payment_sources';
const GATEWAYS_KEY = 'befach_gateways';
const ALERTS_KEY = 'befach_rate_alerts';

// ─── (Demo data removed — user data only) ──────────────────────────────

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

export function getPayments(): PaymentRecord[] {
  return getFromStorage<PaymentRecord[]>(PAYMENTS_KEY, []);
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
  return getFromStorage<SavedPaymentSource[]>(SOURCES_KEY, []);
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
  return getFromStorage<GatewayConfig[]>(GATEWAYS_KEY, []);
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
