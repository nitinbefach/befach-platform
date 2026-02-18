import { safeStorage } from '@/lib/safeStorage';
// Befach Partner Suppliers - Types, Mock Data, Search Algorithm
// This module manages the 100 verified partner suppliers with full catalogues

// ============================================
// TYPE DEFINITIONS
// ============================================

export type PartnerStatus = 'verified' | 'premium';
export type SupplierStatus = 'active' | 'inactive';

export interface ProductPricing {
  basePrice: number;
  currency: string;
  unit: string;
  bulkPricing: { minQty: number; price: number }[];
}

export interface CatalogueProduct {
  id: string;
  name: string;
  hsnCode: string;
  description: string;
  specifications: Record<string, string>;
  pricing: ProductPricing;
  moq: number;
  leadTime: { min: number; max: number };
  images?: string[];
}

export interface Catalogue {
  category: string;
  products: CatalogueProduct[];
}

export interface Certification {
  name: string;
  verified: boolean;
  validUntil?: string;
}

export interface SupplierMetrics {
  responseRate: number;
  avgRating: number;
  reviewCount: number;
  totalOrders: number;
  onTimeDelivery: number;
}

export interface SupplierContact {
  name: string;
  role: string;
  email: string;
  phone?: string;
  whatsapp?: string;
}

export interface SupplierLocation {
  country: string;
  region: string;
  city: string;
}

export interface Supplier {
  id: string;
  companyName: string;
  partnerStatus: PartnerStatus;
  status: SupplierStatus;
  location: SupplierLocation;
  catalogue: Catalogue[];
  certifications: Certification[];
  metrics: SupplierMetrics;
  contacts: SupplierContact[];
  foundedYear: number;
  employeeCount: string;
  description: string;
  website?: string;
}

export interface SearchQuery {
  keyword?: string;
  categories?: string[];
  countries?: string[];
  certifications?: string[];
  minRating?: number;
  maxLeadTime?: number;
  priceRange?: { min: number; max: number };
  quantity?: number;
}

export interface MatchedProduct {
  product: CatalogueProduct;
  relevanceScore: number;
  priceForQuantity?: number;
}

export interface SearchResult {
  supplier: Supplier;
  matchScore: number;
  matchedProducts: MatchedProduct[];
}

export interface ChatMessage {
  id: string;
  supplierId: string;
  from: 'user' | 'supplier' | 'system';
  text: string;
  timestamp: string;
}

export interface SupplierInvitation {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  phone?: string;
  category?: string;
  country?: string;
  website?: string;
  personalMessage?: string;

  // Status tracking
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  invitedAt: string;
  expiresAt: string;
  acceptedAt?: string;
  cancelledAt?: string;

  // Resend tracking
  resendCount: number;
  lastResendAt?: string;

  // Invite link token
  inviteToken: string;
}

// ============================================
// CATEGORIES CONFIGURATION
// ============================================

export const CATEGORIES = [
  { id: 'electronics', name: 'Electronics', icon: '', color: '#3B82F6' },
  { id: 'health-supplements', name: 'Health Supplements', icon: '', color: '#10B981' },
  { id: 'consumer-electronics', name: 'Consumer Electronics', icon: '', color: '#8B5CF6' },
];

export const COUNTRIES = [
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
];

export const CERTIFICATIONS = [
  'ISO 9001', 'ISO 14001', 'ISO 22000', 'ISO 45001',
  'CE', 'FCC', 'RoHS', 'UL',
  'FDA', 'GMP', 'HACCP', 'Halal', 'Kosher',
  'IATF 16949', 'SA 8000', 'BSCI',
];

// ============================================
// MOCK SUPPLIER DATA - 100 SUPPLIERS
// ============================================

const generateBulkPricing = (basePrice: number): { minQty: number; price: number }[] => [
  { minQty: 100, price: basePrice * 0.95 },
  { minQty: 500, price: basePrice * 0.90 },
  { minQty: 1000, price: basePrice * 0.85 },
  { minQty: 5000, price: basePrice * 0.80 },
  { minQty: 10000, price: basePrice * 0.75 },
];

// Electronics Suppliers (IDs: SUP-001 to SUP-035)
const electronicsSuppliers: Supplier[] = [
  {
    id: 'SUP-001',
    companyName: 'Shenzhen Apex Electronics Co.',
    partnerStatus: 'verified',
    status: 'active',
    location: { country: 'China', region: 'Guangdong', city: 'Shenzhen' },
    catalogue: [{
      category: 'Electronics',
      products: [
        {
          id: 'PROD-001-1',
          name: 'LED Bulb 9W E27',
          hsnCode: '8539.50',
          description: 'Energy-efficient LED bulb with warm white light, 800 lumens',
          specifications: { wattage: '9W', base: 'E27', lumens: '800', color: 'Warm White 3000K', lifespan: '25000 hours' },
          pricing: { basePrice: 1.85, currency: 'USD', unit: 'piece', bulkPricing: generateBulkPricing(1.85) },
          moq: 1000,
          leadTime: { min: 14, max: 21 },
        },
        {
          id: 'PROD-001-2',
          name: 'LED Panel Light 40W',
          hsnCode: '9405.42',
          description: '600x600mm LED panel for office and commercial spaces',
          specifications: { wattage: '40W', size: '600x600mm', lumens: '4000', colorTemp: '4000K', lifespan: '50000 hours' },
          pricing: { basePrice: 18.50, currency: 'USD', unit: 'piece', bulkPricing: generateBulkPricing(18.50) },
          moq: 100,
          leadTime: { min: 14, max: 21 },
        },
        {
          id: 'PROD-001-3',
          name: 'LED Driver 60W',
          hsnCode: '8504.40',
          description: 'Constant current LED driver for commercial lighting',
          specifications: { power: '60W', input: '100-277V AC', output: '24V DC', efficiency: '92%' },
          pricing: { basePrice: 8.20, currency: 'USD', unit: 'piece', bulkPricing: generateBulkPricing(8.20) },
          moq: 200,
          leadTime: { min: 14, max: 21 },
        },
      ],
    }],
    certifications: [
      { name: 'ISO 9001', verified: true, validUntil: '2026-12-31' },
      { name: 'CE', verified: true },
      { name: 'RoHS', verified: true },
    ],
    metrics: { responseRate: 98, avgRating: 4.8, reviewCount: 156, totalOrders: 2340, onTimeDelivery: 96 },
    contacts: [
      { name: 'Zhang Wei', role: 'Sales Manager', email: 'zhang.wei@apex-led.cn', phone: '+86-755-8888-1234', whatsapp: '+86-13800138001' },
    ],
    foundedYear: 2008,
    employeeCount: '200-500',
    description: 'Leading manufacturer of LED lighting solutions with 15+ years experience. Specializing in commercial and residential lighting products with comprehensive OEM/ODM capabilities.',
  },
  {
    id: 'SUP-002',
    companyName: 'Taiwan Precision Components Ltd.',
    partnerStatus: 'premium',
    status: 'active',
    location: { country: 'Taiwan', region: 'New Taipei', city: 'Taipei' },
    catalogue: [{
      category: 'Electronics',
      products: [
        {
          id: 'PROD-002-1',
          name: 'SMD Capacitor 100uF 25V',
          hsnCode: '8532.24',
          description: 'High-quality aluminum electrolytic capacitor for consumer electronics',
          specifications: { capacitance: '100uF', voltage: '25V', tolerance: '±20%', size: '6.3x7.7mm' },
          pricing: { basePrice: 0.08, currency: 'USD', unit: 'piece', bulkPricing: generateBulkPricing(0.08) },
          moq: 10000,
          leadTime: { min: 21, max: 28 },
        },
        {
          id: 'PROD-002-2',
          name: 'PCB Board 4-Layer FR4',
          hsnCode: '8534.00',
          description: 'Custom 4-layer PCB with HASL finish',
          specifications: { layers: '4', material: 'FR4', thickness: '1.6mm', copper: '1oz', finish: 'HASL' },
          pricing: { basePrice: 12.00, currency: 'USD', unit: 'sq.dm', bulkPricing: generateBulkPricing(12.00) },
          moq: 50,
          leadTime: { min: 7, max: 14 },
        },
      ],
    }],
    certifications: [
      { name: 'ISO 9001', verified: true, validUntil: '2025-06-30' },
      { name: 'IATF 16949', verified: true, validUntil: '2025-12-31' },
      { name: 'ISO 14001', verified: true },
    ],
    metrics: { responseRate: 99, avgRating: 4.9, reviewCount: 312, totalOrders: 4560, onTimeDelivery: 98 },
    contacts: [
      { name: 'Chen Ming-Hua', role: 'Export Director', email: 'mchen@twprecision.com.tw', phone: '+886-2-2888-9999' },
    ],
    foundedYear: 1995,
    employeeCount: '500-1000',
    description: 'High-precision electronic components manufacturer for industrial and automotive applications. ISO certified with advanced testing facilities.',
  },
  {
    id: 'SUP-003',
    companyName: 'Guangzhou Power Systems Inc.',
    partnerStatus: 'verified',
    status: 'active',
    location: { country: 'China', region: 'Guangdong', city: 'Guangzhou' },
    catalogue: [{
      category: 'Electronics',
      products: [
        {
          id: 'PROD-003-1',
          name: 'Li-ion Battery Pack 48V 20Ah',
          hsnCode: '8507.60',
          description: 'High-capacity lithium-ion battery pack for e-bikes and scooters',
          specifications: { voltage: '48V', capacity: '20Ah', cells: 'Samsung 21700', bms: 'Included', cycles: '1000+' },
          pricing: { basePrice: 185.00, currency: 'USD', unit: 'pack', bulkPricing: generateBulkPricing(185.00) },
          moq: 50,
          leadTime: { min: 21, max: 30 },
        },
        {
          id: 'PROD-003-2',
          name: 'Solar Panel 550W Mono',
          hsnCode: '8541.40',
          description: 'High-efficiency monocrystalline solar panel for residential and commercial use',
          specifications: { power: '550W', type: 'Mono PERC', efficiency: '21.3%', size: '2278x1134x35mm', warranty: '25 years' },
          pricing: { basePrice: 145.00, currency: 'USD', unit: 'panel', bulkPricing: generateBulkPricing(145.00) },
          moq: 20,
          leadTime: { min: 14, max: 21 },
        },
      ],
    }],
    certifications: [
      { name: 'ISO 9001', verified: true },
      { name: 'CE', verified: true },
      { name: 'UL', verified: true },
    ],
    metrics: { responseRate: 95, avgRating: 4.6, reviewCount: 89, totalOrders: 1230, onTimeDelivery: 92 },
    contacts: [
      { name: 'Li Jian', role: 'Sales Representative', email: 'sales@gzpower.cn', phone: '+86-20-8765-4321' },
    ],
    foundedYear: 2012,
    employeeCount: '100-200',
    description: 'Specialized in renewable energy products including solar panels, battery systems, and power electronics.',
  },
  {
    id: 'SUP-004',
    companyName: 'Korea Electronics Hub Co.',
    partnerStatus: 'premium',
    status: 'active',
    location: { country: 'South Korea', region: 'Gyeonggi', city: 'Seoul' },
    catalogue: [{
      category: 'Electronics',
      products: [
        {
          id: 'PROD-004-1',
          name: 'OLED Display Module 5.5"',
          hsnCode: '9013.80',
          description: 'Full HD AMOLED display module for smartphones',
          specifications: { size: '5.5"', resolution: '1920x1080', type: 'AMOLED', touch: 'Capacitive', brightness: '600 nits' },
          pricing: { basePrice: 42.00, currency: 'USD', unit: 'piece', bulkPricing: generateBulkPricing(42.00) },
          moq: 100,
          leadTime: { min: 14, max: 21 },
        },
        {
          id: 'PROD-004-2',
          name: 'Memory IC DDR4 8GB',
          hsnCode: '8542.32',
          description: 'High-speed DDR4 memory chip for computers and servers',
          specifications: { capacity: '8GB', speed: '3200MHz', type: 'DDR4', voltage: '1.2V' },
          pricing: { basePrice: 18.50, currency: 'USD', unit: 'piece', bulkPricing: generateBulkPricing(18.50) },
          moq: 500,
          leadTime: { min: 7, max: 14 },
        },
      ],
    }],
    certifications: [
      { name: 'ISO 9001', verified: true },
      { name: 'ISO 14001', verified: true },
      { name: 'IATF 16949', verified: true },
    ],
    metrics: { responseRate: 97, avgRating: 4.9, reviewCount: 245, totalOrders: 3890, onTimeDelivery: 97 },
    contacts: [
      { name: 'Kim Sung-Ho', role: 'Business Development', email: 'skim@koreaelec.kr', phone: '+82-2-555-1234' },
    ],
    foundedYear: 2001,
    employeeCount: '1000+',
    description: 'Leading Korean manufacturer of display modules, memory ICs, and semiconductor components. Samsung and LG certified supplier.',
  },
  {
    id: 'SUP-005',
    companyName: 'Vietnam Cable & Wire Co.',
    partnerStatus: 'verified',
    status: 'active',
    location: { country: 'Vietnam', region: 'Binh Duong', city: 'Ho Chi Minh City' },
    catalogue: [{
      category: 'Electronics',
      products: [
        {
          id: 'PROD-005-1',
          name: 'USB-C Cable 1m',
          hsnCode: '8544.42',
          description: 'High-speed USB-C to USB-C cable with PD support',
          specifications: { length: '1m', speed: 'USB 3.1 Gen 2', power: '100W PD', material: 'Nylon Braided' },
          pricing: { basePrice: 1.20, currency: 'USD', unit: 'piece', bulkPricing: generateBulkPricing(1.20) },
          moq: 1000,
          leadTime: { min: 10, max: 15 },
        },
        {
          id: 'PROD-005-2',
          name: 'HDMI Cable 2.1 2m',
          hsnCode: '8544.42',
          description: '8K HDMI 2.1 cable for high-resolution displays',
          specifications: { length: '2m', version: 'HDMI 2.1', resolution: '8K@60Hz', bandwidth: '48Gbps' },
          pricing: { basePrice: 3.50, currency: 'USD', unit: 'piece', bulkPricing: generateBulkPricing(3.50) },
          moq: 500,
          leadTime: { min: 10, max: 15 },
        },
      ],
    }],
    certifications: [
      { name: 'ISO 9001', verified: true },
      { name: 'CE', verified: true },
      { name: 'RoHS', verified: true },
    ],
    metrics: { responseRate: 92, avgRating: 4.5, reviewCount: 78, totalOrders: 980, onTimeDelivery: 90 },
    contacts: [
      { name: 'Nguyen Van Tuan', role: 'Export Manager', email: 'tuan@vncable.vn', phone: '+84-28-3456-7890' },
    ],
    foundedYear: 2015,
    employeeCount: '100-200',
    description: 'Manufacturer of high-quality cables and connectors for consumer electronics and industrial applications.',
  },
];

// Generate more electronics suppliers
const moreElectronicsSuppliers: Supplier[] = Array.from({ length: 30 }, (_, i) => {
  const index = i + 6;
  const cities = ['Shenzhen', 'Dongguan', 'Suzhou', 'Ningbo', 'Hangzhou', 'Wuhan', 'Chengdu', 'Xiamen'];
  const city = cities[i % cities.length];
  const products = [
    { name: 'Resistor 10K Ohm', hsnCode: '8533.21', basePrice: 0.01, moq: 50000 },
    { name: 'Inductor 100uH', hsnCode: '8504.50', basePrice: 0.15, moq: 5000 },
    { name: 'Transistor NPN', hsnCode: '8541.21', basePrice: 0.05, moq: 10000 },
    { name: 'Diode Rectifier', hsnCode: '8541.10', basePrice: 0.02, moq: 20000 },
    { name: 'Connector USB-A', hsnCode: '8536.69', basePrice: 0.25, moq: 5000 },
    { name: 'Switch Tactile', hsnCode: '8536.50', basePrice: 0.08, moq: 10000 },
    { name: 'Relay 12V', hsnCode: '8536.41', basePrice: 0.75, moq: 1000 },
    { name: 'Transformer 5W', hsnCode: '8504.31', basePrice: 2.50, moq: 500 },
  ];
  const selectedProducts = products.slice(i % 3, (i % 3) + 2);

  return {
    id: `SUP-0${String(index).padStart(2, '0')}`,
    companyName: `${city} Electronics Manufacturing ${index}`,
    partnerStatus: i % 4 === 0 ? 'premium' as PartnerStatus : 'verified' as PartnerStatus,
    status: 'active' as SupplierStatus,
    location: { country: 'China', region: 'Various', city },
    catalogue: [{
      category: 'Electronics',
      products: selectedProducts.map((p, j) => ({
        id: `PROD-0${index}-${j + 1}`,
        name: p.name,
        hsnCode: p.hsnCode,
        description: `High-quality ${p.name.toLowerCase()} for electronics manufacturing`,
        specifications: { quality: 'Industrial Grade', tolerance: '±5%' },
        pricing: { basePrice: p.basePrice, currency: 'USD', unit: 'piece', bulkPricing: generateBulkPricing(p.basePrice) },
        moq: p.moq,
        leadTime: { min: 10 + (i % 7), max: 20 + (i % 10) },
      })),
    }],
    certifications: [
      { name: 'ISO 9001', verified: true },
      { name: i % 2 === 0 ? 'CE' : 'RoHS', verified: true },
    ],
    metrics: {
      responseRate: 85 + (i % 15),
      avgRating: 4.0 + (i % 10) / 10,
      reviewCount: 20 + i * 5,
      totalOrders: 300 + i * 50,
      onTimeDelivery: 85 + (i % 15),
    },
    contacts: [{ name: `Contact ${index}`, role: 'Sales', email: `sales@elec${index}.cn`, phone: `+86-755-${1000 + index}` }],
    foundedYear: 2000 + (i % 20),
    employeeCount: i % 3 === 0 ? '200-500' : '50-100',
    description: `Established electronics components manufacturer in ${city} serving global markets.`,
  };
});

// Health Supplements Suppliers (IDs: SUP-036 to SUP-068)
const healthSuppliers: Supplier[] = [
  {
    id: 'SUP-036',
    companyName: 'NutraVita Health Industries',
    partnerStatus: 'verified',
    status: 'active',
    location: { country: 'India', region: 'Maharashtra', city: 'Mumbai' },
    catalogue: [{
      category: 'Health Supplements',
      products: [
        {
          id: 'PROD-036-1',
          name: 'Vitamin D3 5000IU Softgels',
          hsnCode: '2936.27',
          description: 'High-potency Vitamin D3 softgels for immune support',
          specifications: { dosage: '5000 IU', form: 'Softgel', count: '120 capsules', source: 'Lanolin' },
          pricing: { basePrice: 4.50, currency: 'USD', unit: 'bottle', bulkPricing: generateBulkPricing(4.50) },
          moq: 500,
          leadTime: { min: 21, max: 30 },
        },
        {
          id: 'PROD-036-2',
          name: 'Omega-3 Fish Oil 1000mg',
          hsnCode: '1504.20',
          description: 'Pharmaceutical grade fish oil capsules with EPA/DHA',
          specifications: { dosage: '1000mg', epa: '180mg', dha: '120mg', count: '180 softgels' },
          pricing: { basePrice: 8.20, currency: 'USD', unit: 'bottle', bulkPricing: generateBulkPricing(8.20) },
          moq: 300,
          leadTime: { min: 21, max: 30 },
        },
        {
          id: 'PROD-036-3',
          name: 'Whey Protein Isolate 2kg',
          hsnCode: '3502.20',
          description: '90% pure whey protein isolate for athletes',
          specifications: { protein: '27g/serving', servings: '66', flavor: 'Various', source: 'Whey Isolate' },
          pricing: { basePrice: 35.00, currency: 'USD', unit: 'bag', bulkPricing: generateBulkPricing(35.00) },
          moq: 100,
          leadTime: { min: 21, max: 30 },
        },
      ],
    }],
    certifications: [
      { name: 'FDA', verified: true },
      { name: 'GMP', verified: true, validUntil: '2025-12-31' },
      { name: 'ISO 22000', verified: true },
      { name: 'Halal', verified: true },
    ],
    metrics: { responseRate: 95, avgRating: 4.6, reviewCount: 89, totalOrders: 1450, onTimeDelivery: 91 },
    contacts: [
      { name: 'Rajesh Sharma', role: 'Export Director', email: 'rajesh@nutravita.in', phone: '+91-22-2345-6789', whatsapp: '+91-9876543210' },
    ],
    foundedYear: 2010,
    employeeCount: '200-500',
    description: 'WHO-GMP certified nutraceutical manufacturer with state-of-the-art facilities. Specializing in vitamins, minerals, and sports nutrition.',
  },
  {
    id: 'SUP-037',
    companyName: 'Herbal Wellness Korea Ltd.',
    partnerStatus: 'premium',
    status: 'active',
    location: { country: 'South Korea', region: 'Chungcheongnam', city: 'Seoul' },
    catalogue: [{
      category: 'Health Supplements',
      products: [
        {
          id: 'PROD-037-1',
          name: 'Korean Red Ginseng Extract',
          hsnCode: '1302.19',
          description: '6-year old Korean red ginseng extract for vitality',
          specifications: { ginsenoside: '8mg/g', form: 'Extract', age: '6 years', origin: 'Korea' },
          pricing: { basePrice: 28.00, currency: 'USD', unit: 'box', bulkPricing: generateBulkPricing(28.00) },
          moq: 200,
          leadTime: { min: 14, max: 21 },
        },
        {
          id: 'PROD-037-2',
          name: 'Collagen Peptides 500g',
          hsnCode: '3504.00',
          description: 'Marine collagen peptides for skin and joint health',
          specifications: { type: 'Marine Type I & III', weight: '500g', daltons: '3000', source: 'Fish' },
          pricing: { basePrice: 22.00, currency: 'USD', unit: 'bag', bulkPricing: generateBulkPricing(22.00) },
          moq: 100,
          leadTime: { min: 14, max: 21 },
        },
      ],
    }],
    certifications: [
      { name: 'GMP', verified: true },
      { name: 'ISO 22000', verified: true },
      { name: 'Halal', verified: true },
      { name: 'Kosher', verified: true },
    ],
    metrics: { responseRate: 98, avgRating: 4.8, reviewCount: 156, totalOrders: 2100, onTimeDelivery: 96 },
    contacts: [
      { name: 'Park Ji-Young', role: 'International Sales', email: 'jypark@herbalkorea.kr', phone: '+82-2-888-5555' },
    ],
    foundedYear: 2005,
    employeeCount: '100-200',
    description: 'Premium Korean health supplements featuring traditional herbal formulations with modern manufacturing standards.',
  },
  {
    id: 'SUP-038',
    companyName: 'Thailand Natural Products Co.',
    partnerStatus: 'verified',
    status: 'active',
    location: { country: 'Thailand', region: 'Central', city: 'Bangkok' },
    catalogue: [{
      category: 'Health Supplements',
      products: [
        {
          id: 'PROD-038-1',
          name: 'Turmeric Curcumin 95%',
          hsnCode: '1302.19',
          description: 'High-potency turmeric extract with 95% curcuminoids',
          specifications: { curcumin: '95%', form: 'Capsules', count: '120', withPiperine: 'Yes' },
          pricing: { basePrice: 6.50, currency: 'USD', unit: 'bottle', bulkPricing: generateBulkPricing(6.50) },
          moq: 500,
          leadTime: { min: 14, max: 21 },
        },
        {
          id: 'PROD-038-2',
          name: 'Coconut MCT Oil 500ml',
          hsnCode: '1513.29',
          description: 'Pure MCT oil from organic coconuts',
          specifications: { c8c10: '70%', source: 'Organic Coconut', form: 'Liquid', packaging: 'Glass bottle' },
          pricing: { basePrice: 12.00, currency: 'USD', unit: 'bottle', bulkPricing: generateBulkPricing(12.00) },
          moq: 200,
          leadTime: { min: 14, max: 21 },
        },
      ],
    }],
    certifications: [
      { name: 'GMP', verified: true },
      { name: 'HACCP', verified: true },
      { name: 'ISO 22000', verified: true },
    ],
    metrics: { responseRate: 90, avgRating: 4.4, reviewCount: 67, totalOrders: 890, onTimeDelivery: 88 },
    contacts: [
      { name: 'Somchai Prasert', role: 'Sales Manager', email: 'somchai@thainatural.co.th', phone: '+66-2-123-4567' },
    ],
    foundedYear: 2012,
    employeeCount: '50-100',
    description: 'Organic and natural health products manufacturer specializing in Southeast Asian herbal ingredients.',
  },
];

// Generate more health supplement suppliers
const moreHealthSuppliers: Supplier[] = Array.from({ length: 30 }, (_, i) => {
  const index = i + 39;
  const locations = [
    { country: 'India', city: 'Ahmedabad' },
    { country: 'China', city: 'Shanghai' },
    { country: 'Vietnam', city: 'Hanoi' },
    { country: 'Malaysia', city: 'Kuala Lumpur' },
    { country: 'India', city: 'Hyderabad' },
    { country: 'Thailand', city: 'Chiang Mai' },
  ];
  const loc = locations[i % locations.length];
  const products = [
    { name: 'Multivitamin Complex', hsnCode: '2936.29', basePrice: 5.50, moq: 500 },
    { name: 'Calcium + D3 Tablets', hsnCode: '2936.27', basePrice: 3.20, moq: 1000 },
    { name: 'Probiotics 50 Billion CFU', hsnCode: '3002.90', basePrice: 12.00, moq: 200 },
    { name: 'Magnesium Glycinate', hsnCode: '2833.21', basePrice: 8.00, moq: 300 },
    { name: 'B-Complex Vitamins', hsnCode: '2936.28', basePrice: 4.00, moq: 500 },
    { name: 'Zinc Picolinate 50mg', hsnCode: '2817.00', basePrice: 3.50, moq: 500 },
  ];
  const selectedProducts = products.slice(i % 3, (i % 3) + 2);

  return {
    id: `SUP-0${String(index).padStart(2, '0')}`,
    companyName: `${loc.city} Health Nutraceuticals ${index - 38}`,
    partnerStatus: i % 5 === 0 ? 'premium' as PartnerStatus : 'verified' as PartnerStatus,
    status: 'active' as SupplierStatus,
    location: { country: loc.country, region: 'Various', city: loc.city },
    catalogue: [{
      category: 'Health Supplements',
      products: selectedProducts.map((p, j) => ({
        id: `PROD-0${index}-${j + 1}`,
        name: p.name,
        hsnCode: p.hsnCode,
        description: `Premium quality ${p.name.toLowerCase()} for daily health support`,
        specifications: { quality: 'Pharmaceutical Grade', purity: '99%+' },
        pricing: { basePrice: p.basePrice, currency: 'USD', unit: 'bottle', bulkPricing: generateBulkPricing(p.basePrice) },
        moq: p.moq,
        leadTime: { min: 14 + (i % 7), max: 25 + (i % 10) },
      })),
    }],
    certifications: [
      { name: 'GMP', verified: true },
      { name: i % 2 === 0 ? 'ISO 22000' : 'HACCP', verified: true },
      { name: i % 3 === 0 ? 'Halal' : 'FDA', verified: true },
    ],
    metrics: {
      responseRate: 82 + (i % 18),
      avgRating: 4.0 + (i % 10) / 10,
      reviewCount: 30 + i * 4,
      totalOrders: 400 + i * 40,
      onTimeDelivery: 85 + (i % 15),
    },
    contacts: [{ name: `Health Contact ${index}`, role: 'Export', email: `export@health${index}.com`, phone: '+91-XX-XXXX-XXXX' }],
    foundedYear: 2005 + (i % 15),
    employeeCount: i % 4 === 0 ? '100-200' : '50-100',
    description: `Quality health supplements manufacturer in ${loc.city} with modern facilities and international certifications.`,
  };
});

// Consumer Electronics Suppliers (IDs: SUP-069 to SUP-100)
const consumerElectronicsSuppliers: Supplier[] = [
  {
    id: 'SUP-069',
    companyName: 'Guangzhou Smart Tech Ltd.',
    partnerStatus: 'verified',
    status: 'active',
    location: { country: 'China', region: 'Guangdong', city: 'Guangzhou' },
    catalogue: [{
      category: 'Consumer Electronics',
      products: [
        {
          id: 'PROD-069-1',
          name: 'Smart Watch Pro 2.0',
          hsnCode: '9102.12',
          description: 'Full-featured smartwatch with health monitoring',
          specifications: { display: '1.75" AMOLED', battery: '7 days', waterproof: 'IP68', features: 'HR, SpO2, GPS' },
          pricing: { basePrice: 28.00, currency: 'USD', unit: 'piece', bulkPricing: generateBulkPricing(28.00) },
          moq: 200,
          leadTime: { min: 10, max: 15 },
        },
        {
          id: 'PROD-069-2',
          name: 'TWS Earbuds ANC',
          hsnCode: '8518.30',
          description: 'True wireless earbuds with active noise cancellation',
          specifications: { driver: '12mm', anc: 'Hybrid ANC', battery: '28h total', codec: 'AAC, SBC' },
          pricing: { basePrice: 15.00, currency: 'USD', unit: 'pair', bulkPricing: generateBulkPricing(15.00) },
          moq: 500,
          leadTime: { min: 10, max: 15 },
        },
        {
          id: 'PROD-069-3',
          name: 'Power Bank 20000mAh PD',
          hsnCode: '8507.60',
          description: 'High-capacity power bank with fast charging',
          specifications: { capacity: '20000mAh', output: '65W PD', ports: 'USB-C x2, USB-A x1', display: 'LED' },
          pricing: { basePrice: 12.50, currency: 'USD', unit: 'piece', bulkPricing: generateBulkPricing(12.50) },
          moq: 300,
          leadTime: { min: 10, max: 15 },
        },
      ],
    }],
    certifications: [
      { name: 'CE', verified: true },
      { name: 'FCC', verified: true },
      { name: 'RoHS', verified: true },
    ],
    metrics: { responseRate: 92, avgRating: 4.7, reviewCount: 203, totalOrders: 3450, onTimeDelivery: 94 },
    contacts: [
      { name: 'Wang Xiaoming', role: 'Sales Director', email: 'wang@gzsmart.cn', phone: '+86-20-1234-5678', whatsapp: '+86-13800138002' },
    ],
    foundedYear: 2014,
    employeeCount: '500-1000',
    description: 'Innovative consumer electronics manufacturer specializing in wearables, audio devices, and mobile accessories.',
  },
  {
    id: 'SUP-070',
    companyName: 'Vietnam Audio Systems',
    partnerStatus: 'verified',
    status: 'active',
    location: { country: 'Vietnam', region: 'Southern', city: 'Ho Chi Minh City' },
    catalogue: [{
      category: 'Consumer Electronics',
      products: [
        {
          id: 'PROD-070-1',
          name: 'Bluetooth Speaker 40W',
          hsnCode: '8518.22',
          description: 'Portable Bluetooth speaker with deep bass',
          specifications: { power: '40W', battery: '12 hours', bluetooth: '5.0', waterproof: 'IPX7' },
          pricing: { basePrice: 18.00, currency: 'USD', unit: 'piece', bulkPricing: generateBulkPricing(18.00) },
          moq: 200,
          leadTime: { min: 12, max: 18 },
        },
        {
          id: 'PROD-070-2',
          name: 'Soundbar 2.1 Channel',
          hsnCode: '8518.22',
          description: 'Home theater soundbar with wireless subwoofer',
          specifications: { channels: '2.1', power: '200W', connectivity: 'HDMI ARC, Bluetooth, Optical', subwoofer: 'Wireless' },
          pricing: { basePrice: 65.00, currency: 'USD', unit: 'set', bulkPricing: generateBulkPricing(65.00) },
          moq: 50,
          leadTime: { min: 12, max: 18 },
        },
      ],
    }],
    certifications: [
      { name: 'CE', verified: true },
      { name: 'FCC', verified: true },
      { name: 'ISO 9001', verified: true },
    ],
    metrics: { responseRate: 90, avgRating: 4.4, reviewCount: 98, totalOrders: 1200, onTimeDelivery: 89 },
    contacts: [
      { name: 'Tran Van Minh', role: 'Export Manager', email: 'minh@vnaudio.vn', phone: '+84-28-9876-5432' },
    ],
    foundedYear: 2016,
    employeeCount: '100-200',
    description: 'Quality audio equipment manufacturer with competitive pricing and reliable delivery.',
  },
  {
    id: 'SUP-071',
    companyName: 'Japan Tech Innovations Co.',
    partnerStatus: 'premium',
    status: 'active',
    location: { country: 'Japan', region: 'Kanto', city: 'Tokyo' },
    catalogue: [{
      category: 'Consumer Electronics',
      products: [
        {
          id: 'PROD-071-1',
          name: 'Wireless Charging Pad 15W',
          hsnCode: '8504.40',
          description: 'Fast wireless charger with foreign object detection',
          specifications: { power: '15W', compatibility: 'Qi', coils: '3', size: '100mm diameter' },
          pricing: { basePrice: 8.50, currency: 'USD', unit: 'piece', bulkPricing: generateBulkPricing(8.50) },
          moq: 500,
          leadTime: { min: 7, max: 14 },
        },
        {
          id: 'PROD-071-2',
          name: 'USB-C Hub 7-in-1',
          hsnCode: '8471.80',
          description: 'Multi-port USB-C hub for laptops',
          specifications: { ports: 'HDMI, USB-A x3, USB-C PD, SD, microSD', power: '100W passthrough' },
          pricing: { basePrice: 22.00, currency: 'USD', unit: 'piece', bulkPricing: generateBulkPricing(22.00) },
          moq: 200,
          leadTime: { min: 7, max: 14 },
        },
      ],
    }],
    certifications: [
      { name: 'CE', verified: true },
      { name: 'FCC', verified: true },
      { name: 'ISO 9001', verified: true },
      { name: 'RoHS', verified: true },
    ],
    metrics: { responseRate: 99, avgRating: 4.9, reviewCount: 178, totalOrders: 2890, onTimeDelivery: 98 },
    contacts: [
      { name: 'Tanaka Yuki', role: 'International Business', email: 'tanaka@japantech.jp', phone: '+81-3-5555-1234' },
    ],
    foundedYear: 2008,
    employeeCount: '200-500',
    description: 'Japanese manufacturer of premium consumer electronics and accessories with exceptional quality standards.',
  },
];

// Generate more consumer electronics suppliers
const moreConsumerSuppliers: Supplier[] = Array.from({ length: 29 }, (_, i) => {
  const index = i + 72;
  const locations = [
    { country: 'China', city: 'Shenzhen' },
    { country: 'China', city: 'Dongguan' },
    { country: 'Taiwan', city: 'Taipei' },
    { country: 'South Korea', city: 'Incheon' },
    { country: 'Vietnam', city: 'Hanoi' },
    { country: 'Malaysia', city: 'Penang' },
  ];
  const loc = locations[i % locations.length];
  const products = [
    { name: 'Phone Case TPU', hsnCode: '3926.90', basePrice: 0.80, moq: 2000 },
    { name: 'Screen Protector Glass', hsnCode: '7007.19', basePrice: 0.50, moq: 3000 },
    { name: 'Car Charger Dual USB', hsnCode: '8504.40', basePrice: 2.00, moq: 1000 },
    { name: 'Laptop Stand Aluminum', hsnCode: '8304.00', basePrice: 8.00, moq: 200 },
    { name: 'Webcam 1080P', hsnCode: '8525.89', basePrice: 12.00, moq: 300 },
    { name: 'Gaming Mouse RGB', hsnCode: '8471.60', basePrice: 6.00, moq: 500 },
    { name: 'Keyboard Mechanical', hsnCode: '8471.60', basePrice: 15.00, moq: 200 },
    { name: 'Monitor Arm Adjustable', hsnCode: '9403.20', basePrice: 18.00, moq: 100 },
  ];
  const selectedProducts = products.slice(i % 4, (i % 4) + 2);

  return {
    id: `SUP-${String(index).padStart(3, '0')}`,
    companyName: `${loc.city} Consumer Electronics ${index - 71}`,
    partnerStatus: i % 6 === 0 ? 'premium' as PartnerStatus : 'verified' as PartnerStatus,
    status: 'active' as SupplierStatus,
    location: { country: loc.country, region: 'Various', city: loc.city },
    catalogue: [{
      category: 'Consumer Electronics',
      products: selectedProducts.map((p, j) => ({
        id: `PROD-${index}-${j + 1}`,
        name: p.name,
        hsnCode: p.hsnCode,
        description: `Quality ${p.name.toLowerCase()} for retail and wholesale markets`,
        specifications: { quality: 'Premium', warranty: '1 year' },
        pricing: { basePrice: p.basePrice, currency: 'USD', unit: 'piece', bulkPricing: generateBulkPricing(p.basePrice) },
        moq: p.moq,
        leadTime: { min: 8 + (i % 5), max: 15 + (i % 10) },
      })),
    }],
    certifications: [
      { name: 'CE', verified: true },
      { name: i % 2 === 0 ? 'FCC' : 'RoHS', verified: true },
    ],
    metrics: {
      responseRate: 85 + (i % 15),
      avgRating: 4.1 + (i % 9) / 10,
      reviewCount: 25 + i * 6,
      totalOrders: 500 + i * 60,
      onTimeDelivery: 86 + (i % 14),
    },
    contacts: [{ name: `CE Contact ${index}`, role: 'Sales', email: `sales@ce${index}.com`, phone: '+XX-XXX-XXXX' }],
    foundedYear: 2010 + (i % 12),
    employeeCount: i % 3 === 0 ? '200-500' : '100-200',
    description: `Consumer electronics manufacturer and exporter based in ${loc.city} with full OEM/ODM capabilities.`,
  };
});

// Combine all suppliers
export const MOCK_SUPPLIERS: Supplier[] = [
  ...electronicsSuppliers,
  ...moreElectronicsSuppliers,
  ...healthSuppliers,
  ...moreHealthSuppliers,
  ...consumerElectronicsSuppliers,
  ...moreConsumerSuppliers,
];

// ============================================
// SEARCH ALGORITHM
// ============================================

function calculateMatchScore(supplier: Supplier, query: SearchQuery): { score: number; matchedProducts: MatchedProduct[] } {
  let score = 0;
  const matchedProducts: MatchedProduct[] = [];

  // Keyword matching
  if (query.keyword) {
    const keyword = query.keyword.toLowerCase();
    const keywordParts = keyword.split(/\s+/).filter(p => p.length > 2);

    // Company name match
    if (supplier.companyName.toLowerCase().includes(keyword)) {
      score += 20;
    }

    // Product matching
    for (const catalogue of supplier.catalogue) {
      for (const product of catalogue.products) {
        let productScore = 0;
        const productName = product.name.toLowerCase();
        const productDesc = product.description.toLowerCase();

        // Exact product name match
        if (productName.includes(keyword)) {
          productScore += 50;
        } else {
          // Partial keyword matching
          for (const part of keywordParts) {
            if (productName.includes(part)) productScore += 15;
            if (productDesc.includes(part)) productScore += 5;
          }
        }

        // Specification matching
        for (const [, value] of Object.entries(product.specifications)) {
          if (String(value).toLowerCase().includes(keyword)) {
            productScore += 10;
          }
        }

        if (productScore > 0) {
          // Calculate price for quantity
          let priceForQuantity = product.pricing.basePrice;
          if (query.quantity) {
            const applicableTier = [...product.pricing.bulkPricing]
              .reverse()
              .find(tier => query.quantity! >= tier.minQty);
            if (applicableTier) {
              priceForQuantity = applicableTier.price;
            }
          }

          matchedProducts.push({
            product,
            relevanceScore: productScore,
            priceForQuantity,
          });
          score += productScore;
        }
      }
    }
  } else {
    // No keyword - add all products with base relevance
    for (const catalogue of supplier.catalogue) {
      for (const product of catalogue.products) {
        matchedProducts.push({
          product,
          relevanceScore: 10,
          priceForQuantity: product.pricing.basePrice,
        });
      }
    }
    score = 10;
  }

  // Category filter
  if (query.categories && query.categories.length > 0) {
    const hasCategory = supplier.catalogue.some(cat =>
      query.categories!.some(qCat =>
        cat.category.toLowerCase().replace(/\s+/g, '-') === qCat.toLowerCase() ||
        cat.category.toLowerCase().includes(qCat.toLowerCase())
      )
    );
    if (!hasCategory) {
      return { score: 0, matchedProducts: [] };
    }
    score += 10;
  }

  // Country filter
  if (query.countries && query.countries.length > 0) {
    if (!query.countries.includes(supplier.location.country)) {
      return { score: 0, matchedProducts: [] };
    }
    score += 5;
  }

  // Certification filter
  if (query.certifications && query.certifications.length > 0) {
    const hasCert = supplier.certifications.some(cert =>
      query.certifications!.includes(cert.name)
    );
    if (!hasCert) {
      return { score: 0, matchedProducts: [] };
    }
    score += 10;
  }

  // Rating filter
  if (query.minRating && supplier.metrics.avgRating < query.minRating) {
    return { score: 0, matchedProducts: [] };
  }

  // Lead time filter
  if (query.maxLeadTime) {
    const meetsLeadTime = matchedProducts.some(mp =>
      mp.product.leadTime.max <= query.maxLeadTime!
    );
    if (!meetsLeadTime && matchedProducts.length > 0) {
      return { score: 0, matchedProducts: [] };
    }
  }

  // Boost for premium suppliers
  if (supplier.partnerStatus === 'premium') {
    score += 15;
  }

  // Boost based on metrics
  score += supplier.metrics.avgRating * 2;
  score += supplier.metrics.responseRate / 10;
  score += supplier.metrics.onTimeDelivery / 20;

  // Sort matched products by relevance
  matchedProducts.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return { score: Math.min(100, Math.round(score)), matchedProducts };
}

export function searchSuppliers(query: SearchQuery): SearchResult[] {
  const results: SearchResult[] = [];

  for (const supplier of MOCK_SUPPLIERS) {
    if (supplier.status !== 'active') continue;

    const { score, matchedProducts } = calculateMatchScore(supplier, query);

    if (score > 0 && matchedProducts.length > 0) {
      results.push({
        supplier,
        matchScore: score,
        matchedProducts: matchedProducts.slice(0, 5), // Top 5 products
      });
    }
  }

  // Sort by match score descending
  results.sort((a, b) => b.matchScore - a.matchScore);

  return results;
}

export function getSupplierById(id: string): Supplier | undefined {
  return MOCK_SUPPLIERS.find(s => s.id === id);
}

export function getSuppliersByCategory(categoryId: string): Supplier[] {
  return MOCK_SUPPLIERS.filter(supplier =>
    supplier.catalogue.some(cat =>
      cat.category.toLowerCase().replace(/\s+/g, '-') === categoryId.toLowerCase()
    )
  );
}

// ============================================
// LOCAL STORAGE HELPERS
// ============================================

const STORAGE_KEYS = {
  searchHistory: 'befach-search-history',
  savedSuppliers: 'befach-saved-suppliers',
  contactedSuppliers: 'befach-contacted-suppliers',
  chatMessages: 'befach-chat-messages',
  invitations: 'befach-invitations',
};

// Search History
export interface SearchHistoryItem {
  query: string;
  timestamp: string;
  resultCount: number;
}

export function getSearchHistory(): SearchHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = safeStorage.getItem(STORAGE_KEYS.searchHistory);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addToSearchHistory(query: string, resultCount: number): void {
  if (typeof window === 'undefined') return;
  const history = getSearchHistory();
  const newItem: SearchHistoryItem = {
    query,
    timestamp: new Date().toISOString(),
    resultCount,
  };
  // Remove duplicates and add new
  const filtered = history.filter(h => h.query.toLowerCase() !== query.toLowerCase());
  const updated = [newItem, ...filtered].slice(0, 20); // Keep last 20
  safeStorage.setItem(STORAGE_KEYS.searchHistory, JSON.stringify(updated));
}

// Saved Suppliers
export function getSavedSuppliers(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = safeStorage.getItem(STORAGE_KEYS.savedSuppliers);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveSupplier(supplierId: string): void {
  if (typeof window === 'undefined') return;
  const saved = getSavedSuppliers();
  if (!saved.includes(supplierId)) {
    safeStorage.setItem(STORAGE_KEYS.savedSuppliers, JSON.stringify([...saved, supplierId]));
  }
}

export function unsaveSupplier(supplierId: string): void {
  if (typeof window === 'undefined') return;
  const saved = getSavedSuppliers();
  safeStorage.setItem(STORAGE_KEYS.savedSuppliers, JSON.stringify(saved.filter(id => id !== supplierId)));
}

export function isSupplierSaved(supplierId: string): boolean {
  return getSavedSuppliers().includes(supplierId);
}

// Chat Messages
export function getChatMessages(supplierId: string): ChatMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = safeStorage.getItem(STORAGE_KEYS.chatMessages);
    const allChats: Record<string, ChatMessage[]> = data ? JSON.parse(data) : {};
    return allChats[supplierId] || [];
  } catch {
    return [];
  }
}

export function addChatMessage(supplierId: string, message: Omit<ChatMessage, 'id' | 'timestamp' | 'supplierId'>): ChatMessage {
  if (typeof window === 'undefined') {
    return { ...message, id: '', timestamp: '', supplierId };
  }

  const newMessage: ChatMessage = {
    ...message,
    id: `MSG-${Date.now()}`,
    supplierId,
    timestamp: new Date().toISOString(),
  };

  const data = safeStorage.getItem(STORAGE_KEYS.chatMessages);
  const allChats: Record<string, ChatMessage[]> = data ? JSON.parse(data) : {};
  allChats[supplierId] = [...(allChats[supplierId] || []), newMessage];
  safeStorage.setItem(STORAGE_KEYS.chatMessages, JSON.stringify(allChats));

  return newMessage;
}

// ============================================
// INVITATION FUNCTIONS
// ============================================

// Generate random invite token
function generateInviteToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Get expiry date (7 days from now)
function getExpiryDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString();
}

// Auto-expire old invitations
function checkAndUpdateExpiredInvitations(invitations: SupplierInvitation[]): SupplierInvitation[] {
  const now = new Date();
  let updated = false;

  const result = invitations.map(inv => {
    if (inv.status === 'pending' && new Date(inv.expiresAt) < now) {
      updated = true;
      return { ...inv, status: 'expired' as const };
    }
    return inv;
  });

  if (updated && typeof window !== 'undefined') {
    safeStorage.setItem(STORAGE_KEYS.invitations, JSON.stringify(result));
  }

  return result;
}

// Get all invitations (auto-checks for expired)
export function getInvitations(): SupplierInvitation[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = safeStorage.getItem(STORAGE_KEYS.invitations);
    const invitations: SupplierInvitation[] = data ? JSON.parse(data) : [];
    return checkAndUpdateExpiredInvitations(invitations);
  } catch {
    return [];
  }
}

// Get pending invitations count (for tab badge)
export function getPendingInvitationsCount(): number {
  const invitations = getInvitations();
  return invitations.filter(inv => inv.status === 'pending').length;
}

// Create a new invitation
export interface CreateInvitationInput {
  companyName: string;
  contactName: string;
  contactEmail: string;
  phone?: string;
  category?: string;
  country?: string;
  website?: string;
  personalMessage?: string;
}

export function createInvitation(input: CreateInvitationInput): SupplierInvitation {
  if (typeof window === 'undefined') {
    return {
      ...input,
      id: '',
      status: 'pending',
      invitedAt: '',
      expiresAt: '',
      resendCount: 0,
      inviteToken: '',
    };
  }

  const newInvitation: SupplierInvitation = {
    ...input,
    id: `INV-${Date.now()}`,
    status: 'pending',
    invitedAt: new Date().toISOString(),
    expiresAt: getExpiryDate(),
    resendCount: 0,
    inviteToken: generateInviteToken(),
  };

  const invitations = getInvitations();
  safeStorage.setItem(STORAGE_KEYS.invitations, JSON.stringify([newInvitation, ...invitations]));

  return newInvitation;
}

// Create multiple invitations (bulk)
export function createBulkInvitations(inputs: CreateInvitationInput[]): SupplierInvitation[] {
  return inputs.map(input => createInvitation(input));
}

// Resend an invitation
export function resendInvitation(id: string): SupplierInvitation | null {
  if (typeof window === 'undefined') return null;

  const invitations = getInvitations();
  const index = invitations.findIndex(inv => inv.id === id);

  if (index === -1) return null;

  const updated: SupplierInvitation = {
    ...invitations[index],
    status: 'pending',
    expiresAt: getExpiryDate(),
    resendCount: invitations[index].resendCount + 1,
    lastResendAt: new Date().toISOString(),
  };

  invitations[index] = updated;
  safeStorage.setItem(STORAGE_KEYS.invitations, JSON.stringify(invitations));

  return updated;
}

// Cancel an invitation
export function cancelInvitation(id: string): boolean {
  if (typeof window === 'undefined') return false;

  const invitations = getInvitations();
  const index = invitations.findIndex(inv => inv.id === id);

  if (index === -1) return false;

  invitations[index] = {
    ...invitations[index],
    status: 'cancelled',
    cancelledAt: new Date().toISOString(),
  };

  safeStorage.setItem(STORAGE_KEYS.invitations, JSON.stringify(invitations));
  return true;
}

// Get invite link for copying
export function getInviteLink(invitation: SupplierInvitation): string {
  // In production, this would be a real URL
  return `https://befach.com/join/${invitation.inviteToken}`;
}

// Legacy addInvitation for backward compatibility
export function addInvitation(invitation: { companyName: string; contactEmail: string; contactName?: string; category?: string; message?: string }): SupplierInvitation {
  return createInvitation({
    companyName: invitation.companyName,
    contactName: invitation.contactName || '',
    contactEmail: invitation.contactEmail,
    category: invitation.category,
    personalMessage: invitation.message,
  });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(price);
}

export function formatLeadTime(leadTime: { min: number; max: number }): string {
  if (leadTime.min === leadTime.max) {
    return `${leadTime.min} days`;
  }
  return `${leadTime.min}-${leadTime.max} days`;
}

export function getSupplierStats() {
  const total = MOCK_SUPPLIERS.length;
  const premium = MOCK_SUPPLIERS.filter(s => s.partnerStatus === 'premium').length;
  const byCategory = CATEGORIES.map(cat => ({
    ...cat,
    count: MOCK_SUPPLIERS.filter(s =>
      s.catalogue.some(c => c.category.toLowerCase().replace(/\s+/g, '-') === cat.id)
    ).length,
  }));

  return { total, premium, byCategory };
}
