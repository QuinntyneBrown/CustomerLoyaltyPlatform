using CustomerLoyaltyPlatform.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CustomerLoyaltyPlatform.Api;

public record GetMembersQuery(Guid TenantId) : IRequest<IEnumerable<MemberDto>>;

public class GetMembersQueryHandler : IRequestHandler<GetMembersQuery, IEnumerable<MemberDto>>
{
    private readonly ICustomerLoyaltyPlatformContext context;
    private readonly ILogger<GetMembersQueryHandler> logger;

    public GetMembersQueryHandler(
        ICustomerLoyaltyPlatformContext context,
        ILogger<GetMembersQueryHandler> logger)
    {
        this.context = context;
        this.logger = logger;
    }

    public async Task<IEnumerable<MemberDto>> Handle(GetMembersQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting members for tenant {TenantId}", request.TenantId);

        var members = await context.Members
            .AsNoTracking()
            .Where(m => m.TenantId == request.TenantId)
            .ToListAsync(cancellationToken);

        return members.Select(m => m.ToDto());
    }
}
