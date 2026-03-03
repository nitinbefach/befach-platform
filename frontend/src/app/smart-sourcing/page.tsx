'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout';
import { useMobile } from '@/hooks/useMobile';
import { useFeedbackTrigger } from '@/hooks/useFeedbackTrigger';
import { useTour } from '@/hooks/useTour';
import { captureFeatureAction } from '@/lib/posthogEvents';
import { smartSourcingTourSteps, mobileSmartSourcingTourSteps } from '@/lib/tourSteps';
import TourFAB from '@/components/walkthrough/TourFAB';
import { HeroSearch, SearchFilters, SupplierCard, SupplierModal, ContactModal, ChatWindow, EmptyState } from '@/components/search';
import { Supplier, SearchResult, searchSuppliers, addToSearchHistory, getSupplierStats } from '@/lib/suppliers';
import { MapPin, Star, Info, HelpCircle, FileText, UserPlus, X } from 'lucide-react';

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

function SmartSourcingContent() {
  const { isMobile } = useMobile();
  const tourSteps = isMobile ? mobileSmartSourcingTourSteps : smartSourcingTourSteps;
  const { startTour, isActive: tourActive } = useTour({ tourId: 'smart-sourcing', steps: tourSteps });
  const { triggerFeedback, promptElement } = useFeedbackTrigger();
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
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const helpPopupRef = useRef<HTMLDivElement>(null);
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
      captureFeatureAction('smart_sourcing', 'searched', { query, resultCount: results.length });
      if (query) addToSearchHistory(query, results.length);
      triggerFeedback('supplier-search');
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
    <AppLayout searchPlaceholder="Search suppliers...">      <div id="sourcing-search"><HeroSearch
        onSearch={handleSearch}
        onToggleFilters={() => setShowFilters(!showFilters)}
        showFilters={showFilters}
        initialQuery={searchQuery}
        initialCategory={selectedCategory}
      /></div>

      {showFilters && (
        <SearchFilters filters={filters} onFilterChange={setFilters} onClear={clearFilters} onApply={applyFilters} />
      )}

      {/* Source Tabs - Only show after search */}
      {hasSearched && (
        <div id="sourcing-tabs" className="source-tabs">
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
        <div id="sourcing-stats" className="stats-bar">
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
            <span className="notice-icon"><Info size={14} /></span>
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
                        <span className="location"><MapPin size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 2 }} /> {supplier.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="external-body">
                    <div className="external-rating">{Array.from({ length: 5 }, (_, i) => (<Star key={i} size={12} style={i < Math.floor(supplier.rating) ? { color: '#f59e0b', fill: '#f59e0b' } : { color: '#4b5563' }} />))} {supplier.rating}</div>
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

      {/* Help FAB + Popup */}
      {hasSearched && searchResults.length > 0 && activeTab === 'befach' && (
        <div id="sourcing-help" className="help-fab-wrapper" ref={helpPopupRef}>
          {showHelpPopup && (
            <div className="help-popup">
              <div className="help-popup-header">
                <span>Can&apos;t find what you need?</span>
                <button className="help-popup-close" onClick={() => setShowHelpPopup(false)}><X size={16} /></button>
              </div>
              <Link href="/submit-requirement" className="help-popup-item" onClick={() => setShowHelpPopup(false)}>
                <div className="help-popup-icon req"><FileText size={18} /></div>
                <div>
                  <div className="help-popup-title">Share Your Requirement</div>
                  <div className="help-popup-desc">Let us find suppliers for you</div>
                </div>
              </Link>
              <Link href="/invite-supplier" className="help-popup-item" onClick={() => setShowHelpPopup(false)}>
                <div className="help-popup-icon invite"><UserPlus size={18} /></div>
                <div>
                  <div className="help-popup-title">Invite Your Suppliers</div>
                  <div className="help-popup-desc">Bring your existing suppliers to Befach</div>
                </div>
              </Link>
            </div>
          )}
          <button className="help-fab" onClick={() => setShowHelpPopup(!showHelpPopup)}>
            {showHelpPopup ? <X size={22} /> : <HelpCircle size={22} />}
          </button>
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
        .supplier-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 18px; }
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

        .help-fab-wrapper { position: fixed; bottom: 24px; right: 24px; z-index: 90; display: flex; flex-direction: column; align-items: flex-end; }
        .help-fab { width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, #f97316, #ea580c); color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(249,115,22,0.4); transition: all 0.2s; }
        .help-fab:hover { transform: scale(1.08); box-shadow: 0 6px 24px rgba(249,115,22,0.5); }
        .help-popup { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 16px; padding: 16px; margin-bottom: 12px; width: 280px; box-shadow: 0 12px 40px rgba(0,0,0,0.3); animation: popupSlideUp 0.2s ease-out; }
        @keyframes popupSlideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .help-popup-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--border-color); }
        .help-popup-header span { font-weight: 600; font-size: 0.9rem; color: var(--text-primary); }
        .help-popup-close { background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 2px; }
        .help-popup-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 10px; text-decoration: none; color: var(--text-primary); transition: background 0.2s; }
        .help-popup-item:hover { background: var(--bg-hover, rgba(255,255,255,0.05)); }
        .help-popup-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .help-popup-icon.req { background: rgba(249,115,22,0.12); color: #f97316; }
        .help-popup-icon.invite { background: rgba(59,130,246,0.12); color: #60a5fa; }
        .help-popup-title { font-weight: 600; font-size: 0.9rem; }
        .help-popup-desc { font-size: 0.78rem; color: var(--text-muted); margin-top: 2px; }

        @media (max-width: 768px) {
          .source-tabs { width: 100%; }
          .source-tab { flex: 1; justify-content: center; padding: 10px 12px; font-size: 0.85rem; }
          .stats-bar { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; padding: 16px; margin-bottom: 16px; }
          .stat-item { border-right: none; padding: 12px; background: rgba(249,115,22,0.04); border-radius: 8px; }
          .stat-value { font-size: 1.25rem; }
          .stat-label { font-size: 0.8rem; }
          .supplier-grid, .external-grid { grid-template-columns: 1fr; }
          .results-header { flex-direction: column; gap: 10px; align-items: flex-start; }
          .sort-select { width: 100%; }
          .external-card { padding: 14px; }
          .external-cta { padding: 24px 16px; }
          .help-fab-wrapper { bottom: 72px; right: 16px; }
          .help-popup { width: 260px; }
        }

        @media (max-width: 480px) {
          .stats-bar { grid-template-columns: repeat(2, 1fr); gap: 8px; padding: 12px; }
          .stat-item { padding: 10px; }
          .stat-value { font-size: 1.1rem; }
          .stat-label { font-size: 0.75rem; }
          .source-tabs { border-radius: 8px; padding: 4px; }
          .source-tab { padding: 8px 10px; font-size: 0.8rem; }
          .tab-count { padding: 2px 8px; font-size: 0.75rem; }
          .external-actions { flex-direction: column; }
          .external-actions button { padding: 8px; font-size: 0.8rem; }
        }
      `}</style>
      {!tourActive && <TourFAB onStart={startTour} />}
      {promptElement}
    </AppLayout>
  );
}

export default function SmartSourcingPage() {
  return (
    <Suspense fallback={null}>
      <SmartSourcingContent />
    </Suspense>
  );
}
