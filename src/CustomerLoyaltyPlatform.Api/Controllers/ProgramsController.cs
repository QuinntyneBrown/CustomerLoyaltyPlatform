using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CustomerLoyaltyPlatform.Api;

[ApiController]
[Route("api/programs")]
public class ProgramsController : ControllerBase
{
    private readonly IMediator mediator;
    private readonly ILogger<ProgramsController> logger;

    public ProgramsController(IMediator mediator, ILogger<ProgramsController> logger)
    {
        this.mediator = mediator;
        this.logger = logger;
    }

    [HttpPost]
    public async Task<ActionResult<LoyaltyProgramDto>> CreateProgram(
        [FromBody] CreateProgramRequest request,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("POST /api/programs - Creating program");

        try
        {
            var command = new CreateProgramCommand(
                request.TenantId,
                request.BusinessId,
                request.ProgramName,
                request.ProgramType,
                request.PointsName,
                request.CreatedBy);

            var result = await mediator.Send(command, cancellationToken);
            return CreatedAtAction(nameof(GetProgram), new { programId = result.ProgramId }, result);
        }
        catch (InvalidOperationException ex)
        {
            logger.LogWarning(ex, "Failed to create program");
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<LoyaltyProgramDto>>> GetPrograms(
        [FromQuery] Guid tenantId,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("GET /api/programs for tenant {TenantId}", tenantId);

        var result = await mediator.Send(new GetProgramsQuery(tenantId), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{programId:guid}")]
    public async Task<ActionResult<LoyaltyProgramDto>> GetProgram(
        Guid programId,
        [FromQuery] Guid tenantId,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("GET /api/programs/{ProgramId}", programId);

        var result = await mediator.Send(new GetProgramQuery(programId, tenantId), cancellationToken);

        if (result == null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpPost("{programId:guid}/earning-rules")]
    public async Task<ActionResult<EarningRuleDto>> ConfigureEarningRule(
        Guid programId,
        [FromBody] ConfigureEarningRuleRequest request,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("POST /api/programs/{ProgramId}/earning-rules", programId);

        try
        {
            var command = new ConfigureEarningRuleCommand(
                request.TenantId,
                programId,
                request.RuleType,
                request.PointsAmount,
                request.SpendThreshold,
                request.ApplicableCategories,
                request.EffectiveFrom,
                request.EffectiveTo,
                request.ConfiguredBy);

            var result = await mediator.Send(command, cancellationToken);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            logger.LogWarning(ex, "Failed to configure earning rule");
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("{programId:guid}/earning-rules")]
    public async Task<ActionResult<IEnumerable<EarningRuleDto>>> GetEarningRules(
        Guid programId,
        [FromQuery] Guid tenantId,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("GET /api/programs/{ProgramId}/earning-rules", programId);

        var result = await mediator.Send(new GetEarningRulesQuery(programId, tenantId), cancellationToken);
        return Ok(result);
    }
}

public record CreateProgramRequest(
    Guid TenantId,
    Guid BusinessId,
    string ProgramName,
    string ProgramType,
    string PointsName,
    Guid CreatedBy);

public record ConfigureEarningRuleRequest(
    Guid TenantId,
    string RuleType,
    int PointsAmount,
    decimal? SpendThreshold,
    string? ApplicableCategories,
    DateTime EffectiveFrom,
    DateTime? EffectiveTo,
    Guid ConfiguredBy);
