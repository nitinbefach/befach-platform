// TODO: Connect to compliance data source. Currently returns mock data.
const express = require('express');
const router = express.Router();

// Mock BOE data
const boeRecords = [
  { boeNumber: 'BOE-2847-2025', importId: 'IMP-2847', product: 'LED Bulbs 9W', port: 'JNPT, Mumbai', dutyPaid: 428, filedDate: '2025-11-20', status: 'Cleared' },
  { boeNumber: 'BOE-2846-2025', importId: 'IMP-2846', product: 'Mobile Chargers', port: 'Chennai Port', dutyPaid: 180, filedDate: '2025-11-19', status: 'Under Review' },
  { boeNumber: 'BOE-2845-2025', importId: 'IMP-2845', product: 'Cotton Fabric', port: 'Kolkata Port', dutyPaid: 374, filedDate: '2025-11-18', status: 'Cleared' },
  { boeNumber: 'BOE-2844-2025', importId: 'IMP-2844', product: 'Bluetooth Speakers', port: 'JNPT, Mumbai', dutyPaid: 675, filedDate: '2025-11-17', status: 'Pending Docs' },
  { boeNumber: 'BOE-2843-2025', importId: 'IMP-2843', product: 'Solar Panels 300W', port: 'ICD Bangalore', dutyPaid: 902, filedDate: '2025-11-16', status: 'Cleared' },
];

// GET /api/compliance/boe - Get all BOE records
router.get('/boe', (req, res) => {
  res.json({
    success: true,
    data: boeRecords,
    total: boeRecords.length,
    stats: {
      boeFiled: 1847,
      complianceRate: 99.8,
      activeAlerts: 12,
      avgClearanceTime: 2.4
    }
  });
});

// GET /api/compliance/boe/:id - Get single BOE record
router.get('/boe/:id', (req, res) => {
  const boe = boeRecords.find(b => b.boeNumber === req.params.id);
  if (!boe) {
    return res.status(404).json({ error: 'BOE record not found' });
  }
  res.json({ success: true, data: boe });
});

// POST /api/compliance/boe - File new BOE
router.post('/boe', (req, res) => {
  const { orderNumber, product, hsnCode, port, invoiceValue } = req.body;
  
  const newBoe = {
    boeNumber: 'BOE-' + Date.now() + '-2025',
    importId: orderNumber,
    product,
    hsnCode,
    port,
    invoiceValue,
    dutyPaid: null,
    filedDate: new Date().toISOString().split('T')[0],
    status: 'Filed'
  };
  
  res.status(201).json({ 
    success: true, 
    message: 'BOE filed successfully',
    data: newBoe 
  });
});

// GET /api/compliance/regulations - Get current regulations
router.get('/regulations', (req, res) => {
  res.json({
    success: true,
    data: {
      lastUpdated: '2025-11-01',
      alerts: [
        { id: 1, type: 'info', message: 'New GST rates effective from Dec 1, 2025 for electronics', date: '2025-11-15' },
        { id: 2, type: 'warning', message: 'Additional documentation required for textiles from Bangladesh', date: '2025-11-10' },
        { id: 3, type: 'info', message: 'Simplified customs process for solar panels under green energy initiative', date: '2025-11-05' },
      ]
    }
  });
});

module.exports = router;

