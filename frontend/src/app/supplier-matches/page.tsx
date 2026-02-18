'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  Conversation,
  Message,
  ConversationFilter,
  ConversationStatus,
  RFQData,
  getStoredConversations,
  saveConversations,
  sendMessage,
  sendRFQ,
  markAsRead,
  toggleFavorite,
  archiveConversation,
  filterConversations,
  sortConversations,
  getConversationStats,
  formatMessageTime,
  formatFullTime,
  formatDateSeparator,
  getCountryFlag,
  STATUS_CONFIG,
} from '@/lib/conversations';
import { MessageCircle, Star, FolderOpen, CheckCircle, Inbox, CircleDot, DollarSign, Archive, Paperclip } from 'lucide-react';

// Filter tabs configuration
const FILTER_TABS: { id: ConversationFilter; label: string; iconKey: string }[] = [
  { id: 'all', label: 'All', iconKey: 'inbox' },
  { id: 'active', label: 'Active', iconKey: 'active' },
  { id: 'favorites', label: 'Favorites', iconKey: 'star' },
  { id: 'quoted', label: 'Quoted', iconKey: 'quoted' },
  { id: 'archived', label: 'Archived', iconKey: 'archived' },
];

function FilterIcon({ iconKey, size = 14 }: { iconKey: string; size?: number }) {
  switch (iconKey) {
    case 'inbox': return <Inbox size={size} />;
    case 'active': return <CircleDot size={size} />;
    case 'star': return <Star size={size} />;
    case 'quoted': return <DollarSign size={size} />;
    case 'archived': return <Archive size={size} />;
    default: return <Inbox size={size} />;
  }
}

export default function MessagesPage() {
  // State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<ConversationFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  const [showRFQModal, setShowRFQModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // RFQ form state
  const [rfqForm, setRfqForm] = useState<RFQData>({
    productName: '',
    quantity: '',
    unit: 'pieces',
    targetPrice: '',
    specifications: '',
    deliveryDate: '',
  });

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  // Load conversations on mount
  useEffect(() => {
    const stored = getStoredConversations();
    setConversations(stored);
    setIsLoading(false);

    // Check for mobile view
    const checkMobile = () => setIsMobileView(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedId, conversations]);

  // Mark as read when selecting conversation
  useEffect(() => {
    if (selectedId) {
      markAsRead(selectedId);
      // Refresh conversations to update unread count
      setConversations(getStoredConversations());
    }
  }, [selectedId]);

  // Filtered and sorted conversations
  const displayedConversations = useMemo(() => {
    const filtered = filterConversations(conversations, activeFilter, searchQuery);
    return sortConversations(filtered, 'recent');
  }, [conversations, activeFilter, searchQuery]);

  // Selected conversation
  const selectedConversation = useMemo(() => {
    return conversations.find(c => c.id === selectedId) || null;
  }, [conversations, selectedId]);

  // Stats
  const stats = useMemo(() => getConversationStats(conversations), [conversations]);

  // Handlers
  const handleSendMessage = () => {
    if (!selectedId || !messageInput.trim()) return;

    sendMessage(selectedId, messageInput.trim());
    setMessageInput('');
    setConversations(getStoredConversations());

    // Simulate supplier response after 2-3 seconds
    setTimeout(() => {
      const conv = getStoredConversations().find(c => c.id === selectedId);
      if (conv) {
        const responses = [
          "Thank you for your message! I'll get back to you with the details shortly.",
          "Great question! Let me check with our production team and get back to you.",
          "I appreciate your interest. We can definitely work on those specifications.",
          "Thanks for reaching out! Our MOQ for this product is 1000 units.",
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        // Add supplier response
        const allConvs = getStoredConversations();
        const idx = allConvs.findIndex(c => c.id === selectedId);
        if (idx !== -1) {
          const now = new Date().toISOString();
          const newMessage: Message = {
            id: `MSG-${Date.now()}`,
            conversationId: selectedId,
            type: 'text',
            content: randomResponse,
            sender: 'supplier',
            sentAt: now,
          };
          allConvs[idx] = {
            ...allConvs[idx],
            messages: [...allConvs[idx].messages, newMessage],
            lastMessageAt: now,
            lastMessagePreview: randomResponse.substring(0, 50),
            status: 'active',
            unreadCount: 1,
            updatedAt: now,
          };
          saveConversations(allConvs);
          setConversations(allConvs);
        }
      }
    }, 2000 + Math.random() * 2000);
  };

  const handleSendRFQ = () => {
    if (!selectedId || !rfqForm.productName || !rfqForm.quantity) return;

    sendRFQ(selectedId, rfqForm);
    setShowRFQModal(false);
    setRfqForm({
      productName: '',
      quantity: '',
      unit: 'pieces',
      targetPrice: '',
      specifications: '',
      deliveryDate: '',
    });
    setConversations(getStoredConversations());

    // Simulate quote response after delay
    setTimeout(() => {
      const allConvs = getStoredConversations();
      const idx = allConvs.findIndex(c => c.id === selectedId);
      if (idx !== -1) {
        const now = new Date().toISOString();
        const unitPrice = parseFloat(rfqForm.targetPrice?.replace(/[^0-9.]/g, '') || '10') * (0.9 + Math.random() * 0.3);

        const quoteMessage: Message = {
          id: `MSG-${Date.now()}`,
          conversationId: selectedId,
          type: 'quote',
          content: 'Quote received',
          sender: 'supplier',
          sentAt: now,
          quoteData: {
            unitPrice: Math.round(unitPrice * 100) / 100,
            currency: 'USD',
            moq: 1000 + Math.floor(Math.random() * 4000),
            leadTime: 15 + Math.floor(Math.random() * 30),
            validUntil: new Date(Date.now() + 7 * 86400000).toISOString(),
            notes: 'Price includes FOB shipping. Custom packaging available for orders over 5000 units.',
          },
        };

        allConvs[idx] = {
          ...allConvs[idx],
          messages: [...allConvs[idx].messages, quoteMessage],
          lastMessageAt: now,
          lastMessagePreview: 'Quote received',
          status: 'quoted',
          unreadCount: 1,
          updatedAt: now,
        };
        saveConversations(allConvs);
        setConversations(allConvs);
      }
    }, 5000 + Math.random() * 5000);
  };

  const handleToggleFavorite = (convId: string) => {
    toggleFavorite(convId);
    setConversations(getStoredConversations());
  };

  const handleArchive = (convId: string) => {
    archiveConversation(convId);
    if (selectedId === convId) {
      setSelectedId(null);
    }
    setConversations(getStoredConversations());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBack = () => {
    setSelectedId(null);
  };

  // Group messages by date
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = '';

    messages.forEach(msg => {
      const msgDate = new Date(msg.sentAt).toDateString();
      if (msgDate !== currentDate) {
        currentDate = msgDate;
        groups.push({ date: msg.sentAt, messages: [msg] });
      } else {
        groups[groups.length - 1].messages.push(msg);
      }
    });

    return groups;
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading messages...</p>
        </div>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 60vh;
            gap: 16px;
          }
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--border-color);
            border-top-color: #f97316;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          p { color: var(--text-muted); }
        `}</style>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className={`inbox-container ${isMobileView && selectedId ? 'chat-open' : ''}`}>
        {/* Conversation List Panel */}
        <aside className={`conversation-list-panel ${isMobileView && selectedId ? 'hidden' : ''}`}>
          {/* Header */}
          <div className="list-header">
            <h1>Supplier Inbox</h1>
            <span className="unread-badge">{stats.unread > 0 ? stats.unread : ''}</span>
          </div>

          {/* Search */}
          <div className="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            {FILTER_TABS.map(tab => (
              <button
                key={tab.id}
                className={`filter-tab ${activeFilter === tab.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(tab.id)}
              >
                <span className="tab-icon"><FilterIcon iconKey={tab.iconKey} size={13} /></span>
                <span className="tab-label">{tab.label}</span>
                {tab.id === 'all' && stats.total > 0 && (
                  <span className="tab-count">{stats.total}</span>
                )}
              </button>
            ))}
          </div>

          {/* Conversation List */}
          <div className="conversations-list">
            {displayedConversations.length === 0 ? (
              <div className="empty-list">
                <span className="empty-icon"><MessageCircle size={48} /></span>
                <p>No conversations found</p>
              </div>
            ) : (
              displayedConversations.map(conv => (
                <div
                  key={conv.id}
                  className={`conversation-card ${selectedId === conv.id ? 'selected' : ''} ${conv.unreadCount > 0 ? 'unread' : ''}`}
                  onClick={() => setSelectedId(conv.id)}
                >
                  {/* Avatar */}
                  <div className="conv-avatar">
                    {conv.supplierName.charAt(0)}
                    {conv.supplierVerified && <span className="verified-badge">✓</span>}
                  </div>

                  {/* Info */}
                  <div className="conv-info">
                    <div className="conv-header">
                      <h3 className="conv-name">{conv.supplierName}</h3>
                      <span className="conv-time">{formatMessageTime(conv.lastMessageAt)}</span>
                    </div>
                    <div className="conv-meta">
                      <span className="conv-location">
                        {getCountryFlag(conv.supplierCountry)} {conv.supplierCountry}
                      </span>
                      {conv.isFavorite && <span className="favorite-star"><Star size={14} style={{ color: '#f59e0b', fill: '#f59e0b' }} /></span>}
                    </div>
                    <p className="conv-preview">{conv.lastMessagePreview}</p>
                  </div>

                  {/* Status & Unread */}
                  <div className="conv-status">
                    <span
                      className="status-dot"
                      style={{ backgroundColor: STATUS_CONFIG[conv.status].color }}
                      title={STATUS_CONFIG[conv.status].label}
                    ></span>
                    {conv.unreadCount > 0 && (
                      <span className="unread-count">{conv.unreadCount}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Chat Panel */}
        <main className={`chat-panel ${!selectedId ? 'no-selection' : ''}`}>
          {!selectedId ? (
            /* No Selection State */
            <div className="no-selection-state">
              <div className="no-selection-content">
                <span className="no-selection-icon"><MessageCircle size={48} /></span>
                <h2>Select a conversation</h2>
                <p>Choose a supplier from the list to view messages and negotiate</p>
              </div>
            </div>
          ) : selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                {isMobileView && (
                  <button className="back-btn" onClick={handleBack}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                )}

                <div className="chat-supplier-info">
                  <div className="chat-avatar">
                    {selectedConversation.supplierName.charAt(0)}
                    {selectedConversation.supplierVerified && <span className="verified-badge">✓</span>}
                  </div>
                  <div className="chat-details">
                    <h2>{selectedConversation.supplierName}</h2>
                    <div className="chat-meta">
                      {selectedConversation.supplierVerified && <span className="verified-tag">✓ Verified</span>}
                      <span>{getCountryFlag(selectedConversation.supplierCountry)} {selectedConversation.supplierCountry}</span>
                      {selectedConversation.supplierRating && (
                        <span><Star size={14} style={{ color: '#f59e0b', fill: '#f59e0b', display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> {selectedConversation.supplierRating}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="chat-actions">
                  <button
                    className={`action-btn ${selectedConversation.isFavorite ? 'active' : ''}`}
                    onClick={() => handleToggleFavorite(selectedConversation.id)}
                    title={selectedConversation.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Star size={16} style={selectedConversation.isFavorite ? { color: '#f59e0b', fill: '#f59e0b' } : { color: '#4b5563' }} />
                  </button>
                  <button
                    className="action-btn rfq-btn"
                    onClick={() => setShowRFQModal(true)}
                    title="Send RFQ"
                  >
                    RFQ
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => handleArchive(selectedConversation.id)}
                    title="Archive conversation"
                  >
                    <FolderOpen size={14} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="messages-area">
                {groupMessagesByDate(selectedConversation.messages).map((group, groupIdx) => (
                  <div key={groupIdx} className="message-group">
                    {/* Date separator */}
                    <div className="date-separator">
                      <span>{formatDateSeparator(group.date)}</span>
                    </div>

                    {/* Messages */}
                    {group.messages.map(msg => (
                      <div
                        key={msg.id}
                        className={`message ${msg.sender === 'user' ? 'sent' : msg.sender === 'supplier' ? 'received' : 'system'}`}
                      >
                        {msg.type === 'system' ? (
                          <div className="system-message">{msg.content}</div>
                        ) : msg.type === 'rfq' && msg.rfqData ? (
                          <div className="rfq-card">
                            <div className="rfq-header">REQUEST FOR QUOTE</div>
                            <div className="rfq-content">
                              <div className="rfq-row">
                                <span className="rfq-label">Product:</span>
                                <span className="rfq-value">{msg.rfqData.productName}</span>
                              </div>
                              <div className="rfq-row">
                                <span className="rfq-label">Quantity:</span>
                                <span className="rfq-value">{msg.rfqData.quantity} {msg.rfqData.unit}</span>
                              </div>
                              {msg.rfqData.targetPrice && (
                                <div className="rfq-row">
                                  <span className="rfq-label">Target Price:</span>
                                  <span className="rfq-value">{msg.rfqData.targetPrice}</span>
                                </div>
                              )}
                              {msg.rfqData.specifications && (
                                <div className="rfq-row">
                                  <span className="rfq-label">Specs:</span>
                                  <span className="rfq-value">{msg.rfqData.specifications}</span>
                                </div>
                              )}
                              {msg.rfqData.deliveryDate && (
                                <div className="rfq-row">
                                  <span className="rfq-label">Delivery:</span>
                                  <span className="rfq-value">{msg.rfqData.deliveryDate}</span>
                                </div>
                              )}
                            </div>
                            <div className="rfq-footer">
                              Sent: {new Date(msg.sentAt).toLocaleString()}
                            </div>
                          </div>
                        ) : msg.type === 'quote' && msg.quoteData ? (
                          <div className="quote-card">
                            <div className="quote-header">
                              <span>QUOTE RECEIVED</span>
                              <span className="competitive-tag"><CheckCircle size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Competitive</span>
                            </div>
                            <div className="quote-content">
                              <div className="quote-price">
                                <span className="price-value">${msg.quoteData.unitPrice.toFixed(2)}</span>
                                <span className="price-label">per unit</span>
                              </div>
                              <div className="quote-details">
                                <div className="quote-row">
                                  <span>MOQ:</span>
                                  <span>{msg.quoteData.moq.toLocaleString()} units</span>
                                </div>
                                <div className="quote-row">
                                  <span>Lead Time:</span>
                                  <span>{msg.quoteData.leadTime} days</span>
                                </div>
                                <div className="quote-row">
                                  <span>Valid Until:</span>
                                  <span>{new Date(msg.quoteData.validUntil).toLocaleDateString()}</span>
                                </div>
                              </div>
                              {msg.quoteData.notes && (
                                <p className="quote-notes">{msg.quoteData.notes}</p>
                              )}
                            </div>
                            <div className="quote-actions">
                              <button className="quote-btn accept">Accept Quote</button>
                              <button className="quote-btn counter">Counter Offer</button>
                              <button className="quote-btn decline">Decline</button>
                            </div>
                          </div>
                        ) : (
                          <div className="message-bubble">
                            <p>{msg.content}</p>
                            <span className="message-time">{formatFullTime(msg.sentAt)}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="message-input-area">
                <button className="attach-btn" title="Attach file">
                  <Paperclip size={18} />
                </button>
                <textarea
                  ref={messageInputRef}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  rows={1}
                />
                <button
                  className="send-btn"
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13"></path>
                    <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
                  </svg>
                </button>
              </div>
            </>
          ) : null}
        </main>
      </div>

      {/* RFQ Modal */}
      {showRFQModal && selectedConversation && (
        <div className="modal-overlay" onClick={() => setShowRFQModal(false)}>
          <div className="modal rfq-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowRFQModal(false)}>✕</button>
            <h2>Send Request for Quote</h2>
            <p className="modal-subtitle">To: {selectedConversation.supplierName}</p>

            <form onSubmit={(e) => { e.preventDefault(); handleSendRFQ(); }}>
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  value={rfqForm.productName}
                  onChange={(e) => setRfqForm({ ...rfqForm, productName: e.target.value })}
                  placeholder="e.g., LED Bulb 9W Cool White"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="text"
                    value={rfqForm.quantity}
                    onChange={(e) => setRfqForm({ ...rfqForm, quantity: e.target.value })}
                    placeholder="e.g., 10000"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Unit</label>
                  <select
                    value={rfqForm.unit}
                    onChange={(e) => setRfqForm({ ...rfqForm, unit: e.target.value })}
                  >
                    <option value="pieces">Pieces</option>
                    <option value="kg">KG</option>
                    <option value="boxes">Boxes</option>
                    <option value="meters">Meters</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Target Price (per unit)</label>
                <input
                  type="text"
                  value={rfqForm.targetPrice}
                  onChange={(e) => setRfqForm({ ...rfqForm, targetPrice: e.target.value })}
                  placeholder="e.g., $2.00"
                />
              </div>

              <div className="form-group">
                <label>Specifications</label>
                <textarea
                  value={rfqForm.specifications}
                  onChange={(e) => setRfqForm({ ...rfqForm, specifications: e.target.value })}
                  placeholder="Product specifications, certifications needed..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Delivery Timeline</label>
                <input
                  type="text"
                  value={rfqForm.deliveryDate}
                  onChange={(e) => setRfqForm({ ...rfqForm, deliveryDate: e.target.value })}
                  placeholder="e.g., Within 30 days"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowRFQModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Send RFQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Main Container */
        .inbox-container {
          display: flex;
          height: calc(100vh - 100px);
          background: var(--bg-primary);
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--border-color);
        }

        /* Conversation List Panel */
        .conversation-list-panel {
          width: 380px;
          flex-shrink: 0;
          background: var(--card-bg);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
        }

        .list-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 20px 14px;
        }

        .list-header h1 {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .unread-badge {
          background: #f97316;
          color: white;
          padding: 3px 9px;
          border-radius: 10px;
          font-size: 0.75rem;
          font-weight: 600;
          min-width: 20px;
          text-align: center;
        }

        .search-box {
          position: relative;
          padding: 0 16px;
          margin-bottom: 10px;
        }

        .search-box svg {
          position: absolute;
          left: 28px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          color: var(--text-muted);
        }

        .search-box input {
          width: 100%;
          padding: 9px 12px 9px 38px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 0.85rem;
        }

        .search-box input:focus {
          outline: none;
          border-color: #f97316;
        }

        /* Filter Tabs */
        .filter-tabs {
          display: flex;
          gap: 2px;
          padding: 6px 12px 10px;
          overflow-x: auto;
          border-bottom: 1px solid var(--border-color);
          scrollbar-width: none;
        }
        .filter-tabs::-webkit-scrollbar { display: none; }

        .filter-tab {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          border: 1px solid transparent;
          background: none;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .filter-tab:hover {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        .filter-tab.active {
          background: rgba(249, 115, 22, 0.1);
          border-color: rgba(249, 115, 22, 0.25);
          color: #f97316;
        }

        .tab-icon {
          display: flex;
          align-items: center;
        }

        .tab-count {
          background: var(--bg-tertiary, rgba(255,255,255,0.06));
          padding: 1px 6px;
          border-radius: 8px;
          font-size: 0.68rem;
          font-weight: 600;
        }

        .filter-tab.active .tab-count {
          background: rgba(249, 115, 22, 0.2);
        }

        /* Conversations List */
        .conversations-list {
          flex: 1;
          overflow-y: auto;
          padding: 6px 8px;
        }

        .empty-list {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          color: var(--text-muted);
          gap: 8px;
        }

        .empty-icon {
          opacity: 0.4;
        }

        .empty-list p {
          font-size: 0.85rem;
        }

        /* Conversation Card */
        .conversation-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.15s;
          margin-bottom: 2px;
          border: 1px solid transparent;
        }

        .conversation-card:hover {
          background: var(--bg-secondary);
        }

        .conversation-card.selected {
          background: rgba(249, 115, 22, 0.07);
          border-color: rgba(249, 115, 22, 0.2);
        }

        .conversation-card.unread {
          background: rgba(249, 115, 22, 0.03);
        }

        .conversation-card.unread .conv-name {
          color: var(--text-primary);
          font-weight: 700;
        }

        .conversation-card.unread .conv-preview {
          color: var(--text-secondary);
          font-weight: 500;
        }

        .conv-avatar {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
          position: relative;
        }

        .verified-badge {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 15px;
          height: 15px;
          background: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.55rem;
          color: white;
          border: 2px solid var(--card-bg);
        }

        .conv-info {
          flex: 1;
          min-width: 0;
        }

        .conv-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          margin-bottom: 1px;
        }

        .conv-name {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .conv-time {
          font-size: 0.7rem;
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .conv-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 3px;
        }

        .conv-location {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .favorite-star {
          display: flex;
          align-items: center;
        }

        .conv-preview {
          font-size: 0.8rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.3;
        }

        .conv-status {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .unread-count {
          background: #f97316;
          color: white;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 18px;
          text-align: center;
        }

        /* Chat Panel */
        .chat-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--bg-primary);
          min-width: 0;
        }

        .chat-panel.no-selection {
          background: var(--bg-secondary);
        }

        .no-selection-state {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .no-selection-content {
          text-align: center;
          color: var(--text-muted);
          max-width: 280px;
        }

        .no-selection-icon {
          display: flex;
          justify-content: center;
          margin-bottom: 16px;
          opacity: 0.3;
          color: var(--text-secondary);
        }

        .no-selection-content h2 {
          font-size: 1.15rem;
          color: var(--text-primary);
          margin-bottom: 6px;
          font-weight: 600;
        }

        .no-selection-content p {
          font-size: 0.85rem;
          line-height: 1.4;
        }

        /* Chat Header */
        .chat-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          background: var(--card-bg);
          border-bottom: 1px solid var(--border-color);
        }

        .back-btn {
          display: none;
          width: 34px;
          height: 34px;
          align-items: center;
          justify-content: center;
          background: var(--bg-secondary);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          color: var(--text-primary);
        }

        .back-btn svg {
          width: 18px;
          height: 18px;
        }

        .chat-supplier-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 0;
        }

        .chat-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.05rem;
          font-weight: 700;
          color: white;
          position: relative;
          flex-shrink: 0;
        }

        .chat-details {
          min-width: 0;
        }

        .chat-details h2 {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .chat-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          color: var(--text-secondary);
        }

        .verified-tag {
          color: #10b981;
          font-weight: 500;
        }

        .chat-actions {
          display: flex;
          gap: 6px;
          flex-shrink: 0;
        }

        .action-btn {
          padding: 7px 10px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.82rem;
          color: var(--text-primary);
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-btn:hover {
          background: var(--bg-tertiary, rgba(255,255,255,0.08));
        }

        .action-btn.active {
          background: rgba(249, 115, 22, 0.1);
          border-color: rgba(249, 115, 22, 0.3);
        }

        .rfq-btn {
          background: rgba(249, 115, 22, 0.1);
          color: #f97316;
          border-color: rgba(249, 115, 22, 0.2);
          font-weight: 600;
          font-size: 0.78rem;
        }

        .rfq-btn:hover {
          background: rgba(249, 115, 22, 0.2);
        }

        /* Messages Area */
        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .message-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .date-separator {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 8px 0;
        }

        .date-separator span {
          background: var(--bg-secondary);
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        /* Messages */
        .message {
          display: flex;
          max-width: 75%;
        }

        .message.sent {
          margin-left: auto;
        }

        .message.received {
          margin-right: auto;
        }

        .message.system {
          max-width: 100%;
          justify-content: center;
        }

        .system-message {
          background: var(--bg-secondary);
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .message-bubble {
          padding: 12px 16px;
          border-radius: 16px;
          position: relative;
        }

        .message.sent .message-bubble {
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .message.received .message-bubble {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          border-bottom-left-radius: 4px;
        }

        .message-bubble p {
          margin: 0 0 4px;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .message-time {
          font-size: 0.7rem;
          opacity: 0.7;
        }

        /* RFQ Card */
        .rfq-card {
          background: var(--card-bg);
          border: 2px solid #3b82f6;
          border-radius: 12px;
          overflow: hidden;
          min-width: 280px;
        }

        .rfq-header {
          background: rgba(59, 130, 246, 0.1);
          padding: 10px 14px;
          font-weight: 600;
          color: #3b82f6;
          font-size: 0.85rem;
        }

        .rfq-content {
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .rfq-row {
          display: flex;
          gap: 8px;
          font-size: 0.85rem;
        }

        .rfq-label {
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .rfq-value {
          color: var(--text-primary);
          font-weight: 500;
        }

        .rfq-footer {
          padding: 8px 14px;
          background: var(--bg-secondary);
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        /* Quote Card */
        .quote-card {
          background: var(--card-bg);
          border: 2px solid #10b981;
          border-radius: 12px;
          overflow: hidden;
          min-width: 300px;
        }

        .quote-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(16, 185, 129, 0.1);
          padding: 10px 14px;
          font-weight: 600;
          color: #10b981;
          font-size: 0.85rem;
        }

        .competitive-tag {
          font-size: 0.75rem;
        }

        .quote-content {
          padding: 14px;
        }

        .quote-price {
          text-align: center;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-color);
        }

        .price-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: #10b981;
        }

        .price-label {
          display: block;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .quote-details {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.85rem;
        }

        .quote-row {
          display: flex;
          justify-content: space-between;
        }

        .quote-row span:first-child {
          color: var(--text-muted);
        }

        .quote-row span:last-child {
          color: var(--text-primary);
          font-weight: 500;
        }

        .quote-notes {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--border-color);
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .quote-actions {
          display: flex;
          gap: 8px;
          padding: 12px 14px;
          background: var(--bg-secondary);
        }

        .quote-btn {
          flex: 1;
          padding: 8px;
          border: none;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .quote-btn.accept {
          background: #10b981;
          color: white;
        }

        .quote-btn.counter {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .quote-btn.decline {
          background: transparent;
          color: var(--text-muted);
        }

        /* Message Input */
        .message-input-area {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          padding: 12px 16px;
          background: var(--card-bg);
          border-top: 1px solid var(--border-color);
        }

        .attach-btn {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .attach-btn:hover {
          background: var(--bg-tertiary, rgba(255,255,255,0.08));
          color: var(--text-primary);
        }

        .message-input-area textarea {
          flex: 1;
          padding: 10px 14px;
          border: 1px solid var(--border-color);
          border-radius: 10px;
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 0.88rem;
          resize: none;
          max-height: 100px;
          line-height: 1.4;
          font-family: inherit;
        }

        .message-input-area textarea:focus {
          outline: none;
          border-color: #f97316;
        }

        .send-btn {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f97316, #ea580c);
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .send-btn:hover:not(:disabled) {
          transform: scale(1.05);
        }

        .send-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .send-btn svg {
          width: 18px;
          height: 18px;
          color: white;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: var(--card-bg);
          border-radius: 16px;
          padding: 24px;
          width: 90%;
          max-width: 480px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }

        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-secondary);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          color: var(--text-muted);
          font-size: 1.1rem;
        }

        .modal h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .modal-subtitle {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-secondary);
          margin-bottom: 6px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 0.9rem;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #f97316;
        }

        .form-row {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 12px;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .btn-cancel,
        .btn-submit {
          flex: 1;
          padding: 12px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-cancel {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
        }

        .btn-submit {
          background: linear-gradient(135deg, #f97316, #ea580c);
          border: none;
          color: white;
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .conversation-list-panel {
            width: 320px;
          }

          .chat-actions {
            gap: 4px;
          }

          .action-btn {
            padding: 6px 8px;
            font-size: 0.78rem;
          }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .inbox-container {
            height: calc(100vh - 130px);
            border-radius: 10px;
            position: relative;
          }

          .conversation-list-panel {
            width: 100%;
          }

          .conversation-list-panel.hidden {
            display: none;
          }

          .inbox-container.chat-open .chat-panel {
            display: flex;
          }

          .chat-panel {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10;
          }

          .chat-panel.no-selection {
            display: none;
          }

          .back-btn {
            display: flex;
          }

          .list-header {
            padding: 14px 16px 10px;
          }

          .list-header h1 {
            font-size: 1.15rem;
          }

          .search-box {
            padding: 0 12px;
            margin-bottom: 8px;
          }

          .filter-tabs {
            padding: 4px 10px 8px;
            gap: 2px;
          }

          .filter-tab {
            padding: 5px 10px;
            font-size: 0.75rem;
          }

          .conversations-list {
            padding: 4px 6px;
          }

          .conversation-card {
            padding: 10px 8px;
            gap: 10px;
          }

          .conv-avatar {
            width: 40px;
            height: 40px;
            font-size: 1rem;
            border-radius: 8px;
          }

          .conv-name {
            font-size: 0.85rem;
          }

          .conv-preview {
            font-size: 0.78rem;
          }

          .chat-header {
            padding: 12px 14px;
            gap: 10px;
          }

          .chat-avatar {
            width: 36px;
            height: 36px;
            font-size: 0.95rem;
          }

          .chat-details h2 {
            font-size: 0.88rem;
          }

          .chat-meta {
            font-size: 0.72rem;
            gap: 6px;
          }

          .message {
            max-width: 85%;
          }

          .messages-area {
            padding: 14px 12px;
          }

          .message-bubble {
            padding: 10px 14px;
          }

          .message-bubble p {
            font-size: 0.85rem;
          }

          .message-input-area {
            padding: 10px 12px;
            gap: 8px;
          }

          .attach-btn {
            width: 36px;
            height: 36px;
          }

          .send-btn {
            width: 36px;
            height: 36px;
          }

          .rfq-card,
          .quote-card {
            min-width: 240px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .modal {
            padding: 20px 16px;
          }
        }

        @media (max-width: 480px) {
          .inbox-container {
            border-radius: 8px;
          }

          .conv-avatar {
            width: 36px;
            height: 36px;
            font-size: 0.9rem;
          }

          .conv-name {
            font-size: 0.82rem;
          }

          .conv-location {
            font-size: 0.7rem;
          }

          .conv-preview {
            font-size: 0.75rem;
          }

          .chat-actions {
            gap: 3px;
          }

          .action-btn {
            padding: 5px 7px;
            font-size: 0.75rem;
          }

          .quote-actions {
            flex-direction: column;
            gap: 6px;
          }
        }
      `}</style>
    </AppLayout>
  );
}
