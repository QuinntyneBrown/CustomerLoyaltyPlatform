using CustomerLoyaltyPlatform.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CustomerLoyaltyPlatform.Api;

public record ActivateTenantCommand(Guid TenantId) : IRequest<TenantDto>;

public class ActivateTenantCommandHandler : IRequestHandler<ActivateTenantCommand, TenantDto>
{
    private readonly ICustomerLoyaltyPlatformContext context;
    private readonly ILogger<ActivateTenantCommandHandler> logger;

    public ActivateTenantCommandHandler(
        ICustomerLoyaltyPlatformContext context,
        ILogger<ActivateTenantCommandHandler> logger)
    {
        this.context = context;
        this.logger = logger;
    }

    public async Task<TenantDto> Handle(ActivateTenantCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Activating tenant {TenantId}", request.TenantId);

        var tenant = await context.Tenants
            .FirstOrDefaultAsync(t => t.TenantId == request.TenantId, cancellationToken);

        if (tenant == null)
        {
            logger.LogWarning("Tenant {TenantId} not found", request.TenantId);
            throw new InvalidOperationException($"Tenant with ID '{request.TenantId}' not found.");
        }

        if (tenant.Status == TenantStatus.Active)
        {
            logger.LogWarning("Tenant {TenantId} is already active", request.TenantId);
            throw new InvalidOperationException($"Tenant '{request.TenantId}' is already active.");
        }

        tenant.Status = TenantStatus.Active;
        tenant.ActivatedAt = DateTime.UtcNow;
        tenant.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Tenant {TenantId} activated successfully", request.TenantId);

        return tenant.ToDto();
    }
}
