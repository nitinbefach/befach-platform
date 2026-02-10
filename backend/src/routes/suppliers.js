const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// In-memory suppliers storage with demo data
const suppliers = [
  {
    id: crypto.randomUUID(),
    name: 'Shenzhen Lighting Co.',
    contactPerson: 'Li Wei',
    email: 'liwei@szlighting.cn',
    phone: '+86 755 8888 1234',
    location: 'Shenzhen',
    country: 'China',
    specialization: 'LED Lighting & Electronics',
    rating: 4.8,
    totalOrders: 45,
    verified: true,
    organizationId: null,
    createdAt: new Date('2025-06-10'),
    updatedAt: new Date('2026-01-15'),
  },
  {
    id: crypto.randomUUID(),
    name: 'Dhaka Textiles Ltd',
    contactPerson: 'Rashid Ahmed',
    email: 'rashid@dhakatextiles.bd',
    phone: '+880 1712 345678',
    location: 'Dhaka',
    country: 'Bangladesh',
    specialization: 'Cotton Garments & Textiles',
    rating: 4.5,
    totalOrders: 28,
    verified: true,
    organizationId: null,
    createdAt: new Date('2025-08-20'),
    updatedAt: new Date('2026-01-05'),
  },
  {
    id: crypto.randomUUID(),
    name: 'Vietnam Steel Works',
    contactPerson: 'Nguyen Tran',
    email: 'nguyen@vnsteel.vn',
    phone: '+84 28 3822 5678',
    location: 'Ho Chi Minh City',
    country: 'Vietnam',
    specialization: 'Steel & Metal Products',
    rating: 4.3,
    totalOrders: 15,
    verified: true,
    organizationId: null,
    createdAt: new Date('2025-09-12'),
    updatedAt: new Date('2025-12-28'),
  },
  {
    id: crypto.randomUUID(),
    name: 'Guangzhou Auto Parts',
    contactPerson: 'Chen Mei',
    email: 'chenmei@gzauto.cn',
    phone: '+86 20 6666 7890',
    location: 'Guangzhou',
    country: 'China',
    specialization: 'Automotive Parts & Accessories',
    rating: 4.1,
    totalOrders: 10,
    verified: false,
    organizationId: null,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2026-01-20'),
  },
];

// GET /api/suppliers - Get all suppliers
router.get('/', async (req, res) => {
  try {
    const sorted = [...suppliers].sort((a, b) => b.rating - a.rating);

    const total = suppliers.length;
    const verifiedCount = suppliers.filter(s => s.verified).length;
    const avgRating = total > 0
      ? (suppliers.reduce((sum, s) => sum + s.rating, 0) / total).toFixed(1)
      : '0.0';
    const totalOrders = suppliers.reduce((sum, s) => sum + s.totalOrders, 0);

    res.json({
      success: true,
      data: sorted,
      total,
      stats: {
        savedSuppliers: total,
        activePartnerships: verifiedCount,
        avgRating,
        totalOrders,
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
    const supplier = suppliers.find(s => s.id === req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Supplier not found' }
      });
    }

    // Return with empty orders array (no DB to query)
    res.json({ success: true, data: { ...supplier, orders: [] } });
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

    const supplier = {
      id: crypto.randomUUID(),
      name,
      contactPerson: contactPerson || null,
      email: email || null,
      phone: phone || null,
      location: location || null,
      country: country || null,
      specialization: specialization || null,
      rating: 0,
      totalOrders: 0,
      verified: false,
      organizationId: organizationId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    suppliers.push(supplier);

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

    const idx = suppliers.findIndex(s => s.id === req.params.id);

    if (idx === -1) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Supplier not found' }
      });
    }

    const existing = suppliers[idx];
    const updated = {
      ...existing,
      ...(name && { name }),
      ...(contactPerson && { contactPerson }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(location && { location }),
      ...(country && { country }),
      ...(specialization && { specialization }),
      ...(rating !== undefined && { rating: parseFloat(rating) }),
      ...(verified !== undefined && { verified }),
      updatedAt: new Date(),
    };

    suppliers[idx] = updated;

    res.json({
      success: true,
      data: updated,
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
    const idx = suppliers.findIndex(s => s.id === req.params.id);

    if (idx === -1) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Supplier not found' }
      });
    }

    suppliers.splice(idx, 1);

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

    let filtered = suppliers.filter(s => s.verified);

    if (countries && countries.length > 0) {
      filtered = filtered.filter(s => countries.includes(s.country));
    }

    if (category) {
      filtered = filtered.filter(s =>
        s.specialization && s.specialization.toLowerCase().includes(category.toLowerCase())
      );
    }

    filtered.sort((a, b) => b.rating - a.rating);
    const matches = filtered.slice(0, 10).map((supplier, index) => ({
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
