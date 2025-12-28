# Loyalty Program - Frontend Requirements

## Overview

The Loyalty Program frontend provides interfaces for business owners to configure and manage their loyalty programs, including earning rules, redemption options, and tier structures.

---

## Requirements

### REQ-LP-FE-001: Program Setup Wizard

**Description:** The system shall provide a guided program setup experience.

**Acceptance Criteria:**
- AC1: Wizard shall have steps: Basic Info, Earning Rules, Redemption Rules, Review
- AC2: Wizard shall provide templates for common program types
- AC3: Wizard shall validate each step before progression
- AC4: Wizard shall show preview of program at each step
- AC5: Wizard shall allow saving as draft

### REQ-LP-FE-002: Program Dashboard

**Description:** The system shall provide a program overview dashboard.

**Acceptance Criteria:**
- AC1: Dashboard shall show program statistics (members, points issued, redemptions)
- AC2: Dashboard shall display active earning rules summary
- AC3: Dashboard shall show popular redemption options
- AC4: Dashboard shall provide quick edit actions
- AC5: Dashboard shall show tier distribution (if applicable)

### REQ-LP-FE-003: Earning Rules Manager

**Description:** The system shall provide earning rules configuration interface.

**Acceptance Criteria:**
- AC1: Interface shall list all earning rules with status
- AC2: Interface shall provide add/edit/deactivate actions
- AC3: Interface shall show rule preview with examples
- AC4: Interface shall validate rule conflicts
- AC5: Interface shall support effective date scheduling

### REQ-LP-FE-004: Redemption Rules Manager

**Description:** The system shall provide redemption rules configuration interface.

**Acceptance Criteria:**
- AC1: Interface shall list all redemption options
- AC2: Interface shall show points cost and reward value
- AC3: Interface shall support reward images
- AC4: Interface shall validate point values
- AC5: Interface shall show redemption popularity

### REQ-LP-FE-005: Expiration Policy Editor

**Description:** The system shall provide expiration policy configuration.

**Acceptance Criteria:**
- AC1: Editor shall offer expiration period options
- AC2: Editor shall explain impact of each option
- AC3: Editor shall set warning notification period
- AC4: Editor shall preview affected members
- AC5: Editor shall require confirmation for changes

### REQ-LP-FE-006: Tier Builder

**Description:** The system shall provide tier structure configuration.

**Acceptance Criteria:**
- AC1: Builder shall allow adding multiple tiers
- AC2: Builder shall set tier thresholds and benefits
- AC3: Builder shall configure earning multipliers
- AC4: Builder shall provide drag-drop ordering
- AC5: Builder shall visualize tier progression

### REQ-LP-FE-007: Points Calculator Preview

**Description:** The system shall provide a points earning calculator.

**Acceptance Criteria:**
- AC1: Calculator shall show earning for sample purchases
- AC2: Calculator shall demonstrate tier bonuses
- AC3: Calculator shall show time to reach rewards
- AC4: Calculator shall be embeddable on business website

---

## UI Components

### ProgramTypeCard

```
Props:
- type: 'points' | 'punchcard' | 'tiered' | 'cashback'
- selected: boolean
- onSelect: () => void

Display:
- Program type icon
- Type name and description
- Selection indicator
```

### EarningRuleCard

```
Props:
- rule: EarningRule
- onEdit: () => void
- onDeactivate: () => void

Display:
- Rule type icon
- Earning description (e.g., "1 point per $1")
- Active status
- Effective dates
- Action menu
```

### RedemptionOptionCard

```
Props:
- rule: RedemptionRule
- onEdit: () => void
- redemptionCount: number

Display:
- Reward image
- Reward name and description
- Points cost
- Redemption count
- Value indicator
```

### TierCard

```
Props:
- tier: Tier
- memberCount: number
- onEdit: () => void

Display:
- Tier badge/icon
- Tier name
- Points threshold
- Benefits list
- Member count
```

---

## Page Layouts

### Program Configuration Layout

```
┌─────────────────────────────────────────────────────────┐
│  Loyalty Program Configuration                          │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌─────────────────────────────────┐  │
│  │ Navigation   │  │  Content Area                   │  │
│  │ ──────────── │  │                                 │  │
│  │ • Overview   │  │  [Program Type Selection]       │  │
│  │ • Earning    │  │                                 │  │
│  │ • Redemption │  │  ┌─────────┐ ┌─────────┐       │  │
│  │ • Expiration │  │  │ Points  │ │ Punch   │       │  │
│  │ • Tiers      │  │  │  Based  │ │  Card   │       │  │
│  │              │  │  └─────────┘ └─────────┘       │  │
│  │              │  │                                 │  │
│  │              │  │  ┌─────────┐ ┌─────────┐       │  │
│  │              │  │  │ Tiered  │ │Cashback │       │  │
│  │              │  │  └─────────┘ └─────────┘       │  │
│  └──────────────┘  └─────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Tier Builder Layout

```
┌─────────────────────────────────────────────────────────┐
│  Tier Structure                              [Add Tier] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │     Bronze        Silver         Gold           │    │
│  │     [0 pts]      [500 pts]     [1500 pts]       │    │
│  │        ●────────────●────────────●              │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │
│  │   Bronze     │ │   Silver     │ │    Gold      │    │
│  │  ──────────  │ │  ──────────  │ │  ──────────  │    │
│  │  1x Earning  │ │ 1.5x Earning │ │  2x Earning  │    │
│  │  Basic       │ │ Priority     │ │  VIP Access  │    │
│  │  Benefits    │ │ Support      │ │  Exclusive   │    │
│  │              │ │              │ │  Rewards     │    │
│  │  [Edit]      │ │  [Edit]      │ │  [Edit]      │    │
│  └──────────────┘ └──────────────┘ └──────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## User Flows

### Create Earning Rule Flow

1. User navigates to Earning Rules section
2. User clicks "Add Earning Rule"
3. Modal opens with rule type selection
4. User selects rule type (e.g., "Per Dollar Spent")
5. User configures points amount and conditions
6. User sets effective dates (optional)
7. User previews rule with example calculation
8. User saves rule
9. Rule appears in active rules list

### Configure Tiers Flow

1. User navigates to Tiers section
2. User clicks "Enable Tiers" (if first time)
3. Tier builder interface opens
4. User adds first tier with name and threshold
5. User adds benefits and multiplier
6. User repeats for additional tiers
7. User orders tiers by threshold
8. User previews tier progression
9. User saves tier configuration
