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

const STORAGE_KEY = 'befach-bookings-v1';

class BookingStorage {
  private storageKey: string;

  constructor() {
    this.storageKey = STORAGE_KEY;
  }

  // ─── Private Helpers ───────────────────────────────────────────────

  private getRawData(): BookingRecord[] {
    try {
      if (typeof window === 'undefined') return [];
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveRawData(data: BookingRecord[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        const trimmed = data.slice(-500);
        localStorage.setItem(this.storageKey, JSON.stringify(trimmed));
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

  // ─── Demo Data ─────────────────────────────────────────────────────

  generateDemoBookings(): void {
    const existing = this.getRawData();
    if (existing.length > 0) return; // Don't overwrite

    const now = new Date();

    const demoRecords: BookingRecord[] = [
      {
        id: 'demo-1',
        segment: 'international',
        status: 'in_transit',
        data: {
          originPort: 'SHA', destinationPort: 'BOM', freightMode: 'fcl',
          containerType: '40ft_std', containerQty: 2, shippingDate: '2026-02-15',
          commodity: 'Electronics Components', hsCode: '8542.31', weight: '12000', volume: '45',
          packages: 48, hazardous: false, specialNotes: '',
          selectedQuoteId: 'demo-q1',
          shipper: { name: 'Chen Wei', company: 'Shanghai Tech Parts Ltd', address: '88 Pudong Ave, Shanghai', phone: '+86-21-5555-1234', email: 'chen@techparts.cn' },
          consignee: { name: 'Rajesh Kumar', company: 'Befach Trading Pvt Ltd', address: '45 BKC, Mumbai 400051', phone: '+91-9876543210', email: 'rajesh@befach.com' },
          incoterm: 'CIF', instructions: 'Handle with care - sensitive electronics',
        } as InternationalBookingData,
        selectedQuote: { id: 'demo-q1', carrier: 'Maersk', logo: '🚢', price: 5640, currency: 'USD', transitDays: 22, serviceType: 'Standard', validUntil: '2026-02-28', rating: 4.7, breakdown: { base: 4800, fuel: 400, port: 240, handling: 200 } },
        referenceNumber: 'BF-INTL-27341',
        createdAt: new Date(now.getTime() - 8 * 86400000).toISOString(),
        updatedAt: new Date(now.getTime() - 2 * 86400000).toISOString(),
      },
      {
        id: 'demo-2',
        segment: 'international',
        status: 'confirmed',
        data: {
          originPort: 'SIN', destinationPort: 'MAA', freightMode: 'lcl',
          containerType: '20ft_std', containerQty: 1, shippingDate: '2026-02-22',
          commodity: 'Industrial Chemicals', hsCode: '2933.69', weight: '3500', volume: '8',
          packages: 12, hazardous: true, specialNotes: 'UN 1993 — Class 3 flammable liquid',
          selectedQuoteId: 'demo-q2',
          shipper: { name: 'Lee Tan', company: 'SG Chemicals Pte Ltd', address: '12 Tanjong Pagar, Singapore', phone: '+65-9123-4567', email: 'lee@sgchem.sg' },
          consignee: { name: 'Priya Sharma', company: 'Befach Trading Pvt Ltd', address: '22 Anna Salai, Chennai 600002', phone: '+91-9445551234', email: 'priya@befach.com' },
          incoterm: 'FOB', instructions: 'DG certified handler required',
        } as InternationalBookingData,
        selectedQuote: { id: 'demo-q2', carrier: 'CMA CGM', logo: '🚢', price: 1820, currency: 'USD', transitDays: 12, serviceType: 'Standard', validUntil: '2026-03-05', rating: 4.6, breakdown: { base: 1520, fuel: 130, port: 100, handling: 70 } },
        referenceNumber: 'BF-INTL-31892',
        createdAt: new Date(now.getTime() - 3 * 86400000).toISOString(),
        updatedAt: new Date(now.getTime() - 3 * 86400000).toISOString(),
      },
      {
        id: 'demo-3',
        segment: 'international',
        status: 'delivered',
        data: {
          originPort: 'DXB', destinationPort: 'DEL', freightMode: 'air',
          containerType: '20ft_std', containerQty: 1, shippingDate: '2026-01-20',
          commodity: 'Textile Samples', hsCode: '5407.10', weight: '450', volume: '3',
          packages: 8, hazardous: false, specialNotes: '',
          selectedQuoteId: 'demo-q3',
          shipper: { name: 'Ahmed Al-Rashid', company: 'Dubai Textiles FZE', address: 'DAFZA, Dubai', phone: '+971-4-555-1234', email: 'ahmed@dubtex.ae' },
          consignee: { name: 'Amit Verma', company: 'Befach Trading Pvt Ltd', address: 'Connaught Place, New Delhi 110001', phone: '+91-9811001234', email: 'amit@befach.com' },
          incoterm: 'DDP', instructions: '',
        } as InternationalBookingData,
        selectedQuote: { id: 'demo-q3', carrier: 'Emirates SkyCargo', logo: '✈️', price: 2890, currency: 'USD', transitDays: 3, serviceType: 'Express', validUntil: '2026-01-25', rating: 4.8, breakdown: { base: 2610, fuel: 130, port: 80, handling: 70 } },
        referenceNumber: 'BF-INTL-19456',
        createdAt: new Date(now.getTime() - 22 * 86400000).toISOString(),
        updatedAt: new Date(now.getTime() - 18 * 86400000).toISOString(),
      },
      {
        id: 'demo-4',
        segment: 'local',
        status: 'in_transit',
        data: {
          pickupCity: 'mum', pickupAddress: '45 BKC, Bandra Kurla Complex',
          deliveryCity: 'pun', deliveryAddress: 'Hinjewadi IT Park, Phase 2',
          vehicleType: 'truck', vehicleCount: 1, pickupDate: '2026-02-08', urgency: 'express',
          materialType: 'general', weight: '2500', packages: 15,
          loadingHelp: true, insurance: false, specialNotes: 'Deliver to warehouse gate B',
          selectedQuoteId: 'demo-q4',
          contact: { name: 'Rajesh Kumar', company: 'Befach Trading', address: '45 BKC, Mumbai', phone: '+91-9876543210', email: 'rajesh@befach.com' },
        } as LocalBookingData,
        selectedQuote: { id: 'demo-q4', carrier: 'Delhivery Freight', logo: '🚛', price: 18500, currency: 'INR', transitDays: 1, serviceType: 'Express', validUntil: '2026-02-11', rating: 4.5, breakdown: { base: 16800, fuel: 1100, port: 0, handling: 600 } },
        referenceNumber: 'BF-LOCAL-44821',
        createdAt: new Date(now.getTime() - 1 * 86400000).toISOString(),
        updatedAt: new Date(now.getTime() - 12 * 3600000).toISOString(),
      },
      {
        id: 'demo-5',
        segment: 'local',
        status: 'delivered',
        data: {
          pickupCity: 'del', pickupAddress: 'Okhla Industrial Area, Phase 3',
          deliveryCity: 'jai', deliveryAddress: 'Sitapura Industrial Area',
          vehicleType: 'mini_truck', vehicleCount: 1, pickupDate: '2026-01-30', urgency: 'standard',
          materialType: 'fragile', weight: '800', packages: 6,
          loadingHelp: true, insurance: true, specialNotes: 'Glass panels — extra padding required',
          selectedQuoteId: 'demo-q5',
          contact: { name: 'Amit Verma', company: 'Befach Trading', address: 'Connaught Place, Delhi', phone: '+91-9811001234', email: 'amit@befach.com' },
        } as LocalBookingData,
        selectedQuote: { id: 'demo-q5', carrier: 'Gati KWE', logo: '🚛', price: 9200, currency: 'INR', transitDays: 2, serviceType: 'Standard', validUntil: '2026-02-02', rating: 4.0, breakdown: { base: 8200, fuel: 500, port: 0, handling: 500 } },
        referenceNumber: 'BF-LOCAL-38765',
        createdAt: new Date(now.getTime() - 12 * 86400000).toISOString(),
        updatedAt: new Date(now.getTime() - 9 * 86400000).toISOString(),
      },
    ];

    this.saveRawData(demoRecords);
  }
}

export const bookingStorage = new BookingStorage();
