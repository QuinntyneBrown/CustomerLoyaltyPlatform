using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CustomerLoyaltyPlatform.Api;

[ApiController]
[Route("api/points")]
public class PointsController : ControllerBase
{
    private readonly IMediator mediator;
    private readonly ILogger<PointsController> logger;

    public PointsController(IMediator mediator, ILogger<PointsController> logger)
    {
        this.mediator = mediator;
        this.logger = logger;
    }

    [HttpPost("earn")]
    public async Task<ActionResult<PointsTransactionDto>> EarnPoints(
        [FromBody] EarnPointsRequest request,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("POST /api/points/earn");

        try
        {
            var command = new EarnPointsCommand(
                request.TenantId,
                request.MemberId,
                request.ProgramId,
                request.PointsAmount,
                request.EarningType,
                request.Description,
                request.Notes,
                request.ProcessedBy,
                request.ExpiresAt);

            var result = await mediator.Send(command, cancellationToken);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            logger.LogWarning(ex, "Failed to earn points");
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("redeem")]
    public async Task<ActionResult<PointsTransactionDto>> RedeemPoints(
        [FromBody] RedeemPointsRequest request,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("POST /api/points/redeem");

        try
        {
            var command = new RedeemPointsCommand(
                request.TenantId,
                request.MemberId,
                request.ProgramId,
                request.PointsAmount,
                request.RewardId,
                request.Description,
                request.Notes,
                request.ProcessedBy);

            var result = await mediator.Send(command, cancellationToken);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            logger.LogWarning(ex, "Failed to redeem points");
            return BadRequest(new { error = ex.Message });
        }
    }
}

[ApiController]
[Route("api/members")]
public class MemberPointsController : ControllerBase
{
    private readonly IMediator mediator;
    private readonly ILogger<MemberPointsController> logger;

    public MemberPointsController(IMediator mediator, ILogger<MemberPointsController> logger)
    {
        this.mediator = mediator;
        this.logger = logger;
    }

    [HttpGet("{memberId:guid}/transactions")]
    public async Task<ActionResult<IEnumerable<PointsTransactionDto>>> GetMemberTransactions(
        Guid memberId,
        [FromQuery] Guid tenantId,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("GET /api/members/{MemberId}/transactions", memberId);

        var result = await mediator.Send(new GetMemberTransactionsQuery(memberId, tenantId), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{memberId:guid}/points/balance")]
    public async Task<ActionResult<PointsBalanceDto>> GetMemberPointsBalance(
        Guid memberId,
        [FromQuery] Guid tenantId,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("GET /api/members/{MemberId}/points/balance", memberId);

        var result = await mediator.Send(new GetMemberPointsBalanceQuery(memberId, tenantId), cancellationToken);

        if (result == null)
        {
            return NotFound();
        }

        return Ok(result);
    }
}

public record EarnPointsRequest(
    Guid TenantId,
    Guid MemberId,
    Guid ProgramId,
    int PointsAmount,
    string EarningType,
    string Description,
    string? Notes,
    Guid ProcessedBy,
    DateTime? ExpiresAt);

public record RedeemPointsRequest(
    Guid TenantId,
    Guid MemberId,
    Guid ProgramId,
    int PointsAmount,
    Guid? RewardId,
    string Description,
    string? Notes,
    Guid ProcessedBy);
