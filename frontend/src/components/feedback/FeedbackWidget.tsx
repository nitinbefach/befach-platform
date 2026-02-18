'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Bug, Lightbulb, Star, X, Send, Check } from 'lucide-react';
import { useMobile } from '@/hooks/useMobile';
import { submitFeedback, getSentiment, getSessionId, FEEDBACK_FEATURES } from '@/lib/feedback';

export default function FeedbackWidget() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'feedback' | 'bug' | 'feature' | 'rate' | null>(null);
  const [selectedFeature, setSelectedFeature] = useState('general');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useMobile();

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isMenuOpen]);

  const openModal = (type: typeof activeModal) => {
    setIsMenuOpen(false);
    setActiveModal(type);
    setRating(0);
    setComment('');
    setSelectedFeature('general');
    setSubmitted(false);
  };

  const closeModal = () => {
    setActiveModal(null);
    setRating(0);
    setComment('');
    setSubmitted(false);
  };

  const handleSubmitFeedback = () => {
    const type = activeModal === 'rate' ? 'stars' : 'thumbs';
    const response = activeModal === 'rate' ? rating : 'up';

    submitFeedback({
      type: type,
      feature: selectedFeature,
      response,
      sentiment: getSentiment(type, response),
      comments: comment || undefined,
      metadata: { feedbackCategory: activeModal },
      sessionId: getSessionId()
    });

    setSubmitted(true);
    setTimeout(() => {
      closeModal();
    }, 2000);
  };

  const modalTitle = {
    feedback: 'Give Feedback',
    bug: 'Report a Bug',
    feature: 'Suggest a Feature',
    rate: 'Rate Befach'
  };

  const modalSubtitle = {
    feedback: 'Help us improve Befach',
    bug: 'Help us fix issues quickly',
    feature: 'What would make Befach better?',
    rate: 'How do you like Befach?'
  };

  return (
    <>
      {/* Floating Button + Menu */}
      <div className="widget-container" ref={menuRef}>
        {/* Menu */}
        {isMenuOpen && (
          <div className="widget-menu">
            <button className="menu-item" onClick={() => openModal('feedback')}>
              <MessageSquare size={18} />
              <span>Give Feedback</span>
            </button>
            <button className="menu-item" onClick={() => openModal('bug')}>
              <Bug size={18} />
              <span>Report Bug</span>
            </button>
            <button className="menu-item" onClick={() => openModal('feature')}>
              <Lightbulb size={18} />
              <span>Suggest Feature</span>
            </button>
            <button className="menu-item" onClick={() => openModal('rate')}>
              <Star size={18} />
              <span>Rate Befach</span>
            </button>
          </div>
        )}

        {/* Floating Button */}
        <button
          className={`widget-btn ${isMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          title="Give us feedback"
        >
          {isMenuOpen ? <X size={22} /> : <MessageSquare size={22} />}
        </button>
      </div>

      {/* Modal Overlay */}
      {activeModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="feedback-modal">
            {submitted ? (
              <div className="success-state">
                <div className="success-icon"><Check size={20} /></div>
                <h3>Thank you!</h3>
                <p>Your feedback has been submitted successfully.</p>
              </div>
            ) : (
              <>
                <div className="modal-header">
                  <div>
                    <h3>{modalTitle[activeModal]}</h3>
                    <p>{modalSubtitle[activeModal]}</p>
                  </div>
                  <button className="close-btn" onClick={closeModal}>
                    <X size={18} />
                  </button>
                </div>

                <div className="modal-body">
                  {/* Feature selector */}
                  <div className="form-group">
                    <label>Feature</label>
                    <select
                      value={selectedFeature}
                      onChange={(e) => setSelectedFeature(e.target.value)}
                    >
                      {Object.entries(FEEDBACK_FEATURES).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Star rating for 'rate' type */}
                  {activeModal === 'rate' && (
                    <div className="form-group">
                      <label>Rating</label>
                      <div className="star-row">
                        {[1, 2, 3, 4, 5].map(i => (
                          <button
                            key={i}
                            className={`star-btn ${i <= (hoveredRating || rating) ? 'filled' : ''}`}
                            onClick={() => setRating(i)}
                            onMouseEnter={() => setHoveredRating(i)}
                            onMouseLeave={() => setHoveredRating(0)}
                          >
                            <Star size={28} fill={i <= (hoveredRating || rating) ? '#f59e0b' : 'none'} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Comment */}
                  <div className="form-group">
                    <label>
                      {activeModal === 'bug' ? 'Describe the issue' :
                       activeModal === 'feature' ? 'Describe your idea' :
                       'Comments (optional)'}
                    </label>
                    <textarea
                      placeholder={
                        activeModal === 'bug' ? 'What went wrong? Steps to reproduce...' :
                        activeModal === 'feature' ? 'What feature would you like to see?' :
                        'Tell us what you think...'
                      }
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button className="cancel-btn" onClick={closeModal}>Cancel</button>
                  <button
                    className="submit-btn"
                    onClick={handleSubmitFeedback}
                    disabled={activeModal === 'rate' && rating === 0}
                  >
                    <Send size={14} />
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        /* Widget Container */
        .widget-container {
          position: fixed;
          bottom: ${isMobile ? 'calc(155px + env(safe-area-inset-bottom, 0px))' : '24px'};
          right: ${isMobile ? '16px' : '24px'};
          z-index: 900;
        }

        /* Floating Button */
        .widget-btn {
          width: ${isMobile ? '46px' : '52px'};
          height: ${isMobile ? '46px' : '52px'};
          border-radius: 50%;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(249, 115, 22, 0.4);
          transition: all 0.3s ease;
          animation: ${!isMenuOpen ? 'pulse 3s infinite' : 'none'};
        }
        .widget-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 24px rgba(249, 115, 22, 0.5);
        }
        .widget-btn.open {
          background: #374151;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        }

        @keyframes pulse {
          0%, 100% { box-shadow: 0 4px 16px rgba(249, 115, 22, 0.4); }
          50% { box-shadow: 0 4px 24px rgba(249, 115, 22, 0.6); }
        }

        /* Menu */
        .widget-menu {
          position: absolute;
          bottom: 62px;
          right: 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          padding: 6px;
          min-width: 200px;
          animation: slideUp 0.2s ease;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 14px;
          border: none;
          background: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          color: #374151;
          transition: background 0.15s;
        }
        .menu-item:hover {
          background: #f3f4f6;
        }

        /* Modal Overlay */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 16px;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .feedback-modal {
          background: white;
          border-radius: 16px;
          max-width: 440px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          animation: slideUp 0.25s ease;
          overflow: hidden;
        }

        /* Success state */
        .success-state {
          padding: 48px 24px;
          text-align: center;
        }
        .success-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #10b981;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          margin: 0 auto 16px;
        }
        .success-state h3 {
          font-size: 20px;
          color: #1f2937;
          margin-bottom: 6px;
        }
        .success-state p {
          font-size: 14px;
          color: #6b7280;
        }

        /* Modal header */
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 20px 24px;
          border-bottom: 1px solid #f3f4f6;
        }
        .modal-header h3 {
          font-size: 18px;
          color: #1f2937;
          margin-bottom: 2px;
        }
        .modal-header p {
          font-size: 13px;
          color: #9ca3af;
        }
        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          padding: 4px;
          border-radius: 6px;
        }
        .close-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }

        /* Modal body */
        .modal-body {
          padding: 20px 24px;
        }
        .form-group {
          margin-bottom: 16px;
        }
        .form-group label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
        }
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
        }
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }
        .form-group textarea {
          resize: vertical;
        }

        /* Star row */
        .star-row {
          display: flex;
          gap: 4px;
        }
        .star-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #d1d5db;
          padding: 2px;
          transition: transform 0.15s;
        }
        .star-btn:hover {
          transform: scale(1.15);
        }
        .star-btn.filled {
          color: #f59e0b;
        }

        /* Modal footer */
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 16px 24px;
          border-top: 1px solid #f3f4f6;
        }
        .cancel-btn {
          padding: 8px 16px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          color: #6b7280;
        }
        .cancel-btn:hover {
          background: #f3f4f6;
        }
        .submit-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          border: none;
          background: #f97316;
          color: white;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          transition: background 0.2s;
        }
        .submit-btn:hover:not(:disabled) {
          background: #ea580c;
        }
        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
}
