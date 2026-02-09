// TODO: Migrate to Prisma. Currently uses in-memory storage (lost on restart).
const express = require('express');
const router = express.Router();

// In-memory storage for reports
let reports = [
  {
    id: 'RPT-001',
    userId: 'user-1',
    name: 'Monthly Import Summary - November 2024',
    type: 'orders',
    dateRange: { start: '2024-11-01', end: '2024-11-30' },
    createdAt: new Date('2024-11-25'),
    status: 'ready',
    size: '2.4 MB',
    downloadUrl: '/api/reports/RPT-001/download'
  },
  {
    id: 'RPT-002',
    userId: 'user-1',
    name: 'Q3 Spending Analysis',
    type: 'spending',
    dateRange: { start: '2024-07-01', end: '2024-09-30' },
    createdAt: new Date('2024-10-05'),
    status: 'ready',
    size: '1.8 MB',
    downloadUrl: '/api/reports/RPT-002/download'
  },
  {
    id: 'RPT-003',
    userId: 'user-1',
    name: 'Supplier Performance Report',
    type: 'suppliers',
    dateRange: { start: '2024-01-01', end: '2024-11-25' },
    createdAt: new Date('2024-11-20'),
    status: 'ready',
    size: '3.1 MB',
    downloadUrl: '/api/reports/RPT-003/download'
  }
];

// Summary stats (mock data)
const summaryStats = {
  totalOrders: 47,
  totalSpending: 4520000,
  avgSavings: 14,
  activeSuppliers: 12,
  trends: {
    orders: '+12%',
    spending: '+8%',
    savings: '+2%',
    suppliers: '+3'
  }
};

// Get saved reports
router.get('/', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const { type, limit = 10, offset = 0 } = req.query;

  let userReports = reports.filter(r => r.userId === userId);
  
  if (type) {
    userReports = userReports.filter(r => r.type === type);
  }

  // Sort by newest first
  userReports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Pagination
  const paginated = userReports.slice(Number(offset), Number(offset) + Number(limit));

  res.json({
    reports: paginated,
    total: userReports.length,
    limit: Number(limit),
    offset: Number(offset)
  });
});

// Get summary stats
router.get('/summary', (req, res) => {
  res.json(summaryStats);
});

// Generate new report
router.post('/generate', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const { type, dateRange, name } = req.body;

  if (!type) {
    return res.status(400).json({ error: 'Report type is required' });
  }

  const validTypes = ['orders', 'spending', 'suppliers', 'compliance', 'custom'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: `Invalid type. Must be one of: ${validTypes.join(', ')}` });
  }

  const reportId = `RPT-${Date.now()}`;
  
  const newReport = {
    id: reportId,
    userId,
    name: name || `${type.charAt(0).toUpperCase() + type.slice(1)} Report - ${new Date().toLocaleDateString()}`,
    type,
    dateRange: dateRange || { 
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    createdAt: new Date(),
    status: 'generating',
    size: null,
    downloadUrl: null
  };

  reports.push(newReport);

  // Simulate report generation (in real implementation, this would be async)
  setTimeout(() => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      report.status = 'ready';
      report.size = `${(Math.random() * 3 + 1).toFixed(1)} MB`;
      report.downloadUrl = `/api/reports/${reportId}/download`;
    }
  }, 5000);

  res.status(202).json({
    success: true,
    report: newReport,
    message: 'Report generation started. It will be ready in a few moments.'
  });
});

// Get report status
router.get('/:id', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const { id } = req.params;

  const report = reports.find(r => r.id === id && r.userId === userId);

  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  res.json(report);
});

// Download report
router.get('/:id/download', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const { id } = req.params;

  const report = reports.find(r => r.id === id && r.userId === userId);

  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  if (report.status !== 'ready') {
    return res.status(400).json({ error: 'Report is not ready for download' });
  }

  // In real implementation, this would return the actual file
  // For now, return mock CSV data
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${report.name}.csv"`);
  
  const csvData = `Report: ${report.name}
Type: ${report.type}
Generated: ${report.createdAt}
Date Range: ${report.dateRange.start} to ${report.dateRange.end}

--- Sample Data ---
Order ID,Product,Quantity,Value,Status
ORD-001,Organic Turmeric,2500 kg,₹125000,Delivered
ORD-002,Black Pepper,1000 kg,₹195000,In Transit
ORD-003,Cinnamon,500 kg,₹85000,Processing
`;

  res.send(csvData);
});

// Delete report
router.delete('/:id', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const { id } = req.params;

  const index = reports.findIndex(r => r.id === id && r.userId === userId);

  if (index === -1) {
    return res.status(404).json({ error: 'Report not found' });
  }

  reports.splice(index, 1);

  res.json({
    success: true,
    message: 'Report deleted'
  });
});

module.exports = router;

