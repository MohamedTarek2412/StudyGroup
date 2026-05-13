using StudyGroup.API.DTOs.Notifications;

namespace StudyGroup.API.Services;

public interface INotificationService
{
    Task<List<NotificationListItemDto>> GetMyNotificationsAsync(Guid userId);
    Task MarkAsReadAsync(Guid notificationId, Guid userId);
    Task MarkAllAsReadAsync(Guid userId);
    Task CreateNotificationAsync(Guid userId, string message);
    Task BroadcastNotificationAsync(string message);
} 
