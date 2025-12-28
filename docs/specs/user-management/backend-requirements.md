# User Management - Backend Requirements

## Overview

The User Management feature handles tenant users (staff, admins, managers) who operate the loyalty platform on behalf of the business. This includes user invitations, role assignments, permissions, and ownership transfers.

---

## Requirements

### REQ-UM-BE-001: User Invitation

**Description:** The system shall allow inviting users to join a tenant.

**Acceptance Criteria:**
- AC1: System shall generate unique InvitationId for each invitation
- AC2: System shall validate email address format
- AC3: System shall support roles: Owner, Admin, Manager, Staff
- AC4: System shall set invitation expiration (configurable, default 7 days)
- AC5: System shall publish `TenantUserInvited` event
- AC6: System shall send invitation email with secure link
- AC7: System shall prevent duplicate invitations to same email

### REQ-UM-BE-002: User Join

**Description:** The system shall allow invited users to accept and join a tenant.

**Acceptance Criteria:**
- AC1: System shall validate invitation token and expiration
- AC2: System shall create user account if not exists
- AC3: System shall link user to tenant with assigned role
- AC4: System shall publish `TenantUserJoined` event
- AC5: System shall invalidate used invitation
- AC6: System shall handle users joining multiple tenants

### REQ-UM-BE-003: Role Management

**Description:** The system shall allow changing user roles within a tenant.

**Acceptance Criteria:**
- AC1: System shall validate role change permissions (only Owner/Admin can change roles)
- AC2: System shall prevent demoting the last Owner
- AC3: System shall publish `TenantUserRoleChanged` event
- AC4: System shall immediately apply role-based access changes

### REQ-UM-BE-004: User Removal

**Description:** The system shall allow removing users from a tenant.

**Acceptance Criteria:**
- AC1: System shall validate removal permissions
- AC2: System shall prevent removing the last Owner
- AC3: System shall publish `TenantUserRemoved` event
- AC4: System shall revoke all user sessions for the tenant
- AC5: System shall maintain audit trail of removal

### REQ-UM-BE-005: Permission Management

**Description:** The system shall support granular permission management.

**Acceptance Criteria:**
- AC1: System shall define permission set per role
- AC2: System shall support custom permission grants/revocations
- AC3: System shall publish `TenantUserPermissionsUpdated` event
- AC4: System shall cache permissions for performance
- AC5: System shall support permission groups

### REQ-UM-BE-006: Ownership Transfer

**Description:** The system shall allow transferring tenant ownership.

**Acceptance Criteria:**
- AC1: System shall validate new owner is existing tenant user
- AC2: System shall require current owner confirmation
- AC3: System shall demote previous owner to Admin
- AC4: System shall publish `TenantOwnershipTransferred` event
- AC5: System shall notify both parties of transfer

---

## Data Models

### TenantUser Entity

```
TenantUser
├── TenantUserId: Guid (PK)
├── TenantId: Guid (FK)
├── UserId: Guid (FK to User)
├── Role: TenantRole (enum)
├── JoinedAt: DateTime
├── InvitationId: Guid (FK)
├── IsActive: bool
├── CreatedAt: DateTime
├── UpdatedAt: DateTime
```

### TenantInvitation Entity

```
TenantInvitation
├── InvitationId: Guid (PK)
├── TenantId: Guid (FK)
├── Email: string
├── Role: TenantRole
├── InvitedBy: Guid
├── Token: string (hashed)
├── ExpiresAt: DateTime
├── AcceptedAt: DateTime?
├── InvitedAt: DateTime
├── Status: InvitationStatus
```

### TenantUserPermission Entity

```
TenantUserPermission
├── TenantUserPermissionId: Guid (PK)
├── TenantUserId: Guid (FK)
├── PermissionName: string
├── IsGranted: bool
├── GrantedBy: Guid
├── GrantedAt: DateTime
```

---

## Roles and Default Permissions

| Permission | Owner | Admin | Manager | Staff |
|------------|-------|-------|---------|-------|
| ManageTenant | Yes | No | No | No |
| ManageUsers | Yes | Yes | No | No |
| ManageProgram | Yes | Yes | Yes | No |
| ManageMembers | Yes | Yes | Yes | Yes |
| ManageRewards | Yes | Yes | Yes | No |
| ProcessTransactions | Yes | Yes | Yes | Yes |
| ViewReports | Yes | Yes | Yes | No |
| ManageCampaigns | Yes | Yes | Yes | No |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tenants/{tenantId}/users/invite` | Invite user |
| POST | `/api/invitations/{token}/accept` | Accept invitation |
| GET | `/api/tenants/{tenantId}/users` | List tenant users |
| GET | `/api/tenants/{tenantId}/users/{userId}` | Get user details |
| PUT | `/api/tenants/{tenantId}/users/{userId}/role` | Change user role |
| DELETE | `/api/tenants/{tenantId}/users/{userId}` | Remove user |
| GET | `/api/tenants/{tenantId}/users/{userId}/permissions` | Get user permissions |
| PUT | `/api/tenants/{tenantId}/users/{userId}/permissions` | Update permissions |
| POST | `/api/tenants/{tenantId}/transfer-ownership` | Transfer ownership |
| GET | `/api/tenants/{tenantId}/invitations` | List pending invitations |
| DELETE | `/api/tenants/{tenantId}/invitations/{invitationId}` | Cancel invitation |

---

## Domain Events

- `TenantUserInvited`
- `TenantUserJoined`
- `TenantUserRoleChanged`
- `TenantUserRemoved`
- `TenantUserPermissionsUpdated`
- `TenantOwnershipTransferred`

---

## Security Considerations

1. Invitation tokens must be cryptographically secure
2. Rate limiting on invitation endpoints
3. Audit logging for all user management actions
4. Session invalidation on role change/removal
5. Two-factor authentication option for elevated roles
