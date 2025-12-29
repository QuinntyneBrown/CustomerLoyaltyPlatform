using CustomerLoyaltyPlatform.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CustomerLoyaltyPlatform.Infrastructure;

public class BusinessConfiguration : IEntityTypeConfiguration<Business>
{
    public void Configure(EntityTypeBuilder<Business> builder)
    {
        builder.ToTable("Businesses");

        builder.HasKey(b => b.BusinessId);

        builder.Property(b => b.BusinessName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(b => b.OwnerName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(b => b.Email)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(b => b.Phone)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(b => b.BusinessType)
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(b => b.Status)
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.OwnsOne(b => b.Address, address =>
        {
            address.Property(a => a.Street).HasMaxLength(500).HasColumnName("Street");
            address.Property(a => a.City).HasMaxLength(100).HasColumnName("City");
            address.Property(a => a.State).HasMaxLength(100).HasColumnName("State");
            address.Property(a => a.PostalCode).HasMaxLength(20).HasColumnName("PostalCode");
            address.Property(a => a.Country).HasMaxLength(100).HasColumnName("Country");
        });

        builder.HasMany(b => b.LoyaltyPrograms)
            .WithOne(lp => lp.Business)
            .HasForeignKey(lp => lp.BusinessId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(b => b.Members)
            .WithOne(m => m.Business)
            .HasForeignKey(m => m.BusinessId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
