using CustomerLoyaltyPlatform.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CustomerLoyaltyPlatform.Api;

public record GetBusinessesQuery(Guid TenantId) : IRequest<IEnumerable<BusinessDto>>;

public class GetBusinessesQueryHandler : IRequestHandler<GetBusinessesQuery, IEnumerable<BusinessDto>>
{
    private readonly ICustomerLoyaltyPlatformContext context;
    private readonly ILogger<GetBusinessesQueryHandler> logger;

    public GetBusinessesQueryHandler(
        ICustomerLoyaltyPlatformContext context,
        ILogger<GetBusinessesQueryHandler> logger)
    {
        this.context = context;
        this.logger = logger;
    }

    public async Task<IEnumerable<BusinessDto>> Handle(GetBusinessesQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting businesses for tenant {TenantId}", request.TenantId);

        var businesses = await context.Businesses
            .AsNoTracking()
            .Where(b => b.TenantId == request.TenantId)
            .ToListAsync(cancellationToken);

        return businesses.Select(b => b.ToDto());
    }
}
