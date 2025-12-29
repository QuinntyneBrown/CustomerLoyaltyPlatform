using CustomerLoyaltyPlatform.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CustomerLoyaltyPlatform.Api;

public record GetProgramsQuery(Guid TenantId) : IRequest<IEnumerable<LoyaltyProgramDto>>;

public class GetProgramsQueryHandler : IRequestHandler<GetProgramsQuery, IEnumerable<LoyaltyProgramDto>>
{
    private readonly ICustomerLoyaltyPlatformContext context;
    private readonly ILogger<GetProgramsQueryHandler> logger;

    public GetProgramsQueryHandler(
        ICustomerLoyaltyPlatformContext context,
        ILogger<GetProgramsQueryHandler> logger)
    {
        this.context = context;
        this.logger = logger;
    }

    public async Task<IEnumerable<LoyaltyProgramDto>> Handle(GetProgramsQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting programs for tenant {TenantId}", request.TenantId);

        var programs = await context.LoyaltyPrograms
            .AsNoTracking()
            .Where(p => p.TenantId == request.TenantId)
            .ToListAsync(cancellationToken);

        return programs.Select(p => p.ToDto());
    }
}
