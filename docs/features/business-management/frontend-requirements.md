# Business Management - Frontend Requirements

## Overview

The Business Management frontend provides interfaces for business owners to manage their business profile, verification status, and account lifecycle.

---

## Requirements

### REQ-BM-FE-001: Business Registration Wizard

**Description:** The system shall provide a step-by-step business registration interface.

**Acceptance Criteria:**
- AC1: Wizard shall have steps: Basic Info, Contact Details, Address, Confirmation
- AC2: Wizard shall validate each step before progression
- AC3: Wizard shall save progress for resumption
- AC4: Wizard shall show progress indicator
- AC5: Wizard shall provide back/next navigation

### REQ-BM-FE-002: Business Profile Page

**Description:** The system shall provide a business profile management page.

**Acceptance Criteria:**
- AC1: Page shall display all business information
- AC2: Page shall provide inline editing capabilities
- AC3: Page shall show verification badges
- AC4: Page shall display business logo with upload option
- AC5: Page shall show business status prominently

### REQ-BM-FE-003: Verification Center

**Description:** The system shall provide a verification management interface.

**Acceptance Criteria:**
- AC1: Center shall show verification status for each type
- AC2: Center shall provide verification initiation buttons
- AC3: Center shall display verification benefits
- AC4: Center shall handle verification code input
- AC5: Center shall show verification progress

### REQ-BM-FE-004: Business Dashboard

**Description:** The system shall provide a business overview dashboard.

**Acceptance Criteria:**
- AC1: Dashboard shall show quick stats (members, transactions, points)
- AC2: Dashboard shall display verification status
- AC3: Dashboard shall show active program summary
- AC4: Dashboard shall provide quick action links
- AC5: Dashboard shall display recent activity

---

## UI Components

### BusinessStatusBadge

```
Props:
- status: 'active' | 'suspended' | 'closed' | 'pending'

Display:
- Color-coded badge
- Status icon
- Status text
```

### VerificationBadge

```
Props:
- type: 'email' | 'phone' | 'identity'
- verified: boolean

Display:
- Checkmark or pending icon
- Verification type label
- Click to verify if not verified
```

### BusinessCard

```
Props:
- business: Business
- onClick: () => void

Display:
- Business logo
- Business name and type
- Status badge
- Verification badges
- Quick stats
```

---

## Page Layouts

### Business Profile Layout

```
┌─────────────────────────────────────────────────────────┐
│  Business Profile                              [Edit]   │
├─────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌────────────────────────────────────┐   │
│  │  [Logo]  │  │ Mike's Auto Sales                  │   │
│  │          │  │ Automotive Dealership              │   │
│  │          │  │ [Active] [Email ✓] [Phone ✓]       │   │
│  └──────────┘  └────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Contact Information                             │    │
│  │ ─────────────────────────────────               │    │
│  │ Email: mike@autosales.com                       │    │
│  │ Phone: (555) 123-4567                           │    │
│  │ Address: 123 Main St, City, State 12345         │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Verification Status                    [Verify] │    │
│  │ ─────────────────────────────────               │    │
│  │ ✓ Email Verified                                │    │
│  │ ✓ Phone Verified                                │    │
│  │ ○ Identity Pending                              │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## User Flows

### Business Registration Flow

1. User initiates business registration
2. Step 1: Enter business name, type, owner name
3. Step 2: Enter email and phone
4. Step 3: Enter business address
5. Step 4: Review all information
6. User confirms registration
7. System creates business
8. User redirected to verification center
9. User completes email/phone verification

### Business Closure Flow

1. Business owner navigates to settings
2. User clicks "Close Business"
3. System shows closure implications
4. User selects points handling option
5. User confirms with password
6. System processes closure
7. User sees confirmation and data export option
