const { google } = require('googleapis');

let sheetsClient = null;

/**
 * Initialize Google Sheets API client using service account credentials.
 * Returns null if credentials are not configured (graceful degradation).
 */
function getClient() {
  if (sheetsClient) return sheetsClient;

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEETS_ID;

  if (!email || !privateKey || !sheetId) {
    console.warn('Google Sheets credentials not configured. Sheets sync disabled.');
    return null;
  }

  try {
    const auth = new google.auth.JWT(
      email,
      null,
      // .env stores \n as literal backslash-n, so replace with actual newlines
      privateKey.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    sheetsClient = google.sheets({ version: 'v4', auth });
    return sheetsClient;
  } catch (error) {
    console.error('Failed to initialize Google Sheets client:', error.message);
    return null;
  }
}

/**
 * Append a feedback entry as a new row to the configured spreadsheet.
 * Column order: Timestamp, ID, Type, Feature, Response, Sentiment,
 *   Comments, SurveyType, SessionID, CompletionTime, CompletionRate, Metadata
 */
async function appendFeedbackRow(entry) {
  const client = getClient();
  if (!client) return false;

  const sheetId = process.env.GOOGLE_SHEETS_ID;

  const row = [
    entry.timestamp || new Date().toISOString(),
    entry.id || '',
    entry.type || '',
    entry.feature || '',
    typeof entry.response === 'object'
      ? JSON.stringify(entry.response)
      : String(entry.response ?? ''),
    entry.sentiment || '',
    entry.comments || '',
    entry.surveyType || '',
    entry.sessionId || '',
    entry.completionTime != null ? String(entry.completionTime) : '',
    entry.completionRate != null ? String(entry.completionRate) : '',
    entry.metadata ? JSON.stringify(entry.metadata) : '',
  ];

  try {
    await client.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1!A:L',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [row] },
    });
    return true;
  } catch (error) {
    console.error('Failed to append to Google Sheets:', error.message);
    return false;
  }
}

/**
 * Ensure the header row exists in the spreadsheet.
 * Called once on server startup.
 */
async function ensureHeaderRow() {
  const client = getClient();
  if (!client) return;

  const sheetId = process.env.GOOGLE_SHEETS_ID;

  try {
    const res = await client.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1!A1:L1',
    });

    if (!res.data.values || res.data.values.length === 0) {
      await client.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: 'Sheet1!A1:L1',
        valueInputOption: 'RAW',
        requestBody: {
          values: [[
            'Timestamp', 'ID', 'Type', 'Feature', 'Response', 'Sentiment',
            'Comments', 'Survey Type', 'Session ID', 'Completion Time (ms)',
            'Completion Rate (%)', 'Metadata (JSON)',
          ]],
        },
      });
      console.log('Google Sheets header row created.');
    }
  } catch (error) {
    console.error('Failed to ensure header row:', error.message);
  }
}

module.exports = { appendFeedbackRow, ensureHeaderRow, getClient };
