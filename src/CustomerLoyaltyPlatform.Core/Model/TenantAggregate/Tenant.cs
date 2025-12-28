namespace CustomerLoyaltyPlatform.Core;

public class Tenant
{
    public Guid TenantId { get; set; }

    public string TenantName { get; set; } = string.Empty;

    public string TenantSlug { get; set; } = string.Empty;

    public string PrimaryContactEmail { get; set; } = string.Empty;

    public string PrimaryContactName { get; set; } = string.Empty;

    public PlanType PlanType { get; set; }

    public string DataRegion { get; set; } = string.Empty;

    public IsolationLevel IsolationLevel { get; set; }

    public TenantStatus Status { get; set; }

    public DateTime ProvisionedAt { get; set; }

    public DateTime? ActivatedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public ICollection<Business> Businesses { get; set; } = new List<Business>();

    public ICollection<TenantUser> Users { get; set; } = new List<TenantUser>();

    public ICollection<LoyaltyProgram> LoyaltyPrograms { get; set; } = new List<LoyaltyProgram>();

    public ICollection<Member> Members { get; set; } = new List<Member>();
}
