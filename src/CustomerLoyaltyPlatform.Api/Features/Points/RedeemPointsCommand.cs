using CustomerLoyaltyPlatform.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CustomerLoyaltyPlatform.Api;

public record RedeemPointsCommand(
    Guid TenantId,
    Guid MemberId,
    Guid ProgramId,
    int PointsAmount,
    Guid? RewardId,
    string Description,
    string? Notes,
    Guid ProcessedBy) : IRequest<PointsTransactionDto>;

public class RedeemPointsCommandHandler : IRequestHandler<RedeemPointsCommand, PointsTransactionDto>
{
    private readonly ICustomerLoyaltyPlatformContext context;
    private readonly ILogger<RedeemPointsCommandHandler> logger;

    public RedeemPointsCommandHandler(
        ICustomerLoyaltyPlatformContext context,
        ILogger<RedeemPointsCommandHandler> logger)
    {
        this.context = context;
        this.logger = logger;
    }

    public async Task<PointsTransactionDto> Handle(RedeemPointsCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation(
            "Redeeming {PointsAmount} points for member {MemberId}",
            request.PointsAmount,
            request.MemberId);

        var member = await context.Members
            .FirstOrDefaultAsync(
                m => m.MemberId == request.MemberId && m.TenantId == request.TenantId,
                cancellationToken);

        if (member == null)
        {
            logger.LogWarning("Member {MemberId} not found in tenant {TenantId}", request.MemberId, request.TenantId);
            throw new InvalidOperationException($"Member with ID '{request.MemberId}' not found.");
        }

        if (member.Status != MemberStatus.Active)
        {
            logger.LogWarning("Member {MemberId} is not active", request.MemberId);
            throw new InvalidOperationException($"Member '{request.MemberId}' is not active.");
        }

        if (member.PointsBalance < request.PointsAmount)
        {
            logger.LogWarning(
                "Insufficient points for member {MemberId}. Balance: {Balance}, Requested: {Requested}",
                request.MemberId,
                member.PointsBalance,
                request.PointsAmount);
            throw new InvalidOperationException($"Insufficient points. Balance: {member.PointsBalance}, Requested: {request.PointsAmount}");
        }

        member.PointsBalance -= request.PointsAmount;
        member.LastActivityAt = DateTime.UtcNow;
        member.UpdatedAt = DateTime.UtcNow;

        var transaction = new PointsTransaction
        {
            TransactionId = Guid.NewGuid(),
            TenantId = request.TenantId,
            MemberId = request.MemberId,
            ProgramId = request.ProgramId,
            TransactionType = TransactionType.Redeem,
            PointsAmount = -request.PointsAmount,
            BalanceAfter = member.PointsBalance,
            RewardId = request.RewardId,
            Description = request.Description,
            Notes = request.Notes,
            ProcessedBy = request.ProcessedBy,
            CreatedAt = DateTime.UtcNow,
        };

        context.PointsTransactions.Add(transaction);
        await context.SaveChangesAsync(cancellationToken);

        logger.LogInformation(
            "Points redeemed: Transaction {TransactionId} created, new balance: {Balance}",
            transaction.TransactionId,
            member.PointsBalance);

        return transaction.ToDto();
    }
}
