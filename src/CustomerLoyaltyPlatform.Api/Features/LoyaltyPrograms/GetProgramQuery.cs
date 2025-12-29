using CustomerLoyaltyPlatform.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CustomerLoyaltyPlatform.Api;

public record GetProgramQuery(Guid ProgramId, Guid TenantId) : IRequest<LoyaltyProgramDto?>;

public class GetProgramQueryHandler : IRequestHandler<GetProgramQuery, LoyaltyProgramDto?>
{
    private readonly ICustomerLoyaltyPlatformContext context;
    private readonly ILogger<GetProgramQueryHandler> logger;

    public GetProgramQueryHandler(
        ICustomerLoyaltyPlatformContext context,
        ILogger<GetProgramQueryHandler> logger)
    {
        this.context = context;
        this.logger = logger;
    }

    public async Task<LoyaltyProgramDto?> Handle(GetProgramQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting program {ProgramId}", request.ProgramId);

        var program = await context.LoyaltyPrograms
            .AsNoTracking()
            .FirstOrDefaultAsync(
                p => p.ProgramId == request.ProgramId && p.TenantId == request.TenantId,
                cancellationToken);

        return program?.ToDto();
    }
}
