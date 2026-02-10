import { AIMessage, AIConversation, AIResponseMatch, SuggestionChip } from '@/types/chat';
import { safeStorage } from '@/lib/safeStorage';

// ============ CONSTANTS ============

const STORAGE_KEY = 'befach-ai-conversations';
const MAX_MESSAGES_PER_CONVERSATION = 50;
const MAX_CONVERSATIONS = 20;
const TYPING_DELAY_MIN = 800;
const TYPING_DELAY_MAX = 1800;

// ============ HELPERS ============

function generateId(prefix: string): string {
  const random = Math.random().toString(36).substring(2, 11);
  return `${prefix}-${Date.now()}-${random}`;
}

function truncateTitle(text: string, maxLen = 60): string {
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen).trim() + '...';
}

export function getTypingDelay(): number {
  return Math.floor(Math.random() * (TYPING_DELAY_MAX - TYPING_DELAY_MIN + 1)) + TYPING_DELAY_MIN;
}

export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

// ============ AI RESPONSE ENGINE ============

const RESPONSE_MATCHES: AIResponseMatch[] = [
  {
    keywords: ['hs code', 'hsn', 'harmonized', 'hsn code'],
    category: 'hs-code',
    response: 'HS (Harmonized System) codes are standardized numerical codes used to classify traded products. You can look up HS codes for any product using our EX-IM Data tool. Simply search by product name or code to find detailed import/export records and classifications.',
    links: [{ label: 'Open EX-IM Data', href: '/exim-data' }],
  },
  {
    keywords: ['duty', 'tariff', 'customs duty', 'import duty'],
    category: 'duty',
    response: 'Import duties are calculated based on the CIF (Cost, Insurance, Freight) value of goods multiplied by the applicable duty rate for that HS code. Rates vary by product and country of origin. Our Cost Calculator can give you a detailed breakdown including Basic Customs Duty, IGST, and other charges.',
    links: [{ label: 'Calculate Duties', href: '/cost-calculator' }],
  },
  {
    keywords: ['gst', 'igst', 'tax', 'goods and services'],
    category: 'tax',
    response: 'IGST (Integrated GST) on imports is calculated on the assessable value + Basic Customs Duty + Social Welfare Surcharge. The rate typically ranges from 5% to 28% depending on the product category. Use our Cost Calculator for precise IGST calculations for your specific product.',
    links: [{ label: 'Calculate GST', href: '/cost-calculator' }],
  },
  {
    keywords: ['cif', 'fob', 'incoterm', 'incoterms'],
    category: 'incoterms',
    response: 'Incoterms define the responsibilities between buyer and seller. FOB (Free On Board) means the seller covers costs until goods are loaded on the vessel. CIF (Cost, Insurance, Freight) means the seller also covers freight and insurance. CIF is the basis for duty calculation in India. Our Cost Calculator supports both.',
    links: [{ label: 'Cost Calculator', href: '/cost-calculator' }],
  },
  {
    keywords: ['boe', 'bill of entry', 'customs clearance', 'icegate'],
    category: 'boe',
    response: 'A Bill of Entry (BOE) is filed through ICEGATE for customs clearance. You need: Commercial Invoice, Packing List, Bill of Lading/Airway Bill, Import License (if applicable), and Insurance Certificate. The process involves classification, duty assessment, and examination. Check our Documents section for detailed guides.',
    links: [{ label: 'View Documents Guide', href: '/documents' }],
  },
  {
    keywords: ['document', 'paperwork', 'compliance', 'certificate', 'required document'],
    category: 'documents',
    response: 'For imports, you typically need: Commercial Invoice, Packing List, Bill of Lading/Airway Bill, Certificate of Origin, Insurance Certificate, Import License (if required), and FSSAI/BIS certificates for specific products. The exact requirements depend on the product category and country of origin.',
    links: [{ label: 'Documents Section', href: '/documents' }],
  },
  {
    keywords: ['supplier', 'find', 'source', 'manufacturer', 'vendor'],
    category: 'supplier',
    response: 'I can help you find reliable suppliers! Our Smart Sourcing tool lets you search by product, industry, or location. You can view supplier profiles, ratings, certifications, and past trade history. We also verify supplier credentials to ensure authenticity.',
    links: [{ label: 'Find Suppliers', href: '/smart-sourcing' }],
  },
  {
    keywords: ['verify', 'credential', 'authentic', 'legitimate', 'trust'],
    category: 'verification',
    response: 'To verify a supplier, check: business registration documents, export licenses, factory audit reports, ISO/quality certifications, and trade references. Our platform provides verified supplier profiles with ratings and trade history. Always request samples before placing large orders.',
    links: [{ label: 'Search Verified Suppliers', href: '/smart-sourcing' }],
  },
  {
    keywords: ['track', 'shipment', 'delivery', 'status', 'where is my'],
    category: 'tracking',
    response: 'You can track your shipments in real-time using our Track Shipment tool. Enter your Bill of Lading number or booking reference to see current location, estimated delivery date, customs status, and milestone history.',
    links: [{ label: 'Track Shipment', href: '/track-shipment' }],
  },
  {
    keywords: ['book', 'freight', 'ship', 'logistics', 'container'],
    category: 'booking',
    response: 'Our Book Shipment feature lets you compare rates for FCL (Full Container Load), LCL (Less than Container Load), and air freight. You can get instant quotes, compare carriers, and book directly. FCL is cost-effective for large volumes, while LCL works well for smaller shipments.',
    links: [{ label: 'Book Shipment', href: '/book-shipment' }],
  },
  {
    keywords: ['cost', 'price', 'calculate', 'estimate', 'how much'],
    category: 'cost',
    response: 'Our Cost Calculator provides a comprehensive landed cost breakdown including: product cost, freight, insurance, customs duty, IGST, port charges, and other fees. Enter your product details and we\'ll show you the exact cost from factory to warehouse.',
    links: [{ label: 'Open Cost Calculator', href: '/cost-calculator' }],
  },
  {
    keywords: ['payment', 'lc', 'letter of credit', 'wire', 'remittance', 'pay'],
    category: 'payment',
    response: 'We support multiple payment methods: Wire Transfer (T/T), Letter of Credit (L/C), and Document Against Payment (D/P). Wire transfers are fastest, while L/Cs offer buyer protection for large orders. Our Payments section helps you manage all transactions securely.',
    links: [{ label: 'Make Payment', href: '/payments/new' }],
  },
  {
    keywords: ['exim', 'import data', 'export data', 'trade data'],
    category: 'exim',
    response: 'Our EX-IM Data tool gives you access to global import-export shipment records. Search by product, HS code, buyer (consignee), or supplier (shipper) for any country. View shipment volumes, trade values, top traders, and market trends.',
    links: [{ label: 'Explore EX-IM Data', href: '/exim-data' }],
  },
  {
    keywords: ['market', 'trend', 'insight', 'analysis'],
    category: 'market',
    response: 'Our Market Insights page tracks commodity trends, price movements, and trade volumes across key sectors. Stay updated on market conditions to make informed sourcing decisions.',
    links: [{ label: 'View Market Insights', href: '/market-insights' }],
  },
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening'],
    category: 'greeting',
    response: 'Hello! I\'m Befach AI, your trade assistant. I can help you with import/export regulations, duty calculations, supplier search, shipment tracking, and more. What would you like to know?',
  },
  {
    keywords: ['thank', 'thanks', 'appreciate'],
    category: 'thanks',
    response: 'You\'re welcome! If you have any more questions about trade, logistics, or anything on the platform, feel free to ask anytime.',
  },
];

const DEFAULT_RESPONSE: AIResponseMatch = {
  keywords: [],
  category: 'default',
  response: 'I can help you with a variety of trade-related topics including import/export regulations, duty calculations, supplier search, documentation requirements, shipment tracking, cost estimation, and payment management. Could you tell me more specifically what you need help with?',
};

export function getAIResponse(userMessage: string): { text: string; links?: Array<{ label: string; href: string }> } {
  const normalized = userMessage.toLowerCase();

  for (const match of RESPONSE_MATCHES) {
    const found = match.keywords.some(keyword => normalized.includes(keyword));
    if (found) {
      return { text: match.response, links: match.links };
    }
  }

  return { text: DEFAULT_RESPONSE.response, links: DEFAULT_RESPONSE.links };
}

// ============ CONTEXT-AWARE SUGGESTIONS ============

const PAGE_SUGGESTIONS: Array<{ pattern: string; suggestions: SuggestionChip[] }> = [
  {
    pattern: '/dashboard',
    suggestions: [
      { label: 'View recent orders', query: 'Show me my recent orders and their status' },
      { label: 'Find new suppliers', query: 'How can I find reliable suppliers?' },
      { label: 'Calculate costs', query: 'How do I calculate import costs?' },
    ],
  },
  {
    pattern: '/cost-calculator',
    suggestions: [
      { label: 'How are duties calculated?', query: 'How are import duties calculated?' },
      { label: 'What is CIF value?', query: 'What is CIF value and how is it different from FOB?' },
      { label: 'Explain IGST', query: 'How is IGST calculated on imports?' },
    ],
  },
  {
    pattern: '/smart-sourcing',
    suggestions: [
      { label: 'How to verify suppliers?', query: 'How do I verify a supplier\'s credentials?' },
      { label: 'Certifications to look for?', query: 'What certifications should I look for in suppliers?' },
      { label: 'Minimum order tips', query: 'How do I negotiate minimum order quantities?' },
    ],
  },
  {
    pattern: '/exim-data',
    suggestions: [
      { label: 'How to read shipment data?', query: 'How do I read and analyze shipment data?' },
      { label: 'What is HS code?', query: 'What is an HS code and how do I find the right one?' },
      { label: 'Top importing countries', query: 'Which are the top importing countries for electronics?' },
    ],
  },
  {
    pattern: '/track-shipment',
    suggestions: [
      { label: 'Shipment status meanings', query: 'What do different shipment statuses mean?' },
      { label: 'Estimated delivery', query: 'How are estimated delivery times calculated?' },
      { label: 'Customs hold process', query: 'What happens when a shipment is held by customs?' },
    ],
  },
  {
    pattern: '/book-shipment',
    suggestions: [
      { label: 'FCL vs LCL?', query: 'What is the difference between FCL and LCL shipping?' },
      { label: 'Air vs sea freight?', query: 'When should I choose air freight over sea freight?' },
      { label: 'Shipping documents', query: 'What documents are required for shipping?' },
    ],
  },
  {
    pattern: '/payments',
    suggestions: [
      { label: 'LC vs wire transfer?', query: 'What is the difference between Letter of Credit and wire transfer?' },
      { label: 'Payment terms explained', query: 'What payment terms are common in international trade?' },
      { label: 'FX rate tips', query: 'How can I get better foreign exchange rates?' },
    ],
  },
  {
    pattern: '/documents',
    suggestions: [
      { label: 'Required import documents?', query: 'What documents are required for importing goods?' },
      { label: 'BOE filing process', query: 'How do I file a Bill of Entry?' },
      { label: 'Certificate of Origin', query: 'What is a Certificate of Origin and when is it needed?' },
    ],
  },
  {
    pattern: '/our-vendors',
    suggestions: [
      { label: 'Evaluate suppliers', query: 'How should I evaluate and compare suppliers?' },
      { label: 'Negotiation tips', query: 'What are some negotiation tips for international suppliers?' },
      { label: 'Supplier onboarding', query: 'What is the supplier onboarding process?' },
    ],
  },
];

const DEFAULT_SUGGESTIONS: SuggestionChip[] = [
  { label: 'Calculate import duties', query: 'How do I calculate import duties for my products?' },
  { label: 'Find suppliers', query: 'How can I find reliable suppliers for my products?' },
  { label: 'Track shipment', query: 'How do I track my shipments?' },
  { label: 'Required documents', query: 'What documents do I need for importing?' },
];

export function getSuggestionsForPage(pathname: string): SuggestionChip[] {
  const match = PAGE_SUGGESTIONS.find(p => pathname.startsWith(p.pattern));
  return match ? match.suggestions : DEFAULT_SUGGESTIONS;
}

// ============ PERSISTENCE (localStorage CRUD) ============

function loadConversations(): AIConversation[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = safeStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const conversations: AIConversation[] = JSON.parse(data);
    return conversations.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch {
    return [];
  }
}

function saveConversations(conversations: AIConversation[]): void {
  if (typeof window === 'undefined') return;
  // Enforce max conversations
  const trimmed = conversations
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, MAX_CONVERSATIONS);
  safeStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

export function getConversations(): AIConversation[] {
  return loadConversations();
}

export function getConversation(id: string): AIConversation | null {
  const conversations = loadConversations();
  return conversations.find(c => c.id === id) || null;
}

export function getActiveConversation(): AIConversation | null {
  const conversations = loadConversations();
  return conversations.length > 0 ? conversations[0] : null;
}

export function createConversation(originPage?: string): AIConversation {
  const conversation: AIConversation = {
    id: generateId('conv'),
    title: 'New Conversation',
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    originPage,
  };

  const conversations = loadConversations();
  conversations.unshift(conversation);
  saveConversations(conversations);
  return conversation;
}

export function addMessage(
  conversationId: string,
  role: 'user' | 'ai' | 'system',
  text: string,
  links?: Array<{ label: string; href: string }>
): AIMessage {
  const conversations = loadConversations();
  const convIndex = conversations.findIndex(c => c.id === conversationId);

  const message: AIMessage = {
    id: generateId('msg'),
    conversationId,
    role,
    text,
    timestamp: new Date().toISOString(),
    links,
  };

  if (convIndex >= 0) {
    const conv = conversations[convIndex];
    conv.messages.push(message);

    // Enforce max messages (trim oldest non-system)
    if (conv.messages.length > MAX_MESSAGES_PER_CONVERSATION) {
      const systemMsgs = conv.messages.filter(m => m.role === 'system');
      const otherMsgs = conv.messages.filter(m => m.role !== 'system');
      conv.messages = [...systemMsgs, ...otherMsgs.slice(-MAX_MESSAGES_PER_CONVERSATION + systemMsgs.length)];
    }

    // Update title from first user message
    if (role === 'user' && conv.title === 'New Conversation') {
      conv.title = truncateTitle(text);
    }

    conv.updatedAt = new Date().toISOString();
    saveConversations(conversations);
  }

  return message;
}

export function deleteConversation(id: string): boolean {
  const conversations = loadConversations();
  const filtered = conversations.filter(c => c.id !== id);
  if (filtered.length < conversations.length) {
    saveConversations(filtered);
    return true;
  }
  return false;
}

export function clearAllConversations(): void {
  if (typeof window === 'undefined') return;
  safeStorage.removeItem(STORAGE_KEY);
}
