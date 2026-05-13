 namespace StudyGroup.API.DTOs.Notifications;

public record NotificationDto(
    Guid Id,
    string Message,
    bool IsRead,
    DateTime CreatedAt
);
