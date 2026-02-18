/**
 * Orders data utilities for My Orders page.
 * Handles types, demo data, CRUD, filtering, and grouping.
 */

import { safeStorage } from './safeStorage';

// ── Types ──

export type OrderStatus = 'processing' | 'transit' | 'customs' | 'delivered';

export interface Order {
  id: string;
  product: string;
  supplier: string;
  value: string;
  qty: string;
  date: string;
  dateGroup: string;
  eta: string;
  status: OrderStatus;
  statusLabel: string;
  statusSub: string;
  stage: number; // 1=Placed, 2=Shipped, 3=Customs, 4=Delivered
  route: string;
  payment: string;
}

// ── Constants ──

export const STAGES = ['Placed', 'Shipped', 'Customs', 'Delivered'] as const;
const STORAGE_KEY = 'befach-orders';
let orderCounter = 1;

// ── Storage ──

export function getOrders(): Order[] {
  const data = safeStorage.getItem(STORAGE_KEY);
  if (data) {
    try { return JSON.parse(data); } catch { /* fall through */ }
  }
  return [];
}

export function saveOrders(orders: Order[]): void {
  safeStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

// ── Filtering ──

export function getOrderCounts(orders: Order[]) {
  const counts = { processing: 0, transit: 0, customs: 0, delivered: 0 };
  orders.forEach(o => counts[o.status]++);
  return {
    all: orders.length,
    ...counts,
  };
}

export function filterOrders(orders: Order[], filter: string, search: string): Order[] {
  return orders.filter(o => {
    const matchesFilter =
      filter === 'all' ||
      o.status === filter ||
      (filter === 'in_progress' && ['processing', 'transit', 'customs'].includes(o.status));
    const q = search.toLowerCase().trim();
    const matchesSearch = !q ||
      o.id.toLowerCase().includes(q) ||
      o.product.toLowerCase().includes(q) ||
      o.supplier.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });
}

export function groupByDate(orders: Order[]): Record<string, Order[]> {
  const groups: Record<string, Order[]> = {};
  orders.forEach(o => {
    if (!groups[o.dateGroup]) groups[o.dateGroup] = [];
    groups[o.dateGroup].push(o);
  });
  return groups;
}

// ── Create ──

export function nextOrderId(): string {
  return `ORD-${orderCounter++}`;
}

export function createOrder(fields: {
  product: string;
  supplier: string;
  qty: string;
  value: string;
  eta: string;
}): Order {
  const today = new Date();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const fullMonths = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const dateStr = `${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
  const dateGroupStr = `${fullMonths[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;

  return {
    id: nextOrderId(),
    product: fields.product || 'New Product',
    supplier: fields.supplier || 'New Supplier',
    value: fields.value || '$1,000',
    qty: fields.qty || '100 pcs',
    date: dateStr,
    dateGroup: dateGroupStr,
    eta: fields.eta || dateStr,
    status: 'processing',
    statusLabel: 'Processing',
    statusSub: 'Order confirmed, awaiting shipment',
    stage: 1,
    route: 'TBD',
    payment: 'Pending',
  };
}
