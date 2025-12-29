using CustomerLoyaltyPlatform.Core;

namespace CustomerLoyaltyPlatform.Api;

public static class PointsTransactionExtensions
{
    public static PointsTransactionDto ToDto(this PointsTransaction transaction)
    {
        return new PointsTransactionDto(
            transaction.TransactionId,
            transaction.TenantId,
            transaction.MemberId,
            transaction.ProgramId,
            transaction.TransactionType.ToString(),
            transaction.PointsAmount,
            transaction.BalanceAfter,
            transaction.EarningType?.ToString(),
            transaction.Description,
            transaction.Notes,
            transaction.ProcessedBy,
            transaction.ExpiresAt,
            transaction.CreatedAt);
    }
}
