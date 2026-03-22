 using Microsoft.EntityFrameworkCore;
using StudyGroup.API.Auth.Models;
using StudyGroup.API.Models;

namespace StudyGroup.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Group> Groups => Set<Group>();
    public DbSet<JoinRequest> JoinRequests => Set<JoinRequest>();
    public DbSet<Material> Materials => Set<Material>();
    public DbSet<DiscussionMessage> DiscussionMessages => Set<DiscussionMessage>();
    public DbSet<Notification> Notifications => Set<Notification>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        // ── UserRole composite key ──────────────────────────
        mb.Entity<UserRole>()
            .HasKey(ur => new { ur.UserId, ur.RoleId });

        mb.Entity<UserRole>()
            .HasOne(ur => ur.User)
            .WithMany(u => u.UserRoles)
            .HasForeignKey(ur => ur.UserId);

        mb.Entity<UserRole>()
            .HasOne(ur => ur.Role)
            .WithMany(r => r.UserRoles)
            .HasForeignKey(ur => ur.RoleId);

        // ── Unique email ────────────────────────────────────
        mb.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // ── Seed roles ──────────────────────────────────────
        mb.Entity<Role>().HasData(
            new Role { Id = 1, Name = "Admin" },
            new Role { Id = 2, Name = "GroupCreator" },
            new Role { Id = 3, Name = "Student" }
        );

        // ── JoinRequest enum storage ────────────────────────
        mb.Entity<JoinRequest>()
            .Property(j => j.Status)
            .HasConversion<string>();
    }
}