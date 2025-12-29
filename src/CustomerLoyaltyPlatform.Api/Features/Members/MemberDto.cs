namespace CustomerLoyaltyPlatform.Api;

public record MemberDto(
    Guid MemberId,
    Guid TenantId,
    Guid ProgramId,
    Guid BusinessId,
    string FirstName,
    string LastName,
    string? Email,
    string Phone,
    string EnrollmentSource,
    Guid? ReferredByMemberId,
    string Status,
    int PointsBalance,
    int LifetimePoints,
    DateTime EnrolledAt,
    DateTime? LastActivityAt);
