# Points & Transactions - Frontend Requirements

## Overview

The Points & Transactions frontend provides interfaces for staff to process point transactions, record purchases, and for members to view their transaction history and points status.

---

## Requirements

### REQ-PT-FE-001: Points Earning Interface

**Description:** The system shall provide an interface to award points.

**Acceptance Criteria:**
- AC1: Interface shall accept member lookup (card, phone, search)
- AC2: Interface shall show current points balance
- AC3: Interface shall calculate points from purchase amount
- AC4: Interface shall preview points to be awarded
- AC5: Interface shall confirm points award with receipt

### REQ-PT-FE-002: Points Redemption Interface

**Description:** The system shall provide an interface to redeem points.

**Acceptance Criteria:**
- AC1: Interface shall show available redemption options
- AC2: Interface shall display current balance and affordability
- AC3: Interface shall preview redemption details
- AC4: Interface shall process redemption with confirmation
- AC5: Interface shall generate redemption voucher/code

### REQ-PT-FE-003: Points Adjustment Form

**Description:** The system shall provide a manual adjustment interface.

**Acceptance Criteria:**
- AC1: Form shall require adjustment reason selection
- AC2: Form shall require notes for adjustment
- AC3: Form shall show current balance and result
- AC4: Form shall require manager approval for large adjustments
- AC5: Form shall confirm adjustment with receipt

### REQ-PT-FE-004: Transaction History View

**Description:** The system shall display transaction history.

**Acceptance Criteria:**
- AC1: View shall list all transactions chronologically
- AC2: View shall show transaction type, amount, description
- AC3: View shall support filtering by date range, type
- AC4: View shall show running balance
- AC5: View shall support export to CSV

### REQ-PT-FE-005: Purchase Recording Form

**Description:** The system shall provide purchase entry interface.

**Acceptance Criteria:**
- AC1: Form shall capture purchase amount
- AC2: Form shall optionally link to member
- AC3: Form shall auto-calculate applicable points
- AC4: Form shall support item-level entry (optional)
- AC5: Form shall generate receipt reference

### REQ-PT-FE-006: Quick Checkout Interface

**Description:** The system shall provide streamlined checkout for staff.

**Acceptance Criteria:**
- AC1: Interface shall combine member lookup and purchase entry
- AC2: Interface shall show real-time points calculation
- AC3: Interface shall support quick redemption at checkout
- AC4: Interface shall display member tier benefits
- AC5: Interface shall be optimized for speed

### REQ-PT-FE-007: Refund Processing Form

**Description:** The system shall provide refund processing interface.

**Acceptance Criteria:**
- AC1: Form shall look up original purchase
- AC2: Form shall support full or partial refund
- AC3: Form shall calculate points to claw back
- AC4: Form shall require confirmation
- AC5: Form shall handle edge cases (insufficient points)

### REQ-PT-FE-008: Expiring Points Alert

**Description:** The system shall display expiring points alerts.

**Acceptance Criteria:**
- AC1: Alert shall show points amount expiring soon
- AC2: Alert shall show expiration date
- AC3: Alert shall suggest redemption options
- AC4: Alert shall be visible on member profile and portal

---

## UI Components

### PointsTransactionCard

```
Props:
- transaction: PointsTransaction
- pointsName: string

Display:
- Transaction icon by type
- Date and time
- Description
- Points amount (+ green / - red)
- Running balance
```

### BalanceDisplay

```
Props:
- balance: number
- pointsName: string
- expiringAmount: number?
- expiringDate: Date?

Display:
- Large balance number
- Points name
- Expiring points warning (if applicable)
```

### RedemptionOption

```
Props:
- redemption: RedemptionRule
- currentBalance: number
- onSelect: () => void

Display:
- Reward image
- Reward name
- Points required
- Affordable indicator
- Select button
```

### QuickCheckoutPanel

```
Props:
- member: Member
- onComplete: (transaction) => void

Display:
- Member summary
- Purchase amount input
- Points preview
- Quick redemption toggle
- Process button
```

---

## Page Layouts

### Transaction History Layout

```
┌─────────────────────────────────────────────────────────┐
│  Transaction History                          [Export]  │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐    │
│  │ Filter: [All Types ▼] [Last 30 Days ▼] [Search] │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Current Balance: 1,250 Miles                    │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Date       Description              Points  Bal │    │
│  │ ─────────────────────────────────────────────── │    │
│  │ Dec 28    Oil Change Purchase      +150   1250 │    │
│  │ Dec 25    Birthday Bonus           +100   1100 │    │
│  │ Dec 20    Redemption: Car Wash     -100   1000 │    │
│  │ Dec 15    Tire Purchase            +400   1100 │    │
│  │ Dec 10    Service Purchase         +200    700 │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  [< Prev]  Page 1 of 5  [Next >]                       │
└─────────────────────────────────────────────────────────┘
```

### Quick Checkout Layout

```
┌─────────────────────────────────────────────────────────┐
│  Quick Checkout                                         │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐    │
│  │ Member: [Card/Phone Lookup________________] [🔍] │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌───────────────────┐  ┌───────────────────────────┐   │
│  │   Jane Smith      │  │   Purchase Amount         │   │
│  │   Gold Member     │  │   ┌───────────────────┐   │   │
│  │   1,250 Miles     │  │   │    $ 75.00        │   │   │
│  │                   │  │   └───────────────────┘   │   │
│  │   Tier Bonus: 2x  │  │                           │   │
│  └───────────────────┘  │   Points to Earn: 150     │   │
│                         │   (75 x 2 tier bonus)     │   │
│                         └───────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ [ ] Apply redemption at checkout               │    │
│  │     Free Car Wash (100 pts) - Member has 1,250 │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│                              [Cancel]  [Process Sale]   │
└─────────────────────────────────────────────────────────┘
```

---

## User Flows

### Process Purchase with Points Flow

1. Staff opens quick checkout
2. Staff scans member card or enters phone
3. System displays member info and tier
4. Staff enters purchase amount
5. System calculates points with tier bonus
6. Staff optionally applies redemption
7. Staff clicks "Process Sale"
8. System awards points and processes redemption
9. Receipt displayed with points summary

### Manual Points Adjustment Flow

1. Manager opens member profile
2. Manager clicks "Adjust Points"
3. System opens adjustment form
4. Manager enters adjustment amount (+/-)
5. Manager selects reason
6. Manager enters notes
7. Manager previews result
8. Manager confirms adjustment
9. System processes adjustment
10. Confirmation displayed with audit record
