// TODO: Migrate to Prisma. Currently uses in-memory storage (lost on restart).
const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// In-memory storage for API keys
let apiKeys = new Map();

// Initialize default keys for user-1
apiKeys.set('user-1', [
  {
    id: 'key-1',
    name: 'Production Key',
    key: 'bf_prod_sk_1234567890abcdef',
    keyPrefix: 'bf_prod_sk_1234',
    type: 'production',
    createdAt: new Date('2024-10-15'),
    lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'active'
  },
  {
    id: 'key-2',
    name: 'Test Key',
    key: 'bf_test_sk_0987654321fedcba',
    keyPrefix: 'bf_test_sk_0987',
    type: 'test',
    createdAt: new Date('2024-10-15'),
    lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: 'active'
  }
]);

// Webhook configs
let webhookConfigs = new Map();
webhookConfigs.set('user-1', {
  url: 'https://example.com/webhooks/befach',
  events: ['order.created', 'order.shipped', 'shipment.update'],
  secret: 'whsec_' + crypto.randomBytes(16).toString('hex'),
  status: 'active'
});

// Generate a new API key
function generateApiKey(type) {
  const prefix = type === 'production' ? 'bf_prod_sk_' : 'bf_test_sk_';
  return prefix + crypto.randomBytes(16).toString('hex');
}

// Create new API key
router.post('/', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const { name, type } = req.body;

  if (!['production', 'test'].includes(type)) {
    return res.status(400).json({ error: 'Type must be "production" or "test"' });
  }

  const newKey = generateApiKey(type);
  const keyData = {
    id: `key-${Date.now()}`,
    name: name || `${type === 'production' ? 'Production' : 'Test'} Key`,
    key: newKey,
    keyPrefix: newKey.substring(0, 16),
    type,
    createdAt: new Date(),
    lastUsed: null,
    status: 'active'
  };

  let userKeys = apiKeys.get(userId) || [];
  userKeys.push(keyData);
  apiKeys.set(userId, userKeys);

  // Return the full key only once (on creation)
  res.status(201).json({
    success: true,
    apiKey: {
      ...keyData,
      fullKey: newKey // Only returned on creation
    },
    message: 'API key created. Make sure to copy it now - you won\'t be able to see it again!'
  });
});

// List API keys (keys are masked)
router.get('/', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const userKeys = apiKeys.get(userId) || [];

  // Return keys with masked values
  const maskedKeys = userKeys.map(k => ({
    id: k.id,
    name: k.name,
    keyPrefix: k.keyPrefix + '••••••••',
    type: k.type,
    createdAt: k.createdAt,
    lastUsed: k.lastUsed,
    status: k.status
  }));

  res.json({
    keys: maskedKeys,
    total: maskedKeys.length
  });
});

// Revoke API key
router.delete('/:keyId', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const { keyId } = req.params;

  const userKeys = apiKeys.get(userId) || [];
  const keyIndex = userKeys.findIndex(k => k.id === keyId);

  if (keyIndex === -1) {
    return res.status(404).json({ error: 'API key not found' });
  }

  userKeys[keyIndex].status = 'revoked';

  res.json({
    success: true,
    message: 'API key revoked'
  });
});

// Regenerate API key
router.post('/:keyId/regenerate', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const { keyId } = req.params;

  const userKeys = apiKeys.get(userId) || [];
  const key = userKeys.find(k => k.id === keyId);

  if (!key) {
    return res.status(404).json({ error: 'API key not found' });
  }

  const newKey = generateApiKey(key.type);
  key.key = newKey;
  key.keyPrefix = newKey.substring(0, 16);
  key.createdAt = new Date();
  key.lastUsed = null;

  res.json({
    success: true,
    apiKey: {
      ...key,
      fullKey: newKey
    },
    message: 'API key regenerated. Make sure to copy it now!'
  });
});

// Get webhook settings
router.get('/webhooks', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const config = webhookConfigs.get(userId);

  if (!config) {
    return res.json({
      url: '',
      events: [],
      status: 'inactive'
    });
  }

  res.json({
    url: config.url,
    events: config.events,
    secret: config.secret.substring(0, 12) + '••••••••',
    status: config.status
  });
});

// Update webhook settings
router.put('/webhooks', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const { url, events } = req.body;

  const validEvents = [
    'order.created',
    'order.shipped',
    'order.delivered',
    'shipment.update',
    'document.ready'
  ];

  if (events && !events.every(e => validEvents.includes(e))) {
    return res.status(400).json({ 
      error: `Invalid events. Valid events are: ${validEvents.join(', ')}` 
    });
  }

  let config = webhookConfigs.get(userId);
  if (!config) {
    config = {
      url: '',
      events: [],
      secret: 'whsec_' + crypto.randomBytes(16).toString('hex'),
      status: 'inactive'
    };
  }

  config.url = url || config.url;
  config.events = events || config.events;
  config.status = url ? 'active' : 'inactive';

  webhookConfigs.set(userId, config);

  res.json({
    success: true,
    webhook: {
      url: config.url,
      events: config.events,
      status: config.status
    },
    message: 'Webhook settings updated'
  });
});

// Test webhook
router.post('/webhooks/test', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const config = webhookConfigs.get(userId);

  if (!config || !config.url) {
    return res.status(400).json({ error: 'No webhook URL configured' });
  }

  // In real implementation, this would send a test webhook
  res.json({
    success: true,
    message: `Test webhook sent to ${config.url}`,
    testPayload: {
      event: 'test.webhook',
      timestamp: new Date(),
      data: {
        message: 'This is a test webhook from Befach'
      }
    }
  });
});

// Reveal webhook secret (one-time view)
router.post('/webhooks/reveal-secret', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const config = webhookConfigs.get(userId);

  if (!config) {
    return res.status(404).json({ error: 'No webhook configured' });
  }

  res.json({
    secret: config.secret,
    message: 'This secret will only be shown once. Store it securely.'
  });
});

module.exports = router;

