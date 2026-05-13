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
        base.OnModelCreating(mb);

        // ── 1. UserRole composite key & relationships ──────────────────
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

        // ── 2. DiscussionMessage Relationships ──────────────────
        mb.Entity<DiscussionMessage>(entity =>
        {
            entity.HasOne(m => m.Group)
                .WithMany(g => g.DiscussionMessages)
                .HasForeignKey(m => m.GroupId)
                .OnDelete(DeleteBehavior.Cascade); 

            entity.HasOne(m => m.Sender)
                .WithMany() 
                .HasForeignKey(m => m.SenderId)
                .OnDelete(DeleteBehavior.NoAction); // حل الـ Cycle هنا
        });

        // ── 3. JoinRequest Relationships ──
        mb.Entity<JoinRequest>(entity =>
        {
            entity.HasOne(jr => jr.Group)
                .WithMany(g => g.JoinRequests)
                .HasForeignKey(jr => jr.GroupId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(jr => jr.User)
                .WithMany(u => u.JoinRequests)
                .HasForeignKey(jr => jr.UserId)
                .OnDelete(DeleteBehavior.NoAction);
        });

        // ── 4. Group Owner Relationship ──────────────────────────────
        mb.Entity<Group>(entity =>
        {
            entity.HasOne(g => g.Owner)
                .WithMany(u => u.OwnedGroups)
                .HasForeignKey(g => g.OwnerId)
                .OnDelete(DeleteBehavior.NoAction);
        });

        // ── 5. Notification Relationships ──────────────────
        mb.Entity<Notification>(entity =>
        {
            entity.HasOne(n => n.User)
                .WithMany()
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.NoAction); 
        });

        // ── 6. Unique email & Seed Roles ────────────────────────────────────
        mb.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        mb.Entity<Role>().HasData(
            new Role { Id = 1, Name = "Admin" },
            new Role { Id = 2, Name = "GroupCreator" },
            new Role { Id = 3, Name = "Student" }
        );

        // ── 7. JoinRequest enum storage ────────────────────────
        mb.Entity<JoinRequest>()
            .Property(j => j.Status)
            .HasConversion<string>();
    }
}