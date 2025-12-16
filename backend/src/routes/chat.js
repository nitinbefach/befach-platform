const express = require('express');
const router = express.Router();

// In-memory storage for chat messages
let chatHistory = new Map();

// Mock quick actions
const quickActions = [
  { id: 'track', label: '📦 Track My Order', action: 'track_order' },
  { id: 'quote', label: '💰 Get a Quote', action: 'new_quote' },
  { id: 'status', label: '📋 Order Status', action: 'check_status' },
  { id: 'supplier', label: '🏭 Find Supplier', action: 'find_supplier' },
  { id: 'customs', label: '📄 Customs Help', action: 'customs_help' },
  { id: 'agent', label: '👤 Talk to Expert', action: 'connect_agent' }
];

// Mock bot responses
const botResponses = {
  track_order: "I'd be happy to help you track your order! Please provide your order ID, and I'll look up the current status for you.",
  new_quote: "Great! I can help you get a quote. Please share:\n\n1. Product name/description\n2. Quantity needed\n3. Delivery location\n\nOur team will prepare a detailed quote within 24 hours.",
  check_status: "Let me check your recent orders... You have 2 active orders:\n\n📦 ORD-2024-0847 - Organic Turmeric\nStatus: In Transit (ETA: Dec 5)\n\n📦 ORD-2024-0812 - Black Pepper\nStatus: Customs Clearance\n\nWould you like more details about any of these?",
  find_supplier: "I can help you find verified suppliers! What product are you looking for? Please mention the desired origin country and quantity.",
  customs_help: "I can help with customs-related queries. Common questions include HS Code lookup, duty calculations, required documents, and clearance process. What specifically would you like to know?",
  connect_agent: "Connecting you with a Befach expert... 👤\n\nYou can also reach us directly:\n📱 WhatsApp: +91 98765 43210\n📧 Email: support@befach.com\n\nAverage response time: 15 minutes during business hours.",
  default: "I'm here to help with your import needs! You can ask me about tracking orders, getting quotes, finding suppliers, or customs & compliance."
};

// Send a message
router.post('/messages', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const { message, actionId } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Initialize chat history for user if not exists
  if (!chatHistory.has(userId)) {
    chatHistory.set(userId, []);
  }

  const history = chatHistory.get(userId);

  // Add user message
  const userMessage = {
    id: `msg-${Date.now()}`,
    type: 'user',
    content: message,
    timestamp: new Date()
  };
  history.push(userMessage);

  // Generate bot response
  const responseKey = actionId || 'default';
  const botMessage = {
    id: `msg-${Date.now() + 1}`,
    type: 'bot',
    content: botResponses[responseKey] || botResponses['default'],
    timestamp: new Date()
  };
  history.push(botMessage);

  res.json({
    userMessage,
    botMessage
  });
});

// Get chat history
router.get('/messages', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const { limit = 50, before } = req.query;

  let history = chatHistory.get(userId) || [];

  if (before) {
    history = history.filter(m => new Date(m.timestamp) < new Date(before));
  }

  // Return most recent messages
  const messages = history.slice(-Number(limit));

  res.json({
    messages,
    hasMore: history.length > messages.length
  });
});

// Get available quick actions
router.get('/quick-actions', (req, res) => {
  res.json({
    actions: quickActions
  });
});

// Clear chat history
router.delete('/messages', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  
  chatHistory.set(userId, []);

  res.json({
    success: true,
    message: 'Chat history cleared'
  });
});

// Request human agent
router.post('/request-agent', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const { priority, topic } = req.body;

  // In real implementation, this would queue the request
  res.json({
    success: true,
    ticketId: `TKT-${Date.now()}`,
    message: 'An agent will contact you shortly',
    estimatedWait: '5-10 minutes',
    alternativeContact: {
      whatsapp: '+91 98765 43210',
      email: 'support@befach.com'
    }
  });
});

module.exports = router;

