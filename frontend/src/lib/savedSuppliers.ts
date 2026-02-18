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
import { safeStorage } from '@/lib/safeStorage';

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
  const data = safeStorage.getItem(STORAGE_KEY);
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
  safeStorage.setItem(STORAGE_KEY, JSON.stringify(suppliers));
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
  const data = safeStorage.getItem(PRESETS_STORAGE_KEY);
  if (!data) {
    const defaults = getDefaultPresets();
    safeStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(defaults));
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
  safeStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets));
  return newPreset;
}

export function deleteFilterPreset(presetId: string): boolean {
  const presets = getFilterPresets();
  const filtered = presets.filter(p => p.id !== presetId && !p.isDefault);
  if (filtered.length === presets.length) return false;
  safeStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(filtered));
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
// AUTO-SAVE HELPER FUNCTIONS (for Our Vendors feature)
// ============================================================================

// Country flag mapping
const COUNTRY_FLAGS: Record<string, string> = {
  'China': '🇨🇳',
  'India': '🇮🇳',
  'Taiwan': '🇹🇼',
  'South Korea': '🇰🇷',
  'Vietnam': '🇻🇳',
  'Thailand': '🇹🇭',
  'Malaysia': '🇲🇾',
  'Japan': '🇯🇵',
  'United States': '🇺🇸',
  'Germany': '🇩🇪',
  'United Kingdom': '🇬🇧',
  'France': '🇫🇷',
  'Italy': '🇮🇹',
  'Spain': '🇪🇸',
  'Brazil': '🇧🇷',
  'Mexico': '🇲🇽',
  'Indonesia': '🇮🇩',
  'Philippines': '🇵🇭',
  'Bangladesh': '🇧🇩',
  'Pakistan': '🇵🇰'
};

function getCountryFlag(country: string): string {
  return COUNTRY_FLAGS[country] || '';
}

/**
 * Check if a supplier already exists by name or email
 */
export function findExistingSupplier(name?: string, email?: string): SavedSupplier | null {
  const suppliers = getSavedSuppliers();

  if (name) {
    const byName = suppliers.find(s => s.name.toLowerCase() === name.toLowerCase());
    if (byName) return byName;
  }

  if (email) {
    const byEmail = suppliers.find(s => s.email?.toLowerCase() === email.toLowerCase());
    if (byEmail) return byEmail;
  }

  return null;
}

/**
 * Save supplier from an invitation (Invite Supplier page)
 * Automatically creates a vendor record when user sends an invitation
 */
export interface InvitationData {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  phone?: string;
  category?: string;
  country?: string;
  website?: string;
}

export function saveSupplierFromInvitation(invitation: InvitationData): SavedSupplier | null {
  // Check if already exists
  const existing = findExistingSupplier(invitation.companyName, invitation.contactEmail);
  if (existing) {
    // Update last contacted date if exists
    return updateSupplier(existing.id, {
      lastContactedDate: new Date().toISOString(),
      communicationCount: existing.communicationCount + 1
    });
  }

  const now = new Date().toISOString();
  const country = invitation.country || 'Unknown';
  const category = invitation.category || detectCategory(invitation.companyName);

  const newSupplier: Omit<SavedSupplier, 'id' | 'savedAt' | 'updatedAt'> = {
    name: invitation.companyName,
    country: country,
    countryFlag: getCountryFlag(country),
    location: country,
    category: category,
    specialization: category,
    verified: false,
    rating: 0,
    contactPerson: invitation.contactName,
    email: invitation.contactEmail,
    phone: invitation.phone,
    website: invitation.website,
    relationshipStage: 'contacted',
    stageChangedAt: now,
    stageHistory: [{
      id: `history-${Date.now()}`,
      fromStage: null,
      toStage: 'contacted',
      changedAt: now,
      reason: 'Invitation sent'
    }],
    source: 'invitation',
    sourceId: invitation.id,
    tags: ['Invitation Sent'],
    priority: 'medium',
    lastContactedDate: now,
    communicationCount: 1,
    totalOrders: 0,
    totalOrderValue: 0,
    activeDeals: 0,
    completedDeals: 0,
    pendingQuotes: 0
  };

  return saveSupplier(newSupplier);
}

/**
 * Save supplier from AI Search (Smart Sourcing page)
 * Automatically creates a vendor record when user contacts or chats with a supplier
 */
export interface SearchSupplierData {
  id: string;
  companyName: string;
  location?: {
    country?: string;
    city?: string;
    region?: string;
  };
  contacts?: Array<{
    name?: string;
    email?: string;
    phone?: string;
  }>;
  catalogue?: Array<{
    name?: string;
  }>;
  metrics?: {
    avgRating?: number;
  };
  website?: string;
  description?: string;
}

export function saveSupplierFromSearch(
  supplier: SearchSupplierData,
  interactionType: 'contact' | 'chat'
): SavedSupplier | null {
  // Check if already exists
  const contact = supplier.contacts?.[0];
  const existing = findExistingSupplier(supplier.companyName, contact?.email);

  if (existing) {
    // Update last contacted date if exists
    return updateSupplier(existing.id, {
      lastContactedDate: new Date().toISOString(),
      communicationCount: existing.communicationCount + 1
    });
  }

  const now = new Date().toISOString();
  const country = supplier.location?.country || 'Unknown';
  const city = supplier.location?.city || '';
  const location = city ? `${city}, ${country}` : country;

  // Get category from catalogue
  const category = supplier.catalogue?.[0]?.name
    ? detectCategory(supplier.catalogue[0].name)
    : detectCategory(supplier.companyName);

  const newSupplier: Omit<SavedSupplier, 'id' | 'savedAt' | 'updatedAt'> = {
    name: supplier.companyName,
    country: country,
    countryFlag: getCountryFlag(country),
    location: location,
    category: category,
    specialization: supplier.description?.substring(0, 100) || category,
    verified: false,
    rating: supplier.metrics?.avgRating || 0,
    contactPerson: contact?.name,
    email: contact?.email,
    phone: contact?.phone,
    website: supplier.website,
    relationshipStage: 'contacted',
    stageChangedAt: now,
    stageHistory: [{
      id: `history-${Date.now()}`,
      fromStage: null,
      toStage: 'contacted',
      changedAt: now,
      reason: interactionType === 'chat' ? 'Chat initiated from AI Search' : 'Contacted from AI Search'
    }],
    source: 'discovery',
    sourceId: supplier.id,
    tags: [interactionType === 'chat' ? 'Chat Started' : 'Contacted'],
    priority: 'medium',
    lastContactedDate: now,
    communicationCount: 1,
    totalOrders: 0,
    totalOrderValue: 0,
    activeDeals: 0,
    completedDeals: 0,
    pendingQuotes: 0
  };

  return saveSupplier(newSupplier);
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
  // Migration only — no longer seeds demo data
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
