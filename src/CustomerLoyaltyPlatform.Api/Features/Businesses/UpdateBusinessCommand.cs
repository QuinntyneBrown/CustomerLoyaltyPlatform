using CustomerLoyaltyPlatform.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CustomerLoyaltyPlatform.Api;

public record UpdateBusinessCommand(
    Guid TenantId,
    Guid BusinessId,
    string BusinessName,
    string OwnerName,
    string Email,
    string Phone,
    AddressDto Address) : IRequest<BusinessDto>;

public class UpdateBusinessCommandHandler : IRequestHandler<UpdateBusinessCommand, BusinessDto>
{
    private readonly ICustomerLoyaltyPlatformContext context;
    private readonly ILogger<UpdateBusinessCommandHandler> logger;

    public UpdateBusinessCommandHandler(
        ICustomerLoyaltyPlatformContext context,
        ILogger<UpdateBusinessCommandHandler> logger)
    {
        this.context = context;
        this.logger = logger;
    }

    public async Task<BusinessDto> Handle(UpdateBusinessCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Updating business {BusinessId} for tenant {TenantId}", request.BusinessId, request.TenantId);

        var business = await context.Businesses
            .FirstOrDefaultAsync(
                b => b.BusinessId == request.BusinessId && b.TenantId == request.TenantId,
                cancellationToken);

        if (business == null)
        {
            logger.LogWarning("Business {BusinessId} not found in tenant {TenantId}", request.BusinessId, request.TenantId);
            throw new InvalidOperationException($"Business with ID '{request.BusinessId}' not found.");
        }

        business.BusinessName = request.BusinessName;
        business.OwnerName = request.OwnerName;
        business.Email = request.Email;
        business.Phone = request.Phone;
        business.Address = new Address
        {
            Street = request.Address.Street,
            City = request.Address.City,
            State = request.Address.State,
            PostalCode = request.Address.PostalCode,
            Country = request.Address.Country,
        };
        business.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Business {BusinessId} updated successfully", business.BusinessId);

        return business.ToDto();
    }
}
