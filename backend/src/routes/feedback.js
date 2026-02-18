const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { appendFeedbackRow } = require('../lib/googleSheets');

const DATA_FILE = path.join(__dirname, '..', 'data', 'feedback.json');

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, '[]', 'utf8');
  }
}

async function readFeedback() {
  await ensureDataFile();
  const data = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(data);
}

async function writeFeedback(entries) {
  await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), 'utf8');
}

// POST /api/feedback — submit a feedback entry
router.post('/', async (req, res) => {
  try {
    const entry = req.body;

    if (!entry || !entry.id || !entry.type || !entry.feature) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'id, type, and feature are required' },
      });
    }

    // 1. Save to local JSON backup
    const existing = await readFeedback();
    existing.unshift(entry);
    const trimmed = existing.slice(0, 5000);
    await writeFeedback(trimmed);

    // 2. Append to Google Sheets (fire-and-forget)
    appendFeedbackRow(entry).catch(err => {
      console.error('Google Sheets append failed (non-blocking):', err.message);
    });

    res.status(201).json({
      success: true,
      data: { id: entry.id },
      message: 'Feedback received',
    });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to save feedback' },
    });
  }
});

// GET /api/feedback — list all feedback
router.get('/', async (req, res) => {
  try {
    const entries = await readFeedback();
    res.json({
      success: true,
      data: entries,
      total: entries.length,
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch feedback' },
    });
  }
});

module.exports = router;
