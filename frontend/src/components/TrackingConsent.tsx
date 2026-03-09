'use client';

import { useState, useEffect } from 'react';
import { Shield, X } from 'lucide-react';
import posthog from 'posthog-js';
import { safeStorage } from '@/lib/safeStorage';
import { useMobile } from '@/hooks/useMobile';

const STORAGE_KEY = 'befach-tracking-consent';
const DISMISS_DAYS = 7;

function isRecentlyDismissed(): boolean {
  try {
    const stored = safeStorage.getItem(STORAGE_KEY);
    if (!stored) return false;
    const { timestamp } = JSON.parse(stored);
    const daysSince = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
    return daysSince < DISMISS_DAYS;
  } catch {
    return false;
  }
}

function isPostHogLoaded(): boolean {
  try {
    return !!(posthog as any).__loaded;
  } catch {
    return false;
  }
}

export default function TrackingConsent() {
  const [visible, setVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const { isMobile } = useMobile();

  useEffect(() => {
    // Only check in production
    if (process.env.NODE_ENV !== 'production') return;

    // Wait for PostHog to have time to initialize
    const timer = setTimeout(() => {
      if (isPostHogLoaded()) return; // PostHog working fine, no need for popup
      if (isRecentlyDismissed()) return; // User already dismissed recently

      setVisible(true);
      // Trigger slide-in animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimateIn(true));
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setAnimateIn(false);
    setTimeout(() => setVisible(false), 300);
    safeStorage.setItem(STORAGE_KEY, JSON.stringify({
      dismissed: true,
      timestamp: Date.now(),
    }));
  };

  const handleAllowed = () => {
    // Recheck if PostHog is now loaded after user whitelisted
    if (isPostHogLoaded()) {
      safeStorage.setItem(STORAGE_KEY, JSON.stringify({
        dismissed: true,
        allowed: true,
        timestamp: Date.now(),
      }));
      setAnimateIn(false);
      setTimeout(() => setVisible(false), 300);
    } else {
      // Still blocked — reload the page so PostHog can init fresh
      safeStorage.setItem(STORAGE_KEY, JSON.stringify({
        dismissed: true,
        allowed: true,
        timestamp: Date.now(),
      }));
      window.location.reload();
    }
  };

  if (!visible) return null;

  return (
    <>
      <div className={`tracking-consent ${animateIn ? 'tracking-consent--visible' : ''}`}>
        <button className="tracking-consent__close" onClick={dismiss} aria-label="Dismiss">
          <X size={16} />
        </button>

        <div className="tracking-consent__icon">
          <Shield size={isMobile ? 20 : 22} />
        </div>

        <div className="tracking-consent__content">
          <h3 className="tracking-consent__title">Help us improve Befach for you</h3>
          <p className="tracking-consent__text">
            We collect anonymous feedback and usage insights to make this platform better.
            It looks like your browser is blocking this.
          </p>
          <p className="tracking-consent__steps">
            To allow it, click the <strong>shield icon</strong> in your address bar and
            disable tracking protection for this site.
          </p>
        </div>

        <div className="tracking-consent__actions">
          <button className="tracking-consent__btn-primary" onClick={handleAllowed}>
            I've Allowed It
          </button>
          <button className="tracking-consent__btn-secondary" onClick={dismiss}>
            Maybe Later
          </button>
        </div>
      </div>

      <style jsx>{`
        .tracking-consent {
          position: fixed;
          bottom: ${isMobile ? '0' : '24px'};
          left: ${isMobile ? '0' : '50%'};
          transform: ${isMobile ? 'translateY(100%)' : 'translateX(-50%) translateY(100%)'};
          width: ${isMobile ? '100%' : 'auto'};
          max-width: ${isMobile ? '100%' : '480px'};
          background: #ffffff;
          border-radius: ${isMobile ? '20px 20px 0 0' : '16px'};
          box-shadow: 0 -4px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04);
          padding: ${isMobile ? '24px 20px 32px' : '24px 28px'};
          z-index: 1000;
          opacity: 0;
          transition: transform 0.3s ease, opacity 0.3s ease;
        }

        .tracking-consent--visible {
          transform: ${isMobile ? 'translateY(0)' : 'translateX(-50%) translateY(0)'};
          opacity: 1;
        }

        .tracking-consent__close {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: none;
          background: #f1f5f9;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }

        .tracking-consent__close:hover {
          background: #e2e8f0;
          color: #334155;
        }

        .tracking-consent__icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #fff7ed;
          color: #f97316;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }

        .tracking-consent__content {
          margin-bottom: 18px;
        }

        .tracking-consent__title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 6px;
          line-height: 1.3;
        }

        .tracking-consent__text {
          font-size: 14px;
          color: #64748b;
          line-height: 1.5;
          margin-bottom: 8px;
        }

        .tracking-consent__steps {
          font-size: 13px;
          color: #475569;
          line-height: 1.5;
          background: #f8fafc;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .tracking-consent__actions {
          display: flex;
          gap: 10px;
        }

        .tracking-consent__btn-primary {
          flex: 1;
          padding: 10px 20px;
          border-radius: 10px;
          border: none;
          background: #f97316;
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
        }

        .tracking-consent__btn-primary:hover {
          background: #ea580c;
        }

        .tracking-consent__btn-secondary {
          flex: 1;
          padding: 10px 20px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #64748b;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
        }

        .tracking-consent__btn-secondary:hover {
          background: #f8fafc;
          color: #334155;
        }
      `}</style>
    </>
  );
}
