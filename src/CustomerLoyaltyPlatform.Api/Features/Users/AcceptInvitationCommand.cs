using CustomerLoyaltyPlatform.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CustomerLoyaltyPlatform.Api;

public record AcceptInvitationCommand(string Token, Guid UserId) : IRequest<TenantUserDto>;

public class AcceptInvitationCommandHandler : IRequestHandler<AcceptInvitationCommand, TenantUserDto>
{
    private readonly ICustomerLoyaltyPlatformContext context;
    private readonly ILogger<AcceptInvitationCommandHandler> logger;

    public AcceptInvitationCommandHandler(
        ICustomerLoyaltyPlatformContext context,
        ILogger<AcceptInvitationCommandHandler> logger)
    {
        this.context = context;
        this.logger = logger;
    }

    public async Task<TenantUserDto> Handle(AcceptInvitationCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Processing invitation acceptance for token");

        var invitation = await context.TenantInvitations
            .FirstOrDefaultAsync(ti => ti.Token == request.Token, cancellationToken);

        if (invitation == null)
        {
            logger.LogWarning("Invitation with token not found");
            throw new InvalidOperationException("Invalid invitation token.");
        }

        if (invitation.Status != InvitationStatus.Pending)
        {
            logger.LogWarning("Invitation {InvitationId} is not pending, status: {Status}", invitation.InvitationId, invitation.Status);
            throw new InvalidOperationException($"Invitation is no longer valid. Status: {invitation.Status}.");
        }

        if (invitation.ExpiresAt < DateTime.UtcNow)
        {
            invitation.Status = InvitationStatus.Expired;
            await context.SaveChangesAsync(cancellationToken);

            logger.LogWarning("Invitation {InvitationId} has expired", invitation.InvitationId);
            throw new InvalidOperationException("Invitation has expired.");
        }

        var existingUser = await context.TenantUsers
            .FirstOrDefaultAsync(
                tu => tu.TenantId == invitation.TenantId && tu.UserId == request.UserId,
                cancellationToken);

        if (existingUser != null)
        {
            logger.LogWarning("User {UserId} is already a member of tenant {TenantId}", request.UserId, invitation.TenantId);
            throw new InvalidOperationException("User is already a member of this tenant.");
        }

        var now = DateTime.UtcNow;

        var tenantUser = new TenantUser
        {
            TenantUserId = Guid.NewGuid(),
            TenantId = invitation.TenantId,
            UserId = request.UserId,
            Role = invitation.Role,
            JoinedAt = now,
            InvitationId = invitation.InvitationId,
            IsActive = true,
            CreatedAt = now,
            UpdatedAt = now,
        };

        invitation.Status = InvitationStatus.Accepted;
        invitation.AcceptedAt = now;

        context.TenantUsers.Add(tenantUser);
        await context.SaveChangesAsync(cancellationToken);

        logger.LogInformation("User {UserId} joined tenant {TenantId} as {Role}", request.UserId, invitation.TenantId, invitation.Role);

        return tenantUser.ToDto();
    }
}
