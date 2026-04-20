using Microsoft.AspNetCore.SignalR;
using StudyGroup.API.DTOs.Notifications;
using StudyGroup.API.Hubs;
using StudyGroup.API.Models;
using StudyGroup.API.Repositories.Interfaces;

namespace StudyGroup.API.Services;

public class NotificationService : INotificationService
{
    private readonly INotificationRepository _notifications;
    private readonly IHubContext<NotificationHub> _hubContext;

    public NotificationService(
        INotificationRepository notifications,
        IHubContext<NotificationHub> hubContext)
    {
        _notifications = notifications;
        _hubContext = hubContext;
    }

    public async Task<List<NotificationListItemDto>> GetMyNotificationsAsync(Guid userId)
    {
        var list = await _notifications.GetByUserAsync(userId);
        return list.Select(Map).ToList();
    }

    public async Task MarkAsReadAsync(Guid notificationId, Guid userId)
    {
        var notification = await _notifications.GetByIdAsync(notificationId)
            ?? throw new KeyNotFoundException("Notification not found.");

        if (notification.UserId != userId)
            throw new UnauthorizedAccessException("Not your notification.");

        notification.IsRead = true;
        await _notifications.UpdateAsync(notification);
    }

    public Task MarkAllAsReadAsync(Guid userId) =>
        _notifications.MarkAllReadAsync(userId);

    public async Task CreateNotificationAsync(Guid userId, string message)
    {
        var notification = new Notification
        {
            UserId = userId,
            Message = message,
        };

        await _notifications.AddAsync(notification);

        // Push real-time notification via SignalR
        await _hubContext.Clients
            .Group(userId.ToString())
            .SendAsync("ReceiveNotification", Map(notification));
    }

    private static NotificationListItemDto Map(Notification n) => new(
        n.Id, n.Message, n.IsRead, n.CreatedAt);
}
