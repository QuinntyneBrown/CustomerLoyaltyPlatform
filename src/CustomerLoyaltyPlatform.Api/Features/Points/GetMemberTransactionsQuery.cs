using CustomerLoyaltyPlatform.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CustomerLoyaltyPlatform.Api;

public record GetMemberTransactionsQuery(Guid MemberId, Guid TenantId) : IRequest<IEnumerable<PointsTransactionDto>>;

public class GetMemberTransactionsQueryHandler : IRequestHandler<GetMemberTransactionsQuery, IEnumerable<PointsTransactionDto>>
{
    private readonly ICustomerLoyaltyPlatformContext context;
    private readonly ILogger<GetMemberTransactionsQueryHandler> logger;

    public GetMemberTransactionsQueryHandler(
        ICustomerLoyaltyPlatformContext context,
        ILogger<GetMemberTransactionsQueryHandler> logger)
    {
        this.context = context;
        this.logger = logger;
    }

    public async Task<IEnumerable<PointsTransactionDto>> Handle(
        GetMemberTransactionsQuery request,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Getting transactions for member {MemberId}", request.MemberId);

        var transactions = await context.PointsTransactions
            .AsNoTracking()
            .Where(t => t.MemberId == request.MemberId && t.TenantId == request.TenantId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync(cancellationToken);

        return transactions.Select(t => t.ToDto());
    }
}
