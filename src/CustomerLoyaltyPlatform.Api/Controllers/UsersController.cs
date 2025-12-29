using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CustomerLoyaltyPlatform.Api;

[ApiController]
[Route("api")]
public class UsersController : ControllerBase
{
    private readonly IMediator mediator;
    private readonly ILogger<UsersController> logger;

    public UsersController(IMediator mediator, ILogger<UsersController> logger)
    {
        this.mediator = mediator;
        this.logger = logger;
    }

    [HttpPost("tenants/{tenantId:guid}/users/invite")]
    public async Task<ActionResult<TenantInvitationDto>> InviteUser(
        Guid tenantId,
        [FromBody] InviteUserRequest request,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("POST /api/tenants/{TenantId}/users/invite", tenantId);

        try
        {
            var command = new InviteUserCommand(tenantId, request.Email, request.Role, request.InvitedBy);
            var result = await mediator.Send(command, cancellationToken);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            logger.LogWarning(ex, "Failed to invite user to tenant {TenantId}", tenantId);
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("invitations/{token}/accept")]
    public async Task<ActionResult<TenantUserDto>> AcceptInvitation(
        string token,
        [FromBody] AcceptInvitationRequest request,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("POST /api/invitations/accept");

        try
        {
            var command = new AcceptInvitationCommand(token, request.UserId);
            var result = await mediator.Send(command, cancellationToken);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            logger.LogWarning(ex, "Failed to accept invitation");
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("tenants/{tenantId:guid}/users")]
    public async Task<ActionResult<IEnumerable<TenantUserDto>>> GetTenantUsers(
        Guid tenantId,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("GET /api/tenants/{TenantId}/users", tenantId);

        var result = await mediator.Send(new GetTenantUsersQuery(tenantId), cancellationToken);
        return Ok(result);
    }
}

public record InviteUserRequest(string Email, string Role, Guid InvitedBy);

public record AcceptInvitationRequest(Guid UserId);
