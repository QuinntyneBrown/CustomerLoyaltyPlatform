using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CustomerLoyaltyPlatform.Api;

[ApiController]
[Route("api/[controller]")]
public class TenantsController : ControllerBase
{
    private readonly IMediator mediator;
    private readonly ILogger<TenantsController> logger;

    public TenantsController(IMediator mediator, ILogger<TenantsController> logger)
    {
        this.mediator = mediator;
        this.logger = logger;
    }

    [HttpPost]
    public async Task<ActionResult<TenantDto>> ProvisionTenant(
        [FromBody] ProvisionTenantCommand command,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("POST /api/tenants - Provisioning tenant");

        try
        {
            var result = await mediator.Send(command, cancellationToken);
            return CreatedAtAction(nameof(GetTenant), new { tenantId = result.TenantId }, result);
        }
        catch (InvalidOperationException ex)
        {
            logger.LogWarning(ex, "Failed to provision tenant");
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("{tenantId:guid}")]
    public async Task<ActionResult<TenantDto>> GetTenant(Guid tenantId, CancellationToken cancellationToken)
    {
        logger.LogInformation("GET /api/tenants/{TenantId}", tenantId);

        var result = await mediator.Send(new GetTenantQuery(tenantId), cancellationToken);

        if (result == null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpPost("{tenantId:guid}/activate")]
    public async Task<ActionResult<TenantDto>> ActivateTenant(Guid tenantId, CancellationToken cancellationToken)
    {
        logger.LogInformation("POST /api/tenants/{TenantId}/activate", tenantId);

        try
        {
            var result = await mediator.Send(new ActivateTenantCommand(tenantId), cancellationToken);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            logger.LogWarning(ex, "Failed to activate tenant {TenantId}", tenantId);
            return BadRequest(new { error = ex.Message });
        }
    }
}
