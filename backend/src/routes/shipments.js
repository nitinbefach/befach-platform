const express = require('express');
const router = express.Router();

// Mock data
const shipments = [
  { id: 'MSKU4523789012', orderId: 'ORD-2847', origin: 'Shanghai, China', destination: 'Mumbai, India', carrier: 'Maersk Line', eta: '2025-12-03', status: 'In Transit' },
  { id: 'CMAU9876543210', orderId: 'ORD-2846', origin: 'Hanoi, Vietnam', destination: 'Delhi, India', carrier: 'CMA CGM', eta: '2025-12-05', status: 'Customs Clearance' },
  { id: 'OOLU5647382910', orderId: 'ORD-2845', origin: 'Dhaka, Bangladesh', destination: 'Chennai, India', carrier: 'OOCL', eta: '2025-11-30', status: 'Port Arrival' },
  { id: 'HLCU1234567890', orderId: 'ORD-2844', origin: 'Shenzhen, China', destination: 'Bangalore, India', carrier: 'Hapag-Lloyd', eta: '2025-12-01', status: 'In Transit' },
  { id: 'MSCU8765432109', orderId: 'ORD-2843', origin: 'Taipei, Taiwan', destination: 'Kolkata, India', carrier: 'MSC', eta: '2025-12-07', status: 'In Transit' },
];

// GET /api/shipments - Get all shipments
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: shipments,
    total: shipments.length,
    stats: {
      activeShipments: 342,
      inTransit: 256,
      deliveredThisWeek: 127,
      avgDeliveryTime: 18
    }
  });
});

// GET /api/shipments/:id - Get single shipment
router.get('/:id', (req, res) => {
  const shipment = shipments.find(s => s.id === req.params.id);
  if (!shipment) {
    return res.status(404).json({ error: 'Shipment not found' });
  }
  res.json({ success: true, data: shipment });
});

// POST /api/shipments/track - Track shipment
router.post('/track', (req, res) => {
  const { trackingNumber, carrier } = req.body;
  const shipment = shipments.find(s => s.id === trackingNumber);
  
  if (shipment) {
    res.json({
      success: true,
      data: {
        ...shipment,
        timeline: [
          { status: 'Order Placed', date: '2025-11-15', completed: true },
          { status: 'Shipped from Origin', date: '2025-11-18', completed: true },
          { status: 'In Transit', date: '2025-11-20', completed: true },
          { status: 'Customs Clearance', date: '2025-11-25', completed: false },
          { status: 'Out for Delivery', date: null, completed: false },
          { status: 'Delivered', date: null, completed: false },
        ]
      }
    });
  } else {
    res.json({
      success: true,
      message: 'Tracking number added',
      data: { trackingNumber, carrier, status: 'Tracking initiated' }
    });
  }
});

module.exports = router;

