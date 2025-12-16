// Vendors - Extended SRM (Supplier Relationship Management) Library
// Builds upon savedSuppliers.ts with health scores, performance tracking, documents, and activity timeline

import {
  SavedSupplier,
  RelationshipStage,
  StageHistoryEntry,
  RELATIONSHIP_STAGE_CONFIG,
  getSavedSuppliers,
  saveSuppliersToStorage as baseSaveSuppliers,
  updateSupplier as baseUpdateSupplier,
  saveSupplier as baseSaveSupplier,
  removeSupplier as baseRemoveSupplier,
  filterSuppliers,
  sortSuppliers,
  getPipelineStats,
  getAllTags,
  getAllCategories,
  formatCurrency,
  formatDate,
  getRelativeTime,
  transitionSupplierStage,
  SUGGESTED_TAGS,
  FilterOptions,
  SortOption,
  DEFAULT_FILTERS
} from './savedSuppliers';

// Import lucide-react icons
import {
  FileText,
  Award,
  DollarSign,
  Receipt,
  CheckCircle,
  Paperclip,
  RefreshCw,
  MessageSquare,
  Package,
  StickyNote,
  Users,
  Send,
  type LucideIcon
} from 'lucide-react';

// Re-export everything from savedSuppliers for backward compatibility
export * from './savedSuppliers';

// ============================================================================
// NEW SRM TYPES
// ============================================================================

// Performance Entry - Monthly performance metrics
export interface PerformanceEntry {
  id: string;
  period: string; // YYYY-MM format
  onTimeDeliveryRate: number; // 0-100
  qualityRating: number; // 1-5
  responseTimeHours: number;
  defectRate: number; // 0-100
  ordersDelivered: number;
  disputesCount: number;
  recordedAt: string;
}

// Vendor Document
export interface VendorDocument {
  id: string;
  type: 'contract' | 'certificate' | 'quote' | 'invoice' | 'compliance' | 'other';
  name: string;
  description?: string;
  externalLink?: string;
  uploadedAt: string;
  expiryDate?: string;
  status: 'active' | 'expired' | 'pending';
  tags: string[];
}

// Vendor Activity
export interface VendorActivity {
  id: string;
  type: 'stage_change' | 'communication' | 'order' | 'document' | 'note' | 'meeting' | 'quote' | 'rfq';
  title: string;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  createdBy?: string;
}

// Health Score Breakdown
export interface HealthScoreBreakdown {
  qualityScore: number; // 0-100
  deliveryScore: number; // 0-100
  responseScore: number; // 0-100
  complianceScore: number; // 0-100
}

// Extended Vendor interface (extends SavedSupplier)
export interface Vendor extends SavedSupplier {
  // Health Score
  healthScore: number; // 0-100
  healthScoreBreakdown: HealthScoreBreakdown;

  // Performance History
  performanceHistory: PerformanceEntry[];

  // Documents
  documents: VendorDocument[];

  // Activity Timeline
  activities: VendorActivity[];

  // Source Tracking (enhanced)
  sourceType: 'smart_sourcing' | 'invitation' | 'requirement_match' | 'manual' | 'import' | 'discovery' | 'inbox';
  sourceReferenceId?: string;
}

// Document type configuration
export const DOCUMENT_TYPE_CONFIG: Record<VendorDocument['type'], { label: string; icon: LucideIcon; color: string }> = {
  contract: { label: 'Contract', icon: FileText, color: '#3B82F6' },
  certificate: { label: 'Certificate', icon: Award, color: '#10B981' },
  quote: { label: 'Quote', icon: DollarSign, color: '#F59E0B' },
  invoice: { label: 'Invoice', icon: Receipt, color: '#8B5CF6' },
  compliance: { label: 'Compliance', icon: CheckCircle, color: '#06B6D4' },
  other: { label: 'Other', icon: Paperclip, color: '#6B7280' }
};

// Activity type configuration
export const ACTIVITY_TYPE_CONFIG: Record<VendorActivity['type'], { label: string; icon: LucideIcon; color: string }> = {
  stage_change: { label: 'Stage Changed', icon: RefreshCw, color: '#8B5CF6' },
  communication: { label: 'Communication', icon: MessageSquare, color: '#3B82F6' },
  order: { label: 'Order', icon: Package, color: '#10B981' },
  document: { label: 'Document', icon: FileText, color: '#F59E0B' },
  note: { label: 'Note', icon: StickyNote, color: '#6B7280' },
  meeting: { label: 'Meeting', icon: Users, color: '#EC4899' },
  quote: { label: 'Quote Received', icon: DollarSign, color: '#F97316' },
  rfq: { label: 'RFQ Sent', icon: Send, color: '#06B6D4' }
};

// ============================================================================
// STORAGE KEYS
// ============================================================================

const VENDORS_STORAGE_KEY = 'befach-vendors';
const VENDOR_DOCUMENTS_KEY = 'befach-vendor-documents';
const VENDOR_ACTIVITIES_KEY = 'befach-vendor-activities';
const VENDOR_PERFORMANCE_KEY = 'befach-vendor-performance';

// ============================================================================
// HEALTH SCORE CALCULATION
// ============================================================================

export function calculateHealthScore(vendor: Vendor | SavedSupplier): number {
  const breakdown = calculateHealthScoreBreakdown(vendor);

  // Weighted average: Quality (40%), Delivery (30%), Response (20%), Compliance (10%)
  const score = (
    breakdown.qualityScore * 0.4 +
    breakdown.deliveryScore * 0.3 +
    breakdown.responseScore * 0.2 +
    breakdown.complianceScore * 0.1
  );

  return Math.round(score);
}

export function calculateHealthScoreBreakdown(vendor: Vendor | SavedSupplier): HealthScoreBreakdown {
  // Quality Score: Based on rating (max 5), defect rate from performance
  const qualityFromRating = (vendor.rating / 5) * 100;
  const qualityScore = Math.round(qualityFromRating);

  // Delivery Score: Based on completed deals ratio and active deals
  const totalDeals = (vendor.completedDeals || 0) + (vendor.activeDeals || 0);
  const deliveryRatio = totalDeals > 0 ? (vendor.completedDeals || 0) / totalDeals : 0.5;
  const deliveryScore = Math.round(deliveryRatio * 100);

  // Response Score: Based on communication count and last contacted
  const hasRecentContact = vendor.lastContactedDate
    ? (Date.now() - new Date(vendor.lastContactedDate).getTime()) < 30 * 24 * 60 * 60 * 1000 // Within 30 days
    : false;
  const commScore = Math.min((vendor.communicationCount || 0) / 50 * 100, 100); // Cap at 50 communications
  const responseScore = Math.round(hasRecentContact ? Math.max(commScore, 60) : commScore * 0.7);

  // Compliance Score: Based on verified status and documents
  const vendorExt = vendor as Vendor;
  const hasDocuments = vendorExt.documents?.length > 0;
  const complianceBase = vendor.verified ? 70 : 30;
  const complianceScore = Math.round(hasDocuments ? Math.min(complianceBase + 30, 100) : complianceBase);

  return {
    qualityScore,
    deliveryScore,
    responseScore,
    complianceScore
  };
}

export function getHealthScoreGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 75) return 'B';
  if (score >= 60) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

export function getHealthScoreColor(score: number): string {
  if (score >= 80) return '#10B981'; // Green
  if (score >= 60) return '#F59E0B'; // Yellow/Amber
  if (score >= 40) return '#F97316'; // Orange
  return '#EF4444'; // Red
}

// ============================================================================
// VENDOR OPERATIONS
// ============================================================================

export function getVendors(): Vendor[] {
  if (typeof window === 'undefined') return [];

  const data = localStorage.getItem(VENDORS_STORAGE_KEY);
  if (data) {
    return JSON.parse(data);
  }

  // Migrate from old savedSuppliers if exists
  const oldSuppliers = getSavedSuppliers();
  if (oldSuppliers.length > 0) {
    const vendors = migrateToVendors(oldSuppliers);
    saveVendorsToStorage(vendors);
    return vendors;
  }

  return [];
}

export function saveVendorsToStorage(vendors: Vendor[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(VENDORS_STORAGE_KEY, JSON.stringify(vendors));
}

export function getVendor(id: string): Vendor | null {
  const vendors = getVendors();
  return vendors.find(v => v.id === id) || null;
}

export function updateVendor(id: string, updates: Partial<Vendor>): Vendor {
  const vendors = getVendors();
  const index = vendors.findIndex(v => v.id === id);

  if (index === -1) {
    throw new Error(`Vendor with id ${id} not found`);
  }

  // Recalculate health score if relevant fields changed
  const updatedVendor = {
    ...vendors[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  updatedVendor.healthScore = calculateHealthScore(updatedVendor);
  updatedVendor.healthScoreBreakdown = calculateHealthScoreBreakdown(updatedVendor);

  vendors[index] = updatedVendor;
  saveVendorsToStorage(vendors);

  // Also update in old storage for backward compatibility
  baseUpdateSupplier(id, updates);

  return updatedVendor;
}

// ============================================================================
// ACTIVITY OPERATIONS
// ============================================================================

export function addActivity(vendorId: string, activity: Omit<VendorActivity, 'id' | 'createdAt'>): VendorActivity {
  const vendor = getVendor(vendorId);
  if (!vendor) throw new Error('Vendor not found');

  const newActivity: VendorActivity = {
    ...activity,
    id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  };

  updateVendor(vendorId, {
    activities: [newActivity, ...(vendor.activities || [])]
  });

  return newActivity;
}

export function getVendorActivities(vendorId: string, limit?: number): VendorActivity[] {
  const vendor = getVendor(vendorId);
  if (!vendor) return [];

  const activities = vendor.activities || [];
  return limit ? activities.slice(0, limit) : activities;
}

// ============================================================================
// DOCUMENT OPERATIONS
// ============================================================================

export function addDocument(vendorId: string, document: Omit<VendorDocument, 'id' | 'uploadedAt'>): VendorDocument {
  const vendor = getVendor(vendorId);
  if (!vendor) throw new Error('Vendor not found');

  const newDocument: VendorDocument = {
    ...document,
    id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    uploadedAt: new Date().toISOString()
  };

  updateVendor(vendorId, {
    documents: [...(vendor.documents || []), newDocument]
  });

  // Log activity
  addActivity(vendorId, {
    type: 'document',
    title: `Document added: ${newDocument.name}`,
    description: `Added ${DOCUMENT_TYPE_CONFIG[newDocument.type].label}: ${newDocument.name}`,
    metadata: { documentId: newDocument.id, documentType: newDocument.type }
  });

  return newDocument;
}

export function updateDocument(vendorId: string, documentId: string, updates: Partial<VendorDocument>): VendorDocument {
  const vendor = getVendor(vendorId);
  if (!vendor) throw new Error('Vendor not found');

  const documents = vendor.documents || [];
  const index = documents.findIndex(d => d.id === documentId);
  if (index === -1) throw new Error('Document not found');

  documents[index] = { ...documents[index], ...updates };
  updateVendor(vendorId, { documents });

  return documents[index];
}

export function removeDocument(vendorId: string, documentId: string): boolean {
  const vendor = getVendor(vendorId);
  if (!vendor) return false;

  const documents = vendor.documents || [];
  const doc = documents.find(d => d.id === documentId);
  if (!doc) return false;

  updateVendor(vendorId, {
    documents: documents.filter(d => d.id !== documentId)
  });

  // Log activity
  addActivity(vendorId, {
    type: 'document',
    title: `Document removed: ${doc.name}`,
    description: `Removed ${DOCUMENT_TYPE_CONFIG[doc.type].label}: ${doc.name}`,
    metadata: { documentId, documentType: doc.type }
  });

  return true;
}

export function getVendorDocuments(vendorId: string): VendorDocument[] {
  const vendor = getVendor(vendorId);
  return vendor?.documents || [];
}

// ============================================================================
// PERFORMANCE OPERATIONS
// ============================================================================

export function addPerformanceEntry(vendorId: string, entry: Omit<PerformanceEntry, 'id' | 'recordedAt'>): PerformanceEntry {
  const vendor = getVendor(vendorId);
  if (!vendor) throw new Error('Vendor not found');

  const newEntry: PerformanceEntry = {
    ...entry,
    id: `perf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    recordedAt: new Date().toISOString()
  };

  updateVendor(vendorId, {
    performanceHistory: [...(vendor.performanceHistory || []), newEntry]
  });

  return newEntry;
}

export function getPerformanceHistory(vendorId: string): PerformanceEntry[] {
  const vendor = getVendor(vendorId);
  return vendor?.performanceHistory || [];
}

// ============================================================================
// MIGRATION & INITIALIZATION
// ============================================================================

function migrateToVendors(suppliers: SavedSupplier[]): Vendor[] {
  return suppliers.map(supplier => {
    const healthScoreBreakdown = calculateHealthScoreBreakdown(supplier);
    const healthScore = calculateHealthScore(supplier);

    return {
      ...supplier,
      healthScore,
      healthScoreBreakdown,
      performanceHistory: generateDemoPerformanceHistory(supplier),
      documents: generateDemoDocuments(supplier),
      activities: generateDemoActivities(supplier),
      sourceType: supplier.source as Vendor['sourceType']
    };
  });
}

// Generate demo performance history (last 6 months)
function generateDemoPerformanceHistory(supplier: SavedSupplier): PerformanceEntry[] {
  const entries: PerformanceEntry[] = [];
  const now = new Date();

  // Only generate for suppliers with orders
  if (supplier.totalOrders === 0) return [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    // Generate realistic metrics based on supplier's rating
    const baseQuality = Math.min(supplier.rating * 20, 100);
    const variation = () => (Math.random() - 0.5) * 10;

    entries.push({
      id: `perf-demo-${supplier.id}-${period}`,
      period,
      onTimeDeliveryRate: Math.max(0, Math.min(100, baseQuality + variation())),
      qualityRating: Math.max(1, Math.min(5, supplier.rating + (Math.random() - 0.5) * 0.5)),
      responseTimeHours: Math.max(1, 48 - (supplier.rating - 3) * 10 + (Math.random() - 0.5) * 12),
      defectRate: Math.max(0, Math.min(20, (5 - supplier.rating) * 3 + variation())),
      ordersDelivered: Math.floor(supplier.totalOrders / 6 + Math.random() * 5),
      disputesCount: Math.floor(Math.random() * 2),
      recordedAt: date.toISOString()
    });
  }

  return entries;
}

// Generate demo documents
function generateDemoDocuments(supplier: SavedSupplier): VendorDocument[] {
  const documents: VendorDocument[] = [];
  const now = new Date();

  // Only add documents for verified suppliers or those with completed deals
  if (!supplier.verified && supplier.completedDeals === 0) return [];

  // Add business certificate
  if (supplier.verified) {
    documents.push({
      id: `doc-demo-${supplier.id}-cert`,
      type: 'certificate',
      name: 'Business Registration Certificate',
      description: 'Official business registration and license',
      externalLink: '#',
      uploadedAt: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      expiryDate: new Date(now.getTime() + 275 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      tags: ['verified', 'official']
    });
  }

  // Add contract for active deals
  if (supplier.relationshipStage === 'deal_active' || supplier.completedDeals > 10) {
    documents.push({
      id: `doc-demo-${supplier.id}-contract`,
      type: 'contract',
      name: 'Supply Agreement 2024',
      description: 'Master supply agreement for 2024',
      externalLink: '#',
      uploadedAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      expiryDate: new Date(now.getTime() + 305 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      tags: ['contract', 'active']
    });
  }

  // Add recent quote for negotiating stage
  if (supplier.relationshipStage === 'negotiating' || supplier.pendingQuotes > 0) {
    documents.push({
      id: `doc-demo-${supplier.id}-quote`,
      type: 'quote',
      name: `Quote - ${supplier.specialization.split(',')[0]}`,
      description: 'Latest price quotation',
      externalLink: '#',
      uploadedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      tags: ['quote', 'pending-review']
    });
  }

  return documents;
}

// Generate demo activities
function generateDemoActivities(supplier: SavedSupplier): VendorActivity[] {
  const activities: VendorActivity[] = [];
  const now = new Date();

  // Add stage change activity
  activities.push({
    id: `activity-demo-${supplier.id}-stage`,
    type: 'stage_change',
    title: `Stage set to ${RELATIONSHIP_STAGE_CONFIG[supplier.relationshipStage].label}`,
    description: `Supplier relationship moved to ${supplier.relationshipStage} stage`,
    metadata: { stage: supplier.relationshipStage },
    createdAt: supplier.stageChangedAt || now.toISOString()
  });

  // Add communication activity if contacted recently
  if (supplier.lastContactedDate) {
    activities.push({
      id: `activity-demo-${supplier.id}-comm`,
      type: 'communication',
      title: 'Message sent',
      description: 'Followed up on pending matters',
      createdAt: supplier.lastContactedDate
    });
  }

  // Add order activity if has orders
  if (supplier.lastOrderDate) {
    activities.push({
      id: `activity-demo-${supplier.id}-order`,
      type: 'order',
      title: `Order completed - $${Math.floor(supplier.totalOrderValue / supplier.totalOrders).toLocaleString()}`,
      description: `Order #${Math.floor(Math.random() * 10000) + 1000} delivered successfully`,
      metadata: { orderId: `ORD-${Math.floor(Math.random() * 10000)}` },
      createdAt: supplier.lastOrderDate
    });
  }

  // Add initial activity
  activities.push({
    id: `activity-demo-${supplier.id}-added`,
    type: 'note',
    title: 'Vendor added to network',
    description: `Added via ${supplier.source}`,
    createdAt: supplier.savedAt
  });

  // Sort by date descending
  return activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// Initialize vendors with demo data
export function initializeVendors(): Vendor[] {
  const existing = getVendors();

  if (existing.length === 0) {
    // Check if old data exists and migrate
    const oldSuppliers = getSavedSuppliers();
    if (oldSuppliers.length > 0) {
      const vendors = migrateToVendors(oldSuppliers);
      saveVendorsToStorage(vendors);
      return vendors;
    }

    // Initialize demo suppliers first, then migrate
    const { initializeDemoSuppliers } = require('./savedSuppliers');
    const demoSuppliers = initializeDemoSuppliers();
    const vendors = migrateToVendors(demoSuppliers);
    saveVendorsToStorage(vendors);
    return vendors;
  }

  return existing;
}

// ============================================================================
// ENHANCED STAGE TRANSITION WITH ACTIVITY LOGGING
// ============================================================================

export function transitionVendorStage(
  vendorId: string,
  newStage: RelationshipStage,
  reason?: string
): Vendor {
  const vendor = getVendor(vendorId);
  if (!vendor) throw new Error('Vendor not found');

  // Use base transition
  transitionSupplierStage(vendorId, newStage, reason);

  // Update vendor and add activity
  const updatedVendor = updateVendor(vendorId, {
    relationshipStage: newStage,
    stageChangedAt: new Date().toISOString()
  });

  // Log activity
  addActivity(vendorId, {
    type: 'stage_change',
    title: `Stage changed to ${RELATIONSHIP_STAGE_CONFIG[newStage].label}`,
    description: reason || `Moved from ${RELATIONSHIP_STAGE_CONFIG[vendor.relationshipStage].label} to ${RELATIONSHIP_STAGE_CONFIG[newStage].label}`,
    metadata: {
      fromStage: vendor.relationshipStage,
      toStage: newStage,
      reason
    }
  });

  return updatedVendor;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function formatActivityDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function groupActivitiesByDate(activities: VendorActivity[]): Record<string, VendorActivity[]> {
  const grouped: Record<string, VendorActivity[]> = {};

  activities.forEach(activity => {
    const date = new Date(activity.createdAt);
    const key = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(activity);
  });

  return grouped;
}

export function isDocumentExpiringSoon(doc: VendorDocument, daysThreshold = 30): boolean {
  if (!doc.expiryDate) return false;
  const expiryDate = new Date(doc.expiryDate);
  const now = new Date();
  const diffDays = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays > 0 && diffDays <= daysThreshold;
}

export function isDocumentExpired(doc: VendorDocument): boolean {
  if (!doc.expiryDate) return false;
  return new Date(doc.expiryDate) < new Date();
}

export function getDocumentStats(documents: VendorDocument[]): {
  total: number;
  active: number;
  expiringSoon: number;
  expired: number;
} {
  return {
    total: documents.length,
    active: documents.filter(d => d.status === 'active' && !isDocumentExpired(d)).length,
    expiringSoon: documents.filter(d => isDocumentExpiringSoon(d)).length,
    expired: documents.filter(d => isDocumentExpired(d) || d.status === 'expired').length
  };
}
