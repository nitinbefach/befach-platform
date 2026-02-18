import { safeStorage, safeSessionStorage } from './safeStorage';

// Context-aware nudge messages per page
const PAGE_NUDGES: Record<string, string> = {
  '/dashboard': 'Need help navigating? Ask Befach AI!',
  '/cost-calculator': 'Confused about duties? I can explain!',
  '/smart-sourcing': 'I can help you evaluate suppliers',
  '/our-vendors': 'Ask me about vendor verification tips',
  '/track-shipment': 'I can explain shipment statuses',
  '/book-shipment': 'FCL or LCL? Let me help you decide',
  '/documents': 'Need help with import documents?',
  '/exim-data': 'I can help you read trade data',
  '/my-orders': 'Questions about your orders? Ask me!',
  '/shipping-calculator': 'Need help estimating shipping costs?',
  '/compliance-tools': 'I can guide you through compliance',
  '/reports': 'Want me to explain these reports?',
};

const STORAGE_PREFIX = 'befach_nudge_';
const SESSION_KEY = 'befach_nudge_session';

interface NudgeSession {
  shown: number;
  dismissed: number;
}

function getSession(): NudgeSession {
  const raw = safeSessionStorage.getItem(SESSION_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch { /* ignore */ }
  }
  return { shown: 0, dismissed: 0 };
}

function setSession(session: NudgeSession): void {
  safeSessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

// Check if a nudge was shown on this page within the last 24h
function wasRecentlyShown(pathname: string): boolean {
  const key = `${STORAGE_PREFIX}${pathname}`;
  const raw = safeStorage.getItem(key);
  if (!raw) return false;
  const ts = parseInt(raw, 10);
  return Date.now() - ts < 24 * 60 * 60 * 1000;
}

function markShown(pathname: string): void {
  const key = `${STORAGE_PREFIX}${pathname}`;
  safeStorage.setItem(key, String(Date.now()));
  const session = getSession();
  session.shown += 1;
  setSession(session);
}

function markDismissed(): void {
  const session = getSession();
  session.dismissed += 1;
  setSession(session);
}

// Determine whether to show a nudge for the current page
export function shouldShowNudge(pathname: string, isPanelOpen: boolean): boolean {
  // Never show on the AI assistant page itself
  if (pathname === '/ai-assistant') return false;

  // Don't show if the chat panel is already open
  if (isPanelOpen) return false;

  // No nudge message for this page
  if (!PAGE_NUDGES[pathname]) return false;

  const session = getSession();

  // Max 2 nudges per session
  if (session.shown >= 2) return false;

  // If user dismissed 3+ nudges this session, stop
  if (session.dismissed >= 3) return false;

  // Per-page 24h cooldown
  if (wasRecentlyShown(pathname)) return false;

  return true;
}

export function getNudgeMessage(pathname: string): string {
  return PAGE_NUDGES[pathname] || 'Need help? Ask Befach AI!';
}

export function onNudgeShown(pathname: string): void {
  markShown(pathname);
}

export function onNudgeDismissed(): void {
  markDismissed();
}

export const NUDGE_DELAY_MS = 10000; // 10s after page load
export const NUDGE_AUTO_DISMISS_MS = 8000; // auto-dismiss after 8s
