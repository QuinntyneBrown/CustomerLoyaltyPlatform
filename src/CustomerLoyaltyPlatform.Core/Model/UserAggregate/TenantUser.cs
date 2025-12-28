namespace CustomerLoyaltyPlatform.Core;

public class TenantUser
{
    public Guid TenantUserId { get; set; }

    public Guid TenantId { get; set; }

    public Guid UserId { get; set; }

    public TenantRole Role { get; set; }

    public DateTime JoinedAt { get; set; }

    public Guid? InvitationId { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public Tenant Tenant { get; set; } = null!;
}
