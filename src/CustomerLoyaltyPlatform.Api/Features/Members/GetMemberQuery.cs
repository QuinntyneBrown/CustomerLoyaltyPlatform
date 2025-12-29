using CustomerLoyaltyPlatform.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CustomerLoyaltyPlatform.Api;

public record GetMemberQuery(Guid MemberId, Guid TenantId) : IRequest<MemberDto?>;

public class GetMemberQueryHandler : IRequestHandler<GetMemberQuery, MemberDto?>
{
    private readonly ICustomerLoyaltyPlatformContext context;
    private readonly ILogger<GetMemberQueryHandler> logger;

    public GetMemberQueryHandler(
        ICustomerLoyaltyPlatformContext context,
        ILogger<GetMemberQueryHandler> logger)
    {
        this.context = context;
        this.logger = logger;
    }

    public async Task<MemberDto?> Handle(GetMemberQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting member {MemberId}", request.MemberId);

        var member = await context.Members
            .AsNoTracking()
            .FirstOrDefaultAsync(
                m => m.MemberId == request.MemberId && m.TenantId == request.TenantId,
                cancellationToken);

        return member?.ToDto();
    }
}
