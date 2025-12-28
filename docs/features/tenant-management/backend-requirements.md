# Tenant Management - Backend Requirements

## Overview

The Tenant Management feature handles the complete lifecycle of tenants (business organizations) on the Customer Loyalty Platform. This includes provisioning, activation, suspension, reactivation, deletion, and configuration of tenant-specific settings.

---

## Requirements

### REQ-TM-BE-001: Tenant Provisioning

**Description:** The system shall allow provisioning of new tenants on the platform.

**Acceptance Criteria:**
- AC1: System shall generate a unique TenantId (UUID) for each new tenant
- AC2: System shall validate TenantSlug for URL-friendly format and uniqueness
- AC3: System shall require valid PrimaryContactEmail and PrimaryContactName
- AC4: System shall assign a default PlanType if not specified
- AC5: System shall determine DataRegion based on configuration or user selection
- AC6: System shall publish `TenantProvisioned` event upon successful provisioning
- AC7: System shall create default tenant settings and configurations

### REQ-TM-BE-002: Tenant Activation

**Description:** The system shall allow activation of provisioned tenants after setup completion.

**Acceptance Criteria:**
- AC1: System shall verify all required setup steps are complete before activation
- AC2: System shall update tenant status to "Active"
- AC3: System shall publish `TenantActivated` event with ActivatedBy information
- AC4: System shall enable all tenant features based on PlanType

### REQ-TM-BE-003: Tenant Suspension

**Description:** The system shall allow suspension of tenants for various reasons.

**Acceptance Criteria:**
- AC1: System shall accept SuspensionReason: PaymentFailure, PolicyViolation, SecurityConcern, AdminRequest
- AC2: System shall set DataRetentionDays based on suspension policy
- AC3: System shall prevent all member-facing operations for suspended tenants
- AC4: System shall publish `TenantSuspended` event
- AC5: System shall maintain read-only access for tenant administrators

### REQ-TM-BE-004: Tenant Reactivation

**Description:** The system shall allow reactivation of previously suspended tenants.

**Acceptance Criteria:**
- AC1: System shall validate suspension reason has been resolved
- AC2: System shall restore full tenant functionality
- AC3: System shall publish `TenantReactivated` event with ReactivationReason
- AC4: System shall reset any suspension-related counters

### REQ-TM-BE-005: Tenant Deletion

**Description:** The system shall allow permanent deletion of tenants (GDPR compliance).

**Acceptance Criteria:**
- AC1: System shall require explicit confirmation for deletion
- AC2: System shall support DeletionReason: CustomerRequest, PolicyViolation, DataRetentionExpired
- AC3: System shall purge all tenant data according to retention policy
- AC4: System shall publish `TenantDeleted` event with DataPurged status
- AC5: System shall generate deletion audit trail

### REQ-TM-BE-006: Tenant Settings Management

**Description:** The system shall allow updating tenant-level configuration settings.

**Acceptance Criteria:**
- AC1: System shall track all setting changes with previous and new values
- AC2: System shall validate settings against allowed values/ranges
- AC3: System shall publish `TenantSettingsUpdated` event
- AC4: System shall support rollback of settings changes

### REQ-TM-BE-007: Tenant Branding Configuration

**Description:** The system shall allow tenants to customize their branding.

**Acceptance Criteria:**
- AC1: System shall accept LogoUrl with valid URL format
- AC2: System shall validate color values (PrimaryColor, SecondaryColor) as valid hex codes
- AC3: System shall support CustomDomain configuration with DNS validation
- AC4: System shall publish `TenantBrandingConfigured` event
- AC5: System shall store logo images in tenant-isolated storage

### REQ-TM-BE-008: Feature Toggle Management

**Description:** The system shall allow enabling/disabling features per tenant.

**Acceptance Criteria:**
- AC1: System shall maintain list of toggleable features
- AC2: System shall validate feature availability against PlanType
- AC3: System shall publish `TenantFeatureToggled` event
- AC4: System shall immediately apply feature state changes

### REQ-TM-BE-009: Tenant Limits Management

**Description:** The system shall enforce and manage resource limits per tenant.

**Acceptance Criteria:**
- AC1: System shall support LimitTypes: MaxMembers, MaxPrograms, MaxLocations, ApiRateLimit, StorageQuota
- AC2: System shall enforce limits based on PlanType
- AC3: System shall publish `TenantLimitsUpdated` event when limits change
- AC4: System shall provide limit usage metrics

### REQ-TM-BE-010: Data Export (GDPR Portability)

**Description:** The system shall support full tenant data export for GDPR compliance.

**Acceptance Criteria:**
- AC1: System shall accept export request with format: JSON, CSV, XML
- AC2: System shall generate unique ExportRequestId for tracking
- AC3: System shall process export asynchronously
- AC4: System shall publish `TenantDataExportRequested` event
- AC5: System shall publish `TenantDataExportCompleted` event with secure DownloadUrl
- AC6: System shall set expiration on download links

### REQ-TM-BE-011: API Key Management

**Description:** The system shall manage API keys for tenant integrations.

**Acceptance Criteria:**
- AC1: System shall generate secure API keys with unique ApiKeyId
- AC2: System shall support permission-based access control for keys
- AC3: System shall support optional key expiration
- AC4: System shall publish `TenantApiKeyGenerated` event (excluding actual key)
- AC5: System shall publish `TenantApiKeyRevoked` event with RevocationReason
- AC6: System shall hash and securely store API keys

---

## Data Models

### Tenant Entity

```
Tenant
├── TenantId: Guid (PK)
├── TenantName: string (required, max 200)
├── TenantSlug: string (required, unique, max 50)
├── PrimaryContactEmail: string (required)
├── PrimaryContactName: string (required)
├── PlanType: PlanType (enum)
├── DataRegion: string
├── IsolationLevel: IsolationLevel (enum)
├── Status: TenantStatus (enum)
├── ProvisionedAt: DateTime
├── ActivatedAt: DateTime?
├── CreatedAt: DateTime
├── UpdatedAt: DateTime
```

### TenantSettings Entity

```
TenantSettings
├── TenantSettingsId: Guid (PK)
├── TenantId: Guid (FK)
├── SettingKey: string
├── SettingValue: string
├── UpdatedAt: DateTime
├── UpdatedBy: Guid
```

### TenantBranding Entity

```
TenantBranding
├── TenantBrandingId: Guid (PK)
├── TenantId: Guid (FK)
├── LogoUrl: string?
├── PrimaryColor: string?
├── SecondaryColor: string?
├── CustomDomain: string?
├── ConfiguredAt: DateTime
```

### TenantApiKey Entity

```
TenantApiKey
├── TenantApiKeyId: Guid (PK)
├── TenantId: Guid (FK)
├── KeyName: string
├── KeyHash: string
├── Permissions: string (JSON array)
├── ExpiresAt: DateTime?
├── GeneratedBy: Guid
├── GeneratedAt: DateTime
├── RevokedAt: DateTime?
├── RevokedBy: Guid?
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tenants` | Provision new tenant |
| GET | `/api/tenants/{tenantId}` | Get tenant details |
| PUT | `/api/tenants/{tenantId}` | Update tenant |
| POST | `/api/tenants/{tenantId}/activate` | Activate tenant |
| POST | `/api/tenants/{tenantId}/suspend` | Suspend tenant |
| POST | `/api/tenants/{tenantId}/reactivate` | Reactivate tenant |
| DELETE | `/api/tenants/{tenantId}` | Delete tenant |
| GET | `/api/tenants/{tenantId}/settings` | Get tenant settings |
| PUT | `/api/tenants/{tenantId}/settings` | Update tenant settings |
| GET | `/api/tenants/{tenantId}/branding` | Get tenant branding |
| PUT | `/api/tenants/{tenantId}/branding` | Update tenant branding |
| GET | `/api/tenants/{tenantId}/features` | Get feature toggles |
| PUT | `/api/tenants/{tenantId}/features/{featureName}` | Toggle feature |
| GET | `/api/tenants/{tenantId}/limits` | Get tenant limits |
| POST | `/api/tenants/{tenantId}/export` | Request data export |
| GET | `/api/tenants/{tenantId}/export/{exportId}` | Get export status |
| POST | `/api/tenants/{tenantId}/api-keys` | Generate API key |
| GET | `/api/tenants/{tenantId}/api-keys` | List API keys |
| DELETE | `/api/tenants/{tenantId}/api-keys/{keyId}` | Revoke API key |

---

## Domain Events

- `TenantProvisioned`
- `TenantActivated`
- `TenantSuspended`
- `TenantReactivated`
- `TenantDeleted`
- `TenantSettingsUpdated`
- `TenantBrandingConfigured`
- `TenantFeatureToggled`
- `TenantLimitsUpdated`
- `TenantDataExportRequested`
- `TenantDataExportCompleted`
- `TenantApiKeyGenerated`
- `TenantApiKeyRevoked`

---

## Security Considerations

1. All API endpoints require authentication and tenant authorization
2. Platform admin role required for provisioning and deletion
3. API keys must be hashed using secure algorithms (e.g., SHA-256)
4. Data exports must use signed, time-limited URLs
5. Audit logging required for all tenant lifecycle operations
