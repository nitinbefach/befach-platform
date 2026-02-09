// TODO: Migrate to Prisma. Currently uses in-memory storage (lost on restart).
const express = require('express');
const router = express.Router();

// Mock user data (in production, this would be a database)
const mockUsers = {
  'user-1': {
    id: 'user-1',
    email: 'admin@company.com',
    name: 'John Smith',
    organization: {
      name: 'ElectroMart India',
      type: 'company',
      teamSize: '2-5',
      primaryGoals: ['source-products', 'track-shipments']
    },
    role: 'owner',
    subscription: {
      plan: 'growth',
      seats: 5,
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    },
    preferences: {
      sidebarPinnedItems: ['dashboard', 'my-orders', 'submit-requirement'],
      sidebarCollapsedSections: [],
      notifications: {
        orderUpdates: true,
        shipmentTracking: true,
        priceAlerts: true,
        supplierMessages: true,
        regulatoryUpdates: true,
        marketingEmails: false
      }
    },
    onboarding: {
      completedOnboarding: true,
      completedTour: true
    }
  }
};

// Get current user profile
router.get('/profile', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const user = mockUsers[userId];

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    organization: user.organization,
    role: user.role,
    subscription: user.subscription,
    preferences: user.preferences,
    onboarding: user.onboarding
  });
});

// Create/Login user (simplified - in production would be proper auth)
router.post('/login', (req, res) => {
  const { organization } = req.body;
  const userId = 'user-' + Date.now();

  if (!organization || !organization.name) {
    return res.status(400).json({ error: 'Organization name is required' });
  }

  // Create new user
  mockUsers[userId] = {
    id: userId,
    email: `user@${organization.name.toLowerCase().replace(/\s+/g, '')}.com`,
    name: 'New User',
    organization: {
      name: organization.name,
      type: organization.type || 'company',
      teamSize: organization.teamSize || '1',
      primaryGoals: organization.primaryGoals || []
    },
    role: 'owner',
    subscription: {
      plan: 'free',
      seats: 1,
      validUntil: null
    },
    preferences: {
      sidebarPinnedItems: ['dashboard', 'my-orders', 'submit-requirement'],
      sidebarCollapsedSections: [],
      notifications: {
        orderUpdates: true,
        shipmentTracking: true,
        priceAlerts: true,
        supplierMessages: true,
        regulatoryUpdates: true,
        marketingEmails: false
      }
    },
    onboarding: {
      completedOnboarding: false,
      completedTour: false
    }
  };

  res.json({
    success: true,
    userId,
    user: mockUsers[userId]
  });
});

// Logout user
router.post('/logout', (req, res) => {
  // In production, this would invalidate the session/token
  res.json({ success: true, message: 'Logged out successfully' });
});

// Update organization details
router.put('/organization', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const { name, type, teamSize, primaryGoals } = req.body;

  if (!mockUsers[userId]) {
    return res.status(404).json({ error: 'User not found' });
  }

  mockUsers[userId].organization = {
    ...mockUsers[userId].organization,
    ...(name && { name }),
    ...(type && { type }),
    ...(teamSize && { teamSize }),
    ...(primaryGoals && { primaryGoals })
  };

  res.json({
    success: true,
    organization: mockUsers[userId].organization
  });
});

// Get user preferences
router.get('/preferences', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const user = mockUsers[userId];

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    preferences: user.preferences
  });
});

// Update sidebar preferences
router.put('/preferences/sidebar', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const { pinnedItems, collapsedSections, hiddenItems } = req.body;

  if (!mockUsers[userId]) {
    return res.status(404).json({ error: 'User not found' });
  }

  mockUsers[userId].preferences = {
    ...mockUsers[userId].preferences,
    ...(pinnedItems && { sidebarPinnedItems: pinnedItems }),
    ...(collapsedSections && { sidebarCollapsedSections: collapsedSections }),
    ...(hiddenItems && { sidebarHiddenItems: hiddenItems })
  };

  res.json({
    success: true,
    preferences: mockUsers[userId].preferences
  });
});

// Update notification preferences
router.put('/preferences/notifications', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const notifications = req.body;

  if (!mockUsers[userId]) {
    return res.status(404).json({ error: 'User not found' });
  }

  mockUsers[userId].preferences.notifications = {
    ...mockUsers[userId].preferences.notifications,
    ...notifications
  };

  res.json({
    success: true,
    notifications: mockUsers[userId].preferences.notifications
  });
});

// Complete onboarding
router.post('/onboarding/complete', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';

  if (!mockUsers[userId]) {
    return res.status(404).json({ error: 'User not found' });
  }

  mockUsers[userId].onboarding.completedOnboarding = true;

  res.json({
    success: true,
    onboarding: mockUsers[userId].onboarding
  });
});

// Complete guided tour
router.post('/onboarding/complete-tour', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';

  if (!mockUsers[userId]) {
    return res.status(404).json({ error: 'User not found' });
  }

  mockUsers[userId].onboarding.completedTour = true;

  res.json({
    success: true,
    onboarding: mockUsers[userId].onboarding
  });
});

// Update profile
router.put('/profile', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const { name, email, phone } = req.body;

  if (!mockUsers[userId]) {
    return res.status(404).json({ error: 'User not found' });
  }

  mockUsers[userId] = {
    ...mockUsers[userId],
    ...(name && { name }),
    ...(email && { email }),
    ...(phone && { phone })
  };

  res.json({
    success: true,
    user: mockUsers[userId]
  });
});

// Get subscription details
router.get('/subscription', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const user = mockUsers[userId];

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    subscription: user.subscription
  });
});

// Upgrade subscription
router.post('/subscription/upgrade', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const { plan, seats } = req.body;

  if (!mockUsers[userId]) {
    return res.status(404).json({ error: 'User not found' });
  }

  const validPlans = ['free', 'starter', 'growth', 'enterprise'];
  if (!validPlans.includes(plan)) {
    return res.status(400).json({ error: 'Invalid plan' });
  }

  mockUsers[userId].subscription = {
    plan,
    seats: seats || mockUsers[userId].subscription.seats,
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
  };

  res.json({
    success: true,
    subscription: mockUsers[userId].subscription
  });
});

module.exports = router;
