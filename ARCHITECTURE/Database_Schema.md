# Database Schema

**Database:** PostgreSQL (via Supabase)  
**ORM:** Prisma  
**Last Updated:** November 27, 2025

---

## Overview

The Befach database consists of 5 core tables for managing trade operations.

```
┌─────────────────┐     ┌─────────────────┐
│  organizations  │────<│     users       │
└─────────────────┘     └─────────────────┘
         │                      │
         │                      │
         ▼                      ▼
┌─────────────────┐     ┌─────────────────┐
│    suppliers    │<────│     orders      │
└─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │  calculations   │
                        └─────────────────┘
```

---

## Tables

### 1. organizations

Stores company/business profiles.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| name | TEXT | NOT NULL | Company name |
| type | ENUM | DEFAULT 'company' | 'company' or 'individual' |
| industry | TEXT | | Business sector |
| website | TEXT | | Company website |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update |

### 2. users

Stores user accounts (will sync with Supabase Auth later).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| email | TEXT | UNIQUE, NOT NULL | User email |
| name | TEXT | NOT NULL | Full name |
| role | ENUM | DEFAULT 'member' | owner, admin, member, viewer |
| organization_id | UUID | FOREIGN KEY | Links to organizations |
| phone | TEXT | | Phone number |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update |

### 3. suppliers

Stores supplier network.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| name | TEXT | NOT NULL | Supplier name |
| contact_person | TEXT | | Primary contact |
| email | TEXT | | Contact email |
| phone | TEXT | | Contact phone |
| location | TEXT | | City, Country |
| country | TEXT | | Country code |
| specialization | TEXT | | Product categories |
| rating | DECIMAL(2,1) | DEFAULT 0 | 0-5 rating |
| total_orders | INTEGER | DEFAULT 0 | Historical orders |
| verified | BOOLEAN | DEFAULT false | Verification status |
| organization_id | UUID | FOREIGN KEY | Links to organizations |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update |

### 4. orders

Stores import orders.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| order_number | TEXT | UNIQUE, NOT NULL | e.g., ORD-2847 |
| product | TEXT | NOT NULL | Product description |
| hsn_code | TEXT | | HSN classification |
| quantity | INTEGER | NOT NULL | Order quantity |
| unit | TEXT | DEFAULT 'pcs' | Unit of measure |
| supplier_id | UUID | FOREIGN KEY | Links to suppliers |
| user_id | UUID | FOREIGN KEY | Created by user |
| organization_id | UUID | FOREIGN KEY | Links to organizations |
| fob_value | DECIMAL(12,2) | | FOB value in USD |
| landed_cost | DECIMAL(12,2) | | Total landed cost |
| currency | TEXT | DEFAULT 'USD' | Currency code |
| status | ENUM | DEFAULT 'processing' | Order status |
| origin_country | TEXT | | Source country |
| destination_port | TEXT | | Import port |
| notes | TEXT | | Additional notes |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update |

**Status Values:** processing, confirmed, in_transit, customs, delivered, cancelled

### 5. calculations

Stores saved cost calculations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| user_id | UUID | FOREIGN KEY | Created by user |
| organization_id | UUID | FOREIGN KEY | Links to organizations |
| product_name | TEXT | NOT NULL | Product description |
| hsn_code | TEXT | NOT NULL | HSN classification |
| origin_country | TEXT | NOT NULL | Source country |
| shipping_method | TEXT | NOT NULL | 'air' or 'sea' |
| fob_value | DECIMAL(12,2) | NOT NULL | FOB value |
| freight | DECIMAL(12,2) | | Freight cost |
| insurance | DECIMAL(12,2) | | Insurance cost |
| cif_value | DECIMAL(12,2) | | CIF value |
| basic_duty | DECIMAL(12,2) | | BCD amount |
| social_welfare | DECIMAL(12,2) | | SWS amount |
| igst | DECIMAL(12,2) | | IGST amount |
| total_duty | DECIMAL(12,2) | | Total duties |
| landed_cost | DECIMAL(12,2) | | Final landed cost |
| duty_rates | JSONB | | Rate breakdown |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |

---

## Enums

```sql
-- Organization type
CREATE TYPE org_type AS ENUM ('company', 'individual');

-- User role
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'member', 'viewer');

-- Order status
CREATE TYPE order_status AS ENUM (
  'processing', 
  'confirmed', 
  'in_transit', 
  'customs', 
  'delivered', 
  'cancelled'
);
```

---

## Indexes

```sql
-- For faster lookups
CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_organization ON orders(organization_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_suppliers_organization ON suppliers(organization_id);
CREATE INDEX idx_calculations_user ON calculations(user_id);
```

---

## Relationships

| Relationship | Type | Description |
|--------------|------|-------------|
| organizations → users | 1:N | One org has many users |
| organizations → orders | 1:N | One org has many orders |
| organizations → suppliers | 1:N | One org has many suppliers |
| users → orders | 1:N | One user creates many orders |
| users → calculations | 1:N | One user saves many calculations |
| suppliers → orders | 1:N | One supplier has many orders |

---

## Row Level Security (Future)

When auth is implemented:

```sql
-- Users can only see their organization's data
CREATE POLICY "Users see own org data" ON orders
  FOR ALL USING (organization_id = auth.jwt() ->> 'org_id');
```

---

## Sample Data

```sql
-- Sample organization
INSERT INTO organizations (name, type) 
VALUES ('Acme Imports', 'company');

-- Sample supplier
INSERT INTO suppliers (name, location, specialization, rating, verified, organization_id)
VALUES ('Shenzhen Lighting Co.', 'Shenzhen, China', 'LED Lights, Electronics', 4.8, true, 'org-uuid');

-- Sample order
INSERT INTO orders (order_number, product, quantity, supplier_id, fob_value, status, organization_id)
VALUES ('ORD-2847', 'LED Bulbs 9W', 1000, 'supplier-uuid', 2850.00, 'in_transit', 'org-uuid');
```

