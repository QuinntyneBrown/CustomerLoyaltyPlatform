# Tenant Management - Frontend Requirements

## Overview

The Tenant Management frontend provides administrative interfaces for managing tenant lifecycle, settings, branding, and configuration within the Customer Loyalty Platform.

---

## Requirements

### REQ-TM-FE-001: Tenant Dashboard

**Description:** The system shall provide a comprehensive tenant dashboard for administrators.

**Acceptance Criteria:**
- AC1: Dashboard shall display tenant status (Active, Suspended, Pending)
- AC2: Dashboard shall show quick stats: member count, active programs, recent activity
- AC3: Dashboard shall provide navigation to all tenant management sections
- AC4: Dashboard shall display alerts for pending actions or issues
- AC5: Dashboard shall be responsive and mobile-friendly

### REQ-TM-FE-002: Tenant Profile Page

**Description:** The system shall provide a tenant profile management page.

**Acceptance Criteria:**
- AC1: Page shall display all tenant information in editable form
- AC2: Page shall validate TenantSlug for URL-friendly format
- AC3: Page shall show read-only fields (TenantId, ProvisionedAt)
- AC4: Page shall provide save/cancel actions with confirmation
- AC5: Page shall show success/error notifications on save

### REQ-TM-FE-003: Branding Configuration Page

**Description:** The system shall provide a branding customization interface.

**Acceptance Criteria:**
- AC1: Page shall provide logo upload with preview
- AC2: Page shall provide color pickers for Primary and Secondary colors
- AC3: Page shall show live preview of branding changes
- AC4: Page shall validate custom domain format
- AC5: Page shall display DNS configuration instructions for custom domains

### REQ-TM-FE-004: Settings Management Page

**Description:** The system shall provide a settings configuration interface.

**Acceptance Criteria:**
- AC1: Page shall group settings by category
- AC2: Page shall show setting descriptions and allowed values
- AC3: Page shall track and display setting change history
- AC4: Page shall support bulk settings update
- AC5: Page shall provide reset to default option

### REQ-TM-FE-005: Feature Toggles Page

**Description:** The system shall provide a feature management interface.

**Acceptance Criteria:**
- AC1: Page shall list all available features with descriptions
- AC2: Page shall show feature availability based on plan
- AC3: Page shall provide toggle switches for enabling/disabling
- AC4: Page shall show confirmation dialog for feature changes
- AC5: Page shall indicate features that require upgrade

### REQ-TM-FE-006: Limits & Usage Page

**Description:** The system shall display tenant resource limits and usage.

**Acceptance Criteria:**
- AC1: Page shall display current limits by type
- AC2: Page shall show usage progress bars
- AC3: Page shall highlight limits approaching threshold
- AC4: Page shall provide upgrade prompts when near limits
- AC5: Page shall show historical usage trends

### REQ-TM-FE-007: API Keys Management Page

**Description:** The system shall provide API key management interface.

**Acceptance Criteria:**
- AC1: Page shall list all API keys with masked display
- AC2: Page shall provide key generation with permission selection
- AC3: Page shall show generated key ONCE with copy functionality
- AC4: Page shall support key revocation with confirmation
- AC5: Page shall display key usage statistics

### REQ-TM-FE-008: Data Export Page

**Description:** The system shall provide data export request interface.

**Acceptance Criteria:**
- AC1: Page shall allow format selection (JSON, CSV, XML)
- AC2: Page shall explain data included in export
- AC3: Page shall show export request status and history
- AC4: Page shall provide download links for completed exports
- AC5: Page shall show expiration countdown for download links

### REQ-TM-FE-009: Suspension/Reactivation Interface

**Description:** The system shall handle suspended tenant experience.

**Acceptance Criteria:**
- AC1: Suspended tenants shall see suspension notice with reason
- AC2: Page shall display contact information for resolution
- AC3: Page shall show data retention countdown if applicable
- AC4: Admin shall have access to view-only data during suspension
- AC5: Reactivation shall restore full functionality immediately

---

## UI Components

### TenantStatusBadge

```
Props:
- status: 'active' | 'suspended' | 'pending' | 'deleted'

Display:
- Color-coded badge with status icon
- Tooltip with status details
```

### BrandingPreview

```
Props:
- logoUrl: string
- primaryColor: string
- secondaryColor: string

Display:
- Mini preview of loyalty card with branding
- Sample UI elements with colors applied
```

### FeatureToggle

```
Props:
- feature: FeatureConfig
- enabled: boolean
- available: boolean
- onChange: (enabled: boolean) => void

Display:
- Toggle switch
- Feature name and description
- Lock icon if not available on plan
```

### UsageMeter

```
Props:
- current: number
- limit: number
- label: string
- warningThreshold: number

Display:
- Progress bar with percentage
- Color changes at warning threshold
- Limit label
```

### ApiKeyCard

```
Props:
- keyId: string
- keyName: string
- permissions: string[]
- createdAt: Date
- expiresAt: Date | null
- onRevoke: () => void

Display:
- Key name and masked ID
- Permission badges
- Expiration status
- Revoke button
```

---

## Page Layouts

### Tenant Settings Layout

```
┌─────────────────────────────────────────────────────────┐
│  Tenant Settings                              [Save]    │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌─────────────────────────────────┐  │
│  │ Navigation   │  │  Content Area                   │  │
│  │ ──────────── │  │                                 │  │
│  │ • Profile    │  │  [Dynamic based on selection]   │  │
│  │ • Branding   │  │                                 │  │
│  │ • Settings   │  │                                 │  │
│  │ • Features   │  │                                 │  │
│  │ • Limits     │  │                                 │  │
│  │ • API Keys   │  │                                 │  │
│  │ • Export     │  │                                 │  │
│  └──────────────┘  └─────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## User Flows

### Branding Update Flow

1. User navigates to Branding page
2. User uploads logo or enters logo URL
3. User selects primary and secondary colors
4. System shows live preview
5. User clicks Save
6. System validates inputs
7. System saves branding configuration
8. System shows success notification
9. Branding updates reflect across tenant

### API Key Generation Flow

1. User navigates to API Keys page
2. User clicks "Generate New Key"
3. Modal opens with key configuration
4. User enters key name
5. User selects permissions
6. User optionally sets expiration
7. User clicks Generate
8. System generates key and displays ONCE
9. User copies key (required before closing)
10. Modal closes, key appears in list (masked)

---

## Validation Rules

| Field | Rules |
|-------|-------|
| TenantName | Required, 3-200 characters |
| TenantSlug | Required, lowercase, alphanumeric with hyphens, 3-50 chars |
| PrimaryContactEmail | Required, valid email format |
| LogoUrl | Valid URL format, HTTPS required |
| PrimaryColor | Valid hex color (#RRGGBB) |
| SecondaryColor | Valid hex color (#RRGGBB) |
| CustomDomain | Valid domain format |
| ApiKeyName | Required, 3-100 characters |

---

## Error Handling

1. Display user-friendly error messages for validation failures
2. Show retry options for network errors
3. Redirect suspended tenants to suspension notice
4. Log errors for debugging with correlation IDs
5. Provide fallback UI for failed component loads
