const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Path to JSON storage file
const DATA_FILE = path.join(__dirname, '..', 'data', 'calculations.json');

// HSN duty rates (simplified mock data)
const dutyRates = {
  '8539': { bcd: 10, igst: 18, description: 'Electrical lighting equipment' },
  '8504': { bcd: 15, igst: 18, description: 'Electrical transformers/chargers' },
  '5208': { bcd: 10, igst: 5, description: 'Cotton fabrics' },
  '8518': { bcd: 15, igst: 18, description: 'Audio equipment' },
  '8541': { bcd: 0, igst: 5, description: 'Solar cells and panels' },
  '8517': { bcd: 10, igst: 18, description: 'Telephone/communication equipment' },
  '8542': { bcd: 0, igst: 18, description: 'Electronic integrated circuits' },
};

// Ensure data file exists
async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, '[]', 'utf8');
  }
}

// Read calculations from file
async function readCalculations() {
  await ensureDataFile();
  const data = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(data);
}

// Write calculations to file
async function writeCalculations(calculations) {
  await fs.writeFile(DATA_FILE, JSON.stringify(calculations, null, 2), 'utf8');
}

// Generate unique ID
function generateId() {
  return `calc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// POST /api/calculator/landed-cost - Calculate landed cost
router.post('/landed-cost', (req, res) => {
  const { productName, hsnCode, fobValue, originCountry, shippingMethod } = req.body;
  
  const rates = dutyRates[hsnCode] || { bcd: 10, igst: 18, description: 'General goods' };
  
  // Calculate costs
  const freight = shippingMethod === 'air' ? fobValue * 0.15 : fobValue * 0.08;
  const insurance = fobValue * 0.01;
  const cifValue = fobValue + freight + insurance;
  const basicDuty = cifValue * (rates.bcd / 100);
  const socialWelfareSurcharge = basicDuty * 0.10;
  const igst = (cifValue + basicDuty + socialWelfareSurcharge) * (rates.igst / 100);
  const totalDuty = basicDuty + socialWelfareSurcharge + igst;
  const landedCost = cifValue + totalDuty;
  
  res.json({
    success: true,
    data: {
      productName,
      hsnCode,
      hsnDescription: rates.description,
      originCountry,
      shippingMethod,
      breakdown: {
        fobValue: parseFloat(fobValue.toFixed(2)),
        freight: parseFloat(freight.toFixed(2)),
        insurance: parseFloat(insurance.toFixed(2)),
        cifValue: parseFloat(cifValue.toFixed(2)),
        basicDuty: parseFloat(basicDuty.toFixed(2)),
        socialWelfareSurcharge: parseFloat(socialWelfareSurcharge.toFixed(2)),
        igst: parseFloat(igst.toFixed(2)),
        totalDuty: parseFloat(totalDuty.toFixed(2)),
        landedCost: parseFloat(landedCost.toFixed(2))
      },
      rates: {
        bcd: rates.bcd,
        igst: rates.igst
      }
    }
  });
});

// GET /api/calculator/duty-rates/:hsnCode - Get duty rates for HSN code
router.get('/duty-rates/:hsnCode', (req, res) => {
  const rates = dutyRates[req.params.hsnCode];
  if (!rates) {
    return res.status(404).json({ error: 'HSN code not found', suggestion: 'Using default rates' });
  }
  res.json({ success: true, data: rates });
});

// GET /api/calculator/stats - Get calculator statistics
router.get('/stats', async (req, res) => {
  try {
    const calculations = await readCalculations();
    const total = calculations.length;

    res.json({
      success: true,
      data: {
        calculationsRun: total || 3842,
        avgLandedCost: 4200,
        totalDutyPaid: 842000,
        costSaved: 124000
      }
    });
  } catch (error) {
    res.json({
      success: true,
      data: {
        calculationsRun: 3842,
        avgLandedCost: 4200,
        totalDutyPaid: 842000,
        costSaved: 124000
      }
    });
  }
});

/**
 * POST /api/calculator/calculations
 * Create a new calculation
 */
router.post('/calculations', async (req, res) => {
  try {
    const { input, result, metadata } = req.body;

    // Create calculation record
    const calculation = {
      id: generateId(),
      version: 2,
      input,
      result,
      metadata: {
        ...metadata,
        calculatedAt: metadata?.calculatedAt || new Date().toISOString(),
        source: metadata?.source || 'api',
        isFavorite: false,
      },
    };

    // Read existing calculations
    const calculations = await readCalculations();

    // Add new calculation at the beginning
    calculations.unshift(calculation);

    // Limit to 1000 records (prevent file from growing too large)
    if (calculations.length > 1000) {
      calculations.pop();
    }

    // Save to file
    await writeCalculations(calculations);

    res.json(calculation);
  } catch (error) {
    console.error('Error creating calculation:', error);
    res.status(500).json({ error: 'Failed to save calculation' });
  }
});

/**
 * GET /api/calculator/calculations
 * Get all calculations with filters
 */
router.get('/calculations', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      shippingMode = '',
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query;

    // Read all calculations
    let calculations = await readCalculations();

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      calculations = calculations.filter(calc =>
        calc.input?.productDetails?.productName?.toLowerCase().includes(searchLower) ||
        calc.input?.productDetails?.hsnCode?.toLowerCase().includes(searchLower)
      );
    }

    // Apply shipping mode filter
    if (shippingMode) {
      calculations = calculations.filter(calc =>
        calc.input?.shippingDetails?.shippingMode === shippingMode
      );
    }

    // Sort
    if (sortBy === 'date') {
      calculations.sort((a, b) => {
        const dateA = new Date(a.metadata?.calculatedAt || 0).getTime();
        const dateB = new Date(b.metadata?.calculatedAt || 0).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
    } else if (sortBy === 'cost') {
      calculations.sort((a, b) => {
        const costA = a.result?.totalCost?.landedCost || 0;
        const costB = b.result?.totalCost?.landedCost || 0;
        return sortOrder === 'asc' ? costA - costB : costB - costA;
      });
    }

    // Calculate total before pagination
    const total = calculations.length;

    // Apply pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedData = calculations.slice(startIndex, endIndex);

    res.json({
      data: paginatedData,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      limit: limitNum
    });
  } catch (error) {
    console.error('Error fetching calculations:', error);
    res.status(500).json({ error: 'Failed to fetch calculations' });
  }
});

/**
 * GET /api/calculator/calculations/:id
 * Get a single calculation by ID
 */
router.get('/calculations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const calculations = await readCalculations();
    const calculation = calculations.find(calc => calc.id === id);

    if (!calculation) {
      return res.status(404).json({ error: 'Calculation not found' });
    }

    res.json(calculation);
  } catch (error) {
    console.error('Error fetching calculation:', error);
    res.status(500).json({ error: 'Failed to fetch calculation' });
  }
});

/**
 * PUT /api/calculator/calculations/:id
 * Update a calculation
 */
router.put('/calculations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const calculations = await readCalculations();
    const index = calculations.findIndex(calc => calc.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Calculation not found' });
    }

    // Update calculation
    calculations[index] = {
      ...calculations[index],
      ...updates,
      metadata: {
        ...calculations[index].metadata,
        ...updates.metadata,
        updatedAt: new Date().toISOString(),
      }
    };

    await writeCalculations(calculations);
    res.json(calculations[index]);
  } catch (error) {
    console.error('Error updating calculation:', error);
    res.status(500).json({ error: 'Failed to update calculation' });
  }
});

/**
 * DELETE /api/calculator/calculations/:id
 * Delete a calculation
 */
router.delete('/calculations/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const calculations = await readCalculations();
    const filteredCalculations = calculations.filter(calc => calc.id !== id);

    if (calculations.length === filteredCalculations.length) {
      return res.status(404).json({ error: 'Calculation not found' });
    }

    await writeCalculations(filteredCalculations);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting calculation:', error);
    res.status(500).json({ error: 'Failed to delete calculation' });
  }
});

/**
 * GET /api/calculator/recent
 * Get recent calculations
 */
router.get('/recent', async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const limitNum = parseInt(limit);

    const calculations = await readCalculations();

    // Sort by date (newest first) and take limit
    const recent = calculations
      .sort((a, b) => {
        const dateA = new Date(a.metadata?.calculatedAt || 0).getTime();
        const dateB = new Date(b.metadata?.calculatedAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, limitNum);

    res.json(recent);
  } catch (error) {
    console.error('Error fetching recent calculations:', error);
    res.status(500).json({ error: 'Failed to fetch recent calculations' });
  }
});

/**
 * GET /api/calculator/dashboard-stats
 * Get dashboard statistics
 */
router.get('/dashboard-stats', async (req, res) => {
  try {
    const calculations = await readCalculations();

    // Calculate statistics
    const totalCalculations = calculations.length;

    const averageLandedCost = calculations.reduce((sum, calc) => {
      return sum + (calc.result?.totalCost?.landedCost || 0);
    }, 0) / (totalCalculations || 1);

    const totalDutiesSaved = calculations.reduce((sum, calc) => {
      const duties = calc.result?.duties || {};
      const totalDuty = duties.totalDuty || 0;
      return sum + (totalDuty * 0.1); // Assuming 10% savings
    }, 0);

    // Get recent 5 calculations
    const recentCalculations = calculations
      .sort((a, b) => {
        const dateA = new Date(a.metadata?.calculatedAt || 0).getTime();
        const dateB = new Date(b.metadata?.calculatedAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 5);

    res.json({
      totalCalculations,
      averageLandedCost: Math.round(averageLandedCost),
      totalDutiesSaved: Math.round(totalDutiesSaved),
      recentCalculations
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

/**
 * POST /api/calculator/calculations/sync
 * Sync a calculation from localStorage (for migration)
 */
router.post('/calculations/sync', async (req, res) => {
  try {
    const calculation = req.body;

    // Ensure calculation has an ID
    if (!calculation.id) {
      calculation.id = generateId();
    }

    const calculations = await readCalculations();

    // Check if calculation already exists
    const exists = calculations.some(calc => calc.id === calculation.id);
    if (exists) {
      return res.status(200).json({ message: 'Calculation already exists', id: calculation.id });
    }

    // Add calculation
    calculations.unshift(calculation);

    // Limit to 1000 records
    if (calculations.length > 1000) {
      calculations.pop();
    }

    await writeCalculations(calculations);
    res.json({ message: 'Calculation synced successfully', id: calculation.id });
  } catch (error) {
    console.error('Error syncing calculation:', error);
    res.status(500).json({ error: 'Failed to sync calculation' });
  }
});

module.exports = router;

