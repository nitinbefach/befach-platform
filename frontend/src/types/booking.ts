// Book Shipment / Book Freight — Type Definitions

// ─── Enums & Literal Types ─────────────────────────────────────────────

export type FreightMode = 'fcl' | 'lcl' | 'air';
export type VehicleType = 'mini_truck' | 'truck' | 'trailer' | 'container_truck';
export type BookingSegment = 'international' | 'local';
export type BookingStatus = 'draft' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled';
export type DeliveryUrgency = 'standard' | 'express' | 'same_day';
export type MaterialType = 'general' | 'fragile' | 'perishable' | 'hazardous' | 'heavy_machinery';
export type Incoterm = 'FOB' | 'CIF' | 'CFR' | 'EXW' | 'DDP';
export type ContainerType = '20ft_std' | '40ft_std' | '40ft_hc' | '20ft_reefer' | '40ft_reefer';

// ─── Shared Interfaces ─────────────────────────────────────────────────

export interface ContactInfo {
  name: string;
  company: string;
  address: string;
  phone: string;
  email: string;
}

export interface BookingQuote {
  id: string;
  carrier: string;
  logo: string;       // emoji or icon identifier
  price: number;
  currency: string;    // 'USD' or 'INR'
  transitDays: number;
  serviceType: string; // e.g. 'Standard', 'Express', 'Premium'
  validUntil: string;  // ISO date
  rating: number;      // 1-5
  breakdown: {
    base: number;
    fuel: number;
    port: number;
    handling: number;
  };
}

// ─── International Booking ─────────────────────────────────────────────

export interface InternationalBookingData {
  // Step 1: Route & Mode
  originPort: string;
  destinationPort: string;
  freightMode: FreightMode;
  containerType: ContainerType;
  containerQty: number;
  shippingDate: string;

  // Step 2: Cargo Details
  commodity: string;
  hsCode: string;
  weight: string;       // kg
  volume: string;       // CBM
  packages: number;
  hazardous: boolean;
  specialNotes: string;

  // Step 3: Selected Quote
  selectedQuoteId: string;

  // Step 4: Confirmation
  shipper: ContactInfo;
  consignee: ContactInfo;
  incoterm: Incoterm;
  instructions: string;
}

export const INITIAL_INTERNATIONAL: InternationalBookingData = {
  originPort: '',
  destinationPort: '',
  freightMode: 'fcl',
  containerType: '20ft_std',
  containerQty: 1,
  shippingDate: '',
  commodity: '',
  hsCode: '',
  weight: '',
  volume: '',
  packages: 1,
  hazardous: false,
  specialNotes: '',
  selectedQuoteId: '',
  shipper: { name: '', company: '', address: '', phone: '', email: '' },
  consignee: { name: '', company: '', address: '', phone: '', email: '' },
  incoterm: 'FOB',
  instructions: '',
};

// ─── Local Booking ─────────────────────────────────────────────────────

export interface LocalBookingData {
  // Step 1: Route & Vehicle
  pickupCity: string;
  pickupAddress: string;
  deliveryCity: string;
  deliveryAddress: string;
  vehicleType: VehicleType;
  vehicleCount: number;
  pickupDate: string;
  urgency: DeliveryUrgency;

  // Step 2: Cargo Details
  materialType: MaterialType;
  weight: string;
  packages: number;
  loadingHelp: boolean;
  insurance: boolean;
  specialNotes: string;

  // Step 3: Selected Quote + Contact
  selectedQuoteId: string;
  contact: ContactInfo;
}

export const INITIAL_LOCAL: LocalBookingData = {
  pickupCity: '',
  pickupAddress: '',
  deliveryCity: '',
  deliveryAddress: '',
  vehicleType: 'truck',
  vehicleCount: 1,
  pickupDate: '',
  urgency: 'standard',
  materialType: 'general',
  weight: '',
  packages: 1,
  loadingHelp: false,
  insurance: false,
  specialNotes: '',
  selectedQuoteId: '',
  contact: { name: '', company: '', address: '', phone: '', email: '' },
};

// ─── Booking Record (persisted) ────────────────────────────────────────

export interface BookingRecord {
  id: string;
  segment: BookingSegment;
  status: BookingStatus;
  data: InternationalBookingData | LocalBookingData;
  selectedQuote: BookingQuote;
  referenceNumber: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Filter / Query ────────────────────────────────────────────────────

export interface BookingFilters {
  segment?: BookingSegment;
  status?: BookingStatus;
  searchQuery?: string;
}
