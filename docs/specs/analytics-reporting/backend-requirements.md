# Analytics & Reporting - Backend Requirements

## Overview

The Analytics & Reporting feature provides business insights, performance metrics, member engagement scoring, churn risk identification, and report generation for the loyalty program.

---

## Requirements

### REQ-AR-BE-001: Report Generation

**Description:** The system shall generate business reports on demand or scheduled.

**Acceptance Criteria:**
- AC1: System shall support report types: Daily, Weekly, Monthly, Custom
- AC2: System shall capture report parameters and date range
- AC3: System shall process reports asynchronously for large datasets
- AC4: System shall publish `ReportGenerated` event
- AC5: System shall store report history

### REQ-AR-BE-002: Milestone Tracking

**Description:** The system shall track and celebrate business milestones.

**Acceptance Criteria:**
- AC1: System shall support milestones: MemberCount, PointsIssued, RedemptionCount, Revenue
- AC2: System shall detect milestone achievements
- AC3: System shall publish `MilestoneAchieved` event
- AC4: System shall track milestone history

### REQ-AR-BE-003: Member Engagement Scoring

**Description:** The system shall calculate member engagement scores.

**Acceptance Criteria:**
- AC1: System shall calculate score based on activity factors
- AC2: System shall classify engagement levels: High, Medium, Low, AtRisk, Churned
- AC3: System shall publish `MemberEngagementScored` event
- AC4: System shall support score factor configuration

### REQ-AR-BE-004: Churn Risk Identification

**Description:** The system shall identify members at risk of churning.

**Acceptance Criteria:**
- AC1: System shall analyze member activity patterns
- AC2: System shall calculate risk score (0-100)
- AC3: System shall publish `ChurnRiskIdentified` event
- AC4: System shall recommend intervention actions

### REQ-AR-BE-005: Dashboard Metrics

**Description:** The system shall provide real-time dashboard metrics.

**Acceptance Criteria:**
- AC1: System shall calculate key performance indicators
- AC2: System shall support period comparison (vs last week, month, year)
- AC3: System shall cache metrics for performance
- AC4: System shall refresh metrics on schedule

### REQ-AR-BE-006: Export Functionality

**Description:** The system shall support data export.

**Acceptance Criteria:**
- AC1: System shall support export formats: CSV, Excel, PDF
- AC2: System shall handle large exports asynchronously
- AC3: System shall apply tenant data filtering
- AC4: System shall provide download links with expiration

---

## Data Models

### Report Entity

```
Report
├── ReportId: Guid (PK)
├── TenantId: Guid (FK)
├── BusinessId: Guid (FK)
├── ReportType: ReportType (enum)
├── ReportName: string
├── DateRangeStart: DateTime
├── DateRangeEnd: DateTime
├── Parameters: string (JSON)
├── Status: ReportStatus (enum)
├── FileUrl: string?
├── GeneratedBy: Guid
├── GeneratedAt: DateTime
├── CompletedAt: DateTime?
```

### Milestone Entity

```
Milestone
├── MilestoneId: Guid (PK)
├── TenantId: Guid (FK)
├── BusinessId: Guid (FK)
├── ProgramId: Guid (FK)
├── MilestoneType: MilestoneType (enum)
├── MilestoneValue: int
├── AchievedAt: DateTime
├── PreviousMilestone: int?
```

### MemberEngagementScore Entity

```
MemberEngagementScore
├── ScoreId: Guid (PK)
├── TenantId: Guid (FK)
├── MemberId: Guid (FK)
├── ProgramId: Guid (FK)
├── EngagementScore: int
├── EngagementLevel: EngagementLevel (enum)
├── ScoreFactors: string (JSON)
├── ScoredAt: DateTime
```

### ChurnRisk Entity

```
ChurnRisk
├── RiskId: Guid (PK)
├── TenantId: Guid (FK)
├── MemberId: Guid (FK)
├── ProgramId: Guid (FK)
├── RiskScore: int
├── LastActivityDate: DateTime?
├── DaysSinceActivity: int
├── RecommendedAction: string
├── IdentifiedAt: DateTime
```

---

## Dashboard Metrics

### Program Overview Metrics

- Total Members
- New Members (period)
- Active Members (period)
- Churned Members (period)
- Total Points Issued
- Total Points Redeemed
- Redemption Rate
- Average Points per Member

### Financial Metrics

- Total Revenue Tracked
- Revenue per Member
- Reward Liability (outstanding points value)
- Redemption Value

### Engagement Metrics

- Visit Frequency
- Transaction Frequency
- Points Earning Rate
- Redemption Frequency
- Campaign Participation Rate

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/dashboard` | Get dashboard metrics |
| GET | `/api/analytics/members` | Get member analytics |
| GET | `/api/analytics/transactions` | Get transaction analytics |
| GET | `/api/analytics/rewards` | Get reward analytics |
| GET | `/api/analytics/campaigns` | Get campaign analytics |
| POST | `/api/reports` | Generate report |
| GET | `/api/reports` | List reports |
| GET | `/api/reports/{reportId}` | Get report details |
| GET | `/api/reports/{reportId}/download` | Download report |
| GET | `/api/analytics/engagement-scores` | Get engagement scores |
| GET | `/api/analytics/churn-risk` | Get at-risk members |
| GET | `/api/analytics/milestones` | Get milestone history |

---

## Domain Events

- `ReportGenerated`
- `MilestoneAchieved`
- `MemberEngagementScored`
- `ChurnRiskIdentified`
