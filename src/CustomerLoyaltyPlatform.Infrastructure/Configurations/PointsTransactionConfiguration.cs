using CustomerLoyaltyPlatform.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CustomerLoyaltyPlatform.Infrastructure;

public class PointsTransactionConfiguration : IEntityTypeConfiguration<PointsTransaction>
{
    public void Configure(EntityTypeBuilder<PointsTransaction> builder)
    {
        builder.ToTable("PointsTransactions");

        builder.HasKey(pt => pt.TransactionId);

        builder.Property(pt => pt.TransactionType)
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(pt => pt.EarningType)
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(pt => pt.Description)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(pt => pt.Notes)
            .HasMaxLength(1000);

        builder.HasIndex(pt => new { pt.TenantId, pt.MemberId });
        builder.HasIndex(pt => new { pt.TenantId, pt.ProgramId });
    }
}
