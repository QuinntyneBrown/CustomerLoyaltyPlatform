using CustomerLoyaltyPlatform.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CustomerLoyaltyPlatform.Api;

public record GetBusinessQuery(Guid TenantId, Guid BusinessId) : IRequest<BusinessDto?>;

public class GetBusinessQueryHandler : IRequestHandler<GetBusinessQuery, BusinessDto?>
{
    private readonly ICustomerLoyaltyPlatformContext context;
    private readonly ILogger<GetBusinessQueryHandler> logger;

    public GetBusinessQueryHandler(
        ICustomerLoyaltyPlatformContext context,
        ILogger<GetBusinessQueryHandler> logger)
    {
        this.context = context;
        this.logger = logger;
    }

    public async Task<BusinessDto?> Handle(GetBusinessQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting business {BusinessId} for tenant {TenantId}", request.BusinessId, request.TenantId);

        var business = await context.Businesses
            .AsNoTracking()
            .FirstOrDefaultAsync(
                b => b.BusinessId == request.BusinessId && b.TenantId == request.TenantId,
                cancellationToken);

        return business?.ToDto();
    }
}
