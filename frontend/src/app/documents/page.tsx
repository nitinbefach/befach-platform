'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useFeedbackTrigger } from '@/hooks/useFeedbackTrigger';
import { Receipt, ClipboardList, Ship, Package, ScrollText, Landmark, FileText, BookOpen, Check, Clock, Pause } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'invoice' | 'boe' | 'shipping' | 'packing' | 'certificate' | 'customs';
  orderId: string;
  orderName: string;
  date: string;
  size: string;
  status: 'ready' | 'pending' | 'processing';
}

const mockDocuments: Document[] = [
  {
    id: 'DOC-001',
    name: 'Commercial Invoice',
    type: 'invoice',
    orderId: 'ORD-2024-0847',
    orderName: 'Organic Turmeric Powder',
    date: 'Nov 20, 2024',
    size: '245 KB',
    status: 'ready'
  },
  {
    id: 'DOC-002',
    name: 'Bill of Entry',
    type: 'boe',
    orderId: 'ORD-2024-0847',
    orderName: 'Organic Turmeric Powder',
    date: 'Nov 22, 2024',
    size: '180 KB',
    status: 'processing'
  },
  {
    id: 'DOC-003',
    name: 'Bill of Lading',
    type: 'shipping',
    orderId: 'ORD-2024-0847',
    orderName: 'Organic Turmeric Powder',
    date: 'Nov 20, 2024',
    size: '312 KB',
    status: 'ready'
  },
  {
    id: 'DOC-004',
    name: 'Packing List',
    type: 'packing',
    orderId: 'ORD-2024-0847',
    orderName: 'Organic Turmeric Powder',
    date: 'Nov 19, 2024',
    size: '156 KB',
    status: 'ready'
  },
  {
    id: 'DOC-005',
    name: 'Certificate of Origin',
    type: 'certificate',
    orderId: 'ORD-2024-0847',
    orderName: 'Organic Turmeric Powder',
    date: 'Nov 18, 2024',
    size: '198 KB',
    status: 'ready'
  },
  {
    id: 'DOC-006',
    name: 'Commercial Invoice',
    type: 'invoice',
    orderId: 'ORD-2024-0812',
    orderName: 'Black Pepper - Premium Grade',
    date: 'Nov 14, 2024',
    size: '220 KB',
    status: 'ready'
  },
  {
    id: 'DOC-007',
    name: 'Customs Declaration',
    type: 'customs',
    orderId: 'ORD-2024-0812',
    orderName: 'Black Pepper - Premium Grade',
    date: 'Nov 26, 2024',
    size: '275 KB',
    status: 'pending'
  },
];

const typeIcons: Record<Document['type'], React.ReactNode> = {
  invoice: <Receipt size={16} />,
  boe: <ClipboardList size={16} />,
  shipping: <Ship size={16} />,
  packing: <Package size={16} />,
  certificate: <ScrollText size={16} />,
  customs: <Landmark size={16} />
};

const typeLabels: Record<Document['type'], string> = {
  invoice: 'Invoice',
  boe: 'Bill of Entry',
  shipping: 'Shipping',
  packing: 'Packing List',
  certificate: 'Certificate',
  customs: 'Customs'
};

export default function DocumentsPage() {
  const { triggerTimeBasedFeedback, promptElement } = useFeedbackTrigger();
  const [filter, setFilter] = useState<'all' | Document['type']>('all');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    triggerTimeBasedFeedback('document-management', 25000);
  }, [triggerTimeBasedFeedback]);

  const uniqueOrders = Array.from(new Set(mockDocuments.map(d => d.orderId))).map(id => ({
    id,
    name: mockDocuments.find(d => d.orderId === id)?.orderName || id
  }));

  const filteredDocuments = mockDocuments.filter(doc => {
    if (filter !== 'all' && doc.type !== filter) return false;
    if (orderFilter !== 'all' && doc.orderId !== orderFilter) return false;
    if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleDownload = (doc: Document) => {
    // Simulate download
    alert(`Downloading ${doc.name}...`);
  };

  const handleViewAll = (orderId: string) => {
    setOrderFilter(orderId);
    setFilter('all');
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'ready': return '#10b981';
      case 'processing': return '#f59e0b';
      case 'pending': return '#6b7280';
    }
  };

  return (
    <AppLayout>      <div className="content-header">
        <h1><FileText size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} /> My Documents</h1>
        <p>Access all your import documents in one place</p>      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
          />
        </div>

        <div className="filter-group">
          <label>Order:</label>
          <select value={orderFilter} onChange={(e) => setOrderFilter(e.target.value)}>
            <option value="all">All Orders</option>
            {uniqueOrders.map(order => (
              <option key={order.id} value={order.id}>{order.id}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Type:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
            <option value="all">All Types</option>
            {Object.entries(typeLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents by Order */}
      {orderFilter === 'all' ? (
        uniqueOrders.map(order => {
          const orderDocs = filteredDocuments.filter(d => d.orderId === order.id);
          if (orderDocs.length === 0) return null;

          return (
            <div key={order.id} className="order-docs-section">
              <div className="order-docs-header">
                <div>
                  <span className="order-id">{order.id}</span>
                  <h3>{order.name}</h3>
                </div>
                <button 
                  className="view-all-btn"
                  onClick={() => handleViewAll(order.id)}
                >
                  View All ({orderDocs.length}) →
                </button>
              </div>

              <div className="docs-grid">
                {orderDocs.slice(0, 4).map(doc => (
                  <div key={doc.id} className="doc-card">
                    <div className="doc-icon">{typeIcons[doc.type]}</div>
                    <div className="doc-info">
                      <h4>{doc.name}</h4>
                      <p>{doc.date} • {doc.size}</p>
                    </div>
                    <div className="doc-actions">
                      <span 
                        className="doc-status"
                        style={{ color: getStatusColor(doc.status) }}
                      >
                        {doc.status === 'ready' ? <><Check size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 2 }} /> Ready</> :
                         doc.status === 'processing' ? <><Clock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 2 }} /> Processing</> : <><Pause size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 2 }} /> Pending</>}
                      </span>
                      {doc.status === 'ready' && (
                        <button 
                          className="download-btn"
                          onClick={() => handleDownload(doc)}
                        >
                          ↓
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <div className="docs-list-view">
          <button 
            className="back-btn"
            onClick={() => setOrderFilter('all')}
          >
            ← All Orders
          </button>

          <div className="selected-order-header">
            <span className="order-id">{orderFilter}</span>
            <h2>{uniqueOrders.find(o => o.id === orderFilter)?.name}</h2>
          </div>

          <div className="docs-table">
            <table>
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Size</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map(doc => (
                  <tr key={doc.id}>
                    <td>
                      <div className="doc-name-cell">
                        <span className="doc-type-icon">{typeIcons[doc.type]}</span>
                        {doc.name}
                      </div>
                    </td>
                    <td>{typeLabels[doc.type]}</td>
                    <td>{doc.date}</td>
                    <td>{doc.size}</td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ background: getStatusColor(doc.status) }}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td>
                      {doc.status === 'ready' ? (
                        <button 
                          className="btn-download"
                          onClick={() => handleDownload(doc)}
                        >
                          Download
                        </button>
                      ) : (
                        <span className="not-available">Not Available</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="help-section">
        <h3><BookOpen size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} /> Document Guide</h3>
        <div className="help-grid">
          {Object.entries(typeLabels).map(([key, label]) => (
            <div key={key} className="help-item">
              <span className="help-icon">{typeIcons[key as Document['type']]}</span>
              <div>
                <strong>{label}</strong>
                <p>
                  {key === 'invoice' && 'Details of goods, prices, and payment terms'}
                  {key === 'boe' && 'Required for customs clearance in India'}
                  {key === 'shipping' && 'Bill of Lading or Airway Bill'}
                  {key === 'packing' && 'Details of packaging and contents'}
                  {key === 'certificate' && 'Proof of origin for duty benefits'}
                  {key === 'customs' && 'Customs declaration forms'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .filters-section {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
          flex-wrap: wrap;
          align-items: center;
        }
        .search-box {
          flex: 1;
          min-width: 200px;
        }
        .search-box input {
          width: 100%;
          padding: 12px 18px;
          border: 2px solid var(--border-color);
          border-radius: 10px;
          background: var(--card-bg);
          color: var(--text-primary);
          font-size: 0.95em;
        }
        .search-box input:focus {
          outline: none;
          border-color: var(--accent-primary);
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
          font-size: 0.9em;
        }
        .order-docs-section {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 25px;
        }
        .order-docs-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .order-id {
          font-family: monospace;
          font-size: 0.85em;
          color: var(--text-secondary);
        }
        .order-docs-header h3 {
          color: var(--text-primary);
          margin-top: 5px;
        }
        .view-all-btn {
          background: none;
          border: none;
          color: var(--accent-primary);
          font-weight: 600;
          cursor: pointer;
        }
        .docs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 15px;
        }
        .doc-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: var(--bg-tertiary);
          border-radius: 10px;
          transition: all 0.2s;
        }
        .doc-card:hover {
          background: var(--bg-hover);
        }
        .doc-icon {
          font-size: 1.8em;
        }
        .doc-info {
          flex: 1;
        }
        .doc-info h4 {
          color: var(--text-primary);
          font-size: 0.95em;
          margin-bottom: 3px;
        }
        .doc-info p {
          color: var(--text-secondary);
          font-size: 0.8em;
          margin: 0;
        }
        .doc-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }
        .doc-status {
          font-size: 0.8em;
          font-weight: 600;
        }
        .download-btn {
          width: 32px;
          height: 32px;
          background: var(--accent-gradient);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1em;
        }
        .back-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          margin-bottom: 15px;
        }
        .back-btn:hover {
          color: var(--accent-primary);
        }
        .selected-order-header {
          margin-bottom: 25px;
        }
        .selected-order-header h2 {
          color: var(--text-primary);
          margin-top: 5px;
        }
        .docs-table {
          background: var(--card-bg);
          border-radius: 12px;
          overflow: hidden;
        }
        .docs-table table {
          width: 100%;
          border-collapse: collapse;
        }
        .docs-table th {
          text-align: left;
          padding: 15px 20px;
          background: var(--bg-tertiary);
          color: var(--text-secondary);
          font-size: 0.85em;
          font-weight: 600;
          text-transform: uppercase;
        }
        .docs-table td {
          padding: 15px 20px;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-primary);
        }
        .docs-table tr:last-child td {
          border-bottom: none;
        }
        .doc-name-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .doc-type-icon {
          font-size: 1.3em;
        }
        .status-badge {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.8em;
          color: white;
          text-transform: capitalize;
        }
        .btn-download {
          background: var(--accent-primary);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85em;
        }
        .not-available {
          color: var(--text-muted);
          font-size: 0.9em;
        }
        .help-section {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 25px;
          margin-top: 30px;
        }
        .help-section h3 {
          color: var(--text-primary);
          margin-bottom: 20px;
        }
        .help-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }
        .help-item {
          display: flex;
          gap: 12px;
        }
        .help-icon {
          font-size: 1.5em;
        }
        .help-item strong {
          color: var(--text-primary);
          display: block;
          margin-bottom: 3px;
        }
        .help-item p {
          color: var(--text-secondary);
          font-size: 0.85em;
          margin: 0;
        }
        @media (max-width: 768px) {
          .docs-table {
            overflow-x: auto;
          }
          .docs-table table {
            min-width: 600px;
          }
        }
      `}</style>
      {promptElement}
    </AppLayout>
  );
}

