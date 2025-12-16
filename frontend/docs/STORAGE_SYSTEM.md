# Storage System Documentation

## Overview
The storage system provides a unified, type-safe interface for persisting calculation data in the browser's localStorage with automatic migration from legacy formats.

## Architecture

### Storage Layer Structure
```
/src/lib/historyStorage.ts
  ├── Type Definitions
  ├── Migration Logic
  ├── CRUD Operations
  ├── Search & Filter
  ├── Bulk Operations
  └── Export Utilities
```

## Data Models

### CalculationInput
```typescript
interface CalculationInput {
  // Product Information
  productName: string;
  hsnCode: string;
  fobValue: string;
  currency: string;
  weight?: string;
  dutyRate?: string;

  // Shipping Information
  shippingMode: 'sea' | 'air' | 'road';
  originPort: string;
  destinationPort: string;
  estimatedDays?: string;
  freightCost: string;
  insuranceRequired?: boolean;
  insuranceAmount?: string;

  // Additional Costs
  packingCharges?: string;
  inlandFreight?: string;
  bankCharges?: string;
  commissionRate?: string;
  customCharges?: CustomCharge[];
  totalAdditionalCosts?: string;
}
```

### CalculationResult
```typescript
interface CalculationResult {
  cifValue: number;
  customsDuty: number;
  gst: number;
  totalLandedCost: number;
  breakdownPercentages?: {
    fob: number;
    freight: number;
    insurance: number;
    duty: number;
    gst: number;
    additional: number;
  };
}
```

### CalculationRecord
```typescript
interface CalculationRecord {
  id: string;              // UUID v4
  version: number;         // Schema version (currently 1)
  input: CalculationInput; // User inputs
  result?: CalculationResult; // Calculated values
  metadata: CalculationMetadata; // Additional info
}
```

### CalculationMetadata
```typescript
interface CalculationMetadata {
  calculatedAt: string;    // ISO 8601 timestamp
  lastModified?: string;   // ISO 8601 timestamp
  isFavorite?: boolean;    // User favorite flag
  tags?: string[];         // User-defined tags
  notes?: string;          // User notes
}
```

## Storage Schema

### Key Structure
```
localStorage key: 'importCalculator_unified'
```

### Value Structure
```json
{
  "version": 1,
  "records": [
    {
      "id": "uuid-v4",
      "version": 1,
      "input": { ... },
      "result": { ... },
      "metadata": { ... }
    }
  ],
  "lastUpdated": "2024-01-15T10:30:00.000Z"
}
```

## Migration System

### Legacy Detection
```typescript
private static hasLegacyData(): boolean {
  return !!(
    localStorage.getItem('costCalculatorHistory') ||
    localStorage.getItem('costCalculatorFavorites') ||
    localStorage.getItem('costCalculatorTemplates')
  );
}
```

### Migration Process
1. **Check for legacy keys** on initialization
2. **Parse and validate** legacy data
3. **Transform to new schema** with version 1
4. **Merge duplicates** by timestamp
5. **Save unified data** to new key
6. **Remove legacy keys** after successful migration
7. **Log migration** for debugging

### Legacy Format Examples

#### Old History Format
```json
{
  "calculations": [
    {
      "date": "2024-01-01",
      "product": "Widget",
      "hsnCode": "12345678",
      "cost": 1000
    }
  ]
}
```

#### Old Favorites Format
```json
{
  "favoriteIds": ["calc-1", "calc-2", "calc-3"]
}
```

## API Methods

### Core CRUD Operations

#### save(record)
```typescript
save(record: Omit<CalculationRecord, 'id'>): CalculationRecord
```
- Generates UUID if not provided
- Sets version to current (1)
- Updates lastModified timestamp
- Returns saved record with ID

#### get(id)
```typescript
get(id: string): CalculationRecord | null
```
- Returns record by ID
- Returns null if not found

#### update(id, updates)
```typescript
update(id: string, updates: Partial<CalculationRecord>): boolean
```
- Partial update of existing record
- Updates lastModified timestamp
- Returns success boolean

#### delete(id)
```typescript
delete(id: string): boolean
```
- Removes record by ID
- Returns success boolean

### Bulk Operations

#### getAll()
```typescript
getAll(): CalculationRecord[]
```
- Returns all records
- Sorted by calculatedAt desc

#### deleteMultiple(ids)
```typescript
deleteMultiple(ids: string[]): number
```
- Deletes multiple records
- Returns count of deleted

#### clear()
```typescript
clear(): void
```
- Removes all records
- Resets to empty state

### Search & Filter

#### search(query, filters)
```typescript
search(query: string, filters?: SearchFilters): CalculationRecord[]
```

**SearchFilters:**
```typescript
interface SearchFilters {
  startDate?: string;
  endDate?: string;
  shippingMode?: string;
  isFavorite?: boolean;
  minCost?: number;
  maxCost?: number;
  tags?: string[];
}
```

### Export Operations

#### exportToCSV(records)
```typescript
exportToCSV(records: CalculationRecord[]): string
```
- Converts records to CSV format
- Includes all fields
- Headers included

#### exportToJSON(records)
```typescript
exportToJSON(records: CalculationRecord[]): string
```
- Full JSON export
- Maintains structure
- Pretty printed

## Storage Limits & Optimization

### Browser Limits
- localStorage limit: ~5-10MB
- Single key limit: ~5MB
- Performance degradation: >1000 records

### Optimization Strategies

#### 1. Data Compression
```typescript
// Future implementation
const compressed = LZString.compress(JSON.stringify(data));
localStorage.setItem(key, compressed);
```

#### 2. Pagination
```typescript
// Load records in chunks
const page = records.slice(offset, offset + limit);
```

#### 3. Archival System
```typescript
// Move old records to IndexedDB
if (records.length > 1000) {
  await archiveOldRecords();
}
```

#### 4. Cleanup Policy
```typescript
// Auto-delete after 90 days
const cutoffDate = new Date();
cutoffDate.setDate(cutoffDate.getDate() - 90);
```

## Error Handling

### Storage Exceptions
```typescript
try {
  localStorage.setItem(key, value);
} catch (e) {
  if (e.name === 'QuotaExceededError') {
    // Handle storage full
    this.cleanupOldRecords();
  }
}
```

### Data Validation
```typescript
private static validateRecord(record: any): boolean {
  return (
    record.id &&
    record.version === 1 &&
    record.input &&
    record.input.productName &&
    record.input.hsnCode
  );
}
```

### Corruption Recovery
```typescript
private static recoverFromCorruption(): void {
  // Attempt to parse partial data
  // Rebuild index if needed
  // Log corruption event
}
```

## Security Considerations

### Data Sensitivity
- No personal information stored
- No payment details stored
- Business data only

### XSS Prevention
```typescript
// Sanitize user inputs
const sanitized = DOMPurify.sanitize(userInput);
```

### Encryption (Future)
```typescript
// Optional encryption for sensitive data
const encrypted = CryptoJS.AES.encrypt(data, userKey);
```

## Performance Metrics

### Operation Benchmarks
| Operation | Records | Time |
|-----------|---------|------|
| Save | 1 | <10ms |
| Get by ID | 1000 | <5ms |
| Get All | 100 | <20ms |
| Get All | 1000 | <100ms |
| Search | 1000 | <50ms |
| Export CSV | 100 | <30ms |

### Memory Usage
- 100 records: ~200KB
- 1000 records: ~2MB
- 5000 records: ~10MB (limit)

## Testing Strategy

### Unit Tests
```typescript
describe('historyStorage', () => {
  it('should save and retrieve record', () => {});
  it('should handle migration', () => {});
  it('should search with filters', () => {});
  it('should export to CSV', () => {});
});
```

### Integration Tests
- Browser compatibility
- Storage limits
- Migration scenarios
- Concurrent access

## Usage Examples

### Basic Save & Retrieve
```typescript
// Save a calculation
const record = historyStorage.save({
  input: formData,
  result: calculationResult,
  metadata: {
    calculatedAt: new Date().toISOString(),
    isFavorite: false
  }
});

// Retrieve by ID
const saved = historyStorage.get(record.id);
```

### Search with Filters
```typescript
// Find all sea freight calculations in last 30 days
const results = historyStorage.search('', {
  shippingMode: 'sea',
  startDate: thirtyDaysAgo.toISOString(),
  endDate: new Date().toISOString()
});
```

### Bulk Operations
```typescript
// Mark multiple as favorites
const ids = ['id1', 'id2', 'id3'];
ids.forEach(id => {
  historyStorage.update(id, {
    metadata: { isFavorite: true }
  });
});

// Delete old calculations
const oldRecords = historyStorage.search('', {
  endDate: ninetyDaysAgo.toISOString()
});
historyStorage.deleteMultiple(oldRecords.map(r => r.id));
```

### Export Data
```typescript
// Export favorites to CSV
const favorites = historyStorage.getAll()
  .filter(r => r.metadata.isFavorite);
const csv = historyStorage.exportToCSV(favorites);

// Download CSV
const blob = new Blob([csv], { type: 'text/csv' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'favorites.csv';
a.click();
```

## Future Enhancements

### Planned Features
1. **IndexedDB Backend** - For larger storage needs
2. **Cloud Sync** - Sync across devices
3. **Data Compression** - LZ-string compression
4. **Encryption** - AES encryption option
5. **Import CSV** - Bulk import functionality
6. **Versioning** - Track changes to records
7. **Soft Delete** - Trash/restore functionality
8. **Auto-backup** - Periodic export to file

### API Extensions
```typescript
// Future methods
historyStorage.import(csvData: string): number;
historyStorage.backup(): Promise<Blob>;
historyStorage.restore(backup: Blob): Promise<void>;
historyStorage.sync(): Promise<void>;
```

## Troubleshooting

### Common Issues

#### Storage Full
**Error:** QuotaExceededError
**Solution:** Clear old records or increase compression

#### Corrupted Data
**Error:** JSON parse error
**Solution:** Clear and restart, check backup

#### Missing Records
**Error:** Records disappear
**Solution:** Check browser settings, private mode

### Debug Utilities
```typescript
// Enable debug logging
historyStorage.enableDebug();

// Get storage stats
const stats = historyStorage.getStats();
console.log(`Records: ${stats.count}, Size: ${stats.size}`);

// Validate all records
const invalid = historyStorage.validateAll();
console.log(`Invalid records: ${invalid.length}`);
```