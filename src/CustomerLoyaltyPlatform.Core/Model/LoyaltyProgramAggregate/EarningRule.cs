namespace CustomerLoyaltyPlatform.Core;

public class EarningRule
{
    public Guid EarningRuleId { get; set; }

    public Guid ProgramId { get; set; }

    public Guid TenantId { get; set; }

    public EarningRuleType RuleType { get; set; }

    public int PointsAmount { get; set; }

    public decimal? SpendThreshold { get; set; }

    public string? ApplicableCategories { get; set; }

    public DateTime EffectiveFrom { get; set; }

    public DateTime? EffectiveTo { get; set; }

    public bool IsActive { get; set; }

    public Guid ConfiguredBy { get; set; }

    public DateTime ConfiguredAt { get; set; }

    public LoyaltyProgram Program { get; set; } = null!;
}
