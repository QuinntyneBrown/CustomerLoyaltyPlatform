using CustomerLoyaltyPlatform.Core;
using Microsoft.EntityFrameworkCore;

namespace CustomerLoyaltyPlatform.Infrastructure;

public class CustomerLoyaltyPlatformContext : DbContext, ICustomerLoyaltyPlatformContext
{
    public CustomerLoyaltyPlatformContext(DbContextOptions<CustomerLoyaltyPlatformContext> options)
        : base(options)
    {
    }

    public DbSet<Tenant> Tenants => Set<Tenant>();

    public DbSet<TenantUser> TenantUsers => Set<TenantUser>();

    public DbSet<TenantInvitation> TenantInvitations => Set<TenantInvitation>();

    public DbSet<Business> Businesses => Set<Business>();

    public DbSet<Member> Members => Set<Member>();

    public DbSet<LoyaltyProgram> LoyaltyPrograms => Set<LoyaltyProgram>();

    public DbSet<EarningRule> EarningRules => Set<EarningRule>();

    public DbSet<PointsTransaction> PointsTransactions => Set<PointsTransaction>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(CustomerLoyaltyPlatformContext).Assembly);
    }
}
