namespace CustomerLoyaltyPlatform.Api;

public record TenantDto(
    Guid TenantId,
    string TenantName,
    string TenantSlug,
    string PrimaryContactEmail,
    string PrimaryContactName,
    string PlanType,
    string DataRegion,
    string IsolationLevel,
    string Status,
    DateTime ProvisionedAt,
    DateTime? ActivatedAt);
