'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { EximSearchField, EximOperator, EximDataType, EximSearchParams, SearchSuggestion } from '@/types/exim';
import { EXIM_COUNTRIES, EXIM_SEARCH_FIELDS, EXIM_OPERATORS, EXIM_DATA_TYPES } from '@/lib/eximConstants';
import { eximDataService } from '@/services/eximDataService';

interface EximSearchBarProps {
  onSearch: (params: EximSearchParams) => void;
  loading?: boolean;
}

export default function EximSearchBar({ onSearch, loading }: EximSearchBarProps) {
  const [country, setCountry] = useState('India');
  const [dataType, setDataType] = useState<EximDataType>('import');
  const [searchField, setSearchField] = useState<EximSearchField>('product');
  const [operator, setOperator] = useState<EximOperator>('contains');
  const [searchTerms, setSearchTerms] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    setDateTo(now.toISOString().split('T')[0]);
    setDateFrom(sixMonthsAgo.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    const results = await eximDataService.getSuggestions(searchField, query);
    setSuggestions(results);
    setShowSuggestions(results.length > 0);
  }, [searchField]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 250);
  };

  const addTerm = (term: string) => {
    const trimmed = term.trim();
    if (trimmed && !searchTerms.includes(trimmed)) {
      setSearchTerms([...searchTerms, trimmed]);
    }
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeTerm = (index: number) => {
    setSearchTerms(searchTerms.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addTerm(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && searchTerms.length > 0) {
      removeTerm(searchTerms.length - 1);
    }
  };

  const handleSearch = () => {
    const allTerms = inputValue.trim()
      ? [...searchTerms, inputValue.trim()]
      : searchTerms;

    onSearch({
      country,
      dataType,
      searchField,
      operator,
      searchTerms: allTerms.length > 0 ? allTerms : [''],
      dateFrom,
      dateTo,
    });
  };

  const handleReset = () => {
    setSearchTerms([]);
    setInputValue('');
    setSearchField('product');
    setOperator('contains');
    setDataType('import');
    setCountry('India');
    setSuggestions([]);
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    setDateTo(now.toISOString().split('T')[0]);
    setDateFrom(sixMonthsAgo.toISOString().split('T')[0]);
  };

  const currentFieldConfig = EXIM_SEARCH_FIELDS.find(f => f.id === searchField);

  return (
    <div className="exim-search-bar">
      {/* Row 1: Country + Data Type */}
      <div className="form-row row-country">
        <div className="field-group">
          <label className="field-label">Select Country</label>
          <select
            className="form-input"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            {EXIM_COUNTRIES.map(c => (
              <option key={c.code} value={c.name}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field-group">
          <label className="field-label">Data Type</label>
          <div className="type-toggle">
            {EXIM_DATA_TYPES.map(dt => (
              <button
                key={dt.id}
                type="button"
                className={`type-btn ${dataType === dt.id ? 'active' : ''}`}
                onClick={() => setDataType(dt.id)}
              >
                {dt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Date Range */}
      <div className="form-row row-dates">
        <div className="field-group">
          <label className="field-label">Start Date</label>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="form-input" />
        </div>
        <div className="field-group">
          <label className="field-label">End Date</label>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="form-input" />
        </div>
      </div>

      {/* Row 3: Search Field + Operator + Terms */}
      <div className="form-row row-search">
        <div className="field-group">
          <label className="field-label">Search Field</label>
          <select
            className="form-input"
            value={searchField}
            onChange={e => setSearchField(e.target.value as EximSearchField)}
          >
            {EXIM_SEARCH_FIELDS.map(f => (
              <option key={f.id} value={f.id}>{f.label}</option>
            ))}
          </select>
        </div>

        <div className="field-group">
          <label className="field-label">Operator</label>
          <select
            className="form-input"
            value={operator}
            onChange={e => setOperator(e.target.value as EximOperator)}
          >
            {EXIM_OPERATORS.map(o => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="field-group terms-field" ref={suggestionsRef}>
          <label className="field-label">Search Terms</label>
          <div className="tags-input-wrapper">
            {searchTerms.map((term, i) => (
              <span key={i} className="search-tag">
                {term}
                <button type="button" className="tag-remove" onClick={() => removeTerm(i)}>&times;</button>
              </span>
            ))}
            <input
              ref={inputRef}
              type="text"
              className="tags-input"
              placeholder={searchTerms.length === 0 ? (currentFieldConfig?.placeholder || 'Type and press Enter...') : 'Add more...'}
              value={inputValue}
              onChange={e => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            />
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((s, i) => (
                <button key={i} className="suggestion-item" onClick={() => addTerm(s.text)}>
                  <span className="suggestion-text">{s.text}</span>
                  <span className="suggestion-count">{s.matchCount} records</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Row 4: Buttons */}
      <div className="form-row row-actions">
        <button type="button" className="btn-reset" onClick={handleReset}>
          <RotateCcw size={14} />
          Reset
        </button>
        <button type="button" className="btn-search" onClick={handleSearch} disabled={loading}>
          <Search size={14} />
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <style jsx>{`
        /* ── Container ── */
        .exim-search-bar {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* ── Shared row structure ── */
        .form-row {
          display: grid;
          gap: 16px;
        }

        /* ── Row 1: Country + Type ── */
        .row-country {
          grid-template-columns: 1fr auto;
        }

        /* ── Row 2: Dates ── */
        .row-dates {
          grid-template-columns: 1fr 1fr;
        }

        /* ── Row 3: Search ── */
        .row-search {
          grid-template-columns: 160px 160px 1fr;
        }

        /* ── Row 4: Buttons ── */
        .row-actions {
          grid-template-columns: auto auto 1fr;
          align-items: center;
          gap: 10px;
        }

        /* ── Field groups ── */
        .field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .field-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        /* ── Form inputs ── */
        .form-input {
          height: 42px;
          padding: 0 12px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: var(--bg-secondary, #f9fafb);
          color: var(--text-primary);
          font-size: 0.875rem;
          cursor: pointer;
          transition: border-color 0.15s;
          width: 100%;
        }
        .form-input:focus {
          outline: none;
          border-color: #f97316;
        }

        /* ── Data type toggle ── */
        .type-toggle {
          display: flex;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
          height: 42px;
        }
        .type-btn {
          flex: 1;
          border: none;
          background: var(--bg-secondary, #f9fafb);
          color: var(--text-secondary);
          font-size: 0.84rem;
          font-weight: 500;
          cursor: pointer;
          padding: 0 20px;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .type-btn.active {
          background: #f97316;
          color: white;
          font-weight: 600;
        }
        .type-btn:not(.active):hover {
          background: var(--bg-tertiary, #f1f5f9);
        }

        /* ── Tags input ── */
        .terms-field {
          position: relative;
        }
        .tags-input-wrapper {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 6px 12px;
          min-height: 42px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: var(--bg-secondary, #f9fafb);
          align-items: center;
          cursor: text;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .tags-input-wrapper:focus-within {
          border-color: #f97316;
          box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.1);
        }
        .search-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 10px;
          background: rgba(249, 115, 22, 0.1);
          color: #ea580c;
          border-radius: 5px;
          font-size: 0.8rem;
          font-weight: 500;
          white-space: nowrap;
        }
        .tag-remove {
          background: none;
          border: none;
          color: #ea580c;
          cursor: pointer;
          font-size: 1rem;
          line-height: 1;
          padding: 0 2px;
          opacity: 0.6;
        }
        .tag-remove:hover { opacity: 1; }
        .tags-input {
          flex: 1;
          min-width: 100px;
          border: none;
          outline: none;
          background: transparent;
          font-size: 0.875rem;
          color: var(--text-primary);
          padding: 2px 0;
        }

        /* ── Suggestions ── */
        .suggestions-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 4px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          z-index: 50;
          max-height: 220px;
          overflow-y: auto;
        }
        .suggestion-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 10px 14px;
          border: none;
          background: none;
          cursor: pointer;
          text-align: left;
          font-size: 0.84rem;
          color: var(--text-primary);
          transition: background 0.1s;
        }
        .suggestion-item:not(:last-child) {
          border-bottom: 1px solid var(--border-color);
        }
        .suggestion-item:hover {
          background: var(--bg-secondary, #f0f4f8);
        }
        .suggestion-text {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: 12px;
        }
        .suggestion-count {
          font-size: 0.72rem;
          color: var(--text-secondary);
          white-space: nowrap;
        }

        /* ── Buttons ── */
        .btn-reset {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          height: 40px;
          padding: 0 20px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary, #f9fafb);
          color: var(--text-secondary);
          font-size: 0.84rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }
        .btn-reset:hover {
          border-color: var(--text-secondary);
          color: var(--text-primary);
        }
        .btn-search {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          height: 40px;
          padding: 0 28px;
          border-radius: 8px;
          border: none;
          background: #f97316;
          color: white;
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
        }
        .btn-search:hover {
          background: #ea580c;
        }
        .btn-search:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* ── Responsive: tablet ── */
        @media (max-width: 1024px) {
          .row-search {
            grid-template-columns: 1fr 1fr;
          }
          .terms-field {
            grid-column: 1 / -1;
          }
        }

        /* ── Responsive: mobile (inside BottomSheet) ── */
        @media (max-width: 768px) {
          .exim-search-bar {
            padding: 0;
            border: none;
            background: transparent;
            gap: 18px;
          }

          .form-row {
            gap: 14px;
          }

          .field-label {
            font-size: 0.74rem;
          }

          /* Row 1: stack country + type */
          .row-country {
            grid-template-columns: 1fr;
          }

          /* Row 2: side by side dates */
          .row-dates {
            grid-template-columns: 1fr 1fr;
          }

          /* Row 3: stack all */
          .row-search {
            grid-template-columns: 1fr 1fr;
          }
          .terms-field {
            grid-column: 1 / -1;
          }

          /* Row 4: buttons side by side */
          .row-actions {
            grid-template-columns: 1fr 2fr;
          }

          .form-input {
            height: 48px;
            padding: 0 14px;
            font-size: 0.9rem;
            border-radius: 10px;
          }

          .type-toggle {
            height: 48px;
            border-radius: 10px;
          }
          .type-btn {
            font-size: 0.9rem;
          }

          .tags-input-wrapper {
            min-height: 48px;
            border-radius: 10px;
            padding: 8px 12px;
          }
          .tags-input {
            min-width: 80px;
            font-size: 0.9rem;
          }

          .btn-reset {
            height: 50px;
            border-radius: 10px;
            font-size: 0.88rem;
            width: 100%;
          }
          .btn-search {
            height: 50px;
            border-radius: 10px;
            font-size: 0.88rem;
            width: 100%;
            padding: 0;
          }
        }

        @media (max-width: 480px) {
          .row-dates {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }
          .row-search {
            grid-template-columns: 1fr;
          }
          .terms-field {
            grid-column: auto;
          }
        }
      `}</style>
    </div>
  );
}
