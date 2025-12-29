using CustomerLoyaltyPlatform.Core;

namespace CustomerLoyaltyPlatform.Api;

public static class UserExtensions
{
    public static TenantUserDto ToDto(this TenantUser user)
    {
        return new TenantUserDto(
            user.TenantUserId,
            user.TenantId,
            user.UserId,
            user.Role.ToString(),
            user.JoinedAt,
            user.IsActive);
    }

    public static TenantInvitationDto ToDto(this TenantInvitation invitation)
    {
        return new TenantInvitationDto(
            invitation.InvitationId,
            invitation.TenantId,
            invitation.Email,
            invitation.Role.ToString(),
            invitation.ExpiresAt,
            invitation.Status.ToString());
    }
}
