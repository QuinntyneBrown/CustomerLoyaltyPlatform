# Rewards Management - Frontend Requirements

## Overview

The Rewards Management frontend provides interfaces for business owners to create and manage rewards, and for members to browse and redeem available rewards.

---

## Requirements

### REQ-RW-FE-001: Reward Catalog Management

**Description:** The system shall provide reward catalog management.

**Acceptance Criteria:**
- AC1: Interface shall list all rewards with status
- AC2: Interface shall show inventory levels
- AC3: Interface shall provide add/edit/retire actions
- AC4: Interface shall display redemption statistics
- AC5: Interface shall support filtering and sorting

### REQ-RW-FE-002: Reward Creation Form

**Description:** The system shall provide reward creation interface.

**Acceptance Criteria:**
- AC1: Form shall capture reward name and description
- AC2: Form shall select reward type
- AC3: Form shall set points cost and dollar value
- AC4: Form shall upload reward image
- AC5: Form shall set validity period
- AC6: Form shall optionally set inventory limit

### REQ-RW-FE-003: Reward Edit Form

**Description:** The system shall provide reward editing interface.

**Acceptance Criteria:**
- AC1: Form shall load current reward data
- AC2: Form shall allow updating all editable fields
- AC3: Form shall show warning for active redemptions
- AC4: Form shall preview changes before save

### REQ-RW-FE-004: Inventory Management Interface

**Description:** The system shall provide inventory management.

**Acceptance Criteria:**
- AC1: Interface shall show current inventory levels
- AC2: Interface shall allow adding inventory
- AC3: Interface shall display low inventory warnings
- AC4: Interface shall show inventory history

### REQ-RW-FE-005: Member Rewards Catalog

**Description:** The system shall provide member-facing rewards browse.

**Acceptance Criteria:**
- AC1: Catalog shall display available rewards
- AC2: Catalog shall show points cost and value
- AC3: Catalog shall indicate affordability
- AC4: Catalog shall filter by category/type
- AC5: Catalog shall sort by points cost or popularity

### REQ-RW-FE-006: Redemption Flow

**Description:** The system shall provide reward redemption interface.

**Acceptance Criteria:**
- AC1: Flow shall show reward details
- AC2: Flow shall confirm points deduction
- AC3: Flow shall display redemption code/voucher
- AC4: Flow shall show redemption instructions
- AC5: Flow shall allow saving/printing voucher

### REQ-RW-FE-007: Redemption History

**Description:** The system shall display redemption history.

**Acceptance Criteria:**
- AC1: History shall list all member redemptions
- AC2: History shall show redemption status
- AC3: History shall display redemption codes
- AC4: History shall show expiration dates

---

## UI Components

### RewardCard

```
Props:
- reward: Reward
- memberBalance: number
- onRedeem: () => void

Display:
- Reward image
- Reward name
- Points cost
- Affordability indicator
- Inventory status
- Redeem button
```

### InventoryBadge

```
Props:
- current: number
- limit: number?

Display:
- Stock level (In Stock, Low, Out of Stock)
- Color indicator
- Count if limited
```

### RedemptionVoucher

```
Props:
- redemption: RewardRedemption
- reward: Reward

Display:
- Voucher design
- Redemption code (large)
- QR code
- Reward details
- Expiration date
- Instructions
```

---

## Page Layouts

### Reward Catalog Layout (Staff)

```
┌─────────────────────────────────────────────────────────┐
│  Rewards Catalog                        [+ Add Reward]  │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐    │
│  │ Filter: [All Types ▼] [Status: Active ▼]       │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │   [Image]   │ │   [Image]   │ │   [Image]   │       │
│  │ Free Oil    │ │ $10 Off     │ │ Car Wash    │       │
│  │ Change      │ │ Service     │ │             │       │
│  │             │ │             │ │             │       │
│  │ 500 pts     │ │ 200 pts     │ │ 100 pts     │       │
│  │ [In Stock]  │ │ [Low: 5]    │ │ [Unlimited] │       │
│  │ 45 redeemed │ │ 120 redeemed│ │ 89 redeemed │       │
│  │ [Edit]      │ │ [Edit]      │ │ [Edit]      │       │
│  └─────────────┘ └─────────────┘ └─────────────┘       │
└─────────────────────────────────────────────────────────┘
```

### Member Rewards Catalog Layout

```
┌─────────────────────────────────────────────────────────┐
│  Available Rewards              Your Balance: 1,250 pts │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐    │
│  │ Category: [All ▼]  Sort: [Points: Low-High ▼]  │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │   [Image]   │ │   [Image]   │ │   [Image]   │       │
│  │ Car Wash    │ │ $10 Off     │ │ Free Oil    │       │
│  │ 100 pts     │ │ 200 pts     │ │ Change      │       │
│  │ $15 value   │ │ $10 value   │ │ 500 pts     │       │
│  │             │ │             │ │ $45 value   │       │
│  │ [✓ Afford]  │ │ [✓ Afford]  │ │ [✓ Afford]  │       │
│  │ [Redeem]    │ │ [Redeem]    │ │ [Redeem]    │       │
│  └─────────────┘ └─────────────┘ └─────────────┘       │
└─────────────────────────────────────────────────────────┘
```

---

## User Flows

### Create Reward Flow

1. Business owner opens Rewards Catalog
2. Clicks "Add Reward"
3. Enters reward name and description
4. Selects reward type
5. Uploads reward image
6. Sets points cost and dollar value
7. Optionally sets inventory limit
8. Sets validity dates
9. Previews reward card
10. Saves reward
11. Reward appears in catalog

### Member Redemption Flow

1. Member browses rewards catalog
2. Filters to affordable rewards
3. Selects desired reward
4. Views reward details and confirmation
5. Confirms redemption
6. System deducts points
7. Voucher displayed with code
8. Member saves/prints voucher
9. Member presents voucher at business
10. Staff marks voucher as used
