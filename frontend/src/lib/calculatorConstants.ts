// Shared constants for the Cost Calculator

export const shippingModes = [
  {
    id: 'sea' as const,
    name: 'Sea Freight',
    shortName: 'Sea',
    description: '20-35 days',
    baseRate: 0.02,
  },
  {
    id: 'air' as const,
    name: 'Air Freight',
    shortName: 'Air',
    description: '3-7 days',
    baseRate: 0.15,
  },
  {
    id: 'road' as const,
    name: 'Road Transport',
    shortName: 'Road',
    description: '7-15 days',
    baseRate: 0.05,
  },
];

export const commonPorts = {
  origin: [
    { code: 'SHA', name: 'Shanghai, China', country: 'CN' },
    { code: 'SZX', name: 'Shenzhen, China', country: 'CN' },
    { code: 'HKG', name: 'Hong Kong', country: 'HK' },
    { code: 'SIN', name: 'Singapore', country: 'SG' },
    { code: 'DXB', name: 'Dubai, UAE', country: 'AE' },
  ],
  destination: [
    { code: 'BOM', name: 'Mumbai (JNPT)', country: 'IN' },
    { code: 'DEL', name: 'Delhi (ICD)', country: 'IN' },
    { code: 'MAA', name: 'Chennai', country: 'IN' },
    { code: 'CCU', name: 'Kolkata', country: 'IN' },
    { code: 'BLR', name: 'Bangalore (ICD)', country: 'IN' },
  ],
};

export const predefinedCharges = [
  { name: 'Customs Clearance', amount: '50', type: 'fixed' as const },
  { name: 'Port Handling', amount: '75', type: 'fixed' as const },
  { name: 'Documentation Fee', amount: '30', type: 'fixed' as const },
  { name: 'Inspection Charges', amount: '100', type: 'fixed' as const },
  { name: 'Warehouse Storage', amount: '25', type: 'fixed' as const },
  { name: 'Demurrage', amount: '0', type: 'fixed' as const },
];

export interface CustomCharge {
  id: string;
  name: string;
  amount: string;
  type: 'fixed' | 'percentage';
}
