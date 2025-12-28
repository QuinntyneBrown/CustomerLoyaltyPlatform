# Customer Loyalty Platform - Domain Events

## Overview

This document outlines all domain events for the Customer Loyalty Platform, designed specifically for small businesses. Unlike enterprise loyalty programs (Scene+, Optimum), this platform focuses on simplicity, quick setup, and meaningful customer relationships that small business owners can manage themselves.

**Target Users:** Single-owner businesses, small retail shops, independent service providers (e.g., car dealerships, salons, local restaurants, auto repair shops)

---

## Domain Event Naming Convention

All events follow the pattern: `{Aggregate}{Action}` in past tense, representing something that has already happened in the system.

---

## 1. Business (Merchant) Domain

Events related to small business owner account and loyalty program setup.

### BusinessRegistered
- **Description:** A new small business has registered on the platform
- **Payload:**
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
  - `BusinessId`: Unique identifier
  - `UpdatedFields`: Dictionary of changed fields
  - `UpdatedAt`: Timestamp

### BusinessVerified
- **Description:** Business has been verified (email, phone, or identity)
- **Payload:**
  - `BusinessId`: Unique identifier
  - `VerificationType`: Type of verification completed
  - `VerifiedAt`: Timestamp

### BusinessSuspended
- **Description:** Business account has been suspended
- **Payload:**
  - `BusinessId`: Unique identifier
  - `Reason`: Suspension reason
  - `SuspendedAt`: Timestamp

### BusinessReactivated
- **Description:** Previously suspended business has been reactivated
- **Payload:**
  - `BusinessId`: Unique identifier
  - `ReactivatedAt`: Timestamp

### BusinessClosed
- **Description:** Business owner has permanently closed their loyalty program
- **Payload:**
  - `BusinessId`: Unique identifier
  - `ClosureReason`: Optional reason
  - `OutstandingPointsHandling`: How remaining member points were handled
  - `ClosedAt`: Timestamp

---

## 2. Loyalty Program Configuration Domain

Events related to how the business configures their loyalty program.

### LoyaltyProgramCreated
- **Description:** Business has set up their loyalty program
- **Payload:**
  - `ProgramId`: Unique identifier
  - `BusinessId`: Associated business
  - `ProgramName`: Display name (e.g., "Mike's Auto Rewards")
  - `ProgramType`: Points-based, Punch-card, Tiered, or Cashback
  - `PointsName`: Custom name for points (e.g., "Stars", "Bucks", "Miles")
  - `CreatedAt`: Timestamp

### EarningRuleConfigured
- **Description:** Business has defined how customers earn points
- **Payload:**
  - `RuleId`: Unique identifier
  - `ProgramId`: Associated program
  - `RuleType`: "PerDollarSpent", "PerVisit", "PerItem", "FixedAmount"
  - `PointsAmount`: Points earned
  - `SpendThreshold`: Minimum spend (if applicable)
  - `ApplicableCategories`: Product/service categories (optional)
  - `EffectiveFrom`: Start date
  - `EffectiveTo`: End date (optional)
  - `ConfiguredAt`: Timestamp

### EarningRuleModified
- **Description:** An existing earning rule has been changed
- **Payload:**
  - `RuleId`: Unique identifier
  - `ProgramId`: Associated program
  - `PreviousValues`: Previous configuration
  - `NewValues`: Updated configuration
  - `ModifiedAt`: Timestamp

### EarningRuleDeactivated
- **Description:** An earning rule has been turned off
- **Payload:**
  - `RuleId`: Unique identifier
  - `ProgramId`: Associated program
  - `DeactivatedAt`: Timestamp

### RedemptionRuleConfigured
- **Description:** Business has defined how points can be redeemed
- **Payload:**
  - `RuleId`: Unique identifier
  - `ProgramId`: Associated program
  - `RedemptionType`: "Discount", "FreeItem", "Service", "GiftCard"
  - `PointsRequired`: Points needed for redemption
  - `RewardValue`: Dollar value or item description
  - `MinimumPurchase`: Minimum purchase requirement (optional)
  - `ConfiguredAt`: Timestamp

### RedemptionRuleModified
- **Description:** A redemption rule has been updated
- **Payload:**
  - `RuleId`: Unique identifier
  - `ProgramId`: Associated program
  - `PreviousValues`: Previous configuration
  - `NewValues`: Updated configuration
  - `ModifiedAt`: Timestamp

### RedemptionRuleDeactivated
- **Description:** A redemption option has been removed
- **Payload:**
  - `RuleId`: Unique identifier
  - `ProgramId`: Associated program
  - `DeactivatedAt`: Timestamp

### PointExpirationPolicySet
- **Description:** Business has configured when points expire
- **Payload:**
  - `ProgramId`: Associated program
  - `ExpirationPeriod`: Duration (e.g., 12 months, never)
  - `ExpirationBasis`: "FromEarnDate", "FromLastActivity", "CalendarYear"
  - `WarningPeriod`: Days before expiration to warn members
  - `SetAt`: Timestamp

### TierStructureConfigured
- **Description:** Business has set up membership tiers (optional feature)
- **Payload:**
  - `ProgramId`: Associated program
  - `Tiers`: Array of tier definitions
    - `TierName`: Display name (e.g., "Bronze", "Silver", "Gold")
    - `PointsThreshold`: Points needed to reach tier
    - `Benefits`: Array of tier benefits
    - `EarningMultiplier`: Bonus earning rate
  - `ConfiguredAt`: Timestamp

---

## 3. Member (Customer) Domain

Events related to customers who join the loyalty program.

### MemberEnrolled
- **Description:** A customer has joined a business's loyalty program
- **Payload:**
  - `MemberId`: Unique identifier
  - `ProgramId`: Loyalty program joined
  - `BusinessId`: Associated business
  - `FirstName`: Customer first name
  - `LastName`: Customer last name
  - `Email`: Customer email (optional)
  - `Phone`: Customer phone
  - `EnrollmentSource`: "InStore", "Website", "Mobile", "Referral"
  - `ReferredByMemberId`: Referring member (if applicable)
  - `EnrolledAt`: Timestamp

### MemberProfileUpdated
- **Description:** Member has updated their profile information
- **Payload:**
  - `MemberId`: Unique identifier
  - `UpdatedFields`: Dictionary of changed fields
  - `UpdatedAt`: Timestamp

### MemberOptedInToMarketing
- **Description:** Member has consented to receive marketing communications
- **Payload:**
  - `MemberId`: Unique identifier
  - `Channels`: Array of opted-in channels ("Email", "SMS", "Push")
  - `OptedInAt`: Timestamp

### MemberOptedOutOfMarketing
- **Description:** Member has withdrawn marketing consent
- **Payload:**
  - `MemberId`: Unique identifier
  - `Channels`: Array of opted-out channels
  - `OptedOutAt`: Timestamp

### MemberCardIssued
- **Description:** Physical or digital loyalty card issued to member
- **Payload:**
  - `CardId`: Unique card identifier
  - `MemberId`: Associated member
  - `CardType`: "Physical", "Digital", "Both"
  - `CardNumber`: Display card number
  - `IssuedAt`: Timestamp

### MemberCardReplaced
- **Description:** Member's loyalty card has been replaced (lost/stolen)
- **Payload:**
  - `OldCardId`: Previous card identifier
  - `NewCardId`: New card identifier
  - `MemberId`: Associated member
  - `Reason`: "Lost", "Stolen", "Damaged", "Upgrade"
  - `ReplacedAt`: Timestamp

### MemberDeactivated
- **Description:** Member account has been deactivated
- **Payload:**
  - `MemberId`: Unique identifier
  - `Reason`: "MemberRequest", "Inactivity", "BusinessDecision", "Fraud"
  - `PointsAtDeactivation`: Points balance at time of deactivation
  - `DeactivatedAt`: Timestamp

### MemberReactivated
- **Description:** Previously deactivated member has been reactivated
- **Payload:**
  - `MemberId`: Unique identifier
  - `PointsRestored`: Whether previous points were restored
  - `ReactivatedAt`: Timestamp

### MemberMerged
- **Description:** Two member records have been combined (duplicate resolution)
- **Payload:**
  - `PrimaryMemberId`: Surviving member record
  - `SecondaryMemberId`: Merged/archived member record
  - `CombinedPointsBalance`: Total points after merge
  - `MergedAt`: Timestamp

---

## 4. Points Transaction Domain

Events related to earning, redeeming, and adjusting loyalty points.

### PointsEarned
- **Description:** Member has earned points from a qualifying activity
- **Payload:**
  - `TransactionId`: Unique identifier
  - `MemberId`: Member who earned
  - `ProgramId`: Associated program
  - `PointsAmount`: Points earned
  - `EarningType`: "Purchase", "Referral", "Bonus", "Promotion", "Birthday", "SignUp"
  - `SourceTransactionId`: Related purchase transaction (if applicable)
  - `PurchaseAmount`: Dollar amount of purchase (if applicable)
  - `Description`: Human-readable description
  - `ExpiresAt`: When these points expire
  - `EarnedAt`: Timestamp

### PointsRedeemed
- **Description:** Member has redeemed points for a reward
- **Payload:**
  - `TransactionId`: Unique identifier
  - `MemberId`: Member who redeemed
  - `ProgramId`: Associated program
  - `PointsAmount`: Points redeemed (negative value)
  - `RewardId`: Associated reward/offer
  - `RewardDescription`: What was redeemed
  - `RewardValue`: Dollar value of reward
  - `RedeemedAt`: Timestamp

### PointsAdjusted
- **Description:** Business owner has manually adjusted a member's points
- **Payload:**
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
  - `TransactionId`: Unique identifier
  - `MemberId`: Affected member
  - `ProgramId`: Associated program
  - `PointsAmount`: Points expired (negative value)
  - `OriginalEarnDate`: When points were originally earned
  - `ExpiredAt`: Timestamp

### PointsTransferred
- **Description:** Points transferred between members (if allowed by program)
- **Payload:**
  - `TransactionId`: Unique identifier
  - `FromMemberId`: Source member
  - `ToMemberId`: Destination member
  - `ProgramId`: Associated program
  - `PointsAmount`: Points transferred
  - `TransferredAt`: Timestamp

### PointsExpirationWarningTriggered
- **Description:** System has flagged member's points for expiration warning
- **Payload:**
  - `MemberId`: Member with expiring points
  - `ProgramId`: Associated program
  - `PointsExpiring`: Amount expiring soon
  - `ExpirationDate`: When points will expire
  - `TriggeredAt`: Timestamp

---

## 5. Purchase/Transaction Domain

Events related to customer purchases at the business.

### PurchaseRecorded
- **Description:** A customer purchase has been logged
- **Payload:**
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
  - `RecordedAt`: Timestamp

### PurchaseLinkedToMember
- **Description:** A purchase has been linked to a member (after-the-fact)
- **Payload:**
  - `PurchaseId`: Purchase identifier
  - `MemberId`: Member identifier
  - `PointsAwarded`: Points given for this purchase
  - `LinkedAt`: Timestamp

### PurchaseRefunded
- **Description:** A purchase has been refunded (partial or full)
- **Payload:**
  - `RefundId`: Unique identifier
  - `OriginalPurchaseId`: Original purchase
  - `MemberId`: Associated member (if applicable)
  - `RefundAmount`: Amount refunded
  - `RefundType`: "Full", "Partial"
  - `PointsClawedBack`: Points reversed due to refund
  - `RefundedAt`: Timestamp

---

## 6. Reward Domain

Events related to available rewards and redemption catalog.

### RewardCreated
- **Description:** Business has created a new reward option
- **Payload:**
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
  - `CreatedAt`: Timestamp

### RewardUpdated
- **Description:** A reward's details have been modified
- **Payload:**
  - `RewardId`: Unique identifier
  - `ProgramId`: Associated program
  - `UpdatedFields`: Dictionary of changed fields
  - `UpdatedAt`: Timestamp

### RewardDepleted
- **Description:** A reward has run out of inventory
- **Payload:**
  - `RewardId`: Unique identifier
  - `ProgramId`: Associated program
  - `TotalRedeemed`: Total times redeemed
  - `DepletedAt`: Timestamp

### RewardRestocked
- **Description:** Inventory has been added to a reward
- **Payload:**
  - `RewardId`: Unique identifier
  - `ProgramId`: Associated program
  - `QuantityAdded`: Amount added
  - `NewInventoryLevel`: Current inventory
  - `RestockedAt`: Timestamp

### RewardRetired
- **Description:** A reward has been permanently discontinued
- **Payload:**
  - `RewardId`: Unique identifier
  - `ProgramId`: Associated program
  - `RetiredAt`: Timestamp

---

## 7. Campaign/Promotion Domain

Events related to special promotions and bonus point campaigns.

### CampaignCreated
- **Description:** Business has created a marketing campaign
- **Payload:**
  - `CampaignId`: Unique identifier
  - `ProgramId`: Associated program
  - `CampaignName`: Display name
  - `CampaignType`: "BonusPoints", "DoublePoints", "SpecialReward", "Referral"
  - `Description`: Campaign description
  - `StartDate`: Campaign start
  - `EndDate`: Campaign end
  - `TargetAudience`: "AllMembers", "NewMembers", "InactiveMembers", "TopSpenders", "TierSpecific"
  - `CreatedAt`: Timestamp

### CampaignActivated
- **Description:** A scheduled campaign has become active
- **Payload:**
  - `CampaignId`: Unique identifier
  - `ProgramId`: Associated program
  - `ActivatedAt`: Timestamp

### CampaignEnded
- **Description:** A campaign has reached its end date
- **Payload:**
  - `CampaignId`: Unique identifier
  - `ProgramId`: Associated program
  - `TotalParticipants`: Members who participated
  - `TotalPointsAwarded`: Bonus points given
  - `EndedAt`: Timestamp

### CampaignCancelled
- **Description:** Business has cancelled a campaign early
- **Payload:**
  - `CampaignId`: Unique identifier
  - `ProgramId`: Associated program
  - `CancellationReason`: Reason for cancellation
  - `CancelledAt`: Timestamp

### BonusPointsAwarded
- **Description:** Member received bonus points from a campaign
- **Payload:**
  - `TransactionId`: Unique identifier
  - `MemberId`: Recipient member
  - `CampaignId`: Associated campaign
  - `PointsAmount`: Bonus points awarded
  - `TriggerAction`: What triggered the bonus
  - `AwardedAt`: Timestamp

---

## 8. Tier/Level Domain

Events related to member status levels (for programs with tier structures).

### MemberTierPromoted
- **Description:** Member has been promoted to a higher tier
- **Payload:**
  - `MemberId`: Unique identifier
  - `ProgramId`: Associated program
  - `PreviousTier`: Previous tier name
  - `NewTier`: New tier name
  - `PointsAtPromotion`: Points balance at promotion
  - `PromotedAt`: Timestamp

### MemberTierDemoted
- **Description:** Member has been moved to a lower tier
- **Payload:**
  - `MemberId`: Unique identifier
  - `ProgramId`: Associated program
  - `PreviousTier`: Previous tier name
  - `NewTier`: New tier name
  - `DemotionReason`: "InactivityPeriod", "AnnualReset", "InsufficientSpend"
  - `DemotedAt`: Timestamp

### MemberTierMaintained
- **Description:** Member has maintained their tier during evaluation
- **Payload:**
  - `MemberId`: Unique identifier
  - `ProgramId`: Associated program
  - `CurrentTier`: Tier maintained
  - `EvaluationPeriod`: Period evaluated
  - `MaintainedAt`: Timestamp

### TierEvaluationCompleted
- **Description:** Scheduled tier evaluation has run for a program
- **Payload:**
  - `ProgramId`: Associated program
  - `EvaluationPeriod`: Period evaluated
  - `MembersPromoted`: Count of promotions
  - `MembersDemoted`: Count of demotions
  - `MembersMaintained`: Count maintained
  - `CompletedAt`: Timestamp

---

## 9. Referral Domain

Events related to member referral programs.

### ReferralCodeGenerated
- **Description:** A unique referral code has been created for a member
- **Payload:**
  - `ReferralCodeId`: Unique identifier
  - `MemberId`: Member who owns the code
  - `ProgramId`: Associated program
  - `Code`: The referral code string
  - `GeneratedAt`: Timestamp

### ReferralSubmitted
- **Description:** A referral has been submitted by a prospect
- **Payload:**
  - `ReferralId`: Unique identifier
  - `ReferrerMemberId`: Member who referred
  - `RefereeName`: Name of referred person
  - `RefereeContact`: Contact info of referred person
  - `ReferralCode`: Code used
  - `SubmittedAt`: Timestamp

### ReferralConverted
- **Description:** A referred prospect has become a member
- **Payload:**
  - `ReferralId`: Unique identifier
  - `ReferrerMemberId`: Member who referred
  - `NewMemberId`: New member created
  - `ReferrerPointsAwarded`: Points given to referrer
  - `RefereeBonusAwarded`: Welcome bonus for new member
  - `ConvertedAt`: Timestamp

### ReferralExpired
- **Description:** A referral has expired without conversion
- **Payload:**
  - `ReferralId`: Unique identifier
  - `ReferrerMemberId`: Member who referred
  - `ExpiredAt`: Timestamp

---

## 10. Communication Domain

Events related to member notifications and communications.

### NotificationSent
- **Description:** A notification has been sent to a member
- **Payload:**
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
  - `NotificationId`: Unique identifier
  - `Channel`: Delivery channel
  - `DeliveredAt`: Timestamp

### NotificationFailed
- **Description:** A notification failed to deliver
- **Payload:**
  - `NotificationId`: Unique identifier
  - `Channel`: Attempted channel
  - `FailureReason`: Why it failed
  - `FailedAt`: Timestamp

### NotificationOpened
- **Description:** A member has opened/viewed a notification
- **Payload:**
  - `NotificationId`: Unique identifier
  - `MemberId`: Member who opened
  - `OpenedAt`: Timestamp

### NotificationActioned
- **Description:** A member has clicked/actioned a notification
- **Payload:**
  - `NotificationId`: Unique identifier
  - `MemberId`: Member who actioned
  - `ActionType`: Type of action taken
  - `ActionedAt`: Timestamp

---

## 11. Analytics/Reporting Domain

Events related to business insights and analytics.

### ReportGenerated
- **Description:** A business report has been generated
- **Payload:**
  - `ReportId`: Unique identifier
  - `BusinessId`: Associated business
  - `ReportType`: "Daily", "Weekly", "Monthly", "Custom"
  - `ReportName`: Report title
  - `DateRange`: Period covered
  - `GeneratedAt`: Timestamp

### MilestoneAchieved
- **Description:** Business has reached a loyalty program milestone
- **Payload:**
  - `BusinessId`: Associated business
  - `ProgramId`: Associated program
  - `MilestoneType`: "MemberCount", "PointsIssued", "RedemptionCount", "Revenue"
  - `MilestoneValue`: Threshold reached
  - `AchievedAt`: Timestamp

### MemberEngagementScored
- **Description:** Member engagement score has been calculated
- **Payload:**
  - `MemberId`: Unique identifier
  - `ProgramId`: Associated program
  - `EngagementScore`: Calculated score (0-100)
  - `EngagementLevel`: "High", "Medium", "Low", "AtRisk", "Churned"
  - `ScoreFactors`: Breakdown of scoring factors
  - `ScoredAt`: Timestamp

### ChurnRiskIdentified
- **Description:** A member has been flagged as at-risk for churn
- **Payload:**
  - `MemberId`: Unique identifier
  - `ProgramId`: Associated program
  - `RiskScore`: Risk assessment (0-100)
  - `LastActivityDate`: When member was last active
  - `RecommendedAction`: Suggested intervention
  - `IdentifiedAt`: Timestamp

---

## 12. Integration Domain

Events related to third-party integrations (POS, payment systems, etc.)

### IntegrationConnected
- **Description:** Business has connected a third-party integration
- **Payload:**
  - `IntegrationId`: Unique identifier
  - `BusinessId`: Associated business
  - `IntegrationType`: "POS", "Payment", "Marketing", "CRM", "Accounting"
  - `ProviderName`: Integration provider name
  - `ConnectedAt`: Timestamp

### IntegrationDisconnected
- **Description:** A third-party integration has been disconnected
- **Payload:**
  - `IntegrationId`: Unique identifier
  - `BusinessId`: Associated business
  - `DisconnectionReason`: Why disconnected
  - `DisconnectedAt`: Timestamp

### IntegrationSyncCompleted
- **Description:** Data sync with integration has completed
- **Payload:**
  - `IntegrationId`: Unique identifier
  - `BusinessId`: Associated business
  - `SyncType`: "Full", "Incremental"
  - `RecordsProcessed`: Number of records synced
  - `SyncStatus`: "Success", "PartialSuccess", "Failed"
  - `CompletedAt`: Timestamp

### IntegrationErrorOccurred
- **Description:** An error occurred with an integration
- **Payload:**
  - `IntegrationId`: Unique identifier
  - `BusinessId`: Associated business
  - `ErrorType`: Error classification
  - `ErrorMessage`: Error details
  - `OccurredAt`: Timestamp

---

## 13. Billing/Subscription Domain

Events related to the platform subscription for business owners.

### SubscriptionCreated
- **Description:** Business has subscribed to the platform
- **Payload:**
  - `SubscriptionId`: Unique identifier
  - `BusinessId`: Associated business
  - `PlanType`: "Free", "Starter", "Professional", "Enterprise"
  - `BillingCycle`: "Monthly", "Annual"
  - `Amount`: Subscription amount
  - `CreatedAt`: Timestamp

### SubscriptionUpgraded
- **Description:** Business has upgraded their subscription plan
- **Payload:**
  - `SubscriptionId`: Unique identifier
  - `BusinessId`: Associated business
  - `PreviousPlan`: Previous plan type
  - `NewPlan`: New plan type
  - `UpgradedAt`: Timestamp

### SubscriptionDowngraded
- **Description:** Business has downgraded their subscription plan
- **Payload:**
  - `SubscriptionId`: Unique identifier
  - `BusinessId`: Associated business
  - `PreviousPlan`: Previous plan type
  - `NewPlan`: New plan type
  - `EffectiveDate`: When downgrade takes effect
  - `DowngradedAt`: Timestamp

### SubscriptionCancelled
- **Description:** Business has cancelled their subscription
- **Payload:**
  - `SubscriptionId`: Unique identifier
  - `BusinessId`: Associated business
  - `CancellationReason`: Reason provided
  - `EffectiveDate`: When cancellation takes effect
  - `CancelledAt`: Timestamp

### PaymentSucceeded
- **Description:** Subscription payment was successful
- **Payload:**
  - `PaymentId`: Unique identifier
  - `SubscriptionId`: Associated subscription
  - `BusinessId`: Associated business
  - `Amount`: Payment amount
  - `PaymentMethod`: Payment method used
  - `SucceededAt`: Timestamp

### PaymentFailed
- **Description:** Subscription payment failed
- **Payload:**
  - `PaymentId`: Unique identifier
  - `SubscriptionId`: Associated subscription
  - `BusinessId`: Associated business
  - `Amount`: Attempted amount
  - `FailureReason`: Why payment failed
  - `RetryScheduled`: When retry is scheduled
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
- `TenantId`: For multi-tenant isolation (BusinessId)

### Small Business Specific Considerations

1. **Simplicity First:** Start with basic earning/redemption events; tier systems are optional
2. **Manual Override Support:** Always support manual adjustments by business owner
3. **Offline Capability:** Consider events for offline/sync scenarios
4. **Low Volume Optimization:** Design for low-to-medium transaction volumes typical of small businesses
5. **Personal Touch:** Support events that enable personalized member interactions

---

## Example Event Flow: Car Dealership Scenario

**Mike's Auto Sales Loyalty Program - "Auto Rewards"**

1. `BusinessRegistered` - Mike registers his dealership
2. `LoyaltyProgramCreated` - Sets up "Auto Rewards" program
3. `EarningRuleConfigured` - $1 = 1 point on all purchases
4. `RewardCreated` - Free oil change at 500 points
5. `MemberEnrolled` - Customer Jane joins
6. `PurchaseRecorded` - Jane buys new tires ($400)
7. `PointsEarned` - Jane earns 400 points
8. `NotificationSent` - Jane receives email confirmation
9. `PurchaseRecorded` - Jane gets brake service ($200)
10. `PointsEarned` - Jane earns 200 points (now 600 total)
11. `PointsRedeemed` - Jane redeems 500 points for free oil change
12. `MemberEngagementScored` - Jane flagged as "High" engagement

---

*Document Version: 1.0*
*Last Updated: 2025-12-28*
*Author: Product Management Team*
