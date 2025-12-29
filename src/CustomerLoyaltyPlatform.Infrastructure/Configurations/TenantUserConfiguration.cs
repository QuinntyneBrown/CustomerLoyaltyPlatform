using CustomerLoyaltyPlatform.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CustomerLoyaltyPlatform.Infrastructure;

public class TenantUserConfiguration : IEntityTypeConfiguration<TenantUser>
{
    public void Configure(EntityTypeBuilder<TenantUser> builder)
    {
        builder.ToTable("TenantUsers");

        builder.HasKey(tu => tu.TenantUserId);

        builder.Property(tu => tu.Role)
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.HasIndex(tu => new { tu.TenantId, tu.UserId })
            .IsUnique();
    }
}
