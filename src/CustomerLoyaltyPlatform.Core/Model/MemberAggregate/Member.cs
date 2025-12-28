namespace CustomerLoyaltyPlatform.Core;

public class Member
{
    public Guid MemberId { get; set; }

    public Guid TenantId { get; set; }

    public Guid ProgramId { get; set; }

    public Guid BusinessId { get; set; }

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string? Email { get; set; }

    public string Phone { get; set; } = string.Empty;

    public EnrollmentSource EnrollmentSource { get; set; }

    public Guid? ReferredByMemberId { get; set; }

    public Guid? EnrolledBy { get; set; }

    public MemberStatus Status { get; set; }

    public int PointsBalance { get; set; }

    public int LifetimePoints { get; set; }

    public DateTime EnrolledAt { get; set; }

    public DateTime? LastActivityAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public Tenant Tenant { get; set; } = null!;

    public LoyaltyProgram Program { get; set; } = null!;

    public Business Business { get; set; } = null!;

    public Member? ReferredByMember { get; set; }

    public ICollection<PointsTransaction> PointsTransactions { get; set; } = new List<PointsTransaction>();
}
