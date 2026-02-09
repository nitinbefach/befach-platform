const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const ordersRoutes = require('./routes/orders');
const suppliersRoutes = require('./routes/suppliers');
const shipmentsRoutes = require('./routes/shipments');
const calculatorRoutes = require('./routes/calculator');
const complianceRoutes = require('./routes/compliance');
const marketRoutes = require('./routes/market');
const aiRoutes = require('./routes/ai');

// New dual-mode routes
const userRoutes = require('./routes/user');
const requirementsRoutes = require('./routes/requirements');
const chatRoutes = require('./routes/chat');
const teamRoutes = require('./routes/team');
const reportsRoutes = require('./routes/reports');
const apikeysRoutes = require('./routes/apikeys');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'BEFACH API Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/shipments', shipmentsRoutes);
app.use('/api/calculator', calculatorRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/ai', aiRoutes);

// Dual-mode API Routes
app.use('/api/user', userRoutes);
app.use('/api/requirements', requirementsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/api-keys', apikeysRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 BEFACH API Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;

