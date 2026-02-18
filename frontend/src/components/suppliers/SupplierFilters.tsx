'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import {
  RelationshipStage,
  RELATIONSHIP_STAGE_CONFIG,
  FilterOptions,
  FilterPreset,
  DEFAULT_FILTERS,
  getFilterPresets,
  saveFilterPreset,
  deleteFilterPreset
} from '@/lib/savedSuppliers';

interface SupplierFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  allTags: string[];
  allCategories: string[];
  expanded?: boolean;
}

export function SupplierFilters({
  filters,
  onFiltersChange,
  allTags,
  allCategories,
  expanded = false
}: SupplierFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [presets, setPresets] = useState<FilterPreset[]>(() => getFilterPresets());
  const [savePresetModal, setSavePresetModal] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');

  const mainStages: RelationshipStage[] = ['contacted', 'negotiating', 'deal_active', 'deal_completed'];
  const secondaryStages: RelationshipStage[] = ['on_hold', 'blocked'];

  const handleStageToggle = (stage: RelationshipStage) => {
    const current = filters.relationshipStages;
    const updated = current.includes(stage)
      ? current.filter(s => s !== stage)
      : [...current, stage];
    onFiltersChange({ ...filters, relationshipStages: updated });
  };

  const handleTagToggle = (tag: string) => {
    const current = filters.tags;
    const updated = current.includes(tag)
      ? current.filter(t => t !== tag)
      : [...current, tag];
    onFiltersChange({ ...filters, tags: updated });
  };

  const handleClearFilters = () => {
    onFiltersChange(DEFAULT_FILTERS);
  };

  const handleSavePreset = () => {
    if (!newPresetName.trim()) return;
    const preset = saveFilterPreset(newPresetName.trim(), filters);
    setPresets(getFilterPresets());
    setNewPresetName('');
    setSavePresetModal(false);
  };

  const handleLoadPreset = (preset: FilterPreset) => {
    onFiltersChange(preset.filters);
  };

  const handleDeletePreset = (presetId: string) => {
    deleteFilterPreset(presetId);
    setPresets(getFilterPresets());
  };

  const hasActiveFilters = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);

  return (
    <div className="supplier-filters">
      {/* Search Bar */}
      <div className="search-row">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search suppliers, contacts, specializations..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          />
        </div>

        <button
          className={`expand-btn ${isExpanded ? 'expanded' : ''}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="21" x2="4" y2="14"></line>
            <line x1="4" y1="10" x2="4" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12" y2="3"></line>
            <line x1="20" y1="21" x2="20" y2="16"></line>
            <line x1="20" y1="12" x2="20" y2="3"></line>
            <line x1="1" y1="14" x2="7" y2="14"></line>
            <line x1="9" y1="8" x2="15" y2="8"></line>
            <line x1="17" y1="16" x2="23" y2="16"></line>
          </svg>
          Advanced Filters
          {hasActiveFilters && <span className="filter-count">●</span>}
        </button>

        {hasActiveFilters && (
          <button className="clear-btn" onClick={handleClearFilters}>
            Clear All
          </button>
        )}
      </div>

      {/* Stage Quick Filter */}
      <div className="stage-filter">
        <div className="stage-chips">
          {mainStages.map(stage => {
            const config = RELATIONSHIP_STAGE_CONFIG[stage];
            const isActive = filters.relationshipStages.includes(stage);
            const Icon = config.icon;
            return (
              <button
                key={stage}
                className={`stage-chip ${isActive ? 'active' : ''}`}
                onClick={() => handleStageToggle(stage)}
                style={{
                  '--stage-color': config.color,
                  '--stage-bg': config.bgColor
                } as React.CSSProperties}
              >
                <span><Icon size={14} /></span>
                <span>{config.label}</span>
              </button>
            );
          })}
          {secondaryStages.map(stage => {
            const config = RELATIONSHIP_STAGE_CONFIG[stage];
            const isActive = filters.relationshipStages.includes(stage);
            const Icon = config.icon;
            return (
              <button
                key={stage}
                className={`stage-chip secondary ${isActive ? 'active' : ''}`}
                onClick={() => handleStageToggle(stage)}
                style={{
                  '--stage-color': config.color,
                  '--stage-bg': config.bgColor
                } as React.CSSProperties}
              >
                <span><Icon size={14} /></span>
                <span>{config.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="expanded-filters">
          {/* Date Filters */}
          <div className="filter-section">
            <h4>Date Range</h4>
            <div className="date-filters">
              <div className="date-group">
                <label>Date Added</label>
                <div className="date-inputs">
                  <input
                    type="date"
                    value={filters.dateAddedFrom || ''}
                    onChange={(e) => onFiltersChange({ ...filters, dateAddedFrom: e.target.value || undefined })}
                    placeholder="From"
                  />
                  <span>→</span>
                  <input
                    type="date"
                    value={filters.dateAddedTo || ''}
                    onChange={(e) => onFiltersChange({ ...filters, dateAddedTo: e.target.value || undefined })}
                    placeholder="To"
                  />
                </div>
              </div>
              <div className="date-group">
                <label>Last Contacted</label>
                <div className="date-inputs">
                  <input
                    type="date"
                    value={filters.lastContactedFrom || ''}
                    onChange={(e) => onFiltersChange({ ...filters, lastContactedFrom: e.target.value || undefined })}
                  />
                  <span>→</span>
                  <input
                    type="date"
                    value={filters.lastContactedTo || ''}
                    onChange={(e) => onFiltersChange({ ...filters, lastContactedTo: e.target.value || undefined })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Category & Rating */}
          <div className="filter-row">
            <div className="filter-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => onFiltersChange({ ...filters, category: e.target.value })}
              >
                <option value="">All Categories</option>
                {allCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Min Rating</label>
              <select
                value={filters.minRating}
                onChange={(e) => onFiltersChange({ ...filters, minRating: Number(e.target.value) })}
              >
                <option value={0}>Any Rating</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
                <option value={5}>5 Stars</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => onFiltersChange({ ...filters, priority: e.target.value as any })}
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Activity Filters */}
          <div className="filter-section">
            <h4>Activity Filters</h4>
            <div className="checkbox-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.needsFollowUp}
                  onChange={(e) => onFiltersChange({ ...filters, needsFollowUp: e.target.checked })}
                />
                <span>Needs Follow-up</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.hasActiveDeals}
                  onChange={(e) => onFiltersChange({ ...filters, hasActiveDeals: e.target.checked })}
                />
                <span>Has Active Deals</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.hasPendingQuotes}
                  onChange={(e) => onFiltersChange({ ...filters, hasPendingQuotes: e.target.checked })}
                />
                <span>Has Pending Quotes</span>
              </label>
            </div>
          </div>

          {/* Tags */}
          {allTags.length > 0 && (
            <div className="filter-section">
              <h4>Tags</h4>
              <div className="tag-chips">
                {allTags.slice(0, 12).map(tag => {
                  const isActive = filters.tags.includes(tag);
                  return (
                    <button
                      key={tag}
                      className={`tag-chip ${isActive ? 'active' : ''}`}
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Presets */}
          <div className="filter-section presets-section">
            <h4>Filter Presets</h4>
            <div className="presets-row">
              <div className="preset-chips">
                {presets.map(preset => (
                  <button
                    key={preset.id}
                    className="preset-chip"
                    onClick={() => handleLoadPreset(preset)}
                  >
                    {preset.name}
                    {!preset.isDefault && (
                      <span
                        className="delete-preset"
                        onClick={(e) => { e.stopPropagation(); handleDeletePreset(preset.id); }}
                      >
                        ×
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <button className="save-preset-btn" onClick={() => setSavePresetModal(true)}>
                <Save size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Save Current
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Preset Modal */}
      {savePresetModal && (
        <div className="preset-modal-overlay" onClick={() => setSavePresetModal(false)}>
          <div className="preset-modal" onClick={(e) => e.stopPropagation()}>
            <h4>Save Filter Preset</h4>
            <input
              type="text"
              placeholder="Preset name..."
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              autoFocus
            />
            <div className="preset-modal-actions">
              <button onClick={() => setSavePresetModal(false)}>Cancel</button>
              <button className="primary" onClick={handleSavePreset}>Save</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .supplier-filters {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 20px;
        }

        .search-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .search-box {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;
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

        .expand-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-secondary);
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .expand-btn:hover,
        .expand-btn.expanded {
          border-color: #f97316;
          color: #f97316;
        }

        .expand-btn svg {
          width: 16px;
          height: 16px;
        }

        .filter-count {
          color: #f97316;
          margin-left: 4px;
        }

        .clear-btn {
          padding: 10px 16px;
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-secondary);
          font-size: 0.9rem;
          cursor: pointer;
        }

        .clear-btn:hover {
          border-color: #ef4444;
          color: #ef4444;
        }

        .stage-filter {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
        }

        .stage-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .stage-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .stage-chip:hover {
          border-color: var(--stage-color);
          color: var(--stage-color);
        }

        .stage-chip.active {
          background: var(--stage-bg);
          border-color: var(--stage-color);
          color: var(--stage-color);
        }

        .stage-chip.secondary {
          opacity: 0.8;
        }

        .expanded-filters {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .filter-section h4 {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 12px;
          font-weight: 500;
        }

        .date-filters {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .date-group label {
          display: block;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 6px;
        }

        .date-inputs {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .date-inputs input {
          flex: 1;
          padding: 8px 10px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          color: var(--text-primary);
          font-size: 0.85rem;
        }

        .date-inputs span {
          color: var(--text-muted);
        }

        .filter-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .filter-group label {
          display: block;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 6px;
        }

        .filter-group select {
          width: 100%;
          padding: 10px 12px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 0.9rem;
          cursor: pointer;
        }

        .checkbox-row {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .checkbox-label input {
          width: 16px;
          height: 16px;
          accent-color: #f97316;
        }

        .tag-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tag-chip {
          padding: 6px 12px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          font-size: 0.8rem;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .tag-chip:hover {
          border-color: #f97316;
          color: #f97316;
        }

        .tag-chip.active {
          background: rgba(249, 115, 22, 0.15);
          border-color: #f97316;
          color: #f97316;
        }

        .presets-section {
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
        }

        .presets-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .preset-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .preset-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          font-size: 0.8rem;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .preset-chip:hover {
          border-color: #f97316;
          color: #f97316;
        }

        .delete-preset {
          font-size: 1rem;
          line-height: 1;
          opacity: 0.6;
        }

        .delete-preset:hover {
          opacity: 1;
          color: #ef4444;
        }

        .save-preset-btn {
          padding: 8px 14px;
          background: var(--bg-tertiary);
          border: 1px dashed var(--border-color);
          border-radius: 16px;
          font-size: 0.8rem;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .save-preset-btn:hover {
          border-color: #f97316;
          color: #f97316;
        }

        .preset-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }

        .preset-modal {
          background: var(--bg-secondary);
          padding: 24px;
          border-radius: 12px;
          width: 300px;
        }

        .preset-modal h4 {
          margin-bottom: 16px;
          color: var(--text-primary);
        }

        .preset-modal input {
          width: 100%;
          padding: 12px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-primary);
          margin-bottom: 16px;
        }

        .preset-modal-actions {
          display: flex;
          gap: 12px;
        }

        .preset-modal-actions button {
          flex: 1;
          padding: 10px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
        }

        .preset-modal-actions button:first-child {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
        }

        .preset-modal-actions button.primary {
          background: linear-gradient(135deg, #f97316, #ea580c);
          border: none;
          color: white;
        }

        @media (max-width: 768px) {
          .search-row {
            flex-wrap: wrap;
          }

          .search-box {
            width: 100%;
          }

          .date-filters,
          .filter-row {
            grid-template-columns: 1fr;
          }

          .presets-row {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}

export default SupplierFilters;
