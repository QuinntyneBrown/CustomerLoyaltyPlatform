using CustomerLoyaltyPlatform.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CustomerLoyaltyPlatform.Infrastructure;

public class LoyaltyProgramConfiguration : IEntityTypeConfiguration<LoyaltyProgram>
{
    public void Configure(EntityTypeBuilder<LoyaltyProgram> builder)
    {
        builder.ToTable("LoyaltyPrograms");

        builder.HasKey(lp => lp.ProgramId);

        builder.Property(lp => lp.ProgramName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(lp => lp.PointsName)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(lp => lp.ProgramType)
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.HasMany(lp => lp.EarningRules)
            .WithOne(er => er.Program)
            .HasForeignKey(er => er.ProgramId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
