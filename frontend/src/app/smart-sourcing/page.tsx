'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout';
import { HeroSearch, SearchFilters, SupplierCard, SupplierModal, ContactModal, ChatWindow, EmptyState } from '@/components/search';
import { Supplier, SearchResult, searchSuppliers, addToSearchHistory, getSupplierStats } from '@/lib/suppliers';

type ModalType = 'none' | 'supplier-detail' | 'contact' | 'chat';
type SourceTab = 'befach' | 'external';

// Mock external suppliers from Alibaba, Trade Data, etc.
const EXTERNAL_SUPPLIERS = [
  { id: 'EXT-001', name: 'Alibaba Supplier - Shenzhen LED Factory', source: 'Alibaba', rating: 4.5, products: ['LED Bulbs', 'LED Strips'], location: 'China', verified: false },
  { id: 'EXT-002', name: 'Global Trade - Vietnam Electronics', source: 'Trade Data', rating: 4.2, products: ['Capacitors', 'Resistors'], location: 'Vietnam', verified: false },
  { id: 'EXT-003', name: 'Made-in-China - Guangzhou Health Co.', source: 'Made-in-China', rating: 4.0, products: ['Vitamins', 'Supplements'], location: 'China', verified: false },
  { id: 'EXT-004', name: 'IndiaMART - Mumbai Nutraceuticals', source: 'IndiaMART', rating: 4.3, products: ['Protein Powder', 'Herbal Products'], location: 'India', verified: false },
  { id: 'EXT-005', name: 'Alibaba Supplier - Taiwan Tech Parts', source: 'Alibaba', rating: 4.7, products: ['PCB Boards', 'Semiconductors'], location: 'Taiwan', verified: false },
  { id: 'EXT-006', name: 'Trade Data - Korea Smart Devices', source: 'Trade Data', rating: 4.4, products: ['Smart Watches', 'Earbuds'], location: 'South Korea', verified: false },
];

export default function SmartSourcingPage() {
  const [activeTab, setActiveTab] = useState<SourceTab>('befach');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    countries: [] as string[],
    certifications: [] as string[],
    minRating: null as number | null,
    maxLeadTime: null as number | null,
    minMOQ: '',
    maxMOQ: '',
    minPrice: '',
    maxPrice: '',
    minResponseRate: '',
    verifiedOnly: false,
    premiumOnly: false,
    sampleAvailable: false,
    customization: false,
  });
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [externalResults, setExternalResults] = useState(EXTERNAL_SUPPLIERS);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>('none');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [stats, setStats] = useState({ total: 0, premium: 0, byCategory: [] as { id: string; name: string; count: number }[] });

  useEffect(() => {
    setStats(getSupplierStats());
  }, []);

  const handleSearch = (query: string, category: string | null) => {
    setSearchQuery(query);
    setSelectedCategory(category);
    setIsSearching(true);

    setTimeout(() => {
      // Search Befach partners
      const results = searchSuppliers({
        keyword: query,
        categories: category ? [category] : undefined,
        countries: filters.countries.length > 0 ? filters.countries : undefined,
        certifications: filters.certifications.length > 0 ? filters.certifications : undefined,
        minRating: filters.minRating || undefined,
        maxLeadTime: filters.maxLeadTime || undefined,
      });
      setSearchResults(results);

      // Filter external suppliers
      if (query) {
        const filtered = EXTERNAL_SUPPLIERS.filter(s =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.products.some(p => p.toLowerCase().includes(query.toLowerCase()))
        );
        setExternalResults(filtered);
      } else {
        setExternalResults(EXTERNAL_SUPPLIERS);
      }

      setHasSearched(true);
      setIsSearching(false);
      if (query) addToSearchHistory(query, results.length);
    }, 300);
  };

  const applyFilters = () => {
    handleSearch(searchQuery, selectedCategory);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      countries: [],
      certifications: [],
      minRating: null,
      maxLeadTime: null,
      minMOQ: '',
      maxMOQ: '',
      minPrice: '',
      maxPrice: '',
      minResponseRate: '',
      verifiedOnly: false,
      premiumOnly: false,
      sampleAvailable: false,
      customization: false,
    });
  };

  const openModal = (type: ModalType, supplier?: Supplier) => {
    if (supplier) setSelectedSupplier(supplier);
    setActiveModal(type);
  };

  return (
    <AppLayout searchPlaceholder="Search suppliers...">
      <HeroSearch
        onSearch={handleSearch}
        onToggleFilters={() => setShowFilters(!showFilters)}
        showFilters={showFilters}
        initialQuery={searchQuery}
        initialCategory={selectedCategory}
      />

      {showFilters && (
        <SearchFilters filters={filters} onFilterChange={setFilters} onClear={clearFilters} onApply={applyFilters} />
      )}

      {/* Source Tabs - Only show after search */}
      {hasSearched && (
        <div className="source-tabs">
          <button className={`source-tab ${activeTab === 'befach' ? 'active' : ''}`} onClick={() => setActiveTab('befach')}>
            Befach Partners <span className="tab-count">{searchResults.length}</span>
          </button>
          <button className={`source-tab ${activeTab === 'external' ? 'active' : ''}`} onClick={() => setActiveTab('external')}>
            External Sources <span className="tab-count">{externalResults.length}+</span>
          </button>
        </div>
      )}

      {/* Stats Bar - Only show before search */}
      {!hasSearched && (
        <div className="stats-bar">
          <div className="stat-item"><span className="stat-value">{stats.total}</span><span className="stat-label">Verified Suppliers</span></div>
          <div className="stat-item"><span className="stat-value">{stats.premium}</span><span className="stat-label">Premium Partners</span></div>
          {stats.byCategory.map(cat => (
            <div key={cat.id} className="stat-item"><span className="stat-value">{cat.count}</span><span className="stat-label">{cat.name}</span></div>
          ))}
        </div>
      )}

      {/* Befach Partners Tab */}
      {activeTab === 'befach' && hasSearched && (
        <section className="results-section">
          {isSearching ? (
            <div className="loading"><div className="spinner"></div><p>Searching suppliers...</p></div>
          ) : searchResults.length > 0 ? (
            <>
              <div className="results-header">
                <h2>Showing {searchResults.length} verified partners {searchQuery && `for "${searchQuery}"`}</h2>
                <select className="sort-select">
                  <option>Sort by: Relevance</option>
                  <option>Sort by: Rating</option>
                  <option>Sort by: Response Rate</option>
                </select>
              </div>
              <div className="supplier-grid">
                {searchResults.map(result => (
                  <SupplierCard
                    key={result.supplier.id}
                    result={result}
                    onView={(s) => openModal('supplier-detail', s)}
                    onContact={(s) => openModal('contact', s)}
                    onChat={(s) => openModal('chat', s)}
                  />
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              searchQuery={searchQuery}
              onSubmitRequirement={() => window.location.href = '/submit-requirement'}
              onInviteSupplier={() => window.location.href = '/invite-supplier'}
            />
          )}
        </section>
      )}

      {/* External Sources Tab */}
      {activeTab === 'external' && (
        <section className="results-section">
          <div className="external-notice">
            <span className="notice-icon">ℹ️</span>
            <p>These suppliers are aggregated from external sources. Contact details require verification through Befach.</p>
          </div>

          {hasSearched && externalResults.length === 0 ? (
            <div className="no-external">
              <p>No external suppliers found for &ldquo;{searchQuery}&rdquo;</p>
            </div>
          ) : (
            <div className="external-grid">
              {externalResults.map(supplier => (
                <div key={supplier.id} className="external-card">
                  <div className="external-header">
                    <div className="external-avatar">{supplier.name.charAt(0)}</div>
                    <div className="external-info">
                      <h3>{supplier.name}</h3>
                      <div className="external-meta">
                        <span className="source-badge">{supplier.source}</span>
                        <span className="location">📍 {supplier.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="external-body">
                    <div className="external-rating">{'★'.repeat(Math.floor(supplier.rating))}{'☆'.repeat(5 - Math.floor(supplier.rating))} {supplier.rating}</div>
                    <div className="external-products"><strong>Products:</strong> {supplier.products.join(', ')}</div>
                  </div>
                  <div className="external-actions">
                    <button className="btn-verify">Request Verification</button>
                    <button className="btn-view-ext">View on {supplier.source}</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="external-cta">
            <p>Want verified suppliers with direct contact?</p>
            <Link href="/submit-requirement" className="btn-submit-req">Share Your Requirement</Link>
          </div>
        </section>
      )}

      {/* Secondary Actions Bar - Redirect to pages */}
      {hasSearched && searchResults.length > 0 && activeTab === 'befach' && (
        <div className="secondary-bar">
          <span>Can&apos;t find what you need?</span>
          <Link href="/submit-requirement" className="bar-btn">Share Your Requirement</Link>
          <Link href="/invite-supplier" className="bar-btn">Invite Your Suppliers</Link>
        </div>
      )}

      {/* Modals */}
      {selectedSupplier && activeModal === 'supplier-detail' && (
        <SupplierModal supplier={selectedSupplier} isOpen={true} onClose={() => setActiveModal('none')} onContact={() => setActiveModal('contact')} onChat={() => setActiveModal('chat')} />
      )}
      {selectedSupplier && activeModal === 'contact' && (
        <ContactModal supplier={selectedSupplier} isOpen={true} onClose={() => setActiveModal('none')} searchQuery={searchQuery} />
      )}
      {selectedSupplier && activeModal === 'chat' && (
        <ChatWindow supplier={selectedSupplier} isOpen={true} onClose={() => setActiveModal('none')} />
      )}

      <style jsx>{`
        .source-tabs { display: flex; gap: 8px; margin-bottom: 24px; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 6px; width: fit-content; }
        .source-tab { display: flex; align-items: center; gap: 8px; padding: 12px 20px; background: transparent; border: none; border-radius: 8px; cursor: pointer; transition: all 0.2s; font-size: 0.95rem; font-weight: 500; color: var(--text-secondary); position: relative; }
        .source-tab:hover { color: var(--text-primary); background: var(--bg-secondary); }
        .source-tab.active { color: #f97316; background: rgba(249,115,22,0.1); }
        .source-tab.active::after { content: ''; position: absolute; bottom: 0; left: 12px; right: 12px; height: 2px; background: #f97316; border-radius: 2px; }
        .tab-count { background: var(--bg-secondary); padding: 2px 10px; border-radius: 12px; font-weight: 600; font-size: 0.85rem; }
        .source-tab.active .tab-count { background: #f97316; color: white; }

        .stats-bar { display: flex; gap: 24px; justify-content: center; padding: 20px; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; margin-bottom: 24px; flex-wrap: wrap; }
        .stat-item { text-align: center; padding: 0 20px; border-right: 1px solid var(--border-color); }
        .stat-item:last-child { border-right: none; }
        .stat-value { display: block; font-size: 1.5rem; font-weight: 700; color: #f97316; }
        .stat-label { font-size: 0.85rem; color: var(--text-secondary); }

        .results-section { margin-bottom: 100px; }
        .results-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .results-header h2 { font-size: 1.1rem; color: var(--text-primary); margin: 0; }
        .sort-select { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 8px 12px; color: var(--text-primary); }
        .supplier-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 20px; }
        .loading { text-align: center; padding: 60px; }
        .spinner { width: 40px; height: 40px; border: 3px solid var(--border-color); border-top-color: #f97316; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .external-notice { display: flex; gap: 12px; align-items: center; background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.2); padding: 14px 18px; border-radius: 10px; margin-bottom: 20px; }
        .notice-icon { font-size: 1.2rem; }
        .external-notice p { margin: 0; color: #60a5fa; font-size: 0.9rem; }

        .external-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 16px; }
        .external-card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 18px; }
        .external-header { display: flex; gap: 12px; margin-bottom: 12px; }
        .external-avatar { width: 44px; height: 44px; background: var(--bg-secondary); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 600; color: var(--text-muted); }
        .external-info h3 { margin: 0 0 6px; font-size: 0.95rem; color: var(--text-primary); }
        .external-meta { display: flex; gap: 10px; font-size: 0.8rem; }
        .source-badge { background: rgba(139,92,246,0.1); color: #8b5cf6; padding: 2px 8px; border-radius: 4px; font-weight: 500; }
        .location { color: var(--text-muted); }
        .external-body { padding: 12px 0; border-top: 1px solid var(--border-color); }
        .external-rating { color: #fbbf24; font-size: 0.85rem; margin-bottom: 8px; }
        .external-products { font-size: 0.85rem; color: var(--text-secondary); }
        .external-actions { display: flex; gap: 8px; margin-top: 12px; }
        .external-actions button { flex: 1; padding: 10px; border-radius: 8px; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; }
        .btn-verify { background: rgba(249,115,22,0.1); border: 1px solid rgba(249,115,22,0.3); color: #f97316; font-weight: 500; }
        .btn-verify:hover { background: #f97316; color: white; }
        .btn-view-ext { background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-secondary); }

        .external-cta { text-align: center; padding: 40px; background: var(--card-bg); border: 1px dashed var(--border-color); border-radius: 12px; margin-top: 24px; }
        .external-cta p { color: var(--text-secondary); margin: 0 0 16px; }
        .btn-submit-req { display: inline-block; background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 14px 28px; border-radius: 10px; font-weight: 600; text-decoration: none; }

        .no-external { text-align: center; padding: 40px; color: var(--text-muted); }

        .secondary-bar { position: fixed; bottom: 0; left: 0; right: 0; background: var(--card-bg); border-top: 1px solid var(--border-color); padding: 16px 24px; display: flex; justify-content: center; align-items: center; gap: 16px; z-index: 90; }
        .secondary-bar span { color: var(--text-secondary); }
        .bar-btn { background: rgba(249,115,22,0.1); border: 1px solid rgba(249,115,22,0.3); color: #fb923c; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 500; transition: all 0.2s; }
        .bar-btn:hover { background: rgba(249,115,22,0.2); }

        @media (max-width: 768px) {
          .source-tabs { width: 100%; }
          .source-tab { flex: 1; justify-content: center; padding: 10px 12px; font-size: 0.85rem; }
          .supplier-grid, .external-grid { grid-template-columns: 1fr; }
          .secondary-bar { flex-direction: column; gap: 10px; }
        }
      `}</style>
    </AppLayout>
  );
}
