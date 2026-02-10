import { safeStorage } from '@/lib/safeStorage';
// Requirements Management - Types, Status Logic, Time Calculation, Demo Simulation

// ============================================
// TYPE DEFINITIONS
// ============================================

export type RequirementType = 'single' | 'bulk';

export type RequirementStatus =
  | 'matching'      // Initial state - finding suppliers
  | 'quoted'        // Suppliers have provided quotes
  | 'negotiating'   // Price/terms negotiation in progress
  | 'completed'     // Deal finalized
  | 'cancelled';    // User cancelled

export type UrgencyLevel = 'standard' | 'urgent' | 'critical';

export type SupplierMatchStatus =
  | 'pending'       // Match identified, awaiting quote
  | 'quote_received'// Supplier responded with quote
  | 'shortlisted';  // User marked as preferred

export interface ProductItem {
  id: string;
  name: string;
  hsnCode: string;
  quantity: string;
  unit: string;
  specifications?: string;
  targetPrice?: string;
  currency?: string;
}

export interface SupplierMatch {
  id: string;
  supplierName: string;
  supplierCountry: string;
  matchScore: number;           // 0-100
  quotedPrice?: number;
  quoteCurrency?: string;
  leadTime?: number;            // days
  moq?: number;
  status: SupplierMatchStatus;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'status_change' | 'quote_received' | 'supplier_match' | 'note';
  title: string;
  description?: string;
}

export interface EstimatedTime {
  minDays: number;
  maxDays: number;
  displayText: string;    // "~24 hours", "2-3 days"
  basedOn: string;
}

export interface Requirement {
  id: string;
  type: RequirementType;

  // Products
  products: ProductItem[];

  // Status
  status: RequirementStatus;
  statusChangedAt: string;

  // Supplier Matching
  supplierMatches: SupplierMatch[];
  matchCount: number;
  quotesReceived: number;

  // Timing
  submittedAt: string;
  estimatedTime: EstimatedTime;

  // User Preferences
  urgency: UrgencyLevel;
  preferredCountries: string[];

  // Metadata
  title: string;
  timeline: TimelineEvent[];

  // Demo Mode
  _nextTransitionAt?: string;
}

// ============================================
// STATUS CONFIGURATION
// ============================================

export const STATUS_CONFIG: Record<RequirementStatus, {
  label: string;
  description: string;
  color: string;
  bgColor: string;
  canCancel: boolean;
}> = {
  matching: {
    label: 'Finding Suppliers',
    description: 'AI is matching your requirements with verified suppliers',
    color: '#8B5CF6',      // Purple
    bgColor: 'rgba(139, 92, 246, 0.1)',
    canCancel: true,
  },
  quoted: {
    label: 'Quotes Received',
    description: 'Supplier quotes are ready for your review',
    color: '#F97316',      // Orange
    bgColor: 'rgba(249, 115, 22, 0.1)',
    canCancel: true,
  },
  negotiating: {
    label: 'Negotiating',
    description: 'Finalizing terms with selected suppliers',
    color: '#3B82F6',      // Blue
    bgColor: 'rgba(59, 130, 246, 0.1)',
    canCancel: true,
  },
  completed: {
    label: 'Completed',
    description: 'Requirement fulfilled - supplier selected',
    color: '#10B981',      // Green
    bgColor: 'rgba(16, 185, 129, 0.1)',
    canCancel: false,
  },
  cancelled: {
    label: 'Cancelled',
    description: 'Requirement was cancelled',
    color: '#6B7280',      // Gray
    bgColor: 'rgba(107, 114, 128, 0.1)',
    canCancel: false,
  },
};

// Valid status transitions
const STATUS_TRANSITIONS: Record<RequirementStatus, RequirementStatus[]> = {
  matching: ['quoted', 'cancelled'],
  quoted: ['negotiating', 'completed', 'cancelled'],
  negotiating: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

// ============================================
// STATUS LOGIC
// ============================================

export function canTransitionStatus(
  currentStatus: RequirementStatus,
  newStatus: RequirementStatus
): boolean {
  return STATUS_TRANSITIONS[currentStatus]?.includes(newStatus) ?? false;
}

export function transitionStatus(
  requirement: Requirement,
  newStatus: RequirementStatus
): Requirement {
  if (!canTransitionStatus(requirement.status, newStatus)) {
    console.warn(`Invalid transition: ${requirement.status} -> ${newStatus}`);
    return requirement;
  }

  const now = new Date().toISOString();
  const config = STATUS_CONFIG[newStatus];

  return {
    ...requirement,
    status: newStatus,
    statusChangedAt: now,
    estimatedTime: calculateEstimatedTime(newStatus, requirement.urgency, requirement.products.length),
    timeline: [
      ...requirement.timeline,
      {
        id: `TL-${Date.now()}`,
        timestamp: now,
        type: 'status_change',
        title: `Status changed to ${config.label}`,
        description: config.description,
      },
    ],
  };
}

// ============================================
// ESTIMATED TIME CALCULATION
// ============================================

const STATUS_BASE_TIMES: Record<RequirementStatus, { min: number; max: number }> = {
  matching: { min: 1, max: 2 },       // 1-2 days
  quoted: { min: 2, max: 5 },         // 2-5 days for all quotes
  negotiating: { min: 1, max: 3 },    // 1-3 days to finalize
  completed: { min: 0, max: 0 },
  cancelled: { min: 0, max: 0 },
};

const URGENCY_MULTIPLIERS: Record<UrgencyLevel, number> = {
  standard: 1.0,
  urgent: 0.7,
  critical: 0.5,
};

export function calculateEstimatedTime(
  status: RequirementStatus,
  urgency: UrgencyLevel,
  productCount: number
): EstimatedTime {
  const baseTime = STATUS_BASE_TIMES[status];
  const urgencyMult = URGENCY_MULTIPLIERS[urgency];
  const complexityMult = 1 + (productCount - 1) * 0.1;

  const minDays = Math.max(0, Math.round(baseTime.min * urgencyMult * complexityMult));
  const maxDays = Math.max(minDays, Math.round(baseTime.max * urgencyMult * complexityMult));

  return {
    minDays,
    maxDays,
    displayText: formatTimeDisplay(minDays, maxDays),
    basedOn: generateEstimationBasis(urgency, productCount),
  };
}

function formatTimeDisplay(minDays: number, maxDays: number): string {
  if (minDays === 0 && maxDays === 0) return 'Complete';
  if (minDays === 0 && maxDays <= 1) return '< 24 hours';
  if (minDays <= 1 && maxDays <= 2) return '~24-48 hours';
  if (minDays === maxDays) return `~${minDays} day${minDays > 1 ? 's' : ''}`;
  return `${minDays}-${maxDays} days`;
}

function generateEstimationBasis(urgency: UrgencyLevel, productCount: number): string {
  const parts: string[] = [];
  parts.push(`${urgency} priority`);
  if (productCount > 1) {
    parts.push(`${productCount} products`);
  }
  return parts.join(', ');
}

// ============================================
// DEMO MODE SIMULATION
// ============================================

// Demo timing in milliseconds
const DEMO_TIMINGS: Record<RequirementStatus, number> = {
  matching: 30000,      // 30 seconds
  quoted: 45000,        // 45 seconds
  negotiating: 60000,   // 60 seconds
  completed: 0,
  cancelled: 0,
};

const DEMO_SUPPLIERS = [
  { name: 'Shenzhen Tech Industries', country: 'China', baseScore: 95 },
  { name: 'Vietnam Manufacturing Co.', country: 'Vietnam', baseScore: 88 },
  { name: 'Dhaka Exports Ltd.', country: 'Bangladesh', baseScore: 82 },
  { name: 'Taiwan Precision Corp.', country: 'Taiwan', baseScore: 91 },
  { name: 'Mumbai Trade Partners', country: 'India', baseScore: 79 },
  { name: 'Thailand Supply Chain', country: 'Thailand', baseScore: 85 },
  { name: 'Korea Electronics Hub', country: 'South Korea', baseScore: 93 },
];

export function generateDemoMatches(requirement: Requirement): SupplierMatch[] {
  const count = 3 + Math.floor(Math.random() * 3); // 3-5 matches
  const now = new Date().toISOString();

  return DEMO_SUPPLIERS
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .map((supplier, index) => ({
      id: `MATCH-${Date.now()}-${index}`,
      supplierName: supplier.name,
      supplierCountry: supplier.country,
      matchScore: supplier.baseScore + Math.floor(Math.random() * 5) - 2,
      status: 'pending' as SupplierMatchStatus,
      createdAt: now,
    }));
}

export function addDemoQuotes(matches: SupplierMatch[], targetPrice: number): SupplierMatch[] {
  return matches.map(match => ({
    ...match,
    status: 'quote_received' as SupplierMatchStatus,
    quotedPrice: targetPrice * (0.8 + Math.random() * 0.4), // 80%-120% of target
    quoteCurrency: 'USD',
    leadTime: 15 + Math.floor(Math.random() * 30), // 15-45 days
    moq: 1000 + Math.floor(Math.random() * 4000), // 1000-5000 units
  }));
}

export function scheduleDemoTransition(requirement: Requirement): Requirement {
  const timing = DEMO_TIMINGS[requirement.status];
  if (timing === 0) return requirement;

  return {
    ...requirement,
    _nextTransitionAt: new Date(Date.now() + timing).toISOString(),
  };
}

export function getNextDemoStatus(current: RequirementStatus): RequirementStatus | null {
  const progression: Record<RequirementStatus, RequirementStatus | null> = {
    matching: 'quoted',
    quoted: 'negotiating',
    negotiating: 'completed',
    completed: null,
    cancelled: null,
  };
  return progression[current];
}

export function processDemoTransition(requirement: Requirement): Requirement | null {
  if (!requirement._nextTransitionAt) return null;
  if (new Date(requirement._nextTransitionAt) > new Date()) return null;

  const nextStatus = getNextDemoStatus(requirement.status);
  if (!nextStatus) return null;

  let updated = transitionStatus(requirement, nextStatus);

  // Add demo data based on new status
  if (nextStatus === 'quoted') {
    const targetPrice = parseFloat(requirement.products[0]?.targetPrice || '10');
    updated = {
      ...updated,
      supplierMatches: addDemoQuotes(updated.supplierMatches, targetPrice),
      quotesReceived: updated.supplierMatches.length,
    };
  }

  return scheduleDemoTransition(updated);
}

// ============================================
// REQUIREMENT CREATION
// ============================================

export interface CreateRequirementInput {
  type: RequirementType;
  products: ProductItem[];
  urgency?: UrgencyLevel;
  preferredCountries?: string[];
  title?: string;
}

export function createRequirement(input: CreateRequirementInput): Requirement {
  const now = new Date();
  const prefix = input.type === 'bulk' ? 'BULK' : 'REQ';
  const id = `${prefix}-${now.getTime()}`;

  const urgency = input.urgency ?? 'standard';
  const title = input.title ?? generateDefaultTitle(input.products);

  const requirement: Requirement = {
    id,
    type: input.type,
    products: input.products.map((p, i) => ({
      ...p,
      id: p.id || `PROD-${now.getTime()}-${i}`,
    })),
    status: 'matching',
    statusChangedAt: now.toISOString(),
    supplierMatches: [],
    matchCount: 0,
    quotesReceived: 0,
    submittedAt: now.toISOString(),
    estimatedTime: calculateEstimatedTime('matching', urgency, input.products.length),
    urgency,
    preferredCountries: input.preferredCountries ?? [],
    title,
    timeline: [
      {
        id: `TL-${now.getTime()}`,
        timestamp: now.toISOString(),
        type: 'status_change',
        title: 'Requirement Submitted',
        description: 'Your sourcing requirement has been received and is being processed',
      },
    ],
  };

  // Add demo supplier matches
  const matches = generateDemoMatches(requirement);
  const withMatches: Requirement = {
    ...requirement,
    supplierMatches: matches,
    matchCount: matches.length,
    timeline: [
      ...requirement.timeline,
      {
        id: `TL-${now.getTime() + 1}`,
        timestamp: now.toISOString(),
        type: 'supplier_match',
        title: `Found ${matches.length} potential suppliers`,
        description: 'AI has identified verified suppliers matching your requirements',
      },
    ],
  };

  return scheduleDemoTransition(withMatches);
}

function generateDefaultTitle(products: ProductItem[]): string {
  if (products.length === 0) return 'Untitled Requirement';
  if (products.length === 1) return products[0].name;
  return `${products[0].name} + ${products.length - 1} more`;
}

// ============================================
// LOCAL STORAGE HELPERS
// ============================================

const STORAGE_KEY = 'befach-requirements';

export function getStoredRequirements(): Requirement[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = safeStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveRequirements(requirements: Requirement[]): void {
  if (typeof window === 'undefined') return;
  safeStorage.setItem(STORAGE_KEY, JSON.stringify(requirements));
}

export function addRequirementToStorage(requirement: Requirement): void {
  const existing = getStoredRequirements();
  saveRequirements([requirement, ...existing]);
}

export function updateRequirementInStorage(id: string, updates: Partial<Requirement>): void {
  const existing = getStoredRequirements();
  const updated = existing.map(req =>
    req.id === id ? { ...req, ...updates } : req
  );
  saveRequirements(updated);
}

export function getRequirementById(id: string): Requirement | undefined {
  const requirements = getStoredRequirements();
  return requirements.find(r => r.id === id);
}

// ============================================
// STATS HELPERS
// ============================================

export function getRequirementStats(requirements: Requirement[]): Record<RequirementStatus, number> {
  const counts: Record<RequirementStatus, number> = {
    matching: 0,
    quoted: 0,
    negotiating: 0,
    completed: 0,
    cancelled: 0,
  };

  for (const req of requirements) {
    counts[req.status]++;
  }

  return counts;
}

// ============================================
// TIME FORMATTING HELPERS
// ============================================

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
