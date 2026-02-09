'use client';

import { useState, useEffect, useRef } from 'react';
import { Supplier, ChatMessage, getChatMessages, addChatMessage } from '@/lib/suppliers';
import { Modal } from '@/components/ui';
import { saveSupplierFromSearch } from '@/lib/savedSuppliers';

interface ChatWindowProps {
  supplier: Supplier;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatWindow({ supplier, isOpen, onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const storedMessages = getChatMessages(supplier.id);
      if (storedMessages.length === 0) {
        // Add welcome message
        const welcomeMsg = addChatMessage(supplier.id, {
          from: 'system',
          text: `Chat started with ${supplier.companyName}`,
        });
        setMessages([welcomeMsg]);

        // Auto-save supplier to Our Vendors when starting a new chat
        saveSupplierFromSearch({
          id: supplier.id,
          companyName: supplier.companyName,
          location: supplier.location,
          contacts: supplier.contacts,
          catalogue: supplier.catalogue,
          metrics: supplier.metrics,
          website: supplier.website,
          description: supplier.description,
        }, 'chat');
      } else {
        setMessages(storedMessages);
      }
    }
  }, [isOpen, supplier.id, supplier.companyName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMsg = addChatMessage(supplier.id, {
      from: 'user',
      text: inputValue.trim(),
    });
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');

    // Simulate supplier typing
    setIsTyping(true);

    // Simulate supplier response after delay
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        `Thank you for reaching out! Our team at ${supplier.companyName} is reviewing your message.`,
        'We would be happy to discuss your requirements. Could you share more details about the quantities you need?',
        'Thanks for your interest! We can offer competitive pricing for bulk orders. What quantity are you looking for?',
        `Hello! ${supplier.companyName} specializes in high-quality products. How can we assist you today?`,
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const supplierMsg = addChatMessage(supplier.id, {
        from: 'supplier',
        text: randomResponse,
      });
      setMessages((prev) => [...prev, supplierMsg]);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="chat-window">
        <div className="chat-header">
          <div className="chat-supplier-info">
            <div className="supplier-avatar">{supplier.companyName.charAt(0)}</div>
            <div>
              <h3>{supplier.companyName}</h3>
              <span className="online-status">● Online</span>
            </div>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message ${msg.from}`}>
              <div className="message-content">{msg.text}</div>
              <div className="message-time">{formatTime(msg.timestamp)}</div>
            </div>
          ))}
          {isTyping && (
            <div className="chat-message supplier typing">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <input
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={sendMessage} disabled={!inputValue.trim()}>
            Send
          </button>
        </div>
      </div>

      <style jsx>{`
        .chat-window {
          display: flex;
          flex-direction: column;
          height: 500px;
          margin: -20px;
        }

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-color);
        }

        .chat-supplier-info {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .supplier-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
        }

        .chat-supplier-info h3 {
          margin: 0;
          font-size: 1rem;
          color: var(--text-primary);
        }

        .online-status {
          color: #22c55e;
          font-size: 0.8rem;
        }

        .chat-messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .chat-message {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 16px;
        }

        .chat-message.system {
          align-self: center;
          background: var(--bg-secondary);
          color: var(--text-muted);
          font-size: 0.85rem;
          max-width: 100%;
          text-align: center;
          padding: 8px 16px;
        }

        .chat-message.user {
          align-self: flex-end;
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
        }

        .chat-message.supplier {
          align-self: flex-start;
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        .message-content {
          font-size: 0.95rem;
          line-height: 1.4;
        }

        .message-time {
          font-size: 0.7rem;
          opacity: 0.7;
          margin-top: 4px;
        }

        .chat-message.user .message-time {
          text-align: right;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 4px 0;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          background: var(--text-muted);
          border-radius: 50%;
          animation: typingBounce 1.4s infinite;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typingBounce {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-6px);
          }
        }

        .chat-input-area {
          display: flex;
          gap: 10px;
          padding: 16px 20px;
          border-top: 1px solid var(--border-color);
        }

        .chat-input-area input {
          flex: 1;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          padding: 12px 20px;
          color: var(--text-primary);
          font-size: 0.95rem;
        }

        .chat-input-area input:focus {
          outline: none;
          border-color: #f97316;
        }

        .chat-input-area input::placeholder {
          color: var(--text-muted);
        }

        .chat-input-area button {
          background: linear-gradient(135deg, #f97316, #ea580c);
          border: none;
          color: white;
          padding: 12px 24px;
          border-radius: 24px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .chat-input-area button:hover:not(:disabled) {
          transform: scale(1.02);
        }

        .chat-input-area button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </Modal>
  );
}
