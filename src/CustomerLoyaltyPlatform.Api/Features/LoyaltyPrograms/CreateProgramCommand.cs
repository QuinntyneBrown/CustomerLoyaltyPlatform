using CustomerLoyaltyPlatform.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CustomerLoyaltyPlatform.Api;

public record CreateProgramCommand(
    Guid TenantId,
    Guid BusinessId,
    string ProgramName,
    string ProgramType,
    string PointsName,
    Guid CreatedBy) : IRequest<LoyaltyProgramDto>;

public class CreateProgramCommandHandler : IRequestHandler<CreateProgramCommand, LoyaltyProgramDto>
{
    private readonly ICustomerLoyaltyPlatformContext context;
    private readonly ILogger<CreateProgramCommandHandler> logger;

    public CreateProgramCommandHandler(
        ICustomerLoyaltyPlatformContext context,
        ILogger<CreateProgramCommandHandler> logger)
    {
        this.context = context;
        this.logger = logger;
    }

    public async Task<LoyaltyProgramDto> Handle(CreateProgramCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation(
            "Creating loyalty program {ProgramName} for business {BusinessId}",
            request.ProgramName,
            request.BusinessId);

        var business = await context.Businesses
            .FirstOrDefaultAsync(
                b => b.BusinessId == request.BusinessId && b.TenantId == request.TenantId,
                cancellationToken);

        if (business == null)
        {
            logger.LogWarning("Business {BusinessId} not found in tenant {TenantId}", request.BusinessId, request.TenantId);
            throw new InvalidOperationException($"Business with ID '{request.BusinessId}' not found.");
        }

        var programType = Enum.TryParse<ProgramType>(request.ProgramType, out var pt) ? pt : Core.ProgramType.PointsBased;
        var now = DateTime.UtcNow;

        var program = new LoyaltyProgram
        {
            ProgramId = Guid.NewGuid(),
            TenantId = request.TenantId,
            BusinessId = request.BusinessId,
            ProgramName = request.ProgramName,
            ProgramType = programType,
            PointsName = request.PointsName,
            IsActive = true,
            CreatedBy = request.CreatedBy,
            CreatedAt = now,
            UpdatedAt = now,
        };

        context.LoyaltyPrograms.Add(program);
        await context.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Loyalty program {ProgramId} created successfully", program.ProgramId);

        return program.ToDto();
    }
}
