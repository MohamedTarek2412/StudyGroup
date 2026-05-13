using StudyGroup.API.Models;

namespace StudyGroup.API.Repositories.Interfaces;

public interface INotificationRepository
{
    Task<List<Notification>> GetByUserAsync(Guid userId);
    Task<Notification?> GetByIdAsync(Guid id);
    Task AddAsync(Notification notification);
    Task AddRangeAsync(IEnumerable<Notification> notifications);
    Task UpdateAsync(Notification notification);
    Task MarkAllReadAsync(Guid userId);
} 
