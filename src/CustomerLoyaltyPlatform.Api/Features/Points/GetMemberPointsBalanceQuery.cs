using CustomerLoyaltyPlatform.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CustomerLoyaltyPlatform.Api;

public record GetMemberPointsBalanceQuery(Guid MemberId, Guid TenantId) : IRequest<PointsBalanceDto?>;

public class GetMemberPointsBalanceQueryHandler : IRequestHandler<GetMemberPointsBalanceQuery, PointsBalanceDto?>
{
    private readonly ICustomerLoyaltyPlatformContext context;
    private readonly ILogger<GetMemberPointsBalanceQueryHandler> logger;

    public GetMemberPointsBalanceQueryHandler(
        ICustomerLoyaltyPlatformContext context,
        ILogger<GetMemberPointsBalanceQueryHandler> logger)
    {
        this.context = context;
        this.logger = logger;
    }

    public async Task<PointsBalanceDto?> Handle(GetMemberPointsBalanceQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting points balance for member {MemberId}", request.MemberId);

        var member = await context.Members
            .AsNoTracking()
            .FirstOrDefaultAsync(
                m => m.MemberId == request.MemberId && m.TenantId == request.TenantId,
                cancellationToken);

        if (member == null)
        {
            return null;
        }

        return new PointsBalanceDto(member.MemberId, member.PointsBalance, member.LifetimePoints);
    }
}
