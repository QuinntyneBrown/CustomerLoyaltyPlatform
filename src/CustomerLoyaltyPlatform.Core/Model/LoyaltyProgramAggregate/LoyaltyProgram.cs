namespace CustomerLoyaltyPlatform.Core;

public class LoyaltyProgram
{
    public Guid ProgramId { get; set; }

    public Guid TenantId { get; set; }

    public Guid BusinessId { get; set; }

    public string ProgramName { get; set; } = string.Empty;

    public ProgramType ProgramType { get; set; }

    public string PointsName { get; set; } = string.Empty;

    public bool IsActive { get; set; }

    public Guid CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public Tenant Tenant { get; set; } = null!;

    public Business Business { get; set; } = null!;

    public ICollection<EarningRule> EarningRules { get; set; } = new List<EarningRule>();

    public ICollection<Member> Members { get; set; } = new List<Member>();
}
