'use client';

import { useState, useEffect } from 'react';
import { EximSidebarFilters } from '@/types/exim';
import { eximDataService } from '@/services/eximDataService';

interface EximFiltersSidebarProps {
  filters: EximSidebarFilters;
  onChange: (filters: EximSidebarFilters) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function EximFiltersSidebar({ filters, onChange, collapsed, onToggleCollapse }: EximFiltersSidebarProps) {
  const [allConsignees, setAllConsignees] = useState<string[]>([]);
  const [allShippers, setAllShippers] = useState<string[]>([]);
  const [consigneeSearch, setConsigneeSearch] = useState('');
  const [shipperSearch, setShipperSearch] = useState('');

  useEffect(() => {
    eximDataService.getUniqueConsignees().then(setAllConsignees);
    eximDataService.getUniqueShippers().then(setAllShippers);
  }, []);

  const toggleFilter = (key: keyof EximSidebarFilters) => {
    if (typeof filters[key] === 'boolean') {
      onChange({ ...filters, [key]: !filters[key] });
    }
  };

  const filteredConsignees = allConsignees.filter(c =>
    c.toLowerCase().includes(consigneeSearch.toLowerCase())
  );

  const filteredShippers = allShippers.filter(s =>
    s.toLowerCase().includes(shipperSearch.toLowerCase())
  );

  const toggleConsignee = (name: string) => {
    const current = filters.consigneeFilter;
    onChange({
      ...filters,
      consigneeFilter: current.includes(name)
        ? current.filter(c => c !== name)
        : [...current, name],
    });
  };

  const toggleShipper = (name: string) => {
    const current = filters.shipperFilter;
    onChange({
      ...filters,
      shipperFilter: current.includes(name)
        ? current.filter(s => s !== name)
        : [...current, name],
    });
  };

  if (collapsed) {
    return (
      <div className="filter-sidebar collapsed">
        <button className="collapse-btn" onClick={onToggleCollapse} title="Show Filters">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        <style jsx>{`
          .filter-sidebar.collapsed {
            width: 36px;
            min-width: 36px;
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            padding-top: 10px;
          }
          .collapse-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px;
            color: var(--text-secondary);
            border-radius: 4px;
          }
          .collapse-btn:hover {
            background: var(--bg-secondary);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="filter-sidebar">
      <div className="filter-header">
        <h3 className="filter-title">FILTERS</h3>
        <button className="collapse-btn" onClick={onToggleCollapse} title="Hide Filters">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      <div className="filter-content">
        {/* Toggle switches */}
        <div className="toggle-group">
          <ToggleSwitch
            label="Remove duplicate shipments"
            checked={filters.removeDuplicates}
            onChange={() => toggleFilter('removeDuplicates')}
          />
          <ToggleSwitch
            label="Remove To order/NA companies"
            checked={filters.removeToOrder}
            onChange={() => toggleFilter('removeToOrder')}
          />
          <ToggleSwitch
            label="Remove Banking Entity"
            checked={filters.removeBankingEntity}
            onChange={() => toggleFilter('removeBankingEntity')}
          />
          <ToggleSwitch
            label="Remove Shipping Entity"
            checked={filters.removeShippingEntity}
            onChange={() => toggleFilter('removeShippingEntity')}
          />
        </div>

        {/* Consignee filter */}
        <div className="filter-section">
          <h4 className="section-title">Consignee (Raw)</h4>
          <div className="select-from-btn">
            Select from {allConsignees.length}
          </div>
          <input
            type="text"
            className="filter-search"
            placeholder="Search..."
            value={consigneeSearch}
            onChange={e => setConsigneeSearch(e.target.value)}
          />
          {consigneeSearch && (
            <div className="filter-list">
              {filteredConsignees.map(c => (
                <label key={c} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.consigneeFilter.includes(c)}
                    onChange={() => toggleConsignee(c)}
                  />
                  <span className="checkbox-label">{c}</span>
                </label>
              ))}
            </div>
          )}
          {filters.consigneeFilter.length > 0 && (
            <div className="active-filters">
              {filters.consigneeFilter.map(c => (
                <span key={c} className="active-tag">
                  {c.substring(0, 20)}...
                  <button onClick={() => toggleConsignee(c)}>&times;</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Shipper filter */}
        <div className="filter-section">
          <h4 className="section-title">Shipper (Raw)</h4>
          <div className="select-from-btn">
            Select from {allShippers.length}
          </div>
          <input
            type="text"
            className="filter-search"
            placeholder="Search..."
            value={shipperSearch}
            onChange={e => setShipperSearch(e.target.value)}
          />
          {shipperSearch && (
            <div className="filter-list">
              {filteredShippers.map(s => (
                <label key={s} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.shipperFilter.includes(s)}
                    onChange={() => toggleShipper(s)}
                  />
                  <span className="checkbox-label">{s}</span>
                </label>
              ))}
            </div>
          )}
          {filters.shipperFilter.length > 0 && (
            <div className="active-filters">
              {filters.shipperFilter.map(s => (
                <span key={s} className="active-tag">
                  {s.substring(0, 20)}...
                  <button onClick={() => toggleShipper(s)}>&times;</button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .filter-sidebar {
          width: 260px;
          min-width: 260px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .filter-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: #2563eb;
          color: white;
        }
        .filter-title {
          font-size: 0.813rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin: 0;
        }
        .collapse-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          color: white;
          border-radius: 4px;
          display: flex;
          align-items: center;
        }
        .collapse-btn:hover {
          background: rgba(255,255,255,0.15);
        }
        .filter-content {
          padding: 12px;
          overflow-y: auto;
          max-height: calc(100vh - 400px);
        }
        .toggle-group {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 16px;
        }
        .filter-section {
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-color);
        }
        .section-title {
          font-size: 0.813rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 8px 0;
        }
        .select-from-btn {
          padding: 8px 12px;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          font-size: 0.8rem;
          color: var(--text-secondary);
          text-align: center;
          margin-bottom: 8px;
        }
        .filter-search {
          width: 100%;
          padding: 8px 10px;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          font-size: 0.8rem;
          background: var(--bg-secondary, #fff);
          color: var(--text-primary);
          margin-bottom: 6px;
        }
        .filter-list {
          max-height: 150px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .filter-checkbox {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          padding: 4px 0;
          cursor: pointer;
          font-size: 0.75rem;
        }
        .filter-checkbox input {
          margin-top: 2px;
          flex-shrink: 0;
        }
        .checkbox-label {
          color: var(--text-primary);
          line-height: 1.3;
          word-break: break-word;
        }
        .active-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: 8px;
        }
        .active-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          background: #dbeafe;
          color: #1e40af;
          border-radius: 4px;
          font-size: 0.7rem;
        }
        .active-tag button {
          background: none;
          border: none;
          color: #1e40af;
          cursor: pointer;
          font-size: 0.85rem;
          padding: 0 2px;
        }
      `}</style>
    </div>
  );
}

// Toggle switch sub-component
function ToggleSwitch({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="toggle-switch">
      <div className="toggle-info">
        <span className="toggle-label">{label}</span>
      </div>
      <button
        className={`toggle-track ${checked ? 'active' : ''}`}
        onClick={onChange}
        role="switch"
        aria-checked={checked}
      >
        <span className="toggle-thumb" />
      </button>
      <style jsx>{`
        .toggle-switch {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 8px 0;
          cursor: pointer;
        }
        .toggle-label {
          font-size: 0.78rem;
          color: var(--text-primary);
          line-height: 1.3;
        }
        .toggle-track {
          width: 38px;
          height: 20px;
          border-radius: 10px;
          background: #cbd5e1;
          border: none;
          cursor: pointer;
          position: relative;
          transition: background 0.2s;
          flex-shrink: 0;
        }
        .toggle-track.active {
          background: #2563eb;
        }
        .toggle-thumb {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          transition: transform 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        .toggle-track.active .toggle-thumb {
          transform: translateX(18px);
        }
      `}</style>
    </label>
  );
}
