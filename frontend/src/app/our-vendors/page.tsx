'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout';
import { Modal } from '@/components/ui';
import {
  Vendor,
  initializeVendors,
  getVendors,
  updateVendor,
  transitionVendorStage,
  addActivity,
  saveVendorsToStorage
} from '@/lib/vendors';
import {
  RelationshipStage,
  filterSuppliers,
  sortSuppliers,
  getPipelineStats,
  saveSupplier,
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
  HealthScoreBadge,
  HealthScoreInline,
  VendorDetailDrawer,
  PipelineKanban
} from '@/components/vendors';
import { getScoreColor } from '@/lib/healthScore';

type ViewMode = 'kanban' | 'table';

export default function OurVendorsPage() {
  const router = useRouter();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // View mode state - Kanban is the default
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');

  // Drawer state
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Modals
  const [addSupplierModal, setAddSupplierModal] = useState(false);
  const [rfqModal, setRfqModal] = useState<Vendor | null>(null);
  const [editNotesModal, setEditNotesModal] = useState<Vendor | null>(null);
  const [addTagModal, setAddTagModal] = useState<Vendor | null>(null);
  const [confirmRemoveModal, setConfirmRemoveModal] = useState<Vendor | null>(null);
  const [stageTransitionModal, setStageTransitionModal] = useState<Vendor | null>(null);

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

  // Initialize data
  useEffect(() => {
    const data = initializeVendors();
    setVendors(data);
    setIsLoading(false);
  }, []);

  // Computed values - cast to SavedSupplier for compatibility with existing functions
  const filteredVendors = useMemo(() => {
    const filtered = filterSuppliers(vendors as any, filters);
    return sortSuppliers(filtered, sortBy) as Vendor[];
  }, [vendors, filters, sortBy]);

  const pipelineStats = useMemo(() => getPipelineStats(vendors as any), [vendors]);
  const allTags = useMemo(() => getAllTags(vendors as any), [vendors]);
  const allCategories = useMemo(() => getAllCategories(vendors as any), [vendors]);

  // Refresh vendors from storage
  const refreshVendors = () => {
    setVendors(getVendors());
  };

  // Handle stage click from pipeline stats
  const handleStageClick = (stage: RelationshipStage) => {
    const currentStages = filters.relationshipStages;
    const newStages = currentStages.includes(stage)
      ? currentStages.filter(s => s !== stage)
      : [...currentStages, stage];
    setFilters({ ...filters, relationshipStages: newStages });
  };

  // Handle stage transition
  const handleStageTransition = (vendorId: string, newStage: RelationshipStage, reason?: string) => {
    try {
      transitionVendorStage(vendorId, newStage, reason);
      refreshVendors();
    } catch (error) {
      console.error('Failed to transition stage:', error);
    }
  };

  // Open vendor detail drawer
  const handleOpenDrawer = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsDrawerOpen(true);
  };

  // Handlers
  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleMessage = (vendor: Vendor) => {
    const existingConversation = getConversationBySupplier(vendor.id);
    if (existingConversation) {
      router.push(`/supplier-matches?conversation=${existingConversation.id}`);
    } else {
      const conversation = createConversation({
        supplierId: vendor.id,
        supplierName: vendor.name,
        supplierCountry: vendor.country,
        supplierCategory: vendor.category,
        supplierVerified: vendor.verified,
        supplierRating: vendor.rating,
        source: 'saved_suppliers'
      });
      router.push(`/supplier-matches?conversation=${conversation.id}`);
    }
  };

  const handleSendRFQ = (vendor: Vendor) => {
    setRfqModal(vendor);
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
        source: 'saved_suppliers'
      });
    }

    updateVendor(rfqModal.id, {
      lastContactedDate: new Date().toISOString()
    });

    // Log activity
    addActivity(rfqModal.id, {
      type: 'rfq',
      title: `RFQ sent: ${rfqForm.productName}`,
      description: `Quantity: ${rfqForm.quantity} ${rfqForm.unit}`,
      metadata: { ...rfqForm }
    });

    refreshVendors();
    setRfqModal(null);
    router.push(`/supplier-matches?conversation=${conversation.id}&rfq=true`);
  };

  const handleAddSupplier = () => {
    const category = detectCategory(newSupplierForm.specialization);
    const now = new Date().toISOString();

    saveSupplier({
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

    // Re-initialize vendors to include the new one with SRM data
    setVendors(initializeVendors());

    setAddSupplierModal(false);
    setNewSupplierForm({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      location: '',
      specialization: '',
      website: ''
    });
  };

  const handleRemoveSupplier = () => {
    if (!confirmRemoveModal) return;
    removeSupplier(confirmRemoveModal.id);
    refreshVendors();
    setConfirmRemoveModal(null);
    if (expandedId === confirmRemoveModal.id) {
      setExpandedId(null);
    }
  };

  const handleSaveNotes = () => {
    if (!editNotesModal) return;
    updateNotes(editNotesModal.id, editingNotes);
    refreshVendors();
    setEditNotesModal(null);
  };

  const handleAddTag = (tag: string) => {
    if (!addTagModal || !tag.trim()) return;
    addTag(addTagModal.id, tag.trim());
    refreshVendors();
    setNewTag('');
  };

  const handleRemoveTag = (vendorId: string, tag: string) => {
    removeTag(vendorId, tag);
    refreshVendors();
  };

  const handleExport = () => {
    downloadCSV(filteredVendors as any, `our-vendors-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleVendorUpdate = (updatedVendor: Vendor) => {
    refreshVendors();
    setSelectedVendor(updatedVendor);
  };

  if (isLoading) {
    return (
      <AppLayout searchPlaceholder="Search vendors...">
        <div className="loading-state">Loading vendors...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout searchPlaceholder="Search vendors...">
      <div className="content-header">
        <h1>Our Vendors</h1>
        <p>Manage your supplier network with health scores, performance tracking, and relationship stages</p>
      </div>

      {/* PIPELINE STATS */}
      <SupplierPipelineStats
        stats={pipelineStats}
        onStageClick={handleStageClick}
        activeStages={filters.relationshipStages}
      />

      {/* ACTIONS */}
      <div className="quick-actions">
        <h2>Vendor Management</h2>
        <p>Add vendors, track relationships, and maintain your trusted network</p>
        <div className="action-buttons">
          <button className="btn-white" onClick={() => setAddSupplierModal(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add New Vendor
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
          Showing {filteredVendors.length} of {vendors.length} vendors
        </div>
        <div className="sort-bar-right">
          {/* View Mode Toggle */}
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'kanban' ? 'active' : ''}`}
              onClick={() => setViewMode('kanban')}
              title="Kanban View"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <rect x="3" y="3" width="7" height="18" rx="1" />
                <rect x="14" y="3" width="7" height="12" rx="1" />
              </svg>
            </button>
            <button
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
          {viewMode === 'table' && (
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="sort-select"
            >
              <option value="recent">Recently Added</option>
              <option value="name">Name A-Z</option>
              <option value="rating">Highest Rated</option>
              <option value="orders">Most Orders</option>
              <option value="lastContacted">Last Contacted</option>
              <option value="orderValue">Order Value</option>
              <option value="stage">By Stage</option>
            </select>
          )}
        </div>
      </div>

      {/* KANBAN VIEW */}
      {viewMode === 'kanban' && (
        <PipelineKanban
          vendors={filteredVendors}
          onVendorClick={handleOpenDrawer}
          onStageTransition={handleStageTransition}
        />
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
      <div className="vendors-table">
        <div className="table-header">
          <div className="col-expand"></div>
          <div className="col-name">Vendor Name</div>
          <div className="col-location">Location</div>
          <div className="col-health">Health</div>
          <div className="col-rating">Rating</div>
          <div className="col-orders">Orders</div>
          <div className="col-status">Stage</div>
        </div>

        {filteredVendors.length === 0 ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 21h18" />
              <path d="M5 21V7l8-4v18" />
              <path d="M19 21V11l-6-4" />
            </svg>
            <h3>No vendors found</h3>
            <p>Try adjusting your filters or add a new vendor</p>
            <button onClick={() => setAddSupplierModal(true)}>Add Vendor</button>
          </div>
        ) : (
          filteredVendors.map(vendor => (
            <div key={vendor.id} className={`vendor-row ${expandedId === vendor.id ? 'expanded' : ''}`}>
              <div className="row-main">
                <div className="col-expand" onClick={() => handleToggleExpand(vendor.id)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={expandedId === vendor.id ? 'rotated' : ''}>
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
                <div className="col-name" onClick={() => handleOpenDrawer(vendor)}>
                  <strong>{vendor.name}</strong>
                  <span className="sub-info">
                    {vendor.verified && <span className="verified-badge">✓ Verified</span>}
                    {vendor.tags.length > 0 && <span className="tag-count">{vendor.tags.length} tags</span>}
                  </span>
                </div>
                <div className="col-location">
                  <span className="flag">{vendor.countryFlag}</span>
                  {vendor.location}
                </div>
                <div className="col-health" onClick={() => handleOpenDrawer(vendor)}>
                  <HealthScoreBadge
                    score={vendor.healthScore}
                    breakdown={vendor.healthScoreBreakdown}
                    size="sm"
                  />
                </div>
                <div className="col-rating">
                  <span className="rating-star">⭐</span>
                  <strong>{vendor.rating > 0 ? vendor.rating : '—'}</strong>
                </div>
                <div className="col-orders">{vendor.totalOrders}</div>
                <div className="col-status" onClick={(e) => { e.stopPropagation(); setStageTransitionModal(vendor); }}>
                  <RelationshipStageBadge
                    stage={vendor.relationshipStage}
                    size="sm"
                    clickable
                  />
                </div>
              </div>

              {expandedId === vendor.id && (
                <div className="row-expanded">
                  <div className="expanded-grid">
                    {/* Contact Info */}
                    <div className="info-section">
                      <h4>📧 Contact Info</h4>
                      <div className="info-content">
                        {vendor.contactPerson && <p><strong>Contact:</strong> {vendor.contactPerson}</p>}
                        {vendor.email && <p><strong>Email:</strong> <a href={`mailto:${vendor.email}`}>{vendor.email}</a></p>}
                        {vendor.phone && <p><strong>Phone:</strong> {vendor.phone}</p>}
                        {vendor.website && <p><strong>Website:</strong> <a href={`https://${vendor.website}`} target="_blank" rel="noopener noreferrer">{vendor.website}</a></p>}
                        {!vendor.contactPerson && !vendor.email && !vendor.phone && (
                          <p className="no-data">No contact info available</p>
                        )}
                      </div>
                    </div>

                    {/* Statistics */}
                    <div className="info-section">
                      <h4>📊 Statistics</h4>
                      <div className="info-content">
                        <p><strong>Orders:</strong> {vendor.totalOrders}</p>
                        <p><strong>Total Value:</strong> {formatCurrency(vendor.totalOrderValue)}</p>
                        <p><strong>Last Order:</strong> {formatDate(vendor.lastOrderDate)}</p>
                        <p><strong>Last Contact:</strong> {getRelativeTime(vendor.lastContactedDate)}</p>
                        <p><strong>Health Score:</strong> <span style={{ color: getScoreColor(vendor.healthScore), fontWeight: 600 }}>{vendor.healthScore}</span></p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="info-section tags-section">
                      <h4>🏷️ Tags</h4>
                      <div className="tags-list">
                        {vendor.tags.map(tag => (
                          <span key={tag} className="tag">
                            {tag}
                            <button onClick={(e) => { e.stopPropagation(); handleRemoveTag(vendor.id, tag); }}>×</button>
                          </span>
                        ))}
                        <button className="add-tag-btn" onClick={(e) => { e.stopPropagation(); setAddTagModal(vendor); setNewTag(''); }}>
                          + Add Tag
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Specialization */}
                  <div className="specialization-row">
                    <strong>Specialization:</strong> {vendor.specialization}
                  </div>

                  {/* Notes */}
                  <div className="notes-section">
                    <div className="notes-header">
                      <h4>📝 Notes</h4>
                      <button onClick={(e) => { e.stopPropagation(); setEditNotesModal(vendor); setEditingNotes(vendor.notes || ''); }}>
                        Edit Notes
                      </button>
                    </div>
                    <p className="notes-content">
                      {vendor.notes || 'No notes yet. Click "Edit Notes" to add some.'}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="action-buttons-row">
                    <button className="btn-action details" onClick={(e) => { e.stopPropagation(); handleOpenDrawer(vendor); }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                      View Details
                    </button>
                    <button className="btn-action message" onClick={(e) => { e.stopPropagation(); handleMessage(vendor); }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                      Message
                    </button>
                    <button className="btn-action rfq" onClick={(e) => { e.stopPropagation(); handleSendRFQ(vendor); }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                      Send RFQ
                    </button>
                    <button className="btn-action remove" onClick={(e) => { e.stopPropagation(); setConfirmRemoveModal(vendor); }}>
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
      )}

      {/* VENDOR DETAIL DRAWER */}
      <VendorDetailDrawer
        vendor={selectedVendor}
        isOpen={isDrawerOpen}
        onClose={() => { setIsDrawerOpen(false); setSelectedVendor(null); }}
        onUpdate={handleVendorUpdate}
      />

      {/* ADD SUPPLIER MODAL */}
      <Modal isOpen={addSupplierModal} onClose={() => setAddSupplierModal(false)} title="Add New Vendor">
        <p className="modal-desc">Add a vendor to your network</p>
        <form onSubmit={(e) => { e.preventDefault(); handleAddSupplier(); }}>
          <div className="form-group">
            <label>Vendor Name *</label>
            <input
              type="text"
              placeholder="Enter vendor company name"
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
                placeholder="vendor@company.com"
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
              placeholder="www.vendor.com"
              value={newSupplierForm.website}
              onChange={(e) => setNewSupplierForm({ ...newSupplierForm, website: e.target.value })}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={() => setAddSupplierModal(false)}>Cancel</button>
            <button type="submit" className="btn-submit">Add Vendor</button>
          </div>
        </form>
      </Modal>

      {/* RFQ MODAL */}
      <Modal isOpen={!!rfqModal} onClose={() => setRfqModal(null)} title={`Send RFQ to ${rfqModal?.name}`}>
        <p className="modal-desc">Request a quote from this vendor</p>
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
            placeholder="Add notes about this vendor..."
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
      <Modal isOpen={!!confirmRemoveModal} onClose={() => setConfirmRemoveModal(null)} title="Remove Vendor">
        <div className="confirm-content">
          <p>Are you sure you want to remove <strong>{confirmRemoveModal?.name}</strong> from your vendors?</p>
          <p className="warning">This will remove them from your list. Any existing conversations will be preserved in your Inbox.</p>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={() => setConfirmRemoveModal(null)}>Cancel</button>
          <button type="button" className="btn-remove" onClick={handleRemoveSupplier}>Remove Vendor</button>
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

        .sort-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          padding: 0 4px;
        }

        .results-count {
          color: var(--text-secondary);
          font-size: 0.85rem;
        }

        .sort-bar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .view-toggle {
          display: flex;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
        }

        .view-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px 12px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .view-btn:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .view-btn.active {
          background: var(--accent-primary);
          color: white;
        }

        .view-btn + .view-btn {
          border-left: 1px solid var(--border-color);
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

        .vendors-table {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          overflow: hidden;
        }

        .table-header {
          display: grid;
          grid-template-columns: 40px 2fr 1.2fr 0.8fr 0.6fr 0.6fr 0.9fr;
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

        .vendor-row {
          border-bottom: 1px solid var(--border-color);
        }

        .vendor-row:last-child {
          border-bottom: none;
        }

        .row-main {
          display: grid;
          grid-template-columns: 40px 2fr 1.2fr 0.8fr 0.6fr 0.6fr 0.9fr;
          gap: 12px;
          padding: 16px 20px;
          align-items: center;
          transition: background 0.2s;
        }

        .row-main:hover {
          background: var(--bg-tertiary);
        }

        .col-expand {
          cursor: pointer;
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

        .col-name {
          cursor: pointer;
        }

        .col-name strong {
          display: block;
          color: var(--text-primary);
        }

        .col-name:hover strong {
          color: var(--accent-primary);
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

        .col-health {
          cursor: pointer;
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

        .col-status {
          cursor: pointer;
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

        .btn-action.details {
          background: linear-gradient(135deg, #8B5CF6, #7C3AED);
          border: none;
          color: white;
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

        /* Quick Actions */
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

        /* Mobile Responsive */
        @media (max-width: 1024px) {
          .table-header,
          .row-main {
            grid-template-columns: 30px 1.5fr 1fr 0.8fr;
          }

          .col-rating,
          .col-orders,
          .col-status {
            display: none;
          }

          .expanded-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .table-header {
            display: none;
          }

          .row-main {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }

          .col-expand {
            order: 1;
          }

          .col-name {
            order: 2;
            flex: 1;
          }

          .col-location {
            order: 3;
            width: 100%;
            padding-left: 28px;
          }

          .col-health {
            order: 4;
            margin-left: 28px;
          }

          .expanded-grid {
            grid-template-columns: 1fr;
          }

          .action-buttons-row {
            flex-wrap: wrap;
          }

          .btn-action {
            flex: 1;
            min-width: calc(50% - 6px);
            justify-content: center;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </AppLayout>
  );
}
