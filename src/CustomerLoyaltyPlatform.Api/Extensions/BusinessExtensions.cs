using CustomerLoyaltyPlatform.Core;

namespace CustomerLoyaltyPlatform.Api;

public static class BusinessExtensions
{
    public static BusinessDto ToDto(this Business business)
    {
        return new BusinessDto(
            business.BusinessId,
            business.TenantId,
            business.BusinessName,
            business.OwnerName,
            business.Email,
            business.Phone,
            business.BusinessType.ToString(),
            business.Address.ToDto(),
            business.Status.ToString(),
            business.IsEmailVerified,
            business.IsPhoneVerified,
            business.IsIdentityVerified,
            business.RegisteredAt);
    }

    public static AddressDto ToDto(this Address address)
    {
        return new AddressDto(
            address.Street,
            address.City,
            address.State,
            address.PostalCode,
            address.Country);
    }
}
