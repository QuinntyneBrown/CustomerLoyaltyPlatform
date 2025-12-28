# Rewards Management - Backend Requirements

## Overview

The Rewards Management feature handles the creation, configuration, and lifecycle of rewards that members can redeem with their points. This includes inventory management, reward availability, and redemption tracking.

---

## Requirements

### REQ-RW-BE-001: Reward Creation

**Description:** The system shall allow creating new reward options.

**Acceptance Criteria:**
- AC1: System shall generate unique RewardId
- AC2: System shall support reward types: Discount, FreeItem, Service, Experience
- AC3: System shall define points cost and dollar value equivalent
- AC4: System shall support optional inventory limits
- AC5: System shall set validity period (ValidFrom, ValidUntil)
- AC6: System shall publish `RewardCreated` event

### REQ-RW-BE-002: Reward Updates

**Description:** The system shall allow updating reward details.

**Acceptance Criteria:**
- AC1: System shall track changed fields
- AC2: System shall validate updated values
- AC3: System shall publish `RewardUpdated` event
- AC4: System shall not affect pending redemptions

### REQ-RW-BE-003: Reward Inventory Management

**Description:** The system shall manage reward inventory levels.

**Acceptance Criteria:**
- AC1: System shall track available quantity
- AC2: System shall publish `RewardDepleted` event when inventory reaches zero
- AC3: System shall publish `RewardRestocked` event when inventory is added
- AC4: System shall prevent redemption when out of stock

### REQ-RW-BE-004: Reward Retirement

**Description:** The system shall allow permanently retiring rewards.

**Acceptance Criteria:**
- AC1: System shall mark reward as retired
- AC2: System shall prevent new redemptions
- AC3: System shall publish `RewardRetired` event
- AC4: System shall maintain reward history for reporting

### REQ-RW-BE-005: Reward Redemption Processing

**Description:** The system shall process reward redemptions.

**Acceptance Criteria:**
- AC1: System shall validate member has sufficient points
- AC2: System shall validate reward is available and in stock
- AC3: System shall deduct points and update inventory
- AC4: System shall generate redemption code/voucher
- AC5: System shall track redemption status

---

## Data Models

### Reward Entity

```
Reward
├── RewardId: Guid (PK)
├── TenantId: Guid (FK)
├── ProgramId: Guid (FK)
├── RewardName: string
├── RewardDescription: string
├── RewardType: RewardType (enum)
├── PointsCost: int
├── DollarValue: decimal
├── ImageUrl: string?
├── InventoryLimit: int?
├── CurrentInventory: int?
├── ValidFrom: DateTime
├── ValidUntil: DateTime?
├── IsActive: bool
├── IsRetired: bool
├── TotalRedemptions: int
├── CreatedBy: Guid
├── CreatedAt: DateTime
├── UpdatedAt: DateTime
```

### RewardRedemption Entity

```
RewardRedemption
├── RedemptionId: Guid (PK)
├── TenantId: Guid (FK)
├── RewardId: Guid (FK)
├── MemberId: Guid (FK)
├── PointsSpent: int
├── RedemptionCode: string
├── Status: RedemptionStatus (enum)
├── ProcessedBy: Guid
├── RedeemedAt: DateTime
├── UsedAt: DateTime?
├── ExpiresAt: DateTime?
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/rewards` | Create reward |
| GET | `/api/rewards` | List rewards |
| GET | `/api/rewards/{rewardId}` | Get reward details |
| PUT | `/api/rewards/{rewardId}` | Update reward |
| POST | `/api/rewards/{rewardId}/restock` | Add inventory |
| POST | `/api/rewards/{rewardId}/retire` | Retire reward |
| GET | `/api/rewards/available` | Get available rewards for member |
| POST | `/api/rewards/{rewardId}/redeem` | Redeem reward |
| GET | `/api/members/{memberId}/redemptions` | Get member redemptions |
| POST | `/api/redemptions/{redemptionId}/use` | Mark redemption as used |

---

## Domain Events

- `RewardCreated`
- `RewardUpdated`
- `RewardDepleted`
- `RewardRestocked`
- `RewardRetired`
