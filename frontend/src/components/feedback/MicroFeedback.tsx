'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Star, Smile, Meh, Frown } from 'lucide-react';
import { submitFeedback, getSentiment, getSessionId, type FeedbackType } from '@/lib/feedback';

interface MicroFeedbackProps {
  type: 'thumbs' | 'stars' | 'emoji' | 'scale';
  feature: string;
  question?: string;
  onSubmit?: (response: unknown) => void;
}

export default function MicroFeedback({ type, feature, question, onSubmit }: MicroFeedbackProps) {
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected] = useState<unknown>(null);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = (response: unknown) => {
    if (submitted) return;
    setSelected(response);

    const sentiment = getSentiment(type as FeedbackType, response);
    submitFeedback({
      type: type as FeedbackType,
      feature,
      response: response as string | number,
      sentiment,
      sessionId: getSessionId()
    });

    setSubmitted(true);
    onSubmit?.(response);

    // Reset after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setSelected(null);
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="micro-feedback">
        <span className="thank-you">Thank you for your feedback!</span>
        <style jsx>{`
          .micro-feedback {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: #f0fdf4;
            border-radius: 20px;
            border: 1px solid #bbf7d0;
          }
          .thank-you {
            color: #16a34a;
            font-size: 13px;
            font-weight: 500;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="micro-feedback">
      {question && <span className="question">{question}</span>}

      {type === 'thumbs' && (
        <div className="options">
          <button
            className={`thumb-btn ${selected === 'up' ? 'selected positive' : ''}`}
            onClick={() => handleSubmit('up')}
            title="Yes"
          >
            <ThumbsUp size={16} />
          </button>
          <button
            className={`thumb-btn ${selected === 'down' ? 'selected negative' : ''}`}
            onClick={() => handleSubmit('down')}
            title="No"
          >
            <ThumbsDown size={16} />
          </button>
        </div>
      )}

      {type === 'stars' && (
        <div className="options stars-row">
          {[1, 2, 3, 4, 5].map(i => (
            <button
              key={i}
              className={`star-btn ${i <= (hoveredStar || (selected as number) || 0) ? 'filled' : ''}`}
              onClick={() => handleSubmit(i)}
              onMouseEnter={() => setHoveredStar(i)}
              onMouseLeave={() => setHoveredStar(0)}
              title={`${i} star${i > 1 ? 's' : ''}`}
            >
              <Star size={18} fill={i <= (hoveredStar || (selected as number) || 0) ? '#f59e0b' : 'none'} />
            </button>
          ))}
        </div>
      )}

      {type === 'emoji' && (
        <div className="options">
          <button
            className={`emoji-btn ${selected === 'happy' ? 'selected positive' : ''}`}
            onClick={() => handleSubmit('happy')}
            title="Happy"
          >
            <Smile size={20} />
          </button>
          <button
            className={`emoji-btn ${selected === 'neutral' ? 'selected neutral-sel' : ''}`}
            onClick={() => handleSubmit('neutral')}
            title="Neutral"
          >
            <Meh size={20} />
          </button>
          <button
            className={`emoji-btn ${selected === 'sad' ? 'selected negative' : ''}`}
            onClick={() => handleSubmit('sad')}
            title="Sad"
          >
            <Frown size={20} />
          </button>
        </div>
      )}

      {type === 'scale' && (
        <div className="options scale-row">
          {[1, 2, 3, 4, 5].map(i => (
            <button
              key={i}
              className={`scale-btn ${selected === i ? 'selected' : ''}`}
              onClick={() => handleSubmit(i)}
            >
              {i}
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        .micro-feedback {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 14px;
          background: #f8f9fa;
          border-radius: 20px;
          border: 1px solid #e5e7eb;
        }
        .question {
          color: #6b7280;
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
        }
        .options {
          display: flex;
          gap: 6px;
          align-items: center;
        }
        .stars-row {
          gap: 2px;
        }
        .scale-row {
          gap: 4px;
        }

        /* Thumb buttons */
        .thumb-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s ease;
        }
        .thumb-btn:hover {
          border-color: #f97316;
          color: #f97316;
          transform: scale(1.1);
        }
        .thumb-btn.selected.positive {
          background: #10b981;
          color: white;
          border-color: #10b981;
        }
        .thumb-btn.selected.negative {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
        }

        /* Star buttons */
        .star-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          cursor: pointer;
          color: #d1d5db;
          padding: 2px;
          transition: all 0.15s ease;
        }
        .star-btn:hover {
          transform: scale(1.15);
        }
        .star-btn.filled {
          color: #f59e0b;
        }

        /* Emoji buttons */
        .emoji-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s ease;
        }
        .emoji-btn:hover {
          transform: scale(1.1);
        }
        .emoji-btn.selected.positive {
          background: #10b981;
          color: white;
          border-color: #10b981;
        }
        .emoji-btn.selected.neutral-sel {
          background: #f59e0b;
          color: white;
          border-color: #f59e0b;
        }
        .emoji-btn.selected.negative {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
        }

        /* Scale buttons */
        .scale-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          transition: all 0.2s ease;
        }
        .scale-btn:hover {
          border-color: #f97316;
          color: #f97316;
          transform: scale(1.1);
        }
        .scale-btn.selected {
          background: #f97316;
          color: white;
          border-color: #f97316;
        }
      `}</style>
    </div>
  );
}
