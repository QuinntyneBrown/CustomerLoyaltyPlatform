using CustomerLoyaltyPlatform.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CustomerLoyaltyPlatform.Api;

public record ProvisionTenantCommand(
    string TenantName,
    string TenantSlug,
    string PrimaryContactEmail,
    string PrimaryContactName,
    string? PlanType,
    string? DataRegion) : IRequest<TenantDto>;

public class ProvisionTenantCommandHandler : IRequestHandler<ProvisionTenantCommand, TenantDto>
{
    private readonly ICustomerLoyaltyPlatformContext context;
    private readonly ILogger<ProvisionTenantCommandHandler> logger;

    public ProvisionTenantCommandHandler(
        ICustomerLoyaltyPlatformContext context,
        ILogger<ProvisionTenantCommandHandler> logger)
    {
        this.context = context;
        this.logger = logger;
    }

    public async Task<TenantDto> Handle(ProvisionTenantCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Provisioning new tenant with slug {TenantSlug}", request.TenantSlug);

        var existingTenant = await context.Tenants
            .FirstOrDefaultAsync(t => t.TenantSlug == request.TenantSlug, cancellationToken);

        if (existingTenant != null)
        {
            logger.LogWarning("Tenant with slug {TenantSlug} already exists", request.TenantSlug);
            throw new InvalidOperationException($"Tenant with slug '{request.TenantSlug}' already exists.");
        }

        var planType = Enum.TryParse<PlanType>(request.PlanType, out var pt) ? pt : Core.PlanType.Free;
        var now = DateTime.UtcNow;

        var tenant = new Tenant
        {
            TenantId = Guid.NewGuid(),
            TenantName = request.TenantName,
            TenantSlug = request.TenantSlug,
            PrimaryContactEmail = request.PrimaryContactEmail,
            PrimaryContactName = request.PrimaryContactName,
            PlanType = planType,
            DataRegion = request.DataRegion ?? "US",
            IsolationLevel = Core.IsolationLevel.Shared,
            Status = TenantStatus.Provisioned,
            ProvisionedAt = now,
            CreatedAt = now,
            UpdatedAt = now,
        };

        context.Tenants.Add(tenant);
        await context.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Tenant {TenantId} provisioned successfully", tenant.TenantId);

        return tenant.ToDto();
    }
}
