namespace CustomerLoyaltyPlatform.Api;

public record TenantUserDto(
    Guid TenantUserId,
    Guid TenantId,
    Guid UserId,
    string Role,
    DateTime JoinedAt,
    bool IsActive);

public record TenantInvitationDto(
    Guid InvitationId,
    Guid TenantId,
    string Email,
    string Role,
    DateTime ExpiresAt,
    string Status);
