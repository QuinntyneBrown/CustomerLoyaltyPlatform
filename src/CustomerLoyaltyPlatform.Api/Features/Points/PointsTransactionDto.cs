namespace CustomerLoyaltyPlatform.Api;

public record PointsTransactionDto(
    Guid TransactionId,
    Guid TenantId,
    Guid MemberId,
    Guid ProgramId,
    string TransactionType,
    int PointsAmount,
    int BalanceAfter,
    string? EarningType,
    string Description,
    string? Notes,
    Guid ProcessedBy,
    DateTime? ExpiresAt,
    DateTime CreatedAt);

public record PointsBalanceDto(
    Guid MemberId,
    int PointsBalance,
    int LifetimePoints);
