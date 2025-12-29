using CustomerLoyaltyPlatform.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CustomerLoyaltyPlatform.Infrastructure;

public class MemberConfiguration : IEntityTypeConfiguration<Member>
{
    public void Configure(EntityTypeBuilder<Member> builder)
    {
        builder.ToTable("Members");

        builder.HasKey(m => m.MemberId);

        builder.Property(m => m.FirstName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(m => m.LastName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(m => m.Email)
            .HasMaxLength(256);

        builder.Property(m => m.Phone)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(m => m.EnrollmentSource)
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(m => m.Status)
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.HasOne(m => m.Program)
            .WithMany(lp => lp.Members)
            .HasForeignKey(m => m.ProgramId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(m => m.ReferredByMember)
            .WithMany()
            .HasForeignKey(m => m.ReferredByMemberId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(m => m.PointsTransactions)
            .WithOne(pt => pt.Member)
            .HasForeignKey(pt => pt.MemberId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(m => new { m.TenantId, m.Phone });
        builder.HasIndex(m => new { m.TenantId, m.Email });
    }
}
