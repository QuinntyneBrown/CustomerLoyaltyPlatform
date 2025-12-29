using CustomerLoyaltyPlatform.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CustomerLoyaltyPlatform.Infrastructure;

public class TenantInvitationConfiguration : IEntityTypeConfiguration<TenantInvitation>
{
    public void Configure(EntityTypeBuilder<TenantInvitation> builder)
    {
        builder.ToTable("TenantInvitations");

        builder.HasKey(ti => ti.InvitationId);

        builder.Property(ti => ti.Email)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(ti => ti.Token)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(ti => ti.Role)
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(ti => ti.Status)
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.HasOne(ti => ti.Tenant)
            .WithMany()
            .HasForeignKey(ti => ti.TenantId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(ti => ti.Token)
            .IsUnique();

        builder.HasIndex(ti => new { ti.TenantId, ti.Email });
    }
}
