'use client';

import { AppLayout } from '@/components/layout';
import Link from 'next/link';

export default function ShippingCalculatorPage() {
  return (
    <AppLayout>
      <div className="page-header">
        <h1>Shipping Cost Calculator</h1>
        <p>Calculate shipping costs for your imports</p>
      </div>

      <div className="calculator-card">
        <div className="coming-soon">
          <span className="icon">🚢</span>
          <h2>Coming Soon</h2>
          <p>We&apos;re building a comprehensive shipping calculator that will help you:</p>
          <ul>
            <li>Compare air vs sea freight costs</li>
            <li>Get instant quotes from multiple carriers</li>
            <li>Calculate transit times</li>
            <li>Factor in insurance and handling fees</li>
          </ul>
          <Link href="/cost-calculator" className="btn-primary">
            Try Cost Calculator Instead
          </Link>
        </div>
      </div>

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
        .calculator-card {
          background: var(--card-bg);
          border-radius: 16px;
          padding: 60px 40px;
          text-align: center;
        }
        .coming-soon .icon {
          font-size: 4em;
          display: block;
          margin-bottom: 20px;
        }
        .coming-soon h2 {
          color: var(--text-primary);
          font-size: 1.8em;
          margin-bottom: 15px;
        }
        .coming-soon p {
          color: var(--text-secondary);
          margin-bottom: 20px;
        }
        .coming-soon ul {
          list-style: none;
          padding: 0;
          margin-bottom: 30px;
        }
        .coming-soon li {
          color: var(--text-secondary);
          padding: 8px 0;
        }
        .coming-soon li::before {
          content: "✓ ";
          color: var(--accent-primary);
        }
        .btn-primary {
          display: inline-block;
          background: var(--accent-gradient);
          color: white;
          padding: 14px 30px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 53, 0.3);
        }
      `}</style>
    </AppLayout>
  );
}

