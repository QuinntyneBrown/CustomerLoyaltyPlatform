using CustomerLoyaltyPlatform.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CustomerLoyaltyPlatform.Api;

public record GetEarningRulesQuery(Guid ProgramId, Guid TenantId) : IRequest<IEnumerable<EarningRuleDto>>;

public class GetEarningRulesQueryHandler : IRequestHandler<GetEarningRulesQuery, IEnumerable<EarningRuleDto>>
{
    private readonly ICustomerLoyaltyPlatformContext context;
    private readonly ILogger<GetEarningRulesQueryHandler> logger;

    public GetEarningRulesQueryHandler(
        ICustomerLoyaltyPlatformContext context,
        ILogger<GetEarningRulesQueryHandler> logger)
    {
        this.context = context;
        this.logger = logger;
    }

    public async Task<IEnumerable<EarningRuleDto>> Handle(GetEarningRulesQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting earning rules for program {ProgramId}", request.ProgramId);

        var rules = await context.EarningRules
            .AsNoTracking()
            .Where(r => r.ProgramId == request.ProgramId && r.TenantId == request.TenantId)
            .ToListAsync(cancellationToken);

        return rules.Select(r => r.ToDto());
    }
}
