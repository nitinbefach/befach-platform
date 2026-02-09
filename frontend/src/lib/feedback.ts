// Feedback & Review Management System
// localStorage-based data layer (designed for easy Supabase migration)

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type FeedbackType = 'stars' | 'thumbs' | 'scale' | 'emoji' | 'nps' | 'survey';
export type Sentiment = 'positive' | 'neutral' | 'negative';

export interface FeedbackEntry {
  id: string;
  type: FeedbackType;
  feature: string;
  response: number | string | Record<string, unknown>;
  sentiment: Sentiment;
  comments?: string;
  surveyType?: string;
  completionTime?: number;
  completionRate?: number;
  sessionId: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export interface SurveyQuestion {
  id: string;
  type: 'multiple_choice' | 'scale' | 'text' | 'binary' | 'checkbox';
  question: string;
  options?: string[];
  required: boolean;
  labels?: [string, string];
  placeholder?: string;
  min?: number;
  max?: number;
}

export interface SurveyDefinition {
  title: string;
  questions: SurveyQuestion[];
}

export interface FeedbackStats {
  totalResponses: number;
  avgRating: number;
  npsScore: number;
  responseRate: number;
  featureScores: Record<string, { avg: number; count: number }>;
  sentimentBreakdown: { positive: number; neutral: number; negative: number };
}

export interface FeedbackFilters {
  feature?: string;
  type?: FeedbackType;
  sentiment?: Sentiment;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEY = 'befach_feedback';

export const FEEDBACK_FEATURES: Record<string, string> = {
  'cost-calculator': 'Cost Calculator',
  'supplier-search': 'Supplier Search',
  'vendor-management': 'Vendor Management',
  'shipment-tracking': 'Shipment Tracking',
  'market-insights': 'Market Insights',
  'document-management': 'Document Management',
  'performance-review': 'Performance Review',
  'submit-requirement': 'Submit Requirement',
  'cost-calculator-history': 'Calculator History',
  'settings': 'Settings',
  'shipping-calculator': 'Shipping Calculator',
  'contact': 'Contact',
  'general': 'General Platform',
  'overall-satisfaction': 'Overall Satisfaction'
};

export const SURVEY_DEFINITIONS: Record<string, SurveyDefinition> = {
  vendor_management: {
    title: 'Vendor Management Feedback',
    questions: [
      {
        id: 'vm_usage',
        type: 'multiple_choice',
        question: 'How often do you manage vendor relationships?',
        options: ['Daily', 'Weekly', 'Monthly', 'Rarely'],
        required: true
      },
      {
        id: 'vm_pipeline',
        type: 'scale',
        question: 'How intuitive is the vendor pipeline (Kanban view)?',
        min: 1,
        max: 5,
        labels: ['Not intuitive', 'Very intuitive'],
        required: true
      },
      {
        id: 'vm_health_scores',
        type: 'multiple_choice',
        question: 'Which health score metric is most valuable to you?',
        options: ['Quality Score', 'Delivery Score', 'Response Score', 'Compliance Score', 'Overall Score'],
        required: true
      },
      {
        id: 'vm_missing',
        type: 'text',
        question: 'What features are missing from vendor management?',
        placeholder: 'Tell us what would make this better...',
        required: false
      },
      {
        id: 'vm_recommend',
        type: 'binary',
        question: 'Would you recommend this vendor management system to a colleague?',
        options: ['Yes', 'No'],
        required: true
      }
    ]
  },
  cost_calculator: {
    title: 'Cost Calculator Feedback',
    questions: [
      {
        id: 'cc_accuracy',
        type: 'scale',
        question: 'How accurate were the cost calculations?',
        min: 1,
        max: 5,
        labels: ['Very inaccurate', 'Very accurate'],
        required: true
      },
      {
        id: 'cc_wizard',
        type: 'multiple_choice',
        question: 'How was your experience with the step-by-step wizard?',
        options: ['Too simple', 'Just right', 'Too complex', 'Confusing'],
        required: true
      },
      {
        id: 'cc_missing_costs',
        type: 'checkbox',
        question: 'Which cost components were missing? (Check all that apply)',
        options: ['Insurance', 'Warehousing', 'Inspection fees', 'Currency conversion', 'Other taxes', 'None'],
        required: false
      },
      {
        id: 'cc_export',
        type: 'binary',
        question: 'Did you find the export functionality useful?',
        options: ['Yes', 'No'],
        required: true
      },
      {
        id: 'cc_improvements',
        type: 'text',
        question: 'How can we improve the cost calculator?',
        placeholder: 'Your suggestions...',
        required: false
      }
    ]
  },
  general: {
    title: 'General Platform Feedback',
    questions: [
      {
        id: 'g_first_impression',
        type: 'scale',
        question: 'What was your first impression of Befach?',
        min: 1,
        max: 5,
        labels: ['Poor', 'Excellent'],
        required: true
      },
      {
        id: 'g_pain_points',
        type: 'checkbox',
        question: 'What challenges did you face? (Check all that apply)',
        options: ['Navigation confusion', 'Slow performance', 'Missing features', 'Data entry complexity', 'Unclear terminology', 'None'],
        required: false
      },
      {
        id: 'g_most_valuable',
        type: 'multiple_choice',
        question: 'Which feature is most valuable to you?',
        options: ['Vendor Management', 'Cost Calculator', 'Supplier Search', 'Market Insights', 'Shipment Tracking'],
        required: true
      },
      {
        id: 'g_adoption',
        type: 'multiple_choice',
        question: 'How likely are you to use Befach for your business?',
        options: ['Definitely will', 'Probably will', 'Might or might not', 'Probably won\'t', 'Definitely won\'t'],
        required: true
      },
      {
        id: 'g_final_thoughts',
        type: 'text',
        question: 'Any final thoughts or suggestions?',
        placeholder: 'We value your feedback...',
        required: false
      }
    ]
  }
};

// ============================================================================
// STORAGE OPERATIONS (swap these for Supabase in Phase 2)
// ============================================================================

export function getFeedbackList(filters?: FeedbackFilters): FeedbackEntry[] {
  if (typeof window === 'undefined') return [];

  const data = localStorage.getItem(STORAGE_KEY);
  let entries: FeedbackEntry[] = data ? JSON.parse(data) : [];

  if (filters) {
    if (filters.feature) {
      entries = entries.filter(e => e.feature === filters.feature);
    }
    if (filters.type) {
      entries = entries.filter(e => e.type === filters.type);
    }
    if (filters.sentiment) {
      entries = entries.filter(e => e.sentiment === filters.sentiment);
    }
  }

  // Sort by timestamp descending (newest first)
  return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function submitFeedback(entry: Omit<FeedbackEntry, 'id' | 'timestamp'>): FeedbackEntry {
  const newEntry: FeedbackEntry = {
    ...entry,
    id: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString()
  };

  const existing = getFeedbackList();
  const updated = [newEntry, ...existing];

  // Keep max 1000 entries
  const trimmed = updated.slice(0, 1000);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));

  return newEntry;
}

export function deleteFeedback(id: string): boolean {
  const existing = getFeedbackList();
  const filtered = existing.filter(e => e.id !== id);
  if (filtered.length === existing.length) return false;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

// ============================================================================
// SENTIMENT DETECTION
// ============================================================================

export function getSentiment(type: FeedbackType, response: unknown): Sentiment {
  switch (type) {
    case 'stars':
    case 'scale': {
      const val = typeof response === 'number' ? response : parseInt(String(response));
      if (val >= 4) return 'positive';
      if (val <= 2) return 'negative';
      return 'neutral';
    }
    case 'thumbs':
      return response === 'up' ? 'positive' : 'negative';
    case 'emoji':
      if (response === 'happy') return 'positive';
      if (response === 'sad') return 'negative';
      return 'neutral';
    case 'nps': {
      const score = typeof response === 'number' ? response : parseInt(String(response));
      if (score >= 9) return 'positive';
      if (score <= 6) return 'negative';
      return 'neutral';
    }
    default:
      return 'neutral';
  }
}

// ============================================================================
// ANALYTICS & STATS
// ============================================================================

export function getFeedbackStats(): FeedbackStats {
  const all = getFeedbackList();

  // Total responses
  const totalResponses = all.length;

  // Average rating (from stars and scale types)
  const ratingEntries = all.filter(e => e.type === 'stars' || e.type === 'scale');
  const avgRating = ratingEntries.length > 0
    ? ratingEntries.reduce((sum, e) => sum + (typeof e.response === 'number' ? e.response : 0), 0) / ratingEntries.length
    : 0;

  // NPS Score
  const npsEntries = all.filter(e => e.type === 'nps');
  let npsScore = 0;
  if (npsEntries.length > 0) {
    const promoters = npsEntries.filter(e => typeof e.response === 'number' && e.response >= 9).length;
    const detractors = npsEntries.filter(e => typeof e.response === 'number' && e.response <= 6).length;
    npsScore = Math.round(((promoters - detractors) / npsEntries.length) * 100);
  }

  // Response rate (simulated — ratio of entries with comments)
  const withComments = all.filter(e => e.comments && e.comments.trim().length > 0).length;
  const responseRate = totalResponses > 0 ? Math.round((withComments / totalResponses) * 100) : 0;

  // Feature scores
  const featureScores: Record<string, { avg: number; count: number }> = {};
  const ratingByFeature: Record<string, number[]> = {};

  ratingEntries.forEach(e => {
    if (!ratingByFeature[e.feature]) ratingByFeature[e.feature] = [];
    if (typeof e.response === 'number') {
      ratingByFeature[e.feature].push(e.response);
    }
  });

  Object.entries(ratingByFeature).forEach(([feature, ratings]) => {
    featureScores[feature] = {
      avg: parseFloat((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)),
      count: ratings.length
    };
  });

  // Sentiment breakdown
  const sentimentBreakdown = {
    positive: all.filter(e => e.sentiment === 'positive').length,
    neutral: all.filter(e => e.sentiment === 'neutral').length,
    negative: all.filter(e => e.sentiment === 'negative').length
  };

  return {
    totalResponses,
    avgRating: parseFloat(avgRating.toFixed(1)),
    npsScore,
    responseRate,
    featureScores,
    sentimentBreakdown
  };
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

export function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';

  let sessionId = sessionStorage.getItem('befach_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('befach_session_id', sessionId);
  }
  return sessionId;
}

// ============================================================================
// CSV EXPORT
// ============================================================================

export function exportFeedbackCSV(): string {
  const entries = getFeedbackList();
  const headers = ['ID', 'Type', 'Feature', 'Response', 'Sentiment', 'Comments', 'Timestamp', 'Session ID'];

  const rows = entries.map(e => [
    e.id,
    e.type,
    FEEDBACK_FEATURES[e.feature] || e.feature,
    typeof e.response === 'object' ? JSON.stringify(e.response) : String(e.response),
    e.sentiment,
    (e.comments || '').replace(/,/g, ';').replace(/\n/g, ' '),
    e.timestamp,
    e.sessionId
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export function downloadFeedbackCSV(): void {
  const csv = exportFeedbackCSV();
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `befach-feedback-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// ============================================================================
// DEMO DATA GENERATION
// ============================================================================

export function generateDemoFeedback(): FeedbackEntry[] {
  const now = new Date();
  const demoEntries: FeedbackEntry[] = [
    {
      id: 'fb_demo_001', type: 'stars', feature: 'vendor-management', response: 5,
      sentiment: 'positive', comments: 'The kanban board view makes it very easy to track vendor relationships at a glance.',
      timestamp: new Date(now.getTime() - 5 * 86400000).toISOString(), sessionId: 'session_demo_001'
    },
    {
      id: 'fb_demo_002', type: 'thumbs', feature: 'cost-calculator', response: 'up',
      sentiment: 'positive', timestamp: new Date(now.getTime() - 5 * 86400000).toISOString(), sessionId: 'session_demo_001'
    },
    {
      id: 'fb_demo_003', type: 'scale', feature: 'cost-calculator', response: 4,
      sentiment: 'positive', comments: 'Calculation seems accurate but would like more transparency on duty rates.',
      timestamp: new Date(now.getTime() - 4 * 86400000).toISOString(), sessionId: 'session_demo_002'
    },
    {
      id: 'fb_demo_004', type: 'nps', feature: 'overall-satisfaction', response: 8,
      sentiment: 'neutral', timestamp: new Date(now.getTime() - 4 * 86400000).toISOString(), sessionId: 'session_demo_002'
    },
    {
      id: 'fb_demo_005', type: 'emoji', feature: 'performance-review', response: 'happy',
      sentiment: 'positive', timestamp: new Date(now.getTime() - 4 * 86400000).toISOString(), sessionId: 'session_demo_003'
    },
    {
      id: 'fb_demo_006', type: 'survey', feature: 'vendor-management', response: { vm_usage: 'Daily', vm_pipeline: 5, vm_health_scores: 'Overall Score', vm_missing: 'Automated vendor onboarding would be helpful', vm_recommend: 'Yes' },
      sentiment: 'positive', surveyType: 'vendor_management', completionTime: 125000, completionRate: 100,
      timestamp: new Date(now.getTime() - 3 * 86400000).toISOString(), sessionId: 'session_demo_004'
    },
    {
      id: 'fb_demo_007', type: 'thumbs', feature: 'document-management', response: 'down',
      sentiment: 'negative', comments: 'Upload process is slow for large files',
      timestamp: new Date(now.getTime() - 3 * 86400000).toISOString(), sessionId: 'session_demo_005'
    },
    {
      id: 'fb_demo_008', type: 'stars', feature: 'cost-calculator', response: 3,
      sentiment: 'neutral', timestamp: new Date(now.getTime() - 3 * 86400000).toISOString(), sessionId: 'session_demo_005'
    },
    {
      id: 'fb_demo_009', type: 'scale', feature: 'performance-review', response: 5,
      sentiment: 'positive', comments: 'Charts are clear and informative',
      timestamp: new Date(now.getTime() - 2 * 86400000).toISOString(), sessionId: 'session_demo_006'
    },
    {
      id: 'fb_demo_010', type: 'nps', feature: 'overall-satisfaction', response: 9,
      sentiment: 'positive', timestamp: new Date(now.getTime() - 2 * 86400000).toISOString(), sessionId: 'session_demo_006'
    },
    {
      id: 'fb_demo_011', type: 'emoji', feature: 'vendor-management', response: 'neutral',
      sentiment: 'neutral', timestamp: new Date(now.getTime() - 2 * 86400000).toISOString(), sessionId: 'session_demo_007'
    },
    {
      id: 'fb_demo_012', type: 'stars', feature: 'vendor-management', response: 4,
      sentiment: 'positive', timestamp: new Date(now.getTime() - 2 * 86400000).toISOString(), sessionId: 'session_demo_008'
    },
    {
      id: 'fb_demo_013', type: 'survey', feature: 'cost-calculator', response: { cc_accuracy: 4, cc_wizard: 'Just right', cc_missing_costs: ['Insurance', 'Currency conversion'], cc_export: 'Yes', cc_improvements: 'Add support for multiple currency calculations' },
      sentiment: 'positive', surveyType: 'cost_calculator', completionTime: 95000, completionRate: 100,
      timestamp: new Date(now.getTime() - 1 * 86400000).toISOString(), sessionId: 'session_demo_009'
    },
    {
      id: 'fb_demo_014', type: 'thumbs', feature: 'supplier-search', response: 'up',
      sentiment: 'positive', timestamp: new Date(now.getTime() - 1 * 86400000).toISOString(), sessionId: 'session_demo_010'
    },
    {
      id: 'fb_demo_015', type: 'scale', feature: 'market-insights', response: 4,
      sentiment: 'positive', timestamp: new Date(now.getTime() - 1 * 86400000).toISOString(), sessionId: 'session_demo_011'
    },
    {
      id: 'fb_demo_016', type: 'nps', feature: 'overall-satisfaction', response: 7,
      sentiment: 'neutral', timestamp: new Date(now.getTime() - 1 * 86400000).toISOString(), sessionId: 'session_demo_011'
    },
    {
      id: 'fb_demo_017', type: 'emoji', feature: 'cost-calculator', response: 'sad',
      sentiment: 'negative', comments: 'Too many steps in the wizard',
      timestamp: new Date(now.getTime() - 0.5 * 86400000).toISOString(), sessionId: 'session_demo_012'
    },
    {
      id: 'fb_demo_018', type: 'stars', feature: 'performance-review', response: 5,
      sentiment: 'positive', comments: 'Excellent visualization of vendor performance metrics',
      timestamp: new Date(now.getTime() - 0.5 * 86400000).toISOString(), sessionId: 'session_demo_013'
    },
    {
      id: 'fb_demo_019', type: 'nps', feature: 'overall-satisfaction', response: 10,
      sentiment: 'positive', comments: 'Would definitely recommend to other procurement teams',
      timestamp: new Date(now.getTime() - 0.25 * 86400000).toISOString(), sessionId: 'session_demo_015'
    },
    {
      id: 'fb_demo_020', type: 'survey', feature: 'general', response: { g_first_impression: 4, g_pain_points: ['Navigation confusion', 'Unclear terminology'], g_most_valuable: 'Vendor Management', g_adoption: 'Probably will', g_final_thoughts: 'Overall a solid platform, needs some UX improvements' },
      sentiment: 'neutral', surveyType: 'general', completionTime: 180000, completionRate: 100,
      timestamp: new Date(now.getTime() - 0.1 * 86400000).toISOString(), sessionId: 'session_demo_014'
    },
    {
      id: 'fb_demo_021', type: 'stars', feature: 'supplier-search', response: 4,
      sentiment: 'positive', comments: 'AI search is impressive, found exactly what I needed',
      timestamp: new Date(now.getTime() - 0.05 * 86400000).toISOString(), sessionId: 'session_demo_016'
    },
    {
      id: 'fb_demo_022', type: 'scale', feature: 'vendor-management', response: 3,
      sentiment: 'neutral', timestamp: new Date(now.getTime() - 0.02 * 86400000).toISOString(), sessionId: 'session_demo_015'
    },
    {
      id: 'fb_demo_023', type: 'thumbs', feature: 'shipment-tracking', response: 'up',
      sentiment: 'positive', comments: 'Real-time tracking is very useful',
      timestamp: new Date(now.getTime() - 0.01 * 86400000).toISOString(), sessionId: 'session_demo_016'
    },
    {
      id: 'fb_demo_024', type: 'stars', feature: 'market-insights', response: 5,
      sentiment: 'positive', comments: 'Market data helps with pricing decisions',
      timestamp: new Date(now.getTime() - 0.005 * 86400000).toISOString(), sessionId: 'session_demo_017'
    },
    {
      id: 'fb_demo_025', type: 'emoji', feature: 'general', response: 'happy',
      sentiment: 'positive', timestamp: new Date().toISOString(), sessionId: 'session_demo_017'
    }
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(demoEntries));
  return demoEntries;
}

export function initializeFeedback(): FeedbackEntry[] {
  const existing = getFeedbackList();
  if (existing.length === 0) {
    return generateDemoFeedback();
  }
  return existing;
}
