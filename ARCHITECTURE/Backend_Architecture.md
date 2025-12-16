# Backend Architecture

**Framework:** Express.js 4.18  
**Runtime:** Node.js 18+  
**Language:** JavaScript  
**Last Updated:** November 27, 2025

---

## Directory Structure

```
backend/
├── src/
│   ├── index.js              # Main server entry point
│   ├── config/
│   │   └── index.js          # Configuration and constants
│   └── routes/               # API route handlers
│       ├── ai.js             # AI assistant endpoints
│       ├── apikeys.js        # API key management
│       ├── auth.js           # Authentication
│       ├── calculator.js     # Cost calculation
│       ├── chat.js           # Chat support
│       ├── compliance.js     # BOE and regulations
│       ├── market.js         # Market insights
│       ├── orders.js         # Order management
│       ├── reports.js        # Analytics reports
│       ├── requirements.js   # Sourcing requirements
│       ├── shipments.js      # Shipment tracking
│       ├── suppliers.js      # Supplier management
│       ├── team.js           # Team management
│       └── user.js           # User profile/preferences
│
├── package.json              # Dependencies
└── node_modules/             # Installed packages
```

---

## Server Configuration

### Entry Point (index.js)
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
// ... more routes

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Middleware Stack
1. `helmet()` - Security headers
2. `cors()` - Cross-origin requests (localhost:3000)
3. `morgan('dev')` - HTTP request logging
4. `express.json()` - JSON body parsing
5. `express.urlencoded()` - Form data parsing

---

## API Routes (14 Modules)

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | User login |
| POST | `/logout` | Logout user |
| GET | `/me` | Get current user |

### 2. Orders (`/api/orders`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all orders with stats |
| GET | `/:id` | Get single order |
| POST | `/` | Create new order |
| PUT | `/:id` | Update order |
| DELETE | `/:id` | Delete order |

### 3. Suppliers (`/api/suppliers`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all suppliers |
| GET | `/:id` | Get single supplier |
| POST | `/` | Add new supplier |
| POST | `/match` | Match suppliers to product |

### 4. Shipments (`/api/shipments`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all shipments |
| GET | `/:id` | Get single shipment |
| POST | `/track` | Track shipment |

### 5. Calculator (`/api/calculator`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/landed-cost` | Calculate landed cost |
| GET | `/duty-rates/:hsn` | Get duty rates by HSN |
| GET | `/stats` | Get calculation stats |

### 6. Compliance (`/api/compliance`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/boe` | Get all BOE records |
| GET | `/boe/:id` | Get single BOE |
| POST | `/boe` | File new BOE |
| GET | `/regulations` | Get regulations |

### 7. Market (`/api/market`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/insights` | Get market insights |
| GET | `/products/:hsn` | Get product data |
| GET | `/opportunities` | Get opportunities |

### 8. AI (`/api/ai`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/chat` | Chat with AI |
| GET | `/recent` | Get recent queries |
| GET | `/stats` | Get AI stats |
| GET | `/popular` | Get popular questions |

### 9. User (`/api/user`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile` | Get user profile |
| PUT | `/profile` | Update profile |
| GET | `/preferences` | Get preferences |
| PUT | `/preferences` | Update preferences |

### 10. Requirements (`/api/requirements`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all requirements |
| POST | `/` | Submit requirement |
| GET | `/:id` | Get single requirement |

### 11. Team (`/api/team`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/members` | Get team members |
| POST | `/invite` | Invite member |
| PUT | `/members/:id` | Update member |
| DELETE | `/members/:id` | Remove member |

### 12. Reports (`/api/reports`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all reports |
| GET | `/analytics` | Get analytics data |
| POST | `/generate` | Generate report |

### 13. API Keys (`/api/apikeys`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get API keys |
| POST | `/` | Create API key |
| DELETE | `/:id` | Revoke API key |

### 14. Chat (`/api/chat`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/conversations` | Get conversations |
| POST | `/message` | Send message |

---

## Business Logic

### Cost Calculation (calculator.js)

```javascript
// Landed Cost Formula
const calculateLandedCost = (fobValue, hsnCode, shippingMethod) => {
  // 1. Get duty rates by HSN
  const rates = getDutyRates(hsnCode);
  
  // 2. Calculate freight
  const freightRate = shippingMethod === 'air' ? 0.15 : 0.08;
  const freight = fobValue * freightRate;
  
  // 3. Calculate insurance (1%)
  const insurance = fobValue * 0.01;
  
  // 4. CIF Value
  const cifValue = fobValue + freight + insurance;
  
  // 5. Basic Customs Duty
  const basicDuty = cifValue * (rates.bcd / 100);
  
  // 6. Social Welfare Surcharge (10% of BCD)
  const swSurcharge = basicDuty * 0.10;
  
  // 7. IGST
  const igstBase = cifValue + basicDuty + swSurcharge;
  const igst = igstBase * (rates.igst / 100);
  
  // 8. Total Duty
  const totalDuty = basicDuty + swSurcharge + igst;
  
  // 9. Landed Cost
  const landedCost = cifValue + totalDuty;
  
  return { fobValue, freight, insurance, cifValue, basicDuty, swSurcharge, igst, totalDuty, landedCost };
};
```

### HSN Code Rates
| HSN | Description | BCD | IGST |
|-----|-------------|-----|------|
| 8539 | LED Bulbs | 10% | 18% |
| 8504 | Power Banks | 15% | 18% |
| 5208 | Textiles | 20% | 5% |
| 8518 | Audio Equipment | 15% | 18% |
| 8541 | Solar Cells | 0% | 5% |
| 8517 | Mobile Accessories | 15% | 18% |
| 8542 | Electronic ICs | 0% | 18% |

---

## API Response Format

All endpoints return consistent JSON:

```javascript
{
  success: true,
  data: { /* response data */ },
  message: "Optional message",
  timestamp: "2025-11-27T10:30:00Z",
  stats: { /* optional statistics */ }
}
```

### Error Response
```javascript
{
  success: false,
  error: {
    code: "ERROR_CODE",
    message: "Human-readable message"
  },
  timestamp: "2025-11-27T10:30:00Z"
}
```

---

## Data Storage

### Current: In-Memory
All data is currently stored in memory (mock data). This means:
- Data resets on server restart
- No persistence
- Good for development/demo

### Planned: Database
- PostgreSQL via Supabase
- Prisma ORM for queries
- Redis for caching

---

## Dependencies

```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "helmet": "^7.1.0",
  "morgan": "^1.10.0",
  "dotenv": "^16.3.1"
}
```

---

## Environment Variables

```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
DATABASE_URL=       # Not yet implemented
JWT_SECRET=         # Not yet implemented
```

---

## Running the Server

### Development
```bash
npm run dev    # http://localhost:5000
```

### Production
```bash
npm start
```

---

## Deployment Options

1. **Railway** - $5/month, easy deploy
2. **Render** - $7/month, auto-deploy
3. **Vercel** - Serverless functions
4. **AWS EC2** - Full control

