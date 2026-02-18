import { safeStorage } from '@/lib/safeStorage';
// Conversations Management - Types, Helper Functions, Demo Data
// This module handles all supplier communication/inbox functionality

// ============================================
// TYPE DEFINITIONS
// ============================================

export type ConversationStatus = 'active' | 'awaiting_response' | 'quoted' | 'archived';
export type MessageType = 'text' | 'rfq' | 'quote' | 'attachment' | 'system';
export type MessageSender = 'user' | 'supplier' | 'system';
export type ConversationSource = 'requirement_match' | 'direct_contact' | 'invitation';

export interface RFQData {
  productName: string;
  quantity: string;
  unit: string;
  targetPrice?: string;
  specifications?: string;
  deliveryDate?: string;
}

export interface QuoteData {
  unitPrice: number;
  currency: string;
  moq: number;
  leadTime: number;
  validUntil: string;
  notes?: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface Message {
  id: string;
  conversationId: string;
  type: MessageType;
  content: string;
  rfqData?: RFQData;
  quoteData?: QuoteData;
  attachments?: Attachment[];
  sender: MessageSender;
  sentAt: string;
  readAt?: string;
}

export interface Conversation {
  id: string;

  // Supplier Info
  supplierId: string;
  supplierName: string;
  supplierCountry: string;
  supplierCategory?: string;
  supplierVerified: boolean;
  supplierRating?: number;
  supplierAvatar?: string;

  // Status
  status: ConversationStatus;
  isFavorite: boolean;

  // Message tracking
  messages: Message[];
  lastMessageAt: string;
  lastMessagePreview: string;
  unreadCount: number;

  // Source tracking
  source: ConversationSource;
  sourceId?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export type ConversationFilter = 'all' | 'active' | 'favorites' | 'quoted' | 'archived';

// ============================================
// STATUS CONFIGURATION
// ============================================

export const STATUS_CONFIG: Record<ConversationStatus, {
  label: string;
  color: string;
  bgColor: string;
}> = {
  active: {
    label: 'Active',
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
  },
  awaiting_response: {
    label: 'Awaiting Response',
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.1)',
  },
  quoted: {
    label: 'Quote Received',
    color: '#8B5CF6',
    bgColor: 'rgba(139, 92, 246, 0.1)',
  },
  archived: {
    label: 'Archived',
    color: '#6B7280',
    bgColor: 'rgba(107, 114, 128, 0.1)',
  },
};

// ============================================
// LOCAL STORAGE HELPERS
// ============================================

const STORAGE_KEY = 'befach-conversations';

export function getStoredConversations(): Conversation[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = safeStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveConversations(conversations: Conversation[]): void {
  if (typeof window === 'undefined') return;
  safeStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

export function getConversationById(id: string): Conversation | undefined {
  const conversations = getStoredConversations();
  return conversations.find(c => c.id === id);
}

export function getConversationBySupplier(supplierId: string): Conversation | null {
  const conversations = getStoredConversations();
  return conversations.find(c => c.supplierId === supplierId) || null;
}

// ============================================
// CONVERSATION MANAGEMENT
// ============================================

export function createConversation(supplierInfo: {
  supplierId: string;
  supplierName: string;
  supplierCountry: string;
  supplierCategory?: string;
  supplierVerified?: boolean;
  supplierRating?: number;
  source: ConversationSource;
  sourceId?: string;
  initialMessage?: string;
}): Conversation {
  const now = new Date().toISOString();
  const id = `CONV-${Date.now()}`;

  const messages: Message[] = [];

  // Add system message
  messages.push({
    id: `MSG-${Date.now()}-0`,
    conversationId: id,
    type: 'system',
    content: 'Conversation started',
    sender: 'system',
    sentAt: now,
  });

  // Add initial message if provided
  if (supplierInfo.initialMessage) {
    messages.push({
      id: `MSG-${Date.now()}-1`,
      conversationId: id,
      type: 'text',
      content: supplierInfo.initialMessage,
      sender: 'user',
      sentAt: now,
    });
  }

  const conversation: Conversation = {
    id,
    supplierId: supplierInfo.supplierId,
    supplierName: supplierInfo.supplierName,
    supplierCountry: supplierInfo.supplierCountry,
    supplierCategory: supplierInfo.supplierCategory,
    supplierVerified: supplierInfo.supplierVerified ?? false,
    supplierRating: supplierInfo.supplierRating,
    status: 'active',
    isFavorite: false,
    messages,
    lastMessageAt: now,
    lastMessagePreview: supplierInfo.initialMessage || 'Conversation started',
    unreadCount: 0,
    source: supplierInfo.source,
    sourceId: supplierInfo.sourceId,
    createdAt: now,
    updatedAt: now,
  };

  // Save to storage
  const existing = getStoredConversations();
  saveConversations([conversation, ...existing]);

  return conversation;
}

export function sendMessage(
  conversationId: string,
  content: string,
  type: MessageType = 'text',
  additionalData?: {
    rfqData?: RFQData;
    quoteData?: QuoteData;
    attachments?: Attachment[];
  }
): Message | null {
  const conversations = getStoredConversations();
  const index = conversations.findIndex(c => c.id === conversationId);

  if (index === -1) return null;

  const now = new Date().toISOString();
  const message: Message = {
    id: `MSG-${Date.now()}`,
    conversationId,
    type,
    content,
    sender: 'user',
    sentAt: now,
    ...additionalData,
  };

  // Update conversation
  conversations[index] = {
    ...conversations[index],
    messages: [...conversations[index].messages, message],
    lastMessageAt: now,
    lastMessagePreview: type === 'rfq' ? 'RFQ sent' : content.substring(0, 50),
    status: 'awaiting_response',
    updatedAt: now,
  };

  saveConversations(conversations);
  return message;
}

export function sendRFQ(
  conversationId: string,
  rfqData: RFQData
): Message | null {
  const content = `Request for Quote: ${rfqData.productName}`;
  return sendMessage(conversationId, content, 'rfq', { rfqData });
}

export function markAsRead(conversationId: string): void {
  const conversations = getStoredConversations();
  const index = conversations.findIndex(c => c.id === conversationId);

  if (index === -1) return;

  const now = new Date().toISOString();
  const updatedMessages = conversations[index].messages.map(msg => ({
    ...msg,
    readAt: msg.readAt || now,
  }));

  conversations[index] = {
    ...conversations[index],
    messages: updatedMessages,
    unreadCount: 0,
    updatedAt: now,
  };

  saveConversations(conversations);
}

export function toggleFavorite(conversationId: string): boolean {
  const conversations = getStoredConversations();
  const index = conversations.findIndex(c => c.id === conversationId);

  if (index === -1) return false;

  const newFavoriteStatus = !conversations[index].isFavorite;
  conversations[index] = {
    ...conversations[index],
    isFavorite: newFavoriteStatus,
    updatedAt: new Date().toISOString(),
  };

  saveConversations(conversations);
  return newFavoriteStatus;
}

export function archiveConversation(conversationId: string): void {
  const conversations = getStoredConversations();
  const index = conversations.findIndex(c => c.id === conversationId);

  if (index === -1) return;

  conversations[index] = {
    ...conversations[index],
    status: 'archived',
    updatedAt: new Date().toISOString(),
  };

  saveConversations(conversations);
}

export function deleteConversation(conversationId: string): void {
  const conversations = getStoredConversations();
  const filtered = conversations.filter(c => c.id !== conversationId);
  saveConversations(filtered);
}

// ============================================
// FILTERING & SORTING
// ============================================

export function filterConversations(
  conversations: Conversation[],
  filter: ConversationFilter,
  searchQuery?: string
): Conversation[] {
  let filtered = [...conversations];

  // Apply filter
  switch (filter) {
    case 'active':
      filtered = filtered.filter(c => c.status === 'active' || c.status === 'awaiting_response');
      break;
    case 'favorites':
      filtered = filtered.filter(c => c.isFavorite);
      break;
    case 'quoted':
      filtered = filtered.filter(c => c.status === 'quoted');
      break;
    case 'archived':
      filtered = filtered.filter(c => c.status === 'archived');
      break;
  }

  // Apply search
  if (searchQuery && searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(c =>
      c.supplierName.toLowerCase().includes(query) ||
      c.supplierCountry.toLowerCase().includes(query) ||
      (c.supplierCategory && c.supplierCategory.toLowerCase().includes(query))
    );
  }

  return filtered;
}

export function sortConversations(
  conversations: Conversation[],
  sortBy: 'recent' | 'unread' | 'favorites' | 'status' = 'recent'
): Conversation[] {
  const sorted = [...conversations];

  switch (sortBy) {
    case 'recent':
      sorted.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
      break;
    case 'unread':
      sorted.sort((a, b) => b.unreadCount - a.unreadCount);
      break;
    case 'favorites':
      sorted.sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
      break;
    case 'status':
      const statusOrder: Record<ConversationStatus, number> = {
        active: 0,
        awaiting_response: 1,
        quoted: 2,
        archived: 3,
      };
      sorted.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
      break;
  }

  return sorted;
}

// ============================================
// STATS HELPERS
// ============================================

export function getConversationStats(conversations: Conversation[]): {
  total: number;
  unread: number;
  active: number;
  quoted: number;
  favorites: number;
} {
  return {
    total: conversations.length,
    unread: conversations.reduce((sum, c) => sum + c.unreadCount, 0),
    active: conversations.filter(c => c.status === 'active' || c.status === 'awaiting_response').length,
    quoted: conversations.filter(c => c.status === 'quoted').length,
    favorites: conversations.filter(c => c.isFavorite).length,
  };
}

// ============================================
// TIME FORMATTING
// ============================================

export function formatMessageTime(dateString: string): string {
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
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatFullTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function formatDateSeparator(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
}

// ============================================
// DEMO DATA GENERATION
// ============================================

// ============================================
// COUNTRY FLAG HELPER
// ============================================

export function getCountryFlag(country: string): string {
  const flags: Record<string, string> = {
    'China': '🇨🇳',
    'India': '🇮🇳',
    'Vietnam': '🇻🇳',
    'Taiwan': '🇹🇼',
    'Thailand': '🇹🇭',
    'Bangladesh': '🇧🇩',
    'Indonesia': '🇮🇩',
    'Malaysia': '🇲🇾',
    'South Korea': '🇰🇷',
    'Japan': '🇯🇵',
    'USA': '🇺🇸',
    'Germany': '🇩🇪',
    'UK': '🇬🇧',
  };
  return flags[country] || '';
}
