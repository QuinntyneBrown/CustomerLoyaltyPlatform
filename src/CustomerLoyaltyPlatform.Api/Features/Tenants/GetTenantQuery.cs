using CustomerLoyaltyPlatform.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CustomerLoyaltyPlatform.Api;

public record GetTenantQuery(Guid TenantId) : IRequest<TenantDto?>;

public class GetTenantQueryHandler : IRequestHandler<GetTenantQuery, TenantDto?>
{
    private readonly ICustomerLoyaltyPlatformContext context;
    private readonly ILogger<GetTenantQueryHandler> logger;

    public GetTenantQueryHandler(
        ICustomerLoyaltyPlatformContext context,
        ILogger<GetTenantQueryHandler> logger)
    {
        this.context = context;
        this.logger = logger;
    }

    public async Task<TenantDto?> Handle(GetTenantQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting tenant {TenantId}", request.TenantId);

        var tenant = await context.Tenants
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.TenantId == request.TenantId, cancellationToken);

        return tenant?.ToDto();
    }
}
