# Customer Loyalty Platform - Domain Events

## Overview

This document outlines all domain events for the Customer Loyalty Platform, a **multi-tenant SaaS solution** designed specifically for small businesses. Unlike enterprise loyalty programs (Scene+, Optimum), this platform focuses on simplicity, quick setup, and meaningful customer relationships that small business owners can manage themselves.

**Platform Architecture:** Multi-tenant with strict data isolation between tenants. Each tenant (business) operates in a logically isolated environment while sharing the underlying infrastructure.

**Target Users:** Single-owner businesses, small retail shops, independent service providers (e.g., car dealerships, salons, local restaurants, auto repair shops)

---

## Domain Event Naming Convention

All events follow the pattern: `{Aggregate}{Action}` in past tense, representing something that has already happened in the system.

---

## Multi-Tenant Event Structure

All domain events in this multi-tenant platform include mandatory tenant context:

```
{
  "EventId": "uuid",
  "TenantId": "uuid",           // Required: Identifies the tenant
  "EventType": "EventName",
  "EventVersion": "1.0",
  "CorrelationId": "uuid",
  "CausationId": "uuid",
  "Timestamp": "ISO8601",
  "Payload": { ... }
}
```

**Key Multi-Tenant Principles:**
- Every event MUST include a `TenantId` for proper routing and isolation
- Events are partitioned by `TenantId` for scalability
- Cross-tenant event access is strictly prohibited at the infrastructure level
- Platform-level events (tenant lifecycle) use a special system tenant context

---

## 1. Tenant Management Domain

Events related to tenant (business organization) lifecycle management on the platform.

### TenantProvisioned
- **Description:** A new tenant has been created and provisioned on the platform
- **Payload:**
  - `TenantId`: Unique tenant identifier
  - `TenantName`: Organization/business name
  - `TenantSlug`: URL-friendly identifier
  - `PrimaryContactEmail`: Main admin email
  - `PrimaryContactName`: Main admin name
  - `PlanType`: Initial subscription plan
  - `DataRegion`: Geographic region for data residency
  - `IsolationLevel`: "Shared", "Dedicated"
  - `ProvisionedAt`: Timestamp

### TenantActivated
- **Description:** Tenant has completed setup and is now active
- **Payload:**
  - `TenantId`: Unique tenant identifier
  - `ActivatedBy`: Admin who activated
  - `ActivatedAt`: Timestamp

### TenantSuspended
- **Description:** Tenant has been suspended (payment issues, policy violation, etc.)
- **Payload:**
  - `TenantId`: Unique tenant identifier
  - `SuspensionReason`: "PaymentFailure", "PolicyViolation", "SecurityConcern", "AdminRequest"
  - `SuspendedBy`: Who initiated suspension
  - `DataRetentionDays`: Days until data deletion
  - `SuspendedAt`: Timestamp

### TenantReactivated
- **Description:** Previously suspended tenant has been reactivated
- **Payload:**
  - `TenantId`: Unique tenant identifier
  - `ReactivatedBy`: Who reactivated
  - `ReactivationReason`: Reason for reactivation
  - `ReactivatedAt`: Timestamp

### TenantDeleted
- **Description:** Tenant has been permanently deleted (GDPR, closure, etc.)
- **Payload:**
  - `TenantId`: Unique tenant identifier
  - `DeletionReason`: "CustomerRequest", "PolicyViolation", "DataRetentionExpired"
  - `DataPurged`: Boolean indicating if all data was purged
  - `DeletedBy`: Who initiated deletion
  - `DeletedAt`: Timestamp

### TenantSettingsUpdated
- **Description:** Tenant-level configuration has been changed
- **Payload:**
  - `TenantId`: Unique tenant identifier
  - `UpdatedSettings`: Dictionary of changed settings
  - `PreviousValues`: Previous setting values
  - `UpdatedBy`: Who made the change
  - `UpdatedAt`: Timestamp

### TenantBrandingConfigured
- **Description:** Tenant has customized their branding (logo, colors, etc.)
- **Payload:**
  - `TenantId`: Unique tenant identifier
  - `LogoUrl`: URL to tenant logo
  - `PrimaryColor`: Primary brand color
  - `SecondaryColor`: Secondary brand color
  - `CustomDomain`: Custom domain (if applicable)
  - `ConfiguredAt`: Timestamp

### TenantFeatureToggled
- **Description:** A feature has been enabled or disabled for the tenant
- **Payload:**
  - `TenantId`: Unique tenant identifier
  - `FeatureName`: Name of the feature
  - `Enabled`: Boolean - enabled or disabled
  - `ToggledBy`: Who toggled the feature
  - `ToggledAt`: Timestamp

### TenantLimitsUpdated
- **Description:** Resource limits for the tenant have been updated
- **Payload:**
  - `TenantId`: Unique tenant identifier
  - `LimitType`: "MaxMembers", "MaxPrograms", "MaxLocations", "ApiRateLimit", "StorageQuota"
  - `PreviousLimit`: Previous limit value
  - `NewLimit`: New limit value
  - `Reason`: Why limits changed
  - `UpdatedAt`: Timestamp

### TenantDataExportRequested
- **Description:** Tenant has requested a full data export (GDPR portability)
- **Payload:**
  - `TenantId`: Unique tenant identifier
  - `ExportRequestId`: Unique export request identifier
  - `RequestedBy`: Who requested the export
  - `ExportFormat`: "JSON", "CSV", "XML"
  - `RequestedAt`: Timestamp

### TenantDataExportCompleted
- **Description:** Tenant data export has been completed
- **Payload:**
  - `TenantId`: Unique tenant identifier
  - `ExportRequestId`: Export request identifier
  - `DownloadUrl`: Secure URL to download export
  - `ExpiresAt`: When download link expires
  - `CompletedAt`: Timestamp

### TenantApiKeyGenerated
- **Description:** New API key has been generated for tenant integrations
- **Payload:**
  - `TenantId`: Unique tenant identifier
  - `ApiKeyId`: Unique key identifier (not the key itself)
  - `KeyName`: Descriptive name for the key
  - `Permissions`: Array of granted permissions
  - `ExpiresAt`: Optional expiration date
  - `GeneratedBy`: Who generated the key
  - `GeneratedAt`: Timestamp

### TenantApiKeyRevoked
- **Description:** An API key has been revoked
- **Payload:**
  - `TenantId`: Unique tenant identifier
  - `ApiKeyId`: Unique key identifier
  - `RevocationReason`: Why key was revoked
  - `RevokedBy`: Who revoked the key
  - `RevokedAt`: Timestamp

---

## 2. Tenant User Management Domain

Events related to users within a tenant (staff, admins, etc.)

### TenantUserInvited
- **Description:** A user has been invited to join the tenant
- **Payload:**
  - `TenantId`: Unique tenant identifier
  - `InvitationId`: Unique invitation identifier
  - `Email`: Invited user's email
  - `Role`: Assigned role ("Owner", "Admin", "Manager", "Staff")
  - `InvitedBy`: Who sent the invitation
  - `ExpiresAt`: Invitation expiration
  - `InvitedAt`: Timestamp

### TenantUserJoined
- **Description:** An invited user has accepted and joined the tenant
- **Payload:**
  - `TenantId`: Unique tenant identifier
  - `UserId`: Unique user identifier
  - `Email`: User's email
  - `Name`: User's display name
  - `Role`: Assigned role
  - `InvitationId`: Original invitation identifier
  - `JoinedAt`: Timestamp

### TenantUserRoleChanged
- **Description:** A user's role within the tenant has been changed
- **Payload:**
  - `TenantId`: Unique tenant identifier
  - `UserId`: User identifier
  - `PreviousRole`: Previous role
  - `NewRole`: New role
  - `ChangedBy`: Who made the change
  - `ChangedAt`: Timestamp

### TenantUserRemoved
- **Description:** A user has been removed from the tenant
- **Payload:**
  - `TenantId`: Unique tenant identifier
  - `UserId`: User identifier
  - `RemovedBy`: Who removed the user
  - `RemovalReason`: Optional reason
  - `RemovedAt`: Timestamp

### TenantUserPermissionsUpdated
- **Description:** Specific permissions for a user have been updated
- **Payload:**
  - `TenantId`: Unique tenant identifier
  - `UserId`: User identifier
  - `GrantedPermissions`: Array of newly granted permissions
  - `RevokedPermissions`: Array of revoked permissions
  - `UpdatedBy`: Who made the change
  - `UpdatedAt`: Timestamp

### TenantOwnershipTransferred
- **Description:** Tenant ownership has been transferred to another user
- **Payload:**
  - `TenantId`: Unique tenant identifier
  - `PreviousOwnerId`: Previous owner user ID
  - `NewOwnerId`: New owner user ID
  - `TransferredAt`: Timestamp

---

## 3. Business (Merchant) Domain

Events related to small business owner account and loyalty program setup. In a multi-tenant context, a Business belongs to a Tenant and inherits tenant-level configurations.

### BusinessRegistered
- **Description:** A new small business has registered on the platform
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `BusinessId`: Unique identifier
  - `BusinessName`: Name of the business
  - `OwnerName`: Owner's full name
  - `Email`: Business email
  - `Phone`: Contact phone
  - `BusinessType`: Category (e.g., "Automotive", "Retail", "Services", "Food & Beverage")
  - `Address`: Business location
  - `RegisteredAt`: Timestamp

### BusinessProfileUpdated
- **Description:** Business owner updated their profile information
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `BusinessId`: Unique identifier
  - `UpdatedFields`: Dictionary of changed fields
  - `UpdatedBy`: User who made the update
  - `UpdatedAt`: Timestamp

### BusinessVerified
- **Description:** Business has been verified (email, phone, or identity)
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `BusinessId`: Unique identifier
  - `VerificationType`: Type of verification completed
  - `VerifiedAt`: Timestamp

### BusinessSuspended
- **Description:** Business account has been suspended
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `BusinessId`: Unique identifier
  - `Reason`: Suspension reason
  - `SuspendedBy`: User who suspended
  - `SuspendedAt`: Timestamp

### BusinessReactivated
- **Description:** Previously suspended business has been reactivated
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `BusinessId`: Unique identifier
  - `ReactivatedBy`: User who reactivated
  - `ReactivatedAt`: Timestamp

### BusinessClosed
- **Description:** Business owner has permanently closed their loyalty program
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `BusinessId`: Unique identifier
  - `ClosureReason`: Optional reason
  - `OutstandingPointsHandling`: How remaining member points were handled
  - `ClosedBy`: User who initiated closure
  - `ClosedAt`: Timestamp

---

## 4. Loyalty Program Configuration Domain

Events related to how the business configures their loyalty program. All program configurations are scoped to the tenant.

### LoyaltyProgramCreated
- **Description:** Business has set up their loyalty program
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `ProgramId`: Unique identifier
  - `BusinessId`: Associated business
  - `ProgramName`: Display name (e.g., "Mike's Auto Rewards")
  - `ProgramType`: Points-based, Punch-card, Tiered, or Cashback
  - `PointsName`: Custom name for points (e.g., "Stars", "Bucks", "Miles")
  - `CreatedBy`: User who created the program
  - `CreatedAt`: Timestamp

### EarningRuleConfigured
- **Description:** Business has defined how customers earn points
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `RuleId`: Unique identifier
  - `ProgramId`: Associated program
  - `RuleType`: "PerDollarSpent", "PerVisit", "PerItem", "FixedAmount"
  - `PointsAmount`: Points earned
  - `SpendThreshold`: Minimum spend (if applicable)
  - `ApplicableCategories`: Product/service categories (optional)
  - `EffectiveFrom`: Start date
  - `EffectiveTo`: End date (optional)
  - `ConfiguredBy`: User who configured the rule
  - `ConfiguredAt`: Timestamp

### EarningRuleModified
- **Description:** An existing earning rule has been changed
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `RuleId`: Unique identifier
  - `ProgramId`: Associated program
  - `PreviousValues`: Previous configuration
  - `NewValues`: Updated configuration
  - `ModifiedBy`: User who modified the rule
  - `ModifiedAt`: Timestamp

### EarningRuleDeactivated
- **Description:** An earning rule has been turned off
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `RuleId`: Unique identifier
  - `ProgramId`: Associated program
  - `DeactivatedBy`: User who deactivated
  - `DeactivatedAt`: Timestamp

### RedemptionRuleConfigured
- **Description:** Business has defined how points can be redeemed
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `RuleId`: Unique identifier
  - `ProgramId`: Associated program
  - `RedemptionType`: "Discount", "FreeItem", "Service", "GiftCard"
  - `PointsRequired`: Points needed for redemption
  - `RewardValue`: Dollar value or item description
  - `MinimumPurchase`: Minimum purchase requirement (optional)
  - `ConfiguredBy`: User who configured the rule
  - `ConfiguredAt`: Timestamp

### RedemptionRuleModified
- **Description:** A redemption rule has been updated
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `RuleId`: Unique identifier
  - `ProgramId`: Associated program
  - `PreviousValues`: Previous configuration
  - `NewValues`: Updated configuration
  - `ModifiedBy`: User who modified the rule
  - `ModifiedAt`: Timestamp

### RedemptionRuleDeactivated
- **Description:** A redemption option has been removed
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `RuleId`: Unique identifier
  - `ProgramId`: Associated program
  - `DeactivatedBy`: User who deactivated
  - `DeactivatedAt`: Timestamp

### PointExpirationPolicySet
- **Description:** Business has configured when points expire
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `ProgramId`: Associated program
  - `ExpirationPeriod`: Duration (e.g., 12 months, never)
  - `ExpirationBasis`: "FromEarnDate", "FromLastActivity", "CalendarYear"
  - `WarningPeriod`: Days before expiration to warn members
  - `SetBy`: User who set the policy
  - `SetAt`: Timestamp

### TierStructureConfigured
- **Description:** Business has set up membership tiers (optional feature)
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `ProgramId`: Associated program
  - `Tiers`: Array of tier definitions
    - `TierName`: Display name (e.g., "Bronze", "Silver", "Gold")
    - `PointsThreshold`: Points needed to reach tier
    - `Benefits`: Array of tier benefits
    - `EarningMultiplier`: Bonus earning rate
  - `ConfiguredBy`: User who configured the tiers
  - `ConfiguredAt`: Timestamp

---

## 5. Member (Customer) Domain

Events related to customers who join the loyalty program. Members are isolated within their tenant context.

### MemberEnrolled
- **Description:** A customer has joined a business's loyalty program
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `MemberId`: Unique identifier
  - `ProgramId`: Loyalty program joined
  - `BusinessId`: Associated business
  - `FirstName`: Customer first name
  - `LastName`: Customer last name
  - `Email`: Customer email (optional)
  - `Phone`: Customer phone
  - `EnrollmentSource`: "InStore", "Website", "Mobile", "Referral"
  - `ReferredByMemberId`: Referring member (if applicable)
  - `EnrolledBy`: Staff user who enrolled (if in-store)
  - `EnrolledAt`: Timestamp

### MemberProfileUpdated
- **Description:** Member has updated their profile information
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `MemberId`: Unique identifier
  - `UpdatedFields`: Dictionary of changed fields
  - `UpdatedBy`: Who made the update (member or staff)
  - `UpdatedAt`: Timestamp

### MemberOptedInToMarketing
- **Description:** Member has consented to receive marketing communications
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `MemberId`: Unique identifier
  - `Channels`: Array of opted-in channels ("Email", "SMS", "Push")
  - `OptedInAt`: Timestamp

### MemberOptedOutOfMarketing
- **Description:** Member has withdrawn marketing consent
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `MemberId`: Unique identifier
  - `Channels`: Array of opted-out channels
  - `OptedOutAt`: Timestamp

### MemberCardIssued
- **Description:** Physical or digital loyalty card issued to member
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `CardId`: Unique card identifier
  - `MemberId`: Associated member
  - `CardType`: "Physical", "Digital", "Both"
  - `CardNumber`: Display card number
  - `IssuedBy`: Staff user who issued
  - `IssuedAt`: Timestamp

### MemberCardReplaced
- **Description:** Member's loyalty card has been replaced (lost/stolen)
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `OldCardId`: Previous card identifier
  - `NewCardId`: New card identifier
  - `MemberId`: Associated member
  - `Reason`: "Lost", "Stolen", "Damaged", "Upgrade"
  - `ReplacedBy`: Staff user who replaced
  - `ReplacedAt`: Timestamp

### MemberDeactivated
- **Description:** Member account has been deactivated
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `MemberId`: Unique identifier
  - `Reason`: "MemberRequest", "Inactivity", "BusinessDecision", "Fraud"
  - `PointsAtDeactivation`: Points balance at time of deactivation
  - `DeactivatedBy`: User who deactivated
  - `DeactivatedAt`: Timestamp

### MemberReactivated
- **Description:** Previously deactivated member has been reactivated
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `MemberId`: Unique identifier
  - `PointsRestored`: Whether previous points were restored
  - `ReactivatedBy`: User who reactivated
  - `ReactivatedAt`: Timestamp

### MemberMerged
- **Description:** Two member records have been combined (duplicate resolution)
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `PrimaryMemberId`: Surviving member record
  - `SecondaryMemberId`: Merged/archived member record
  - `CombinedPointsBalance`: Total points after merge
  - `MergedBy`: Staff user who performed merge
  - `MergedAt`: Timestamp

---

## 6. Points Transaction Domain

Events related to earning, redeeming, and adjusting loyalty points. All point transactions are scoped to the tenant.

### PointsEarned
- **Description:** Member has earned points from a qualifying activity
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `TransactionId`: Unique identifier
  - `MemberId`: Member who earned
  - `ProgramId`: Associated program
  - `PointsAmount`: Points earned
  - `EarningType`: "Purchase", "Referral", "Bonus", "Promotion", "Birthday", "SignUp"
  - `SourceTransactionId`: Related purchase transaction (if applicable)
  - `PurchaseAmount`: Dollar amount of purchase (if applicable)
  - `Description`: Human-readable description
  - `ExpiresAt`: When these points expire
  - `ProcessedBy`: Staff user (if manual) or "System"
  - `EarnedAt`: Timestamp

### PointsRedeemed
- **Description:** Member has redeemed points for a reward
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `TransactionId`: Unique identifier
  - `MemberId`: Member who redeemed
  - `ProgramId`: Associated program
  - `PointsAmount`: Points redeemed (negative value)
  - `RewardId`: Associated reward/offer
  - `RewardDescription`: What was redeemed
  - `RewardValue`: Dollar value of reward
  - `ProcessedBy`: Staff user who processed redemption
  - `RedeemedAt`: Timestamp

### PointsAdjusted
- **Description:** Business owner has manually adjusted a member's points
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `TransactionId`: Unique identifier
  - `MemberId`: Affected member
  - `ProgramId`: Associated program
  - `PointsAmount`: Adjustment amount (positive or negative)
  - `AdjustmentReason`: "Correction", "GoodwillGesture", "SystemError", "Promotion", "Other"
  - `Notes`: Business owner notes
  - `AdjustedBy`: Who made the adjustment
  - `AdjustedAt`: Timestamp

### PointsExpired
- **Description:** Member's points have expired due to policy
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `TransactionId`: Unique identifier
  - `MemberId`: Affected member
  - `ProgramId`: Associated program
  - `PointsAmount`: Points expired (negative value)
  - `OriginalEarnDate`: When points were originally earned
  - `ExpiredAt`: Timestamp

### PointsTransferred
- **Description:** Points transferred between members (if allowed by program)
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `TransactionId`: Unique identifier
  - `FromMemberId`: Source member
  - `ToMemberId`: Destination member
  - `ProgramId`: Associated program
  - `PointsAmount`: Points transferred
  - `ApprovedBy`: Staff user who approved (if required)
  - `TransferredAt`: Timestamp

### PointsExpirationWarningTriggered
- **Description:** System has flagged member's points for expiration warning
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `MemberId`: Member with expiring points
  - `ProgramId`: Associated program
  - `PointsExpiring`: Amount expiring soon
  - `ExpirationDate`: When points will expire
  - `TriggeredAt`: Timestamp

---

## 7. Purchase/Transaction Domain

Events related to customer purchases at the business. All purchases are isolated within the tenant.

### PurchaseRecorded
- **Description:** A customer purchase has been logged
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `PurchaseId`: Unique identifier
  - `BusinessId`: Associated business
  - `MemberId`: Associated member (if loyalty member)
  - `TotalAmount`: Purchase total
  - `SubTotal`: Pre-tax amount
  - `TaxAmount`: Tax amount
  - `DiscountApplied`: Any discounts applied
  - `PaymentMethod`: How customer paid
  - `Items`: Array of purchased items (optional)
  - `ReceiptNumber`: POS receipt reference
  - `RecordedBy`: Staff user who recorded
  - `LocationId`: Business location (if multi-location)
  - `RecordedAt`: Timestamp

### PurchaseLinkedToMember
- **Description:** A purchase has been linked to a member (after-the-fact)
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `PurchaseId`: Purchase identifier
  - `MemberId`: Member identifier
  - `PointsAwarded`: Points given for this purchase
  - `LinkedBy`: Staff user who linked
  - `LinkedAt`: Timestamp

### PurchaseRefunded
- **Description:** A purchase has been refunded (partial or full)
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `RefundId`: Unique identifier
  - `OriginalPurchaseId`: Original purchase
  - `MemberId`: Associated member (if applicable)
  - `RefundAmount`: Amount refunded
  - `RefundType`: "Full", "Partial"
  - `PointsClawedBack`: Points reversed due to refund
  - `RefundedBy`: Staff user who processed refund
  - `RefundedAt`: Timestamp

---

## 8. Reward Domain

Events related to available rewards and redemption catalog. Rewards are tenant-specific.

### RewardCreated
- **Description:** Business has created a new reward option
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `RewardId`: Unique identifier
  - `ProgramId`: Associated program
  - `RewardName`: Display name
  - `RewardDescription`: Detailed description
  - `PointsCost`: Points required
  - `RewardType`: "Discount", "FreeItem", "Service", "Experience"
  - `DollarValue`: Equivalent dollar value
  - `InventoryLimit`: Available quantity (optional)
  - `ValidFrom`: Availability start
  - `ValidUntil`: Availability end
  - `CreatedBy`: User who created
  - `CreatedAt`: Timestamp

### RewardUpdated
- **Description:** A reward's details have been modified
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `RewardId`: Unique identifier
  - `ProgramId`: Associated program
  - `UpdatedFields`: Dictionary of changed fields
  - `UpdatedBy`: User who updated
  - `UpdatedAt`: Timestamp

### RewardDepleted
- **Description:** A reward has run out of inventory
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `RewardId`: Unique identifier
  - `ProgramId`: Associated program
  - `TotalRedeemed`: Total times redeemed
  - `DepletedAt`: Timestamp

### RewardRestocked
- **Description:** Inventory has been added to a reward
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `RewardId`: Unique identifier
  - `ProgramId`: Associated program
  - `QuantityAdded`: Amount added
  - `NewInventoryLevel`: Current inventory
  - `RestockedBy`: User who restocked
  - `RestockedAt`: Timestamp

### RewardRetired
- **Description:** A reward has been permanently discontinued
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `RewardId`: Unique identifier
  - `ProgramId`: Associated program
  - `RetiredBy`: User who retired
  - `RetiredAt`: Timestamp

---

## 9. Campaign/Promotion Domain

Events related to special promotions and bonus point campaigns. Campaigns are tenant-isolated.

### CampaignCreated
- **Description:** Business has created a marketing campaign
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `CampaignId`: Unique identifier
  - `ProgramId`: Associated program
  - `CampaignName`: Display name
  - `CampaignType`: "BonusPoints", "DoublePoints", "SpecialReward", "Referral"
  - `Description`: Campaign description
  - `StartDate`: Campaign start
  - `EndDate`: Campaign end
  - `TargetAudience`: "AllMembers", "NewMembers", "InactiveMembers", "TopSpenders", "TierSpecific"
  - `CreatedBy`: User who created
  - `CreatedAt`: Timestamp

### CampaignActivated
- **Description:** A scheduled campaign has become active
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `CampaignId`: Unique identifier
  - `ProgramId`: Associated program
  - `ActivatedAt`: Timestamp

### CampaignEnded
- **Description:** A campaign has reached its end date
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `CampaignId`: Unique identifier
  - `ProgramId`: Associated program
  - `TotalParticipants`: Members who participated
  - `TotalPointsAwarded`: Bonus points given
  - `EndedAt`: Timestamp

### CampaignCancelled
- **Description:** Business has cancelled a campaign early
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `CampaignId`: Unique identifier
  - `ProgramId`: Associated program
  - `CancellationReason`: Reason for cancellation
  - `CancelledBy`: User who cancelled
  - `CancelledAt`: Timestamp

### BonusPointsAwarded
- **Description:** Member received bonus points from a campaign
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `TransactionId`: Unique identifier
  - `MemberId`: Recipient member
  - `CampaignId`: Associated campaign
  - `PointsAmount`: Bonus points awarded
  - `TriggerAction`: What triggered the bonus
  - `AwardedAt`: Timestamp

---

## 10. Tier/Level Domain

Events related to member status levels (for programs with tier structures). Tier structures are tenant-specific.

### MemberTierPromoted
- **Description:** Member has been promoted to a higher tier
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `MemberId`: Unique identifier
  - `ProgramId`: Associated program
  - `PreviousTier`: Previous tier name
  - `NewTier`: New tier name
  - `PointsAtPromotion`: Points balance at promotion
  - `PromotedAt`: Timestamp

### MemberTierDemoted
- **Description:** Member has been moved to a lower tier
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `MemberId`: Unique identifier
  - `ProgramId`: Associated program
  - `PreviousTier`: Previous tier name
  - `NewTier`: New tier name
  - `DemotionReason`: "InactivityPeriod", "AnnualReset", "InsufficientSpend"
  - `DemotedAt`: Timestamp

### MemberTierMaintained
- **Description:** Member has maintained their tier during evaluation
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `MemberId`: Unique identifier
  - `ProgramId`: Associated program
  - `CurrentTier`: Tier maintained
  - `EvaluationPeriod`: Period evaluated
  - `MaintainedAt`: Timestamp

### TierEvaluationCompleted
- **Description:** Scheduled tier evaluation has run for a program
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `ProgramId`: Associated program
  - `EvaluationPeriod`: Period evaluated
  - `MembersPromoted`: Count of promotions
  - `MembersDemoted`: Count of demotions
  - `MembersMaintained`: Count maintained
  - `CompletedAt`: Timestamp

---

## 11. Referral Domain

Events related to member referral programs. Referrals are tenant-scoped.

### ReferralCodeGenerated
- **Description:** A unique referral code has been created for a member
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `ReferralCodeId`: Unique identifier
  - `MemberId`: Member who owns the code
  - `ProgramId`: Associated program
  - `Code`: The referral code string
  - `GeneratedAt`: Timestamp

### ReferralSubmitted
- **Description:** A referral has been submitted by a prospect
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `ReferralId`: Unique identifier
  - `ReferrerMemberId`: Member who referred
  - `RefereeName`: Name of referred person
  - `RefereeContact`: Contact info of referred person
  - `ReferralCode`: Code used
  - `SubmittedAt`: Timestamp

### ReferralConverted
- **Description:** A referred prospect has become a member
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `ReferralId`: Unique identifier
  - `ReferrerMemberId`: Member who referred
  - `NewMemberId`: New member created
  - `ReferrerPointsAwarded`: Points given to referrer
  - `RefereeBonusAwarded`: Welcome bonus for new member
  - `ConvertedAt`: Timestamp

### ReferralExpired
- **Description:** A referral has expired without conversion
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `ReferralId`: Unique identifier
  - `ReferrerMemberId`: Member who referred
  - `ExpiredAt`: Timestamp

---

## 12. Communication Domain

Events related to member notifications and communications. Communications are tenant-isolated.

### NotificationSent
- **Description:** A notification has been sent to a member
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `NotificationId`: Unique identifier
  - `MemberId`: Recipient member
  - `ProgramId`: Associated program
  - `Channel`: "Email", "SMS", "Push", "InApp"
  - `NotificationType`: "PointsEarned", "PointsExpiring", "Promotion", "Reward", "Welcome", "Birthday"
  - `Subject`: Notification subject
  - `SentAt`: Timestamp

### NotificationDelivered
- **Description:** A notification has been confirmed delivered
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `NotificationId`: Unique identifier
  - `Channel`: Delivery channel
  - `DeliveredAt`: Timestamp

### NotificationFailed
- **Description:** A notification failed to deliver
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `NotificationId`: Unique identifier
  - `Channel`: Attempted channel
  - `FailureReason`: Why it failed
  - `FailedAt`: Timestamp

### NotificationOpened
- **Description:** A member has opened/viewed a notification
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `NotificationId`: Unique identifier
  - `MemberId`: Member who opened
  - `OpenedAt`: Timestamp

### NotificationActioned
- **Description:** A member has clicked/actioned a notification
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `NotificationId`: Unique identifier
  - `MemberId`: Member who actioned
  - `ActionType`: Type of action taken
  - `ActionedAt`: Timestamp

---

## 13. Analytics/Reporting Domain

Events related to business insights and analytics. All analytics are tenant-scoped.

### ReportGenerated
- **Description:** A business report has been generated
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `ReportId`: Unique identifier
  - `BusinessId`: Associated business
  - `ReportType`: "Daily", "Weekly", "Monthly", "Custom"
  - `ReportName`: Report title
  - `DateRange`: Period covered
  - `GeneratedBy`: User who generated (or "System")
  - `GeneratedAt`: Timestamp

### MilestoneAchieved
- **Description:** Business has reached a loyalty program milestone
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `BusinessId`: Associated business
  - `ProgramId`: Associated program
  - `MilestoneType`: "MemberCount", "PointsIssued", "RedemptionCount", "Revenue"
  - `MilestoneValue`: Threshold reached
  - `AchievedAt`: Timestamp

### MemberEngagementScored
- **Description:** Member engagement score has been calculated
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `MemberId`: Unique identifier
  - `ProgramId`: Associated program
  - `EngagementScore`: Calculated score (0-100)
  - `EngagementLevel`: "High", "Medium", "Low", "AtRisk", "Churned"
  - `ScoreFactors`: Breakdown of scoring factors
  - `ScoredAt`: Timestamp

### ChurnRiskIdentified
- **Description:** A member has been flagged as at-risk for churn
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `MemberId`: Unique identifier
  - `ProgramId`: Associated program
  - `RiskScore`: Risk assessment (0-100)
  - `LastActivityDate`: When member was last active
  - `RecommendedAction`: Suggested intervention
  - `IdentifiedAt`: Timestamp

---

## 14. Integration Domain

Events related to third-party integrations (POS, payment systems, etc.). Integrations are tenant-specific.

### IntegrationConnected
- **Description:** Business has connected a third-party integration
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `IntegrationId`: Unique identifier
  - `BusinessId`: Associated business
  - `IntegrationType`: "POS", "Payment", "Marketing", "CRM", "Accounting"
  - `ProviderName`: Integration provider name
  - `ConnectedBy`: User who connected
  - `ConnectedAt`: Timestamp

### IntegrationDisconnected
- **Description:** A third-party integration has been disconnected
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `IntegrationId`: Unique identifier
  - `BusinessId`: Associated business
  - `DisconnectionReason`: Why disconnected
  - `DisconnectedBy`: User who disconnected
  - `DisconnectedAt`: Timestamp

### IntegrationSyncCompleted
- **Description:** Data sync with integration has completed
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `IntegrationId`: Unique identifier
  - `BusinessId`: Associated business
  - `SyncType`: "Full", "Incremental"
  - `RecordsProcessed`: Number of records synced
  - `SyncStatus`: "Success", "PartialSuccess", "Failed"
  - `CompletedAt`: Timestamp

### IntegrationErrorOccurred
- **Description:** An error occurred with an integration
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `IntegrationId`: Unique identifier
  - `BusinessId`: Associated business
  - `ErrorType`: Error classification
  - `ErrorMessage`: Error details
  - `OccurredAt`: Timestamp

---

## 15. Billing/Subscription Domain

Events related to the platform subscription for tenants. Billing is managed at the tenant level.

### SubscriptionCreated
- **Description:** Tenant has subscribed to the platform
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `SubscriptionId`: Unique identifier
  - `PlanType`: "Free", "Starter", "Professional", "Enterprise"
  - `BillingCycle`: "Monthly", "Annual"
  - `Amount`: Subscription amount
  - `Currency`: Payment currency
  - `CreatedBy`: User who created subscription
  - `CreatedAt`: Timestamp

### SubscriptionUpgraded
- **Description:** Tenant has upgraded their subscription plan
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `SubscriptionId`: Unique identifier
  - `PreviousPlan`: Previous plan type
  - `NewPlan`: New plan type
  - `ProratedAmount`: Prorated charge/credit
  - `UpgradedBy`: User who upgraded
  - `UpgradedAt`: Timestamp

### SubscriptionDowngraded
- **Description:** Tenant has downgraded their subscription plan
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `SubscriptionId`: Unique identifier
  - `PreviousPlan`: Previous plan type
  - `NewPlan`: New plan type
  - `EffectiveDate`: When downgrade takes effect
  - `DowngradedBy`: User who downgraded
  - `DowngradedAt`: Timestamp

### SubscriptionCancelled
- **Description:** Tenant has cancelled their subscription
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `SubscriptionId`: Unique identifier
  - `CancellationReason`: Reason provided
  - `EffectiveDate`: When cancellation takes effect
  - `CancelledBy`: User who cancelled
  - `CancelledAt`: Timestamp

### PaymentSucceeded
- **Description:** Subscription payment was successful
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `PaymentId`: Unique identifier
  - `SubscriptionId`: Associated subscription
  - `Amount`: Payment amount
  - `Currency`: Payment currency
  - `PaymentMethod`: Payment method used
  - `InvoiceId`: Associated invoice
  - `SucceededAt`: Timestamp

### PaymentFailed
- **Description:** Subscription payment failed
- **Payload:**
  - `TenantId`: Parent tenant identifier
  - `PaymentId`: Unique identifier
  - `SubscriptionId`: Associated subscription
  - `Amount`: Attempted amount
  - `Currency`: Payment currency
  - `FailureReason`: Why payment failed
  - `FailureCode`: Error code from payment processor
  - `RetryScheduled`: When retry is scheduled
  - `AttemptNumber`: Which retry attempt this is
  - `FailedAt`: Timestamp

---

## Event Processing Guidelines

### Event Sourcing Considerations

1. **Immutability:** All events are immutable once created
2. **Ordering:** Events should maintain strict temporal ordering within an aggregate
3. **Idempotency:** Event handlers should be idempotent
4. **Versioning:** Include version field for schema evolution

### Recommended Event Metadata

All events should include:
- `EventId`: Unique identifier (UUID)
- `EventVersion`: Schema version
- `CorrelationId`: For tracking related events
- `CausationId`: Event that caused this event
- `Timestamp`: When event occurred
- `TenantId`: **REQUIRED** - For multi-tenant isolation

### Multi-Tenant Architecture Considerations

1. **Tenant Isolation:**
   - All events MUST include `TenantId` in the envelope
   - Event stores should be partitioned by `TenantId` for performance and isolation
   - Event handlers must validate `TenantId` before processing
   - Cross-tenant event access is strictly prohibited

2. **Event Routing:**
   - Events are routed to tenant-specific queues/topics
   - Tenant-aware event handlers subscribe only to their tenant's events
   - Platform-level events (TenantProvisioned, TenantDeleted) use system context

3. **Data Residency:**
   - Events may be stored in region-specific stores based on tenant configuration
   - `DataRegion` in TenantProvisioned determines event storage location
   - Cross-region event replication respects data residency requirements

4. **Tenant Context Propagation:**
   - `TenantId` is propagated through all event chains via `CorrelationId`
   - Service-to-service calls must include tenant context
   - Audit logs include `TenantId` for compliance

5. **Resource Limits:**
   - Event throughput may be rate-limited per tenant
   - Event storage quotas apply per tenant
   - Burst limits protect shared infrastructure

6. **Tenant Lifecycle Events:**
   - `TenantSuspended` should pause event processing for that tenant
   - `TenantDeleted` triggers cascading event purge (after retention period)
   - `TenantReactivated` resumes event processing

### Small Business Specific Considerations

1. **Simplicity First:** Start with basic earning/redemption events; tier systems are optional
2. **Manual Override Support:** Always support manual adjustments by business owner
3. **Offline Capability:** Consider events for offline/sync scenarios
4. **Low Volume Optimization:** Design for low-to-medium transaction volumes typical of small businesses
5. **Personal Touch:** Support events that enable personalized member interactions

---

## Example Event Flow: Multi-Tenant Car Dealership Scenario

**Mike's Auto Sales Loyalty Program - "Auto Rewards"**

This example demonstrates the complete event flow in a multi-tenant context, from tenant provisioning through customer engagement.

### Phase 1: Tenant Onboarding
```
TenantId: tenant_abc123
```

1. `TenantProvisioned` - Platform provisions new tenant for Mike's Auto Sales
   - TenantId: tenant_abc123
   - TenantName: "Mike's Auto Sales"
   - PlanType: "Professional"
   - DataRegion: "us-east"

2. `TenantUserInvited` - Mike receives admin invitation
   - TenantId: tenant_abc123
   - Role: "Owner"

3. `TenantUserJoined` - Mike accepts and joins
   - TenantId: tenant_abc123
   - UserId: user_mike001

4. `TenantActivated` - Tenant setup complete
   - TenantId: tenant_abc123

### Phase 2: Business & Program Setup

5. `BusinessRegistered` - Mike registers his dealership
   - TenantId: tenant_abc123
   - BusinessId: biz_auto001
   - BusinessType: "Automotive"

6. `LoyaltyProgramCreated` - Sets up "Auto Rewards" program
   - TenantId: tenant_abc123
   - ProgramId: prog_rewards001
   - ProgramName: "Auto Rewards"
   - PointsName: "Miles"

7. `EarningRuleConfigured` - $1 = 1 point on all purchases
   - TenantId: tenant_abc123
   - ProgramId: prog_rewards001

8. `RewardCreated` - Free oil change at 500 points
   - TenantId: tenant_abc123
   - RewardId: reward_oil001

### Phase 3: Member Engagement

9. `MemberEnrolled` - Customer Jane joins
   - TenantId: tenant_abc123
   - MemberId: member_jane001
   - EnrollmentSource: "InStore"

10. `PurchaseRecorded` - Jane buys new tires ($400)
    - TenantId: tenant_abc123
    - PurchaseId: purch_001

11. `PointsEarned` - Jane earns 400 points
    - TenantId: tenant_abc123
    - MemberId: member_jane001
    - PointsAmount: 400

12. `NotificationSent` - Jane receives email confirmation
    - TenantId: tenant_abc123
    - Channel: "Email"

13. `PurchaseRecorded` - Jane gets brake service ($200)
    - TenantId: tenant_abc123
    - PurchaseId: purch_002

14. `PointsEarned` - Jane earns 200 points (now 600 total)
    - TenantId: tenant_abc123
    - PointsAmount: 200

15. `PointsRedeemed` - Jane redeems 500 points for free oil change
    - TenantId: tenant_abc123
    - RewardId: reward_oil001
    - PointsAmount: -500

16. `MemberEngagementScored` - Jane flagged as "High" engagement
    - TenantId: tenant_abc123
    - EngagementLevel: "High"

### Phase 4: Tenant Administration (Optional)

17. `TenantUserInvited` - Mike invites Sarah as manager
    - TenantId: tenant_abc123
    - Role: "Manager"

18. `ReportGenerated` - Monthly performance report
    - TenantId: tenant_abc123
    - ReportType: "Monthly"

**Key Observation:** Every event in this flow carries the same `TenantId` (tenant_abc123), ensuring complete isolation from other tenants on the platform. Events from "Joe's Pizza Shop" (tenant_xyz789) would be completely separate and inaccessible to Mike's Auto Sales.

---

*Document Version: 2.0*
*Last Updated: 2025-12-28*
*Author: Product Management Team*
*Change: Updated for multi-tenant architecture support*
