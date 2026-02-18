/**
 * Booking Storage Layer
 * Class-based localStorage CRUD for freight bookings (mirrors historyStorage.ts pattern)
 */

import {
  BookingRecord,
  BookingSegment,
  BookingStatus,
  BookingFilters,
  InternationalBookingData,
  LocalBookingData,
  BookingQuote,
} from '@/types/booking';
import { safeStorage } from '@/lib/safeStorage';

const STORAGE_KEY = 'befach-bookings-v1';

class BookingStorage {
  private storageKey: string;

  constructor() {
    this.storageKey = STORAGE_KEY;
  }

  // ─── Private Helpers ───────────────────────────────────────────────

  private getRawData(): BookingRecord[] {
    try {
      const data = safeStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveRawData(data: BookingRecord[]): void {
    try {
      safeStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        const trimmed = data.slice(-500);
        safeStorage.setItem(this.storageKey, JSON.stringify(trimmed));
      }
    }
  }

  private generateRefNumber(segment: BookingSegment): string {
    const prefix = segment === 'international' ? 'BF-INTL' : 'BF-LOCAL';
    const num = Math.floor(10000 + Math.random() * 90000);
    return `${prefix}-${num}`;
  }

  // ─── CRUD ──────────────────────────────────────────────────────────

  save(
    segment: BookingSegment,
    data: InternationalBookingData | LocalBookingData,
    selectedQuote: BookingQuote,
  ): BookingRecord {
    const records = this.getRawData();
    const now = new Date().toISOString();

    const newRecord: BookingRecord = {
      id: Date.now().toString(),
      segment,
      status: 'confirmed',
      data,
      selectedQuote,
      referenceNumber: this.generateRefNumber(segment),
      createdAt: now,
      updatedAt: now,
    };

    records.unshift(newRecord);

    if (records.length > 500) records.splice(500);

    this.saveRawData(records);
    return newRecord;
  }

  get(id: string): BookingRecord | null {
    return this.getRawData().find(r => r.id === id) || null;
  }

  getAll(filters?: BookingFilters): BookingRecord[] {
    let data = this.getRawData();

    if (filters?.segment) {
      data = data.filter(r => r.segment === filters.segment);
    }
    if (filters?.status) {
      data = data.filter(r => r.status === filters.status);
    }
    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      data = data.filter(r => {
        const ref = r.referenceNumber.toLowerCase();
        const carrier = r.selectedQuote.carrier.toLowerCase();
        return ref.includes(q) || carrier.includes(q);
      });
    }

    return data;
  }

  updateStatus(id: string, status: BookingStatus): void {
    const data = this.getRawData();
    const idx = data.findIndex(r => r.id === id);
    if (idx !== -1) {
      data[idx].status = status;
      data[idx].updatedAt = new Date().toISOString();
      this.saveRawData(data);
    }
  }

  delete(id: string): void {
    const data = this.getRawData().filter(r => r.id !== id);
    this.saveRawData(data);
  }

  // ─── Stats ─────────────────────────────────────────────────────────

  getStats() {
    const data = this.getRawData();
    const intl = data.filter(r => r.segment === 'international');
    const local = data.filter(r => r.segment === 'local');

    return {
      total: data.length,
      international: intl.length,
      local: local.length,
      confirmed: data.filter(r => r.status === 'confirmed').length,
      inTransit: data.filter(r => r.status === 'in_transit').length,
      delivered: data.filter(r => r.status === 'delivered').length,
      totalSpendUSD: intl.reduce((sum, r) => sum + r.selectedQuote.price, 0),
      totalSpendINR: local.reduce((sum, r) => sum + r.selectedQuote.price, 0),
    };
  }

}

export const bookingStorage = new BookingStorage();
