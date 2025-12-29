using CustomerLoyaltyPlatform.Core;

namespace CustomerLoyaltyPlatform.Api;

public static class LoyaltyProgramExtensions
{
    public static LoyaltyProgramDto ToDto(this LoyaltyProgram program)
    {
        return new LoyaltyProgramDto(
            program.ProgramId,
            program.TenantId,
            program.BusinessId,
            program.ProgramName,
            program.ProgramType.ToString(),
            program.PointsName,
            program.IsActive,
            program.CreatedBy,
            program.CreatedAt);
    }

    public static EarningRuleDto ToDto(this EarningRule rule)
    {
        return new EarningRuleDto(
            rule.EarningRuleId,
            rule.ProgramId,
            rule.TenantId,
            rule.RuleType.ToString(),
            rule.PointsAmount,
            rule.SpendThreshold,
            rule.ApplicableCategories,
            rule.EffectiveFrom,
            rule.EffectiveTo,
            rule.IsActive,
            rule.ConfiguredBy,
            rule.ConfiguredAt);
    }
}
