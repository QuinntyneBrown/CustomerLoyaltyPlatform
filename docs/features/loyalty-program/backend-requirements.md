# Loyalty Program - Backend Requirements

## Overview

The Loyalty Program feature handles the configuration and management of loyalty programs, including earning rules, redemption rules, point expiration policies, and tier structures. This is the core functionality that defines how customers earn and redeem rewards.

---

## Requirements

### REQ-LP-BE-001: Loyalty Program Creation

**Description:** The system shall allow businesses to create loyalty programs.

**Acceptance Criteria:**
- AC1: System shall generate unique ProgramId
- AC2: System shall support program types: Points-based, Punch-card, Tiered, Cashback
- AC3: System shall allow custom points name (e.g., "Stars", "Bucks", "Miles")
- AC4: System shall associate program with business and tenant
- AC5: System shall publish `LoyaltyProgramCreated` event
- AC6: System shall set default program configuration

### REQ-LP-BE-002: Earning Rule Configuration

**Description:** The system shall allow configuring how customers earn points.

**Acceptance Criteria:**
- AC1: System shall support rule types: PerDollarSpent, PerVisit, PerItem, FixedAmount
- AC2: System shall allow spend thresholds and category restrictions
- AC3: System shall support effective date ranges
- AC4: System shall publish `EarningRuleConfigured` event
- AC5: System shall allow multiple earning rules per program
- AC6: System shall validate rule conflicts

### REQ-LP-BE-003: Earning Rule Modification

**Description:** The system shall allow modifying existing earning rules.

**Acceptance Criteria:**
- AC1: System shall track previous and new values
- AC2: System shall validate modified configuration
- AC3: System shall publish `EarningRuleModified` event
- AC4: System shall apply changes immediately or scheduled

### REQ-LP-BE-004: Earning Rule Deactivation

**Description:** The system shall allow deactivating earning rules.

**Acceptance Criteria:**
- AC1: System shall mark rule as inactive
- AC2: System shall publish `EarningRuleDeactivated` event
- AC3: System shall maintain rule history for reporting

### REQ-LP-BE-005: Redemption Rule Configuration

**Description:** The system shall allow configuring how points can be redeemed.

**Acceptance Criteria:**
- AC1: System shall support redemption types: Discount, FreeItem, Service, GiftCard
- AC2: System shall define points required and reward value
- AC3: System shall support minimum purchase requirements
- AC4: System shall publish `RedemptionRuleConfigured` event
- AC5: System shall allow multiple redemption rules per program

### REQ-LP-BE-006: Redemption Rule Modification

**Description:** The system shall allow modifying existing redemption rules.

**Acceptance Criteria:**
- AC1: System shall track previous and new values
- AC2: System shall validate modified configuration
- AC3: System shall publish `RedemptionRuleModified` event

### REQ-LP-BE-007: Redemption Rule Deactivation

**Description:** The system shall allow deactivating redemption rules.

**Acceptance Criteria:**
- AC1: System shall mark rule as inactive
- AC2: System shall publish `RedemptionRuleDeactivated` event
- AC3: System shall maintain rule history

### REQ-LP-BE-008: Point Expiration Policy

**Description:** The system shall allow configuring point expiration policies.

**Acceptance Criteria:**
- AC1: System shall support expiration bases: FromEarnDate, FromLastActivity, CalendarYear, Never
- AC2: System shall define warning period before expiration
- AC3: System shall publish `PointExpirationPolicySet` event
- AC4: System shall support policy changes affecting future points only

### REQ-LP-BE-009: Tier Structure Configuration

**Description:** The system shall allow configuring membership tiers.

**Acceptance Criteria:**
- AC1: System shall support multiple tiers with thresholds
- AC2: System shall define tier benefits and earning multipliers
- AC3: System shall publish `TierStructureConfigured` event
- AC4: System shall allow tier-specific rewards and promotions

---

## Data Models

### LoyaltyProgram Entity

```
LoyaltyProgram
├── ProgramId: Guid (PK)
├── TenantId: Guid (FK)
├── BusinessId: Guid (FK)
├── ProgramName: string
├── ProgramType: ProgramType (enum)
├── PointsName: string
├── IsActive: bool
├── CreatedBy: Guid
├── CreatedAt: DateTime
├── UpdatedAt: DateTime
```

### EarningRule Entity

```
EarningRule
├── RuleId: Guid (PK)
├── ProgramId: Guid (FK)
├── TenantId: Guid (FK)
├── RuleType: EarningRuleType (enum)
├── PointsAmount: int
├── SpendThreshold: decimal?
├── ApplicableCategories: string (JSON)
├── EffectiveFrom: DateTime
├── EffectiveTo: DateTime?
├── IsActive: bool
├── ConfiguredBy: Guid
├── ConfiguredAt: DateTime
```

### RedemptionRule Entity

```
RedemptionRule
├── RuleId: Guid (PK)
├── ProgramId: Guid (FK)
├── TenantId: Guid (FK)
├── RedemptionType: RedemptionType (enum)
├── PointsRequired: int
├── RewardValue: decimal
├── RewardDescription: string
├── MinimumPurchase: decimal?
├── IsActive: bool
├── ConfiguredBy: Guid
├── ConfiguredAt: DateTime
```

### PointExpirationPolicy Entity

```
PointExpirationPolicy
├── PolicyId: Guid (PK)
├── ProgramId: Guid (FK)
├── TenantId: Guid (FK)
├── ExpirationPeriodMonths: int?
├── ExpirationBasis: ExpirationBasis (enum)
├── WarningPeriodDays: int
├── SetBy: Guid
├── SetAt: DateTime
```

### Tier Entity

```
Tier
├── TierId: Guid (PK)
├── ProgramId: Guid (FK)
├── TenantId: Guid (FK)
├── TierName: string
├── PointsThreshold: int
├── Benefits: string (JSON)
├── EarningMultiplier: decimal
├── SortOrder: int
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/programs` | Create loyalty program |
| GET | `/api/programs` | List programs |
| GET | `/api/programs/{programId}` | Get program details |
| PUT | `/api/programs/{programId}` | Update program |
| POST | `/api/programs/{programId}/earning-rules` | Create earning rule |
| GET | `/api/programs/{programId}/earning-rules` | List earning rules |
| PUT | `/api/programs/{programId}/earning-rules/{ruleId}` | Update earning rule |
| DELETE | `/api/programs/{programId}/earning-rules/{ruleId}` | Deactivate earning rule |
| POST | `/api/programs/{programId}/redemption-rules` | Create redemption rule |
| GET | `/api/programs/{programId}/redemption-rules` | List redemption rules |
| PUT | `/api/programs/{programId}/redemption-rules/{ruleId}` | Update redemption rule |
| DELETE | `/api/programs/{programId}/redemption-rules/{ruleId}` | Deactivate redemption rule |
| PUT | `/api/programs/{programId}/expiration-policy` | Set expiration policy |
| GET | `/api/programs/{programId}/expiration-policy` | Get expiration policy |
| PUT | `/api/programs/{programId}/tiers` | Configure tier structure |
| GET | `/api/programs/{programId}/tiers` | Get tier structure |

---

## Domain Events

- `LoyaltyProgramCreated`
- `EarningRuleConfigured`
- `EarningRuleModified`
- `EarningRuleDeactivated`
- `RedemptionRuleConfigured`
- `RedemptionRuleModified`
- `RedemptionRuleDeactivated`
- `PointExpirationPolicySet`
- `TierStructureConfigured`
