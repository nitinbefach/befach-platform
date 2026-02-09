// TODO: Migrate to Prisma. Currently uses in-memory storage (lost on restart).
const express = require('express');
const router = express.Router();

// In-memory storage for requirements
let requirements = [
  {
    id: 'REQ-2024-001',
    userId: 'user-1',
    productDescription: 'Organic Turmeric Powder, Grade A, Origin: Vietnam',
    quantity: 2500,
    unit: 'kg',
    targetPrice: '$2.50/kg',
    urgency: 'high',
    additionalDetails: 'Need COA and organic certification',
    preferredContact: 'whatsapp',
    contactInfo: '+91 98765 43210',
    status: 'quoted',
    createdAt: new Date('2024-11-10'),
    quotes: [
      {
        id: 'QT-001',
        supplierId: 'SUP-VN-001',
        supplierName: 'Vietnam Spice Co.',
        price: '$2.35/kg',
        totalAmount: '$5,875',
        deliveryTime: '15-20 days',
        validUntil: '2024-12-01',
        status: 'accepted'
      }
    ]
  },
  {
    id: 'REQ-2024-002',
    userId: 'user-1',
    productDescription: 'Black Pepper, Premium Grade',
    quantity: 1000,
    unit: 'kg',
    targetPrice: '',
    urgency: 'medium',
    additionalDetails: 'Looking for Kerala origin',
    preferredContact: 'email',
    contactInfo: 'john@company.com',
    status: 'pending',
    createdAt: new Date('2024-11-20'),
    quotes: []
  }
];

// Create new requirement
router.post('/', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const {
    productDescription,
    quantity,
    unit,
    targetPrice,
    urgency,
    additionalDetails,
    preferredContact,
    contactInfo
  } = req.body;

  if (!productDescription || !quantity || !contactInfo) {
    return res.status(400).json({ 
      error: 'Missing required fields: productDescription, quantity, contactInfo' 
    });
  }

  const newRequirement = {
    id: `REQ-${Date.now()}`,
    userId,
    productDescription,
    quantity,
    unit: unit || 'kg',
    targetPrice: targetPrice || '',
    urgency: urgency || 'medium',
    additionalDetails: additionalDetails || '',
    preferredContact: preferredContact || 'whatsapp',
    contactInfo,
    status: 'pending',
    createdAt: new Date(),
    quotes: []
  };

  requirements.push(newRequirement);

  res.status(201).json({
    success: true,
    requirement: newRequirement,
    message: 'Requirement submitted successfully. Our team will contact you within 24 hours.'
  });
});

// List user's requirements
router.get('/', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const { status, limit = 10, offset = 0 } = req.query;

  let userRequirements = requirements.filter(r => r.userId === userId);
  
  if (status) {
    userRequirements = userRequirements.filter(r => r.status === status);
  }

  // Sort by newest first
  userRequirements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Pagination
  const paginated = userRequirements.slice(Number(offset), Number(offset) + Number(limit));

  res.json({
    requirements: paginated,
    total: userRequirements.length,
    limit: Number(limit),
    offset: Number(offset)
  });
});

// Get requirement details with quotes
router.get('/:id', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const { id } = req.params;

  const requirement = requirements.find(r => r.id === id && r.userId === userId);

  if (!requirement) {
    return res.status(404).json({ error: 'Requirement not found' });
  }

  res.json(requirement);
});

// Accept a quote
router.post('/:id/quotes/:quoteId/accept', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const { id, quoteId } = req.params;

  const requirement = requirements.find(r => r.id === id && r.userId === userId);

  if (!requirement) {
    return res.status(404).json({ error: 'Requirement not found' });
  }

  const quote = requirement.quotes.find(q => q.id === quoteId);

  if (!quote) {
    return res.status(404).json({ error: 'Quote not found' });
  }

  // Update quote status
  quote.status = 'accepted';
  requirement.status = 'accepted';

  // Reject other quotes
  requirement.quotes.forEach(q => {
    if (q.id !== quoteId) {
      q.status = 'rejected';
    }
  });

  res.json({
    success: true,
    message: 'Quote accepted successfully',
    requirement
  });
});

// Cancel requirement
router.delete('/:id', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const { id } = req.params;

  const index = requirements.findIndex(r => r.id === id && r.userId === userId);

  if (index === -1) {
    return res.status(404).json({ error: 'Requirement not found' });
  }

  requirements[index].status = 'cancelled';

  res.json({
    success: true,
    message: 'Requirement cancelled'
  });
});

module.exports = router;

