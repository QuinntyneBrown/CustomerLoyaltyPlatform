using CustomerLoyaltyPlatform.Core;

namespace CustomerLoyaltyPlatform.Api;

public static class TenantExtensions
{
    public static TenantDto ToDto(this Tenant tenant)
    {
        return new TenantDto(
            tenant.TenantId,
            tenant.TenantName,
            tenant.TenantSlug,
            tenant.PrimaryContactEmail,
            tenant.PrimaryContactName,
            tenant.PlanType.ToString(),
            tenant.DataRegion,
            tenant.IsolationLevel.ToString(),
            tenant.Status.ToString(),
            tenant.ProvisionedAt,
            tenant.ActivatedAt);
    }
}
