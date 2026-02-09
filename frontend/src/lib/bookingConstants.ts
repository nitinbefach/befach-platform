// Book Shipment — Mock Data, Carriers, Ports, Cities & Quote Generator

import {
  FreightMode,
  VehicleType,
  DeliveryUrgency,
  ContainerType,
  BookingQuote,
} from '@/types/booking';

// ─── International Carriers ────────────────────────────────────────────

export interface CarrierInfo {
  id: string;
  name: string;
  logo: string;
  modes: FreightMode[];
  rating: number;
  baseRates: {
    fcl20: number;  // USD per 20ft container
    fcl40: number;  // USD per 40ft container
    lcl: number;    // USD per CBM
    air: number;    // USD per kg
  };
  transitBase: {    // base transit days
    sea: number;
    air: number;
  };
}

export const INTERNATIONAL_CARRIERS: CarrierInfo[] = [
  {
    id: 'maersk',
    name: 'Maersk',
    logo: '🚢',
    modes: ['fcl', 'lcl'],
    rating: 4.7,
    baseRates: { fcl20: 1800, fcl40: 2800, lcl: 45, air: 0 },
    transitBase: { sea: 25, air: 0 },
  },
  {
    id: 'msc',
    name: 'MSC Mediterranean',
    logo: '🚢',
    modes: ['fcl', 'lcl'],
    rating: 4.5,
    baseRates: { fcl20: 1650, fcl40: 2600, lcl: 42, air: 0 },
    transitBase: { sea: 27, air: 0 },
  },
  {
    id: 'cma-cgm',
    name: 'CMA CGM',
    logo: '🚢',
    modes: ['fcl', 'lcl'],
    rating: 4.6,
    baseRates: { fcl20: 1900, fcl40: 3000, lcl: 48, air: 0 },
    transitBase: { sea: 24, air: 0 },
  },
  {
    id: 'hapag',
    name: 'Hapag-Lloyd',
    logo: '🚢',
    modes: ['fcl'],
    rating: 4.4,
    baseRates: { fcl20: 1750, fcl40: 2750, lcl: 0, air: 0 },
    transitBase: { sea: 26, air: 0 },
  },
  {
    id: 'one',
    name: 'ONE',
    logo: '🚢',
    modes: ['fcl', 'lcl'],
    rating: 4.3,
    baseRates: { fcl20: 1550, fcl40: 2450, lcl: 40, air: 0 },
    transitBase: { sea: 28, air: 0 },
  },
  {
    id: 'emirates-cargo',
    name: 'Emirates SkyCargo',
    logo: '✈️',
    modes: ['air'],
    rating: 4.8,
    baseRates: { fcl20: 0, fcl40: 0, lcl: 0, air: 5.80 },
    transitBase: { sea: 0, air: 4 },
  },
  {
    id: 'qatar-cargo',
    name: 'Qatar Airways Cargo',
    logo: '✈️',
    modes: ['air'],
    rating: 4.6,
    baseRates: { fcl20: 0, fcl40: 0, lcl: 0, air: 5.20 },
    transitBase: { sea: 0, air: 5 },
  },
];

// ─── Local Logistics Providers ─────────────────────────────────────────

export interface LocalProviderInfo {
  id: string;
  name: string;
  logo: string;
  vehicleTypes: VehicleType[];
  rating: number;
  baseRates: {
    mini_truck: number;   // INR base
    truck: number;
    trailer: number;
    container_truck: number;
  };
  perKmRate: number;      // INR per km
}

export const LOCAL_PROVIDERS: LocalProviderInfo[] = [
  {
    id: 'delhivery',
    name: 'Delhivery Freight',
    logo: '🚛',
    vehicleTypes: ['mini_truck', 'truck', 'trailer', 'container_truck'],
    rating: 4.5,
    baseRates: { mini_truck: 6500, truck: 14000, trailer: 28000, container_truck: 35000 },
    perKmRate: 18,
  },
  {
    id: 'rivigo',
    name: 'Rivigo',
    logo: '🚛',
    vehicleTypes: ['truck', 'trailer', 'container_truck'],
    rating: 4.3,
    baseRates: { mini_truck: 0, truck: 15000, trailer: 30000, container_truck: 38000 },
    perKmRate: 20,
  },
  {
    id: 'blackbuck',
    name: 'BlackBuck',
    logo: '🚛',
    vehicleTypes: ['mini_truck', 'truck', 'trailer', 'container_truck'],
    rating: 4.4,
    baseRates: { mini_truck: 5800, truck: 12500, trailer: 26000, container_truck: 33000 },
    perKmRate: 16,
  },
  {
    id: 'tci',
    name: 'TCI Freight',
    logo: '🚛',
    vehicleTypes: ['mini_truck', 'truck', 'trailer', 'container_truck'],
    rating: 4.2,
    baseRates: { mini_truck: 7000, truck: 15500, trailer: 29000, container_truck: 36000 },
    perKmRate: 19,
  },
  {
    id: 'safexpress',
    name: 'SafeExpress',
    logo: '🚛',
    vehicleTypes: ['mini_truck', 'truck'],
    rating: 4.1,
    baseRates: { mini_truck: 5500, truck: 13000, trailer: 0, container_truck: 0 },
    perKmRate: 15,
  },
  {
    id: 'gati',
    name: 'Gati KWE',
    logo: '🚛',
    vehicleTypes: ['mini_truck', 'truck'],
    rating: 4.0,
    baseRates: { mini_truck: 5000, truck: 11500, trailer: 0, container_truck: 0 },
    perKmRate: 14,
  },
];

// ─── Ports ─────────────────────────────────────────────────────────────

export interface PortInfo {
  code: string;
  name: string;
  country: string;
  type: 'sea' | 'air' | 'both';
}

export const PORTS: PortInfo[] = [
  // India
  { code: 'BOM', name: 'Mumbai (JNPT)', country: 'IN', type: 'both' },
  { code: 'DEL', name: 'Delhi (ICD Tughlakabad)', country: 'IN', type: 'both' },
  { code: 'MAA', name: 'Chennai', country: 'IN', type: 'both' },
  { code: 'CCU', name: 'Kolkata', country: 'IN', type: 'both' },
  { code: 'BLR', name: 'Bangalore (ICD)', country: 'IN', type: 'air' },
  { code: 'MUN', name: 'Mundra', country: 'IN', type: 'sea' },
  { code: 'VTZ', name: 'Vizag (Visakhapatnam)', country: 'IN', type: 'sea' },
  { code: 'COK', name: 'Cochin (Kochi)', country: 'IN', type: 'both' },
  // China
  { code: 'SHA', name: 'Shanghai', country: 'CN', type: 'both' },
  { code: 'SZX', name: 'Shenzhen', country: 'CN', type: 'both' },
  { code: 'NGB', name: 'Ningbo', country: 'CN', type: 'sea' },
  // Asia
  { code: 'HKG', name: 'Hong Kong', country: 'HK', type: 'both' },
  { code: 'SIN', name: 'Singapore', country: 'SG', type: 'both' },
  { code: 'PUS', name: 'Busan', country: 'KR', type: 'sea' },
  { code: 'CMB', name: 'Colombo', country: 'LK', type: 'sea' },
  // Middle East
  { code: 'DXB', name: 'Dubai (Jebel Ali)', country: 'AE', type: 'both' },
  { code: 'JEA', name: 'Jebel Ali', country: 'AE', type: 'sea' },
  // Europe
  { code: 'RTM', name: 'Rotterdam', country: 'NL', type: 'sea' },
  { code: 'HAM', name: 'Hamburg', country: 'DE', type: 'both' },
  { code: 'FXT', name: 'Felixstowe', country: 'GB', type: 'sea' },
  // Americas
  { code: 'LAX', name: 'Los Angeles', country: 'US', type: 'both' },
  { code: 'NYC', name: 'New York/New Jersey', country: 'US', type: 'both' },
];

// ─── Indian Cities (for Local Logistics) ───────────────────────────────

export interface CityInfo {
  id: string;
  name: string;
  state: string;
}

export const INDIAN_CITIES: CityInfo[] = [
  { id: 'mum', name: 'Mumbai', state: 'Maharashtra' },
  { id: 'del', name: 'Delhi', state: 'Delhi' },
  { id: 'che', name: 'Chennai', state: 'Tamil Nadu' },
  { id: 'kol', name: 'Kolkata', state: 'West Bengal' },
  { id: 'blr', name: 'Bangalore', state: 'Karnataka' },
  { id: 'ahm', name: 'Ahmedabad', state: 'Gujarat' },
  { id: 'hyd', name: 'Hyderabad', state: 'Telangana' },
  { id: 'pun', name: 'Pune', state: 'Maharashtra' },
  { id: 'jai', name: 'Jaipur', state: 'Rajasthan' },
  { id: 'lko', name: 'Lucknow', state: 'Uttar Pradesh' },
  { id: 'sur', name: 'Surat', state: 'Gujarat' },
  { id: 'cbe', name: 'Coimbatore', state: 'Tamil Nadu' },
];

// ─── Container Types ───────────────────────────────────────────────────

export interface ContainerInfo {
  id: ContainerType;
  name: string;
  capacity: string;
  maxWeight: string;
}

export const CONTAINER_TYPES: ContainerInfo[] = [
  { id: '20ft_std', name: '20ft Standard', capacity: '33 CBM', maxWeight: '28,000 kg' },
  { id: '40ft_std', name: '40ft Standard', capacity: '67 CBM', maxWeight: '28,500 kg' },
  { id: '40ft_hc', name: '40ft High Cube', capacity: '76 CBM', maxWeight: '28,500 kg' },
  { id: '20ft_reefer', name: '20ft Reefer', capacity: '28 CBM', maxWeight: '27,000 kg' },
  { id: '40ft_reefer', name: '40ft Reefer', capacity: '59 CBM', maxWeight: '27,500 kg' },
];

// ─── Vehicle Types ─────────────────────────────────────────────────────

export interface VehicleInfo {
  id: VehicleType;
  name: string;
  capacity: string;
  priceRange: string;
  icon: string;
}

export const VEHICLE_TYPES: VehicleInfo[] = [
  { id: 'mini_truck', name: 'Mini Truck', capacity: '1 Ton', priceRange: '₹5K–15K', icon: '🛻' },
  { id: 'truck', name: 'Truck', capacity: '5 Tons', priceRange: '₹12K–35K', icon: '🚚' },
  { id: 'trailer', name: 'Trailer', capacity: '15 Tons', priceRange: '₹25K–55K', icon: '🚛' },
  { id: 'container_truck', name: 'Container Truck', capacity: '20 Tons', priceRange: '₹30K–65K', icon: '🏗️' },
];

// ─── Material Types ────────────────────────────────────────────────────

export const MATERIAL_TYPES = [
  { id: 'general' as const, name: 'General', icon: '📦', description: 'Standard goods' },
  { id: 'fragile' as const, name: 'Fragile', icon: '🔮', description: 'Handle with care' },
  { id: 'perishable' as const, name: 'Perishable', icon: '🥶', description: 'Temperature sensitive' },
  { id: 'hazardous' as const, name: 'Hazardous', icon: '⚠️', description: 'DG certified' },
  { id: 'heavy_machinery' as const, name: 'Heavy Machinery', icon: '⚙️', description: 'ODC cargo' },
];

// ─── Incoterms ─────────────────────────────────────────────────────────

export const INCOTERMS = [
  { id: 'FOB' as const, name: 'FOB', description: 'Free on Board — Seller delivers to port' },
  { id: 'CIF' as const, name: 'CIF', description: 'Cost, Insurance & Freight — Seller covers shipping + insurance' },
  { id: 'CFR' as const, name: 'CFR', description: 'Cost & Freight — Seller covers shipping, buyer covers insurance' },
  { id: 'EXW' as const, name: 'EXW', description: 'Ex Works — Buyer arranges all transport' },
  { id: 'DDP' as const, name: 'DDP', description: 'Delivered Duty Paid — Seller delivers to buyer\'s door' },
];

// ─── Urgency Options ───────────────────────────────────────────────────

export const URGENCY_OPTIONS = [
  { id: 'standard' as const, name: 'Standard', time: '2–5 days', multiplier: 1.0, icon: '📦' },
  { id: 'express' as const, name: 'Express', time: '1–2 days', multiplier: 1.6, icon: '⚡' },
  { id: 'same_day' as const, name: 'Same Day', time: 'Within 24hrs', multiplier: 2.5, icon: '🚀' },
];

// ─── Approximate City Distances (km) for price calculation ─────────────

const CITY_DISTANCES: Record<string, Record<string, number>> = {
  mum: { del: 1400, che: 1340, kol: 2050, blr: 980, ahm: 530, hyd: 710, pun: 150, jai: 1150, lko: 1350, sur: 290, cbe: 1170 },
  del: { mum: 1400, che: 2180, kol: 1530, blr: 2150, ahm: 930, hyd: 1550, pun: 1450, jai: 280, lko: 500, sur: 1180, cbe: 2370 },
  che: { mum: 1340, del: 2180, kol: 1670, blr: 350, ahm: 1860, hyd: 630, pun: 1180, jai: 2050, lko: 2100, sur: 1610, cbe: 500 },
  kol: { mum: 2050, del: 1530, che: 1670, blr: 1870, ahm: 1870, hyd: 1490, pun: 1880, jai: 1510, lko: 990, sur: 1950, cbe: 2100 },
  blr: { mum: 980, del: 2150, che: 350, kol: 1870, ahm: 1500, hyd: 570, pun: 840, jai: 2050, lko: 2100, sur: 1250, cbe: 370 },
  ahm: { mum: 530, del: 930, che: 1860, kol: 1870, blr: 1500, hyd: 1220, pun: 660, jai: 660, lko: 870, sur: 265, cbe: 1690 },
  hyd: { mum: 710, del: 1550, che: 630, kol: 1490, blr: 570, ahm: 1220, pun: 560, jai: 1460, lko: 1520, sur: 950, cbe: 920 },
  pun: { mum: 150, del: 1450, che: 1180, kol: 1880, blr: 840, ahm: 660, hyd: 560, jai: 1200, lko: 1400, sur: 440, cbe: 1020 },
  jai: { mum: 1150, del: 280, che: 2050, kol: 1510, blr: 2050, ahm: 660, hyd: 1460, pun: 1200, lko: 580, sur: 930, cbe: 2240 },
  lko: { mum: 1350, del: 500, che: 2100, kol: 990, blr: 2100, ahm: 870, hyd: 1520, pun: 1400, jai: 580, sur: 1120, cbe: 2300 },
  sur: { mum: 290, del: 1180, che: 1610, kol: 1950, blr: 1250, ahm: 265, hyd: 950, pun: 440, jai: 930, lko: 1120, cbe: 1440 },
  cbe: { mum: 1170, del: 2370, che: 500, kol: 2100, blr: 370, ahm: 1690, hyd: 920, pun: 1020, jai: 2240, lko: 2300, sur: 1440 },
};

function getDistance(from: string, to: string): number {
  if (from === to) return 50; // same city local
  return CITY_DISTANCES[from]?.[to] || CITY_DISTANCES[to]?.[from] || 800;
}

// ─── Route distance multiplier for sea/air ─────────────────────────────

function getRouteMultiplier(origin: string, destination: string): number {
  // Simple multiplier based on whether route is intra-Asia, Asia-Europe, or Asia-Americas
  const asianPorts = ['SHA', 'SZX', 'NGB', 'HKG', 'SIN', 'PUS', 'CMB', 'BOM', 'DEL', 'MAA', 'CCU', 'BLR', 'MUN', 'VTZ', 'COK', 'DXB', 'JEA'];
  const euroPorts = ['RTM', 'HAM', 'FXT'];
  const usPorts = ['LAX', 'NYC'];

  const originIsAsia = asianPorts.includes(origin);
  const destIsAsia = asianPorts.includes(destination);
  const destIsEurope = euroPorts.includes(destination) || euroPorts.includes(origin);
  const destIsUS = usPorts.includes(destination) || usPorts.includes(origin);

  if (originIsAsia && destIsAsia) return 0.7;  // shorter route
  if (destIsEurope) return 1.2;                // medium route
  if (destIsUS) return 1.5;                    // long route
  return 1.0;
}

// ─── Quote Generator ───────────────────────────────────────────────────

function randomVariance(base: number, range: number): number {
  return base + (Math.random() - 0.5) * 2 * range;
}

export function generateInternationalQuotes(
  freightMode: FreightMode,
  originPort: string,
  destinationPort: string,
  containerType: ContainerType,
  containerQty: number,
  weightKg: number,
): BookingQuote[] {
  const routeMul = getRouteMultiplier(originPort, destinationPort);

  const eligibleCarriers = INTERNATIONAL_CARRIERS.filter(c => c.modes.includes(freightMode));

  return eligibleCarriers.map((carrier) => {
    let basePrice: number;
    let transitDays: number;

    if (freightMode === 'air') {
      const ratePerKg = randomVariance(carrier.baseRates.air, 0.8);
      basePrice = ratePerKg * Math.max(parseFloat(String(weightKg)) || 100, 100) * routeMul;
      transitDays = Math.round(randomVariance(carrier.transitBase.air, 1) * routeMul);
    } else if (freightMode === 'lcl') {
      basePrice = randomVariance(carrier.baseRates.lcl, 8) * Math.max(parseFloat(String(weightKg)) / 1000, 1) * routeMul * 20;
      transitDays = Math.round(randomVariance(carrier.transitBase.sea, 3) * routeMul);
    } else {
      // FCL
      const is40 = containerType.startsWith('40');
      const rate = is40 ? carrier.baseRates.fcl40 : carrier.baseRates.fcl20;
      basePrice = randomVariance(rate, rate * 0.15) * containerQty * routeMul;
      transitDays = Math.round(randomVariance(carrier.transitBase.sea, 3) * routeMul);
    }

    basePrice = Math.max(basePrice, 200);
    transitDays = Math.max(transitDays, 2);

    const fuel = Math.round(basePrice * 0.08);
    const port = Math.round(randomVariance(120, 40));
    const handling = Math.round(randomVariance(80, 25));
    const total = Math.round(basePrice + fuel + port + handling);

    const validDate = new Date();
    validDate.setDate(validDate.getDate() + Math.floor(Math.random() * 7) + 7);

    return {
      id: `q-${carrier.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      carrier: carrier.name,
      logo: carrier.logo,
      price: total,
      currency: 'USD',
      transitDays,
      serviceType: Math.random() > 0.6 ? 'Express' : 'Standard',
      validUntil: validDate.toISOString().split('T')[0],
      rating: carrier.rating,
      breakdown: {
        base: Math.round(basePrice),
        fuel,
        port,
        handling,
      },
    };
  }).sort((a, b) => a.price - b.price);
}

export function generateLocalQuotes(
  pickupCityId: string,
  deliveryCityId: string,
  vehicleType: VehicleType,
  vehicleCount: number,
  urgency: DeliveryUrgency,
): BookingQuote[] {
  const distance = getDistance(pickupCityId, deliveryCityId);
  const urgencyMul = URGENCY_OPTIONS.find(u => u.id === urgency)?.multiplier || 1.0;

  const eligibleProviders = LOCAL_PROVIDERS.filter(p => p.vehicleTypes.includes(vehicleType));

  return eligibleProviders.map((provider) => {
    const baseRate = provider.baseRates[vehicleType];
    const distanceCost = distance * provider.perKmRate;
    const basePrice = (baseRate + distanceCost) * vehicleCount * urgencyMul;
    const total = Math.round(randomVariance(basePrice, basePrice * 0.1));

    const fuel = Math.round(total * 0.06);
    const handling = Math.round(randomVariance(500, 200));
    const base = total - fuel - handling;

    // Estimate delivery days based on distance and urgency
    let transitDays: number;
    if (urgency === 'same_day') {
      transitDays = 1;
    } else if (urgency === 'express') {
      transitDays = distance > 1000 ? 2 : 1;
    } else {
      transitDays = Math.max(1, Math.round(distance / 500));
    }

    const validDate = new Date();
    validDate.setDate(validDate.getDate() + 3);

    return {
      id: `q-${provider.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      carrier: provider.name,
      logo: provider.logo,
      price: Math.max(total, 3000),
      currency: 'INR',
      transitDays,
      serviceType: urgency === 'same_day' ? 'Same Day' : urgency === 'express' ? 'Express' : 'Standard',
      validUntil: validDate.toISOString().split('T')[0],
      rating: provider.rating,
      breakdown: {
        base: Math.max(base, 2000),
        fuel,
        port: 0,
        handling: Math.max(handling, 300),
      },
    };
  }).sort((a, b) => a.price - b.price);
}

// ─── Formatting Helpers ────────────────────────────────────────────────

export function formatCurrency(amount: number, currency: string): string {
  if (currency === 'INR') {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
  return `$${amount.toLocaleString('en-US')}`;
}

export function getPortLabel(code: string): string {
  const port = PORTS.find(p => p.code === code);
  return port ? `${port.name} (${port.code})` : code;
}

export function getCityLabel(id: string): string {
  const city = INDIAN_CITIES.find(c => c.id === id);
  return city ? `${city.name}, ${city.state}` : id;
}
