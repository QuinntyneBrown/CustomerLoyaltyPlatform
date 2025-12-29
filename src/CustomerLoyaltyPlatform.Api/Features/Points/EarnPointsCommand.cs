using CustomerLoyaltyPlatform.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CustomerLoyaltyPlatform.Api;

public record EarnPointsCommand(
    Guid TenantId,
    Guid MemberId,
    Guid ProgramId,
    int PointsAmount,
    string EarningType,
    string Description,
    string? Notes,
    Guid ProcessedBy,
    DateTime? ExpiresAt) : IRequest<PointsTransactionDto>;

public class EarnPointsCommandHandler : IRequestHandler<EarnPointsCommand, PointsTransactionDto>
{
    private readonly ICustomerLoyaltyPlatformContext context;
    private readonly ILogger<EarnPointsCommandHandler> logger;

    public EarnPointsCommandHandler(
        ICustomerLoyaltyPlatformContext context,
        ILogger<EarnPointsCommandHandler> logger)
    {
        this.context = context;
        this.logger = logger;
    }

    public async Task<PointsTransactionDto> Handle(EarnPointsCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation(
            "Earning {PointsAmount} points for member {MemberId}",
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

        var earningType = Enum.TryParse<EarningType>(request.EarningType, out var et) ? et : Core.EarningType.Purchase;

        member.PointsBalance += request.PointsAmount;
        member.LifetimePoints += request.PointsAmount;
        member.LastActivityAt = DateTime.UtcNow;
        member.UpdatedAt = DateTime.UtcNow;

        var transaction = new PointsTransaction
        {
            TransactionId = Guid.NewGuid(),
            TenantId = request.TenantId,
            MemberId = request.MemberId,
            ProgramId = request.ProgramId,
            TransactionType = TransactionType.Earn,
            PointsAmount = request.PointsAmount,
            BalanceAfter = member.PointsBalance,
            EarningType = earningType,
            Description = request.Description,
            Notes = request.Notes,
            ProcessedBy = request.ProcessedBy,
            ExpiresAt = request.ExpiresAt,
            CreatedAt = DateTime.UtcNow,
        };

        context.PointsTransactions.Add(transaction);
        await context.SaveChangesAsync(cancellationToken);

        logger.LogInformation(
            "Points earned: Transaction {TransactionId} created, new balance: {Balance}",
            transaction.TransactionId,
            member.PointsBalance);

        return transaction.ToDto();
    }
}
