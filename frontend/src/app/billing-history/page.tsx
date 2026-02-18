'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { CreditCard, Undo2, Gift, DollarSign, BarChart3, Download, Landmark, Lightbulb } from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  orderId?: string;
  amount: number;
  type: 'payment' | 'refund' | 'credit';
  status: 'completed' | 'pending' | 'failed';
  invoiceUrl?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: 'TXN-2024-001',
    date: 'Nov 15, 2024',
    description: 'Order Payment - Organic Turmeric Powder',
    orderId: 'ORD-2024-0847',
    amount: 125000,
    type: 'payment',
    status: 'completed',
    invoiceUrl: '#'
  },
  {
    id: 'TXN-2024-002',
    date: 'Nov 10, 2024',
    description: 'Order Payment - Black Pepper Premium',
    orderId: 'ORD-2024-0812',
    amount: 195000,
    type: 'payment',
    status: 'completed',
    invoiceUrl: '#'
  },
  {
    id: 'TXN-2024-003',
    date: 'Oct 28, 2024',
    description: 'Referral Credit',
    amount: 5000,
    type: 'credit',
    status: 'completed'
  },
  {
    id: 'TXN-2024-004',
    date: 'Oct 20, 2024',
    description: 'Partial Refund - Quality Issue',
    orderId: 'ORD-2024-0756',
    amount: 12000,
    type: 'refund',
    status: 'completed'
  },
  {
    id: 'TXN-2024-005',
    date: 'Oct 15, 2024',
    description: 'Order Payment - Cinnamon Sticks',
    orderId: 'ORD-2024-0756',
    amount: 85000,
    type: 'payment',
    status: 'completed',
    invoiceUrl: '#'
  },
];

export default function BillingHistoryPage() {
  const [filter, setFilter] = useState<'all' | Transaction['type']>('all');
  const [dateRange, setDateRange] = useState<'30' | '90' | '365' | 'all'>('90');

  const filteredTransactions = mockTransactions.filter(txn => {
    if (filter !== 'all' && txn.type !== filter) return false;
    return true;
  });

  const totalPayments = mockTransactions
    .filter(t => t.type === 'payment' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalCredits = mockTransactions
    .filter(t => (t.type === 'credit' || t.type === 'refund') && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const formatAmount = (amount: number, type: Transaction['type']) => {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);

    if (type === 'credit' || type === 'refund') {
      return `+${formatted}`;
    }
    return formatted;
  };

  const getStatusBadge = (status: Transaction['status']) => {
    const colors = {
      completed: { bg: '#d1fae5', text: '#065f46' },
      pending: { bg: '#fef3c7', text: '#92400e' },
      failed: { bg: '#fee2e2', text: '#991b1b' }
    };
    return colors[status];
  };

  const getTypeIcon = (type: Transaction['type']): React.ReactNode => {
    switch (type) {
      case 'payment': return <CreditCard size={20} />;
      case 'refund': return <Undo2 size={20} />;
      case 'credit': return <Gift size={20} />;
    }
  };

  return (
    <AppLayout>
      <div className="content-header">
        <h1><DollarSign size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} /> Billing History</h1>
        <p>View your transactions and download invoices</p>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <span className="summary-icon"><CreditCard size={24} /></span>
          <div className="summary-content">
            <span className="summary-label">Total Payments</span>
            <span className="summary-value">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalPayments)}
            </span>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon"><Gift size={24} /></span>
          <div className="summary-content">
            <span className="summary-label">Credits & Refunds</span>
            <span className="summary-value green">
              +{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalCredits)}
            </span>
          </div>
        </div>
        <div className="summary-card">
          <span className="summary-icon"><BarChart3 size={24} /></span>
          <div className="summary-content">
            <span className="summary-label">This Year</span>
            <span className="summary-value">{mockTransactions.length} Transactions</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label>Type:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
            <option value="all">All Transactions</option>
            <option value="payment">Payments</option>
            <option value="refund">Refunds</option>
            <option value="credit">Credits</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Period:</label>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value as typeof dateRange)}>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
            <option value="all">All time</option>
          </select>
        </div>
        <button className="btn-export">
          <Download size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Export CSV
        </button>
      </div>

      {/* Transactions Table */}
      <div className="transactions-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Transaction</th>
              <th>Date</th>
              <th>Order</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(txn => (
              <tr key={txn.id}>
                <td>
                  <div className="txn-info">
                    <span className="txn-icon">{getTypeIcon(txn.type)}</span>
                    <div>
                      <span className="txn-desc">{txn.description}</span>
                      <span className="txn-id">{txn.id}</span>
                    </div>
                  </div>
                </td>
                <td>{txn.date}</td>
                <td>
                  {txn.orderId ? (
                    <span className="order-link">{txn.orderId}</span>
                  ) : (
                    <span className="no-order">—</span>
                  )}
                </td>
                <td>
                  <span className={`amount ${txn.type === 'credit' || txn.type === 'refund' ? 'credit' : ''}`}>
                    {formatAmount(txn.amount, txn.type)}
                  </span>
                </td>
                <td>
                  <span 
                    className="status-badge"
                    style={{ 
                      background: getStatusBadge(txn.status).bg,
                      color: getStatusBadge(txn.status).text
                    }}
                  >
                    {txn.status}
                  </span>
                </td>
                <td>
                  {txn.invoiceUrl ? (
                    <a href={txn.invoiceUrl} className="download-link">
                      Download
                    </a>
                  ) : (
                    <span className="no-invoice">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Methods */}
      <div className="payment-methods-section">
        <h2><CreditCard size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} /> Payment Methods</h2>
        <div className="payment-methods">
          <div className="payment-method">
            <div className="pm-icon"><Landmark size={24} /></div>
            <div className="pm-info">
              <strong>Bank Transfer (NEFT/RTGS)</strong>
              <p>Primary payment method</p>
            </div>
            <span className="pm-default">Default</span>
          </div>
          <div className="payment-method">
            <div className="pm-icon"><CreditCard size={24} /></div>
            <div className="pm-info">
              <strong>Credit/Debit Card</strong>
              <p>For small transactions</p>
            </div>
          </div>
        </div>
        <p className="payment-note">
          <Lightbulb size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Contact support to update payment methods or request alternative payment options.
        </p>
      </div>

      <style jsx>{`
        .summary-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }
        .summary-card {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 25px;
          display: flex;
          gap: 15px;
          align-items: center;
        }
        .summary-icon {
          font-size: 2.5em;
        }
        .summary-content {
          display: flex;
          flex-direction: column;
        }
        .summary-label {
          color: var(--text-secondary);
          font-size: 0.9em;
        }
        .summary-value {
          color: var(--text-primary);
          font-size: 1.4em;
          font-weight: 700;
        }
        .summary-value.green {
          color: #10b981;
        }
        .filters {
          display: flex;
          gap: 20px;
          margin-bottom: 25px;
          align-items: center;
        }
        .filter-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .filter-group label {
          color: var(--text-secondary);
          font-size: 0.9em;
        }
        .filter-group select {
          padding: 10px 15px;
          border: 2px solid var(--border-color);
          border-radius: 8px;
          background: var(--card-bg);
          color: var(--text-primary);
        }
        .btn-export {
          margin-left: auto;
          background: var(--bg-tertiary);
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          color: var(--text-primary);
          cursor: pointer;
          font-weight: 500;
        }
        .btn-export:hover {
          background: var(--accent-primary);
          color: white;
        }
        .transactions-container {
          background: var(--card-bg);
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 30px;
        }
        .transactions-table {
          width: 100%;
          border-collapse: collapse;
        }
        .transactions-table th {
          text-align: left;
          padding: 15px 20px;
          background: var(--bg-tertiary);
          color: var(--text-secondary);
          font-size: 0.85em;
          font-weight: 600;
        }
        .transactions-table td {
          padding: 18px 20px;
          border-bottom: 1px solid var(--border-color);
        }
        .transactions-table tr:last-child td {
          border-bottom: none;
        }
        .txn-info {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .txn-icon {
          font-size: 1.3em;
        }
        .txn-desc {
          display: block;
          color: var(--text-primary);
          font-weight: 500;
        }
        .txn-id {
          display: block;
          color: var(--text-muted);
          font-size: 0.85em;
          font-family: monospace;
        }
        .order-link {
          color: var(--accent-primary);
          font-family: monospace;
          font-size: 0.9em;
          cursor: pointer;
        }
        .no-order, .no-invoice {
          color: var(--text-muted);
        }
        .amount {
          font-weight: 600;
          color: var(--text-primary);
        }
        .amount.credit {
          color: #10b981;
        }
        .status-badge {
          padding: 5px 12px;
          border-radius: 15px;
          font-size: 0.8em;
          font-weight: 600;
          text-transform: capitalize;
        }
        .download-link {
          color: var(--accent-primary);
          text-decoration: none;
          font-weight: 500;
        }
        .download-link:hover {
          opacity: 0.8;
        }
        .payment-methods-section {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 25px;
        }
        .payment-methods-section h2 {
          color: var(--text-primary);
          margin-bottom: 20px;
          font-size: 1.2em;
        }
        .payment-methods {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-bottom: 15px;
        }
        .payment-method {
          display: flex;
          gap: 15px;
          padding: 15px;
          background: var(--bg-tertiary);
          border-radius: 10px;
          align-items: center;
        }
        .pm-icon {
          font-size: 1.8em;
        }
        .pm-info {
          flex: 1;
        }
        .pm-info strong {
          color: var(--text-primary);
          display: block;
        }
        .pm-info p {
          color: var(--text-secondary);
          font-size: 0.85em;
          margin: 3px 0 0 0;
        }
        .pm-default {
          background: var(--accent-primary);
          color: white;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.75em;
          font-weight: 600;
        }
        .payment-note {
          color: var(--text-secondary);
          font-size: 0.9em;
          margin: 0;
        }
        @media (max-width: 768px) {
          .summary-cards {
            grid-template-columns: 1fr;
          }
          .filters {
            flex-wrap: wrap;
          }
          .btn-export {
            margin-left: 0;
            width: 100%;
          }
          .transactions-container {
            overflow-x: auto;
          }
          .transactions-table {
            min-width: 700px;
          }
          .payment-methods {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </AppLayout>
  );
}

