const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

// Helper function to generate order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}${random}`;
};

// GET /api/orders - Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            location: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get statistics
    const stats = await prisma.order.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    const totalValue = await prisma.order.aggregate({
      _sum: {
        fobValue: true
      }
    });

    // Format stats
    const statsMap = {
      totalOrders: orders.length,
      processing: 0,
      inTransit: 0,
      customs: 0,
      delivered: 0,
      totalValue: Number(totalValue._sum.fobValue || 0)
    };

    stats.forEach(s => {
      if (s.status === 'processing') statsMap.processing = s._count.status;
      if (s.status === 'in_transit') statsMap.inTransit = s._count.status;
      if (s.status === 'customs') statsMap.customs = s._count.status;
      if (s.status === 'delivered') statsMap.delivered = s._count.status;
    });

    res.json({
      success: true,
      data: orders,
      total: orders.length,
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
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        supplier: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

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

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        product,
        hsnCode,
        quantity: parseInt(quantity),
        unit: unit || 'pcs',
        fobValue: fobValue ? parseFloat(fobValue) : null,
        currency: currency || 'USD',
        status: 'processing',
        originCountry,
        destinationPort,
        notes,
        supplierId,
        userId,
        organizationId
      },
      include: {
        supplier: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

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

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id: req.params.id }
    });

    if (!existingOrder) {
      return res.status(404).json({ 
        success: false, 
        error: { code: 'NOT_FOUND', message: 'Order not found' }
      });
    }

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: {
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
        ...(supplierId && { supplierId })
      },
      include: {
        supplier: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.json({ 
      success: true, 
      data: order,
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
    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id: req.params.id }
    });

    if (!existingOrder) {
      return res.status(404).json({ 
        success: false, 
        error: { code: 'NOT_FOUND', message: 'Order not found' }
      });
    }

    await prisma.order.delete({
      where: { id: req.params.id }
    });

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
