using Microsoft.EntityFrameworkCore;
using OrderService.Models;

namespace OrderService.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Order> Orders { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Order>().HasKey(o => o.Id);
            modelBuilder.Entity<Order>().Property(o => o.CustomerName).IsRequired().HasMaxLength(100);
            modelBuilder.Entity<Order>().Property(o => o.TotalAmount).HasColumnType("numeric(18,2)");
            modelBuilder.Entity<Order>().Property(o => o.OrderDate).HasDefaultValueSql("NOW()");
            modelBuilder.Entity<Order>().Property(o => o.Status).IsRequired().HasMaxLength(50).HasDefaultValue("Pending");
        }
    }
}