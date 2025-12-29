using CustomerLoyaltyPlatform.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CustomerLoyaltyPlatform.Api;

public record RegisterBusinessCommand(
    Guid TenantId,
    string BusinessName,
    string OwnerName,
    string Email,
    string Phone,
    string BusinessType,
    AddressDto Address) : IRequest<BusinessDto>;

public class RegisterBusinessCommandHandler : IRequestHandler<RegisterBusinessCommand, BusinessDto>
{
    private readonly ICustomerLoyaltyPlatformContext context;
    private readonly ILogger<RegisterBusinessCommandHandler> logger;

    public RegisterBusinessCommandHandler(
        ICustomerLoyaltyPlatformContext context,
        ILogger<RegisterBusinessCommandHandler> logger)
    {
        this.context = context;
        this.logger = logger;
    }

    public async Task<BusinessDto> Handle(RegisterBusinessCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Registering business {BusinessName} for tenant {TenantId}", request.BusinessName, request.TenantId);

        var tenant = await context.Tenants
            .FirstOrDefaultAsync(t => t.TenantId == request.TenantId, cancellationToken);

        if (tenant == null)
        {
            logger.LogWarning("Tenant {TenantId} not found", request.TenantId);
            throw new InvalidOperationException($"Tenant with ID '{request.TenantId}' not found.");
        }

        var businessType = Enum.TryParse<BusinessType>(request.BusinessType, out var bt) ? bt : Core.BusinessType.Retail;
        var now = DateTime.UtcNow;

        var business = new Business
        {
            BusinessId = Guid.NewGuid(),
            TenantId = request.TenantId,
            BusinessName = request.BusinessName,
            OwnerName = request.OwnerName,
            Email = request.Email,
            Phone = request.Phone,
            BusinessType = businessType,
            Address = new Address
            {
                Street = request.Address.Street,
                City = request.Address.City,
                State = request.Address.State,
                PostalCode = request.Address.PostalCode,
                Country = request.Address.Country,
            },
            Status = BusinessStatus.Active,
            IsEmailVerified = false,
            IsPhoneVerified = false,
            IsIdentityVerified = false,
            RegisteredAt = now,
            CreatedAt = now,
            UpdatedAt = now,
        };

        context.Businesses.Add(business);
        await context.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Business {BusinessId} registered successfully", business.BusinessId);

        return business.ToDto();
    }
}
