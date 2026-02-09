'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMobile } from '@/hooks/useMobile';
import MicroFeedback from './MicroFeedback';

interface FeedbackPromptProps {
  feature: string;
  question: string;
  feedbackType: 'thumbs' | 'stars' | 'emoji';
  onComplete: () => void;
  onDismiss: () => void;
}

export default function FeedbackPrompt({
  feature,
  question,
  feedbackType,
  onComplete,
  onDismiss,
}: FeedbackPromptProps) {
  const [visible, setVisible] = useState(true);
  const [completed, setCompleted] = useState(false);
  const { isMobile } = useMobile();

  // Auto-dismiss timer
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!completed) {
        setVisible(false);
        setTimeout(onDismiss, 300);
      }
    }, isMobile ? 12000 : 15000);

    return () => clearTimeout(timeout);
  }, [isMobile, completed, onDismiss]);

  const handleFeedbackSubmit = () => {
    setCompleted(true);
    setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 300);
    }, 1500);
  };

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onDismiss, 300);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`feedback-prompt ${isMobile ? 'mobile' : 'desktop'}`}
          initial={isMobile ? { y: 100, opacity: 0 } : { x: 100, opacity: 0 }}
          animate={isMobile ? { y: 0, opacity: 1 } : { x: 0, opacity: 1 }}
          exit={isMobile ? { y: 100, opacity: 0 } : { x: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          drag={isMobile ? 'y' : false}
          dragConstraints={{ top: 0 }}
          dragElastic={0.3}
          onDragEnd={(_, info) => {
            if (info.offset.y > 80) handleDismiss();
          }}
        >
          {completed ? (
            <div className="prompt-thanks">
              <span className="thanks-check">✓</span>
              <span>Thanks for your feedback!</span>
            </div>
          ) : (
            <>
              <button className="prompt-close" onClick={handleDismiss}>
                <X size={14} />
              </button>

              {isMobile && <div className="drag-handle" />}

              <p className="prompt-question">{question}</p>

              <div className="prompt-feedback">
                <MicroFeedback
                  type={feedbackType}
                  feature={feature}
                  onSubmit={handleFeedbackSubmit}
                />
              </div>
            </>
          )}

          <style jsx>{`
            .feedback-prompt {
              position: fixed;
              z-index: 850;
              background: white;
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
              overflow: hidden;
            }

            /* Desktop: slide-in toast from right */
            .feedback-prompt.desktop {
              bottom: 90px;
              right: 24px;
              width: 320px;
              border-radius: 14px;
              padding: 18px 20px;
            }

            /* Mobile: bottom sheet style */
            .feedback-prompt.mobile {
              bottom: 80px;
              left: 12px;
              right: 12px;
              border-radius: 16px 16px 12px 12px;
              padding: 12px 18px 18px;
            }

            .drag-handle {
              width: 36px;
              height: 4px;
              background: #d1d5db;
              border-radius: 2px;
              margin: 0 auto 12px;
            }

            .prompt-close {
              position: absolute;
              top: 10px;
              right: 10px;
              background: none;
              border: none;
              color: #9ca3af;
              cursor: pointer;
              padding: 4px;
              border-radius: 4px;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.15s;
            }
            .prompt-close:hover {
              background: #f3f4f6;
              color: #6b7280;
            }

            .prompt-question {
              font-size: 14px;
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 12px;
              padding-right: 20px;
              line-height: 1.4;
            }

            .prompt-feedback {
              display: flex;
              justify-content: flex-start;
            }

            /* Thanks state */
            .prompt-thanks {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 4px 0;
              color: #059669;
              font-size: 14px;
              font-weight: 500;
            }
            .thanks-check {
              width: 24px;
              height: 24px;
              background: #10b981;
              color: white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 13px;
              flex-shrink: 0;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
