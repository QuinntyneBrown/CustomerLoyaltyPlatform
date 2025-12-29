using CustomerLoyaltyPlatform.Core;

namespace CustomerLoyaltyPlatform.Api;

public static class MemberExtensions
{
    public static MemberDto ToDto(this Member member)
    {
        return new MemberDto(
            member.MemberId,
            member.TenantId,
            member.ProgramId,
            member.BusinessId,
            member.FirstName,
            member.LastName,
            member.Email,
            member.Phone,
            member.EnrollmentSource.ToString(),
            member.ReferredByMemberId,
            member.Status.ToString(),
            member.PointsBalance,
            member.LifetimePoints,
            member.EnrolledAt,
            member.LastActivityAt);
    }
}
