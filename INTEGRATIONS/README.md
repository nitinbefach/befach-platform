# Integrations

**Purpose:** Third-party service integration documentation.  
**Last Updated:** November 27, 2025  
**Maintenance:** Tech Lead / Backend Team

## Overview

This folder documents all third-party integrations including payment systems, email services, tracking, data services, and analytics.

## Structure

```
INTEGRATIONS/
├── Integration_Master_List.md   # All integrations overview
├── PAYMENT_SYSTEMS/             # Payment processing
│   ├── Razorpay_Integration.md
│   ├── Stripe_Integration.md
│   └── Payment_Flow.md
├── EMAIL_SERVICES/              # Email/notification
│   ├── Resend_Setup.md
│   ├── Email_Templates.md
│   └── Notification_System.md
├── TRACKING_SERVICES/           # Shipment tracking
│   ├── AfterShip_Integration.md
│   ├── Tracking_API.md
│   └── Webhook_Setup.md
├── DATA_SERVICES/               # Trade data sources
│   ├── Zauba_Integration.md
│   ├── HSN_Code_Database.md
│   └── Trade_Data_Pipeline.md
├── ANALYTICS/                   # Analytics and monitoring
│   ├── Mixpanel_Setup.md
│   ├── Sentry_Error_Tracking.md
│   └── Analytics_Events.md
└── THIRD_PARTY_APIS/            # Other APIs
    ├── Mapbox_Integration.md
    ├── OpenAI_Integration.md
    └── Webhook_Management.md
```

## Integration Document Template

```markdown
# Integration: [Service Name]

**Status:** Active / Planned / Deprecated
**API Version:** [Version]
**Last Updated:** [Date]

## Overview
[What this integration does]

## Setup
[How to configure]

## API Endpoints Used
[List of endpoints]

## Authentication
[How auth works]

## Error Handling
[Common errors and solutions]

## Testing
[How to test the integration]
```

## When to Use This Folder

- When implementing new integrations
- When debugging integration issues
- When updating API versions
- When onboarding new developers

