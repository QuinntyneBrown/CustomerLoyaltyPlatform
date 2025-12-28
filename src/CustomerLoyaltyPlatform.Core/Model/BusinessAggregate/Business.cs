namespace CustomerLoyaltyPlatform.Core;

public class Business
{
    public Guid BusinessId { get; set; }

    public Guid TenantId { get; set; }

    public string BusinessName { get; set; } = string.Empty;

    public string OwnerName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public BusinessType BusinessType { get; set; }

    public Address Address { get; set; } = new Address();

    public BusinessStatus Status { get; set; }

    public bool IsEmailVerified { get; set; }

    public bool IsPhoneVerified { get; set; }

    public bool IsIdentityVerified { get; set; }

    public DateTime RegisteredAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public Tenant Tenant { get; set; } = null!;

    public ICollection<LoyaltyProgram> LoyaltyPrograms { get; set; } = new List<LoyaltyProgram>();

    public ICollection<Member> Members { get; set; } = new List<Member>();
}
