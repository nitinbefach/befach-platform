'use client';

import { useState } from 'react';
import { COUNTRIES, CERTIFICATIONS } from '@/lib/suppliers';

interface FilterState {
  countries: string[];
  certifications: string[];
  minRating: number | null;
  maxLeadTime: number | null;
  // New product-focused filters
  minMOQ: string;
  maxMOQ: string;
  minPrice: string;
  maxPrice: string;
  minResponseRate: string;
  verifiedOnly: boolean;
  premiumOnly: boolean;
  sampleAvailable: boolean;
  customization: boolean;
}

interface SearchFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClear: () => void;
  onApply: () => void;
}

// Quick filter presets like Jungle Scout
const QUICK_FILTERS = [
  { id: 'verified', label: '✓ Verified Only', key: 'verifiedOnly' as const },
  { id: 'premium', label: '⭐ Premium Suppliers', key: 'premiumOnly' as const },
  { id: 'sample', label: '📦 Samples Available', key: 'sampleAvailable' as const },
  { id: 'custom', label: '🔧 Customization', key: 'customization' as const },
];

const MOQ_PRESETS = [
  { label: 'Any', min: '', max: '' },
  { label: '1-100', min: '1', max: '100' },
  { label: '100-500', min: '100', max: '500' },
  { label: '500-1000', min: '500', max: '1000' },
  { label: '1000+', min: '1000', max: '' },
];

const PRICE_PRESETS = [
  { label: 'Any', min: '', max: '' },
  { label: '$0-$5', min: '0', max: '5' },
  { label: '$5-$20', min: '5', max: '20' },
  { label: '$20-$50', min: '20', max: '50' },
  { label: '$50+', min: '50', max: '' },
];

export default function SearchFilters({
  filters,
  onFilterChange,
  onClear,
  onApply,
}: SearchFiltersProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('product');
  const [showAllCountries, setShowAllCountries] = useState(false);
  const [showAllCerts, setShowAllCerts] = useState(false);

  // Count active filters
  const activeCount = [
    filters.countries.length > 0,
    filters.certifications.length > 0,
    filters.minRating !== null,
    filters.maxLeadTime !== null,
    filters.minMOQ || filters.maxMOQ,
    filters.minPrice || filters.maxPrice,
    filters.minResponseRate,
    filters.verifiedOnly,
    filters.premiumOnly,
    filters.sampleAvailable,
    filters.customization,
  ].filter(Boolean).length;

  const toggleQuickFilter = (key: 'verifiedOnly' | 'premiumOnly' | 'sampleAvailable' | 'customization') => {
    onFilterChange({ ...filters, [key]: !filters[key] });
  };

  const toggleCountry = (country: string) => {
    const updated = filters.countries.includes(country)
      ? filters.countries.filter((c) => c !== country)
      : [...filters.countries, country];
    onFilterChange({ ...filters, countries: updated });
  };

  const toggleCertification = (cert: string) => {
    const updated = filters.certifications.includes(cert)
      ? filters.certifications.filter((c) => c !== cert)
      : [...filters.certifications, cert];
    onFilterChange({ ...filters, certifications: updated });
  };

  const setMOQPreset = (min: string, max: string) => {
    onFilterChange({ ...filters, minMOQ: min, maxMOQ: max });
  };

  const setPricePreset = (min: string, max: string) => {
    onFilterChange({ ...filters, minPrice: min, maxPrice: max });
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const displayedCountries = showAllCountries ? COUNTRIES : COUNTRIES.slice(0, 6);
  const displayedCerts = showAllCerts ? CERTIFICATIONS : CERTIFICATIONS.slice(0, 8);

  return (
    <div className="filters-panel">
      {/* Header with active count */}
      <div className="filters-header">
        <div className="header-left">
          <h3>🎯 Advanced Filters</h3>
          {activeCount > 0 && (
            <span className="active-badge">{activeCount} active</span>
          )}
        </div>
        <button className="btn-collapse" onClick={onClear}>
          Reset All
        </button>
      </div>

      {/* Quick Filter Toggles - Like Jungle Scout top bar */}
      <div className="quick-filters">
        {QUICK_FILTERS.map((qf) => (
          <button
            key={qf.id}
            className={`quick-toggle ${filters[qf.key] ? 'active' : ''}`}
            onClick={() => toggleQuickFilter(qf.key)}
          >
            {qf.label}
          </button>
        ))}
      </div>

      {/* Main Filter Sections */}
      <div className="filter-sections">
        {/* Product Requirements Section */}
        <div className={`filter-section ${expandedSection === 'product' ? 'expanded' : ''}`}>
          <button className="section-header" onClick={() => toggleSection('product')}>
            <span className="section-title">📦 Product Requirements</span>
            <span className="section-toggle">{expandedSection === 'product' ? '−' : '+'}</span>
          </button>

          {expandedSection === 'product' && (
            <div className="section-content">
              {/* MOQ Range */}
              <div className="filter-row">
                <label className="filter-label">
                  MOQ (Minimum Order)
                  <span className="filter-hint">Units per order</span>
                </label>
                <div className="filter-control">
                  <div className="preset-chips">
                    {MOQ_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        className={`preset-chip ${filters.minMOQ === preset.min && filters.maxMOQ === preset.max ? 'active' : ''}`}
                        onClick={() => setMOQPreset(preset.min, preset.max)}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                  <div className="range-inputs">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minMOQ}
                      onChange={(e) => onFilterChange({ ...filters, minMOQ: e.target.value })}
                    />
                    <span className="range-separator">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxMOQ}
                      onChange={(e) => onFilterChange({ ...filters, maxMOQ: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Price Range */}
              <div className="filter-row">
                <label className="filter-label">
                  Unit Price (USD)
                  <span className="filter-hint">Price per unit</span>
                </label>
                <div className="filter-control">
                  <div className="preset-chips">
                    {PRICE_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        className={`preset-chip ${filters.minPrice === preset.min && filters.maxPrice === preset.max ? 'active' : ''}`}
                        onClick={() => setPricePreset(preset.min, preset.max)}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                  <div className="range-inputs">
                    <div className="input-prefix">
                      <span>$</span>
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => onFilterChange({ ...filters, minPrice: e.target.value })}
                      />
                    </div>
                    <span className="range-separator">to</span>
                    <div className="input-prefix">
                      <span>$</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => onFilterChange({ ...filters, maxPrice: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Lead Time */}
              <div className="filter-row">
                <label className="filter-label">
                  Lead Time
                  <span className="filter-hint">Production + shipping days</span>
                </label>
                <div className="filter-control">
                  <div className="select-row">
                    <select
                      value={filters.maxLeadTime || ''}
                      onChange={(e) =>
                        onFilterChange({
                          ...filters,
                          maxLeadTime: e.target.value ? parseInt(e.target.value) : null,
                        })
                      }
                    >
                      <option value="">Any lead time</option>
                      <option value="7">⚡ Express (≤7 days)</option>
                      <option value="14">🚀 Fast (≤14 days)</option>
                      <option value="21">📦 Standard (≤21 days)</option>
                      <option value="30">🚢 Extended (≤30 days)</option>
                      <option value="45">⏳ Long (≤45 days)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Supplier Quality Section */}
        <div className={`filter-section ${expandedSection === 'quality' ? 'expanded' : ''}`}>
          <button className="section-header" onClick={() => toggleSection('quality')}>
            <span className="section-title">⭐ Supplier Quality</span>
            <span className="section-toggle">{expandedSection === 'quality' ? '−' : '+'}</span>
          </button>

          {expandedSection === 'quality' && (
            <div className="section-content">
              {/* Rating */}
              <div className="filter-row">
                <label className="filter-label">
                  Minimum Rating
                  <span className="filter-hint">Supplier score</span>
                </label>
                <div className="filter-control">
                  <div className="rating-options">
                    {[{ value: null, label: 'Any' }, { value: 4, label: '4+ ★' }, { value: 4.5, label: '4.5+ ★' }, { value: 4.8, label: '4.8+ ★' }].map((opt) => (
                      <button
                        key={opt.label}
                        className={`rating-btn ${filters.minRating === opt.value ? 'active' : ''}`}
                        onClick={() => onFilterChange({ ...filters, minRating: opt.value })}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Response Rate */}
              <div className="filter-row">
                <label className="filter-label">
                  Response Rate
                  <span className="filter-hint">Reply within 24h</span>
                </label>
                <div className="filter-control">
                  <select
                    value={filters.minResponseRate || ''}
                    onChange={(e) => onFilterChange({ ...filters, minResponseRate: e.target.value })}
                  >
                    <option value="">Any response rate</option>
                    <option value="90">90%+ (Excellent)</option>
                    <option value="80">80%+ (Very Good)</option>
                    <option value="70">70%+ (Good)</option>
                  </select>
                </div>
              </div>

              {/* Certifications */}
              <div className="filter-row vertical">
                <label className="filter-label">
                  Certifications
                  <span className="filter-hint">Quality & compliance</span>
                </label>
                <div className="cert-chips">
                  {displayedCerts.map((cert) => (
                    <button
                      key={cert}
                      className={`cert-chip ${filters.certifications.includes(cert) ? 'active' : ''}`}
                      onClick={() => toggleCertification(cert)}
                    >
                      {cert}
                    </button>
                  ))}
                  {CERTIFICATIONS.length > 8 && (
                    <button
                      className="show-more-btn"
                      onClick={() => setShowAllCerts(!showAllCerts)}
                    >
                      {showAllCerts ? 'Show less' : `+${CERTIFICATIONS.length - 8} more`}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Location Section */}
        <div className={`filter-section ${expandedSection === 'location' ? 'expanded' : ''}`}>
          <button className="section-header" onClick={() => toggleSection('location')}>
            <span className="section-title">🌍 Supplier Location</span>
            <span className="section-toggle">{expandedSection === 'location' ? '−' : '+'}</span>
          </button>

          {expandedSection === 'location' && (
            <div className="section-content">
              <div className="country-grid">
                {displayedCountries.map((country) => (
                  <button
                    key={country.code}
                    className={`country-chip ${filters.countries.includes(country.name) ? 'active' : ''}`}
                    onClick={() => toggleCountry(country.name)}
                  >
                    <span className="country-flag">{country.flag}</span>
                    <span className="country-name">{country.name}</span>
                  </button>
                ))}
              </div>
              {COUNTRIES.length > 6 && (
                <button
                  className="show-more-countries"
                  onClick={() => setShowAllCountries(!showAllCountries)}
                >
                  {showAllCountries ? '↑ Show less' : `↓ Show all ${COUNTRIES.length} countries`}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Bar - Sticky bottom */}
      <div className="filter-actions">
        <div className="action-info">
          {activeCount > 0 && (
            <span className="results-estimate">Filters will refine your search results</span>
          )}
        </div>
        <div className="action-buttons">
          <button type="button" className="btn-clear" onClick={onClear}>
            Clear All
          </button>
          <button type="button" className="btn-apply" onClick={onApply}>
            Apply Filters {activeCount > 0 && `(${activeCount})`}
          </button>
        </div>
      </div>

      <style jsx>{`
        .filters-panel {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          margin-bottom: 24px;
          animation: slideDown 0.2s ease-out;
          overflow: hidden;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Header */
        .filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-secondary);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .filters-header h3 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .active-badge {
          background: #f97316;
          color: white;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .btn-collapse {
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-collapse:hover {
          border-color: #f97316;
          color: #f97316;
        }

        /* Quick Filters - Top Bar */
        .quick-filters {
          display: flex;
          gap: 8px;
          padding: 14px 20px;
          border-bottom: 1px solid var(--border-color);
          background: rgba(249, 115, 22, 0.02);
          flex-wrap: wrap;
        }

        .quick-toggle {
          padding: 8px 16px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .quick-toggle:hover {
          border-color: rgba(249, 115, 22, 0.5);
          color: var(--text-primary);
        }

        .quick-toggle.active {
          background: rgba(249, 115, 22, 0.1);
          border-color: #f97316;
          color: #f97316;
        }

        /* Filter Sections */
        .filter-sections {
          padding: 0;
        }

        .filter-section {
          border-bottom: 1px solid var(--border-color);
        }

        .filter-section:last-child {
          border-bottom: none;
        }

        .section-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }

        .section-header:hover {
          background: var(--bg-secondary);
        }

        .section-title {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.95rem;
        }

        .section-toggle {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-secondary);
          border-radius: 6px;
          color: var(--text-secondary);
          font-size: 1.1rem;
        }

        .section-content {
          padding: 0 20px 20px;
        }

        /* Filter Row */
        .filter-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          padding: 14px 0;
          border-bottom: 1px dashed var(--border-color);
        }

        .filter-row:last-child {
          border-bottom: none;
        }

        .filter-row.vertical {
          flex-direction: column;
          gap: 12px;
        }

        .filter-label {
          min-width: 140px;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-primary);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .filter-hint {
          font-size: 0.75rem;
          font-weight: 400;
          color: var(--text-muted);
        }

        .filter-control {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        /* Preset Chips */
        .preset-chips {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .preset-chip {
          padding: 5px 12px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          color: var(--text-secondary);
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .preset-chip:hover {
          border-color: rgba(249, 115, 22, 0.5);
        }

        .preset-chip.active {
          background: rgba(249, 115, 22, 0.1);
          border-color: #f97316;
          color: #f97316;
        }

        /* Range Inputs */
        .range-inputs {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .range-inputs input {
          width: 100px;
          padding: 8px 12px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          color: var(--text-primary);
          font-size: 0.9rem;
        }

        .range-inputs input:focus {
          outline: none;
          border-color: #f97316;
        }

        .range-separator {
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        .input-prefix {
          display: flex;
          align-items: center;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          overflow: hidden;
        }

        .input-prefix span {
          padding: 8px 10px;
          background: var(--border-color);
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .input-prefix input {
          border: none;
          background: transparent;
          width: 80px;
        }

        .input-prefix input:focus {
          outline: none;
        }

        /* Select */
        .select-row select {
          width: 100%;
          max-width: 250px;
          padding: 10px 12px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 0.9rem;
          cursor: pointer;
        }

        .select-row select:focus {
          outline: none;
          border-color: #f97316;
        }

        /* Rating Buttons */
        .rating-options {
          display: flex;
          gap: 8px;
        }

        .rating-btn {
          padding: 8px 16px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          color: var(--text-secondary);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .rating-btn:hover {
          border-color: #fbbf24;
          color: #fbbf24;
        }

        .rating-btn.active {
          background: rgba(251, 191, 36, 0.1);
          border-color: #fbbf24;
          color: #fbbf24;
        }

        /* Certification Chips */
        .cert-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .cert-chip {
          padding: 6px 14px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          color: var(--text-secondary);
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cert-chip:hover {
          border-color: rgba(34, 197, 94, 0.5);
        }

        .cert-chip.active {
          background: rgba(34, 197, 94, 0.1);
          border-color: #22c55e;
          color: #22c55e;
        }

        .show-more-btn {
          padding: 6px 14px;
          background: transparent;
          border: 1px dashed var(--border-color);
          border-radius: 6px;
          color: var(--text-muted);
          font-size: 0.8rem;
          cursor: pointer;
        }

        .show-more-btn:hover {
          color: #f97316;
          border-color: #f97316;
        }

        /* Country Grid */
        .country-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 10px;
        }

        .country-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-secondary);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .country-chip:hover {
          border-color: rgba(249, 115, 22, 0.5);
          color: var(--text-primary);
        }

        .country-chip.active {
          background: rgba(249, 115, 22, 0.1);
          border-color: #f97316;
          color: #f97316;
        }

        .country-flag {
          font-size: 1.2rem;
        }

        .show-more-countries {
          display: block;
          width: 100%;
          margin-top: 12px;
          padding: 10px;
          background: transparent;
          border: 1px dashed var(--border-color);
          border-radius: 8px;
          color: var(--text-muted);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .show-more-countries:hover {
          color: #f97316;
          border-color: #f97316;
        }

        /* Action Bar */
        .filter-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-color);
        }

        .action-info {
          flex: 1;
        }

        .results-estimate {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .action-buttons {
          display: flex;
          gap: 12px;
        }

        .btn-clear {
          padding: 10px 20px;
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-secondary);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-clear:hover {
          border-color: #ef4444;
          color: #ef4444;
        }

        .btn-apply {
          padding: 10px 24px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-apply:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
        }

        @media (max-width: 768px) {
          .filter-row {
            flex-direction: column;
            gap: 10px;
          }

          .filter-label {
            min-width: auto;
          }

          .range-inputs {
            width: 100%;
          }

          .range-inputs input {
            flex: 1;
          }

          .country-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .quick-filters {
            padding: 12px;
          }

          .quick-toggle {
            font-size: 0.8rem;
            padding: 6px 12px;
          }

          .filter-actions {
            flex-direction: column;
            gap: 12px;
          }

          .action-buttons {
            width: 100%;
          }

          .btn-clear, .btn-apply {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
}
