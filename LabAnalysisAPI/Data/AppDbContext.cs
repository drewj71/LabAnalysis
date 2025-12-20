using LabAnalysisAPI.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace LabAnalysisAPI.Data
{
    public class AppDbContext : IdentityDbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Allergy> Allergies { get; set; } = null!;
        public DbSet<UserAllergy> UserAllergies { get; set; } = null!;

        public DbSet<Condition> Conditions { get; set; } = null!;
        public DbSet<UserCondition> UserConditions { get; set; } = null!;

        public DbSet<Medication> Medications { get; set; } = null!;
        public DbSet<UserMedication> UserMedications { get; set; } = null!;

        public DbSet<LabReport> LabReports { get; set; } = null!;
        public DbSet<Lab> Labs { get; set; } = null!;
        public DbSet<UserLabResult> UserLabResults { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<UserAllergy>()
                .HasKey(ua => new { ua.UserId, ua.AllergyId });

            builder.Entity<UserAllergy>()
                .HasOne(ua => ua.User)
                .WithMany()
                .HasForeignKey(ua => ua.UserId);

            builder.Entity<UserAllergy>()
                .HasOne(ua => ua.Allergy)
                .WithMany()
                .HasForeignKey(ua => ua.AllergyId);

            builder.Entity<UserCondition>()
                .HasKey(uc => new { uc.UserId, uc.ConditionId });

            builder.Entity<UserCondition>()
                .HasOne(uc => uc.User)
                .WithMany()
                .HasForeignKey(uc => uc.UserId);

            builder.Entity<UserCondition>()
                .HasOne(uc => uc.Condition)
                .WithMany()
                .HasForeignKey(uc => uc.ConditionId);

            builder.Entity<UserMedication>()
                .HasKey(um => new { um.UserId, um.MedicationId });

            builder.Entity<UserMedication>()
                .HasOne(um => um.User)
                .WithMany()
                .HasForeignKey(um => um.UserId);

            builder.Entity<UserMedication>()
                .HasOne(um => um.Medication)
                .WithMany()
                .HasForeignKey(um => um.MedicationId);

            // LabReport → User
            builder.Entity<LabReport>()
                .HasOne(lr => lr.User)
                .WithMany()
                .HasForeignKey(lr => lr.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // UserLabResult → User
            builder.Entity<UserLabResult>()
                .HasOne(ulr => ulr.User)
                .WithMany()
                .HasForeignKey(ulr => ulr.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // UserLabResult → Lab
            builder.Entity<UserLabResult>()
                .HasOne(ulr => ulr.Lab)
                .WithMany(l => l.UserLabResults)
                .HasForeignKey(ulr => ulr.LabId)
                .OnDelete(DeleteBehavior.Cascade);

            // UserLabResult → LabReport
            builder.Entity<UserLabResult>()
                .HasOne(ulr => ulr.LabReport)
                .WithMany(lr => lr.UserLabResults)
                .HasForeignKey(ulr => ulr.LabReportId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
