using CustomerLoyaltyPlatform.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CustomerLoyaltyPlatform.Infrastructure;

public class EarningRuleConfiguration : IEntityTypeConfiguration<EarningRule>
{
    public void Configure(EntityTypeBuilder<EarningRule> builder)
    {
        builder.ToTable("EarningRules");

        builder.HasKey(er => er.EarningRuleId);

        builder.Property(er => er.RuleType)
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(er => er.SpendThreshold)
            .HasPrecision(18, 2);

        builder.Property(er => er.ApplicableCategories)
            .HasMaxLength(2000);
    }
}
