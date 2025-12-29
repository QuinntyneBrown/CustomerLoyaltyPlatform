using CustomerLoyaltyPlatform.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CustomerLoyaltyPlatform.Infrastructure;

public class TenantConfiguration : IEntityTypeConfiguration<Tenant>
{
    public void Configure(EntityTypeBuilder<Tenant> builder)
    {
        builder.ToTable("Tenants");

        builder.HasKey(t => t.TenantId);

        builder.Property(t => t.TenantName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(t => t.TenantSlug)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(t => t.TenantSlug)
            .IsUnique();

        builder.Property(t => t.PrimaryContactEmail)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(t => t.PrimaryContactName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(t => t.DataRegion)
            .HasMaxLength(50);

        builder.Property(t => t.PlanType)
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(t => t.IsolationLevel)
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(t => t.Status)
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.HasMany(t => t.Businesses)
            .WithOne(b => b.Tenant)
            .HasForeignKey(b => b.TenantId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(t => t.Users)
            .WithOne(u => u.Tenant)
            .HasForeignKey(u => u.TenantId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(t => t.LoyaltyPrograms)
            .WithOne(lp => lp.Tenant)
            .HasForeignKey(lp => lp.TenantId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(t => t.Members)
            .WithOne(m => m.Tenant)
            .HasForeignKey(m => m.TenantId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
