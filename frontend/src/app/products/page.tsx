'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/layout/PublicLayout';
import {
  Search, ShoppingCart, Filter, ChevronDown, Star,
  Grid3X3, List, ChevronLeft, ChevronRight, Package,
  MessageCircle, Shield, Truck, Menu, SlidersHorizontal
} from 'lucide-react';
import { safeStorage } from '@/lib/safeStorage';

// Dummy product data
const products = [
  { id: 1, name: 'Wireless Bluetooth Headphones Pro', price: 2499, priceMax: 2999, minOrder: 10, rating: 4.5, reviews: 128, status: 'in_stock', category: 'Electronics', supplier: 'TechGlobal Inc.', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80' },
  { id: 2, name: 'Smart Fitness Watch Series 5', price: 3999, priceMax: 4599, minOrder: 5, rating: 4.8, reviews: 256, status: 'in_stock', category: 'Electronics', supplier: 'FitTech Solutions', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80' },
  { id: 3, name: 'Premium Organic Green Tea', price: 450, priceMax: 650, minOrder: 50, rating: 4.3, reviews: 89, status: 'in_stock', category: 'Food & Beverages', supplier: 'Nature Harvest Co.', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&q=80' },
  { id: 4, name: 'LED Smart Bulb RGB 12W', price: 299, priceMax: 399, minOrder: 100, rating: 4.6, reviews: 342, status: 'in_stock', category: 'Electronics', supplier: 'BrightHome Ltd.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80' },
  { id: 5, name: 'Stainless Steel Water Bottle 1L', price: 599, priceMax: 799, minOrder: 25, rating: 4.4, reviews: 167, status: 'pre_order', category: 'Home & Kitchen', supplier: 'EcoLife Products', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&q=80' },
  { id: 6, name: 'Yoga Mat Premium 6mm', price: 899, priceMax: 1199, minOrder: 20, rating: 4.7, reviews: 203, status: 'in_stock', category: 'Sports & Fitness', supplier: 'FitZone Global', image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=300&q=80' },
  { id: 7, name: 'Portable Power Bank 20000mAh', price: 1299, priceMax: 1599, minOrder: 15, rating: 4.5, reviews: 445, status: 'in_stock', category: 'Electronics', supplier: 'PowerMax Tech', image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&q=80' },
  { id: 8, name: 'Organic Coconut Oil 500ml', price: 350, priceMax: 450, minOrder: 30, rating: 4.8, reviews: 178, status: 'in_stock', category: 'Health & Beauty', supplier: 'Pure Organics', image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=300&q=80' },
  { id: 9, name: 'Wireless Mouse Ergonomic', price: 799, priceMax: 999, minOrder: 20, rating: 4.2, reviews: 92, status: 'pre_order', category: 'Electronics', supplier: 'TechGlobal Inc.', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&q=80' },
  { id: 10, name: 'Cotton T-Shirt Premium', price: 399, priceMax: 599, minOrder: 50, rating: 4.4, reviews: 267, status: 'in_stock', category: 'Fashion', supplier: 'StyleCraft Apparel', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&q=80' },
  { id: 11, name: 'Bamboo Toothbrush Set (4 Pack)', price: 249, priceMax: 349, minOrder: 100, rating: 4.6, reviews: 134, status: 'in_stock', category: 'Health & Beauty', supplier: 'EcoLife Products', image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=300&q=80' },
  { id: 12, name: 'Solar Panel 100W Monocrystalline', price: 4500, priceMax: 5500, minOrder: 5, rating: 4.9, reviews: 56, status: 'pre_order', category: 'Electronics', supplier: 'SolarTech Energy', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=300&q=80' },
];

const categories = [
  { name: 'Electronics', count: 5 },
  { name: 'Health & Beauty', count: 3 },
  { name: 'Fashion', count: 2 },
  { name: 'Home & Kitchen', count: 2 },
  { name: 'Sports & Fitness', count: 2 },
  { name: 'Food & Beverages', count: 1 },
];

const priceRanges = [
  { label: 'All Prices', min: 0, max: 999999 },
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 - ₹1,000', min: 500, max: 1000 },
  { label: '₹1,000 - ₹3,000', min: 1000, max: 3000 },
  { label: '₹3,000 - ₹5,000', min: 3000, max: 5000 },
  { label: 'Above ₹5,000', min: 5000, max: 999999 },
];

export default function ProductsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'in_stock' | 'pre_order' | 'inquiry'>('in_stock');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('All Prices');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const savedTheme = safeStorage.getItem('theme');
    setDarkMode(savedTheme === 'dark');
  }, []);

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    if (product.status !== activeTab) return false;
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false;
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedPriceRange !== 'All Prices') {
      const range = priceRanges.find(r => r.label === selectedPriceRange);
      if (range && (product.price < range.min || product.price > range.max)) return false;
    }
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price_low': return a.price - b.price;
      case 'price_high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'popular': return b.reviews - a.reviews;
      default: return b.id - a.id;
    }
  });

  const inStockCount = products.filter(p => p.status === 'in_stock').length;
  const preOrderCount = products.filter(p => p.status === 'pre_order').length;

  return (
    <PublicLayout>
      <div className={`products-page ${darkMode ? 'dark' : ''}`}>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-bg"></div>
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1>Product Catalog</h1>
            <p>Discover quality products from verified suppliers worldwide</p>

            {/* Search Bar */}
            <div className="search-container">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Status Tabs */}
        <div className="tabs-container">
          <div className="container">
            <div className="status-tabs">
              <button
                className={`status-tab ${activeTab === 'in_stock' ? 'active' : ''}`}
                onClick={() => setActiveTab('in_stock')}
              >
                In Stock
                <span className="tab-count">{inStockCount}</span>
              </button>
              <button
                className={`status-tab ${activeTab === 'pre_order' ? 'active' : ''}`}
                onClick={() => setActiveTab('pre_order')}
              >
                Pre Order
                <span className="tab-count">{preOrderCount}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <section className="main-section">
          <div className="container">
            <div className="main-grid">
              {/* Sidebar Filters */}
              <aside className={`sidebar ${showFilters ? 'show' : ''}`}>
                <div className="sidebar-header">
                  <h3>
                    <SlidersHorizontal size={18} />
                    Filters
                  </h3>
                  <button className="close-filters" onClick={() => setShowFilters(false)}>×</button>
                </div>

                {/* Category Filter */}
                <div className="filter-section">
                  <h4>Category</h4>
                  <div className="filter-options">
                    {categories.map((cat) => (
                      <label key={cat.name} className="checkbox-option">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat.name)}
                          onChange={() => toggleCategory(cat.name)}
                        />
                        <span className="checkmark"></span>
                        <span className="option-label">{cat.name}</span>
                        <span className="option-count">{cat.count}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="filter-section">
                  <h4>Price Range</h4>
                  <div className="filter-options">
                    {priceRanges.map((range) => (
                      <label key={range.label} className="radio-option">
                        <input
                          type="radio"
                          name="price"
                          checked={selectedPriceRange === range.label}
                          onChange={() => setSelectedPriceRange(range.label)}
                        />
                        <span className="radiomark"></span>
                        <span className="option-label">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button className="clear-filters" onClick={() => {
                  setSelectedCategories([]);
                  setSelectedPriceRange('All Prices');
                }}>
                  Clear All Filters
                </button>
              </aside>

              {/* Products Grid */}
              <main className="products-main">
                {/* Controls Bar */}
                <div className="controls-bar">
                  <div className="results-info">
                    <span>{sortedProducts.length} products found</span>
                  </div>
                  <div className="controls-right">
                    <button className="filter-toggle" onClick={() => setShowFilters(true)}>
                      <Filter size={18} />
                      Filters
                    </button>
                    <select
                      className="sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="newest">Newest First</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="popular">Most Popular</option>
                    </select>
                    <div className="view-controls">
                      <button
                        className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                      >
                        <Grid3X3 size={18} />
                      </button>
                      <button
                        className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                      >
                        <List size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product Grid */}
                <div className={`products-grid ${viewMode}`}>
                  {sortedProducts.map(product => (
                    <div key={product.id} className="product-card">
                      <div className="product-image">
                        <img src={product.image} alt={product.name} />
                        <span className={`status-badge ${product.status}`}>
                          {product.status === 'in_stock' ? 'In Stock' : 'Pre Order'}
                        </span>
                      </div>
                      <div className="product-info">
                        <h3 className="product-name">{product.name}</h3>
                        <div className="product-rating">
                          <Star size={14} fill="#FFB800" stroke="#FFB800" />
                          <span>{product.rating}</span>
                          <span className="reviews">({product.reviews})</span>
                        </div>
                        <div className="product-supplier">
                          <Package size={14} />
                          <span>{product.supplier}</span>
                        </div>
                        <div className="product-price">
                          <span className="price">₹{product.price.toLocaleString()}</span>
                          {product.priceMax > product.price && (
                            <span className="price-range"> - ₹{product.priceMax.toLocaleString()}</span>
                          )}
                        </div>
                        <div className="min-order">
                          Min. order: {product.minOrder} pcs
                        </div>
                        <button className={`action-btn ${product.status}`}>
                          {product.status === 'in_stock' ? 'Add to Cart' : 'Pre Order'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {sortedProducts.length === 0 && (
                  <div className="no-results">
                    <Package size={48} />
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or search terms</p>
                  </div>
                )}
              </main>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="trust-section">
          <div className="container">
            <div className="trust-badges">
              <div className="trust-badge">
                <Shield size={32} />
                <div>
                  <h4>Verified Suppliers</h4>
                  <p>All suppliers verified for authenticity</p>
                </div>
              </div>
              <div className="trust-badge">
                <Package size={32} />
                <div>
                  <h4>Quality Assured</h4>
                  <p>Rigorous quality control process</p>
                </div>
              </div>
              <div className="trust-badge">
                <Truck size={32} />
                <div>
                  <h4>Secure Shipping</h4>
                  <p>Track & insure your shipments</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <style jsx>{`
          .products-page {
            background: #ffffff;
          }

          .products-page.dark {
            background: #0f0f0f;
          }

          /* Hero Section */
          .hero-section {
            position: relative;
            padding: 100px 24px 80px;
            text-align: center;
            overflow: hidden;
          }

          .hero-bg {
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #92400e 100%);
          }

          .hero-overlay {
            position: absolute;
            inset: 0;
            background: url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80');
            background-size: cover;
            background-position: center;
            opacity: 0.15;
          }

          .hero-content {
            position: relative;
            z-index: 1;
            max-width: 700px;
            margin: 0 auto;
          }

          .hero-section h1 {
            font-size: 2.75rem;
            font-weight: 800;
            color: white;
            margin-bottom: 12px;
          }

          .hero-section p {
            font-size: 1.125rem;
            color: rgba(255,255,255,0.9);
            margin-bottom: 32px;
          }

          .search-container {
            display: flex;
            align-items: center;
            gap: 12px;
            background: white;
            padding: 16px 24px;
            border-radius: 50px;
            max-width: 500px;
            margin: 0 auto;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          }

          .search-container svg {
            color: #78716c;
          }

          .search-container input {
            flex: 1;
            border: none;
            outline: none;
            font-size: 1rem;
            color: #1c1917;
            background: transparent;
          }

          .products-page.dark .search-container {
            background: #1a1a1a;
          }

          .products-page.dark .search-container input {
            color: #e5e5e5;
          }

          /* Container */
          .container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 24px;
          }

          /* Tabs */
          .tabs-container {
            background: #faf9f7;
            border-bottom: 1px solid #f0eeeb;
          }

          .products-page.dark .tabs-container {
            background: #141414;
            border-bottom-color: #2a2a2a;
          }

          .status-tabs {
            display: flex;
            gap: 8px;
            padding: 16px 0;
          }

          .status-tab {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: transparent;
            border: 2px solid transparent;
            border-radius: 50px;
            font-size: 0.9375rem;
            font-weight: 600;
            color: #78716c;
            cursor: pointer;
            transition: all 0.2s;
          }

          .status-tab:hover {
            color: #f59e0b;
          }

          .status-tab.active {
            background: #f59e0b;
            color: white;
          }

          .tab-count {
            background: rgba(0,0,0,0.1);
            padding: 2px 8px;
            border-radius: 20px;
            font-size: 0.8125rem;
          }

          .status-tab.active .tab-count {
            background: rgba(255,255,255,0.2);
          }

          /* Main Section */
          .main-section {
            padding: 40px 0 80px;
            background: #faf9f7;
          }

          .products-page.dark .main-section {
            background: #141414;
          }

          .main-grid {
            display: grid;
            grid-template-columns: 280px 1fr;
            gap: 32px;
          }

          /* Sidebar */
          .sidebar {
            background: white;
            border-radius: 20px;
            padding: 24px;
            height: fit-content;
            position: sticky;
            top: 100px;
            border: 1px solid #f0eeeb;
          }

          .products-page.dark .sidebar {
            background: #1a1a1a;
            border-color: #2a2a2a;
          }

          .sidebar-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid #f0eeeb;
          }

          .products-page.dark .sidebar-header {
            border-bottom-color: #2a2a2a;
          }

          .sidebar-header h3 {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 1.125rem;
            font-weight: 700;
            color: #1c1917;
          }

          .products-page.dark .sidebar-header h3 {
            color: #ffffff;
          }

          .close-filters {
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #78716c;
            cursor: pointer;
          }

          .filter-section {
            margin-bottom: 24px;
          }

          .filter-section h4 {
            font-size: 0.9375rem;
            font-weight: 600;
            color: #1c1917;
            margin-bottom: 16px;
          }

          .products-page.dark .filter-section h4 {
            color: #ffffff;
          }

          .filter-options {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .checkbox-option,
          .radio-option {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 0;
            cursor: pointer;
            position: relative;
          }

          .checkbox-option input,
          .radio-option input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
          }

          .checkmark,
          .radiomark {
            width: 20px;
            height: 20px;
            border: 2px solid #d6d3d1;
            border-radius: 4px;
            flex-shrink: 0;
            transition: all 0.2s;
          }

          .radiomark {
            border-radius: 50%;
          }

          .checkbox-option:hover .checkmark,
          .radio-option:hover .radiomark {
            border-color: #f59e0b;
          }

          .checkbox-option input:checked ~ .checkmark,
          .radio-option input:checked ~ .radiomark {
            background: #f59e0b;
            border-color: #f59e0b;
          }

          .checkbox-option input:checked ~ .checkmark::after {
            content: '✓';
            position: absolute;
            left: 4px;
            top: 8px;
            color: white;
            font-size: 0.75rem;
            font-weight: bold;
          }

          .radio-option input:checked ~ .radiomark::after {
            content: '';
            position: absolute;
            left: 6px;
            top: 14px;
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
          }

          .option-label {
            flex: 1;
            font-size: 0.9rem;
            color: #57534e;
          }

          .products-page.dark .option-label {
            color: #a8a29e;
          }

          .option-count {
            font-size: 0.8125rem;
            color: #a8a29e;
          }

          .clear-filters {
            width: 100%;
            padding: 12px;
            margin-top: 16px;
            background: none;
            border: 1px solid #f59e0b;
            border-radius: 12px;
            color: #f59e0b;
            font-weight: 600;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all 0.2s;
          }

          .clear-filters:hover {
            background: #f59e0b;
            color: white;
          }

          /* Products Main */
          .products-main {
            min-height: 500px;
          }

          .controls-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
          }

          .results-info span {
            font-size: 0.9375rem;
            color: #78716c;
          }

          .controls-right {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .filter-toggle {
            display: none;
            align-items: center;
            gap: 8px;
            padding: 10px 16px;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            font-size: 0.875rem;
            font-weight: 500;
            color: #57534e;
            cursor: pointer;
          }

          .sort-select {
            padding: 10px 16px;
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            background: white;
            font-size: 0.875rem;
            color: #57534e;
            cursor: pointer;
          }

          .products-page.dark .sort-select {
            background: #1a1a1a;
            border-color: #2a2a2a;
            color: #a8a29e;
          }

          .view-controls {
            display: flex;
            gap: 4px;
          }

          .view-btn {
            padding: 10px;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            color: #78716c;
            cursor: pointer;
            transition: all 0.2s;
          }

          .products-page.dark .view-btn {
            background: #1a1a1a;
            border-color: #2a2a2a;
          }

          .view-btn.active {
            background: #f59e0b;
            border-color: #f59e0b;
            color: white;
          }

          /* Product Grid */
          .products-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }

          .products-grid.list {
            grid-template-columns: 1fr;
          }

          .product-card {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            transition: all 0.3s;
            border: 1px solid #f0eeeb;
          }

          .products-page.dark .product-card {
            background: #1a1a1a;
            border-color: #2a2a2a;
          }

          .product-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 40px rgba(0,0,0,0.1);
          }

          .product-image {
            position: relative;
            height: 200px;
            overflow: hidden;
          }

          .product-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.4s ease;
          }

          .product-card:hover .product-image img {
            transform: scale(1.05);
          }

          .status-badge {
            position: absolute;
            top: 12px;
            left: 12px;
            padding: 6px 12px;
            border-radius: 50px;
            font-size: 0.75rem;
            font-weight: 600;
          }

          .status-badge.in_stock {
            background: #dcfce7;
            color: #16a34a;
          }

          .status-badge.pre_order {
            background: #fef3c7;
            color: #d97706;
          }

          .product-info {
            padding: 20px;
          }

          .product-name {
            font-size: 1rem;
            font-weight: 600;
            color: #1c1917;
            margin-bottom: 10px;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .products-page.dark .product-name {
            color: #ffffff;
          }

          .product-rating {
            display: flex;
            align-items: center;
            gap: 4px;
            margin-bottom: 8px;
            font-size: 0.875rem;
            color: #1c1917;
          }

          .products-page.dark .product-rating {
            color: #e5e5e5;
          }

          .product-rating .reviews {
            color: #78716c;
            font-size: 0.8125rem;
          }

          .product-supplier {
            display: flex;
            align-items: center;
            gap: 6px;
            color: #78716c;
            font-size: 0.8125rem;
            margin-bottom: 12px;
          }

          .product-price {
            margin-bottom: 8px;
          }

          .product-price .price {
            font-size: 1.25rem;
            font-weight: 700;
            color: #f59e0b;
          }

          .product-price .price-range {
            color: #78716c;
            font-size: 0.9375rem;
          }

          .min-order {
            color: #78716c;
            font-size: 0.8125rem;
            margin-bottom: 16px;
          }

          .action-btn {
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all 0.2s;
          }

          .action-btn.in_stock {
            background: #f59e0b;
            color: white;
          }

          .action-btn.in_stock:hover {
            background: #d97706;
          }

          .action-btn.pre_order {
            background: transparent;
            color: #d97706;
            border: 2px solid #d97706;
          }

          .action-btn.pre_order:hover {
            background: #fef3c7;
          }

          /* No Results */
          .no-results {
            text-align: center;
            padding: 80px 20px;
            color: #78716c;
          }

          .no-results svg {
            margin-bottom: 16px;
            opacity: 0.5;
          }

          .no-results h3 {
            font-size: 1.25rem;
            color: #1c1917;
            margin-bottom: 8px;
          }

          .products-page.dark .no-results h3 {
            color: #ffffff;
          }

          /* Trust Section */
          .trust-section {
            background: white;
            padding: 60px 0;
            border-top: 1px solid #f0eeeb;
          }

          .products-page.dark .trust-section {
            background: #0f0f0f;
            border-top-color: #2a2a2a;
          }

          .trust-badges {
            display: flex;
            justify-content: center;
            gap: 64px;
          }

          .trust-badge {
            display: flex;
            align-items: center;
            gap: 16px;
          }

          .trust-badge svg {
            color: #f59e0b;
          }

          .trust-badge h4 {
            font-size: 1rem;
            font-weight: 600;
            color: #1c1917;
            margin-bottom: 4px;
          }

          .products-page.dark .trust-badge h4 {
            color: #ffffff;
          }

          .trust-badge p {
            font-size: 0.875rem;
            color: #78716c;
          }

          /* Responsive */
          @media (max-width: 1024px) {
            .main-grid {
              grid-template-columns: 1fr;
            }

            .sidebar {
              display: none;
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              z-index: 1000;
              border-radius: 0;
              overflow-y: auto;
            }

            .sidebar.show {
              display: block;
            }

            .close-filters {
              display: block;
            }

            .filter-toggle {
              display: flex;
            }

            .products-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (max-width: 768px) {
            .hero-section h1 {
              font-size: 2rem;
            }

            .products-grid {
              grid-template-columns: 1fr;
            }

            .trust-badges {
              flex-direction: column;
              gap: 24px;
            }

            .controls-bar {
              flex-wrap: wrap;
              gap: 12px;
            }

            .controls-right {
              width: 100%;
              justify-content: space-between;
            }
          }
        `}</style>
      </div>
    </PublicLayout>
  );
}
