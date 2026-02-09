'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useMobile } from '@/hooks/useMobile';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { AIMessage, AIConversation } from '@/types/chat';
import {
  getAIResponse,
  getTypingDelay,
  getSuggestionsForPage,
  getActiveConversation,
  createConversation,
  addMessage,
  getRelativeTime,
} from '@/lib/aiChat';

// ============ TYPING INDICATOR ============

function TypingIndicator() {
  return (
    <div className="ai-typing">
      <div className="ai-typing-dots">
        <span className="ai-dot" />
        <span className="ai-dot" />
        <span className="ai-dot" />
      </div>
      <style jsx>{`
        .ai-typing {
          display: flex;
          align-items: flex-start;
          padding: 0 16px;
          margin-bottom: 12px;
        }
        .ai-typing-dots {
          display: flex;
          gap: 4px;
          padding: 10px 16px;
          background: var(--bg-secondary, #f1f5f9);
          border-radius: 16px 16px 16px 4px;
        }
        .ai-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #94a3b8;
          animation: ai-bounce 1.4s infinite ease-in-out;
        }
        .ai-dot:nth-child(1) { animation-delay: 0s; }
        .ai-dot:nth-child(2) { animation-delay: 0.2s; }
        .ai-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes ai-bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ============ MESSAGE BUBBLE ============

function MessageBubble({ message }: { message: AIMessage }) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="ai-system-msg">
        <span>{message.text}</span>
        <style jsx>{`
          .ai-system-msg {
            text-align: center;
            padding: 8px 16px;
            margin-bottom: 8px;
          }
          .ai-system-msg span {
            font-size: 0.72rem;
            color: var(--text-secondary);
            background: var(--bg-secondary, #f1f5f9);
            padding: 4px 12px;
            border-radius: 12px;
          }
        `}</style>
      </div>
    );
  }

  const time = new Date(message.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className={`ai-msg-row ${isUser ? 'user' : 'bot'}`}>
      {!isUser && (
        <div className="ai-avatar">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" strokeWidth="1.75">
            <path d="M12 2L9 9l-7 1 5 5-1 7 6-3 6 3-1-7 5-5-7-1z" />
          </svg>
        </div>
      )}
      <div className="ai-msg-content">
        <div className={`ai-bubble ${isUser ? 'user-bubble' : 'bot-bubble'}`}>
          <p>{message.text}</p>
          {message.links && message.links.length > 0 && (
            <div className="ai-msg-links">
              {message.links.map((link, i) => (
                <Link key={i} href={link.href} className="ai-msg-link">
                  {link.label} →
                </Link>
              ))}
            </div>
          )}
        </div>
        <span className="ai-msg-time">{time}</span>
      </div>

      <style jsx>{`
        .ai-msg-row {
          display: flex;
          gap: 8px;
          padding: 0 16px;
          margin-bottom: 12px;
          align-items: flex-end;
        }
        .ai-msg-row.user {
          justify-content: flex-end;
        }
        .ai-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ai-msg-content {
          max-width: 80%;
          display: flex;
          flex-direction: column;
        }
        .ai-bubble {
          padding: 10px 14px;
          border-radius: 16px;
          line-height: 1.45;
        }
        .ai-bubble p {
          margin: 0;
          font-size: 0.84rem;
        }
        .user-bubble {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-radius: 16px 16px 4px 16px;
        }
        .bot-bubble {
          background: var(--bg-secondary, #f1f5f9);
          color: var(--text-primary);
          border-radius: 16px 16px 16px 4px;
        }
        .ai-msg-links {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid rgba(255,255,255,0.15);
        }
        .bot-bubble .ai-msg-links {
          border-top-color: var(--border-color);
        }
        .ai-msg-time {
          font-size: 0.65rem;
          color: var(--text-secondary);
          margin-top: 3px;
          padding: 0 4px;
        }
        .ai-msg-row.user .ai-msg-time {
          text-align: right;
        }
      `}</style>
      <style jsx global>{`
        .ai-msg-link {
          font-size: 0.78rem;
          font-weight: 600;
          color: white;
          text-decoration: none;
          padding: 4px 10px;
          border-radius: 8px;
          background: rgba(255,255,255,0.15);
          transition: background 0.15s;
        }
        .ai-msg-link:hover {
          background: rgba(255,255,255,0.25);
        }
        .bot-bubble .ai-msg-link {
          color: #667eea;
          background: rgba(102, 126, 234, 0.1);
        }
        .bot-bubble .ai-msg-link:hover {
          background: rgba(102, 126, 234, 0.2);
        }
      `}</style>
    </div>
  );
}

// ============ SUGGESTION CHIPS ============

function SuggestionChips({ onSelect }: { onSelect: (query: string) => void }) {
  const pathname = usePathname();
  const suggestions = getSuggestionsForPage(pathname);

  return (
    <div className="ai-suggestions">
      {suggestions.map((s, i) => (
        <button key={i} className="ai-suggestion-chip" onClick={() => onSelect(s.query)}>
          {s.label}
        </button>
      ))}

      <style jsx>{`
        .ai-suggestions {
          display: flex;
          gap: 6px;
          padding: 8px 16px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          flex-shrink: 0;
        }
        .ai-suggestions::-webkit-scrollbar { display: none; }
        .ai-suggestion-chip {
          padding: 6px 14px;
          border-radius: 16px;
          border: 1.5px solid rgba(102, 126, 234, 0.3);
          background: transparent;
          color: #667eea;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          transition: all 0.15s;
          min-height: 32px;
        }
        .ai-suggestion-chip:hover {
          background: rgba(102, 126, 234, 0.08);
          border-color: #667eea;
        }
        .ai-suggestion-chip:active {
          background: rgba(102, 126, 234, 0.15);
        }
      `}</style>
    </div>
  );
}

// ============ CHAT INPUT ============

function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled?: boolean;
}) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) onSend();
    }
  };

  return (
    <div className="ai-input-area">
      <input
        type="text"
        className="ai-input"
        placeholder="Ask anything about trade..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <button
        className="ai-send-btn"
        onClick={onSend}
        disabled={!value.trim() || disabled}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>

      <style jsx>{`
        .ai-input-area {
          display: flex;
          gap: 8px;
          padding: 12px 16px;
          border-top: 1px solid var(--border-color);
          background: var(--bg-primary);
          flex-shrink: 0;
        }
        .ai-input {
          flex: 1;
          padding: 10px 14px;
          border-radius: 20px;
          border: 1.5px solid var(--border-color);
          background: var(--bg-secondary, #f8fafc);
          font-size: 0.84rem;
          color: var(--text-primary);
          outline: none;
          min-height: 40px;
          font-family: inherit;
        }
        .ai-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .ai-input::placeholder {
          color: var(--text-secondary);
        }
        .ai-send-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: opacity 0.15s;
        }
        .ai-send-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .ai-send-btn:not(:disabled):hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}

// ============ CHAT PANEL CONTENT (shared between desktop & mobile) ============

function ChatPanelContent({
  messages,
  isTyping,
  inputValue,
  setInputValue,
  handleSend,
  handleSuggestion,
}: {
  messages: AIMessage[];
  isTyping: boolean;
  inputValue: string;
  setInputValue: (v: string) => void;
  handleSend: () => void;
  handleSuggestion: (query: string) => void;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="ai-panel-body">
      <div className="ai-messages-list">
        {messages.length === 0 && (
          <div className="ai-welcome">
            <div className="ai-welcome-icon">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="white" strokeWidth="1.5">
                <path d="M12 2L9 9l-7 1 5 5-1 7 6-3 6 3-1-7 5-5-7-1z" />
              </svg>
            </div>
            <h4>Hi! I'm Befach AI</h4>
            <p>Your trade assistant. Ask me about duties, suppliers, documents, shipping, and more.</p>
          </div>
        )}

        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {(messages.length === 0 || (!isTyping && messages.length > 0 && messages[messages.length - 1]?.role === 'ai')) && (
        <SuggestionChips onSelect={handleSuggestion} />
      )}

      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
        disabled={isTyping}
      />

      <style jsx>{`
        .ai-panel-body {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 0;
        }
        .ai-messages-list {
          flex: 1;
          overflow-y: auto;
          padding: 12px 0;
          min-height: 0;
        }
        .ai-welcome {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 32px 20px;
        }
        .ai-welcome-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }
        .ai-welcome h4 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 6px;
        }
        .ai-welcome p {
          font-size: 0.82rem;
          color: var(--text-secondary);
          max-width: 260px;
          line-height: 1.4;
          margin: 0;
        }
      `}</style>
    </div>
  );
}

// ============ MAIN: AI CHATBOT ============

export default function AIChatbot() {
  const pathname = usePathname();
  const { isMobile } = useMobile();

  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState<AIConversation | null>(null);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Load active conversation on mount
  useEffect(() => {
    const active = getActiveConversation();
    if (active) {
      setConversation(active);
      setMessages(active.messages);
    }
  }, []);

  // Hide FAB on the AI Assistant page
  if (pathname === '/ai-assistant') return null;

  const ensureConversation = (): string => {
    if (conversation) return conversation.id;
    const newConv = createConversation(pathname);
    setConversation(newConv);
    return newConv.id;
  };

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text || isTyping) return;

    const convId = ensureConversation();

    // Add user message
    const userMsg = addMessage(convId, 'user', text);
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response after delay
    const delay = getTypingDelay();
    setTimeout(() => {
      const response = getAIResponse(text);
      const aiMsg = addMessage(convId, 'ai', response.text, response.links);
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, delay);
  };

  const handleSuggestion = (query: string) => {
    setInputValue(query);
    // Auto-send the suggestion
    const convId = ensureConversation();
    const userMsg = addMessage(convId, 'user', query);
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    const delay = getTypingDelay();
    setTimeout(() => {
      const response = getAIResponse(query);
      const aiMsg = addMessage(convId, 'ai', response.text, response.links);
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, delay);
  };

  const toggleOpen = () => {
    if (!isOpen) {
      // Refresh conversation state when opening
      const active = getActiveConversation();
      if (active) {
        setConversation(active);
        setMessages(active.messages);
      }
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* FAB Button */}
      <motion.button
        className="ai-fab"
        onClick={toggleOpen}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        title="AI Assistant"
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M12 2L9 9l-7 1 5 5-1 7 6-3 6 3-1-7 5-5-7-1z" />
          </svg>
        )}
      </motion.button>

      {/* Desktop Chat Panel */}
      {!isMobile && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="ai-panel"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {/* Panel Header */}
              <div className="ai-panel-header">
                <div className="ai-panel-header-left">
                  <div className="ai-panel-avatar">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="white" strokeWidth="2">
                      <path d="M12 2L9 9l-7 1 5 5-1 7 6-3 6 3-1-7 5-5-7-1z" />
                    </svg>
                  </div>
                  <div>
                    <span className="ai-panel-title">Befach AI</span>
                    <span className="ai-panel-status">Online</span>
                  </div>
                </div>
                <div className="ai-panel-header-right">
                  <Link href="/ai-assistant" className="ai-panel-expand" title="Open full chat" onClick={() => setIsOpen(false)}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15 3 21 3 21 9" />
                      <polyline points="9 21 3 21 3 15" />
                      <line x1="21" y1="3" x2="14" y2="10" />
                      <line x1="3" y1="21" x2="10" y2="14" />
                    </svg>
                  </Link>
                  <button className="ai-panel-close" onClick={() => setIsOpen(false)}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Panel Content */}
              <ChatPanelContent
                messages={messages}
                isTyping={isTyping}
                inputValue={inputValue}
                setInputValue={setInputValue}
                handleSend={handleSend}
                handleSuggestion={handleSuggestion}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Mobile Chat BottomSheet */}
      {isMobile && (
        <BottomSheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Befach AI"
          snapPoints={[0.7, 0.92]}
        >
          <div className="ai-mobile-sheet">
            <ChatPanelContent
              messages={messages}
              isTyping={isTyping}
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleSend={handleSend}
              handleSuggestion={handleSuggestion}
            />
          </div>
        </BottomSheet>
      )}

      <style jsx>{`
        /* FAB */
        .ai-fab {
          position: fixed;
          bottom: ${isMobile ? '90px' : '24px'};
          right: ${isMobile ? '16px' : '90px'};
          z-index: 1050;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
          transition: box-shadow 0.3s;
          animation: ${!isOpen ? 'ai-pulse 3s infinite' : 'none'};
        }
        .ai-fab:hover {
          box-shadow: 0 6px 24px rgba(102, 126, 234, 0.5);
        }

        @keyframes ai-pulse {
          0%, 100% { box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4); }
          50% { box-shadow: 0 4px 24px rgba(102, 126, 234, 0.6); }
        }

        /* Desktop Panel */
        .ai-panel {
          position: fixed;
          bottom: 84px;
          right: ${isMobile ? '16px' : '24px'};
          width: 380px;
          height: 520px;
          background: var(--bg-primary);
          border-radius: 16px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
          z-index: 1050;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid var(--border-color);
        }

        /* Panel Header */
        .ai-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border-bottom: 1px solid var(--border-color);
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          flex-shrink: 0;
        }
        .ai-panel-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ai-panel-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ai-panel-title {
          display: block;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .ai-panel-status {
          display: block;
          font-size: 0.68rem;
          opacity: 0.8;
        }
        .ai-panel-header-right {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .ai-panel-close,
        :global(.ai-panel-expand) {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: none;
          background: rgba(255,255,255,0.15);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
        }
        .ai-panel-close:hover,
        :global(.ai-panel-expand:hover) {
          background: rgba(255,255,255,0.25);
        }

        /* Mobile Sheet */
        .ai-mobile-sheet {
          height: calc(100% - 16px);
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </>
  );
}
