'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  TRIGGER_CONFIG,
  shouldTrigger,
  incrementVisitCount,
  recordPromptShown,
  recordPromptDismissed,
  recordPromptCompleted,
  shouldShowNPS,
  incrementSessionCount,
  recordNPSComplete,
} from '@/lib/feedbackTriggers';
import FeedbackPrompt from '@/components/feedback/FeedbackPrompt';
import NPSSurvey from '@/components/feedback/NPSSurvey';

interface PromptState {
  feature: string;
  question: string;
  feedbackType: 'thumbs' | 'stars' | 'emoji';
}

export function useFeedbackTrigger() {
  const [activePrompt, setActivePrompt] = useState<PromptState | null>(null);
  const [showNPS, setShowNPS] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  /** Action-based trigger: call after user completes an action */
  const triggerFeedback = useCallback((feature: string) => {
    const config = TRIGGER_CONFIG[feature];
    if (!config) return;

    // Increment visit count for this feature
    incrementVisitCount(feature);

    if (!shouldTrigger(feature)) return;

    const delay = config.delay || 0;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      recordPromptShown(feature);
      setActivePrompt({
        feature,
        question: config.question,
        feedbackType: config.feedbackType,
      });
    }, delay);
  }, []);

  /** Time-based trigger: call on mount, shows after delayMs */
  const triggerTimeBasedFeedback = useCallback((feature: string, delayMs: number) => {
    const config = TRIGGER_CONFIG[feature];
    if (!config) return;

    // Increment visit count
    incrementVisitCount(feature);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      if (!shouldTrigger(feature)) return;

      recordPromptShown(feature);
      setActivePrompt({
        feature,
        question: config.question,
        feedbackType: config.feedbackType,
      });
    }, delayMs);

    // Cleanup on unmount (page navigation)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  /** NPS milestone trigger: call on dashboard mount */
  const triggerNPSCheck = useCallback(() => {
    incrementSessionCount();

    setTimeout(() => {
      if (!mountedRef.current) return;
      if (shouldShowNPS()) {
        setShowNPS(true);
      }
    }, 2000);
  }, []);

  const handleComplete = useCallback(() => {
    if (activePrompt) {
      recordPromptCompleted(activePrompt.feature);
    }
    setActivePrompt(null);
  }, [activePrompt]);

  const handleDismiss = useCallback(() => {
    recordPromptDismissed();
    setActivePrompt(null);
  }, []);

  const handleNPSComplete = useCallback(() => {
    recordNPSComplete();
    setShowNPS(false);
  }, []);

  // Build prompt element
  let promptElement = null;
  if (activePrompt) {
    promptElement = (
      <FeedbackPrompt
        feature={activePrompt.feature}
        question={activePrompt.question}
        feedbackType={activePrompt.feedbackType}
        onComplete={handleComplete}
        onDismiss={handleDismiss}
      />
    );
  }

  // Build NPS element
  let npsElement = null;
  if (showNPS) {
    npsElement = (
      <NPSSurvey
        isOpen={showNPS}
        onClose={() => setShowNPS(false)}
        onComplete={handleNPSComplete}
      />
    );
  }

  return {
    triggerFeedback,
    triggerTimeBasedFeedback,
    triggerNPSCheck,
    promptElement,
    npsElement,
  };
}
