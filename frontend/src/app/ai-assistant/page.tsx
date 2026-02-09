'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { useMobile } from '@/hooks/useMobile';
import { useFeedbackTrigger } from '@/hooks/useFeedbackTrigger';
import { AIMessage, AIConversation } from '@/types/chat';
import {
  getAIResponse,
  getTypingDelay,
  getSuggestionsForPage,
  getConversations,
  getConversation,
  createConversation,
  addMessage,
  deleteConversation,
  clearAllConversations,
  getRelativeTime,
} from '@/lib/aiChat';

// ============ CONVERSATION LIST ITEM ============

function ConversationItem({
  conv,
  isActive,
  onSelect,
  onDelete,
}: {
  conv: AIConversation;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const lastMsg = conv.messages.length > 0 ? conv.messages[conv.messages.length - 1] : null;

  return (
    <div className={`ch-conv-item ${isActive ? 'active' : ''}`} onClick={onSelect}>
      <div className="ch-conv-content">
        <span className="ch-conv-title">{conv.title}</span>
        {lastMsg && (
          <span className="ch-conv-preview">
            {lastMsg.role === 'user' ? 'You: ' : ''}
            {lastMsg.text.substring(0, 40)}
            {lastMsg.text.length > 40 ? '...' : ''}
          </span>
        )}
      </div>
      <div className="ch-conv-meta">
        <span className="ch-conv-time">{getRelativeTime(conv.updatedAt)}</span>
        <button
          className="ch-conv-delete"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          title="Delete conversation"
        >
          &times;
        </button>
      </div>

      <style jsx>{`
        .ch-conv-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 14px;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.15s;
          border: 1px solid transparent;
        }
        .ch-conv-item:hover {
          background: var(--bg-secondary, #f8fafc);
        }
        .ch-conv-item.active {
          background: rgba(102, 126, 234, 0.08);
          border-color: rgba(102, 126, 234, 0.2);
        }
        .ch-conv-content {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .ch-conv-title {
          font-size: 0.84rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ch-conv-preview {
          font-size: 0.72rem;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ch-conv-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
          flex-shrink: 0;
        }
        .ch-conv-time {
          font-size: 0.68rem;
          color: var(--text-secondary);
          white-space: nowrap;
        }
        .ch-conv-delete {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.15s;
        }
        .ch-conv-item:hover .ch-conv-delete {
          opacity: 1;
        }
        .ch-conv-delete:hover {
          background: #fee2e2;
          color: #ef4444;
        }
      `}</style>
    </div>
  );
}

// ============ MESSAGE BUBBLE ============

function HubMessageBubble({ message }: { message: AIMessage }) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="ch-system-msg">
        <span>{message.text}</span>
        <style jsx>{`
          .ch-system-msg {
            text-align: center;
            padding: 8px 16px;
            margin-bottom: 8px;
          }
          .ch-system-msg span {
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
    <div className={`ch-msg-row ${isUser ? 'user' : 'bot'}`}>
      {!isUser && (
        <div className="ch-avatar">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" strokeWidth="1.75">
            <path d="M12 2L9 9l-7 1 5 5-1 7 6-3 6 3-1-7 5-5-7-1z" />
          </svg>
        </div>
      )}
      <div className="ch-msg-content">
        <div className={`ch-bubble ${isUser ? 'user-bubble' : 'bot-bubble'}`}>
          <p>{message.text}</p>
          {message.links && message.links.length > 0 && (
            <div className="ch-msg-links">
              {message.links.map((link, i) => (
                <Link key={i} href={link.href} className="ch-msg-link">
                  {link.label} →
                </Link>
              ))}
            </div>
          )}
        </div>
        <span className="ch-msg-time">{time}</span>
      </div>

      <style jsx>{`
        .ch-msg-row {
          display: flex;
          gap: 10px;
          padding: 0 20px;
          margin-bottom: 14px;
          align-items: flex-end;
        }
        .ch-msg-row.user {
          justify-content: flex-end;
        }
        .ch-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ch-msg-content {
          max-width: 70%;
          display: flex;
          flex-direction: column;
        }
        .ch-bubble {
          padding: 12px 16px;
          border-radius: 18px;
          line-height: 1.5;
        }
        .ch-bubble p {
          margin: 0;
          font-size: 0.875rem;
        }
        .user-bubble {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-radius: 18px 18px 4px 18px;
        }
        .bot-bubble {
          background: var(--bg-secondary, #f1f5f9);
          color: var(--text-primary);
          border-radius: 18px 18px 18px 4px;
        }
        .ch-msg-links {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid rgba(255,255,255,0.15);
        }
        .bot-bubble .ch-msg-links {
          border-top-color: var(--border-color);
        }
        .ch-msg-time {
          font-size: 0.68rem;
          color: var(--text-secondary);
          margin-top: 4px;
          padding: 0 4px;
        }
        .ch-msg-row.user .ch-msg-time {
          text-align: right;
        }
      `}</style>
      <style jsx global>{`
        .ch-msg-link {
          font-size: 0.8rem;
          font-weight: 600;
          color: white;
          text-decoration: none;
          padding: 5px 12px;
          border-radius: 8px;
          background: rgba(255,255,255,0.15);
          transition: background 0.15s;
        }
        .ch-msg-link:hover {
          background: rgba(255,255,255,0.25);
        }
        .bot-bubble .ch-msg-link {
          color: #667eea;
          background: rgba(102, 126, 234, 0.1);
        }
        .bot-bubble .ch-msg-link:hover {
          background: rgba(102, 126, 234, 0.2);
        }
      `}</style>
    </div>
  );
}

// ============ TYPING INDICATOR ============

function HubTypingIndicator() {
  return (
    <div className="ch-typing">
      <div className="ch-typing-avatar">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" strokeWidth="1.75">
          <path d="M12 2L9 9l-7 1 5 5-1 7 6-3 6 3-1-7 5-5-7-1z" />
        </svg>
      </div>
      <div className="ch-typing-dots">
        <span className="ch-dot" />
        <span className="ch-dot" />
        <span className="ch-dot" />
      </div>

      <style jsx>{`
        .ch-typing {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          padding: 0 20px;
          margin-bottom: 14px;
        }
        .ch-typing-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ch-typing-dots {
          display: flex;
          gap: 4px;
          padding: 12px 18px;
          background: var(--bg-secondary, #f1f5f9);
          border-radius: 18px 18px 18px 4px;
        }
        .ch-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #94a3b8;
          animation: ch-bounce 1.4s infinite ease-in-out;
        }
        .ch-dot:nth-child(1) { animation-delay: 0s; }
        .ch-dot:nth-child(2) { animation-delay: 0.2s; }
        .ch-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes ch-bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ============ TOPIC CARDS (empty state) ============

const TOPIC_CARDS = [
  {
    title: 'Trade Regulations',
    desc: 'Import/export rules, duties, compliance',
    query: 'What are the key import regulations I should know about?',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    title: 'Supplier Discovery',
    desc: 'Find and evaluate suppliers worldwide',
    query: 'How can I find reliable suppliers for my products?',
    gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
  },
  {
    title: 'Documentation Help',
    desc: 'Required documents, filing procedures',
    query: 'What documents do I need for importing goods?',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  },
  {
    title: 'Cost Calculation',
    desc: 'Duty rates, landed costs, pricing',
    query: 'How do I calculate the total landed cost of imported goods?',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  },
];

// ============ MAIN: CHAT HUB PAGE ============

export default function AIAssistantPage() {
  const { isMobile } = useMobile();
  const { triggerTimeBasedFeedback, promptElement } = useFeedbackTrigger();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [historySheetOpen, setHistorySheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    triggerTimeBasedFeedback('ai-assistant', 45000);
    refreshConversations();
  }, [triggerTimeBasedFeedback]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const refreshConversations = () => {
    const convs = getConversations();
    setConversations(convs);
  };

  const selectConversation = (id: string) => {
    const conv = getConversation(id);
    if (conv) {
      setActiveConvId(id);
      setMessages(conv.messages);
      setHistorySheetOpen(false);
    }
  };

  const handleNewChat = () => {
    const conv = createConversation('/ai-assistant');
    setActiveConvId(conv.id);
    setMessages([]);
    refreshConversations();
    setHistorySheetOpen(false);
  };

  const handleDeleteConv = (id: string) => {
    deleteConversation(id);
    if (activeConvId === id) {
      setActiveConvId(null);
      setMessages([]);
    }
    refreshConversations();
  };

  const handleClearAll = () => {
    clearAllConversations();
    setActiveConvId(null);
    setMessages([]);
    setConversations([]);
  };

  const sendMessage = (text: string, convId?: string) => {
    let cid = convId || activeConvId;
    if (!cid) {
      const conv = createConversation('/ai-assistant');
      cid = conv.id;
      setActiveConvId(cid);
    }

    const userMsg = addMessage(cid, 'user', text);
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);
    refreshConversations();

    const delay = getTypingDelay();
    const capturedId = cid;
    setTimeout(() => {
      const response = getAIResponse(text);
      const aiMsg = addMessage(capturedId, 'ai', response.text, response.links);
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      refreshConversations();
    }, delay);
  };

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text || isTyping) return;
    sendMessage(text);
  };

  const handleTopicStart = (query: string) => {
    const conv = createConversation('/ai-assistant');
    setActiveConvId(conv.id);
    setMessages([]);
    refreshConversations();
    // Small delay so state updates
    setTimeout(() => sendMessage(query, conv.id), 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim()) handleSend();
    }
  };

  const suggestions = getSuggestionsForPage('/ai-assistant');

  const filteredConversations = searchQuery
    ? conversations.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : conversations;

  // ===== CONVERSATION LIST =====

  const conversationList = (
    <div className="ch-sidebar">
      <div className="ch-sidebar-header">
        <h3>Conversations</h3>
        <button className="ch-new-btn" onClick={handleNewChat} title="New conversation">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      <div className="ch-search">
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="ch-conv-list">
        {filteredConversations.length === 0 && (
          <div className="ch-conv-empty">
            <p>No conversations yet</p>
            <button className="ch-start-btn" onClick={handleNewChat}>Start a conversation</button>
          </div>
        )}
        {filteredConversations.map(conv => (
          <ConversationItem
            key={conv.id}
            conv={conv}
            isActive={conv.id === activeConvId}
            onSelect={() => selectConversation(conv.id)}
            onDelete={() => handleDeleteConv(conv.id)}
          />
        ))}
      </div>

      {conversations.length > 0 && (
        <div className="ch-sidebar-footer">
          <button className="ch-clear-btn" onClick={handleClearAll}>Clear All</button>
        </div>
      )}

      <style jsx>{`
        .ch-sidebar {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .ch-sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 16px 12px;
        }
        .ch-sidebar-header h3 {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }
        .ch-new-btn {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          border: 1.5px solid var(--border-color);
          background: var(--bg-primary);
          color: #667eea;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }
        .ch-new-btn:hover {
          background: rgba(102, 126, 234, 0.08);
          border-color: #667eea;
        }
        .ch-search {
          padding: 0 16px 12px;
        }
        .ch-search input {
          width: 100%;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary, #f8fafc);
          font-size: 0.8rem;
          color: var(--text-primary);
          outline: none;
          font-family: inherit;
        }
        .ch-search input:focus {
          border-color: #667eea;
        }
        .ch-conv-list {
          flex: 1;
          overflow-y: auto;
          padding: 0 8px;
        }
        .ch-conv-empty {
          text-align: center;
          padding: 32px 16px;
        }
        .ch-conv-empty p {
          font-size: 0.84rem;
          color: var(--text-secondary);
          margin: 0 0 12px;
        }
        .ch-start-btn {
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
        }
        .ch-sidebar-footer {
          padding: 12px 16px;
          border-top: 1px solid var(--border-color);
        }
        .ch-clear-btn {
          width: 100%;
          padding: 8px;
          border-radius: 8px;
          border: 1px solid #fca5a5;
          background: transparent;
          color: #ef4444;
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }
        .ch-clear-btn:hover {
          background: #fef2f2;
        }
      `}</style>
    </div>
  );

  // ===== CHAT AREA =====

  const chatArea = (
    <div className="ch-chat-area">
      {activeConvId ? (
        <>
          <div className="ch-chat-messages">
            {messages.length === 0 && (
              <div className="ch-welcome">
                <div className="ch-welcome-icon">
                  <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="white" strokeWidth="1.5">
                    <path d="M12 2L9 9l-7 1 5 5-1 7 6-3 6 3-1-7 5-5-7-1z" />
                  </svg>
                </div>
                <h3>Start chatting with Befach AI</h3>
                <p>Ask me anything about trade, suppliers, regulations, costs, and more.</p>
              </div>
            )}
            {messages.map(msg => (
              <HubMessageBubble key={msg.id} message={msg} />
            ))}
            {isTyping && <HubTypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {(messages.length === 0 || (!isTyping && messages.length > 0 && messages[messages.length - 1]?.role === 'ai')) && (
            <div className="ch-suggestions">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  className="ch-suggestion-chip"
                  onClick={() => sendMessage(s.query)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          <div className="ch-input-area">
            <input
              type="text"
              className="ch-input"
              placeholder="Ask anything about trade..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
            />
            <button
              className="ch-send-btn"
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </>
      ) : (
        <div className="ch-empty-state">
          <div className="ch-empty-icon">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="white" strokeWidth="1.5">
              <path d="M12 2L9 9l-7 1 5 5-1 7 6-3 6 3-1-7 5-5-7-1z" />
            </svg>
          </div>
          <h2>Welcome to Befach AI</h2>
          <p>Your intelligent trade assistant. Start a conversation or pick a topic below.</p>

          <div className="ch-topic-grid">
            {TOPIC_CARDS.map((topic, i) => (
              <button
                key={i}
                className="ch-topic-card"
                onClick={() => handleTopicStart(topic.query)}
              >
                <div className="ch-topic-icon" style={{ background: topic.gradient }}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="2">
                    <path d="M12 2L9 9l-7 1 5 5-1 7 6-3 6 3-1-7 5-5-7-1z" />
                  </svg>
                </div>
                <div className="ch-topic-text">
                  <span className="ch-topic-title">{topic.title}</span>
                  <span className="ch-topic-desc">{topic.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .ch-chat-area {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 0;
        }
        .ch-chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px 0;
          min-height: 0;
        }
        .ch-welcome {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 40px 20px;
        }
        .ch-welcome-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }
        .ch-welcome h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 6px;
        }
        .ch-welcome p {
          font-size: 0.875rem;
          color: var(--text-secondary);
          max-width: 320px;
          line-height: 1.4;
          margin: 0;
        }
        .ch-suggestions {
          display: flex;
          gap: 8px;
          padding: 8px 20px;
          overflow-x: auto;
          scrollbar-width: none;
          flex-shrink: 0;
        }
        .ch-suggestions::-webkit-scrollbar { display: none; }
        .ch-suggestion-chip {
          padding: 8px 16px;
          border-radius: 18px;
          border: 1.5px solid rgba(102, 126, 234, 0.3);
          background: transparent;
          color: #667eea;
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          transition: all 0.15s;
          min-height: 36px;
        }
        .ch-suggestion-chip:hover {
          background: rgba(102, 126, 234, 0.08);
          border-color: #667eea;
        }
        .ch-input-area {
          display: flex;
          gap: 10px;
          padding: 16px 20px;
          border-top: 1px solid var(--border-color);
          flex-shrink: 0;
        }
        .ch-input {
          flex: 1;
          padding: 12px 16px;
          border-radius: 24px;
          border: 1.5px solid var(--border-color);
          background: var(--bg-secondary, #f8fafc);
          font-size: 0.875rem;
          color: var(--text-primary);
          outline: none;
          font-family: inherit;
          min-height: 44px;
        }
        .ch-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .ch-input::placeholder {
          color: var(--text-secondary);
        }
        .ch-send-btn {
          width: 44px;
          height: 44px;
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
        .ch-send-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .ch-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          flex: 1;
          text-align: center;
        }
        .ch-empty-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        .ch-empty-state h2 {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 8px;
        }
        .ch-empty-state > p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          max-width: 400px;
          line-height: 1.5;
          margin: 0 0 30px;
        }
        .ch-topic-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          max-width: 500px;
          width: 100%;
        }
        .ch-topic-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          cursor: pointer;
          text-align: left;
          transition: all 0.15s;
        }
        .ch-topic-card:hover {
          border-color: #667eea;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
        }
        .ch-topic-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ch-topic-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .ch-topic-title {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .ch-topic-desc {
          font-size: 0.7rem;
          color: var(--text-secondary);
          line-height: 1.3;
        }
        @media (max-width: 480px) {
          .ch-topic-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );

  // ===== PAGE RENDER =====

  return (
    <AppLayout>
      <div className="ch-page">
        {isMobile ? (
          <>
            <div className="ch-mobile-header">
              <h1>AI Chat</h1>
              <button className="ch-history-btn" onClick={() => setHistorySheetOpen(true)}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                History
              </button>
            </div>
            {chatArea}
            <BottomSheet
              isOpen={historySheetOpen}
              onClose={() => setHistorySheetOpen(false)}
              title="Chat History"
              snapPoints={[0.6, 0.85]}
            >
              <div className="ch-history-sheet">
                {conversationList}
              </div>
            </BottomSheet>
          </>
        ) : (
          <div className="ch-desktop-layout">
            <div className="ch-sidebar-panel">
              {conversationList}
            </div>
            <div className="ch-main-panel">
              {chatArea}
            </div>
          </div>
        )}
      </div>
      {promptElement}

      <style jsx>{`
        .ch-page {
          height: calc(100vh - 64px - 56px);
          display: flex;
          flex-direction: column;
          margin: -28px;
          overflow: hidden;
        }
        .ch-mobile-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border-bottom: 1px solid var(--border-color);
          flex-shrink: 0;
        }
        .ch-mobile-header h1 {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }
        .ch-history-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-secondary);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          min-height: 38px;
        }
        .ch-history-sheet {
          height: 100%;
        }
        .ch-desktop-layout {
          display: flex;
          height: 100%;
          overflow: hidden;
        }
        .ch-sidebar-panel {
          width: 300px;
          min-width: 300px;
          border-right: 1px solid var(--border-color);
          overflow-y: auto;
        }
        .ch-main-panel {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
        @media (max-width: 1024px) {
          .ch-page {
            margin: -20px;
          }
        }
        @media (max-width: 768px) {
          .ch-page {
            margin: -16px;
            height: calc(100vh - 64px - 16px);
            padding-bottom: calc(80px + env(safe-area-inset-bottom, 0px));
          }
        }
        @media (max-width: 480px) {
          .ch-page {
            margin: -12px;
          }
        }
      `}</style>
    </AppLayout>
  );
}
