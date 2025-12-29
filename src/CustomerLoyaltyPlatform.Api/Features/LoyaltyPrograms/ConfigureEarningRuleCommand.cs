using CustomerLoyaltyPlatform.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CustomerLoyaltyPlatform.Api;

public record ConfigureEarningRuleCommand(
    Guid TenantId,
    Guid ProgramId,
    string RuleType,
    int PointsAmount,
    decimal? SpendThreshold,
    string? ApplicableCategories,
    DateTime EffectiveFrom,
    DateTime? EffectiveTo,
    Guid ConfiguredBy) : IRequest<EarningRuleDto>;

public class ConfigureEarningRuleCommandHandler : IRequestHandler<ConfigureEarningRuleCommand, EarningRuleDto>
{
    private readonly ICustomerLoyaltyPlatformContext context;
    private readonly ILogger<ConfigureEarningRuleCommandHandler> logger;

    public ConfigureEarningRuleCommandHandler(
        ICustomerLoyaltyPlatformContext context,
        ILogger<ConfigureEarningRuleCommandHandler> logger)
    {
        this.context = context;
        this.logger = logger;
    }

    public async Task<EarningRuleDto> Handle(ConfigureEarningRuleCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation(
            "Configuring earning rule for program {ProgramId}",
            request.ProgramId);

        var program = await context.LoyaltyPrograms
            .FirstOrDefaultAsync(
                p => p.ProgramId == request.ProgramId && p.TenantId == request.TenantId,
                cancellationToken);

        if (program == null)
        {
            logger.LogWarning("Program {ProgramId} not found in tenant {TenantId}", request.ProgramId, request.TenantId);
            throw new InvalidOperationException($"Loyalty program with ID '{request.ProgramId}' not found.");
        }

        var ruleType = Enum.TryParse<EarningRuleType>(request.RuleType, out var rt) ? rt : EarningRuleType.PerDollarSpent;
        var now = DateTime.UtcNow;

        var rule = new EarningRule
        {
            EarningRuleId = Guid.NewGuid(),
            ProgramId = request.ProgramId,
            TenantId = request.TenantId,
            RuleType = ruleType,
            PointsAmount = request.PointsAmount,
            SpendThreshold = request.SpendThreshold,
            ApplicableCategories = request.ApplicableCategories,
            EffectiveFrom = request.EffectiveFrom,
            EffectiveTo = request.EffectiveTo,
            IsActive = true,
            ConfiguredBy = request.ConfiguredBy,
            ConfiguredAt = now,
        };

        context.EarningRules.Add(rule);
        await context.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Earning rule {EarningRuleId} configured successfully", rule.EarningRuleId);

        return rule.ToDto();
    }
}
