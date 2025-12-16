# Multi-Step Wizard Architecture

## Overview
The multi-step wizard is the core user interface for the cost calculator, breaking down complex import cost calculations into manageable steps.

## Design Philosophy

### Progressive Disclosure
We follow the principle of progressive disclosure to reduce cognitive load:
- **Step 1:** Essential product information only
- **Step 2:** Shipping details when product is defined
- **Step 3:** Optional additional costs
- **Step 4:** Review everything before calculation

### Mobile-First Approach
Every component is designed mobile-first:
- Touch-friendly controls (minimum 44px touch targets)
- Bottom navigation bar on mobile
- Collapsible sections for space efficiency
- Responsive grid layouts

## Component Architecture

### 1. WizardProvider (State Layer)
```
Purpose: Centralized state management
Location: /src/components/calculator/wizard/WizardProvider.tsx
```

**State Structure:**
```typescript
{
  currentStep: number,
  formData: {
    // Step 1
    productName: string,
    hsnCode: string,
    fobValue: string,
    currency: string,
    weight?: string,
    dutyRate?: string,

    // Step 2
    shippingMode: 'sea' | 'air' | 'road',
    originPort: string,
    destinationPort: string,
    estimatedDays?: string,
    freightCost: string,
    insuranceRequired: boolean,
    insuranceAmount?: string,

    // Step 3
    packingCharges?: string,
    inlandFreight?: string,
    bankCharges?: string,
    commissionRate?: string,
    customCharges?: Array<{
      name: string,
      amount: string,
      type: 'fixed' | 'percentage'
    }>,
    totalAdditionalCosts?: string
  }
}
```

**Key Methods:**
- `updateFormData(data)` - Merge new data with existing
- `resetFormData()` - Clear all form data
- `canProceed(step)` - Validate if step is complete
- `setCurrentStep(step)` - Navigate to specific step

### 2. WizardProgress (Visual Indicator)
```
Purpose: Show user's position in the wizard
Location: /src/components/calculator/wizard/WizardProgress.tsx
```

**Props:**
```typescript
interface WizardProgressProps {
  currentStep: number;
  steps: Array<{
    number: number;
    title: string;
    description?: string;
  }>;
  onStepClick?: (step: number) => void;
}
```

**Responsive Behavior:**
- **Desktop (>768px):** Horizontal stepper with labels
- **Mobile (<768px):** Compact progress bar

**Visual States:**
- Completed: Green checkmark
- Current: Orange highlight with animation
- Upcoming: Gray/disabled appearance

### 3. WizardNavigation (Control Layer)
```
Purpose: Navigation controls between steps
Location: /src/components/calculator/wizard/WizardNavigation.tsx
```

**Props:**
```typescript
interface WizardNavigationProps {
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  isLoading?: boolean;
}
```

**Behavior:**
- Back button hidden on first step
- Continue becomes Calculate on last step
- Loading state disables all buttons
- Mobile: Fixed bottom bar
- Desktop: Inline with form

## Step Components

### Step 1: Product Details
**Validation Rules:**
- productName: Required, min 2 characters
- hsnCode: Required, 8 digits
- fobValue: Required, positive number
- currency: Required, valid ISO code
- weight: Optional, positive number
- dutyRate: Optional, 0-100 percentage

**Features:**
- HSN code autocomplete (ready for API)
- Real-time FOB calculation
- Currency converter placeholder

### Step 2: Shipping Information
**Validation Rules:**
- shippingMode: Required selection
- originPort: Required, min 2 characters
- destinationPort: Required, min 2 characters
- freightCost: Required, positive number
- insuranceAmount: Required if insuranceRequired is true

**Features:**
- Dynamic fields based on mode
- Port search with debounce
- Insurance calculator
- Transit time estimator

### Step 3: Additional Costs
**Validation Rules:**
- All fields optional
- Custom charges must have name and amount
- Percentages must be 0-100

**Features:**
- Add unlimited custom charges
- Toggle between fixed/percentage
- Running total calculation
- Predefined charge templates

### Step 4: Review & Calculate
**Validation Rules:**
- All previous steps must be valid
- No additional input required

**Features:**
- Complete summary view
- Edit any section inline
- Validation error display
- Save to history on calculate

## Navigation Flow

### Forward Navigation
```
Step 1 → Step 2 → Step 3 → Step 4 → Results
```
- Validation required to proceed
- Data saved to context on navigation
- Skip not allowed

### Backward Navigation
```
Results ← Step 4 ← Step 3 ← Step 2 ← Step 1
```
- No validation on back
- Data preserved in context
- Can jump to any previous step

### Direct Navigation
- Clicking on completed step in progress bar
- Only allowed for completed steps
- Preserves all entered data

## Data Flow

### 1. Input Collection
```
User Input → Step Component → WizardProvider → Context State
```

### 2. Validation
```
Step Component → Validation Rules → Enable/Disable Next
```

### 3. Calculation
```
Step 4 Review → Calculate Button → Save to Storage → Navigate to Results
```

### 4. Results Display
```
Results Page → Load from Storage by ID → Display Breakdown
```

## Error Handling

### Validation Errors
- Inline field validation
- Summary in Step 4
- Prevent navigation if invalid

### Storage Errors
- Fallback to session storage
- Error toast notification
- Retry mechanism

### Navigation Errors
- Redirect to Step 1 if context lost
- Restore from localStorage if available

## Performance Optimizations

### Code Splitting
```javascript
// Each step is a separate bundle
const Step1 = lazy(() => import('./step-1/page'));
const Step2 = lazy(() => import('./step-2/page'));
```

### Memoization
```javascript
// Expensive calculations cached
const totalCost = useMemo(() => calculateTotal(formData), [formData]);
```

### Debouncing
```javascript
// Search and autocomplete inputs
const debouncedSearch = useDebounce(searchTerm, 300);
```

## Testing Strategy

### Unit Tests
- Each component in isolation
- Validation logic
- State management hooks

### Integration Tests
- Complete wizard flow
- Data persistence
- Navigation guards

### E2E Tests
- Full user journey
- Error scenarios
- Mobile responsiveness

## Accessibility Features

### Keyboard Navigation
- Tab through all controls
- Enter to submit forms
- Escape to close modals

### Screen Readers
- ARIA labels on all inputs
- Step announcements
- Error announcements

### Focus Management
- Focus trap in wizard
- Return focus on navigation
- Visible focus indicators

## Browser Support
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- Mobile Safari ✅
- Chrome Mobile ✅

## Future Enhancements

### Planned Features
1. Save draft functionality
2. Step validation indicators
3. Conditional fields based on selections
4. Multi-language support
5. Keyboard shortcuts
6. Undo/Redo functionality

### API Integrations
1. HSN code database
2. Port information API
3. Real-time freight rates
4. Currency conversion API
5. Duty rate calculator