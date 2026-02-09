// TODO: Connect to market data API. Currently returns mock data.
const express = require('express');
const router = express.Router();

// Mock market data
const trendingProducts = [
  { product: 'LED Bulbs & Lighting', hsn: '8539', category: 'Electronics', origin: 'China', importValue: 124000000, trend: 15.2 },
  { product: 'Mobile Accessories', hsn: '8517', category: 'Electronics', origin: 'Vietnam', importValue: 98000000, trend: 12.8 },
  { product: 'Textiles & Fabrics', hsn: '5407', category: 'Textiles', origin: 'Bangladesh', importValue: 87000000, trend: 9.5 },
  { product: 'Electronic Components', hsn: '8542', category: 'Electronics', origin: 'Taiwan', importValue: 76000000, trend: 7.3 },
  { product: 'Solar Panels', hsn: '8541', category: 'Renewable Energy', origin: 'China', importValue: 64000000, trend: -2.1 },
];

// GET /api/market/insights - Get market insights
router.get('/insights', (req, res) => {
  res.json({
    success: true,
    data: {
      trendingProducts,
      stats: {
        globalTradeVolume: 28500000000000,
        activeMarkets: 195,
        trackedProducts: 15234,
        priceAlerts: 23
      }
    }
  });
});

// GET /api/market/products/:hsn - Get product market data
router.get('/products/:hsn', (req, res) => {
  const product = trendingProducts.find(p => p.hsn === req.params.hsn);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  res.json({
    success: true,
    data: {
      ...product,
      historicalTrend: [
        { month: 'Jun', value: product.importValue * 0.85 },
        { month: 'Jul', value: product.importValue * 0.88 },
        { month: 'Aug', value: product.importValue * 0.92 },
        { month: 'Sep', value: product.importValue * 0.95 },
        { month: 'Oct', value: product.importValue * 0.98 },
        { month: 'Nov', value: product.importValue },
      ],
      topSuppliers: ['Company A', 'Company B', 'Company C'],
      priceRange: { min: 1.2, max: 3.5, avg: 2.1, unit: 'USD' }
    }
  });
});

// GET /api/market/opportunities - Get market opportunities
router.get('/opportunities', (req, res) => {
  res.json({
    success: true,
    data: [
      { type: 'price_drop', title: 'Price Drop Alert', description: 'LED Bulbs 9W prices dropped 35% this week - lowest in 6 months', product: 'LED Bulbs' },
      { type: 'demand_surge', title: 'Demand Surge', description: 'Solar Panels demand increased 67% - perfect time to source inventory', product: 'Solar Panels' },
      { type: 'emerging_market', title: 'Emerging Market', description: 'Vietnam electronics manufacturing growing 28% - new supplier opportunities', country: 'Vietnam' },
    ]
  });
});

module.exports = router;

