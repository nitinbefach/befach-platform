import { safeStorage, safeSessionStorage } from '@/lib/safeStorage';
// Contextual Feedback Trigger System
// Manages when/where to show feedback prompts with anti-annoyance rules

// ============================================================================
// TYPES
// ============================================================================

export interface TriggerConfig {
  question: string;
  feedbackType: 'thumbs' | 'stars' | 'emoji';
  delay: number; // ms to wait before showing prompt after trigger fires
  cooldownHours: number;
  minVisits: number; // minimum page visits before prompting (skip first visit)
}

interface TriggerRecord {
  lastPrompted: string; // ISO timestamp
  visitCount: number;
}

interface SessionState {
  promptCount: number;
  dismissCount: number;
}

// ============================================================================
// TRIGGER DEFINITIONS — one entry per feature
// ============================================================================

export const TRIGGER_CONFIG: Record<string, TriggerConfig> = {
  'cost-calculator': {
    question: 'How was the Cost Calculator?',
    feedbackType: 'stars',
    delay: 1500,
    cooldownHours: 24,
    minVisits: 1,
  },
  'invite-supplier': {
    question: 'How was the invitation process?',
    feedbackType: 'thumbs',
    delay: 1000,
    cooldownHours: 24,
    minVisits: 1,
  },
  'vendor-management': {
    question: "How's vendor management working for you?",
    feedbackType: 'stars',
    delay: 1500,
    cooldownHours: 24,
    minVisits: 1,
  },
  'supplier-search': {
    question: 'Did you find what you needed?',
    feedbackType: 'thumbs',
    delay: 1000,
    cooldownHours: 24,
    minVisits: 1,
  },
  'shipment-tracking': {
    question: 'Is shipment tracking helpful?',
    feedbackType: 'thumbs',
    delay: 2000,
    cooldownHours: 24,
    minVisits: 1,
  },
  'market-insights': {
    question: 'Are these insights useful?',
    feedbackType: 'emoji',
    delay: 0,
    cooldownHours: 24,
    minVisits: 1,
  },
  'cost-calculator-history': {
    question: 'Is calculation history useful?',
    feedbackType: 'thumbs',
    delay: 0,
    cooldownHours: 48,
    minVisits: 2,
  },
  'submit-requirement': {
    question: 'How was submitting your requirement?',
    feedbackType: 'stars',
    delay: 1500,
    cooldownHours: 24,
    minVisits: 1,
  },
  'settings': {
    question: 'Finding everything you need in Settings?',
    feedbackType: 'thumbs',
    delay: 1000,
    cooldownHours: 72,
    minVisits: 2,
  },
  'document-management': {
    question: "How's document management?",
    feedbackType: 'thumbs',
    delay: 2000,
    cooldownHours: 48,
    minVisits: 1,
  },
  'ai-assistant': {
    question: 'Is the AI Assistant helpful?',
    feedbackType: 'emoji',
    delay: 0,
    cooldownHours: 24,
    minVisits: 1,
  },
  'shipping-calculator': {
    question: 'Was the shipping estimate helpful?',
    feedbackType: 'thumbs',
    delay: 1500,
    cooldownHours: 24,
    minVisits: 1,
  },
  'contact': {
    question: 'Was it easy to reach us?',
    feedbackType: 'thumbs',
    delay: 1000,
    cooldownHours: 72,
    minVisits: 1,
  },
};

// ============================================================================
// CONSTANTS
// ============================================================================

const TRIGGERS_STORAGE_KEY = 'befach_feedback_triggers';
const SESSION_STORAGE_KEY = 'befach_feedback_session';
const NPS_STORAGE_KEY = 'befach_nps_tracking';

const MAX_PROMPTS_PER_SESSION = 2;
const MAX_DISMISSALS_BEFORE_FATIGUE = 3;
const NPS_SESSION_THRESHOLD = 5; // show NPS after 5th session
const NPS_COOLDOWN_DAYS = 30;

// ============================================================================
// PERSISTENT TRACKING (localStorage)
// ============================================================================

function getTriggerRecords(): Record<string, TriggerRecord> {
  if (typeof window === 'undefined') return {};
  const data = safeStorage.getItem(TRIGGERS_STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

function saveTriggerRecords(records: Record<string, TriggerRecord>) {
  safeStorage.setItem(TRIGGERS_STORAGE_KEY, JSON.stringify(records));
}

// ============================================================================
// SESSION TRACKING (sessionStorage — resets on tab close)
// ============================================================================

function getSessionState(): SessionState {
  if (typeof window === 'undefined') return { promptCount: 0, dismissCount: 0 };
  const data = safeSessionStorage.getItem(SESSION_STORAGE_KEY);
  return data ? JSON.parse(data) : { promptCount: 0, dismissCount: 0 };
}

function saveSessionState(state: SessionState) {
  safeSessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
}

// ============================================================================
// PUBLIC API
// ============================================================================

/** Check if a prompt has been shown for this feature within its cooldown period */
export function hasBeenPrompted(feature: string): boolean {
  const records = getTriggerRecords();
  const record = records[feature];
  if (!record?.lastPrompted) return false;

  const config = TRIGGER_CONFIG[feature];
  if (!config) return false;

  const hoursSince = (Date.now() - new Date(record.lastPrompted).getTime()) / (1000 * 60 * 60);
  return hoursSince < config.cooldownHours;
}

/** Record that a prompt was shown for a feature */
export function recordPromptShown(feature: string) {
  const records = getTriggerRecords();
  records[feature] = {
    ...records[feature],
    lastPrompted: new Date().toISOString(),
    visitCount: records[feature]?.visitCount || 0,
  };
  saveTriggerRecords(records);

  // Increment session count
  const session = getSessionState();
  session.promptCount++;
  saveSessionState(session);
}

/** Record that user dismissed a prompt (didn't submit feedback) */
export function recordPromptDismissed() {
  const session = getSessionState();
  session.dismissCount++;
  saveSessionState(session);
}

/** Record that user completed feedback (reset fatigue) */
export function recordPromptCompleted(feature: string) {
  // Reset dismiss counter on completion
  const session = getSessionState();
  session.dismissCount = 0;
  saveSessionState(session);

  // Update the prompt record
  recordPromptShown(feature);
}

/** Check all anti-annoyance rules to see if we can show a prompt */
export function canShowPrompt(): boolean {
  if (typeof window === 'undefined') return false;

  const session = getSessionState();

  // Rule: max prompts per session
  if (session.promptCount >= MAX_PROMPTS_PER_SESSION) return false;

  // Rule: fatigue detection
  if (session.dismissCount >= MAX_DISMISSALS_BEFORE_FATIGUE) return false;

  return true;
}

/** Get visit count for a feature */
export function getVisitCount(feature: string): number {
  const records = getTriggerRecords();
  return records[feature]?.visitCount || 0;
}

/** Increment visit count for a feature (call on page mount) */
export function incrementVisitCount(feature: string) {
  const records = getTriggerRecords();
  records[feature] = {
    lastPrompted: records[feature]?.lastPrompted || '',
    visitCount: (records[feature]?.visitCount || 0) + 1,
  };
  saveTriggerRecords(records);
}

/** Check if the full trigger conditions are met for a feature */
export function shouldTrigger(feature: string): boolean {
  if (!canShowPrompt()) return false;

  const config = TRIGGER_CONFIG[feature];
  if (!config) return false;

  // Check cooldown
  if (hasBeenPrompted(feature)) return false;

  // Check minimum visits
  const visits = getVisitCount(feature);
  if (visits < config.minVisits) return false;

  return true;
}

// ============================================================================
// NPS MILESTONE TRACKING
// ============================================================================

interface NPSTracking {
  sessionCount: number;
  lastNPSDate: string | null;
}

function getNPSTracking(): NPSTracking {
  if (typeof window === 'undefined') return { sessionCount: 0, lastNPSDate: null };
  const data = safeStorage.getItem(NPS_STORAGE_KEY);
  return data ? JSON.parse(data) : { sessionCount: 0, lastNPSDate: null };
}

/** Increment session count (call once per app load) */
export function incrementSessionCount() {
  if (typeof window === 'undefined') return;
  const tracking = getNPSTracking();
  tracking.sessionCount++;
  safeStorage.setItem(NPS_STORAGE_KEY, JSON.stringify(tracking));
}

/** Record NPS completion */
export function recordNPSComplete() {
  const tracking = getNPSTracking();
  tracking.lastNPSDate = new Date().toISOString();
  safeStorage.setItem(NPS_STORAGE_KEY, JSON.stringify(tracking));
}

/** Check if NPS should be shown (milestone + cooldown) */
export function shouldShowNPS(): boolean {
  if (!canShowPrompt()) return false;

  const tracking = getNPSTracking();

  // Must have at least N sessions
  if (tracking.sessionCount < NPS_SESSION_THRESHOLD) return false;

  // Check NPS cooldown (30 days)
  if (tracking.lastNPSDate) {
    const daysSince = (Date.now() - new Date(tracking.lastNPSDate).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince < NPS_COOLDOWN_DAYS) return false;
  }

  return true;
}
