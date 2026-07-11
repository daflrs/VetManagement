using Microsoft.EntityFrameworkCore;
using VetManagement.Models;

namespace VetManagement.Data
{
    public class VetManagementDbContext : DbContext
    {
        public VetManagementDbContext(
            DbContextOptions<VetManagementDbContext> options) 
            : base(options)
        {
        }

        public DbSet<Owner> Owners => Set<Owner>();
        public DbSet<Pet> Pets => Set<Pet>();
        public DbSet<Appointment> Appointments => Set<Appointment>();
        public DbSet<MedicalRecord> MedicalRecords => Set<MedicalRecord>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Appointment>(entity =>
            {
                entity.Property(a => a.Status)
                    .HasConversion<string>();

                entity.Property(a => a.Type)
                    .HasConversion<string>();

                entity.Property(a => a.DurationMinutes)
                    .HasDefaultValue(30);
            });

            modelBuilder.Entity<MedicalRecord>(entity =>
            {
                entity.HasOne(m => m.Appointment)
                    .WithOne(a => a.MedicalRecord)
                    .HasForeignKey<MedicalRecord>(m => m.AppointmentId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(m => m.Pet)
                    .WithMany(p => p.MedicalRecords)
                    .HasForeignKey(m => m.PetId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}
