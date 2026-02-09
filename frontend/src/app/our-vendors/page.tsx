'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout';
import { useFeedbackTrigger } from '@/hooks/useFeedbackTrigger';
import { Modal } from '@/components/ui';
import {
  SavedSupplier,
  RelationshipStage,
  getSavedSuppliers,
  initializeDemoSuppliers,
  filterSuppliers,
  sortSuppliers,
  getPipelineStats,
  saveSupplier,
  updateSupplier,
  removeSupplier,
  addTag,
  removeTag,
  updateNotes,
  downloadCSV,
  getAllTags,
  getAllCategories,
  detectCategory,
  formatCurrency,
  formatDate,
  getRelativeTime,
  transitionSupplierStage,
  SUGGESTED_TAGS,
  RELATIONSHIP_STAGE_CONFIG,
  FilterOptions,
  SortOption,
  DEFAULT_FILTERS
} from '@/lib/savedSuppliers';
import { createConversation, getConversationBySupplier } from '@/lib/conversations';
import {
  RelationshipStageBadge,
  StageTransitionModal,
  SupplierPipelineStats,
  SupplierFilters
} from '@/components/suppliers';

export default function OurVendorsPage() {
  const router = useRouter();
  const { triggerFeedback, promptElement } = useFeedbackTrigger();
  const [suppliers, setSuppliers] = useState<SavedSupplier[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [addSupplierModal, setAddSupplierModal] = useState(false);
  const [rfqModal, setRfqModal] = useState<SavedSupplier | null>(null);
  const [editNotesModal, setEditNotesModal] = useState<SavedSupplier | null>(null);
  const [addTagModal, setAddTagModal] = useState<SavedSupplier | null>(null);
  const [confirmRemoveModal, setConfirmRemoveModal] = useState<SavedSupplier | null>(null);
  const [stageTransitionModal, setStageTransitionModal] = useState<SavedSupplier | null>(null);

  // Filters - using new FilterOptions
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  // Form states
  const [newSupplierForm, setNewSupplierForm] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    location: '',
    specialization: '',
    website: ''
  });
  const [editingNotes, setEditingNotes] = useState('');
  const [newTag, setNewTag] = useState('');
  const [rfqForm, setRfqForm] = useState({
    productName: '',
    quantity: '',
    unit: 'pieces',
    targetPrice: '',
    specifications: '',
    deliveryDate: ''
  });

  // Initialize data
  useEffect(() => {
    const data = initializeDemoSuppliers();
    setSuppliers(data);
    setIsLoading(false);
  }, []);

  // Computed values
  const filteredSuppliers = useMemo(() => {
    const filtered = filterSuppliers(suppliers, filters);
    return sortSuppliers(filtered, sortBy);
  }, [suppliers, filters, sortBy]);

  const pipelineStats = useMemo(() => getPipelineStats(suppliers), [suppliers]);
  const allTags = useMemo(() => getAllTags(suppliers), [suppliers]);
  const allCategories = useMemo(() => getAllCategories(suppliers), [suppliers]);

  // Handle stage click from pipeline stats
  const handleStageClick = (stage: RelationshipStage) => {
    const currentStages = filters.relationshipStages;
    const newStages = currentStages.includes(stage)
      ? currentStages.filter(s => s !== stage)
      : [...currentStages, stage];
    setFilters({ ...filters, relationshipStages: newStages });
  };

  // Handle stage transition
  const handleStageTransition = (supplierId: string, newStage: RelationshipStage, reason?: string) => {
    try {
      transitionSupplierStage(supplierId, newStage, reason);
      setSuppliers(getSavedSuppliers());
      triggerFeedback('vendor-management');
    } catch (error) {
      console.error('Failed to transition stage:', error);
    }
  };

  // Handlers
  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleMessage = (supplier: SavedSupplier) => {
    // Check if conversation exists
    const existingConversation = getConversationBySupplier(supplier.id);
    if (existingConversation) {
      router.push(`/supplier-matches?conversation=${existingConversation.id}`);
    } else {
      // Create new conversation
      const conversation = createConversation({
        supplierId: supplier.id,
        supplierName: supplier.name,
        supplierCountry: supplier.country,
        supplierCategory: supplier.category,
        supplierVerified: supplier.verified,
        supplierRating: supplier.rating,
        source: 'saved_suppliers' as any
      });
      router.push(`/supplier-matches?conversation=${conversation.id}`);
    }
  };

  const handleSendRFQ = (supplier: SavedSupplier) => {
    setRfqModal(supplier);
    setRfqForm({
      productName: '',
      quantity: '',
      unit: 'pieces',
      targetPrice: '',
      specifications: '',
      deliveryDate: ''
    });
  };

  const handleSubmitRFQ = () => {
    if (!rfqModal) return;

    // Get or create conversation
    let conversation = getConversationBySupplier(rfqModal.id);
    if (!conversation) {
      conversation = createConversation({
        supplierId: rfqModal.id,
        supplierName: rfqModal.name,
        supplierCountry: rfqModal.country,
        supplierCategory: rfqModal.category,
        supplierVerified: rfqModal.verified,
        supplierRating: rfqModal.rating,
        source: 'saved_suppliers' as any
      });
    }

    // Update last contacted
    updateSupplier(rfqModal.id, {
      lastContactedDate: new Date().toISOString()
    });
    setSuppliers(getSavedSuppliers());

    setRfqModal(null);
    triggerFeedback('vendor-management');
    router.push(`/supplier-matches?conversation=${conversation.id}&rfq=true`);
  };

  const handleAddSupplier = () => {
    const category = detectCategory(newSupplierForm.specialization);
    const now = new Date().toISOString();
    const newSupplier = saveSupplier({
      name: newSupplierForm.name,
      country: newSupplierForm.location.split(',').pop()?.trim() || 'Unknown',
      countryFlag: '🌍',
      location: newSupplierForm.location,
      category,
      specialization: newSupplierForm.specialization,
      verified: false,
      rating: 0,
      contactPerson: newSupplierForm.contactPerson,
      email: newSupplierForm.email,
      phone: newSupplierForm.phone,
      website: newSupplierForm.website,
      relationshipStage: 'contacted',
      stageChangedAt: now,
      stageHistory: [],
      source: 'manual',
      tags: ['New Supplier'],
      notes: '',
      priority: 'medium',
      communicationCount: 0,
      totalOrders: 0,
      totalOrderValue: 0,
      activeDeals: 0,
      completedDeals: 0,
      pendingQuotes: 0
    });

    setSuppliers(getSavedSuppliers());
    setAddSupplierModal(false);
    triggerFeedback('vendor-management');
    setNewSupplierForm({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      location: '',
      specialization: '',
      website: ''
    });
    setExpandedId(newSupplier.id);
  };

  const handleRemoveSupplier = () => {
    if (!confirmRemoveModal) return;
    removeSupplier(confirmRemoveModal.id);
    setSuppliers(getSavedSuppliers());
    setConfirmRemoveModal(null);
    if (expandedId === confirmRemoveModal.id) {
      setExpandedId(null);
    }
  };

  const handleSaveNotes = () => {
    if (!editNotesModal) return;
    updateNotes(editNotesModal.id, editingNotes);
    setSuppliers(getSavedSuppliers());
    setEditNotesModal(null);
  };

  const handleAddTag = (tag: string) => {
    if (!addTagModal || !tag.trim()) return;
    addTag(addTagModal.id, tag.trim());
    setSuppliers(getSavedSuppliers());
    setNewTag('');
  };

  const handleRemoveTag = (supplierId: string, tag: string) => {
    removeTag(supplierId, tag);
    setSuppliers(getSavedSuppliers());
  };

  const handleExport = () => {
    downloadCSV(filteredSuppliers, `saved-suppliers-${new Date().toISOString().split('T')[0]}.csv`);
  };

  if (isLoading) {
    return (
      <AppLayout searchPlaceholder="Search suppliers...">
        <div className="loading-state">Loading suppliers...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout searchPlaceholder="Search suppliers...">
      <div className="content-header">
        <h1>Our Vendors</h1>
      </div>

      {/* PIPELINE STATS */}
      <SupplierPipelineStats
        stats={pipelineStats}
        onStageClick={handleStageClick}
        activeStages={filters.relationshipStages}
      />

      {/* ACTIONS */}
      <div className="quick-actions">
        <div className="action-buttons">
          <button className="btn-white" onClick={() => setAddSupplierModal(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add New Supplier
          </button>
          <button className="btn-outline" onClick={() => router.push('/smart-sourcing')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            Find Suppliers
          </button>
          <button className="btn-outline" onClick={handleExport}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export List
          </button>
        </div>
      </div>

      {/* ADVANCED FILTERS */}
      <SupplierFilters
        filters={filters}
        onFiltersChange={setFilters}
        allTags={allTags}
        allCategories={allCategories}
      />

      {/* SORT & RESULTS */}
      <div className="sort-bar">
        <div className="results-count">
          {filteredSuppliers.length} of {suppliers.length}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="sort-select"
        >
          <option value="recent">Recently Saved</option>
          <option value="name">Name A-Z</option>
          <option value="rating">Highest Rated</option>
          <option value="orders">Most Orders</option>
          <option value="lastContacted">Last Contacted</option>
          <option value="orderValue">Order Value</option>
          <option value="stage">By Stage</option>
        </select>
      </div>

      {/* SUPPLIER TABLE */}
      <div className="suppliers-table">
        <div className="table-header">
          <div className="col-expand"></div>
          <div className="col-name">Supplier Name</div>
          <div className="col-location">Location</div>
          <div className="col-category">Category</div>
          <div className="col-rating">Rating</div>
          <div className="col-orders">Orders</div>
          <div className="col-status">Stage</div>
        </div>

        {filteredSuppliers.length === 0 ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <h3>No suppliers found</h3>
            <p>Try adjusting your filters or add a new supplier</p>
            <button onClick={() => setAddSupplierModal(true)}>Add Supplier</button>
          </div>
        ) : (
          filteredSuppliers.map(supplier => (
            <div key={supplier.id} className={`supplier-row ${expandedId === supplier.id ? 'expanded' : ''}`}>
              <div className="row-main" onClick={() => handleToggleExpand(supplier.id)}>
                <div className="col-expand">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={expandedId === supplier.id ? 'rotated' : ''}>
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
                <div className="col-name">
                  <strong>{supplier.name}</strong>
                  <span className="sub-info">
                    {supplier.verified && <span className="verified-badge">✓ Verified</span>}
                    {supplier.tags.length > 0 && <span className="tag-count">{supplier.tags.length} tags</span>}
                  </span>
                </div>
                <div className="col-location">
                  <span className="flag">{supplier.countryFlag}</span>
                  {supplier.location}
                </div>
                <div className="col-category">{supplier.category}</div>
                <div className="col-rating">
                  <span className="rating-star">⭐</span>
                  <strong>{supplier.rating > 0 ? supplier.rating : '—'}</strong>
                </div>
                <div className="col-orders">{supplier.totalOrders}</div>
                <div className="col-status">
                  <RelationshipStageBadge
                    stage={supplier.relationshipStage}
                    size="sm"
                    clickable
                    onClick={() => { setStageTransitionModal(supplier); }}
                  />
                </div>
              </div>

              {expandedId === supplier.id && (
                <div className="row-expanded">
                  <div className="expanded-grid">
                    {/* Contact Info */}
                    <div className="info-section">
                      <h4>📧 Contact Info</h4>
                      <div className="info-content">
                        {supplier.contactPerson && <p><strong>Contact:</strong> {supplier.contactPerson}</p>}
                        {supplier.email && <p><strong>Email:</strong> <a href={`mailto:${supplier.email}`}>{supplier.email}</a></p>}
                        {supplier.phone && <p><strong>Phone:</strong> {supplier.phone}</p>}
                        {supplier.website && <p><strong>Website:</strong> <a href={`https://${supplier.website}`} target="_blank" rel="noopener noreferrer">{supplier.website}</a></p>}
                        {!supplier.contactPerson && !supplier.email && !supplier.phone && (
                          <p className="no-data">No contact info available</p>
                        )}
                      </div>
                    </div>

                    {/* Statistics */}
                    <div className="info-section">
                      <h4>📊 Statistics</h4>
                      <div className="info-content">
                        <p><strong>Orders:</strong> {supplier.totalOrders}</p>
                        <p><strong>Total Value:</strong> {formatCurrency(supplier.totalOrderValue)}</p>
                        <p><strong>Last Order:</strong> {formatDate(supplier.lastOrderDate)}</p>
                        <p><strong>Last Contact:</strong> {getRelativeTime(supplier.lastContactedDate)}</p>
                        <p><strong>Source:</strong> <span className="source-badge">{supplier.source}</span></p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="info-section tags-section">
                      <h4>🏷️ Tags</h4>
                      <div className="tags-list">
                        {supplier.tags.map(tag => (
                          <span key={tag} className="tag">
                            {tag}
                            <button onClick={(e) => { e.stopPropagation(); handleRemoveTag(supplier.id, tag); }}>×</button>
                          </span>
                        ))}
                        <button className="add-tag-btn" onClick={(e) => { e.stopPropagation(); setAddTagModal(supplier); setNewTag(''); }}>
                          + Add Tag
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Specialization */}
                  <div className="specialization-row">
                    <strong>Specialization:</strong> {supplier.specialization}
                  </div>

                  {/* Notes */}
                  <div className="notes-section">
                    <div className="notes-header">
                      <h4>📝 Notes</h4>
                      <button onClick={(e) => { e.stopPropagation(); setEditNotesModal(supplier); setEditingNotes(supplier.notes || ''); }}>
                        Edit Notes
                      </button>
                    </div>
                    <p className="notes-content">
                      {supplier.notes || 'No notes yet. Click "Edit Notes" to add some.'}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="action-buttons-row">
                    <button className="btn-action message" onClick={(e) => { e.stopPropagation(); handleMessage(supplier); }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                      Message
                    </button>
                    <button className="btn-action rfq" onClick={(e) => { e.stopPropagation(); handleSendRFQ(supplier); }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                      Send RFQ
                    </button>
                    <button className="btn-action orders" onClick={(e) => { e.stopPropagation(); router.push('/my-orders'); }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                      View Orders
                    </button>
                    <button className="btn-action remove" onClick={(e) => { e.stopPropagation(); setConfirmRemoveModal(supplier); }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ADD SUPPLIER MODAL */}
      <Modal isOpen={addSupplierModal} onClose={() => setAddSupplierModal(false)} title="Add New Supplier">
        <p className="modal-desc">Add a supplier to your network</p>
        <form onSubmit={(e) => { e.preventDefault(); handleAddSupplier(); }}>
          <div className="form-group">
            <label>Supplier Name *</label>
            <input
              type="text"
              placeholder="Enter supplier company name"
              value={newSupplierForm.name}
              onChange={(e) => setNewSupplierForm({ ...newSupplierForm, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Contact Person</label>
            <input
              type="text"
              placeholder="Enter contact name"
              value={newSupplierForm.contactPerson}
              onChange={(e) => setNewSupplierForm({ ...newSupplierForm, contactPerson: e.target.value })}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="supplier@company.com"
                value={newSupplierForm.email}
                onChange={(e) => setNewSupplierForm({ ...newSupplierForm, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                placeholder="+1 234 567 8900"
                value={newSupplierForm.phone}
                onChange={(e) => setNewSupplierForm({ ...newSupplierForm, phone: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              placeholder="City, Country"
              value={newSupplierForm.location}
              onChange={(e) => setNewSupplierForm({ ...newSupplierForm, location: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Product Specialization *</label>
            <input
              type="text"
              placeholder="e.g., Electronics, LED Lights, Textiles"
              value={newSupplierForm.specialization}
              onChange={(e) => setNewSupplierForm({ ...newSupplierForm, specialization: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Website</label>
            <input
              type="text"
              placeholder="www.supplier.com"
              value={newSupplierForm.website}
              onChange={(e) => setNewSupplierForm({ ...newSupplierForm, website: e.target.value })}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={() => setAddSupplierModal(false)}>Cancel</button>
            <button type="submit" className="btn-submit">Add Supplier</button>
          </div>
        </form>
      </Modal>

      {/* RFQ MODAL */}
      <Modal isOpen={!!rfqModal} onClose={() => setRfqModal(null)} title={`Send RFQ to ${rfqModal?.name}`}>
        <p className="modal-desc">Request a quote from this supplier</p>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmitRFQ(); }}>
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              placeholder="e.g., LED Bulb 9W Cool White"
              value={rfqForm.productName}
              onChange={(e) => setRfqForm({ ...rfqForm, productName: e.target.value })}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Quantity *</label>
              <input
                type="text"
                placeholder="e.g., 10000"
                value={rfqForm.quantity}
                onChange={(e) => setRfqForm({ ...rfqForm, quantity: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Unit</label>
              <select value={rfqForm.unit} onChange={(e) => setRfqForm({ ...rfqForm, unit: e.target.value })}>
                <option value="pieces">Pieces</option>
                <option value="kg">KG</option>
                <option value="boxes">Boxes</option>
                <option value="cartons">Cartons</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Target Price</label>
              <input
                type="text"
                placeholder="e.g., $2.00/unit"
                value={rfqForm.targetPrice}
                onChange={(e) => setRfqForm({ ...rfqForm, targetPrice: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Delivery Date</label>
              <input
                type="date"
                value={rfqForm.deliveryDate}
                onChange={(e) => setRfqForm({ ...rfqForm, deliveryDate: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Specifications</label>
            <textarea
              rows={3}
              placeholder="Product specifications, requirements..."
              value={rfqForm.specifications}
              onChange={(e) => setRfqForm({ ...rfqForm, specifications: e.target.value })}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={() => setRfqModal(null)}>Cancel</button>
            <button type="submit" className="btn-submit">Send RFQ</button>
          </div>
        </form>
      </Modal>

      {/* EDIT NOTES MODAL */}
      <Modal isOpen={!!editNotesModal} onClose={() => setEditNotesModal(null)} title={`Notes for ${editNotesModal?.name}`}>
        <div className="form-group">
          <label>Your Notes</label>
          <textarea
            rows={5}
            placeholder="Add notes about this supplier..."
            value={editingNotes}
            onChange={(e) => setEditingNotes(e.target.value)}
          />
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={() => setEditNotesModal(null)}>Cancel</button>
          <button type="button" className="btn-submit" onClick={handleSaveNotes}>Save Notes</button>
        </div>
      </Modal>

      {/* ADD TAG MODAL */}
      <Modal isOpen={!!addTagModal} onClose={() => setAddTagModal(null)} title={`Add Tag to ${addTagModal?.name}`}>
        <div className="form-group">
          <label>Custom Tag</label>
          <input
            type="text"
            placeholder="Enter a custom tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(newTag); } }}
          />
        </div>
        <div className="suggested-tags">
          <label>Suggested Tags</label>
          <div className="tags-grid">
            {SUGGESTED_TAGS.filter(tag => !addTagModal?.tags.includes(tag)).slice(0, 8).map(tag => (
              <button key={tag} type="button" onClick={() => handleAddTag(tag)} className="suggested-tag">
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={() => setAddTagModal(null)}>Done</button>
        </div>
      </Modal>

      {/* CONFIRM REMOVE MODAL */}
      <Modal isOpen={!!confirmRemoveModal} onClose={() => setConfirmRemoveModal(null)} title="Remove Supplier">
        <div className="confirm-content">
          <p>Are you sure you want to remove <strong>{confirmRemoveModal?.name}</strong> from your saved suppliers?</p>
          <p className="warning">This will remove them from your list. Any existing conversations will be preserved in your Inbox.</p>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={() => setConfirmRemoveModal(null)}>Cancel</button>
          <button type="button" className="btn-remove" onClick={handleRemoveSupplier}>Remove Supplier</button>
        </div>
      </Modal>

      {/* STAGE TRANSITION MODAL */}
      <StageTransitionModal
        isOpen={!!stageTransitionModal}
        onClose={() => setStageTransitionModal(null)}
        supplier={stageTransitionModal}
        onTransition={handleStageTransition}
      />

      <style jsx>{`
        .loading-state {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 300px;
          color: var(--text-secondary);
        }

        .filter-bar {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          min-width: 200px;
          background: var(--bg-tertiary);
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }

        .search-box svg {
          width: 18px;
          height: 18px;
          color: var(--text-secondary);
        }

        .search-box input {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 0.95rem;
        }

        .search-box input:focus {
          outline: none;
        }

        .filter-dropdowns {
          display: flex;
          gap: 12px;
        }

        .filter-dropdowns select {
          padding: 10px 14px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 0.9rem;
          cursor: pointer;
        }

        .results-count {
          color: var(--text-secondary);
          font-size: 0.85rem;
        }

        .sort-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          padding: 0 4px;
        }

        .sort-select {
          padding: 8px 14px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 0.9rem;
          cursor: pointer;
        }

        .suppliers-table {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          overflow: hidden;
        }

        .table-header {
          display: grid;
          grid-template-columns: 40px 2fr 1.5fr 1fr 0.8fr 0.8fr 0.8fr;
          gap: 12px;
          padding: 14px 20px;
          background: var(--bg-tertiary);
          border-bottom: 1px solid var(--border-color);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .supplier-row {
          border-bottom: 1px solid var(--border-color);
        }

        .supplier-row:last-child {
          border-bottom: none;
        }

        .row-main {
          display: grid;
          grid-template-columns: 40px 2fr 1.5fr 1fr 0.8fr 0.8fr 0.8fr;
          gap: 12px;
          padding: 16px 20px;
          cursor: pointer;
          transition: background 0.2s;
          align-items: center;
        }

        .row-main:hover {
          background: var(--bg-tertiary);
        }

        .col-expand svg {
          width: 18px;
          height: 18px;
          color: var(--text-secondary);
          transition: transform 0.2s;
        }

        .col-expand svg.rotated {
          transform: rotate(90deg);
        }

        .col-name strong {
          display: block;
          color: var(--text-primary);
        }

        .sub-info {
          display: flex;
          gap: 8px;
          margin-top: 4px;
          font-size: 0.8rem;
        }

        .verified-badge {
          color: #10b981;
          font-weight: 500;
        }

        .tag-count {
          color: var(--text-secondary);
        }

        .col-location {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .flag {
          font-size: 1.1rem;
        }

        .col-category {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .col-rating {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .rating-star {
          font-size: 0.9rem;
        }

        .col-rating strong {
          color: #f59e0b;
        }

        .col-orders {
          color: var(--text-secondary);
        }

        .status-badge {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
          text-transform: capitalize;
        }

        .status-badge.active {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
        }

        .status-badge.pending {
          background: rgba(59, 130, 246, 0.15);
          color: #3b82f6;
        }

        .status-badge.inactive {
          background: rgba(156, 163, 175, 0.15);
          color: #9ca3af;
        }

        .status-badge.blocked {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
        }

        /* Expanded Row */
        .row-expanded {
          padding: 20px;
          background: var(--bg-tertiary);
          border-top: 1px solid var(--border-color);
        }

        .expanded-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 16px;
        }

        .info-section {
          background: var(--bg-secondary);
          padding: 16px;
          border-radius: 10px;
          border: 1px solid var(--border-color);
        }

        .info-section h4 {
          font-size: 0.9rem;
          color: var(--text-primary);
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border-color);
        }

        .info-content p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 6px;
        }

        .info-content p strong {
          color: var(--text-primary);
        }

        .info-content a {
          color: #f97316;
        }

        .no-data {
          font-style: italic;
          color: var(--text-muted) !important;
        }

        .source-badge {
          background: rgba(249, 115, 22, 0.15);
          color: #f97316;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          text-transform: capitalize;
        }

        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tag {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(249, 115, 22, 0.1);
          color: #f97316;
          padding: 6px 10px;
          border-radius: 16px;
          font-size: 0.8rem;
        }

        .tag button {
          background: none;
          border: none;
          color: #f97316;
          cursor: pointer;
          font-size: 1rem;
          padding: 0;
          line-height: 1;
        }

        .add-tag-btn {
          background: var(--bg-tertiary);
          border: 1px dashed var(--border-color);
          padding: 6px 10px;
          border-radius: 16px;
          font-size: 0.8rem;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .add-tag-btn:hover {
          border-color: #f97316;
          color: #f97316;
        }

        .specialization-row {
          background: var(--bg-secondary);
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 16px;
        }

        .specialization-row strong {
          color: var(--text-primary);
        }

        .notes-section {
          background: var(--bg-secondary);
          padding: 16px;
          border-radius: 10px;
          border: 1px solid var(--border-color);
          margin-bottom: 16px;
        }

        .notes-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .notes-header h4 {
          font-size: 0.9rem;
          color: var(--text-primary);
          margin: 0;
        }

        .notes-header button {
          background: none;
          border: none;
          color: #f97316;
          font-size: 0.85rem;
          cursor: pointer;
        }

        .notes-content {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        .action-buttons-row {
          display: flex;
          gap: 12px;
        }

        .btn-action {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-action svg {
          width: 16px;
          height: 16px;
        }

        .btn-action.message {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border: none;
          color: white;
        }

        .btn-action.rfq {
          background: linear-gradient(135deg, #f97316, #ea580c);
          border: none;
          color: white;
        }

        .btn-action.orders {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
        }

        .btn-action.remove {
          background: var(--bg-secondary);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
        }

        .btn-action.remove:hover {
          background: rgba(239, 68, 68, 0.1);
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-state svg {
          width: 60px;
          height: 60px;
          color: var(--text-secondary);
          margin-bottom: 16px;
        }

        .empty-state h3 {
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .empty-state p {
          color: var(--text-secondary);
          margin-bottom: 20px;
        }

        .empty-state button {
          background: linear-gradient(135deg, #f97316, #ea580c);
          border: none;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
        }

        /* Modal Styles */
        .modal-desc {
          color: var(--text-secondary);
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 6px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-primary);
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

        .modal-actions {
          display: flex;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
          margin-top: 20px;
        }

        .btn-cancel {
          flex: 1;
          padding: 12px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-secondary);
          font-weight: 500;
          cursor: pointer;
        }

        .btn-submit {
          flex: 1;
          padding: 12px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-remove {
          flex: 1;
          padding: 12px;
          background: #ef4444;
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }

        .suggested-tags {
          margin-top: 16px;
        }

        .suggested-tags label {
          display: block;
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 10px;
        }

        .tags-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .suggested-tag {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .suggested-tag:hover {
          border-color: #f97316;
          color: #f97316;
        }

        .confirm-content p {
          color: var(--text-secondary);
          margin-bottom: 12px;
        }

        .confirm-content .warning {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        /* Quick Actions Update */
        .quick-actions .action-buttons button,
        .quick-actions .action-buttons a {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .quick-actions .action-buttons svg {
          width: 16px;
          height: 16px;
        }

        /* Tablet Responsive */
        @media (max-width: 1024px) {
          .table-header,
          .row-main {
            grid-template-columns: 30px 1.5fr 1fr 0.8fr;
          }

          .col-category,
          .col-orders,
          .col-status {
            display: none;
          }

          .expanded-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        /* Mobile Responsive - Card Layout */
        @media (max-width: 768px) {
          .filter-bar {
            flex-direction: column;
            align-items: stretch;
          }

          .filter-dropdowns {
            flex-wrap: wrap;
          }

          .sort-bar {
            flex-direction: column;
            gap: 8px;
            align-items: stretch;
          }

          .results-count {
            text-align: left;
            font-size: 0.8rem;
          }

          .sort-select {
            width: 100%;
          }

          /* Hide desktop table header */
          .table-header {
            display: none;
          }

          /* Card-based supplier rows */
          .row-main {
            display: grid;
            grid-template-columns: 1fr auto;
            grid-template-rows: auto auto;
            gap: 6px 12px;
            padding: 14px 16px;
            align-items: center;
          }

          .col-expand {
            display: none;
          }

          .col-name {
            grid-column: 1;
            grid-row: 1;
          }

          .col-name strong {
            font-size: 0.9rem;
          }

          .sub-info {
            margin-top: 2px;
            font-size: 0.75rem;
          }

          .col-rating {
            grid-column: 2;
            grid-row: 1;
            justify-self: end;
            font-size: 0.85rem;
          }

          .col-location {
            grid-column: 1;
            grid-row: 2;
            font-size: 0.8rem;
          }

          .col-status {
            grid-column: 2;
            grid-row: 2;
            justify-self: end;
            display: block !important;
          }

          .col-category,
          .col-orders {
            display: none;
          }

          /* Expanded section - clean vertical stack */
          .row-expanded {
            padding: 14px 16px;
          }

          .expanded-grid {
            grid-template-columns: 1fr;
            gap: 12px;
            margin-bottom: 12px;
          }

          .info-section {
            padding: 12px;
          }

          .info-section h4 {
            font-size: 0.85rem;
            margin-bottom: 8px;
            padding-bottom: 6px;
          }

          .info-content p {
            font-size: 0.8125rem;
            margin-bottom: 4px;
          }

          .specialization-row {
            font-size: 0.8125rem;
            padding: 10px 12px;
            margin-bottom: 12px;
          }

          .notes-section {
            padding: 12px;
            margin-bottom: 12px;
          }

          /* Icon-only action buttons on mobile */
          .action-buttons-row {
            display: flex;
            gap: 8px;
            justify-content: center;
          }

          .btn-action {
            padding: 10px;
            border-radius: 10px;
            font-size: 0;
            min-width: 44px;
            justify-content: center;
          }

          .btn-action svg {
            width: 18px;
            height: 18px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .tags-list {
            gap: 6px;
          }

          .tag {
            font-size: 0.75rem;
            padding: 4px 8px;
          }
        }
      `}</style>
      {promptElement}
    </AppLayout>
  );
}
