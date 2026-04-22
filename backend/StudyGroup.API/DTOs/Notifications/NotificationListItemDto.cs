namespace StudyGroup.API.DTOs.Notifications;

public record NotificationListItemDto(
    Guid Id,
    string Message,
    bool IsRead,
    DateTime CreatedAt
);
