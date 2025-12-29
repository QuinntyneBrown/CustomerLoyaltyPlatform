using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CustomerLoyaltyPlatform.Api;

[ApiController]
[Route("api/members")]
public class MembersController : ControllerBase
{
    private readonly IMediator mediator;
    private readonly ILogger<MembersController> logger;

    public MembersController(IMediator mediator, ILogger<MembersController> logger)
    {
        this.mediator = mediator;
        this.logger = logger;
    }

    [HttpPost]
    public async Task<ActionResult<MemberDto>> EnrollMember(
        [FromBody] EnrollMemberRequest request,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("POST /api/members - Enrolling member");

        try
        {
            var command = new EnrollMemberCommand(
                request.TenantId,
                request.ProgramId,
                request.BusinessId,
                request.FirstName,
                request.LastName,
                request.Email,
                request.Phone,
                request.EnrollmentSource,
                request.ReferredByMemberId,
                request.EnrolledBy);

            var result = await mediator.Send(command, cancellationToken);
            return CreatedAtAction(nameof(GetMember), new { memberId = result.MemberId }, result);
        }
        catch (InvalidOperationException ex)
        {
            logger.LogWarning(ex, "Failed to enroll member");
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetMembers(
        [FromQuery] Guid tenantId,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("GET /api/members for tenant {TenantId}", tenantId);

        var result = await mediator.Send(new GetMembersQuery(tenantId), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{memberId:guid}")]
    public async Task<ActionResult<MemberDto>> GetMember(
        Guid memberId,
        [FromQuery] Guid tenantId,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("GET /api/members/{MemberId}", memberId);

        var result = await mediator.Send(new GetMemberQuery(memberId, tenantId), cancellationToken);

        if (result == null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpPut("{memberId:guid}")]
    public async Task<ActionResult<MemberDto>> UpdateMember(
        Guid memberId,
        [FromBody] UpdateMemberRequest request,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("PUT /api/members/{MemberId}", memberId);

        try
        {
            var command = new UpdateMemberCommand(
                memberId,
                request.TenantId,
                request.FirstName,
                request.LastName,
                request.Email,
                request.Phone);

            var result = await mediator.Send(command, cancellationToken);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            logger.LogWarning(ex, "Failed to update member");
            return BadRequest(new { error = ex.Message });
        }
    }
}

public record EnrollMemberRequest(
    Guid TenantId,
    Guid ProgramId,
    Guid BusinessId,
    string FirstName,
    string LastName,
    string? Email,
    string Phone,
    string EnrollmentSource,
    Guid? ReferredByMemberId,
    Guid? EnrolledBy);

public record UpdateMemberRequest(
    Guid TenantId,
    string FirstName,
    string LastName,
    string? Email,
    string Phone);
