// EX-IM Data Types and Interfaces

// ─── Core Shipment Record ─────────────────────────────────

export interface ShipmentRecord {
  id: string;
  date: string; // ISO date
  dataType: 'import' | 'export';
  hsnCode: string;
  productDescription: string;
  consigneeName: string;
  consigneeId: string;
  consigneeCity: string;
  shipperName: string;
  shipperId: string;
  notifyPartyName: string;
  countryOfOrigin: string;
  portOfDestination: string;
  portOfOrigin: string;
  quantity: number;
  quantityUnit: string;
  valueUSD: number;
  weightKg: number;
  billOfLadingNo: string;
  isDuplicate: boolean;
  isBankingEntity: boolean;
  isShippingEntity: boolean;
  isToOrder: boolean;
}

// ─── Aggregated Trader (Consignee or Shipper) ─────────────

export interface TraderSummary {
  id: string;
  name: string;
  country: string;
  city: string;
  totalShipments: number;
  totalValueUSD: number;
  topProducts: string[];
  topHSCodes: string[];
  topPartnerCountries: string[];
  firstShipmentDate: string;
  lastShipmentDate: string;
}

// ─── Trader Detail (modal click-through) ──────────────────

export interface TraderDetail extends TraderSummary {
  recentShipments: ShipmentRecord[];
  monthlyVolume: { month: string; value: number; shipments: number }[];
  productBreakdown: { product: string; hsnCode: string; value: number; percentage: number }[];
  countryBreakdown: { country: string; value: number; percentage: number }[];
}

// ─── Search & Filters ─────────────────────────────────────

export type EximSearchField = 'product' | 'hsnCode' | 'consignee' | 'shipper';
export type EximOperator = 'contains' | 'exact' | 'startsWith';
export type EximDataType = 'import' | 'export';

export interface EximSearchParams {
  country: string;
  dataType: EximDataType;
  searchField: EximSearchField;
  operator: EximOperator;
  searchTerms: string[];
  dateFrom: string;
  dateTo: string;
}

export interface EximFilterToggles {
  removeDuplicates: boolean;
  removeToOrder: boolean;
  removeBankingEntity: boolean;
  removeShippingEntity: boolean;
}

export interface EximSidebarFilters extends EximFilterToggles {
  consigneeFilter: string[];
  shipperFilter: string[];
}

// ─── Summary Stats (stat pills bar) ──────────────────────

export interface EximStats {
  shipments: number;
  consignees: number;
  shippers: number;
  countriesOfOrigin: number;
  portsOfDestination: number;
  hsCodes: number;
  notifyParties: number;
}

// ─── Country Breakdown ───────────────────────────────────

export interface CountryBreakdown {
  country: string;
  shipments: number;
  valueUSD: number;
  percentage: number;
}

// ─── HS Code Breakdown ───────────────────────────────────

export interface HSCodeBreakdown {
  hsnCode: string;
  description: string;
  shipments: number;
  valueUSD: number;
  topConsignees: string[];
}

// ─── Sort ────────────────────────────────────────────────

export type EximSortField = 'date' | 'valueUSD' | 'quantity' | 'consigneeName' | 'shipperName' | 'hsnCode';
export type SortDirection = 'asc' | 'desc';

// ─── Autocomplete ────────────────────────────────────────

export interface SearchSuggestion {
  text: string;
  type: EximSearchField;
  matchCount: number;
}
