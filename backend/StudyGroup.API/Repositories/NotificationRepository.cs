using Microsoft.EntityFrameworkCore;
using StudyGroup.API.Data;
using StudyGroup.API.Models;
using StudyGroup.API.Repositories.Generic;
using StudyGroup.API.Repositories.Interfaces;

namespace StudyGroup.API.Repositories;

public class NotificationRepository : ReadRepository<Notification>, INotificationRepository
{
    public NotificationRepository(AppDbContext db) : base(db) { }

    public Task<List<Notification>> GetByUserAsync(Guid userId) =>
        Db.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();

    public Task<Notification?> GetByIdAsync(Guid id) =>
        Db.Notifications.FirstOrDefaultAsync(n => n.Id == id);

    public async Task AddAsync(Notification notification)
    {
        await Db.Notifications.AddAsync(notification);
        await Db.SaveChangesAsync();
    }

    public async Task AddRangeAsync(IEnumerable<Notification> notifications)
    {
        await Db.Notifications.AddRangeAsync(notifications);
        await Db.SaveChangesAsync();
    }

    public async Task UpdateAsync(Notification notification)
    {
        Db.Notifications.Update(notification);
        await Db.SaveChangesAsync();
    }

    public async Task MarkAllReadAsync(Guid userId)
    {
        var unread = await Db.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .ToListAsync();

        foreach (var n in unread)
            n.IsRead = true;

        await Db.SaveChangesAsync();
    }
} 
