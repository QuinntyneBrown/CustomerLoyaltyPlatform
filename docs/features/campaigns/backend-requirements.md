# Campaigns & Promotions - Backend Requirements

## Overview

The Campaigns feature handles marketing campaigns and promotional activities including bonus point campaigns, double points events, special rewards, and referral programs. This includes member tier management and evaluation.

---

## Requirements

### REQ-CP-BE-001: Campaign Creation

**Description:** The system shall allow creating marketing campaigns.

**Acceptance Criteria:**
- AC1: System shall generate unique CampaignId
- AC2: System shall support campaign types: BonusPoints, DoublePoints, SpecialReward, Referral
- AC3: System shall define start and end dates
- AC4: System shall target audiences: AllMembers, NewMembers, InactiveMembers, TopSpenders, TierSpecific
- AC5: System shall publish `CampaignCreated` event

### REQ-CP-BE-002: Campaign Activation

**Description:** The system shall activate campaigns at scheduled start time.

**Acceptance Criteria:**
- AC1: System shall automatically activate at StartDate
- AC2: System shall publish `CampaignActivated` event
- AC3: System shall apply campaign rules to qualifying transactions

### REQ-CP-BE-003: Campaign Completion

**Description:** The system shall end campaigns at scheduled end time.

**Acceptance Criteria:**
- AC1: System shall automatically end at EndDate
- AC2: System shall calculate campaign statistics
- AC3: System shall publish `CampaignEnded` event

### REQ-CP-BE-004: Campaign Cancellation

**Description:** The system shall allow early campaign cancellation.

**Acceptance Criteria:**
- AC1: System shall require cancellation reason
- AC2: System shall stop campaign immediately
- AC3: System shall publish `CampaignCancelled` event

### REQ-CP-BE-005: Bonus Points Award

**Description:** The system shall award bonus points for campaign participation.

**Acceptance Criteria:**
- AC1: System shall identify qualifying members
- AC2: System shall calculate bonus points per campaign rules
- AC3: System shall publish `BonusPointsAwarded` event
- AC4: System shall track campaign attribution

### REQ-CP-BE-006: Member Tier Promotion

**Description:** The system shall promote members to higher tiers.

**Acceptance Criteria:**
- AC1: System shall evaluate points against tier thresholds
- AC2: System shall update member tier
- AC3: System shall publish `MemberTierPromoted` event
- AC4: System shall apply new tier benefits immediately

### REQ-CP-BE-007: Member Tier Demotion

**Description:** The system shall demote members based on policy.

**Acceptance Criteria:**
- AC1: System shall support demotion reasons: InactivityPeriod, AnnualReset, InsufficientSpend
- AC2: System shall update member tier
- AC3: System shall publish `MemberTierDemoted` event

### REQ-CP-BE-008: Tier Evaluation

**Description:** The system shall run scheduled tier evaluations.

**Acceptance Criteria:**
- AC1: System shall evaluate all members in program
- AC2: System shall process promotions and demotions
- AC3: System shall publish `TierEvaluationCompleted` event with statistics

### REQ-CP-BE-009: Referral Program

**Description:** The system shall manage referral programs.

**Acceptance Criteria:**
- AC1: System shall generate unique referral codes per member
- AC2: System shall track referral submissions
- AC3: System shall award points on referral conversion
- AC4: System shall publish referral-related events

---

## Data Models

### Campaign Entity

```
Campaign
├── CampaignId: Guid (PK)
├── TenantId: Guid (FK)
├── ProgramId: Guid (FK)
├── CampaignName: string
├── CampaignType: CampaignType (enum)
├── Description: string
├── StartDate: DateTime
├── EndDate: DateTime
├── TargetAudience: TargetAudience (enum)
├── TargetTiers: string? (JSON)
├── BonusPointsAmount: int?
├── PointsMultiplier: decimal?
├── Status: CampaignStatus (enum)
├── TotalParticipants: int
├── TotalPointsAwarded: int
├── CreatedBy: Guid
├── CreatedAt: DateTime
```

### ReferralCode Entity

```
ReferralCode
├── ReferralCodeId: Guid (PK)
├── TenantId: Guid (FK)
├── MemberId: Guid (FK)
├── ProgramId: Guid (FK)
├── Code: string
├── IsActive: bool
├── GeneratedAt: DateTime
```

### Referral Entity

```
Referral
├── ReferralId: Guid (PK)
├── TenantId: Guid (FK)
├── ReferrerMemberId: Guid (FK)
├── RefereeName: string
├── RefereeContact: string
├── ReferralCodeUsed: string
├── Status: ReferralStatus (enum)
├── NewMemberId: Guid?
├── ReferrerPointsAwarded: int?
├── RefereeBonusAwarded: int?
├── SubmittedAt: DateTime
├── ConvertedAt: DateTime?
├── ExpiredAt: DateTime?
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/campaigns` | Create campaign |
| GET | `/api/campaigns` | List campaigns |
| GET | `/api/campaigns/{campaignId}` | Get campaign details |
| PUT | `/api/campaigns/{campaignId}` | Update campaign |
| POST | `/api/campaigns/{campaignId}/cancel` | Cancel campaign |
| GET | `/api/campaigns/{campaignId}/stats` | Get campaign statistics |
| GET | `/api/members/{memberId}/referral-code` | Get member's referral code |
| POST | `/api/referrals` | Submit referral |
| GET | `/api/members/{memberId}/referrals` | Get member's referrals |
| POST | `/api/programs/{programId}/tier-evaluation` | Trigger tier evaluation |
| GET | `/api/members/{memberId}/tier` | Get member tier info |

---

## Domain Events

- `CampaignCreated`
- `CampaignActivated`
- `CampaignEnded`
- `CampaignCancelled`
- `BonusPointsAwarded`
- `MemberTierPromoted`
- `MemberTierDemoted`
- `MemberTierMaintained`
- `TierEvaluationCompleted`
- `ReferralCodeGenerated`
- `ReferralSubmitted`
- `ReferralConverted`
- `ReferralExpired`
