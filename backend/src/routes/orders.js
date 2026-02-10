const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Helper function to generate order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}${random}`;
};

// In-memory orders storage with demo data
const orders = [
  {
    id: crypto.randomUUID(),
    orderNumber: 'ORD-4523001',
    product: 'LED Bulbs 9W',
    hsnCode: '85395000',
    quantity: 5000,
    unit: 'pcs',
    fobValue: 12500,
    landedCost: 18750,
    currency: 'USD',
    status: 'in_transit',
    originCountry: 'China',
    destinationPort: 'Nhava Sheva',
    notes: 'Bulk order for Q1 distribution',
    supplierId: null,
    supplier: { id: 's1', name: 'Shenzhen Lighting Co.', location: 'Shenzhen' },
    userId: null,
    organizationId: null,
    createdAt: new Date('2025-12-15'),
    updatedAt: new Date('2026-01-10'),
  },
  {
    id: crypto.randomUUID(),
    orderNumber: 'ORD-4523002',
    product: 'Cotton T-Shirts',
    hsnCode: '61091000',
    quantity: 2000,
    unit: 'pcs',
    fobValue: 8000,
    landedCost: 11200,
    currency: 'USD',
    status: 'processing',
    originCountry: 'Bangladesh',
    destinationPort: 'Kolkata',
    notes: null,
    supplierId: null,
    supplier: { id: 's2', name: 'Dhaka Textiles Ltd', location: 'Dhaka' },
    userId: null,
    organizationId: null,
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-01-20'),
  },
  {
    id: crypto.randomUUID(),
    orderNumber: 'ORD-4523003',
    product: 'Stainless Steel Fasteners',
    hsnCode: '73181500',
    quantity: 10000,
    unit: 'pcs',
    fobValue: 5500,
    landedCost: 8250,
    currency: 'USD',
    status: 'delivered',
    originCountry: 'Vietnam',
    destinationPort: 'Chennai',
    notes: 'Delivered successfully',
    supplierId: null,
    supplier: { id: 's3', name: 'Vietnam Steel Works', location: 'Ho Chi Minh City' },
    userId: null,
    organizationId: null,
    createdAt: new Date('2025-11-05'),
    updatedAt: new Date('2025-12-20'),
  },
];

// GET /api/orders - Get all orders
router.get('/', async (req, res) => {
  try {
    const sorted = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Compute stats
    const statsMap = {
      totalOrders: orders.length,
      processing: orders.filter(o => o.status === 'processing').length,
      inTransit: orders.filter(o => o.status === 'in_transit').length,
      customs: orders.filter(o => o.status === 'customs').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      totalValue: orders.reduce((sum, o) => sum + (o.fobValue || 0), 0),
    };

    res.json({
      success: true,
      data: sorted,
      total: sorted.length,
      stats: statsMap,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch orders' }
    });
  }
});

// GET /api/orders/:id - Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = orders.find(o => o.id === req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Order not found' }
      });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch order' }
    });
  }
});

// POST /api/orders - Create new order
router.post('/', async (req, res) => {
  try {
    const {
      product,
      hsnCode,
      quantity,
      unit,
      supplierId,
      fobValue,
      currency,
      originCountry,
      destinationPort,
      notes,
      organizationId,
      userId
    } = req.body;

    // Validation
    if (!product || !quantity) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Product and quantity are required' }
      });
    }

    const order = {
      id: crypto.randomUUID(),
      orderNumber: generateOrderNumber(),
      product,
      hsnCode: hsnCode || null,
      quantity: parseInt(quantity),
      unit: unit || 'pcs',
      fobValue: fobValue ? parseFloat(fobValue) : null,
      landedCost: null,
      currency: currency || 'USD',
      status: 'processing',
      originCountry: originCountry || null,
      destinationPort: destinationPort || null,
      notes: notes || null,
      supplierId: supplierId || null,
      supplier: null,
      userId: userId || null,
      organizationId: organizationId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    orders.push(order);

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to create order' }
    });
  }
});

// PUT /api/orders/:id - Update order
router.put('/:id', async (req, res) => {
  try {
    const {
      product,
      hsnCode,
      quantity,
      unit,
      fobValue,
      landedCost,
      status,
      originCountry,
      destinationPort,
      notes,
      supplierId
    } = req.body;

    const idx = orders.findIndex(o => o.id === req.params.id);

    if (idx === -1) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Order not found' }
      });
    }

    const existing = orders[idx];
    const updated = {
      ...existing,
      ...(product && { product }),
      ...(hsnCode && { hsnCode }),
      ...(quantity && { quantity: parseInt(quantity) }),
      ...(unit && { unit }),
      ...(fobValue && { fobValue: parseFloat(fobValue) }),
      ...(landedCost && { landedCost: parseFloat(landedCost) }),
      ...(status && { status }),
      ...(originCountry && { originCountry }),
      ...(destinationPort && { destinationPort }),
      ...(notes !== undefined && { notes }),
      ...(supplierId && { supplierId }),
      updatedAt: new Date(),
    };

    orders[idx] = updated;

    res.json({
      success: true,
      data: updated,
      message: 'Order updated successfully'
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to update order' }
    });
  }
});

// DELETE /api/orders/:id - Delete order
router.delete('/:id', async (req, res) => {
  try {
    const idx = orders.findIndex(o => o.id === req.params.id);

    if (idx === -1) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Order not found' }
      });
    }

    orders.splice(idx, 1);

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to delete order' }
    });
  }
});

module.exports = router;
