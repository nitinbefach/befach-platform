'use client';

import { useState } from 'react';
import { RequirementStatus, STATUS_CONFIG } from '@/lib/requirements';

interface RequirementFiltersProps {
  activeStatus: RequirementStatus | null;
  onStatusChange: (status: RequirementStatus | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewRequirement: () => void;
}

export default function RequirementFilters({
  activeStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
  onNewRequirement,
}: RequirementFiltersProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const statusOptions: (RequirementStatus | 'all')[] = [
    'all',
    'matching',
    'quoted',
    'negotiating',
    'completed',
  ];

  return (
    <div className="filters-container">
      <div className="filters-left">
        {/* Status Filter Pills */}
        <div className="status-pills">
          {statusOptions.map((status) => {
            const isActive = status === 'all' ? activeStatus === null : activeStatus === status;
            const config = status !== 'all' ? STATUS_CONFIG[status] : null;

            return (
              <button
                key={status}
                className={`pill ${isActive ? 'active' : ''}`}
                onClick={() => onStatusChange(status === 'all' ? null : status)}
                style={
                  isActive && config
                    ? { backgroundColor: config.bgColor, color: config.color, borderColor: config.color }
                    : undefined
                }
              >
                {status === 'all' ? 'All' : config?.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="filters-right">
        {/* Search Input */}
        <div className={`search-wrapper ${isSearchFocused ? 'focused' : ''}`}>
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search requirements..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          {searchQuery && (
            <button className="clear-btn" onClick={() => onSearchChange('')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>

        {/* New Requirement Button */}
        <button className="btn-new" onClick={onNewRequirement}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Requirement
        </button>
      </div>

      <style jsx>{`
        .filters-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .filters-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .status-pills {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .pill {
          padding: 8px 16px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pill:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }

        .pill.active {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          color: white;
        }

        .filters-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-wrapper input {
          width: 220px;
          padding: 10px 12px 10px 38px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-size: 0.9rem;
          color: var(--text-primary);
          transition: all 0.2s ease;
        }

        .search-wrapper.focused input {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        .search-wrapper input::placeholder {
          color: var(--text-muted);
        }

        .search-icon {
          position: absolute;
          left: 12px;
          width: 16px;
          height: 16px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .clear-btn {
          position: absolute;
          right: 8px;
          padding: 4px;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .clear-btn svg {
          width: 14px;
          height: 14px;
          color: var(--text-muted);
        }

        .clear-btn:hover svg {
          color: var(--text-primary);
        }

        .btn-new {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: var(--accent-gradient);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-new svg {
          width: 18px;
          height: 18px;
        }

        .btn-new:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
        }

        @media (max-width: 768px) {
          .filters-container {
            flex-direction: column;
            align-items: stretch;
          }

          .filters-left,
          .filters-right {
            width: 100%;
          }

          .status-pills {
            overflow-x: auto;
            padding-bottom: 4px;
          }

          .search-wrapper input {
            width: 100%;
            flex: 1;
          }

          .search-wrapper {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
}
