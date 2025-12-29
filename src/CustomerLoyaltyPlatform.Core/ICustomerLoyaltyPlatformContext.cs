using Microsoft.EntityFrameworkCore;

namespace CustomerLoyaltyPlatform.Core;

public interface ICustomerLoyaltyPlatformContext
{
    DbSet<Tenant> Tenants { get; }

    DbSet<TenantUser> TenantUsers { get; }

    DbSet<TenantInvitation> TenantInvitations { get; }

    DbSet<Business> Businesses { get; }

    DbSet<Member> Members { get; }

    DbSet<LoyaltyProgram> LoyaltyPrograms { get; }

    DbSet<EarningRule> EarningRules { get; }

    DbSet<PointsTransaction> PointsTransactions { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
