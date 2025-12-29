namespace CustomerLoyaltyPlatform.Core;

public class TenantInvitation
{
    public Guid InvitationId { get; set; }

    public Guid TenantId { get; set; }

    public string Email { get; set; } = string.Empty;

    public TenantRole Role { get; set; }

    public Guid InvitedBy { get; set; }

    public string Token { get; set; } = string.Empty;

    public DateTime ExpiresAt { get; set; }

    public DateTime? AcceptedAt { get; set; }

    public DateTime InvitedAt { get; set; }

    public InvitationStatus Status { get; set; }

    public Tenant Tenant { get; set; } = null!;
}
