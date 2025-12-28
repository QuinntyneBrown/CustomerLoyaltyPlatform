# Member Management - Frontend Requirements

## Overview

The Member Management frontend provides interfaces for staff to enroll and manage loyalty program members, and for members to manage their own accounts and preferences.

---

## Requirements

### REQ-MM-FE-001: Member Enrollment Form

**Description:** The system shall provide a quick enrollment interface for staff.

**Acceptance Criteria:**
- AC1: Form shall capture essential info with minimal fields
- AC2: Form shall support phone lookup to prevent duplicates
- AC3: Form shall auto-generate card number
- AC4: Form shall show instant confirmation with points welcome bonus
- AC5: Form shall be optimized for tablet use in-store

### REQ-MM-FE-002: Member Search

**Description:** The system shall provide member search functionality.

**Acceptance Criteria:**
- AC1: Search shall support phone, email, name, card number
- AC2: Search shall show results with key member info
- AC3: Search shall highlight matching terms
- AC4: Search shall provide quick actions from results
- AC5: Search shall be fast with typeahead suggestions

### REQ-MM-FE-003: Member Profile Page

**Description:** The system shall display comprehensive member profile.

**Acceptance Criteria:**
- AC1: Page shall show member details and photo
- AC2: Page shall display current tier and points balance
- AC3: Page shall show transaction history summary
- AC4: Page shall display active cards
- AC5: Page shall provide edit capabilities for staff

### REQ-MM-FE-004: Member Self-Service Portal

**Description:** The system shall provide member-facing portal.

**Acceptance Criteria:**
- AC1: Portal shall show points balance and tier status
- AC2: Portal shall display available rewards
- AC3: Portal shall show transaction history
- AC4: Portal shall allow profile updates
- AC5: Portal shall manage marketing preferences
- AC6: Portal shall display digital loyalty card

### REQ-MM-FE-005: Member List View

**Description:** The system shall provide member list management.

**Acceptance Criteria:**
- AC1: List shall support filtering by status, tier, activity
- AC2: List shall support sorting by various fields
- AC3: List shall show key metrics per member
- AC4: List shall support bulk actions (export, email)
- AC5: List shall paginate for performance

### REQ-MM-FE-006: Marketing Preferences Editor

**Description:** The system shall provide marketing preference management.

**Acceptance Criteria:**
- AC1: Editor shall show all channels with current status
- AC2: Editor shall explain what each channel involves
- AC3: Editor shall require confirmation for opt-out
- AC4: Editor shall save preferences immediately

### REQ-MM-FE-007: Card Management Interface

**Description:** The system shall provide card management for staff.

**Acceptance Criteria:**
- AC1: Interface shall list all member cards
- AC2: Interface shall show card status and type
- AC3: Interface shall provide card replacement workflow
- AC4: Interface shall display card barcode/QR code
- AC5: Interface shall allow printing physical cards

### REQ-MM-FE-008: Member Merge Wizard

**Description:** The system shall provide duplicate merge workflow.

**Acceptance Criteria:**
- AC1: Wizard shall compare two member profiles side-by-side
- AC2: Wizard shall preview merged result
- AC3: Wizard shall show combined points total
- AC4: Wizard shall require confirmation
- AC5: Wizard shall show success with merged member

---

## UI Components

### MemberCard

```
Props:
- member: Member
- showActions: boolean
- onClick: () => void

Display:
- Member photo/initials
- Name and contact info
- Points balance
- Tier badge
- Status indicator
```

### PointsBalance

```
Props:
- balance: number
- pointsName: string
- size: 'small' | 'medium' | 'large'

Display:
- Points amount (formatted)
- Points name
- Optional animation on change
```

### TierBadge

```
Props:
- tier: Tier
- showProgress: boolean
- nextTierPoints: number

Display:
- Tier icon/color
- Tier name
- Progress to next tier (optional)
```

### DigitalCard

```
Props:
- card: MemberCard
- member: Member
- branding: TenantBranding

Display:
- Branded card design
- Member name
- Card number
- QR code
- Points balance
```

### TransactionRow

```
Props:
- transaction: PointsTransaction
- pointsName: string

Display:
- Transaction date
- Description
- Points amount (+/-)
- Running balance
```

---

## Page Layouts

### Member Profile Layout

```
┌─────────────────────────────────────────────────────────┐
│  Member Profile                   [Edit] [More Actions] │
├─────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌────────────────────────────────────┐   │
│  │  Photo   │  │ Jane Smith                         │   │
│  │          │  │ jane@email.com | (555) 123-4567    │   │
│  │          │  │ Member since: Jan 15, 2025         │   │
│  └──────────┘  │ [Gold Member] [Active]             │   │
│                └────────────────────────────────────┘   │
│                                                         │
│  ┌───────────────────┐  ┌───────────────────────────┐   │
│  │   Points Balance  │  │   Next Tier Progress      │   │
│  │   ──────────────  │  │   ───────────────────     │   │
│  │      1,250        │  │   Gold → Platinum         │   │
│  │      Miles        │  │   ▓▓▓▓▓▓▓▓░░░░ 75%       │   │
│  │                   │  │   750 more points needed  │   │
│  └───────────────────┘  └───────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Recent Transactions                    [See All]│    │
│  │ ─────────────────────────────────               │    │
│  │ Dec 28  Oil Change Service        +150 Miles   │    │
│  │ Dec 15  Tire Purchase             +400 Miles   │    │
│  │ Dec 10  Redemption: Free Wash     -100 Miles   │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### Member Self-Service Layout

```
┌─────────────────────────────────────────────────────────┐
│  Welcome, Jane!                              [Settings] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │              Your Digital Card                   │    │
│  │  ┌─────────────────────────────────────────┐    │    │
│  │  │  Mike's Auto Rewards                    │    │    │
│  │  │                                         │    │    │
│  │  │  Jane Smith                             │    │    │
│  │  │  ****-****-1234                         │    │    │
│  │  │                        [QR]             │    │    │
│  │  │  1,250 Miles                            │    │    │
│  │  └─────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────┐  ┌─────────────────────────────┐   │
│  │   Your Rewards  │  │   Recent Activity          │   │
│  │   [View All]    │  │   [View All]               │   │
│  └─────────────────┘  └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## User Flows

### Quick Enrollment Flow (Staff)

1. Staff opens enrollment form
2. Staff enters customer phone number
3. System checks for existing member
4. If new: Staff enters name and email (optional)
5. System creates member and generates card
6. Staff shows welcome screen to customer
7. Customer confirms marketing preferences
8. Card is issued (print or digital)

### Member Self Check-in Flow

1. Member opens self-service portal
2. Member views digital card QR code
3. Staff scans QR code at POS
4. System identifies member
5. Purchase is linked to member
6. Points are automatically calculated and added
7. Member receives notification of points earned
