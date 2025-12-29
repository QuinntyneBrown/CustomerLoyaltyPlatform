using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CustomerLoyaltyPlatform.Api;

[ApiController]
[Route("api/tenants/{tenantId:guid}/businesses")]
public class BusinessesController : ControllerBase
{
    private readonly IMediator mediator;
    private readonly ILogger<BusinessesController> logger;

    public BusinessesController(IMediator mediator, ILogger<BusinessesController> logger)
    {
        this.mediator = mediator;
        this.logger = logger;
    }

    [HttpPost]
    public async Task<ActionResult<BusinessDto>> RegisterBusiness(
        Guid tenantId,
        [FromBody] RegisterBusinessRequest request,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("POST /api/tenants/{TenantId}/businesses", tenantId);

        try
        {
            var command = new RegisterBusinessCommand(
                tenantId,
                request.BusinessName,
                request.OwnerName,
                request.Email,
                request.Phone,
                request.BusinessType,
                request.Address);

            var result = await mediator.Send(command, cancellationToken);
            return CreatedAtAction(nameof(GetBusiness), new { tenantId, businessId = result.BusinessId }, result);
        }
        catch (InvalidOperationException ex)
        {
            logger.LogWarning(ex, "Failed to register business");
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BusinessDto>>> GetBusinesses(
        Guid tenantId,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("GET /api/tenants/{TenantId}/businesses", tenantId);

        var result = await mediator.Send(new GetBusinessesQuery(tenantId), cancellationToken);
        return Ok(result);
    }

    [HttpGet("{businessId:guid}")]
    public async Task<ActionResult<BusinessDto>> GetBusiness(
        Guid tenantId,
        Guid businessId,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("GET /api/tenants/{TenantId}/businesses/{BusinessId}", tenantId, businessId);

        var result = await mediator.Send(new GetBusinessQuery(tenantId, businessId), cancellationToken);

        if (result == null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpPut("{businessId:guid}")]
    public async Task<ActionResult<BusinessDto>> UpdateBusiness(
        Guid tenantId,
        Guid businessId,
        [FromBody] UpdateBusinessRequest request,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("PUT /api/tenants/{TenantId}/businesses/{BusinessId}", tenantId, businessId);

        try
        {
            var command = new UpdateBusinessCommand(
                tenantId,
                businessId,
                request.BusinessName,
                request.OwnerName,
                request.Email,
                request.Phone,
                request.Address);

            var result = await mediator.Send(command, cancellationToken);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            logger.LogWarning(ex, "Failed to update business");
            return BadRequest(new { error = ex.Message });
        }
    }
}

public record RegisterBusinessRequest(
    string BusinessName,
    string OwnerName,
    string Email,
    string Phone,
    string BusinessType,
    AddressDto Address);

public record UpdateBusinessRequest(
    string BusinessName,
    string OwnerName,
    string Email,
    string Phone,
    AddressDto Address);
