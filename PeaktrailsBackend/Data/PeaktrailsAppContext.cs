using Microsoft.EntityFrameworkCore;
using PeaktrailsBackend.Data.Entities;

namespace PeaktrailsBackend.Data
{
    public class PeaktrailsAppContext : DbContext
    {
        public PeaktrailsAppContext(DbContextOptions<PeaktrailsAppContext> options) : base(options)
        {
        }

        public DbSet<Trail> Trails { get; set; }
        public DbSet<Photo> TrailPhotos { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Photo>()
                .HasOne<Trail>()
                .WithMany()  // Assuming one-to-many relationship
                .HasForeignKey(p => p.TrailId)
                .IsRequired();
        }
    }
}
