const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

// GET /api/suppliers - Get all suppliers
router.get('/', async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: {
        rating: 'desc'
      }
    });

    // Get statistics
    const stats = await prisma.supplier.aggregate({
      _count: {
        id: true
      },
      _avg: {
        rating: true
      },
      _sum: {
        totalOrders: true
      }
    });

    const verifiedCount = await prisma.supplier.count({
      where: { verified: true }
    });

    res.json({
      success: true,
      data: suppliers,
      total: suppliers.length,
      stats: {
        savedSuppliers: stats._count.id,
        activePartnerships: verifiedCount,
        avgRating: Number(stats._avg.rating || 0).toFixed(1),
        totalOrders: stats._sum.totalOrders || 0
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ 
      success: false, 
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch suppliers' }
    });
  }
});

// GET /api/suppliers/:id - Get single supplier
router.get('/:id', async (req, res) => {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id: req.params.id },
      include: {
        orders: {
          take: 5,
          orderBy: {
            createdAt: 'desc'
          },
          select: {
            id: true,
            orderNumber: true,
            product: true,
            status: true,
            createdAt: true
          }
        }
      }
    });

    if (!supplier) {
      return res.status(404).json({ 
        success: false, 
        error: { code: 'NOT_FOUND', message: 'Supplier not found' }
      });
    }

    res.json({ success: true, data: supplier });
  } catch (error) {
    console.error('Error fetching supplier:', error);
    res.status(500).json({ 
      success: false, 
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch supplier' }
    });
  }
});

// POST /api/suppliers - Add new supplier
router.post('/', async (req, res) => {
  try {
    const { 
      name, 
      contactPerson, 
      email, 
      phone,
      location, 
      country,
      specialization,
      organizationId
    } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Supplier name is required' }
      });
    }

    const supplier = await prisma.supplier.create({
      data: {
        name,
        contactPerson,
        email,
        phone,
        location,
        country,
        specialization,
        rating: 0,
        totalOrders: 0,
        verified: false,
        organizationId
      }
    });

    res.status(201).json({ 
      success: true, 
      data: supplier,
      message: 'Supplier added successfully'
    });
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(500).json({ 
      success: false, 
      error: { code: 'SERVER_ERROR', message: 'Failed to create supplier' }
    });
  }
});

// PUT /api/suppliers/:id - Update supplier
router.put('/:id', async (req, res) => {
  try {
    const { 
      name, 
      contactPerson, 
      email, 
      phone,
      location, 
      country,
      specialization,
      rating,
      verified
    } = req.body;

    // Check if supplier exists
    const existingSupplier = await prisma.supplier.findUnique({
      where: { id: req.params.id }
    });

    if (!existingSupplier) {
      return res.status(404).json({ 
        success: false, 
        error: { code: 'NOT_FOUND', message: 'Supplier not found' }
      });
    }

    const supplier = await prisma.supplier.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(contactPerson && { contactPerson }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(location && { location }),
        ...(country && { country }),
        ...(specialization && { specialization }),
        ...(rating !== undefined && { rating: parseFloat(rating) }),
        ...(verified !== undefined && { verified })
      }
    });

    res.json({ 
      success: true, 
      data: supplier,
      message: 'Supplier updated successfully'
    });
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ 
      success: false, 
      error: { code: 'SERVER_ERROR', message: 'Failed to update supplier' }
    });
  }
});

// DELETE /api/suppliers/:id - Delete supplier
router.delete('/:id', async (req, res) => {
  try {
    // Check if supplier exists
    const existingSupplier = await prisma.supplier.findUnique({
      where: { id: req.params.id }
    });

    if (!existingSupplier) {
      return res.status(404).json({ 
        success: false, 
        error: { code: 'NOT_FOUND', message: 'Supplier not found' }
      });
    }

    await prisma.supplier.delete({
      where: { id: req.params.id }
    });

    res.json({ 
      success: true, 
      message: 'Supplier deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ 
      success: false, 
      error: { code: 'SERVER_ERROR', message: 'Failed to delete supplier' }
    });
  }
});

// POST /api/suppliers/match - Match suppliers to product
router.post('/match', async (req, res) => {
  try {
    const { product, category, countries } = req.body;

    // Build filter
    const where = {
      verified: true,
      ...(countries && countries.length > 0 && {
        country: { in: countries }
      }),
      ...(category && {
        specialization: { contains: category, mode: 'insensitive' }
      })
    };

    const suppliers = await prisma.supplier.findMany({
      where,
      orderBy: {
        rating: 'desc'
      },
      take: 10
    });

    // Add match score based on criteria
    const matches = suppliers.map((supplier, index) => ({
      ...supplier,
      matchScore: Math.max(95 - index * 5, 60)
    }));

    res.json({
      success: true,
      data: matches,
      total: matches.length,
      query: { product, category, countries }
    });
  } catch (error) {
    console.error('Error matching suppliers:', error);
    res.status(500).json({ 
      success: false, 
      error: { code: 'SERVER_ERROR', message: 'Failed to match suppliers' }
    });
  }
});

module.exports = router;
