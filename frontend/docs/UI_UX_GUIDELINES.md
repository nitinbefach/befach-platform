# UI/UX Guidelines for Cost Calculator

## Design Principles

### 1. Progressive Disclosure
Show only necessary information at each step, revealing complexity gradually.

### 2. Mobile-First
Design for mobile devices first, then enhance for larger screens.

### 3. Clear Visual Hierarchy
Use size, color, and spacing to guide users through the interface.

### 4. Consistent Feedback
Provide immediate visual feedback for all user actions.

### 5. Error Prevention
Design to prevent errors rather than just handling them.

## Color Palette

### Primary Colors
```css
--accent-primary: #f97316;     /* Orange - Primary actions */
--accent-secondary: #ea580c;   /* Dark Orange - Hover states */
--accent-light: #fed7aa;       /* Light Orange - Backgrounds */
```

### Status Colors
```css
--success: #10b981;            /* Green - Success states */
--warning: #f59e0b;            /* Amber - Warnings */
--error: #ef4444;              /* Red - Errors */
--info: #3b82f6;               /* Blue - Information */
```

### Neutral Colors
```css
--text-primary: #111827;       /* Almost black - Main text */
--text-secondary: #6b7280;     /* Gray - Secondary text */
--text-muted: #9ca3af;         /* Light gray - Disabled */
--border-color: #e5e7eb;       /* Border gray */
--bg-primary: #ffffff;         /* White - Main background */
--bg-secondary: #f9fafb;       /* Off-white - Alt background */
--bg-tertiary: #f3f4f6;        /* Light gray - Sections */
```

### Dark Mode (Ready)
```css
--surface-dark: #1f2937;       /* Dark surface */
--background-dark: #111827;    /* Dark background */
--text-dark: #f9fafb;          /* Light text */
```

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
             Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### Size Scale
```css
--text-xs: 0.75rem;    /* 12px - Captions */
--text-sm: 0.875rem;   /* 14px - Small text */
--text-base: 1rem;     /* 16px - Body text */
--text-lg: 1.125rem;   /* 18px - Large text */
--text-xl: 1.25rem;    /* 20px - Headings */
--text-2xl: 1.5rem;    /* 24px - Section titles */
--text-3xl: 1.875rem;  /* 30px - Page titles */
--text-4xl: 2.25rem;   /* 36px - Hero text */
```

### Weight Scale
```css
--font-normal: 400;    /* Body text */
--font-medium: 500;    /* Emphasis */
--font-semibold: 600;  /* Buttons, labels */
--font-bold: 700;      /* Headings */
```

## Spacing System

### Base Unit: 4px
```css
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-5: 1.25rem;    /* 20px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
```

## Component Patterns

### Buttons

#### Primary Button
```css
.btnPrimary {
  background: var(--accent-primary);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  transition: all 0.3s ease;
}

.btnPrimary:hover {
  background: var(--accent-secondary);
  transform: translateY(-2px);
}
```

#### Secondary Button
```css
.btnSecondary {
  background: white;
  color: var(--accent-primary);
  border: 1px solid var(--accent-primary);
  padding: 0.75rem 1.5rem;
}
```

#### Size Variants
- Small: `padding: 0.5rem 1rem`
- Medium: `padding: 0.75rem 1.5rem` (default)
- Large: `padding: 1rem 2rem`

### Form Controls

#### Input Fields
```css
.input {
  padding: 0.625rem 1rem;
  border: 1px solid var(--input-border);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}
```

#### Labels
```css
.label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}
```

#### Error States
```css
.inputError {
  border-color: var(--error);
  background: rgba(239, 68, 68, 0.05);
}

.errorMessage {
  color: var(--error);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
```

### Cards

#### Basic Card
```css
.card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-color);
}
```

#### Card Sections
- Header: Padding 1rem, background subtle
- Body: Padding 1.5rem
- Footer: Padding 1rem, border-top

### Tables

#### Responsive Table
```css
.tableContainer {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.table {
  min-width: 600px; /* Prevent squashing */
}

/* Mobile: Convert to cards */
@media (max-width: 768px) {
  .table { display: block; }
  .tableRow {
    display: block;
    border: 1px solid var(--border-color);
    margin-bottom: 1rem;
    padding: 1rem;
  }
}
```

## Layout Patterns

### Container Widths
```css
.container-sm { max-width: 640px; }
.container-md { max-width: 768px; }
.container-lg { max-width: 1024px; }
.container-xl { max-width: 1280px; }
.container-2xl { max-width: 1400px; }
```

### Grid System
```css
.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(4, 1fr); }

/* Auto-responsive */
.grid-auto {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
```

## Animation & Transitions

### Standard Transitions
```css
--transition-fast: 150ms;
--transition-base: 300ms;
--transition-slow: 500ms;

/* Usage */
transition: all var(--transition-base) ease;
```

### Hover Effects
```css
/* Lift */
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Scale */
.hover-scale:hover {
  transform: scale(1.05);
}

/* Fade */
.hover-fade:hover {
  opacity: 0.8;
}
```

### Loading States
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.skeleton {
  animation: pulse 2s ease-in-out infinite;
}
```

## Responsive Design

### Breakpoints
```css
--mobile: 640px;     /* Small phones */
--tablet: 768px;     /* Tablets */
--laptop: 1024px;    /* Laptops */
--desktop: 1280px;   /* Desktops */
```

### Mobile Considerations

#### Touch Targets
- Minimum size: 44x44px
- Spacing between: 8px minimum
- Thumb-friendly zones

#### Navigation
- Bottom bar for primary actions
- Hamburger menu for secondary
- Swipe gestures where appropriate

#### Typography
- Minimum font size: 14px
- Line height: 1.5 for readability
- Avoid justified text

#### Performance
- Lazy load images
- Minimize JavaScript
- Optimize critical CSS

## Accessibility Guidelines

### Focus Management
```css
.focusable:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}
```

### ARIA Labels
```html
<button aria-label="Close dialog">
  <Icon />
</button>

<nav aria-label="Main navigation">
  ...
</nav>
```

### Color Contrast
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive: 3:1 minimum

### Keyboard Navigation
- Tab order logical
- Skip links provided
- Escape to close modals
- Enter to submit forms

## Icon Usage

### Icon Library
Using React Icons (react-icons) for consistency.

### Common Icons
```javascript
import {
  FaCheckCircle,   // Success
  FaTimesCircle,   // Error
  FaInfoCircle,    // Information
  FaExclamationTriangle, // Warning
  FaEdit,          // Edit action
  FaTrash,         // Delete action
  FaDownload,      // Download/Export
  FaUpload,        // Upload/Import
  FaSearch,        // Search
  FaFilter,        // Filter
  FaSort,          // Sort
  FaChevronLeft,   // Back
  FaChevronRight,  // Forward
  FaPlus,          // Add
  FaMinus,         // Remove
} from 'react-icons/fa';
```

### Icon Sizes
```css
.icon-sm { width: 16px; height: 16px; }
.icon-md { width: 20px; height: 20px; }
.icon-lg { width: 24px; height: 24px; }
.icon-xl { width: 32px; height: 32px; }
```

## Error Handling

### Error Messages
- Be specific and helpful
- Provide next steps
- Use plain language
- Show inline when possible

### Empty States
```jsx
<div className={styles.emptyState}>
  <Icon className={styles.emptyIcon} />
  <h3>No calculations yet</h3>
  <p>Start your first calculation to see it here</p>
  <button>Start Calculation</button>
</div>
```

### Loading States
```jsx
<div className={styles.loading}>
  <Spinner />
  <p>Loading calculations...</p>
</div>
```

## Performance Guidelines

### Image Optimization
- Use WebP format
- Provide responsive sizes
- Lazy load below fold
- Add loading placeholders

### CSS Optimization
- Use CSS modules
- Minimize specificity
- Avoid deep nesting
- Use CSS variables

### JavaScript Optimization
- Code split by route
- Lazy load components
- Debounce input handlers
- Memoize expensive operations

## Testing Checklist

### Visual Testing
- [ ] All breakpoints tested
- [ ] Dark mode compatible
- [ ] Print styles work
- [ ] No layout breaks

### Interaction Testing
- [ ] All buttons clickable
- [ ] Forms validate correctly
- [ ] Navigation works
- [ ] Keyboard accessible

### Performance Testing
- [ ] Page load < 3s
- [ ] Smooth scrolling
- [ ] No janky animations
- [ ] Images optimized

### Accessibility Testing
- [ ] Screen reader compatible
- [ ] Keyboard navigable
- [ ] Color contrast passes
- [ ] Focus indicators visible