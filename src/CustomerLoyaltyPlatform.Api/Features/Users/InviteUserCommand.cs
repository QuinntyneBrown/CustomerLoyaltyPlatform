using System.Security.Cryptography;
using CustomerLoyaltyPlatform.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CustomerLoyaltyPlatform.Api;

public record InviteUserCommand(
    Guid TenantId,
    string Email,
    string Role,
    Guid InvitedBy) : IRequest<TenantInvitationDto>;

public class InviteUserCommandHandler : IRequestHandler<InviteUserCommand, TenantInvitationDto>
{
    private readonly ICustomerLoyaltyPlatformContext context;
    private readonly ILogger<InviteUserCommandHandler> logger;

    public InviteUserCommandHandler(
        ICustomerLoyaltyPlatformContext context,
        ILogger<InviteUserCommandHandler> logger)
    {
        this.context = context;
        this.logger = logger;
    }

    public async Task<TenantInvitationDto> Handle(InviteUserCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Inviting user {Email} to tenant {TenantId}", request.Email, request.TenantId);

        var tenant = await context.Tenants
            .FirstOrDefaultAsync(t => t.TenantId == request.TenantId, cancellationToken);

        if (tenant == null)
        {
            logger.LogWarning("Tenant {TenantId} not found", request.TenantId);
            throw new InvalidOperationException($"Tenant with ID '{request.TenantId}' not found.");
        }

        var existingInvitation = await context.TenantInvitations
            .FirstOrDefaultAsync(
                ti => ti.TenantId == request.TenantId &&
                      ti.Email == request.Email &&
                      ti.Status == InvitationStatus.Pending,
                cancellationToken);

        if (existingInvitation != null)
        {
            logger.LogWarning("Pending invitation already exists for {Email} in tenant {TenantId}", request.Email, request.TenantId);
            throw new InvalidOperationException($"A pending invitation already exists for '{request.Email}'.");
        }

        var role = Enum.TryParse<TenantRole>(request.Role, out var r) ? r : TenantRole.Staff;
        var token = GenerateSecureToken();
        var now = DateTime.UtcNow;

        var invitation = new TenantInvitation
        {
            InvitationId = Guid.NewGuid(),
            TenantId = request.TenantId,
            Email = request.Email,
            Role = role,
            InvitedBy = request.InvitedBy,
            Token = token,
            ExpiresAt = now.AddDays(7),
            InvitedAt = now,
            Status = InvitationStatus.Pending,
        };

        context.TenantInvitations.Add(invitation);
        await context.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Invitation {InvitationId} created for {Email}", invitation.InvitationId, request.Email);

        return invitation.ToDto();
    }

    private static string GenerateSecureToken()
    {
        var bytes = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(bytes);
        return Convert.ToBase64String(bytes).Replace("+", "-").Replace("/", "_").TrimEnd('=');
    }
}
