namespace CustomerLoyaltyPlatform.Api;

public record BusinessDto(
    Guid BusinessId,
    Guid TenantId,
    string BusinessName,
    string OwnerName,
    string Email,
    string Phone,
    string BusinessType,
    AddressDto Address,
    string Status,
    bool IsEmailVerified,
    bool IsPhoneVerified,
    bool IsIdentityVerified,
    DateTime RegisteredAt);

public record AddressDto(
    string Street,
    string City,
    string State,
    string PostalCode,
    string Country);
