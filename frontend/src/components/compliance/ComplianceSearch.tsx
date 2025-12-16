'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Search, X, Info, TrendingUp, Filter } from 'lucide-react';
import { ComplianceSearchParams } from '@/types/compliance';
import { getAllHSNCodes, getAllCategories } from '@/services/complianceService';
import styles from './ComplianceSearch.module.css';

interface ComplianceSearchProps {
  onSearch: (params: ComplianceSearchParams) => void;
  isLoading?: boolean;
  placeholder?: string;
  showFilters?: boolean;
}

export function ComplianceSearch({
  onSearch,
  isLoading = false,
  placeholder = 'Search by HSN code or product description...',
  showFilters = true
}: ComplianceSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ code: string; description: string }>>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Common trading partner countries
  const countries = [
    'China',
    'USA',
    'Germany',
    'Japan',
    'Singapore',
    'UAE',
    'Thailand',
    'Vietnam',
    'Korea',
    'Malaysia'
  ];

  useEffect(() => {
    // Load categories
    const allCategories = getAllCategories();
    setCategories(allCategories);
  }, []);

  useEffect(() => {
    // Generate suggestions based on search query
    if (searchQuery.length > 1) {
      const allHSNCodes = getAllHSNCodes();
      const filtered = allHSNCodes.filter(
        item =>
          item.code.includes(searchQuery) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearch = useCallback(() => {
    const params: ComplianceSearchParams = {
      query: searchQuery,
      category: selectedCategory,
      countryOfOrigin: selectedCountry
    };

    // Remove empty params
    Object.keys(params).forEach(key => {
      if (!params[key as keyof ComplianceSearchParams]) {
        delete params[key as keyof ComplianceSearchParams];
      }
    });

    onSearch(params);
    setShowSuggestions(false);
  }, [searchQuery, selectedCategory, selectedCountry, onSearch]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const selectSuggestion = (suggestion: { code: string; description: string }) => {
    setSearchQuery(suggestion.code);
    setShowSuggestions(false);
    const params: ComplianceSearchParams = {
      hsnCode: suggestion.code,
      category: selectedCategory,
      countryOfOrigin: selectedCountry
    };
    onSearch(params);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedCountry('');
    setShowSuggestions(false);
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.mainSearchWrapper}>
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} size={20} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          {searchQuery && (
            <button
              className={styles.clearButton}
              onClick={clearSearch}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
          <button
            className={styles.searchButton}
            onClick={handleSearch}
            disabled={isLoading || !searchQuery}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {showFilters && (
          <button
            className={styles.filterToggle}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Filter size={16} />
            Filters
            {(selectedCategory || selectedCountry) && (
              <span className={styles.filterBadge}>
                {(selectedCategory ? 1 : 0) + (selectedCountry ? 1 : 0)}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className={styles.suggestions}>
          <div className={styles.suggestionHeader}>
            <TrendingUp size={14} />
            <span>Suggestions</span>
          </div>
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.code}
              className={styles.suggestionItem}
              onClick={() => selectSuggestion(suggestion)}
            >
              <span className={styles.suggestionCode}>{suggestion.code}</span>
              <span className={styles.suggestionDescription}>
                {suggestion.description}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Advanced Filters */}
      {showFilters && showAdvancedFilters && (
        <div className={styles.filtersPanel}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Category</label>
            <select
              className={styles.filterSelect}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Country of Origin</label>
            <select
              className={styles.filterSelect}
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="">All Countries</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <button
            className={styles.applyFiltersButton}
            onClick={handleSearch}
            disabled={isLoading}
          >
            Apply Filters
          </button>

          {(selectedCategory || selectedCountry) && (
            <button
              className={styles.clearFiltersButton}
              onClick={() => {
                setSelectedCategory('');
                setSelectedCountry('');
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Search Tips */}
      <div className={styles.searchTips}>
        <Info size={14} />
        <span>
          Tip: You can search by HSN code (e.g., "8517" for telecom equipment) or product description (e.g., "smartphones")
        </span>
      </div>
    </div>
  );
}

export default ComplianceSearch;