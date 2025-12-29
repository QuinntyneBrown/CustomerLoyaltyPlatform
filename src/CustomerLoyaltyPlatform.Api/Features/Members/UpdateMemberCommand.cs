using CustomerLoyaltyPlatform.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CustomerLoyaltyPlatform.Api;

public record UpdateMemberCommand(
    Guid MemberId,
    Guid TenantId,
    string FirstName,
    string LastName,
    string? Email,
    string Phone) : IRequest<MemberDto>;

public class UpdateMemberCommandHandler : IRequestHandler<UpdateMemberCommand, MemberDto>
{
    private readonly ICustomerLoyaltyPlatformContext context;
    private readonly ILogger<UpdateMemberCommandHandler> logger;

    public UpdateMemberCommandHandler(
        ICustomerLoyaltyPlatformContext context,
        ILogger<UpdateMemberCommandHandler> logger)
    {
        this.context = context;
        this.logger = logger;
    }

    public async Task<MemberDto> Handle(UpdateMemberCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Updating member {MemberId}", request.MemberId);

        var member = await context.Members
            .FirstOrDefaultAsync(
                m => m.MemberId == request.MemberId && m.TenantId == request.TenantId,
                cancellationToken);

        if (member == null)
        {
            logger.LogWarning("Member {MemberId} not found in tenant {TenantId}", request.MemberId, request.TenantId);
            throw new InvalidOperationException($"Member with ID '{request.MemberId}' not found.");
        }

        member.FirstName = request.FirstName;
        member.LastName = request.LastName;
        member.Email = request.Email;
        member.Phone = request.Phone;
        member.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Member {MemberId} updated successfully", member.MemberId);

        return member.ToDto();
    }
}
