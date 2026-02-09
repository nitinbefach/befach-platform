// TODO: Connect to actual AI service. Currently returns mock responses.
const express = require('express');
const router = express.Router();

// Mock AI responses
const faqResponses = {
  'import duties': 'Import duties in India are calculated based on the HSN code of your product, CIF value, and country of origin. The formula is: Basic Customs Duty + Social Welfare Surcharge + IGST. Use our Cost Calculator for accurate estimates.',
  'shipping method': 'The best shipping method depends on urgency and cost. Sea freight is economical for bulk orders (20-30 days), air freight is faster but expensive (5-7 days), and express courier is best for samples (3-5 days).',
  'supplier verification': 'To verify a supplier: 1) Check business registration, 2) Request factory audit reports, 3) Ask for references, 4) Start with a small trial order, 5) Use our verified supplier network for pre-screened options.',
  'boe filing': 'To file a Bill of Entry: 1) Get all shipping documents ready, 2) Calculate duties using HSN codes, 3) Submit through ICEGATE portal, 4) Pay duties online, 5) Clear customs inspection. Our Compliance Tools automate most steps.',
};

// POST /api/ai/chat - Chat with AI assistant
router.post('/chat', (req, res) => {
  const { question, category } = req.body;
  const questionLower = question.toLowerCase();
  
  // Simple keyword matching for demo
  let response = 'I can help you with trade regulations, supplier discovery, documentation, cost calculation, and logistics. Could you please provide more details about your specific question?';
  
  for (const [keyword, answer] of Object.entries(faqResponses)) {
    if (questionLower.includes(keyword)) {
      response = answer;
      break;
    }
  }
  
  res.json({
    success: true,
    data: {
      question,
      answer: response,
      category: category || 'general',
      timestamp: new Date().toISOString(),
      relatedTopics: ['Import duties', 'Shipping methods', 'Supplier verification', 'Documentation']
    }
  });
});

// GET /api/ai/recent - Get recent queries
router.get('/recent', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, question: 'What documents are needed for importing electronics from China?', status: 'Resolved', timestamp: '2 minutes ago' },
      { id: 2, question: 'Calculate duty for HSN code 8539 from Vietnam', status: 'Resolved', timestamp: '15 minutes ago' },
      { id: 3, question: 'Find reliable LED bulb suppliers in Shenzhen', status: 'Resolved', timestamp: '1 hour ago' },
      { id: 4, question: 'What are the latest GST rates for imported textiles?', status: 'Resolved', timestamp: '2 hours ago' },
      { id: 5, question: 'How to file BOE for first-time importers?', status: 'Resolved', timestamp: '3 hours ago' },
    ]
  });
});

// GET /api/ai/stats - Get AI assistant stats
router.get('/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      questionsAnswered: 4523,
      avgResponseTime: 1.2,
      accuracyRate: 98.7,
      activeChats: 18
    }
  });
});

// GET /api/ai/popular - Get popular questions
router.get('/popular', (req, res) => {
  res.json({
    success: true,
    data: [
      { question: 'How do I calculate import duties?', category: 'Cost Calculation' },
      { question: 'What is the best shipping method?', category: 'Logistics' },
      { question: 'How to verify supplier credentials?', category: 'Supplier Discovery' },
      { question: 'What documents are needed for customs clearance?', category: 'Documentation' },
      { question: 'How to file Bill of Entry?', category: 'Compliance' },
    ]
  });
});

module.exports = router;

