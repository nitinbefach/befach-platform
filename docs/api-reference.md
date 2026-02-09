# API Inventory

**Base URL:** `http://localhost:5000`  
**Format:** REST API (JSON)  
**Last Updated:** November 27, 2025

---

## Overview

The Befach backend provides 14 API modules with 40+ endpoints for managing trade operations.

---

## Route Files

| File | Base Path | Description |
|------|-----------|-------------|
| `auth.js` | `/api/auth` | Authentication |
| `orders.js` | `/api/orders` | Order management |
| `suppliers.js` | `/api/suppliers` | Supplier network |
| `shipments.js` | `/api/shipments` | Shipment tracking |
| `calculator.js` | `/api/calculator` | Cost calculation |
| `compliance.js` | `/api/compliance` | BOE and regulations |
| `market.js` | `/api/market` | Market insights |
| `ai.js` | `/api/ai` | AI assistant |
| `user.js` | `/api/user` | User profile |
| `requirements.js` | `/api/requirements` | Sourcing requirements |
| `team.js` | `/api/team` | Team management |
| `reports.js` | `/api/reports` | Analytics reports |
| `apikeys.js` | `/api/apikeys` | API key management |
| `chat.js` | `/api/chat` | Chat support |

---

## Complete Endpoint Reference

### Authentication (`/api/auth`)

#### POST `/api/auth/register`
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "company": "Acme Inc"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "usr_123", "email": "user@example.com" },
    "token": "jwt_token_here"
  }
}
```

#### POST `/api/auth/login`
User login.

#### POST `/api/auth/logout`
Logout current session.

#### GET `/api/auth/me`
Get current authenticated user.

---

### Orders (`/api/orders`)

#### GET `/api/orders`
Get all orders with statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [...],
    "stats": {
      "total": 156,
      "processing": 12,
      "inTransit": 45,
      "delivered": 99
    }
  }
}
```

#### GET `/api/orders/:id`
Get single order by ID.

#### POST `/api/orders`
Create new order.

**Request:**
```json
{
  "product": "LED Bulbs 9W",
  "quantity": 1000,
  "supplier": "Shenzhen Lighting Co.",
  "value": 2850
}
```

#### PUT `/api/orders/:id`
Update order status.

#### DELETE `/api/orders/:id`
Delete order.

---

### Suppliers (`/api/suppliers`)

#### GET `/api/suppliers`
Get all suppliers with statistics.

#### GET `/api/suppliers/:id`
Get single supplier details.

#### POST `/api/suppliers`
Add new supplier.

**Request:**
```json
{
  "name": "Shenzhen Lighting Co.",
  "contact": "John Lee",
  "email": "john@szlighting.com",
  "location": "Shenzhen, China",
  "specialization": "LED Lights, Electronics"
}
```

#### POST `/api/suppliers/match`
Match suppliers to product requirements.

**Request:**
```json
{
  "product": "LED Bulbs",
  "category": "Electronics",
  "countries": ["China", "Vietnam"]
}
```

---

### Shipments (`/api/shipments`)

#### GET `/api/shipments`
Get all shipments with statistics.

#### GET `/api/shipments/:id`
Get single shipment with timeline.

#### POST `/api/shipments/track`
Track a shipment.

**Request:**
```json
{
  "trackingNumber": "MSKU4523789012",
  "carrier": "Maersk",
  "orderReference": "ORD-2847"
}
```

---

### Calculator (`/api/calculator`)

#### POST `/api/calculator/landed-cost`
Calculate complete landed cost.

**Request:**
```json
{
  "productName": "LED Bulbs 9W",
  "hsnCode": "8539",
  "fobValue": 2850,
  "originCountry": "China",
  "shippingMethod": "sea"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "productName": "LED Bulbs 9W",
    "hsnCode": "8539",
    "breakdown": {
      "fobValue": 2850,
      "freight": 228,
      "insurance": 28.50,
      "cifValue": 3106.50,
      "basicDuty": 310.65,
      "socialWelfareSurcharge": 31.07,
      "igst": 620.68,
      "totalDuty": 962.40,
      "landedCost": 4068.90
    },
    "rates": {
      "bcd": 10,
      "igst": 18
    }
  }
}
```

#### GET `/api/calculator/duty-rates/:hsn`
Get duty rates for HSN code.

#### GET `/api/calculator/stats`
Get calculation statistics.

---

### Compliance (`/api/compliance`)

#### GET `/api/compliance/boe`
Get all BOE records.

#### GET `/api/compliance/boe/:id`
Get single BOE record.

#### POST `/api/compliance/boe`
File new BOE.

**Request:**
```json
{
  "importId": "ORD-2847",
  "product": "LED Bulbs 9W",
  "hsnCode": "8539",
  "port": "JNPT, Mumbai",
  "invoiceValue": 2850
}
```

#### GET `/api/compliance/regulations`
Get current regulations and alerts.

---

### Market (`/api/market`)

#### GET `/api/market/insights`
Get trending products and global statistics.

#### GET `/api/market/products/:hsn`
Get product market data by HSN.

#### GET `/api/market/opportunities`
Get market opportunities and price alerts.

---

### AI (`/api/ai`)

#### POST `/api/ai/chat`
Chat with AI assistant.

**Request:**
```json
{
  "question": "What are the import duties for LED bulbs from China?",
  "category": "duties"
}
```

#### GET `/api/ai/recent`
Get recent queries.

#### GET `/api/ai/stats`
Get AI usage statistics.

#### GET `/api/ai/popular`
Get popular questions.

---

### User (`/api/user`)

#### GET `/api/user/profile`
Get user profile.

#### PUT `/api/user/profile`
Update user profile.

#### GET `/api/user/preferences`
Get user preferences.

#### PUT `/api/user/preferences`
Update sidebar and notification preferences.

---

### Requirements (`/api/requirements`)

#### GET `/api/requirements`
Get all sourcing requirements.

#### POST `/api/requirements`
Submit new requirement.

#### GET `/api/requirements/:id`
Get single requirement.

---

### Team (`/api/team`)

#### GET `/api/team/members`
Get all team members.

#### POST `/api/team/invite`
Invite new team member.

#### PUT `/api/team/members/:id`
Update member role.

#### DELETE `/api/team/members/:id`
Remove team member.

---

### Reports (`/api/reports`)

#### GET `/api/reports`
Get all reports.

#### GET `/api/reports/analytics`
Get analytics data.

#### POST `/api/reports/generate`
Generate new report.

---

### API Keys (`/api/apikeys`)

#### GET `/api/apikeys`
Get all API keys.

#### POST `/api/apikeys`
Create new API key.

#### DELETE `/api/apikeys/:id`
Revoke API key.

---

### Chat (`/api/chat`)

#### GET `/api/chat/conversations`
Get all conversations.

#### POST `/api/chat/message`
Send chat message.

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message",
  "timestamp": "2025-11-27T10:30:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid HSN code provided"
  },
  "timestamp": "2025-11-27T10:30:00Z"
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `AUTH_REQUIRED` | Authentication required |
| `INVALID_TOKEN` | Invalid or expired token |
| `NOT_FOUND` | Resource not found |
| `VALIDATION_ERROR` | Invalid request data |
| `RATE_LIMITED` | Too many requests |
| `SERVER_ERROR` | Internal server error |

---

## Status

| Endpoint | Status | Notes |
|----------|--------|-------|
| All endpoints | Mock data | Returns static data, not connected to database |
| Calculator | Logic complete | Calculation works, not connected to real HSN database |
| AI | Basic | Keyword matching only, no real AI |

