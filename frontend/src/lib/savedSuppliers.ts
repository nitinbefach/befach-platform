// Saved Suppliers - CRM for Supplier Network (Relationship Hub)
// Manages saved supplier relationships with pipeline-based stages, tags, notes, and integrations

// Import lucide-react icons
import {
  Send,
  MessageSquare,
  Package,
  CheckCircle,
  Pause,
  Ban,
  type LucideIcon
} from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

// Relationship Stage - tracks supplier journey through the pipeline
export type RelationshipStage =
  | 'contacted'       // Initial outreach made
  | 'negotiating'     // In active discussions
  | 'deal_active'     // Active orders/projects in progress
  | 'deal_completed'  // Past successful transactions
  | 'on_hold'         // Temporarily paused relationship
  | 'blocked';        // Blocked supplier

// Stage history entry for tracking changes
export interface StageHistoryEntry {
  id: string;
  fromStage: RelationshipStage | null;
  toStage: RelationshipStage;
  changedAt: string;
  reason?: string;
}

// Stage configuration with metadata
export interface StageConfig {
  label: string;
  description: string;
  color: string;
  bgColor: string;
  icon: LucideIcon;
  canTransitionTo: RelationshipStage[];
  quickActions: string[];
}

export const RELATIONSHIP_STAGE_CONFIG: Record<RelationshipStage, StageConfig> = {
  contacted: {
    label: 'Contacted',
    description: 'Initial outreach made, awaiting response',
    color: '#8B5CF6',
    bgColor: 'rgba(139, 92, 246, 0.15)',
    icon: Send,
    canTransitionTo: ['negotiating', 'on_hold', 'blocked'],
    quickActions: ['message', 'send_rfq', 'schedule_followup']
  },
  negotiating: {
    label: 'Negotiating',
    description: 'In active price/terms discussions',
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.15)',
    icon: MessageSquare,
    canTransitionTo: ['deal_active', 'contacted', 'on_hold', 'blocked'],
    quickActions: ['message', 'view_quotes', 'send_rfq']
  },
  deal_active: {
    label: 'Deal Active',
    description: 'Active orders or projects in progress',
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.15)',
    icon: Package,
    canTransitionTo: ['deal_completed', 'negotiating', 'on_hold'],
    quickActions: ['view_orders', 'message', 'track_shipment']
  },
  deal_completed: {
    label: 'Completed',
    description: 'Past successful transactions',
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.15)',
    icon: CheckCircle,
    canTransitionTo: ['negotiating', 'contacted', 'blocked'],
    quickActions: ['reorder', 'message', 'send_rfq']
  },
  on_hold: {
    label: 'On Hold',
    description: 'Relationship temporarily paused',
    color: '#6B7280',
    bgColor: 'rgba(107, 114, 128, 0.15)',
    icon: Pause,
    canTransitionTo: ['contacted', 'negotiating', 'blocked'],
    quickActions: ['resume', 'message', 'add_note']
  },
  blocked: {
    label: 'Blocked',
    description: 'No further business intended',
    color: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    icon: Ban,
    canTransitionTo: ['contacted'],
    quickActions: ['unblock', 'add_note']
  }
};

export interface SavedSupplier {
  id: string;

  // Supplier Info
  name: string;
  country: string;
  countryFlag: string;
  location: string;
  category: string;
  specialization: string;
  verified: boolean;
  rating: number;

  // Contact Info
  contactPerson?: string;
  email?: string;
  phone?: string;
  website?: string;

  // Relationship Stage (replaces old status)
  relationshipStage: RelationshipStage;
  stageChangedAt: string;
  stageHistory: StageHistoryEntry[];

  // Source tracking
  source: 'discovery' | 'invitation' | 'inbox' | 'manual' | 'import';
  sourceId?: string;

  // Organization
  tags: string[];
  notes?: string;
  priority: 'low' | 'medium' | 'high';

  // Communication tracking
  lastContactedDate?: string;
  nextFollowUpDate?: string;
  communicationCount: number;

  // Statistics
  totalOrders: number;
  totalOrderValue: number;
  lastOrderDate?: string;
  avgOrderValue?: number;

  // Deal tracking
  activeDeals: number;
  completedDeals: number;
  pendingQuotes: number;

  // Timestamps
  savedAt: string;
  updatedAt: string;
}

// Pipeline statistics
export interface PipelineStats {
  totalSuppliers: number;
  byStage: Record<RelationshipStage, number>;
  pendingFollowUps: number;
  overdueFollowUps: number;
  activeDealValue: number;
  newContactsThisMonth: number;
  conversionRate: number;
}

// Filter preset for saving common filters
export interface FilterPreset {
  id: string;
  name: string;
  filters: FilterOptions;
  createdAt: string;
  isDefault?: boolean;
}

export type SortOption = 'recent' | 'name' | 'rating' | 'orders' | 'lastContacted' | 'orderValue' | 'stage';

export interface FilterOptions {
  search: string;
  category: string;
  tags: string[];
  relationshipStages: RelationshipStage[];
  source: string;
  minRating: number;
  priority: 'all' | 'low' | 'medium' | 'high';
  // Date range filters
  dateAddedFrom?: string;
  dateAddedTo?: string;
  lastContactedFrom?: string;
  lastContactedTo?: string;
  // Activity filters
  needsFollowUp: boolean;
  hasActiveDeals: boolean;
  hasPendingQuotes: boolean;
}

// Default filter options
export const DEFAULT_FILTERS: FilterOptions = {
  search: '',
  category: '',
  tags: [],
  relationshipStages: [],
  source: '',
  minRating: 0,
  priority: 'all',
  needsFollowUp: false,
  hasActiveDeals: false,
  hasPendingQuotes: false
};

// ============================================================================
// CONSTANTS
// ============================================================================

export const SUGGESTED_TAGS = [
  // Quality
  'Premium Quality',
  'Budget Friendly',
  'Good Quality',
  // Service
  'Fast Shipping',
  'Reliable',
  'Good Communication',
  'Flexible MOQ',
  // Business
  'Long-term Partner',
  'New Supplier',
  'Exclusive',
  'Sample Received',
  // Status
  'Needs Follow-up',
  'Waiting Quote',
  'Contract Pending'
];

export const AUTO_CATEGORIES = [
  'Electronics',
  'Textiles & Apparel',
  'Home & Garden',
  'Industrial Equipment',
  'Auto Parts',
  'Health & Beauty',
  'Food & Beverage',
  'Packaging',
  'Machinery',
  'Building Materials'
];

const STORAGE_KEY = 'befach-saved-suppliers';

// ============================================================================
// STORAGE OPERATIONS
// ============================================================================

export function getSavedSuppliers(): SavedSupplier[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];

  const suppliers = JSON.parse(data);

  // Auto-migrate old data format inline
  const needsMigration = suppliers.some((s: any) => s.status && !s.relationshipStage);
  if (needsMigration) {
    const stageMapping: Record<string, RelationshipStage> = {
      'active': 'deal_active',
      'pending': 'contacted',
      'inactive': 'on_hold',
      'blocked': 'blocked'
    };
    const now = new Date().toISOString();

    const migrated = suppliers.map((supplier: any) => {
      if (supplier.relationshipStage) return supplier;
      return {
        ...supplier,
        relationshipStage: stageMapping[supplier.status] || 'contacted',
        stageChangedAt: supplier.updatedAt || now,
        stageHistory: [],
        priority: supplier.priority || 'medium',
        communicationCount: supplier.communicationCount || 0,
        activeDeals: supplier.activeDeals || (supplier.status === 'active' ? 1 : 0),
        completedDeals: supplier.completedDeals || supplier.totalOrders || 0,
        pendingQuotes: supplier.pendingQuotes || 0
      };
    });
    saveSuppliersToStorage(migrated);
    return migrated;
  }

  return suppliers;
}

function saveSuppliersToStorage(suppliers: SavedSupplier[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(suppliers));
}

// ============================================================================
// CRUD OPERATIONS
// ============================================================================

export function getSavedSupplier(id: string): SavedSupplier | null {
  const suppliers = getSavedSuppliers();
  return suppliers.find(s => s.id === id) || null;
}

export function getSavedSupplierByName(name: string): SavedSupplier | null {
  const suppliers = getSavedSuppliers();
  return suppliers.find(s => s.name.toLowerCase() === name.toLowerCase()) || null;
}

export function saveSupplier(supplier: Omit<SavedSupplier, 'id' | 'savedAt' | 'updatedAt'>): SavedSupplier {
  const suppliers = getSavedSuppliers();

  // Check if already exists
  const existing = suppliers.find(s => s.name.toLowerCase() === supplier.name.toLowerCase());
  if (existing) {
    return updateSupplier(existing.id, supplier);
  }

  const newSupplier: SavedSupplier = {
    ...supplier,
    id: `supplier-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    savedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  suppliers.push(newSupplier);
  saveSuppliersToStorage(suppliers);
  return newSupplier;
}

export function updateSupplier(id: string, updates: Partial<SavedSupplier>): SavedSupplier {
  const suppliers = getSavedSuppliers();
  const index = suppliers.findIndex(s => s.id === id);

  if (index === -1) {
    throw new Error(`Supplier with id ${id} not found`);
  }

  suppliers[index] = {
    ...suppliers[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  saveSuppliersToStorage(suppliers);
  return suppliers[index];
}

export function removeSupplier(id: string): boolean {
  const suppliers = getSavedSuppliers();
  const filtered = suppliers.filter(s => s.id !== id);

  if (filtered.length === suppliers.length) {
    return false;
  }

  saveSuppliersToStorage(filtered);
  return true;
}

// ============================================================================
// TAG OPERATIONS
// ============================================================================

export function addTag(supplierId: string, tag: string): SavedSupplier {
  const supplier = getSavedSupplier(supplierId);
  if (!supplier) throw new Error('Supplier not found');

  if (!supplier.tags.includes(tag)) {
    return updateSupplier(supplierId, {
      tags: [...supplier.tags, tag]
    });
  }
  return supplier;
}

export function removeTag(supplierId: string, tag: string): SavedSupplier {
  const supplier = getSavedSupplier(supplierId);
  if (!supplier) throw new Error('Supplier not found');

  return updateSupplier(supplierId, {
    tags: supplier.tags.filter(t => t !== tag)
  });
}

export function updateNotes(supplierId: string, notes: string): SavedSupplier {
  return updateSupplier(supplierId, { notes });
}

// ============================================================================
// FILTERING & SORTING
// ============================================================================

export function filterSuppliers(suppliers: SavedSupplier[], filters: FilterOptions): SavedSupplier[] {
  return suppliers.filter(supplier => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        supplier.name.toLowerCase().includes(searchLower) ||
        supplier.specialization.toLowerCase().includes(searchLower) ||
        supplier.location.toLowerCase().includes(searchLower) ||
        supplier.contactPerson?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Category filter
    if (filters.category && supplier.category !== filters.category) {
      return false;
    }

    // Tags filter (must have ALL selected tags)
    if (filters.tags.length > 0) {
      const hasAllTags = filters.tags.every(tag => supplier.tags.includes(tag));
      if (!hasAllTags) return false;
    }

    // Relationship stage filter (multi-select - must match ANY selected stage)
    if (filters.relationshipStages.length > 0) {
      if (!filters.relationshipStages.includes(supplier.relationshipStage)) {
        return false;
      }
    }

    // Source filter
    if (filters.source && supplier.source !== filters.source) {
      return false;
    }

    // Rating filter
    if (filters.minRating > 0 && supplier.rating < filters.minRating) {
      return false;
    }

    // Priority filter
    if (filters.priority !== 'all' && supplier.priority !== filters.priority) {
      return false;
    }

    // Date range filters
    if (filters.dateAddedFrom) {
      const addedDate = new Date(supplier.savedAt);
      const fromDate = new Date(filters.dateAddedFrom);
      if (addedDate < fromDate) return false;
    }
    if (filters.dateAddedTo) {
      const addedDate = new Date(supplier.savedAt);
      const toDate = new Date(filters.dateAddedTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      if (addedDate > toDate) return false;
    }

    if (filters.lastContactedFrom && supplier.lastContactedDate) {
      const contactDate = new Date(supplier.lastContactedDate);
      const fromDate = new Date(filters.lastContactedFrom);
      if (contactDate < fromDate) return false;
    }
    if (filters.lastContactedTo && supplier.lastContactedDate) {
      const contactDate = new Date(supplier.lastContactedDate);
      const toDate = new Date(filters.lastContactedTo);
      toDate.setHours(23, 59, 59, 999);
      if (contactDate > toDate) return false;
    }

    // Activity filters
    if (filters.needsFollowUp) {
      const hasFollowUp = supplier.nextFollowUpDate && new Date(supplier.nextFollowUpDate) <= new Date();
      if (!hasFollowUp) return false;
    }

    if (filters.hasActiveDeals) {
      if (supplier.activeDeals <= 0) return false;
    }

    if (filters.hasPendingQuotes) {
      if (supplier.pendingQuotes <= 0) return false;
    }

    return true;
  });
}

// Stage order for sorting
const STAGE_ORDER: RelationshipStage[] = ['contacted', 'negotiating', 'deal_active', 'deal_completed', 'on_hold', 'blocked'];

export function sortSuppliers(suppliers: SavedSupplier[], sortBy: SortOption): SavedSupplier[] {
  const sorted = [...suppliers];

  switch (sortBy) {
    case 'recent':
      return sorted.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'orders':
      return sorted.sort((a, b) => b.totalOrders - a.totalOrders);
    case 'lastContacted':
      return sorted.sort((a, b) => {
        if (!a.lastContactedDate) return 1;
        if (!b.lastContactedDate) return -1;
        return new Date(b.lastContactedDate).getTime() - new Date(a.lastContactedDate).getTime();
      });
    case 'orderValue':
      return sorted.sort((a, b) => b.totalOrderValue - a.totalOrderValue);
    case 'stage':
      return sorted.sort((a, b) => {
        const aIndex = STAGE_ORDER.indexOf(a.relationshipStage);
        const bIndex = STAGE_ORDER.indexOf(b.relationshipStage);
        return aIndex - bIndex;
      });
    default:
      return sorted;
  }
}

// ============================================================================
// STATISTICS & PIPELINE
// ============================================================================

export function getPipelineStats(suppliers: SavedSupplier[]): PipelineStats {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const byStage: Record<RelationshipStage, number> = {
    contacted: 0,
    negotiating: 0,
    deal_active: 0,
    deal_completed: 0,
    on_hold: 0,
    blocked: 0
  };

  let pendingFollowUps = 0;
  let overdueFollowUps = 0;
  let activeDealValue = 0;
  let newContactsThisMonth = 0;

  suppliers.forEach(s => {
    byStage[s.relationshipStage]++;

    if (s.nextFollowUpDate) {
      const followUpDate = new Date(s.nextFollowUpDate);
      if (followUpDate > now) pendingFollowUps++;
      else overdueFollowUps++;
    }

    if (s.relationshipStage === 'deal_active') {
      activeDealValue += s.totalOrderValue;
    }

    if (new Date(s.savedAt) >= monthStart) {
      newContactsThisMonth++;
    }
  });

  const totalContacted = byStage.contacted + byStage.negotiating + byStage.deal_active + byStage.deal_completed;
  const converted = byStage.deal_active + byStage.deal_completed;
  const conversionRate = totalContacted > 0 ? (converted / totalContacted) * 100 : 0;

  return {
    totalSuppliers: suppliers.length,
    byStage,
    pendingFollowUps,
    overdueFollowUps,
    activeDealValue,
    newContactsThisMonth,
    conversionRate: Math.round(conversionRate * 10) / 10
  };
}

// Legacy stats function for backward compatibility
export function getSupplierStats(suppliers: SavedSupplier[]): { totalSaved: number; activePartnerships: number; avgRating: number; totalOrders: number } {
  const activeSuppliers = suppliers.filter(s => s.relationshipStage === 'deal_active' || s.relationshipStage === 'deal_completed');
  const totalOrders = suppliers.reduce((sum, s) => sum + s.totalOrders, 0);
  const avgRating = suppliers.length > 0
    ? suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length
    : 0;

  return {
    totalSaved: suppliers.length,
    activePartnerships: activeSuppliers.length,
    avgRating: Math.round(avgRating * 10) / 10,
    totalOrders
  };
}

// ============================================================================
// STAGE TRANSITION
// ============================================================================

export function canTransitionStage(
  currentStage: RelationshipStage,
  newStage: RelationshipStage
): boolean {
  return RELATIONSHIP_STAGE_CONFIG[currentStage].canTransitionTo.includes(newStage);
}

export function transitionSupplierStage(
  supplierId: string,
  newStage: RelationshipStage,
  reason?: string
): SavedSupplier {
  const supplier = getSavedSupplier(supplierId);
  if (!supplier) throw new Error('Supplier not found');

  if (!canTransitionStage(supplier.relationshipStage, newStage)) {
    throw new Error(`Invalid transition from ${supplier.relationshipStage} to ${newStage}`);
  }

  const now = new Date().toISOString();
  const historyEntry: StageHistoryEntry = {
    id: `history-${Date.now()}`,
    fromStage: supplier.relationshipStage,
    toStage: newStage,
    changedAt: now,
    reason
  };

  return updateSupplier(supplierId, {
    relationshipStage: newStage,
    stageChangedAt: now,
    stageHistory: [...supplier.stageHistory, historyEntry]
  });
}

export function getAvailableTransitions(currentStage: RelationshipStage): RelationshipStage[] {
  return RELATIONSHIP_STAGE_CONFIG[currentStage].canTransitionTo;
}

// ============================================================================
// FILTER PRESETS
// ============================================================================

const PRESETS_STORAGE_KEY = 'befach-supplier-filter-presets';

export function getFilterPresets(): FilterPreset[] {
  if (typeof window === 'undefined') return getDefaultPresets();
  const data = localStorage.getItem(PRESETS_STORAGE_KEY);
  if (!data) {
    const defaults = getDefaultPresets();
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  }
  return JSON.parse(data);
}

export function saveFilterPreset(name: string, filters: FilterOptions): FilterPreset {
  const presets = getFilterPresets();
  const newPreset: FilterPreset = {
    id: `preset-${Date.now()}`,
    name,
    filters,
    createdAt: new Date().toISOString()
  };
  presets.push(newPreset);
  localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets));
  return newPreset;
}

export function deleteFilterPreset(presetId: string): boolean {
  const presets = getFilterPresets();
  const filtered = presets.filter(p => p.id !== presetId && !p.isDefault);
  if (filtered.length === presets.length) return false;
  localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

export function getDefaultPresets(): FilterPreset[] {
  return [
    {
      id: 'preset-needs-attention',
      name: 'Needs Attention',
      filters: { ...DEFAULT_FILTERS, needsFollowUp: true },
      createdAt: new Date().toISOString(),
      isDefault: true
    },
    {
      id: 'preset-active-deals',
      name: 'Active Deals',
      filters: { ...DEFAULT_FILTERS, relationshipStages: ['deal_active'] },
      createdAt: new Date().toISOString(),
      isDefault: true
    },
    {
      id: 'preset-negotiating',
      name: 'In Negotiation',
      filters: { ...DEFAULT_FILTERS, relationshipStages: ['negotiating'] },
      createdAt: new Date().toISOString(),
      isDefault: true
    },
    {
      id: 'preset-top-suppliers',
      name: 'Top Suppliers',
      filters: { ...DEFAULT_FILTERS, minRating: 4.5, relationshipStages: ['deal_completed'] },
      createdAt: new Date().toISOString(),
      isDefault: true
    }
  ];
}

// ============================================================================
// EXPORT TO CSV
// ============================================================================

export function exportToCSV(suppliers: SavedSupplier[]): string {
  const headers = [
    'Name',
    'Country',
    'Location',
    'Category',
    'Specialization',
    'Rating',
    'Relationship Stage',
    'Priority',
    'Contact Person',
    'Email',
    'Phone',
    'Website',
    'Total Orders',
    'Total Order Value',
    'Active Deals',
    'Completed Deals',
    'Tags',
    'Notes',
    'Source',
    'Last Contacted',
    'Saved Date'
  ];

  const rows = suppliers.map(s => [
    s.name,
    s.country,
    s.location,
    s.category,
    s.specialization,
    s.rating.toString(),
    RELATIONSHIP_STAGE_CONFIG[s.relationshipStage].label,
    s.priority,
    s.contactPerson || '',
    s.email || '',
    s.phone || '',
    s.website || '',
    s.totalOrders.toString(),
    `$${s.totalOrderValue.toLocaleString()}`,
    s.activeDeals.toString(),
    s.completedDeals.toString(),
    s.tags.join('; '),
    s.notes || '',
    s.source,
    s.lastContactedDate ? new Date(s.lastContactedDate).toLocaleDateString() : '',
    new Date(s.savedAt).toLocaleDateString()
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  return csvContent;
}

export function downloadCSV(suppliers: SavedSupplier[], filename = 'saved-suppliers.csv'): void {
  const csv = exportToCSV(suppliers);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

// ============================================================================
// CATEGORY DETECTION
// ============================================================================

export function detectCategory(specialization: string): string {
  const specLower = specialization.toLowerCase();

  if (specLower.includes('electronic') || specLower.includes('led') || specLower.includes('circuit') || specLower.includes('mobile') || specLower.includes('phone') || specLower.includes('computer')) {
    return 'Electronics';
  }
  if (specLower.includes('textile') || specLower.includes('fabric') || specLower.includes('cloth') || specLower.includes('apparel') || specLower.includes('garment')) {
    return 'Textiles & Apparel';
  }
  if (specLower.includes('home') || specLower.includes('garden') || specLower.includes('furniture') || specLower.includes('decor')) {
    return 'Home & Garden';
  }
  if (specLower.includes('industrial') || specLower.includes('equipment') || specLower.includes('tool')) {
    return 'Industrial Equipment';
  }
  if (specLower.includes('auto') || specLower.includes('car') || specLower.includes('vehicle') || specLower.includes('motor')) {
    return 'Auto Parts';
  }
  if (specLower.includes('health') || specLower.includes('beauty') || specLower.includes('cosmetic') || specLower.includes('medical')) {
    return 'Health & Beauty';
  }
  if (specLower.includes('food') || specLower.includes('beverage') || specLower.includes('drink')) {
    return 'Food & Beverage';
  }
  if (specLower.includes('packaging') || specLower.includes('box') || specLower.includes('container')) {
    return 'Packaging';
  }
  if (specLower.includes('machine') || specLower.includes('machinery')) {
    return 'Machinery';
  }
  if (specLower.includes('building') || specLower.includes('construction') || specLower.includes('material')) {
    return 'Building Materials';
  }

  return 'Electronics'; // Default
}

// ============================================================================
// DEMO DATA GENERATOR
// ============================================================================

const DEMO_SUPPLIERS: Omit<SavedSupplier, 'id' | 'savedAt' | 'updatedAt'>[] = [
  {
    name: 'Shenzhen Lighting Co.',
    country: 'China',
    countryFlag: '🇨🇳',
    location: 'Shenzhen, China',
    category: 'Electronics',
    specialization: 'LED Lights, LED Bulbs, LED Panels, Smart Lighting',
    verified: true,
    rating: 4.8,
    contactPerson: 'John Wang',
    email: 'john@shenzhen-lighting.com',
    phone: '+86 755 1234 5678',
    website: 'shenzhen-lighting.com',
    relationshipStage: 'deal_active',
    stageChangedAt: '2025-11-15T10:00:00Z',
    stageHistory: [],
    source: 'inbox',
    tags: ['Premium Quality', 'Reliable', 'Long-term Partner'],
    notes: 'Great supplier for LED products. Always delivers 2-3 days early. Good at custom packaging. Ask for John - he speaks English well.',
    priority: 'high',
    communicationCount: 45,
    totalOrders: 127,
    totalOrderValue: 245000,
    lastOrderDate: '2025-11-28',
    lastContactedDate: '2025-12-01',
    activeDeals: 3,
    completedDeals: 124,
    pendingQuotes: 1
  },
  {
    name: 'Vietnam Tech Electronics',
    country: 'Vietnam',
    countryFlag: '🇻🇳',
    location: 'Hanoi, Vietnam',
    category: 'Electronics',
    specialization: 'Mobile Accessories, Phone Cases, Chargers, Cables',
    verified: true,
    rating: 4.9,
    contactPerson: 'Nguyen Minh',
    email: 'minh@vietnam-tech.vn',
    phone: '+84 912 345 678',
    website: 'vietnam-tech.vn',
    relationshipStage: 'deal_completed',
    stageChangedAt: '2025-11-25T14:00:00Z',
    stageHistory: [],
    source: 'invitation',
    tags: ['Fast Shipping', 'Good Communication', 'Flexible MOQ'],
    notes: 'Very responsive. Can do small MOQs for testing. Quality improved significantly in 2024.',
    priority: 'high',
    communicationCount: 38,
    totalOrders: 98,
    totalOrderValue: 125000,
    lastOrderDate: '2025-11-25',
    lastContactedDate: '2025-11-30',
    activeDeals: 0,
    completedDeals: 98,
    pendingQuotes: 0
  },
  {
    name: 'Dhaka Textiles Ltd.',
    country: 'Bangladesh',
    countryFlag: '🇧🇩',
    location: 'Dhaka, Bangladesh',
    category: 'Textiles & Apparel',
    specialization: 'Cotton Fabrics, Garments, T-shirts, Polo Shirts',
    verified: true,
    rating: 4.6,
    contactPerson: 'Rahman Ahmed',
    email: 'rahman@dhaka-textiles.bd',
    phone: '+880 1711 234 567',
    relationshipStage: 'deal_active',
    stageChangedAt: '2025-11-10T09:00:00Z',
    stageHistory: [],
    source: 'discovery',
    tags: ['Budget Friendly', 'Good Quality'],
    notes: 'Best for bulk cotton products. Lead time can vary during peak season.',
    priority: 'medium',
    communicationCount: 28,
    totalOrders: 84,
    totalOrderValue: 178000,
    lastOrderDate: '2025-11-20',
    lastContactedDate: '2025-11-28',
    activeDeals: 2,
    completedDeals: 82,
    pendingQuotes: 0
  },
  {
    name: 'Guangzhou Audio Tech',
    country: 'China',
    countryFlag: '🇨🇳',
    location: 'Guangzhou, China',
    category: 'Electronics',
    specialization: 'Bluetooth Speakers, Headphones, Audio Equipment, TWS Earbuds',
    verified: true,
    rating: 4.7,
    contactPerson: 'Lisa Chen',
    email: 'lisa@gz-audiotech.cn',
    phone: '+86 20 8765 4321',
    website: 'gz-audiotech.cn',
    relationshipStage: 'negotiating',
    stageChangedAt: '2025-11-20T11:00:00Z',
    stageHistory: [],
    source: 'inbox',
    tags: ['Waiting Quote', 'Sample Received'],
    notes: 'Sent samples in November. Quality is good. Waiting for final pricing for 5000 units.',
    priority: 'high',
    communicationCount: 15,
    totalOrders: 72,
    totalOrderValue: 156000,
    lastOrderDate: '2025-10-15',
    lastContactedDate: '2025-11-25',
    nextFollowUpDate: '2025-12-05',
    activeDeals: 0,
    completedDeals: 72,
    pendingQuotes: 2
  },
  {
    name: 'Taiwan Solar Industries',
    country: 'Taiwan',
    countryFlag: '🇹🇼',
    location: 'Taipei, Taiwan',
    category: 'Electronics',
    specialization: 'Solar Panels, Renewable Energy Equipment, Inverters',
    verified: true,
    rating: 4.9,
    contactPerson: 'David Lin',
    email: 'david@taiwan-solar.tw',
    phone: '+886 2 2345 6789',
    website: 'taiwan-solar.tw',
    relationshipStage: 'deal_completed',
    stageChangedAt: '2025-11-10T16:00:00Z',
    stageHistory: [],
    source: 'discovery',
    tags: ['Premium Quality', 'Reliable', 'Exclusive'],
    notes: 'Top-tier quality. Higher prices but worth it for solar products. Excellent certifications.',
    priority: 'high',
    communicationCount: 22,
    totalOrders: 56,
    totalOrderValue: 890000,
    lastOrderDate: '2025-11-10',
    lastContactedDate: '2025-11-22',
    activeDeals: 0,
    completedDeals: 56,
    pendingQuotes: 0
  },
  {
    name: 'Bangkok Components Co.',
    country: 'Thailand',
    countryFlag: '🇹🇭',
    location: 'Bangkok, Thailand',
    category: 'Electronics',
    specialization: 'Electronic Components, Capacitors, Resistors, PCB',
    verified: true,
    rating: 4.5,
    contactPerson: 'Somchai Prasert',
    email: 'somchai@bangkok-comp.th',
    phone: '+66 2 345 6789',
    relationshipStage: 'deal_active',
    stageChangedAt: '2025-11-01T08:00:00Z',
    stageHistory: [],
    source: 'inbox',
    tags: ['Good Communication', 'Flexible MOQ'],
    notes: 'Good for small batch components. Quick response on quotes.',
    priority: 'medium',
    communicationCount: 18,
    totalOrders: 43,
    totalOrderValue: 67000,
    lastOrderDate: '2025-11-05',
    lastContactedDate: '2025-11-18',
    activeDeals: 1,
    completedDeals: 42,
    pendingQuotes: 0
  },
  {
    name: 'Mumbai Fabrics International',
    country: 'India',
    countryFlag: '🇮🇳',
    location: 'Mumbai, India',
    category: 'Textiles & Apparel',
    specialization: 'Silk Fabrics, Traditional Textiles, Embroidered Materials',
    verified: true,
    rating: 4.4,
    contactPerson: 'Priya Sharma',
    email: 'priya@mumbai-fabrics.in',
    phone: '+91 22 2345 6789',
    website: 'mumbai-fabrics.in',
    relationshipStage: 'deal_completed',
    stageChangedAt: '2025-10-28T12:00:00Z',
    stageHistory: [],
    source: 'invitation',
    tags: ['Premium Quality', 'Long-term Partner'],
    notes: 'Excellent for premium silk products. Unique designs available.',
    priority: 'medium',
    communicationCount: 24,
    totalOrders: 38,
    totalOrderValue: 145000,
    lastOrderDate: '2025-10-28',
    lastContactedDate: '2025-11-15',
    activeDeals: 0,
    completedDeals: 38,
    pendingQuotes: 0
  },
  {
    name: 'Yiwu Trading House',
    country: 'China',
    countryFlag: '🇨🇳',
    location: 'Yiwu, China',
    category: 'Home & Garden',
    specialization: 'Home Decor, Kitchen Items, Storage Solutions, Small Appliances',
    verified: true,
    rating: 4.3,
    contactPerson: 'Michael Zhang',
    email: 'michael@yiwu-trading.cn',
    phone: '+86 579 8765 4321',
    relationshipStage: 'deal_active',
    stageChangedAt: '2025-11-28T10:00:00Z',
    stageHistory: [],
    source: 'discovery',
    tags: ['Budget Friendly', 'Fast Shipping'],
    notes: 'Great for variety products. Can source almost anything. Good for mixed containers.',
    priority: 'medium',
    communicationCount: 32,
    totalOrders: 95,
    totalOrderValue: 89000,
    lastOrderDate: '2025-11-30',
    lastContactedDate: '2025-12-01',
    activeDeals: 2,
    completedDeals: 93,
    pendingQuotes: 0
  },
  {
    name: 'Seoul Beauty Supplies',
    country: 'South Korea',
    countryFlag: '🇰🇷',
    location: 'Seoul, South Korea',
    category: 'Health & Beauty',
    specialization: 'K-Beauty Products, Skincare, Cosmetics, Sheet Masks',
    verified: true,
    rating: 4.8,
    contactPerson: 'Ji-Young Park',
    email: 'jiyoung@seoul-beauty.kr',
    phone: '+82 2 1234 5678',
    website: 'seoul-beauty.kr',
    relationshipStage: 'negotiating',
    stageChangedAt: '2025-11-25T09:00:00Z',
    stageHistory: [],
    source: 'inbox',
    tags: ['Premium Quality', 'Good Communication', 'New Supplier'],
    notes: 'New partnership started in 2025. Great for trending K-beauty products.',
    priority: 'high',
    communicationCount: 12,
    totalOrders: 15,
    totalOrderValue: 45000,
    lastOrderDate: '2025-11-20',
    lastContactedDate: '2025-11-29',
    nextFollowUpDate: '2025-12-03',
    activeDeals: 0,
    completedDeals: 15,
    pendingQuotes: 1
  },
  {
    name: 'Jakarta Packaging Solutions',
    country: 'Indonesia',
    countryFlag: '🇮🇩',
    location: 'Jakarta, Indonesia',
    category: 'Packaging',
    specialization: 'Custom Boxes, Paper Bags, Eco-friendly Packaging, Labels',
    verified: true,
    rating: 4.2,
    contactPerson: 'Budi Santoso',
    email: 'budi@jakarta-pack.id',
    phone: '+62 21 345 6789',
    relationshipStage: 'contacted',
    stageChangedAt: '2025-11-10T14:00:00Z',
    stageHistory: [],
    source: 'manual',
    tags: ['Budget Friendly', 'Needs Follow-up'],
    notes: 'Good prices on eco-friendly packaging. Need to follow up on sample quality.',
    priority: 'low',
    communicationCount: 3,
    totalOrders: 0,
    totalOrderValue: 0,
    lastContactedDate: '2025-11-10',
    nextFollowUpDate: '2025-12-01',
    activeDeals: 0,
    completedDeals: 0,
    pendingQuotes: 1
  },
  {
    name: 'Philippines Furniture Works',
    country: 'Philippines',
    countryFlag: '🇵🇭',
    location: 'Cebu, Philippines',
    category: 'Home & Garden',
    specialization: 'Rattan Furniture, Wooden Crafts, Outdoor Furniture',
    verified: true,
    rating: 4.6,
    contactPerson: 'Maria Santos',
    email: 'maria@ph-furniture.ph',
    phone: '+63 32 345 6789',
    relationshipStage: 'on_hold',
    stageChangedAt: '2025-10-20T11:00:00Z',
    stageHistory: [],
    source: 'discovery',
    tags: ['Good Quality', 'Contract Pending'],
    notes: 'Beautiful craftsmanship. On hold due to shipping cost negotiations.',
    priority: 'low',
    communicationCount: 8,
    totalOrders: 12,
    totalOrderValue: 34000,
    lastOrderDate: '2025-08-15',
    lastContactedDate: '2025-10-20',
    activeDeals: 0,
    completedDeals: 12,
    pendingQuotes: 0
  },
  {
    name: 'Malaysia Auto Parts',
    country: 'Malaysia',
    countryFlag: '🇲🇾',
    location: 'Kuala Lumpur, Malaysia',
    category: 'Auto Parts',
    specialization: 'Car Accessories, LED Car Lights, Car Electronics, OBD Devices',
    verified: true,
    rating: 4.5,
    contactPerson: 'Ahmad Razak',
    email: 'ahmad@my-autoparts.my',
    phone: '+60 3 2345 6789',
    relationshipStage: 'deal_completed',
    stageChangedAt: '2025-11-18T15:00:00Z',
    stageHistory: [],
    source: 'invitation',
    tags: ['Reliable', 'Fast Shipping'],
    notes: 'Quick delivery within ASEAN region. Good for car electronics.',
    priority: 'medium',
    communicationCount: 25,
    totalOrders: 67,
    totalOrderValue: 112000,
    lastOrderDate: '2025-11-18',
    lastContactedDate: '2025-11-26',
    activeDeals: 0,
    completedDeals: 67,
    pendingQuotes: 0
  },
  {
    name: 'Ningbo Industrial Equipment',
    country: 'China',
    countryFlag: '🇨🇳',
    location: 'Ningbo, China',
    category: 'Industrial Equipment',
    specialization: 'Hydraulic Equipment, Pumps, Industrial Valves, Machinery Parts',
    verified: true,
    rating: 4.4,
    contactPerson: 'Wei Liu',
    email: 'wei@ningbo-industrial.cn',
    phone: '+86 574 8765 4321',
    website: 'ningbo-industrial.cn',
    relationshipStage: 'deal_active',
    stageChangedAt: '2025-11-05T10:00:00Z',
    stageHistory: [],
    source: 'inbox',
    tags: ['Good Quality', 'Flexible MOQ'],
    notes: 'Reliable for industrial equipment. Good technical support team.',
    priority: 'medium',
    communicationCount: 14,
    totalOrders: 29,
    totalOrderValue: 234000,
    lastOrderDate: '2025-11-08',
    lastContactedDate: '2025-11-20',
    activeDeals: 1,
    completedDeals: 28,
    pendingQuotes: 0
  },
  {
    name: 'Sri Lanka Tea Exports',
    country: 'Sri Lanka',
    countryFlag: '🇱🇰',
    location: 'Colombo, Sri Lanka',
    category: 'Food & Beverage',
    specialization: 'Ceylon Tea, Green Tea, Herbal Tea, Spices',
    verified: true,
    rating: 4.7,
    contactPerson: 'Ranjan Fernando',
    email: 'ranjan@slk-tea.lk',
    phone: '+94 11 234 5678',
    relationshipStage: 'deal_completed',
    stageChangedAt: '2025-11-12T13:00:00Z',
    stageHistory: [],
    source: 'discovery',
    tags: ['Premium Quality', 'Exclusive', 'Long-term Partner'],
    notes: 'Best Ceylon tea supplier. Consistent quality since 2022.',
    priority: 'high',
    communicationCount: 20,
    totalOrders: 45,
    totalOrderValue: 78000,
    lastOrderDate: '2025-11-12',
    lastContactedDate: '2025-11-24',
    activeDeals: 0,
    completedDeals: 45,
    pendingQuotes: 0
  },
  {
    name: 'Dongguan Machinery Co.',
    country: 'China',
    countryFlag: '🇨🇳',
    location: 'Dongguan, China',
    category: 'Machinery',
    specialization: 'CNC Machines, Injection Molding Equipment, Laser Cutters',
    verified: true,
    rating: 4.6,
    contactPerson: 'Tony Wu',
    email: 'tony@dg-machinery.cn',
    phone: '+86 769 8765 4321',
    website: 'dg-machinery.cn',
    relationshipStage: 'negotiating',
    stageChangedAt: '2025-11-28T09:00:00Z',
    stageHistory: [],
    source: 'inbox',
    tags: ['Premium Quality', 'Waiting Quote'],
    notes: 'Evaluating for machinery upgrade project. Good reputation in the industry.',
    priority: 'high',
    communicationCount: 8,
    totalOrders: 5,
    totalOrderValue: 156000,
    lastOrderDate: '2025-06-20',
    lastContactedDate: '2025-11-28',
    nextFollowUpDate: '2025-12-10',
    activeDeals: 0,
    completedDeals: 5,
    pendingQuotes: 1
  }
];

export function generateDemoSuppliers(): SavedSupplier[] {
  const now = new Date();

  return DEMO_SUPPLIERS.map((supplier, index) => ({
    ...supplier,
    id: `supplier-demo-${index + 1}`,
    savedAt: new Date(now.getTime() - (index * 3 * 24 * 60 * 60 * 1000)).toISOString(), // Stagger save dates
    updatedAt: new Date(now.getTime() - (index * 1 * 24 * 60 * 60 * 1000)).toISOString()
  }));
}

// ============================================================================
// DATA MIGRATION
// ============================================================================

// Migrate old supplier data (with status) to new format (with relationshipStage)
export function migrateSupplierData(supplier: any): SavedSupplier {
  // If already migrated, return as-is
  if (supplier.relationshipStage) {
    return supplier as SavedSupplier;
  }

  // Map old status to new relationship stage
  const stageMapping: Record<string, RelationshipStage> = {
    'active': 'deal_active',
    'pending': 'contacted',
    'inactive': 'on_hold',
    'blocked': 'blocked'
  };

  const now = new Date().toISOString();

  return {
    ...supplier,
    // Convert status to relationshipStage
    relationshipStage: stageMapping[supplier.status] || 'contacted',
    stageChangedAt: supplier.updatedAt || now,
    stageHistory: [],
    // Add new required fields with defaults
    priority: supplier.priority || 'medium',
    communicationCount: supplier.communicationCount || 0,
    activeDeals: supplier.activeDeals || (supplier.status === 'active' ? 1 : 0),
    completedDeals: supplier.completedDeals || supplier.totalOrders || 0,
    pendingQuotes: supplier.pendingQuotes || 0,
    // Remove old status field
    status: undefined
  } as SavedSupplier;
}

// Migrate all suppliers in storage
export function migrateAllSuppliers(): SavedSupplier[] {
  const existing = getSavedSuppliers();

  // Check if migration is needed (any supplier has old 'status' field)
  const needsMigration = existing.some((s: any) => s.status && !s.relationshipStage);

  if (needsMigration) {
    const migrated = existing.map(migrateSupplierData);
    saveSuppliersToStorage(migrated);
    return migrated;
  }

  return existing;
}

export function initializeDemoSuppliers(): SavedSupplier[] {
  const existing = getSavedSuppliers();

  if (existing.length === 0) {
    // No data - create demo data
    const demoData = generateDemoSuppliers();
    saveSuppliersToStorage(demoData);
    return demoData;
  }

  // Check if migration is needed and perform it
  return migrateAllSuppliers();
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getAllTags(suppliers: SavedSupplier[]): string[] {
  const tagSet = new Set<string>();
  suppliers.forEach(s => s.tags.forEach(tag => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}

export function getAllCategories(suppliers: SavedSupplier[]): string[] {
  const categorySet = new Set<string>();
  suppliers.forEach(s => categorySet.add(s.category));
  return Array.from(categorySet).sort();
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function getRelativeTime(dateString: string | undefined): string {
  if (!dateString) return 'Never';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}
