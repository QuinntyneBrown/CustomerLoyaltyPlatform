# Campaigns & Promotions - Frontend Requirements

## Overview

The Campaigns frontend provides interfaces for business owners to create and manage promotional campaigns, and for members to participate in campaigns and referral programs.

---

## Requirements

### REQ-CP-FE-001: Campaign Dashboard

**Description:** The system shall provide campaign management dashboard.

**Acceptance Criteria:**
- AC1: Dashboard shall show active, scheduled, and past campaigns
- AC2: Dashboard shall display campaign performance metrics
- AC3: Dashboard shall provide quick actions (create, view, cancel)
- AC4: Dashboard shall highlight campaign status

### REQ-CP-FE-002: Campaign Creation Wizard

**Description:** The system shall provide campaign creation interface.

**Acceptance Criteria:**
- AC1: Wizard shall select campaign type
- AC2: Wizard shall configure campaign details
- AC3: Wizard shall set target audience
- AC4: Wizard shall define bonus rules
- AC5: Wizard shall set schedule
- AC6: Wizard shall preview campaign

### REQ-CP-FE-003: Campaign Detail View

**Description:** The system shall display campaign details and performance.

**Acceptance Criteria:**
- AC1: View shall show campaign configuration
- AC2: View shall display participation metrics
- AC3: View shall show points awarded
- AC4: View shall list participating members
- AC5: View shall provide cancel action if active

### REQ-CP-FE-004: Tier Management View

**Description:** The system shall display tier distribution and management.

**Acceptance Criteria:**
- AC1: View shall show member distribution by tier
- AC2: View shall display tier movement trends
- AC3: View shall provide manual tier override
- AC4: View shall trigger tier evaluation
- AC5: View shall show evaluation history

### REQ-CP-FE-005: Member Tier Progress

**Description:** The system shall show member their tier status.

**Acceptance Criteria:**
- AC1: Display shall show current tier with benefits
- AC2: Display shall show progress to next tier
- AC3: Display shall show points needed for next tier
- AC4: Display shall explain tier benefits

### REQ-CP-FE-006: Referral Program Interface

**Description:** The system shall provide referral program interface for members.

**Acceptance Criteria:**
- AC1: Interface shall display member's referral code
- AC2: Interface shall allow sharing code via channels
- AC3: Interface shall show referral history
- AC4: Interface shall display referral rewards
- AC5: Interface shall show pending referrals

---

## UI Components

### CampaignCard

```
Props:
- campaign: Campaign
- onClick: () => void

Display:
- Campaign name and type
- Status badge
- Date range
- Target audience
- Quick stats (participants, points)
```

### TierProgressBar

```
Props:
- currentPoints: number
- currentTier: Tier
- nextTier: Tier?
- pointsToNextTier: number

Display:
- Progress bar
- Current tier badge
- Next tier badge
- Points remaining label
```

### ReferralCard

```
Props:
- referral: Referral
- pointsName: string

Display:
- Referee name
- Status badge
- Submitted date
- Points earned (if converted)
```

### ShareReferralCode

```
Props:
- code: string
- shareUrl: string

Display:
- Code display (copyable)
- Share buttons (email, SMS, social)
- QR code
```

---

## Page Layouts

### Campaign Dashboard Layout

```
┌─────────────────────────────────────────────────────────┐
│  Campaigns & Promotions                  [+ New Campaign]│
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐    │
│  │ [Tab: Active] [Tab: Scheduled] [Tab: Completed] │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  Active Campaigns                                       │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Holiday Double Points          [ACTIVE]         │    │
│  │ Dec 20 - Dec 31, 2025                           │    │
│  │ All Members | 2x Points                         │    │
│  │ 156 participants | 12,450 bonus points          │    │
│  │                                    [View] [Stop]│    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Referral Bonus                 [ACTIVE]         │    │
│  │ Ongoing                                          │    │
│  │ All Members | 100 pts per referral              │    │
│  │ 23 referrals | 2,300 bonus points               │    │
│  │                                          [View] │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### Member Tier View Layout

```
┌─────────────────────────────────────────────────────────┐
│  Your Membership Status                                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │               ★ GOLD MEMBER ★                   │    │
│  │                                                 │    │
│  │     Bronze ──── Silver ──── GOLD ──── Platinum  │    │
│  │       ○          ○          ●          ○        │    │
│  │                                                 │    │
│  │         Progress to Platinum: 75%               │    │
│  │         ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░                   │    │
│  │         750 more points needed                  │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Your Gold Benefits:                             │    │
│  │ • 2x points on all purchases                    │    │
│  │ • Exclusive Gold member rewards                 │    │
│  │ • Priority customer support                     │    │
│  │ • Birthday double points                        │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## User Flows

### Create Campaign Flow

1. Business owner opens Campaigns
2. Clicks "New Campaign"
3. Selects campaign type (e.g., Double Points)
4. Enters campaign name and description
5. Configures multiplier or bonus amount
6. Selects target audience
7. Sets start and end dates
8. Previews campaign
9. Publishes campaign
10. Campaign appears in scheduled list

### Refer a Friend Flow (Member)

1. Member opens Referral section
2. Views personal referral code
3. Clicks "Share" button
4. Selects sharing method (SMS, Email, Copy)
5. Shares code with friend
6. Friend enrolls using code
7. Friend makes first purchase
8. Member receives bonus points
9. Referral appears in history as "Converted"
