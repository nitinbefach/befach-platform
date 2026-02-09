
# Cost Calculator Feature Documentation

## Overview
Complete redesign of the Import Cost Calculator feature with improved user flow, multi-step wizard interface, and comprehensive history management system.

## Architecture

### Core Components Structure
```
frontend/
├── src/
│   ├── app/cost-calculator/        # Main calculator pages
│   │   ├── page.tsx                # Landing page with dashboard
│   │   ├── layout.tsx              # Main layout wrapper
│   │   ├── new/                    # Multi-step wizard flow
│   │   │   ├── layout.tsx          # Wizard layout with provider
│   │   │   ├── step-1/             # Product details
│   │   │   ├── step-2/             # Shipping information
│   │   │   ├── step-3/             # Additional costs
│   │   │   └── step-4/             # Review & calculate
│   │   ├── results/[id]/           # Results display page
│   │   └── history/                # Calculation history page
│   ├── components/calculator/
│   │   └── wizard/                 # Reusable wizard components
│   │       ├── WizardProvider.tsx  # State management
│   │       ├── WizardProgress.tsx  # Progress indicator
│   │       └── WizardNavigation.tsx # Navigation controls
│   └── lib/
│       └── historyStorage.ts       # Unified storage layer
```

## Phase 1: Multi-Step Wizard Implementation

### 1. WizardProvider (State Management)
**Location:** `/src/components/calculator/wizard/WizardProvider.tsx`

**Purpose:** Centralized state management for the multi-step form using React Context API.

**Key Features:**
- Maintains form data across all steps
- Tracks current step and navigation
- Provides validation helpers
- Persists data during navigation

**API:**
```typescript
interface WizardContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  formData: Partial<CalculationInput>;
  updateFormData: (data: Partial<CalculationInput>) => void;
  resetFormData: () => void;
  canProceed: (step: number) => boolean;
}
```

### 2. WizardProgress Component
**Location:** `/src/components/calculator/wizard/WizardProgress.tsx`

**Purpose:** Visual progress indicator showing user's position in the wizard.

**Features:**
- Desktop: Horizontal stepper with step labels
- Mobile: Compact progress bar
- Active/completed/upcoming step states
- Click-to-navigate functionality

### 3. WizardNavigation Component
**Location:** `/src/components/calculator/wizard/WizardNavigation.tsx`

**Purpose:** Navigation controls for moving between wizard steps.

**Features:**
- Back/Continue/Calculate buttons
- Conditional button states
- Loading states
- Mobile-optimized bottom bar
- Validation integration

### 4. Landing Page
**Location:** `/src/app/cost-calculator/page.tsx`

**Purpose:** Entry point with dashboard view and quick actions.

**Features:**
- Hero section with CTA
- Statistics grid (total calculations, saved amount, avg. time)
- Recent calculations table
- Quick action cards
- Search functionality
- Mobile responsive grid

### 5. Wizard Steps

#### Step 1: Product Details
**Location:** `/src/app/cost-calculator/new/step-1/`

**Fields:**
- Product name (required)
- HSN code with autocomplete (required)
- Product value/FOB (required)
- Currency selection
- Weight (optional)
- Basic customs duty rate

**Features:**
- Real-time FOB value calculation
- HSN code suggestions
- Currency converter integration ready
- Form validation

#### Step 2: Shipping Information
**Location:** `/src/app/cost-calculator/new/step-2/`

**Fields:**
- Shipping mode (Sea/Air/Road)
- Origin port/location
- Destination port/location
- Estimated transit days
- Freight cost
- Insurance options

**Features:**
- Dynamic form based on shipping mode
- Port search with autocomplete
- Freight cost calculator integration ready
- Insurance premium calculation

#### Step 3: Additional Costs
**Location:** `/src/app/cost-calculator/new/step-3/`

**Fields:**
- Packing charges
- Inland freight
- Bank charges (percentage)
- Commission rate
- Custom charges (dynamic)

**Features:**
- Add/remove custom charges
- Percentage vs fixed amount options
- Predefined charge templates
- Real-time total calculation

#### Step 4: Review & Calculate
**Location:** `/src/app/cost-calculator/new/step-4/`

**Features:**
- Complete summary of all inputs
- Edit capability for each section
- Validation error display
- Cost breakdown preview
- Calculate and save functionality

### 6. Results Page
**Location:** `/src/app/cost-calculator/results/[id]/`

**Purpose:** Display detailed calculation results with breakdown.

**Features:**
- Total landed cost highlight
- Cost distribution chart
- Detailed breakdown table
- Shipping details summary
- Export to CSV
- Print functionality
- Share capability
- Navigate to new calculation

## Phase 2: History Management System

### 1. Unified Storage Layer
**Location:** `/src/lib/historyStorage.ts`

**Purpose:** Centralized storage management with migration from legacy keys.

**Features:**
- Automatic migration from 3 legacy localStorage keys
- TypeScript interfaces for type safety
- CRUD operations
- Bulk operations support
- Search and filter capabilities
- Export functionality

**Data Structure:**
```typescript
interface CalculationRecord {
  id: string;
  version: number;
  input: CalculationInput;
  result?: CalculationResult;
  metadata: CalculationMetadata;
}

interface CalculationMetadata {
  calculatedAt: string;
  lastModified?: string;
  isFavorite?: boolean;
  tags?: string[];
  notes?: string;
}
```

### 2. History Page
**Location:** `/src/app/cost-calculator/history/`

**Purpose:** Comprehensive history management interface.

**Features:**
- Dual view modes (Table/Card)
- Advanced search functionality
- Multi-criteria filters:
  - Date range
  - Shipping mode
  - Favorite status
  - Cost range
- Bulk operations:
  - Select all
  - Delete selected
  - Export selected
  - Mark as favorite
- Pagination with configurable page size
- Statistics panel with trends
- Mobile responsive design

**UI Components:**
- Stats Grid: Total calculations, favorites, avg. cost, growth metrics
- Controls Bar: Search, filters, view toggle, bulk actions
- Table View: Sortable columns, inline actions
- Card View: Visual cards with key metrics
- Pagination: Page controls with info display

## Design Patterns & Best Practices

### 1. Progressive Disclosure
- Complex form split into digestible steps
- Optional fields hidden by default
- Advanced options in collapsible sections

### 2. Mobile-First Responsive Design
- Breakpoints: 768px (tablet), 1024px (desktop)
- Touch-optimized controls
- Bottom navigation on mobile
- Collapsible filters on small screens

### 3. State Management
- React Context for wizard state
- localStorage for persistence
- Optimistic UI updates
- Error boundaries for fault tolerance

### 4. Performance Optimizations
- Virtual scrolling for large lists (ready to implement)
- Lazy loading for history items
- Debounced search input
- Memoized calculations

### 5. Accessibility
- Semantic HTML structure
- ARIA labels for screen readers
- Keyboard navigation support
- Focus management in wizard

## Styling Architecture

### CSS Modules Structure
Each component has its own `.module.css` file with:
- Component-scoped styles
- CSS variables for theming
- Dark mode support ready
- Consistent spacing scale
- Responsive utilities

### Design Tokens
```css
--radius-sm: 0.25rem;
--radius-md: 0.375rem;
--radius-lg: 0.5rem;
--shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
--shadow-md: 0 4px 6px rgba(0,0,0,0.1);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
```

## User Flow

### Primary Flow
1. User lands on dashboard → Views stats and recent calculations
2. Clicks "Start New Calculation" → Enters wizard
3. Step 1: Enters product details → Continue
4. Step 2: Configures shipping → Continue
5. Step 3: Adds additional costs (optional) → Continue
6. Step 4: Reviews all details → Calculate
7. System saves to history → Redirects to results
8. Results page shows breakdown → Can export/share/print

### Secondary Flows
- **Quick Recalculate:** History → Select previous → Duplicate
- **Bulk Analysis:** History → Select multiple → Export to CSV
- **Template Usage:** (Phase 3) Templates → Select → Pre-fill wizard

## Integration Points

### Ready for Integration
1. HSN Code API for autocomplete
2. Currency conversion API
3. Port database for search
4. Freight rate calculator API
5. PDF generation service
6. Email sharing service

### Data Export Formats
- CSV (implemented)
- PDF (ready to implement)
- Excel (ready to implement)
- JSON (ready to implement)

## Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Metrics
- Initial load: < 3s
- Step navigation: < 100ms
- Calculation: < 500ms
- History load: < 1s for 100 items
- Search response: < 200ms

## Security Considerations
- Input validation on all fields
- XSS prevention in dynamic content
- localStorage data encryption ready
- Rate limiting ready for API calls
- CORS configuration for API integration

## Future Enhancements (Phase 3+)
1. **Templates System**
   - Save calculation as template
   - Quick-start with templates
   - Share templates

2. **Comparison View**
   - Compare multiple calculations
   - Side-by-side analysis
   - Difference highlighting

3. **Analytics Dashboard**
   - Trends over time
   - Cost breakdowns by category
   - Predictive analysis

4. **Enhanced Export**
   - Branded PDF reports
   - Excel with formulas
   - Bulk export scheduler