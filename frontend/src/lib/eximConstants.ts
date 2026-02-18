// EX-IM Data Constants

export const EXIM_COUNTRIES = [
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
];

export const EXIM_SEARCH_FIELDS = [
  { id: 'product' as const, label: 'Product', placeholder: 'e.g. headphone, LED bulb, cotton fabric...' },
  { id: 'hsnCode' as const, label: 'HS Code', placeholder: 'e.g. 85183011, 8539...' },
  { id: 'consignee' as const, label: 'Consignee', placeholder: 'e.g. Sennheiser, Samsung India...' },
  { id: 'shipper' as const, label: 'Shipper', placeholder: 'e.g. Foxconn, Haier...' },
];

export const EXIM_OPERATORS = [
  { id: 'contains' as const, label: 'Contains' },
  { id: 'exact' as const, label: 'Exact Match' },
  { id: 'startsWith' as const, label: 'Starts With' },
];

export const EXIM_DATA_TYPES = [
  { id: 'import' as const, label: 'Import' },
  { id: 'export' as const, label: 'Export' },
];

export const COMMON_PORTS = [
  { code: 'INNSA', name: 'Nhava Sheva', country: 'India' },
  { code: 'INMAA', name: 'Chennai', country: 'India' },
  { code: 'INBOM', name: 'Mumbai', country: 'India' },
  { code: 'INDEL', name: 'Delhi ICD', country: 'India' },
  { code: 'INCCU', name: 'Kolkata', country: 'India' },
  { code: 'CNSHA', name: 'Shanghai', country: 'China' },
  { code: 'CNSZX', name: 'Shenzhen', country: 'China' },
  { code: 'CNNBO', name: 'Ningbo', country: 'China' },
  { code: 'VNSGN', name: 'Ho Chi Minh City', country: 'Vietnam' },
  { code: 'KRPUS', name: 'Busan', country: 'South Korea' },
  { code: 'JPYOK', name: 'Yokohama', country: 'Japan' },
  { code: 'DEHAM', name: 'Hamburg', country: 'Germany' },
  { code: 'GBLON', name: 'London Gateway', country: 'United Kingdom' },
  { code: 'USNYC', name: 'New York', country: 'United States' },
  { code: 'USLAX', name: 'Los Angeles', country: 'United States' },
  { code: 'AEJEA', name: 'Jebel Ali', country: 'UAE' },
  { code: 'SGSIN', name: 'Singapore', country: 'Singapore' },
  { code: 'TWISL', name: 'Kaohsiung', country: 'Taiwan' },
  { code: 'BDDAC', name: 'Dhaka', country: 'Bangladesh' },
  { code: 'TRIST', name: 'Istanbul', country: 'Turkey' },
];

export const DATE_PRESETS = [
  { id: '30d', label: 'Last 30 Days', days: 30 },
  { id: '90d', label: 'Last 90 Days', days: 90 },
  { id: '6m', label: 'Last 6 Months', days: 180 },
  { id: '1y', label: 'Last 1 Year', days: 365 },
];

export const SORT_OPTIONS = [
  { id: 'date-desc', label: 'Date (Newest First)', field: 'date' as const, direction: 'desc' as const },
  { id: 'date-asc', label: 'Date (Oldest First)', field: 'date' as const, direction: 'asc' as const },
  { id: 'value-desc', label: 'Value (Highest)', field: 'valueUSD' as const, direction: 'desc' as const },
  { id: 'value-asc', label: 'Value (Lowest)', field: 'valueUSD' as const, direction: 'asc' as const },
  { id: 'qty-desc', label: 'Quantity (Highest)', field: 'quantity' as const, direction: 'desc' as const },
];

export const RESULTS_PER_PAGE = 15;

export const STAT_PILL_COLORS: Record<string, string> = {
  shipments: '#f97316',
  consignees: '#059669',
  shippers: '#d97706',
  countriesOfOrigin: '#7c3aed',
  portsOfDestination: '#0891b2',
  hsCodes: '#dc2626',
  notifyParties: '#4b5563',
};
