using Microsoft.EntityFrameworkCore;
using StudyGroup.API.Data;
using StudyGroup.API.Models;
using StudyGroup.API.Repositories.Interfaces;

namespace StudyGroup.API.Repositories;

public class NotificationRepository : INotificationRepository
{
    private readonly AppDbContext _db;
    public NotificationRepository(AppDbContext db) => _db = db;

    public Task<List<Notification>> GetByUserAsync(Guid userId) =>
        _db.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();

    public Task<Notification?> GetByIdAsync(Guid id) =>
        _db.Notifications.FirstOrDefaultAsync(n => n.Id == id);

    public async Task AddAsync(Notification notification)
    {
        await _db.Notifications.AddAsync(notification);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(Notification notification)
    {
        _db.Notifications.Update(notification);
        await _db.SaveChangesAsync();
    }

    public async Task MarkAllReadAsync(Guid userId)
    {
        var unread = await _db.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .ToListAsync();

        foreach (var n in unread)
            n.IsRead = true;

        await _db.SaveChangesAsync();
    }
}
