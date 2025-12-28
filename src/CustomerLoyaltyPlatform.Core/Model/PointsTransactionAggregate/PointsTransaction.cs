namespace CustomerLoyaltyPlatform.Core;

public class PointsTransaction
{
    public Guid TransactionId { get; set; }

    public Guid TenantId { get; set; }

    public Guid MemberId { get; set; }

    public Guid ProgramId { get; set; }

    public TransactionType TransactionType { get; set; }

    public int PointsAmount { get; set; }

    public int BalanceAfter { get; set; }

    public EarningType? EarningType { get; set; }

    public Guid? RewardId { get; set; }

    public Guid? SourceTransactionId { get; set; }

    public string Description { get; set; } = string.Empty;

    public string? Notes { get; set; }

    public Guid ProcessedBy { get; set; }

    public DateTime? ExpiresAt { get; set; }

    public DateTime? ExpiredAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public Member Member { get; set; } = null!;
}
