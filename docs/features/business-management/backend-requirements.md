# Business Management - Backend Requirements

## Overview

The Business Management feature handles the registration, profile management, verification, and lifecycle of small businesses that operate loyalty programs on the platform. A Business belongs to a Tenant and represents the merchant entity.

---

## Requirements

### REQ-BM-BE-001: Business Registration

**Description:** The system shall allow registration of new businesses within a tenant.

**Acceptance Criteria:**
- AC1: System shall generate unique BusinessId (UUID)
- AC2: System shall validate required fields: BusinessName, OwnerName, Email, Phone
- AC3: System shall categorize business by type: Automotive, Retail, Services, Food & Beverage
- AC4: System shall capture complete address information
- AC5: System shall publish `BusinessRegistered` event
- AC6: System shall associate business with parent TenantId

### REQ-BM-BE-002: Business Profile Updates

**Description:** The system shall allow updating business profile information.

**Acceptance Criteria:**
- AC1: System shall track all field changes with previous values
- AC2: System shall validate updated fields
- AC3: System shall publish `BusinessProfileUpdated` event
- AC4: System shall maintain update audit trail

### REQ-BM-BE-003: Business Verification

**Description:** The system shall support business verification processes.

**Acceptance Criteria:**
- AC1: System shall support verification types: Email, Phone, Identity, Document
- AC2: System shall generate and validate verification codes
- AC3: System shall publish `BusinessVerified` event
- AC4: System shall update verification status on business record
- AC5: System shall allow multiple verification types per business

### REQ-BM-BE-004: Business Suspension

**Description:** The system shall allow suspending business accounts.

**Acceptance Criteria:**
- AC1: System shall capture suspension reason
- AC2: System shall prevent member-facing operations during suspension
- AC3: System shall publish `BusinessSuspended` event
- AC4: System shall notify business owner of suspension
- AC5: System shall maintain read-only access for business owner

### REQ-BM-BE-005: Business Reactivation

**Description:** The system shall allow reactivating suspended businesses.

**Acceptance Criteria:**
- AC1: System shall validate suspension reason resolution
- AC2: System shall restore full business functionality
- AC3: System shall publish `BusinessReactivated` event
- AC4: System shall notify business owner of reactivation

### REQ-BM-BE-006: Business Closure

**Description:** The system shall allow permanent closure of businesses.

**Acceptance Criteria:**
- AC1: System shall require explicit closure confirmation
- AC2: System shall handle outstanding member points per policy
- AC3: System shall publish `BusinessClosed` event
- AC4: System shall archive business data
- AC5: System shall notify all members of closure

---

## Data Models

### Business Entity

```
Business
├── BusinessId: Guid (PK)
├── TenantId: Guid (FK)
├── BusinessName: string (required, max 200)
├── OwnerName: string (required)
├── Email: string (required)
├── Phone: string (required)
├── BusinessType: BusinessType (enum)
├── Address: Address (value object)
├── Status: BusinessStatus (enum)
├── IsEmailVerified: bool
├── IsPhoneVerified: bool
├── IsIdentityVerified: bool
├── RegisteredAt: DateTime
├── CreatedAt: DateTime
├── UpdatedAt: DateTime
```

### Address Value Object

```
Address
├── Street: string
├── City: string
├── State: string
├── PostalCode: string
├── Country: string
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tenants/{tenantId}/businesses` | Register business |
| GET | `/api/tenants/{tenantId}/businesses` | List businesses |
| GET | `/api/tenants/{tenantId}/businesses/{businessId}` | Get business details |
| PUT | `/api/tenants/{tenantId}/businesses/{businessId}` | Update business |
| POST | `/api/tenants/{tenantId}/businesses/{businessId}/verify` | Request verification |
| POST | `/api/tenants/{tenantId}/businesses/{businessId}/verify/confirm` | Confirm verification |
| POST | `/api/tenants/{tenantId}/businesses/{businessId}/suspend` | Suspend business |
| POST | `/api/tenants/{tenantId}/businesses/{businessId}/reactivate` | Reactivate business |
| POST | `/api/tenants/{tenantId}/businesses/{businessId}/close` | Close business |

---

## Domain Events

- `BusinessRegistered`
- `BusinessProfileUpdated`
- `BusinessVerified`
- `BusinessSuspended`
- `BusinessReactivated`
- `BusinessClosed`
