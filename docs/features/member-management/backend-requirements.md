# Member Management - Backend Requirements

## Overview

The Member Management feature handles customers who join loyalty programs, including enrollment, profile management, card issuance, marketing preferences, and member lifecycle operations like merging and deactivation.

---

## Requirements

### REQ-MM-BE-001: Member Enrollment

**Description:** The system shall allow enrolling customers in loyalty programs.

**Acceptance Criteria:**
- AC1: System shall generate unique MemberId
- AC2: System shall capture first name, last name, email (optional), phone
- AC3: System shall track enrollment source: InStore, Website, Mobile, Referral
- AC4: System shall link to referring member if applicable
- AC5: System shall publish `MemberEnrolled` event
- AC6: System shall associate member with program and tenant

### REQ-MM-BE-002: Member Profile Updates

**Description:** The system shall allow updating member profile information.

**Acceptance Criteria:**
- AC1: System shall track all field changes
- AC2: System shall validate updated fields
- AC3: System shall publish `MemberProfileUpdated` event
- AC4: System shall support updates by member or staff

### REQ-MM-BE-003: Marketing Preferences

**Description:** The system shall manage member marketing opt-in/opt-out preferences.

**Acceptance Criteria:**
- AC1: System shall support channels: Email, SMS, Push
- AC2: System shall publish `MemberOptedInToMarketing` event
- AC3: System shall publish `MemberOptedOutOfMarketing` event
- AC4: System shall respect preferences in all communications
- AC5: System shall maintain preference change history

### REQ-MM-BE-004: Loyalty Card Issuance

**Description:** The system shall support issuing loyalty cards to members.

**Acceptance Criteria:**
- AC1: System shall generate unique CardId and display CardNumber
- AC2: System shall support card types: Physical, Digital, Both
- AC3: System shall publish `MemberCardIssued` event
- AC4: System shall generate QR/barcode for digital cards

### REQ-MM-BE-005: Card Replacement

**Description:** The system shall support replacing lost/stolen cards.

**Acceptance Criteria:**
- AC1: System shall deactivate old card
- AC2: System shall issue new card with same member association
- AC3: System shall track replacement reason: Lost, Stolen, Damaged, Upgrade
- AC4: System shall publish `MemberCardReplaced` event
- AC5: System shall maintain points balance on new card

### REQ-MM-BE-006: Member Deactivation

**Description:** The system shall allow deactivating member accounts.

**Acceptance Criteria:**
- AC1: System shall support reasons: MemberRequest, Inactivity, BusinessDecision, Fraud
- AC2: System shall record points balance at deactivation
- AC3: System shall publish `MemberDeactivated` event
- AC4: System shall prevent further transactions

### REQ-MM-BE-007: Member Reactivation

**Description:** The system shall allow reactivating deactivated members.

**Acceptance Criteria:**
- AC1: System shall optionally restore previous points
- AC2: System shall publish `MemberReactivated` event
- AC3: System shall enable transactions for member

### REQ-MM-BE-008: Member Merge

**Description:** The system shall allow merging duplicate member records.

**Acceptance Criteria:**
- AC1: System shall combine points balances
- AC2: System shall merge transaction history
- AC3: System shall archive secondary member record
- AC4: System shall publish `MemberMerged` event
- AC5: System shall update all references to secondary member

---

## Data Models

### Member Entity

```
Member
├── MemberId: Guid (PK)
├── TenantId: Guid (FK)
├── ProgramId: Guid (FK)
├── BusinessId: Guid (FK)
├── FirstName: string
├── LastName: string
├── Email: string?
├── Phone: string
├── EnrollmentSource: EnrollmentSource (enum)
├── ReferredByMemberId: Guid?
├── EnrolledBy: Guid?
├── Status: MemberStatus (enum)
├── PointsBalance: int
├── LifetimePoints: int
├── EnrolledAt: DateTime
├── LastActivityAt: DateTime?
├── CreatedAt: DateTime
├── UpdatedAt: DateTime
```

### MemberCard Entity

```
MemberCard
├── CardId: Guid (PK)
├── MemberId: Guid (FK)
├── TenantId: Guid (FK)
├── CardType: CardType (enum)
├── CardNumber: string
├── BarcodeData: string
├── IsActive: bool
├── IssuedBy: Guid
├── IssuedAt: DateTime
├── DeactivatedAt: DateTime?
```

### MemberMarketingPreference Entity

```
MemberMarketingPreference
├── PreferenceId: Guid (PK)
├── MemberId: Guid (FK)
├── TenantId: Guid (FK)
├── Channel: MarketingChannel (enum)
├── IsOptedIn: bool
├── UpdatedAt: DateTime
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/members` | Enroll member |
| GET | `/api/members` | List members |
| GET | `/api/members/{memberId}` | Get member details |
| PUT | `/api/members/{memberId}` | Update member profile |
| GET | `/api/members/{memberId}/points` | Get points balance |
| GET | `/api/members/{memberId}/transactions` | Get transaction history |
| PUT | `/api/members/{memberId}/marketing-preferences` | Update marketing preferences |
| POST | `/api/members/{memberId}/cards` | Issue card |
| POST | `/api/members/{memberId}/cards/{cardId}/replace` | Replace card |
| POST | `/api/members/{memberId}/deactivate` | Deactivate member |
| POST | `/api/members/{memberId}/reactivate` | Reactivate member |
| POST | `/api/members/merge` | Merge members |
| GET | `/api/members/search` | Search members |
| GET | `/api/members/by-card/{cardNumber}` | Lookup by card |
| GET | `/api/members/by-phone/{phone}` | Lookup by phone |

---

## Domain Events

- `MemberEnrolled`
- `MemberProfileUpdated`
- `MemberOptedInToMarketing`
- `MemberOptedOutOfMarketing`
- `MemberCardIssued`
- `MemberCardReplaced`
- `MemberDeactivated`
- `MemberReactivated`
- `MemberMerged`
