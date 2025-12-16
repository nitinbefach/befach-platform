'use client';

import { useState } from 'react';

// ============================================
// MOCK DATA - 100 Befach Partner Suppliers
// ============================================

const CATEGORIES = [
  { id: 'electronics', name: 'Electronics', icon: '🔌' },
  { id: 'health-supplements', name: 'Health Supplements', icon: '💊' },
  { id: 'consumer-electronics', name: 'Consumer Electronics', icon: '📱' },
];

const MOCK_SUPPLIERS = [
  {
    id: 'SUP-001',
    name: 'Shenzhen Apex Electronics Co.',
    location: { country: 'China', city: 'Shenzhen' },
    category: 'Electronics',
    rating: 4.8,
    reviews: 156,
    responseRate: 98,
    verified: true,
    products: ['LED Bulbs', 'LED Panels', 'LED Drivers', 'Power Supplies'],
    certifications: ['ISO 9001', 'CE', 'RoHS'],
    moq: 1000,
    leadTime: '14-21 days',
    description: 'Leading manufacturer of LED lighting solutions with 15+ years experience.',
  },
  {
    id: 'SUP-002',
    name: 'NutraVita Health Industries',
    location: { country: 'India', city: 'Mumbai' },
    category: 'Health Supplements',
    rating: 4.6,
    reviews: 89,
    responseRate: 95,
    verified: true,
    products: ['Vitamin D3', 'Omega-3 Fish Oil', 'Protein Powder', 'Multivitamins'],
    certifications: ['FDA', 'GMP', 'ISO 22000'],
    moq: 500,
    leadTime: '21-30 days',
    description: 'Premium nutraceutical manufacturer with WHO-GMP certified facilities.',
  },
  {
    id: 'SUP-003',
    name: 'Guangzhou Smart Tech Ltd.',
    location: { country: 'China', city: 'Guangzhou' },
    category: 'Consumer Electronics',
    rating: 4.7,
    reviews: 203,
    responseRate: 92,
    verified: true,
    products: ['Smart Watches', 'TWS Earbuds', 'Power Banks', 'Phone Accessories'],
    certifications: ['CE', 'FCC', 'RoHS'],
    moq: 200,
    leadTime: '10-15 days',
    description: 'Innovative consumer electronics manufacturer specializing in wearables.',
  },
  {
    id: 'SUP-004',
    name: 'Taiwan Precision Components',
    location: { country: 'Taiwan', city: 'Taipei' },
    category: 'Electronics',
    rating: 4.9,
    reviews: 312,
    responseRate: 99,
    verified: true,
    products: ['Semiconductors', 'PCB Boards', 'Capacitors', 'Resistors'],
    certifications: ['ISO 9001', 'IATF 16949', 'ISO 14001'],
    moq: 5000,
    leadTime: '21-28 days',
    description: 'High-precision electronic components for industrial applications.',
  },
  {
    id: 'SUP-005',
    name: 'Herbal Wellness Korea',
    location: { country: 'South Korea', city: 'Seoul' },
    category: 'Health Supplements',
    rating: 4.5,
    reviews: 67,
    responseRate: 88,
    verified: true,
    products: ['Korean Ginseng', 'Collagen Peptides', 'Green Tea Extract', 'Probiotics'],
    certifications: ['KFDA', 'GMP', 'Halal'],
    moq: 300,
    leadTime: '14-21 days',
    description: 'Premium Korean health supplements with traditional herbal formulations.',
  },
  {
    id: 'SUP-006',
    name: 'Vietnam Audio Systems',
    location: { country: 'Vietnam', city: 'Ho Chi Minh' },
    category: 'Consumer Electronics',
    rating: 4.4,
    reviews: 98,
    responseRate: 90,
    verified: true,
    products: ['Bluetooth Speakers', 'Soundbars', 'Home Theater Systems', 'Microphones'],
    certifications: ['CE', 'FCC', 'ISO 9001'],
    moq: 100,
    leadTime: '12-18 days',
    description: 'Quality audio equipment manufacturer with competitive pricing.',
  },
];

type Supplier = typeof MOCK_SUPPLIERS[0];
type ModalType = 'none' | 'supplier-detail' | 'contact' | 'chat' | 'submit-requirement' | 'invite-supplier';

export default function MockupSupplierSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState<Supplier[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>('none');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [chatMessages, setChatMessages] = useState<{ from: string; text: string; time: string }[]>([]);
  const [chatInput, setChatInput] = useState('');

  // Search function
  const handleSearch = () => {
    if (!searchQuery.trim() && !selectedCategory) {
      setSearchResults([]);
      setHasSearched(true);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = MOCK_SUPPLIERS.filter(supplier => {
      const matchesQuery = !query ||
        supplier.name.toLowerCase().includes(query) ||
        supplier.products.some(p => p.toLowerCase().includes(query)) ||
        supplier.category.toLowerCase().includes(query);

      const matchesCategory = !selectedCategory ||
        supplier.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory;

      return matchesQuery && matchesCategory;
    });

    setSearchResults(results);
    setHasSearched(true);
  };

  // Open modals
  const openSupplierDetail = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setActiveModal('supplier-detail');
  };

  const openContact = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setActiveModal('contact');
  };

  const openChat = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setChatMessages([
      { from: 'system', text: `Chat started with ${supplier.name}`, time: 'Just now' },
    ]);
    setActiveModal('chat');
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { from: 'user', text: chatInput, time: 'Just now' }]);
    setChatInput('');
    // Simulate supplier response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        from: 'supplier',
        text: 'Thank you for your message! Our team will review your inquiry and get back to you shortly.',
        time: 'Just now'
      }]);
    }, 1500);
  };

  return (
    <div className="mockup-page">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">🏭 BEFACH</div>
          <div className="header-badge">MOCKUP PREVIEW</div>
        </div>
      </header>

      {/* Hero Search Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find Your Perfect Supplier</h1>
          <p>Search our network of 100+ verified partner suppliers</p>

          <div className="search-box">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Describe what you're looking for... (e.g., LED bulbs, vitamins, smart watches)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="search-btn" onClick={handleSearch}>
                Search Now
              </button>
            </div>

            <button className="filters-toggle" onClick={() => setShowFilters(!showFilters)}>
              {showFilters ? '▲ Hide Filters' : '▼ Advanced Filters'}
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="filters-panel">
              <div className="filter-group">
                <label>Category</label>
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label>Location</label>
                <select>
                  <option>All Countries</option>
                  <option>🇨🇳 China</option>
                  <option>🇮🇳 India</option>
                  <option>🇹🇼 Taiwan</option>
                  <option>🇰🇷 South Korea</option>
                  <option>🇻🇳 Vietnam</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Min Rating</label>
                <select>
                  <option>Any</option>
                  <option>4+ Stars</option>
                  <option>4.5+ Stars</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Certifications</label>
                <select>
                  <option>Any</option>
                  <option>ISO 9001</option>
                  <option>CE</option>
                  <option>FDA</option>
                  <option>GMP</option>
                </select>
              </div>
            </div>
          )}

          {/* Popular Searches */}
          <div className="popular-searches">
            <span>Popular:</span>
            {['LED Lighting', 'Vitamins', 'Smart Watches', 'Protein Powder', 'Earbuds'].map(term => (
              <button key={term} onClick={() => { setSearchQuery(term); handleSearch(); }}>
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      {hasSearched && (
        <section className="results-section">
          <div className="results-content">
            {searchResults.length > 0 ? (
              <>
                <div className="results-header">
                  <h2>Showing {searchResults.length} suppliers {searchQuery && `for "${searchQuery}"`}</h2>
                  <div className="results-controls">
                    <select>
                      <option>Sort by: Relevance</option>
                      <option>Sort by: Rating</option>
                      <option>Sort by: Response Rate</option>
                    </select>
                  </div>
                </div>

                <div className="supplier-grid">
                  {searchResults.map(supplier => (
                    <div key={supplier.id} className="supplier-card">
                      <div className="card-header">
                        <div className="supplier-avatar">
                          {supplier.name.charAt(0)}
                        </div>
                        <div className="supplier-info">
                          <h3>{supplier.name}</h3>
                          <div className="supplier-rating">
                            {'★'.repeat(Math.floor(supplier.rating))}
                            {'☆'.repeat(5 - Math.floor(supplier.rating))}
                            <span>{supplier.rating} ({supplier.reviews} reviews)</span>
                          </div>
                          <div className="supplier-location">
                            📍 {supplier.location.city}, {supplier.location.country}
                          </div>
                        </div>
                        {supplier.verified && <span className="verified-badge">✓ Verified</span>}
                      </div>

                      <div className="card-body">
                        <div className="supplier-stats">
                          <span>✓ {supplier.responseRate}% Response</span>
                          <span>📦 MOQ: {supplier.moq}</span>
                          <span>🚚 {supplier.leadTime}</span>
                        </div>

                        <div className="supplier-products">
                          <strong>Products:</strong> {supplier.products.slice(0, 3).join(', ')}
                          {supplier.products.length > 3 && ` +${supplier.products.length - 3} more`}
                        </div>

                        <div className="supplier-certs">
                          {supplier.certifications.map(cert => (
                            <span key={cert} className="cert-badge">{cert}</span>
                          ))}
                        </div>
                      </div>

                      <div className="card-actions">
                        <button className="btn-view" onClick={() => openSupplierDetail(supplier)}>
                          👁 View
                        </button>
                        <button className="btn-contact" onClick={() => openContact(supplier)}>
                          ✉ Contact
                        </button>
                        <button className="btn-chat" onClick={() => openChat(supplier)}>
                          💬 Chat
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h2>No suppliers found for your search</h2>
                <p>We searched our database but couldn't find suppliers matching "{searchQuery || 'your criteria'}"</p>

                <div className="empty-cta">
                  <div className="cta-box primary">
                    <h3>💡 Let us find suppliers FOR you</h3>
                    <p>Submit your requirement and our team will identify and verify matching suppliers within 24-48 hours.</p>
                    <button className="btn-submit-req" onClick={() => setActiveModal('submit-requirement')}>
                      Submit Requirement →
                    </button>
                  </div>

                  <div className="cta-divider">OR</div>

                  <div className="cta-box secondary">
                    <p>Already have a supplier in mind?</p>
                    <button className="btn-invite" onClick={() => setActiveModal('invite-supplier')}>
                      Invite them to Befach
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Secondary Actions Bar - Always visible after search */}
      {hasSearched && searchResults.length > 0 && (
        <div className="secondary-actions-bar">
          <span>Can't find what you need?</span>
          <button onClick={() => setActiveModal('submit-requirement')}>Submit Requirement</button>
          <button onClick={() => setActiveModal('invite-supplier')}>Invite Your Suppliers</button>
        </div>
      )}

      {/* ============================================ */}
      {/* MODALS */}
      {/* ============================================ */}

      {/* Supplier Detail Modal */}
      {activeModal === 'supplier-detail' && selectedSupplier && (
        <div className="modal-backdrop" onClick={() => setActiveModal('none')}>
          <div className="modal-container large" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveModal('none')}>×</button>

            <div className="modal-header">
              <div className="supplier-avatar large">{selectedSupplier.name.charAt(0)}</div>
              <div>
                <h2>{selectedSupplier.name}</h2>
                <div className="supplier-rating">
                  {'★'.repeat(Math.floor(selectedSupplier.rating))} {selectedSupplier.rating} ({selectedSupplier.reviews} reviews)
                </div>
                <div>📍 {selectedSupplier.location.city}, {selectedSupplier.location.country}</div>
              </div>
              {selectedSupplier.verified && <span className="verified-badge large">✓ Verified Partner</span>}
            </div>

            <div className="modal-tabs">
              <button className="tab active">Overview</button>
              <button className="tab">Products & Pricing</button>
              <button className="tab">Reviews</button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h4>About</h4>
                <p>{selectedSupplier.description}</p>
              </div>

              <div className="detail-section">
                <h4>Key Metrics</h4>
                <div className="metrics-grid">
                  <div className="metric">
                    <span className="metric-value">{selectedSupplier.responseRate}%</span>
                    <span className="metric-label">Response Rate</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">{selectedSupplier.moq}</span>
                    <span className="metric-label">Min Order Qty</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">{selectedSupplier.leadTime}</span>
                    <span className="metric-label">Lead Time</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Products</h4>
                <div className="products-list">
                  {selectedSupplier.products.map(product => (
                    <span key={product} className="product-tag">{product}</span>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h4>Certifications</h4>
                <div className="certs-list">
                  {selectedSupplier.certifications.map(cert => (
                    <span key={cert} className="cert-badge large">{cert}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-contact" onClick={() => { setActiveModal('contact'); }}>
                ✉ Contact Supplier
              </button>
              <button className="btn-chat" onClick={() => { setActiveModal('chat'); }}>
                💬 Start Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {activeModal === 'contact' && selectedSupplier && (
        <div className="modal-backdrop" onClick={() => setActiveModal('none')}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveModal('none')}>×</button>

            <h2>Contact {selectedSupplier.name}</h2>

            <form className="contact-form" onSubmit={e => { e.preventDefault(); alert('Message sent! (Demo)'); setActiveModal('none'); }}>
              <div className="form-group">
                <label>Subject *</label>
                <select defaultValue="inquiry">
                  <option value="inquiry">Product Inquiry</option>
                  <option value="quote">Request Quote</option>
                  <option value="sample">Sample Request</option>
                </select>
              </div>

              <div className="form-group">
                <label>Product/Service *</label>
                <input type="text" defaultValue={searchQuery} placeholder="e.g., LED Bulbs 9W" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Quantity</label>
                  <input type="number" placeholder="e.g., 10000" />
                </div>
                <div className="form-group">
                  <label>Target Price</label>
                  <input type="text" placeholder="e.g., $2.50/unit" />
                </div>
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea rows={4} placeholder="Describe your requirements in detail..."></textarea>
              </div>

              <div className="form-checkbox">
                <input type="checkbox" id="also-submit" />
                <label htmlFor="also-submit">Also submit as requirement (get quotes from other suppliers)</label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setActiveModal('none')}>Cancel</button>
                <button type="submit" className="btn-primary">Send Message</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {activeModal === 'chat' && selectedSupplier && (
        <div className="modal-backdrop" onClick={() => setActiveModal('none')}>
          <div className="modal-container chat-modal" onClick={e => e.stopPropagation()}>
            <div className="chat-header">
              <div className="chat-supplier-info">
                <div className="supplier-avatar small">{selectedSupplier.name.charAt(0)}</div>
                <div>
                  <h3>{selectedSupplier.name}</h3>
                  <span className="online-status">● Online</span>
                </div>
              </div>
              <button className="modal-close" onClick={() => setActiveModal('none')}>×</button>
            </div>

            <div className="chat-messages">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`chat-message ${msg.from}`}>
                  <div className="message-content">{msg.text}</div>
                  <div className="message-time">{msg.time}</div>
                </div>
              ))}
            </div>

            <div className="chat-input-area">
              <input
                type="text"
                placeholder="Type your message..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendChatMessage()}
              />
              <button onClick={sendChatMessage}>Send</button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Requirement Modal */}
      {activeModal === 'submit-requirement' && (
        <div className="modal-backdrop" onClick={() => setActiveModal('none')}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveModal('none')}>×</button>

            <h2>Submit Requirement</h2>
            <p className="modal-subtitle">Let us find the perfect suppliers for you</p>

            <form className="requirement-form" onSubmit={e => { e.preventDefault(); alert('Requirement submitted! We\'ll notify you within 24-48 hours. (Demo)'); setActiveModal('none'); }}>
              <div className="form-group">
                <label>Product Name *</label>
                <input type="text" defaultValue={searchQuery} placeholder="e.g., LED Bulb 9W, Vitamin D3 Capsules" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select>
                    <option>Select category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>HSN Code</label>
                  <input type="text" placeholder="e.g., 8539.50" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Quantity *</label>
                  <input type="number" placeholder="e.g., 10000" />
                </div>
                <div className="form-group">
                  <label>Unit</label>
                  <select>
                    <option>Pieces</option>
                    <option>KG</option>
                    <option>MT</option>
                    <option>Boxes</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Target Price (per unit)</label>
                <input type="text" placeholder="e.g., $2.50" />
              </div>

              <div className="form-group">
                <label>Specifications</label>
                <textarea rows={3} placeholder="Describe your product specifications..."></textarea>
              </div>

              <div className="form-group">
                <label>Preferred Countries</label>
                <div className="country-chips">
                  {['China', 'India', 'Taiwan', 'South Korea', 'Vietnam'].map(country => (
                    <label key={country} className="chip">
                      <input type="checkbox" /> {country}
                    </label>
                  ))}
                </div>
              </div>

              <div className="info-box">
                <span>ℹ️</span>
                <span>Our team will find and verify matching suppliers within 24-48 hours.</span>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setActiveModal('none')}>Cancel</button>
                <button type="submit" className="btn-primary">Submit Requirement</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Supplier Modal */}
      {activeModal === 'invite-supplier' && (
        <div className="modal-backdrop" onClick={() => setActiveModal('none')}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveModal('none')}>×</button>

            <h2>Invite Supplier</h2>
            <p className="modal-subtitle">Bring your existing suppliers to Befach</p>

            <div className="invite-tabs">
              <button className="invite-tab active">Single Invite</button>
              <button className="invite-tab">Bulk Upload</button>
            </div>

            <form className="invite-form" onSubmit={e => { e.preventDefault(); alert('Invitation sent! (Demo)'); setActiveModal('none'); }}>
              <div className="form-group">
                <label>Company Name *</label>
                <input type="text" placeholder="e.g., ABC Manufacturing Co." />
              </div>

              <div className="form-group">
                <label>Contact Email *</label>
                <input type="email" placeholder="e.g., sales@company.com" />
              </div>

              <div className="form-group">
                <label>Contact Name</label>
                <input type="text" placeholder="e.g., John Smith" />
              </div>

              <div className="form-group">
                <label>Product Category</label>
                <select>
                  <option>Select category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Personal Message</label>
                <textarea rows={3} placeholder="Add a personal note to your invitation..."></textarea>
              </div>

              <div className="bulk-upload-info">
                <p>📁 Need to invite multiple suppliers?</p>
                <button type="button" className="btn-link">Download CSV Template</button>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setActiveModal('none')}>Cancel</button>
                <button type="submit" className="btn-primary">Send Invitation</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
        .mockup-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #e2e8f0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* Header */
        .header {
          background: rgba(15, 23, 42, 0.95);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 16px 24px;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 700;
          color: #f97316;
        }

        .header-badge {
          background: #f97316;
          color: white;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        /* Hero Section */
        .hero-section {
          padding: 60px 24px;
          text-align: center;
          background: linear-gradient(180deg, rgba(249, 115, 22, 0.1) 0%, transparent 100%);
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-content h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 12px;
          background: linear-gradient(135deg, #f97316, #fb923c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-content > p {
          color: #94a3b8;
          font-size: 1.1rem;
          margin: 0 0 32px;
        }

        /* Search Box */
        .search-box {
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 16px;
        }

        .search-input-wrapper {
          display: flex;
          gap: 12px;
          align-items: center;
          background: #0f172a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 4px 4px 4px 16px;
        }

        .search-icon {
          font-size: 1.25rem;
        }

        .search-input-wrapper input {
          flex: 1;
          background: none;
          border: none;
          color: #e2e8f0;
          font-size: 1rem;
          padding: 12px 0;
          outline: none;
        }

        .search-input-wrapper input::placeholder {
          color: #64748b;
        }

        .search-btn {
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .search-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
        }

        .filters-toggle {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          margin-top: 12px;
          font-size: 0.9rem;
        }

        .filters-toggle:hover {
          color: #f97316;
        }

        /* Filters Panel */
        .filters-panel {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .filter-group label {
          display: block;
          font-size: 0.8rem;
          color: #94a3b8;
          margin-bottom: 6px;
        }

        .filter-group select {
          width: 100%;
          background: #0f172a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 10px 12px;
          color: #e2e8f0;
          font-size: 0.9rem;
        }

        /* Popular Searches */
        .popular-searches {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .popular-searches span {
          color: #64748b;
          font-size: 0.9rem;
        }

        .popular-searches button {
          background: rgba(249, 115, 22, 0.1);
          border: 1px solid rgba(249, 115, 22, 0.3);
          color: #fb923c;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .popular-searches button:hover {
          background: rgba(249, 115, 22, 0.2);
        }

        /* Results Section */
        .results-section {
          padding: 40px 24px;
        }

        .results-content {
          max-width: 1400px;
          margin: 0 auto;
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .results-header h2 {
          font-size: 1.25rem;
          color: #e2e8f0;
          margin: 0;
        }

        .results-controls select {
          background: #1e293b;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 8px 12px;
          color: #e2e8f0;
        }

        /* Supplier Grid */
        .supplier-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 20px;
        }

        .supplier-card {
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 20px;
          transition: all 0.2s;
        }

        .supplier-card:hover {
          border-color: rgba(249, 115, 22, 0.5);
          transform: translateY(-2px);
        }

        .card-header {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          position: relative;
        }

        .supplier-avatar {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 700;
          color: white;
        }

        .supplier-avatar.large {
          width: 64px;
          height: 64px;
          font-size: 1.5rem;
        }

        .supplier-avatar.small {
          width: 40px;
          height: 40px;
          font-size: 1rem;
        }

        .supplier-info h3 {
          margin: 0 0 4px;
          font-size: 1.1rem;
          color: #f1f5f9;
        }

        .supplier-rating {
          color: #fbbf24;
          font-size: 0.85rem;
          margin-bottom: 2px;
        }

        .supplier-rating span {
          color: #94a3b8;
          margin-left: 6px;
        }

        .supplier-location {
          font-size: 0.85rem;
          color: #94a3b8;
        }

        .verified-badge {
          position: absolute;
          top: 0;
          right: 0;
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .verified-badge.large {
          position: static;
          padding: 6px 14px;
          font-size: 0.85rem;
        }

        .card-body {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .supplier-stats {
          display: flex;
          gap: 16px;
          font-size: 0.85rem;
          color: #94a3b8;
          margin-bottom: 12px;
        }

        .supplier-products {
          font-size: 0.9rem;
          color: #cbd5e1;
          margin-bottom: 12px;
        }

        .supplier-certs {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .cert-badge {
          background: rgba(59, 130, 246, 0.1);
          color: #60a5fa;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
        }

        .cert-badge.large {
          padding: 6px 12px;
          font-size: 0.85rem;
        }

        .card-actions {
          display: flex;
          gap: 8px;
          margin-top: 16px;
        }

        .card-actions button {
          flex: 1;
          padding: 10px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-view {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #e2e8f0;
        }

        .btn-view:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .btn-contact {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #60a5fa;
        }

        .btn-contact:hover {
          background: rgba(59, 130, 246, 0.2);
        }

        .btn-chat {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #22c55e;
        }

        .btn-chat:hover {
          background: rgba(34, 197, 94, 0.2);
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 20px;
        }

        .empty-state h2 {
          font-size: 1.5rem;
          margin: 0 0 12px;
        }

        .empty-state > p {
          color: #94a3b8;
          margin: 0 0 40px;
        }

        .empty-cta {
          max-width: 500px;
          margin: 0 auto;
        }

        .cta-box {
          background: rgba(30, 41, 59, 0.8);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 20px;
        }

        .cta-box.primary {
          border: 1px solid rgba(249, 115, 22, 0.3);
        }

        .cta-box h3 {
          color: #f97316;
          margin: 0 0 12px;
        }

        .cta-box p {
          color: #94a3b8;
          margin: 0 0 16px;
          font-size: 0.95rem;
        }

        .btn-submit-req {
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
          border: none;
          padding: 14px 28px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-submit-req:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4);
        }

        .cta-divider {
          color: #64748b;
          margin: 20px 0;
        }

        .cta-box.secondary {
          background: transparent;
          border: 1px dashed rgba(255, 255, 255, 0.2);
        }

        .btn-invite {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #e2e8f0;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-invite:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        /* Secondary Actions Bar */
        .secondary-actions-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 16px 24px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          z-index: 90;
        }

        .secondary-actions-bar span {
          color: #94a3b8;
        }

        .secondary-actions-bar button {
          background: rgba(249, 115, 22, 0.1);
          border: 1px solid rgba(249, 115, 22, 0.3);
          color: #fb923c;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .secondary-actions-bar button:hover {
          background: rgba(249, 115, 22, 0.2);
        }

        /* Modal Styles */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          padding: 20px;
          overflow-y: auto;
        }

        .modal-container {
          background: #1e293b;
          border-radius: 16px;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          padding: 24px;
        }

        .modal-container.large {
          max-width: 700px;
        }

        .modal-container.chat-modal {
          max-width: 450px;
          height: 600px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          padding: 0;
        }

        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 1.5rem;
          cursor: pointer;
          z-index: 10;
        }

        .modal-close:hover {
          color: #e2e8f0;
        }

        .modal-container h2 {
          margin: 0 0 8px;
          font-size: 1.3rem;
        }

        .modal-subtitle {
          color: #94a3b8;
          margin: 0 0 24px;
        }

        .modal-header {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          margin-bottom: 24px;
          position: relative;
        }

        .modal-tabs {
          display: flex;
          gap: 4px;
          margin-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .tab {
          padding: 12px 20px;
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
        }

        .tab.active {
          color: #f97316;
          border-bottom-color: #f97316;
        }

        .modal-body {
          margin-bottom: 24px;
        }

        .detail-section {
          margin-bottom: 24px;
        }

        .detail-section h4 {
          color: #94a3b8;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 0 12px;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .metric {
          background: rgba(255, 255, 255, 0.03);
          padding: 16px;
          border-radius: 10px;
          text-align: center;
        }

        .metric-value {
          display: block;
          font-size: 1.25rem;
          font-weight: 700;
          color: #f97316;
        }

        .metric-label {
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .products-list, .certs-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .product-tag {
          background: rgba(255, 255, 255, 0.05);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .modal-footer button {
          flex: 1;
          padding: 14px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
        }

        /* Form Styles */
        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          font-size: 0.9rem;
          color: #94a3b8;
          margin-bottom: 6px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 12px;
          color: #e2e8f0;
          font-size: 0.95rem;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #f97316;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-checkbox {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-bottom: 20px;
        }

        .form-checkbox label {
          font-size: 0.9rem;
          color: #94a3b8;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .btn-secondary {
          flex: 1;
          padding: 14px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: #e2e8f0;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-primary {
          flex: 1;
          padding: 14px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          border: none;
          border-radius: 10px;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }

        .country-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .chip {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.05);
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 0.9rem;
          cursor: pointer;
        }

        .info-box {
          display: flex;
          gap: 10px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          padding: 12px 14px;
          border-radius: 10px;
          font-size: 0.9rem;
          color: #60a5fa;
        }

        /* Invite Tabs */
        .invite-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
        }

        .invite-tab {
          flex: 1;
          padding: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #94a3b8;
          cursor: pointer;
        }

        .invite-tab.active {
          background: rgba(249, 115, 22, 0.1);
          border-color: rgba(249, 115, 22, 0.3);
          color: #fb923c;
        }

        .bulk-upload-info {
          background: rgba(255, 255, 255, 0.03);
          padding: 16px;
          border-radius: 10px;
          text-align: center;
          margin-top: 20px;
        }

        .bulk-upload-info p {
          margin: 0 0 8px;
          color: #94a3b8;
        }

        .btn-link {
          background: none;
          border: none;
          color: #f97316;
          cursor: pointer;
          text-decoration: underline;
        }

        /* Chat Modal Styles */
        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .chat-supplier-info {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .chat-supplier-info h3 {
          margin: 0;
          font-size: 1rem;
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
          background: rgba(255, 255, 255, 0.05);
          color: #94a3b8;
          font-size: 0.85rem;
          max-width: 100%;
          text-align: center;
        }

        .chat-message.user {
          align-self: flex-end;
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
        }

        .chat-message.supplier {
          align-self: flex-start;
          background: rgba(255, 255, 255, 0.1);
          color: #e2e8f0;
        }

        .message-content {
          font-size: 0.95rem;
        }

        .message-time {
          font-size: 0.75rem;
          opacity: 0.7;
          margin-top: 4px;
        }

        .chat-input-area {
          display: flex;
          gap: 10px;
          padding: 16px 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .chat-input-area input {
          flex: 1;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 12px 20px;
          color: #e2e8f0;
        }

        .chat-input-area button {
          background: linear-gradient(135deg, #f97316, #ea580c);
          border: none;
          color: white;
          padding: 12px 24px;
          border-radius: 24px;
          font-weight: 600;
          cursor: pointer;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-content h1 {
            font-size: 1.75rem;
          }

          .search-input-wrapper {
            flex-direction: column;
            padding: 12px;
          }

          .search-btn {
            width: 100%;
          }

          .filters-panel {
            grid-template-columns: repeat(2, 1fr);
          }

          .supplier-grid {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .secondary-actions-bar {
            flex-direction: column;
            gap: 12px;
          }

          .modal-container {
            margin: 10px;
            max-height: 95vh;
          }
        }
      `}</style>
    </div>
  );
}
