# User Management - Frontend Requirements

## Overview

The User Management frontend provides interfaces for managing tenant users, invitations, roles, and permissions within the Customer Loyalty Platform.

---

## Requirements

### REQ-UM-FE-001: User List Page

**Description:** The system shall display a list of all tenant users.

**Acceptance Criteria:**
- AC1: Page shall display user name, email, role, and status
- AC2: Page shall support search and filtering by role/status
- AC3: Page shall provide sorting options (name, role, join date)
- AC4: Page shall show user avatars or initials
- AC5: Page shall provide quick actions (edit role, remove)
- AC6: Page shall paginate results for large user counts

### REQ-UM-FE-002: User Invitation Dialog

**Description:** The system shall provide a user invitation interface.

**Acceptance Criteria:**
- AC1: Dialog shall accept email address with validation
- AC2: Dialog shall provide role selection dropdown
- AC3: Dialog shall show role description on selection
- AC4: Dialog shall display invitation preview
- AC5: Dialog shall show success confirmation with resend option
- AC6: Dialog shall handle duplicate email gracefully

### REQ-UM-FE-003: Pending Invitations Page

**Description:** The system shall display pending invitations.

**Acceptance Criteria:**
- AC1: Page shall list all pending invitations
- AC2: Page shall show invitation email, role, sent date, expiration
- AC3: Page shall provide resend and cancel actions
- AC4: Page shall highlight expired invitations
- AC5: Page shall show invitation status (pending, expired, accepted)

### REQ-UM-FE-004: User Detail Page

**Description:** The system shall display detailed user information.

**Acceptance Criteria:**
- AC1: Page shall show user profile information
- AC2: Page shall display current role with change option
- AC3: Page shall list granted permissions
- AC4: Page shall show activity history
- AC5: Page shall provide remove user action with confirmation

### REQ-UM-FE-005: Role Change Dialog

**Description:** The system shall provide role change interface.

**Acceptance Criteria:**
- AC1: Dialog shall show current role
- AC2: Dialog shall provide role selection with descriptions
- AC3: Dialog shall show permission changes preview
- AC4: Dialog shall require confirmation for demotions
- AC5: Dialog shall prevent invalid role changes

### REQ-UM-FE-006: Permission Editor

**Description:** The system shall provide granular permission editing.

**Acceptance Criteria:**
- AC1: Editor shall group permissions by category
- AC2: Editor shall show inherited vs custom permissions
- AC3: Editor shall provide toggle for each permission
- AC4: Editor shall highlight changes before save
- AC5: Editor shall support reset to role defaults

### REQ-UM-FE-007: Ownership Transfer Page

**Description:** The system shall provide ownership transfer interface.

**Acceptance Criteria:**
- AC1: Page shall list eligible users for transfer
- AC2: Page shall explain transfer implications
- AC3: Page shall require current owner confirmation
- AC4: Page shall show transfer success confirmation
- AC5: Page shall send notification to new owner

### REQ-UM-FE-008: Invitation Acceptance Page

**Description:** The system shall provide invitation acceptance flow.

**Acceptance Criteria:**
- AC1: Page shall validate invitation token
- AC2: Page shall show tenant and role information
- AC3: Page shall collect user profile if new user
- AC4: Page shall handle existing user login
- AC5: Page shall redirect to tenant dashboard on success
- AC6: Page shall show appropriate error for invalid/expired tokens

---

## UI Components

### UserCard

```
Props:
- user: TenantUser
- onEditRole: () => void
- onRemove: () => void
- canEdit: boolean

Display:
- Avatar with initials
- Name and email
- Role badge
- Status indicator
- Action menu
```

### RoleBadge

```
Props:
- role: 'owner' | 'admin' | 'manager' | 'staff'

Display:
- Color-coded badge
- Role icon
- Role name
```

### InvitationCard

```
Props:
- invitation: TenantInvitation
- onResend: () => void
- onCancel: () => void

Display:
- Email address
- Role badge
- Expiration countdown
- Status indicator
- Action buttons
```

### PermissionToggle

```
Props:
- permission: Permission
- isGranted: boolean
- isInherited: boolean
- onChange: (granted: boolean) => void

Display:
- Permission name and description
- Toggle switch
- Inherited indicator
- Category grouping
```

---

## Page Layouts

### User Management Layout

```
┌─────────────────────────────────────────────────────────┐
│  Team Members                    [Invite User] [Filter] │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐    │
│  │ [Tab: Active Users] [Tab: Pending Invitations]  │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Search: [________________] Role: [All ▼]        │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ ┌───┐ John Smith              Owner    [...]    │    │
│  │ │ JS│ john@example.com        Active            │    │
│  │ └───┘ Joined: Jan 15, 2025                      │    │
│  ├─────────────────────────────────────────────────┤    │
│  │ ┌───┐ Sarah Johnson           Admin    [...]    │    │
│  │ │ SJ│ sarah@example.com       Active            │    │
│  │ └───┘ Joined: Feb 20, 2025                      │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  [< Prev]  Page 1 of 3  [Next >]                       │
└─────────────────────────────────────────────────────────┘
```

---

## User Flows

### Invite User Flow

1. User clicks "Invite User" button
2. Dialog opens with email input
3. User enters email address
4. User selects role from dropdown
5. User reviews invitation details
6. User clicks "Send Invitation"
7. System validates and sends invitation
8. Success notification shown
9. Invitation appears in pending list

### Accept Invitation Flow

1. Invited user clicks email link
2. System validates invitation token
3. If new user: profile creation form shown
4. If existing user: login prompt shown
5. User completes form/login
6. System links user to tenant
7. User redirected to tenant dashboard
8. Welcome notification shown

---

## Validation Rules

| Field | Rules |
|-------|-------|
| Email | Required, valid email format |
| Role | Required, valid role enum |
| UserName | Required for new users, 2-100 characters |

---

## Error States

1. **Invalid Invitation**: Token not found or tampered
2. **Expired Invitation**: Past expiration date
3. **Already Accepted**: Invitation already used
4. **Permission Denied**: Insufficient privileges for action
5. **Last Owner**: Cannot remove or demote last owner
