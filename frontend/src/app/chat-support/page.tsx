'use client';

import { useState, useRef, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';

interface Message {
  id: number;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
}

const quickActions = [
  { id: 'track', label: '📦 Track My Order', query: 'Track my order status' },
  { id: 'quote', label: '💰 Get a Quote', query: 'I need a quote for a new product' },
  { id: 'status', label: '📋 Order Status', query: 'What is the status of my latest order?' },
  { id: 'supplier', label: '🏭 Find Supplier', query: 'Help me find a supplier' },
  { id: 'customs', label: '📄 Customs Help', query: 'I have a question about customs clearance' },
  { id: 'agent', label: '👤 Talk to Expert', query: 'Connect me with a human expert' },
];

const botResponses: Record<string, string> = {
  'track': "I'd be happy to help you track your order! Please provide your order ID or the product name, and I'll look up the current status for you.",
  'quote': "Great! I can help you get a quote. Please share:\n\n1. Product name/description\n2. Quantity needed\n3. Delivery location\n\nOur team will prepare a detailed quote within 24 hours.",
  'status': "Let me check your recent orders... You have 2 active orders:\n\n📦 **ORD-2024-0847** - Organic Turmeric\nStatus: In Transit (ETA: Dec 5)\n\n📦 **ORD-2024-0812** - Black Pepper\nStatus: Customs Clearance\n\nWould you like more details about any of these?",
  'supplier': "I can help you find verified suppliers! What product are you looking for? Please also mention:\n\n• Desired origin country\n• Quality requirements\n• Approximate quantity",
  'customs': "I can help with customs-related queries. Common questions include:\n\n• HS Code lookup\n• Duty calculations\n• Required documents\n• Clearance process\n\nWhat specifically would you like to know?",
  'agent': "Connecting you with a Befach expert... 👤\n\nYou can also reach us directly:\n📱 WhatsApp: +91 98765 43210\n📧 Email: support@befach.com\n\nAverage response time: 15 minutes during business hours.",
  'default': "I'm here to help with your import needs! You can ask me about:\n\n• Tracking orders\n• Getting quotes\n• Finding suppliers\n• Customs & compliance\n\nOr use the quick action buttons above for common requests."
};

export default function ChatSupportPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: "Hi! 👋 I'm your Befach assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuickAction = (action: typeof quickActions[0]) => {
    sendMessage(action.query, action.id);
  };

  const sendMessage = async (content: string, actionId?: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const responseKey = actionId || 'default';
    const botMessage: Message = {
      id: messages.length + 2,
      type: 'bot',
      content: botResponses[responseKey] || botResponses['default'],
      timestamp: new Date()
    };

    setIsTyping(false);
    setMessages(prev => [...prev, botMessage]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/919876543210?text=Hi, I need help with my import requirement', '_blank');
  };

  return (
    <AppLayout>
      <div className="chat-container">
        <div className="chat-header">
          <div className="chat-header-info">
            <h1>💬 Chat with Us</h1>
            <span className="online-status">
              <span className="status-dot"></span>
              Online - Avg. response: 5 min
            </span>
          </div>
          <button className="whatsapp-btn" onClick={openWhatsApp}>
            📱 Open WhatsApp
          </button>
        </div>

        <div className="chat-main">
          <div className="quick-actions-bar">
            {quickActions.map(action => (
              <button 
                key={action.id}
                className="quick-action-btn"
                onClick={() => handleQuickAction(action)}
              >
                {action.label}
              </button>
            ))}
          </div>

          <div className="messages-container">
            {messages.map(message => (
              <div 
                key={message.id}
                className={`message ${message.type}`}
              >
                {message.type === 'bot' && (
                  <div className="message-avatar">🤖</div>
                )}
                <div className="message-content">
                  <div className="message-text" style={{ whiteSpace: 'pre-line' }}>
                    {message.content}
                  </div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-form" onSubmit={handleSubmit}>
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="chat-input"
            />
            <button type="submit" className="send-btn" disabled={!inputValue.trim()}>
              ➤
            </button>
          </form>
        </div>

        <div className="chat-sidebar">
          <div className="sidebar-section">
            <h3>📞 Direct Contact</h3>
            <div className="contact-card">
              <div className="contact-item">
                <span className="contact-icon">📱</span>
                <div>
                  <strong>WhatsApp</strong>
                  <p>+91 98765 43210</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <div>
                  <strong>Email</strong>
                  <p>support@befach.com</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🕐</span>
                <div>
                  <strong>Hours</strong>
                  <p>Mon-Sat, 9am-7pm IST</p>
                </div>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>📚 Help Articles</h3>
            <ul className="help-links">
              <li><a href="#">How to track your shipment</a></li>
              <li><a href="#">Understanding customs duties</a></li>
              <li><a href="#">Payment methods explained</a></li>
              <li><a href="#">Getting started guide</a></li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        .chat-container {
          display: grid;
          grid-template-columns: 1fr 280px;
          grid-template-rows: auto 1fr;
          gap: 0;
          height: calc(100vh - 160px);
          max-height: 800px;
          background: var(--card-bg);
          border-radius: 16px;
          overflow: hidden;
        }
        .chat-header {
          grid-column: 1 / -1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 25px;
          background: var(--card-bg);
          border-bottom: 1px solid var(--border-color);
        }
        .chat-header h1 {
          font-size: 1.3em;
          color: var(--text-primary);
          margin: 0;
        }
        .online-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85em;
          color: var(--text-secondary);
        }
        .status-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
        }
        .whatsapp-btn {
          background: #25d366;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }
        .chat-main {
          display: flex;
          flex-direction: column;
          border-right: 1px solid var(--border-color);
        }
        .quick-actions-bar {
          display: flex;
          gap: 10px;
          padding: 15px 20px;
          overflow-x: auto;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
        }
        .quick-action-btn {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          padding: 8px 14px;
          border-radius: 20px;
          font-size: 0.85em;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s;
          color: var(--text-primary);
        }
        .quick-action-btn:hover {
          border-color: var(--accent-primary);
          background: rgba(255, 107, 53, 0.05);
        }
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .message {
          display: flex;
          gap: 10px;
          max-width: 80%;
        }
        .message.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }
        .message-avatar {
          width: 36px;
          height: 36px;
          background: var(--bg-tertiary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2em;
          flex-shrink: 0;
        }
        .message-content {
          background: var(--bg-tertiary);
          padding: 12px 16px;
          border-radius: 18px;
        }
        .message.user .message-content {
          background: var(--accent-gradient);
          color: white;
        }
        .message-text {
          color: var(--text-primary);
          line-height: 1.5;
        }
        .message.user .message-text {
          color: white;
        }
        .message-time {
          font-size: 0.75em;
          color: var(--text-muted);
          margin-top: 5px;
        }
        .message.user .message-time {
          color: rgba(255,255,255,0.7);
        }
        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 5px 0;
        }
        .typing-indicator span {
          width: 8px;
          height: 8px;
          background: var(--text-secondary);
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }
        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .chat-input-form {
          display: flex;
          gap: 10px;
          padding: 15px 20px;
          background: var(--card-bg);
          border-top: 1px solid var(--border-color);
        }
        .chat-input {
          flex: 1;
          padding: 12px 18px;
          border: 2px solid var(--border-color);
          border-radius: 25px;
          font-size: 1em;
          background: var(--bg-primary);
          color: var(--text-primary);
        }
        .chat-input:focus {
          outline: none;
          border-color: var(--accent-primary);
        }
        .send-btn {
          width: 45px;
          height: 45px;
          background: var(--accent-gradient);
          color: white;
          border: none;
          border-radius: 50%;
          font-size: 1.2em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .chat-sidebar {
          padding: 20px;
          overflow-y: auto;
          background: var(--bg-secondary);
        }
        .sidebar-section {
          margin-bottom: 25px;
        }
        .sidebar-section h3 {
          color: var(--text-primary);
          font-size: 1em;
          margin-bottom: 15px;
        }
        .contact-card {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 15px;
        }
        .contact-item {
          display: flex;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid var(--border-color);
        }
        .contact-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .contact-icon {
          font-size: 1.3em;
        }
        .contact-item strong {
          color: var(--text-primary);
          display: block;
          font-size: 0.9em;
        }
        .contact-item p {
          color: var(--text-secondary);
          font-size: 0.85em;
          margin: 2px 0 0 0;
        }
        .help-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .help-links li {
          margin-bottom: 10px;
        }
        .help-links a {
          color: var(--accent-primary);
          text-decoration: none;
          font-size: 0.9em;
        }
        .help-links a:hover {
          opacity: 0.8;
        }
        @media (max-width: 768px) {
          .chat-container {
            grid-template-columns: 1fr;
            height: calc(100vh - 120px);
          }
          .chat-sidebar {
            display: none;
          }
          .chat-main {
            border-right: none;
          }
          .message {
            max-width: 90%;
          }
        }
      `}</style>
    </AppLayout>
  );
}

