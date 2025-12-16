// Recycle Bin - Storage Helpers and Types
// All deleted items from the platform are stored here for recovery

// ============================================
// TYPE DEFINITIONS
// ============================================

export type DeletedItemType =
  | 'requirement'
  | 'supplier'
  | 'vendor'
  | 'order'
  | 'document';

export interface DeletedItem {
  id: string;
  originalId: string;
  type: DeletedItemType;
  title: string;
  description?: string;
  data: unknown; // The original item data for restoration
  deletedAt: string;
  deletedBy?: string;
  expiresAt: string; // Auto-delete after 30 days
}

// ============================================
// CONFIGURATION
// ============================================

const STORAGE_KEY = 'befach-recycle-bin';
const RETENTION_DAYS = 30; // Items auto-delete after 30 days

// Type labels for display
export const TYPE_LABELS: Record<DeletedItemType, { label: string; icon: string }> = {
  requirement: { label: 'Requirement', icon: '📋' },
  supplier: { label: 'Supplier', icon: '🏭' },
  vendor: { label: 'Vendor', icon: '⭐' },
  order: { label: 'Order', icon: '📦' },
  document: { label: 'Document', icon: '📄' },
};

// ============================================
// STORAGE HELPERS
// ============================================

export function getRecycleBinItems(): DeletedItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const items: DeletedItem[] = JSON.parse(data);

    // Filter out expired items
    const now = new Date();
    const validItems = items.filter(item => new Date(item.expiresAt) > now);

    // Save back if we removed expired items
    if (validItems.length !== items.length) {
      saveRecycleBinItems(validItems);
    }

    return validItems;
  } catch {
    return [];
  }
}

export function saveRecycleBinItems(items: DeletedItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function addToRecycleBin(
  type: DeletedItemType,
  originalId: string,
  title: string,
  data: unknown,
  description?: string
): DeletedItem {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + RETENTION_DAYS * 24 * 60 * 60 * 1000);

  const deletedItem: DeletedItem = {
    id: `DEL-${now.getTime()}`,
    originalId,
    type,
    title,
    description,
    data,
    deletedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  const existing = getRecycleBinItems();
  saveRecycleBinItems([deletedItem, ...existing]);

  return deletedItem;
}

export function restoreFromRecycleBin(id: string): DeletedItem | null {
  const items = getRecycleBinItems();
  const itemIndex = items.findIndex(item => item.id === id);

  if (itemIndex === -1) return null;

  const [restoredItem] = items.splice(itemIndex, 1);
  saveRecycleBinItems(items);

  return restoredItem;
}

export function permanentlyDelete(id: string): boolean {
  const items = getRecycleBinItems();
  const filteredItems = items.filter(item => item.id !== id);

  if (filteredItems.length === items.length) return false;

  saveRecycleBinItems(filteredItems);
  return true;
}

export function emptyRecycleBin(): void {
  saveRecycleBinItems([]);
}

export function getRecycleBinStats(): Record<DeletedItemType, number> {
  const items = getRecycleBinItems();
  const stats: Record<DeletedItemType, number> = {
    requirement: 0,
    supplier: 0,
    vendor: 0,
    order: 0,
    document: 0,
  };

  for (const item of items) {
    stats[item.type]++;
  }

  return stats;
}

// ============================================
// TIME FORMATTING HELPERS
// ============================================

export function formatDeletedTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

export function getDaysUntilExpiry(expiresAt: string): number {
  const expiry = new Date(expiresAt);
  const now = new Date();
  const diffMs = expiry.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}
