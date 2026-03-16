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
import {
  Check, Star, Mail, BarChart3, Tag, PenLine,
  Plus, Search, Download, ChevronRight,
  MessageCircle, FileText, ShoppingCart, Trash2, Users
} from 'lucide-react';
import { Suspense } from 'react';
import { useMobile } from '@/hooks/useMobile';
import { captureFeatureAction } from '@/lib/posthogEvents';
import { useTour } from '@/hooks/useTour';
import { ourVendorsTourSteps, mobileOurVendorsTourSteps } from '@/lib/tourSteps';
import TourFAB from '@/components/walkthrough/TourFAB';
import Joyride from 'react-joyride';
import { joyrideStyles, BefachTooltip } from '@/lib/tourConfig';

function OurVendorsContent() {
  const router = useRouter();
  const { triggerFeedback, promptElement } = useFeedbackTrigger();
  const { isMobile } = useMobile();
  const tourSteps = isMobile ? mobileOurVendorsTourSteps : ourVendorsTourSteps;
  const { run, startTour, handleJoyrideCallback } = useTour({ tourId: 'our-vendors', steps: tourSteps });
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

  // Filters
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

  useEffect(() => {
    const data = getSavedSuppliers();
    setSuppliers(data);
    setIsLoading(false);
  }, []);

  const filteredSuppliers = useMemo(() => {
    const filtered = filterSuppliers(suppliers, filters);
    return sortSuppliers(filtered, sortBy);
  }, [suppliers, filters, sortBy]);

  const pipelineStats = useMemo(() => getPipelineStats(suppliers), [suppliers]);
  const allTags = useMemo(() => getAllTags(suppliers), [suppliers]);
  const allCategories = useMemo(() => getAllCategories(suppliers), [suppliers]);

  const handleStageClick = (stage: RelationshipStage) => {
    const currentStages = filters.relationshipStages;
    const newStages = currentStages.includes(stage)
      ? currentStages.filter(s => s !== stage)
      : [...currentStages, stage];
    setFilters({ ...filters, relationshipStages: newStages });
  };

  const handleStageTransition = (supplierId: string, newStage: RelationshipStage, reason?: string) => {
    try {
      transitionSupplierStage(supplierId, newStage, reason);
      setSuppliers(getSavedSuppliers());
      triggerFeedback('vendor-management');
    } catch (error) {
      console.error('Failed to transition stage:', error);
    }
  };

  const handleToggleExpand = (id: string) => {
    if (expandedId !== id) {
      captureFeatureAction('vendors', 'browsed', { supplier_id: id });
    }
    setExpandedId(expandedId === id ? null : id);
  };

  const handleMessage = (supplier: SavedSupplier) => {
    const existingConversation = getConversationBySupplier(supplier.id);
    if (existingConversation) {
      router.push(`/supplier-matches?conversation=${existingConversation.id}`);
    } else {
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
      countryFlag: '',
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
        <p>Manage your supplier relationships and pipeline</p>
      </div>

      {/* PIPELINE STATS */}
      <div id="vendors-pipeline"><SupplierPipelineStats
        stats={pipelineStats}
        onStageClick={handleStageClick}
        activeStages={filters.relationshipStages}
      />
      </div>

      {/* TOOLBAR */}
      <div id="vendors-toolbar" className="toolbar">
        <div className="toolbar-left">
          <button className="btn-primary" onClick={() => setAddSupplierModal(true)}>
            <Plus size={16} />
            <span>Add Supplier</span>
          </button>
          <button className="btn-secondary" onClick={() => router.push('/smart-sourcing')}>
            <Search size={15} />
            <span>Find Suppliers</span>
          </button>
          <button className="btn-secondary" onClick={handleExport}>
            <Download size={15} />
            <span>Export</span>
          </button>
        </div>
        <div className="toolbar-right">
          <span className="results-count">
            {filteredSuppliers.length} of {suppliers.length} suppliers
          </span>
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
      </div>

      {/* FILTERS */}
      <div id="vendors-filters"><SupplierFilters
        filters={filters}
        onFiltersChange={setFilters}
        allTags={allTags}
        allCategories={allCategories}
      />
      </div>

      {/* SUPPLIER LIST */}
      <div id="vendors-list" className="suppliers-list">
        {/* Desktop table header */}
        <div className="table-header">
          <div className="col-expand"></div>
          <div className="col-name">Supplier</div>
          <div className="col-location">Location</div>
          <div className="col-category">Category</div>
          <div className="col-rating">Rating</div>
          <div className="col-orders">Orders</div>
          <div className="col-stage">Stage</div>
        </div>

        {filteredSuppliers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Users size={40} strokeWidth={1.5} />
            </div>
            <h3>No suppliers found</h3>
            <p>Try adjusting your filters or add a new supplier to get started</p>
            <button className="btn-primary" onClick={() => setAddSupplierModal(true)}>
              <Plus size={16} /> Add Supplier
            </button>
          </div>
        ) : (
          filteredSuppliers.map(supplier => (
            <div key={supplier.id} className={`supplier-row ${expandedId === supplier.id ? 'expanded' : ''}`}>
              {/* Main row */}
              <div className="row-main" onClick={() => handleToggleExpand(supplier.id)}>
                <div className="col-expand">
                  <ChevronRight
                    size={16}
                    className={expandedId === supplier.id ? 'chevron rotated' : 'chevron'}
                  />
                </div>
                <div className="col-name">
                  <div className="supplier-name">{supplier.name}</div>
                  <div className="supplier-meta">
                    {supplier.verified && (
                      <span className="verified-chip"><Check size={11} /> Verified</span>
                    )}
                    {supplier.tags.length > 0 && (
                      <span className="tag-chip">{supplier.tags.length} tags</span>
                    )}
                  </div>
                </div>
                <div className="col-location">
                  <span className="flag">{supplier.countryFlag}</span>
                  <span>{supplier.location}</span>
                </div>
                <div className="col-category">{supplier.category}</div>
                <div className="col-rating">
                  <Star size={13} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                  <span className="rating-value">{supplier.rating > 0 ? supplier.rating : '—'}</span>
                </div>
                <div className="col-orders">{supplier.totalOrders}</div>
                <div className="col-stage">
                  <RelationshipStageBadge
                    stage={supplier.relationshipStage}
                    size="sm"
                    clickable
                    onClick={() => { setStageTransitionModal(supplier); }}
                  />
                </div>
              </div>

              {/* Mobile summary row (visible < 768px) */}
              <div className="mobile-row" onClick={() => handleToggleExpand(supplier.id)}>
                <div className="mobile-row-top">
                  <div className="mobile-supplier-info">
                    <div className="supplier-name">{supplier.name}</div>
                    <div className="supplier-meta">
                      {supplier.verified && (
                        <span className="verified-chip"><Check size={10} /> Verified</span>
                      )}
                      <span className="location-text">
                        {supplier.countryFlag} {supplier.location}
                      </span>
                    </div>
                  </div>
                  <div className="mobile-rating">
                    <Star size={12} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                    <span>{supplier.rating > 0 ? supplier.rating : '—'}</span>
                  </div>
                </div>
                <div className="mobile-row-bottom">
                  <span className="mobile-category">{supplier.category}</span>
                  <RelationshipStageBadge
                    stage={supplier.relationshipStage}
                    size="sm"
                    clickable
                    onClick={() => { setStageTransitionModal(supplier); }}
                  />
                </div>
              </div>

              {/* Expanded detail */}
              {expandedId === supplier.id && (
                <div className="row-detail">
                  <div className="detail-grid">
                    {/* Contact */}
                    <div className="detail-card">
                      <div className="detail-card-header">
                        <Mail size={15} />
                        <span>Contact</span>
                      </div>
                      <div className="detail-card-body">
                        {supplier.contactPerson && <div className="detail-item"><span className="detail-label">Contact</span><span>{supplier.contactPerson}</span></div>}
                        {supplier.email && <div className="detail-item"><span className="detail-label">Email</span><a href={`mailto:${supplier.email}`}>{supplier.email}</a></div>}
                        {supplier.phone && <div className="detail-item"><span className="detail-label">Phone</span><span>{supplier.phone}</span></div>}
                        {supplier.website && <div className="detail-item"><span className="detail-label">Web</span><a href={`https://${supplier.website}`} target="_blank" rel="noopener noreferrer">{supplier.website}</a></div>}
                        {!supplier.contactPerson && !supplier.email && !supplier.phone && (
                          <div className="no-data">No contact info</div>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="detail-card">
                      <div className="detail-card-header">
                        <BarChart3 size={15} />
                        <span>Statistics</span>
                      </div>
                      <div className="detail-card-body">
                        <div className="detail-item"><span className="detail-label">Orders</span><span>{supplier.totalOrders}</span></div>
                        <div className="detail-item"><span className="detail-label">Total Value</span><span>{formatCurrency(supplier.totalOrderValue)}</span></div>
                        <div className="detail-item"><span className="detail-label">Last Order</span><span>{formatDate(supplier.lastOrderDate)}</span></div>
                        <div className="detail-item"><span className="detail-label">Last Contact</span><span>{getRelativeTime(supplier.lastContactedDate)}</span></div>
                        <div className="detail-item"><span className="detail-label">Source</span><span className="source-chip">{supplier.source}</span></div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="detail-card">
                      <div className="detail-card-header">
                        <Tag size={15} />
                        <span>Tags</span>
                      </div>
                      <div className="detail-card-body">
                        <div className="tags-wrap">
                          {supplier.tags.map(tag => (
                            <span key={tag} className="tag-pill">
                              {tag}
                              <button onClick={(e) => { e.stopPropagation(); handleRemoveTag(supplier.id, tag); }}>×</button>
                            </span>
                          ))}
                          <button className="add-tag-btn" onClick={(e) => { e.stopPropagation(); setAddTagModal(supplier); setNewTag(''); }}>
                            <Plus size={12} /> Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Specialization */}
                  <div className="specialization-bar">
                    <span className="detail-label">Specialization</span>
                    <span>{supplier.specialization}</span>
                  </div>

                  {/* Notes */}
                  <div className="notes-bar">
                    <div className="notes-top">
                      <div className="notes-heading">
                        <PenLine size={14} />
                        <span>Notes</span>
                      </div>
                      <button className="edit-notes-btn" onClick={(e) => { e.stopPropagation(); setEditNotesModal(supplier); setEditingNotes(supplier.notes || ''); }}>
                        Edit
                      </button>
                    </div>
                    <p className="notes-text">
                      {supplier.notes || 'No notes yet. Click "Edit" to add some.'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="detail-actions">
                    <button className="action-btn primary" onClick={(e) => { e.stopPropagation(); handleMessage(supplier); }}>
                      <MessageCircle size={15} />
                      <span>Message</span>
                    </button>
                    <button className="action-btn accent" onClick={(e) => { e.stopPropagation(); handleSendRFQ(supplier); }}>
                      <FileText size={15} />
                      <span>Send RFQ</span>
                    </button>
                    <button className="action-btn neutral" onClick={(e) => { e.stopPropagation(); router.push('/my-orders'); }}>
                      <ShoppingCart size={15} />
                      <span>Orders</span>
                    </button>
                    <button className="action-btn danger" onClick={(e) => { e.stopPropagation(); setConfirmRemoveModal(supplier); }}>
                      <Trash2 size={15} />
                      <span>Remove</span>
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

        /* ─── Toolbar ─── */
        .toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .toolbar-left {
          display: flex;
          gap: 10px;
        }

        .toolbar-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 18px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.35);
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 16px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 0.88rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          border-color: var(--text-muted);
        }

        .results-count {
          color: var(--text-muted);
          font-size: 0.82rem;
          white-space: nowrap;
        }

        .sort-select {
          padding: 8px 12px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 0.85rem;
          cursor: pointer;
        }

        /* ─── Supplier list container ─── */
        .suppliers-list {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          overflow: hidden;
        }

        /* ─── Table header (desktop) ─── */
        .table-header {
          display: grid;
          grid-template-columns: 36px 2fr 1.4fr 1fr 0.7fr 0.6fr 0.9fr;
          gap: 10px;
          padding: 12px 20px;
          border-bottom: 1px solid var(--border-color);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* ─── Supplier row ─── */
        .supplier-row {
          border-bottom: 1px solid var(--border-color);
        }

        .supplier-row:last-child {
          border-bottom: none;
        }

        .supplier-row.expanded {
          background: var(--bg-secondary);
        }

        /* Desktop main row */
        .row-main {
          display: grid;
          grid-template-columns: 36px 2fr 1.4fr 1fr 0.7fr 0.6fr 0.9fr;
          gap: 10px;
          padding: 14px 20px;
          cursor: pointer;
          transition: background 0.15s;
          align-items: center;
        }

        .row-main:hover {
          background: var(--bg-secondary);
        }

        /* Mobile row – hidden on desktop */
        .mobile-row {
          display: none;
        }

        /* ─── Columns ─── */
        .col-expand {
          display: flex;
          align-items: center;
          color: var(--text-muted);
        }

        .col-expand :global(.chevron) {
          transition: transform 0.2s;
        }

        .col-expand :global(.rotated) {
          transform: rotate(90deg);
        }

        .supplier-name {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.9rem;
          line-height: 1.3;
        }

        .supplier-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 3px;
        }

        .verified-chip {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          color: #10b981;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .tag-chip {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .col-location {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-secondary);
          font-size: 0.85rem;
        }

        .flag {
          font-size: 1.05rem;
          line-height: 1;
        }

        .col-category {
          color: var(--text-secondary);
          font-size: 0.85rem;
        }

        .col-rating {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .rating-value {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.88rem;
        }

        .col-orders {
          color: var(--text-secondary);
          font-size: 0.88rem;
        }

        /* ─── Expanded detail ─── */
        .row-detail {
          padding: 20px;
          border-top: 1px solid var(--border-color);
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 14px;
        }

        .detail-card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          overflow: hidden;
        }

        .detail-card-header {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 10px 14px;
          border-bottom: 1px solid var(--border-color);
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .detail-card-body {
          padding: 12px 14px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 5px 0;
          font-size: 0.82rem;
          color: var(--text-secondary);
        }

        .detail-item:not(:last-child) {
          border-bottom: 1px solid var(--border-color);
        }

        .detail-label {
          font-weight: 500;
          color: var(--text-muted);
          font-size: 0.78rem;
        }

        .detail-item a {
          color: #f97316;
          text-decoration: none;
        }

        .detail-item a:hover {
          text-decoration: underline;
        }

        .no-data {
          font-size: 0.82rem;
          color: var(--text-muted);
          font-style: italic;
        }

        .source-chip {
          background: rgba(249, 115, 22, 0.12);
          color: #f97316;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: capitalize;
        }

        .tags-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(249, 115, 22, 0.1);
          color: #f97316;
          padding: 5px 10px;
          border-radius: 14px;
          font-size: 0.78rem;
          font-weight: 500;
        }

        .tag-pill button {
          background: none;
          border: none;
          color: #f97316;
          cursor: pointer;
          font-size: 0.95rem;
          padding: 0;
          line-height: 1;
          opacity: 0.7;
        }

        .tag-pill button:hover {
          opacity: 1;
        }

        .add-tag-btn {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          background: none;
          border: 1px dashed var(--border-color);
          padding: 5px 10px;
          border-radius: 14px;
          font-size: 0.78rem;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.15s;
        }

        .add-tag-btn:hover {
          border-color: #f97316;
          color: #f97316;
        }

        /* Specialization bar */
        .specialization-bar {
          display: flex;
          gap: 10px;
          padding: 10px 14px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-size: 0.84rem;
          color: var(--text-secondary);
          margin-bottom: 14px;
        }

        /* Notes bar */
        .notes-bar {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          padding: 12px 14px;
          margin-bottom: 14px;
        }

        .notes-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .notes-heading {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .edit-notes-btn {
          background: none;
          border: none;
          color: #f97316;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
        }

        .notes-text {
          font-size: 0.84rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        /* Detail actions */
        .detail-actions {
          display: flex;
          gap: 10px;
        }

        .action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 16px;
          border-radius: 8px;
          font-size: 0.84rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }

        .action-btn.primary {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.25);
          color: #3b82f6;
        }

        .action-btn.primary:hover {
          background: rgba(59, 130, 246, 0.18);
        }

        .action-btn.accent {
          background: rgba(249, 115, 22, 0.1);
          border: 1px solid rgba(249, 115, 22, 0.25);
          color: #f97316;
        }

        .action-btn.accent:hover {
          background: rgba(249, 115, 22, 0.18);
        }

        .action-btn.neutral {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
        }

        .action-btn.neutral:hover {
          border-color: var(--text-muted);
        }

        .action-btn.danger {
          background: var(--card-bg);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #ef4444;
        }

        .action-btn.danger:hover {
          background: rgba(239, 68, 68, 0.08);
        }

        /* ─── Empty state ─── */
        .empty-state {
          text-align: center;
          padding: 60px 24px;
        }

        .empty-icon {
          color: var(--text-muted);
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .empty-state h3 {
          color: var(--text-primary);
          font-size: 1.05rem;
          margin: 0 0 6px;
        }

        .empty-state p {
          color: var(--text-secondary);
          font-size: 0.88rem;
          margin: 0 0 20px;
        }

        /* ─── Modals ─── */
        .modal-desc {
          color: var(--text-secondary);
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 6px;
          font-weight: 500;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
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
          padding: 10px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-secondary);
          font-weight: 500;
          cursor: pointer;
        }

        .btn-submit {
          flex: 1;
          padding: 10px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-remove {
          flex: 1;
          padding: 10px;
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
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 10px;
          font-weight: 500;
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
          border-radius: 14px;
          font-size: 0.82rem;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s;
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
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        /* ─── Tablet ─── */
        @media (max-width: 1024px) {
          .table-header,
          .row-main {
            grid-template-columns: 30px 1.5fr 1fr 0.8fr;
          }

          .col-category,
          .col-orders,
          .col-stage {
            display: none;
          }

          .detail-grid {
            grid-template-columns: 1fr 1fr;
          }

          .detail-actions {
            flex-wrap: wrap;
          }
        }

        /* ─── Mobile ─── */
        @media (max-width: 768px) {
          .toolbar {
            flex-direction: column;
            gap: 12px;
          }

          .toolbar-left {
            width: 100%;
            gap: 8px;
          }

          .toolbar-left .btn-secondary span {
            display: none;
          }

          .toolbar-right {
            width: 100%;
            justify-content: space-between;
          }

          .sort-select {
            flex: 1;
          }

          /* Hide desktop row, show mobile row */
          .table-header {
            display: none;
          }

          .row-main {
            display: none;
          }

          .mobile-row {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 14px 16px;
            cursor: pointer;
            transition: background 0.15s;
          }

          .mobile-row:active {
            background: var(--bg-secondary);
          }

          .mobile-row-top {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 12px;
          }

          .mobile-supplier-info {
            flex: 1;
            min-width: 0;
          }

          .mobile-supplier-info .supplier-name {
            font-size: 0.88rem;
          }

          .mobile-supplier-info .supplier-meta {
            gap: 6px;
          }

          .location-text {
            font-size: 0.75rem;
            color: var(--text-muted);
          }

          .mobile-rating {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--text-primary);
            flex-shrink: 0;
          }

          .mobile-row-bottom {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .mobile-category {
            font-size: 0.78rem;
            color: var(--text-muted);
          }

          /* Detail section on mobile */
          .row-detail {
            padding: 14px 16px;
          }

          .detail-grid {
            grid-template-columns: 1fr;
            gap: 10px;
            margin-bottom: 10px;
          }

          .detail-card-header {
            padding: 8px 12px;
            font-size: 0.8rem;
          }

          .detail-card-body {
            padding: 10px 12px;
          }

          .detail-item {
            font-size: 0.8rem;
            padding: 4px 0;
          }

          .specialization-bar {
            font-size: 0.8rem;
            padding: 8px 12px;
            margin-bottom: 10px;
          }

          .notes-bar {
            padding: 10px 12px;
            margin-bottom: 10px;
          }

          .notes-heading {
            font-size: 0.8rem;
          }

          .notes-text {
            font-size: 0.8rem;
          }

          /* Action buttons — icon-only on mobile */
          .detail-actions {
            justify-content: center;
            gap: 8px;
          }

          .action-btn {
            padding: 10px 12px;
            border-radius: 10px;
          }

          .action-btn span {
            display: none;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .tags-wrap {
            gap: 6px;
          }

          .tag-pill {
            font-size: 0.74rem;
            padding: 4px 8px;
          }
        }

        /* ─── Compact mobile ─── */
        @media (max-width: 480px) {
          .toolbar-left {
            flex-wrap: wrap;
          }

          .btn-primary {
            flex: 1;
          }

          .mobile-row {
            padding: 12px 14px;
            gap: 6px;
          }

          .mobile-supplier-info .supplier-name {
            font-size: 0.84rem;
          }

          .row-detail {
            padding: 12px 14px;
          }

          .detail-card-header {
            font-size: 0.78rem;
          }

          .detail-item {
            font-size: 0.78rem;
          }
        }
      `}</style>
      {promptElement}
      <Joyride
        steps={tourSteps}
        run={run}
        continuous
        showProgress
        showSkipButton
        scrollToFirstStep
        callback={handleJoyrideCallback}
        tooltipComponent={BefachTooltip}
        styles={joyrideStyles}
        floaterProps={{ disableAnimation: true }}
        disableScrollParentFix
      />
      {!run && <TourFAB onStart={startTour} />}
    </AppLayout>
  );
}

export default function OurVendorsPage() {
  return (
    <Suspense fallback={null}>
      <OurVendorsContent />
    </Suspense>
  );
}
