'use client';

import { useState, useEffect, useRef } from 'react';
import { CATEGORIES, getSearchHistory, SearchHistoryItem } from '@/lib/suppliers';

interface HeroSearchProps {
  onSearch: (query: string, category: string | null) => void;
  onToggleFilters: () => void;
  showFilters: boolean;
  initialQuery?: string;
  initialCategory?: string | null;
}

export default function HeroSearch({
  onSearch,
  onToggleFilters,
  showFilters,
  initialQuery = '',
  initialCategory = null,
}: HeroSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    onSearch(query, selectedCategory);
    setShowHistory(false);
  };

  const handleHistoryClick = (historyQuery: string) => {
    setQuery(historyQuery);
    setShowHistory(false);
    onSearch(historyQuery, selectedCategory);
  };

  const handlePopularClick = (term: string) => {
    setQuery(term);
    onSearch(term, selectedCategory);
  };

  const popularSearches = [
    'LED Lighting',
    'Vitamins',
    'Smart Watches',
    'Protein Powder',
    'Earbuds',
    'Power Bank',
  ];

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>Find Your Perfect Supplier</h1>
        <p>Search our network of 100+ verified partner suppliers</p>

        <form className="search-box" onSubmit={handleSubmit}>
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              ref={inputRef}
              type="text"
              placeholder="Describe what you're looking for... (e.g., LED bulbs, vitamins, smart watches)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => searchHistory.length > 0 && setShowHistory(true)}
              onBlur={() => setTimeout(() => setShowHistory(false), 200)}
            />
            <button type="submit" className="search-btn">
              Search Now
            </button>
          </div>

          {/* Search History Dropdown */}
          {showHistory && searchHistory.length > 0 && (
            <div className="history-dropdown">
              <div className="history-header">Recent Searches</div>
              {searchHistory.slice(0, 5).map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="history-item"
                  onClick={() => handleHistoryClick(item.query)}
                >
                  <span className="history-icon">🕒</span>
                  <span className="history-query">{item.query}</span>
                  <span className="history-count">{item.resultCount} results</span>
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            className="filters-toggle"
            onClick={onToggleFilters}
          >
            {showFilters ? '▲ Hide Filters' : '▼ Advanced Filters'}
          </button>
        </form>

        {/* Category Pills */}
        <div className="category-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => {
                const newCategory = selectedCategory === cat.id ? null : cat.id;
                setSelectedCategory(newCategory);
                if (query) onSearch(query, newCategory);
              }}
            >
              <span className="cat-icon">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Popular Searches */}
        <div className="popular-searches">
          <span>Popular:</span>
          {popularSearches.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => handlePopularClick(term)}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .hero-section {
          padding: 50px 24px;
          text-align: center;
          background: linear-gradient(180deg, rgba(249, 115, 22, 0.08) 0%, transparent 100%);
          border-radius: 20px;
          margin-bottom: 24px;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-content h1 {
          font-size: 2.2rem;
          font-weight: 700;
          margin: 0 0 12px;
          background: linear-gradient(135deg, #f97316, #fb923c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-content > p {
          color: var(--text-secondary);
          font-size: 1.05rem;
          margin: 0 0 28px;
        }

        .search-box {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 16px;
          position: relative;
        }

        .search-input-wrapper {
          display: flex;
          gap: 12px;
          align-items: center;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 4px 4px 4px 16px;
        }

        .search-icon {
          font-size: 1.25rem;
        }

        .search-input-wrapper input {
          flex: 1;
          background: none;
          border: none;
          color: var(--text-primary);
          font-size: 1rem;
          padding: 12px 0;
          outline: none;
        }

        .search-input-wrapper input::placeholder {
          color: var(--text-muted);
        }

        .search-btn {
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .search-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
        }

        .filters-toggle {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          margin-top: 12px;
          font-size: 0.9rem;
          transition: color 0.2s;
        }

        .filters-toggle:hover {
          color: #f97316;
        }

        .history-dropdown {
          position: absolute;
          top: 100%;
          left: 20px;
          right: 20px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          margin-top: 8px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          z-index: 100;
          overflow: hidden;
        }

        .history-header {
          padding: 12px 16px;
          font-size: 0.8rem;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border-color);
        }

        .history-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 12px 16px;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          color: var(--text-primary);
          transition: background 0.2s;
        }

        .history-item:hover {
          background: var(--bg-hover);
        }

        .history-icon {
          font-size: 0.9rem;
          opacity: 0.6;
        }

        .history-query {
          flex: 1;
        }

        .history-count {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .category-pills {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .category-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.9rem;
        }

        .category-pill:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }

        .category-pill.active {
          background: rgba(249, 115, 22, 0.1);
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }

        .cat-icon {
          font-size: 1rem;
        }

        .popular-searches {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .popular-searches > span {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .popular-searches button {
          background: rgba(249, 115, 22, 0.08);
          border: 1px solid rgba(249, 115, 22, 0.2);
          color: #fb923c;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .popular-searches button:hover {
          background: rgba(249, 115, 22, 0.15);
        }

        @media (max-width: 768px) {
          .hero-content h1 {
            font-size: 1.6rem;
          }

          .search-input-wrapper {
            flex-direction: column;
            padding: 12px;
          }

          .search-btn {
            width: 100%;
          }

          .category-pills {
            gap: 8px;
          }

          .category-pill {
            padding: 6px 12px;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </section>
  );
}
