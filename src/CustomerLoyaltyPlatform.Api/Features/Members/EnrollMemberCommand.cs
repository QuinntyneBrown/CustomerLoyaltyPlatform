using CustomerLoyaltyPlatform.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CustomerLoyaltyPlatform.Api;

public record EnrollMemberCommand(
    Guid TenantId,
    Guid ProgramId,
    Guid BusinessId,
    string FirstName,
    string LastName,
    string? Email,
    string Phone,
    string EnrollmentSource,
    Guid? ReferredByMemberId,
    Guid? EnrolledBy) : IRequest<MemberDto>;

public class EnrollMemberCommandHandler : IRequestHandler<EnrollMemberCommand, MemberDto>
{
    private readonly ICustomerLoyaltyPlatformContext context;
    private readonly ILogger<EnrollMemberCommandHandler> logger;

    public EnrollMemberCommandHandler(
        ICustomerLoyaltyPlatformContext context,
        ILogger<EnrollMemberCommandHandler> logger)
    {
        this.context = context;
        this.logger = logger;
    }

    public async Task<MemberDto> Handle(EnrollMemberCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation(
            "Enrolling member {FirstName} {LastName} in program {ProgramId}",
            request.FirstName,
            request.LastName,
            request.ProgramId);

        var program = await context.LoyaltyPrograms
            .FirstOrDefaultAsync(
                p => p.ProgramId == request.ProgramId && p.TenantId == request.TenantId,
                cancellationToken);

        if (program == null)
        {
            logger.LogWarning("Program {ProgramId} not found in tenant {TenantId}", request.ProgramId, request.TenantId);
            throw new InvalidOperationException($"Loyalty program with ID '{request.ProgramId}' not found.");
        }

        var enrollmentSource = Enum.TryParse<EnrollmentSource>(request.EnrollmentSource, out var es)
            ? es
            : Core.EnrollmentSource.InStore;

        var now = DateTime.UtcNow;

        var member = new Member
        {
            MemberId = Guid.NewGuid(),
            TenantId = request.TenantId,
            ProgramId = request.ProgramId,
            BusinessId = request.BusinessId,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            Phone = request.Phone,
            EnrollmentSource = enrollmentSource,
            ReferredByMemberId = request.ReferredByMemberId,
            EnrolledBy = request.EnrolledBy,
            Status = MemberStatus.Active,
            PointsBalance = 0,
            LifetimePoints = 0,
            EnrolledAt = now,
            LastActivityAt = now,
            CreatedAt = now,
            UpdatedAt = now,
        };

        context.Members.Add(member);
        await context.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Member {MemberId} enrolled successfully", member.MemberId);

        return member.ToDto();
    }
}
