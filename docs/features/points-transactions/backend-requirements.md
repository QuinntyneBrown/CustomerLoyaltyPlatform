# Points & Transactions - Backend Requirements

## Overview

The Points & Transactions feature handles all point-related operations including earning, redemption, adjustments, expiration, and transfers. This also includes purchase recording and linking purchases to members.

---

## Requirements

### REQ-PT-BE-001: Points Earning

**Description:** The system shall award points to members for qualifying activities.

**Acceptance Criteria:**
- AC1: System shall calculate points based on active earning rules
- AC2: System shall support earning types: Purchase, Referral, Bonus, Promotion, Birthday, SignUp
- AC3: System shall set point expiration based on policy
- AC4: System shall publish `PointsEarned` event
- AC5: System shall update member points balance atomically

### REQ-PT-BE-002: Points Redemption

**Description:** The system shall allow members to redeem points for rewards.

**Acceptance Criteria:**
- AC1: System shall validate sufficient points balance
- AC2: System shall apply redemption rules
- AC3: System shall deduct points from member balance
- AC4: System shall publish `PointsRedeemed` event
- AC5: System shall record redemption details and value

### REQ-PT-BE-003: Points Adjustment

**Description:** The system shall allow manual point adjustments by authorized users.

**Acceptance Criteria:**
- AC1: System shall support adjustment reasons: Correction, GoodwillGesture, SystemError, Promotion, Other
- AC2: System shall require notes for adjustments
- AC3: System shall publish `PointsAdjusted` event
- AC4: System shall maintain audit trail of all adjustments

### REQ-PT-BE-004: Points Expiration

**Description:** The system shall expire points according to policy.

**Acceptance Criteria:**
- AC1: System shall process expiration based on configured policy
- AC2: System shall deduct expired points from balance
- AC3: System shall publish `PointsExpired` event
- AC4: System shall maintain expired points history

### REQ-PT-BE-005: Points Expiration Warning

**Description:** The system shall warn members of expiring points.

**Acceptance Criteria:**
- AC1: System shall identify points expiring within warning period
- AC2: System shall publish `PointsExpirationWarningTriggered` event
- AC3: System shall trigger notification to member

### REQ-PT-BE-006: Points Transfer

**Description:** The system shall allow point transfers between members (if enabled).

**Acceptance Criteria:**
- AC1: System shall validate transfer eligibility
- AC2: System shall deduct from source and add to destination
- AC3: System shall support approval workflow if required
- AC4: System shall publish `PointsTransferred` event

### REQ-PT-BE-007: Purchase Recording

**Description:** The system shall record customer purchases.

**Acceptance Criteria:**
- AC1: System shall capture purchase details: total, subtotal, tax, items
- AC2: System shall support linking to member at time of purchase
- AC3: System shall publish `PurchaseRecorded` event
- AC4: System shall automatically calculate and award points

### REQ-PT-BE-008: Purchase-Member Linking

**Description:** The system shall support linking purchases to members after the fact.

**Acceptance Criteria:**
- AC1: System shall allow linking unlinked purchases to members
- AC2: System shall award points for linked purchase
- AC3: System shall publish `PurchaseLinkedToMember` event
- AC4: System shall validate time limit for linking

### REQ-PT-BE-009: Purchase Refund

**Description:** The system shall handle purchase refunds and point clawback.

**Acceptance Criteria:**
- AC1: System shall support full and partial refunds
- AC2: System shall calculate points to claw back
- AC3: System shall publish `PurchaseRefunded` event
- AC4: System shall handle negative balance scenarios

---

## Data Models

### PointsTransaction Entity

```
PointsTransaction
├── TransactionId: Guid (PK)
├── TenantId: Guid (FK)
├── MemberId: Guid (FK)
├── ProgramId: Guid (FK)
├── TransactionType: TransactionType (enum)
├── PointsAmount: int
├── BalanceAfter: int
├── EarningType: EarningType? (enum)
├── RewardId: Guid?
├── SourceTransactionId: Guid?
├── Description: string
├── Notes: string?
├── ProcessedBy: Guid
├── ExpiresAt: DateTime?
├── ExpiredAt: DateTime?
├── CreatedAt: DateTime
```

### Purchase Entity

```
Purchase
├── PurchaseId: Guid (PK)
├── TenantId: Guid (FK)
├── BusinessId: Guid (FK)
├── MemberId: Guid?
├── TotalAmount: decimal
├── SubTotal: decimal
├── TaxAmount: decimal
├── DiscountApplied: decimal
├── PaymentMethod: string
├── ReceiptNumber: string
├── Items: string (JSON)
├── LocationId: Guid?
├── RecordedBy: Guid
├── RecordedAt: DateTime
├── LinkedAt: DateTime?
├── RefundedAmount: decimal
```

### Refund Entity

```
Refund
├── RefundId: Guid (PK)
├── TenantId: Guid (FK)
├── OriginalPurchaseId: Guid (FK)
├── MemberId: Guid?
├── RefundAmount: decimal
├── RefundType: RefundType (enum)
├── PointsClawedBack: int
├── RefundedBy: Guid
├── RefundedAt: DateTime
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/points/earn` | Award points |
| POST | `/api/points/redeem` | Redeem points |
| POST | `/api/points/adjust` | Adjust points |
| POST | `/api/points/transfer` | Transfer points |
| GET | `/api/members/{memberId}/transactions` | Get transactions |
| GET | `/api/members/{memberId}/points/balance` | Get balance |
| GET | `/api/members/{memberId}/points/expiring` | Get expiring points |
| POST | `/api/purchases` | Record purchase |
| GET | `/api/purchases` | List purchases |
| GET | `/api/purchases/{purchaseId}` | Get purchase details |
| POST | `/api/purchases/{purchaseId}/link` | Link to member |
| POST | `/api/purchases/{purchaseId}/refund` | Process refund |

---

## Domain Events

- `PointsEarned`
- `PointsRedeemed`
- `PointsAdjusted`
- `PointsExpired`
- `PointsTransferred`
- `PointsExpirationWarningTriggered`
- `PurchaseRecorded`
- `PurchaseLinkedToMember`
- `PurchaseRefunded`
