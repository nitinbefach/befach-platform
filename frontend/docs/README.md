# Cost Calculator Feature Documentation

## Quick Start

### Running the Application
```bash
cd frontend
npm install
npm run dev
```

Access the calculator at: `http://localhost:3000/cost-calculator`

## Documentation Structure

This folder contains comprehensive documentation for the Import Cost Calculator feature:

### 📚 Main Documentation Files

#### [WIZARD_ARCHITECTURE.md](./WIZARD_ARCHITECTURE.md)
Complete technical documentation of the multi-step wizard implementation including:
- Component architecture
- State management with React Context
- Navigation flow and validation
- Step-by-step component details
- Performance optimizations

#### [STORAGE_SYSTEM.md](./STORAGE_SYSTEM.md)
Detailed documentation of the unified storage layer including:
- Data models and schemas
- Migration from legacy storage
- CRUD operations and API
- Search and filter capabilities
- Export functionality
- Performance considerations

#### [UI_UX_GUIDELINES.md](./UI_UX_GUIDELINES.md)
Design system and guidelines including:
- Color palette and typography
- Component patterns and styles
- Layout and responsive design
- Animation and transitions
- Accessibility requirements

### 📁 Project-Level Documentation

Located in the frontend root directory:

#### [/frontend/CALCULATOR_FEATURES.md](../CALCULATOR_FEATURES.md)
High-level feature overview including:
- Architecture overview
- Phase 1 & 2 implementations
- User flows
- Integration points
- Future enhancements

#### [/frontend/IMPLEMENTATION_LOG.md](../IMPLEMENTATION_LOG.md)
Complete implementation history including:
- Phase-by-phase progress
- Files created/modified
- Issues and resolutions
- Technical decisions
- Development timeline

## Feature Overview

### ✨ Key Features Implemented

#### Phase 1: Multi-Step Wizard
- **4-Step Process**: Product → Shipping → Additional Costs → Review
- **Progress Tracking**: Visual progress indicator with step navigation
- **State Management**: React Context for data persistence
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Validation**: Real-time form validation and error handling

#### Phase 2: History Management
- **Unified Storage**: Single localStorage key with migration
- **Search & Filter**: Multi-criteria search with date ranges
- **Bulk Operations**: Select multiple, delete, export
- **View Modes**: Table and card layouts
- **Export**: CSV download functionality

### 📊 Current Status

| Phase | Component | Status | Documentation |
|-------|-----------|---------|--------------|
| 1 | Multi-step Wizard | ✅ Complete | [Wizard Docs](./WIZARD_ARCHITECTURE.md) |
| 1 | Landing Page | ✅ Complete | [Features](../CALCULATOR_FEATURES.md) |
| 1 | Results Page | ✅ Complete | [Features](../CALCULATOR_FEATURES.md) |
| 2 | History Page | ✅ Complete | [Storage Docs](./STORAGE_SYSTEM.md) |
| 2 | Storage Layer | ✅ Complete | [Storage Docs](./STORAGE_SYSTEM.md) |
| 3 | Templates | 📋 Planned | - |
| 3 | Comparison | 📋 Planned | - |
| 3 | Analytics | 📋 Planned | - |

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   └── cost-calculator/
│   │       ├── page.tsx                 # Landing page
│   │       ├── new/                     # Wizard steps
│   │       │   ├── step-1/             # Product details
│   │       │   ├── step-2/             # Shipping info
│   │       │   ├── step-3/             # Additional costs
│   │       │   └── step-4/             # Review & calculate
│   │       ├── results/[id]/           # Results page
│   │       └── history/                # History management
│   ├── components/
│   │   └── calculator/
│   │       └── wizard/                 # Wizard components
│   │           ├── WizardProvider.tsx
│   │           ├── WizardProgress.tsx
│   │           └── WizardNavigation.tsx
│   └── lib/
│       └── historyStorage.ts          # Storage utilities
├── docs/                               # This documentation
├── CALCULATOR_FEATURES.md
└── IMPLEMENTATION_LOG.md
```

## Navigation Flow

```mermaid
graph LR
    A[Landing Page] --> B[Step 1: Product]
    B --> C[Step 2: Shipping]
    C --> D[Step 3: Costs]
    D --> E[Step 4: Review]
    E --> F[Results Page]
    F --> G[History Page]
    G --> A
```

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **State Management**: React Context API
- **Styling**: CSS Modules
- **Icons**: React Icons
- **Storage**: localStorage with TypeScript
- **Language**: TypeScript

## Development Guidelines

### Adding a New Step
1. Create new folder in `/src/app/cost-calculator/new/step-N/`
2. Add page.tsx and page.module.css
3. Update WizardProgress steps array
4. Add validation in WizardProvider.canProceed()
5. Update form data interface

### Modifying Storage Schema
1. Update interfaces in historyStorage.ts
2. Increment version number
3. Add migration logic if needed
4. Update documentation

### Adding New Features
1. Create feature branch
2. Follow existing patterns
3. Update relevant documentation
4. Test on mobile and desktop
5. Verify localStorage compatibility

## Testing

### Manual Testing Checklist
- [ ] Complete wizard flow
- [ ] Back navigation preserves data
- [ ] Validation prevents invalid submission
- [ ] Results display correctly
- [ ] History page loads and filters work
- [ ] Export CSV functions
- [ ] Mobile responsive design
- [ ] Browser compatibility (Chrome, Firefox, Safari, Edge)

### Browser Support
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- Mobile browsers ✅

## Common Tasks

### Clear All Data
```javascript
// In browser console
localStorage.removeItem('importCalculator_unified');
```

### Export All Data
```javascript
// In browser console
const data = JSON.parse(localStorage.getItem('importCalculator_unified'));
console.log(JSON.stringify(data, null, 2));
```

### Check Storage Size
```javascript
// In browser console
const size = new Blob([localStorage.getItem('importCalculator_unified')]).size;
console.log(`Storage used: ${(size / 1024).toFixed(2)} KB`);
```

## Troubleshooting

### Issue: Wizard loses data on navigation
**Solution**: Check WizardProvider is wrapping all steps in layout.tsx

### Issue: History not showing calculations
**Solution**: Verify storage key migration completed, check browser console

### Issue: Export CSV not working
**Solution**: Check popup blockers, verify browser allows downloads

### Issue: Mobile layout broken
**Solution**: Check viewport meta tag, test in device mode

## Future Enhancements

### Phase 3 (Planned)
- **Templates**: Save and reuse common calculations
- **Comparison**: Compare multiple calculations side-by-side
- **Analytics**: Charts and insights from history
- **Enhanced Export**: PDF, Excel formats

### Long-term Goals
- Backend API integration
- User accounts and cloud sync
- Real-time collaboration
- Advanced analytics and reporting
- Multi-language support
- Automated testing suite

## Contributing

### Code Style
- Use TypeScript for type safety
- Follow existing component patterns
- Keep components focused and reusable
- Document complex logic
- Use meaningful variable names

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: add your feature"

# Push and create PR
git push origin feature/your-feature
```

## Support

For questions or issues:
1. Check this documentation
2. Review the implementation log
3. Check browser console for errors
4. Verify localStorage is enabled

---

*Documentation last updated: Current Session*
*Feature Version: 2.0.0*
*Status: Active Development*