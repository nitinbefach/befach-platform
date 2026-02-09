'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
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

  // Default date range: last 6 months
  useEffect(() => {
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    setDateTo(now.toISOString().split('T')[0]);
    setDateFrom(sixMonthsAgo.toISOString().split('T')[0]);
  }, []);

  // Click outside to close suggestions
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
      <div className="search-row country-row">
        <div className="field-group">
          <label className="field-label">Select Country</label>
          <select
            className="search-select country-select"
            value={`${country}-${dataType}`}
            onChange={(e) => {
              const [c, dt] = e.target.value.split('-');
              setCountry(c);
              setDataType(dt as EximDataType);
            }}
          >
            {EXIM_COUNTRIES.map(c => (
              EXIM_DATA_TYPES.map(dt => (
                <option key={`${c.name}-${dt.id}`} value={`${c.name}-${dt.id}`}>
                  {c.flag} {c.name} {dt.label}
                </option>
              ))
            ))}
          </select>
        </div>

        <div className="date-range-group">
          <div className="date-field">
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="date-input" />
          </div>
          <span className="date-separator">to</span>
          <div className="date-field">
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="date-input" />
          </div>
        </div>
      </div>

      {/* Row 2: Search Field + Operator + Tags Input */}
      <div className="search-row query-row">
        <div className="field-group field-type">
          <label className="field-label">Search Field</label>
          <select
            className="search-select"
            value={searchField}
            onChange={e => setSearchField(e.target.value as EximSearchField)}
          >
            {EXIM_SEARCH_FIELDS.map(f => (
              <option key={f.id} value={f.id}>{f.label}</option>
            ))}
          </select>
        </div>

        <div className="field-group field-operator">
          <label className="field-label">Operator</label>
          <select
            className="search-select"
            value={operator}
            onChange={e => setOperator(e.target.value as EximOperator)}
          >
            {EXIM_OPERATORS.map(o => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="field-group field-input" ref={suggestionsRef}>
          <label className="field-label">Search Terms</label>
          <div className="tags-input-wrapper">
            {searchTerms.map((term, i) => (
              <span key={i} className="search-tag">
                {term}
                <button className="tag-remove" onClick={() => removeTerm(i)}>&times;</button>
              </span>
            ))}
            <input
              ref={inputRef}
              type="text"
              className="tags-input"
              placeholder={searchTerms.length === 0 ? (currentFieldConfig?.placeholder || 'Search...') : 'Add more...'}
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

      {/* Row 3: Buttons */}
      <div className="search-row button-row">
        <button className="btn-reset" onClick={handleReset}>Reset</button>
        <button className="btn-search" onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <style jsx>{`
        .exim-search-bar {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .search-row {
          display: flex;
          gap: 12px;
          align-items: flex-end;
        }
        .country-row {
          flex-wrap: wrap;
        }
        .field-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .field-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .search-select {
          height: 40px;
          padding: 0 12px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: var(--bg-secondary, #fff);
          color: var(--text-primary);
          font-size: 0.875rem;
          cursor: pointer;
          min-width: 140px;
        }
        .country-select {
          min-width: 240px;
          flex: 1;
        }
        .date-range-group {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: auto;
        }
        .date-input {
          height: 40px;
          padding: 0 10px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: var(--bg-secondary, #fff);
          color: var(--text-primary);
          font-size: 0.8rem;
        }
        .date-separator {
          color: var(--text-secondary);
          font-size: 0.8rem;
        }
        .query-row {
          flex-wrap: wrap;
        }
        .field-type {
          min-width: 130px;
        }
        .field-operator {
          min-width: 130px;
        }
        .field-input {
          flex: 1;
          min-width: 250px;
          position: relative;
        }
        .tags-input-wrapper {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 6px 10px;
          min-height: 40px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: var(--bg-secondary, #fff);
          align-items: center;
          cursor: text;
        }
        .tags-input-wrapper:focus-within {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
        }
        .search-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          background: #dbeafe;
          color: #1e40af;
          border-radius: 4px;
          font-size: 0.813rem;
          font-weight: 500;
          white-space: nowrap;
        }
        .tag-remove {
          background: none;
          border: none;
          color: #1e40af;
          cursor: pointer;
          font-size: 1rem;
          line-height: 1;
          padding: 0 2px;
          opacity: 0.7;
        }
        .tag-remove:hover {
          opacity: 1;
        }
        .tags-input {
          flex: 1;
          min-width: 120px;
          border: none;
          outline: none;
          background: transparent;
          font-size: 0.875rem;
          color: var(--text-primary);
          padding: 2px 0;
        }
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
          max-height: 240px;
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
          border-bottom: 1px solid var(--border-color);
        }
        .suggestion-item:last-child {
          border-bottom: none;
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
          font-size: 0.75rem;
          color: var(--text-secondary);
          white-space: nowrap;
        }
        .button-row {
          justify-content: flex-start;
          gap: 10px;
        }
        .btn-reset {
          height: 40px;
          padding: 0 24px;
          border-radius: 20px;
          border: none;
          background: #6b7280;
          color: white;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
        }
        .btn-reset:hover {
          background: #4b5563;
        }
        .btn-search {
          height: 40px;
          padding: 0 32px;
          border-radius: 20px;
          border: none;
          background: #2563eb;
          color: white;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
        }
        .btn-search:hover {
          background: #1d4ed8;
        }
        .btn-search:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        @media (max-width: 768px) {
          .exim-search-bar {
            padding: 16px;
          }
          .search-row {
            flex-direction: column;
            align-items: stretch;
          }
          .country-select {
            min-width: 100%;
          }
          .date-range-group {
            margin-left: 0;
            flex-wrap: wrap;
          }
          .field-type, .field-operator {
            min-width: 100%;
          }
          .field-input {
            min-width: 100%;
          }
          .button-row {
            flex-direction: row;
          }
        }
      `}</style>
    </div>
  );
}
