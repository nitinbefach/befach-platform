'use client';

import { AppLayout } from '@/components/layout';
import Link from 'next/link';

const trendingProducts = [
  { name: 'Solar Panels', growth: '+45%', category: 'Renewable Energy', origin: 'China' },
  { name: 'EV Batteries', growth: '+38%', category: 'Automotive', origin: 'South Korea' },
  { name: 'LED Lighting', growth: '+28%', category: 'Electronics', origin: 'Vietnam' },
  { name: 'Organic Spices', growth: '+22%', category: 'Food & Beverage', origin: 'India' },
  { name: 'Medical Devices', growth: '+20%', category: 'Healthcare', origin: 'Germany' },
  { name: 'Textiles', growth: '+18%', category: 'Fashion', origin: 'Bangladesh' },
];

const trendingMarkets = [
  { country: 'Vietnam', flag: '🇻🇳', trend: 'Rising', products: 'Electronics, Textiles' },
  { country: 'Bangladesh', flag: '🇧🇩', trend: 'Hot', products: 'Garments, Jute' },
  { country: 'Indonesia', flag: '🇮🇩', trend: 'Rising', products: 'Palm Oil, Rubber' },
  { country: 'Thailand', flag: '🇹🇭', trend: 'Stable', products: 'Auto Parts, Rice' },
];

export default function TrendingPage() {
  return (
    <AppLayout>
      <div className="page-header">
        <h1>Trending Products & Markets</h1>
        <p>Discover what&apos;s hot in global trade right now</p>
      </div>

      {/* Trending Products */}
      <section className="section">
        <h2 className="section-title">Trending Products</h2>
        <div className="products-grid">
          {trendingProducts.map((product, idx) => (
            <div key={idx} className="product-card">
              <div className="product-header">
                <h3>{product.name}</h3>
                <span className="growth">{product.growth}</span>
              </div>
              <div className="product-meta">
                <span className="category">{product.category}</span>
                <span className="origin">From {product.origin}</span>
              </div>
              <Link href="/smart-sourcing" className="find-btn">
                Find Suppliers →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Markets */}
      <section className="section">
        <h2 className="section-title">Trending Source Markets</h2>
        <div className="markets-grid">
          {trendingMarkets.map((market, idx) => (
            <div key={idx} className="market-card">
              <div className="market-header">
                <span className="flag">{market.flag}</span>
                <div>
                  <h3>{market.country}</h3>
                  <span className={`trend-badge ${market.trend.toLowerCase()}`}>
                    {market.trend}
                  </span>
                </div>
              </div>
              <p className="products">Top imports: {market.products}</p>
              <Link href="/market-insights" className="explore-link">
                View Data →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <style jsx>{`
        .page-header {
          margin-bottom: 30px;
        }
        .page-header h1 {
          color: var(--text-primary);
          font-size: 1.8em;
          margin-bottom: 5px;
        }
        .page-header p {
          color: var(--text-secondary);
        }
        .section {
          margin-bottom: 40px;
        }
        .section-title {
          color: var(--text-primary);
          font-size: 1.3em;
          margin-bottom: 20px;
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .product-card {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s;
        }
        .product-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px var(--shadow-hover);
        }
        .product-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .product-header h3 {
          color: var(--text-primary);
          font-size: 1.1em;
        }
        .growth {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 4px 10px;
          border-radius: 15px;
          font-size: 0.85em;
          font-weight: 600;
        }
        .product-meta {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
        }
        .category, .origin {
          color: var(--text-secondary);
          font-size: 0.85em;
        }
        .find-btn {
          color: var(--accent-primary);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9em;
        }
        .markets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }
        .market-card {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 20px;
        }
        .market-header {
          display: flex;
          gap: 15px;
          align-items: center;
          margin-bottom: 12px;
        }
        .flag {
          font-size: 2.5em;
        }
        .market-header h3 {
          color: var(--text-primary);
          margin-bottom: 5px;
        }
        .trend-badge {
          font-size: 0.75em;
          padding: 3px 8px;
          border-radius: 10px;
          font-weight: 600;
        }
        .trend-badge.hot {
          background: #fee2e2;
          color: #dc2626;
        }
        .trend-badge.rising {
          background: #dcfce7;
          color: #16a34a;
        }
        .trend-badge.stable {
          background: #e0f2fe;
          color: #0284c7;
        }
        .products {
          color: var(--text-secondary);
          font-size: 0.9em;
          margin-bottom: 12px;
        }
        .explore-link {
          color: var(--accent-primary);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9em;
        }
      `}</style>
    </AppLayout>
  );
}

