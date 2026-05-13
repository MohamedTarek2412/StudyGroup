namespace StudyGroup.API.DTOs.Discussions;

public record MessageListItemDto(
    Guid Id,
    string Content,
    DateTime SentAt,
    Guid SenderId,
    string SenderName,
    Guid GroupId
); 
