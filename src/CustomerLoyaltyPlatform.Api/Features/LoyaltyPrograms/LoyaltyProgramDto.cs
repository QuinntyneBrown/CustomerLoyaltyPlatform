namespace CustomerLoyaltyPlatform.Api;

public record LoyaltyProgramDto(
    Guid ProgramId,
    Guid TenantId,
    Guid BusinessId,
    string ProgramName,
    string ProgramType,
    string PointsName,
    bool IsActive,
    Guid CreatedBy,
    DateTime CreatedAt);

public record EarningRuleDto(
    Guid EarningRuleId,
    Guid ProgramId,
    Guid TenantId,
    string RuleType,
    int PointsAmount,
    decimal? SpendThreshold,
    string? ApplicableCategories,
    DateTime EffectiveFrom,
    DateTime? EffectiveTo,
    bool IsActive,
    Guid ConfiguredBy,
    DateTime ConfiguredAt);
