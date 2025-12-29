using CustomerLoyaltyPlatform.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CustomerLoyaltyPlatform.Api;

public record GetTenantUsersQuery(Guid TenantId) : IRequest<IEnumerable<TenantUserDto>>;

public class GetTenantUsersQueryHandler : IRequestHandler<GetTenantUsersQuery, IEnumerable<TenantUserDto>>
{
    private readonly ICustomerLoyaltyPlatformContext context;
    private readonly ILogger<GetTenantUsersQueryHandler> logger;

    public GetTenantUsersQueryHandler(
        ICustomerLoyaltyPlatformContext context,
        ILogger<GetTenantUsersQueryHandler> logger)
    {
        this.context = context;
        this.logger = logger;
    }

    public async Task<IEnumerable<TenantUserDto>> Handle(GetTenantUsersQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting users for tenant {TenantId}", request.TenantId);

        var users = await context.TenantUsers
            .AsNoTracking()
            .Where(tu => tu.TenantId == request.TenantId)
            .ToListAsync(cancellationToken);

        return users.Select(u => u.ToDto());
    }
}
