 namespace StudyGroup.API.DTOs.Groups;

public record GroupListItemDto(
    Guid Id, string Name, string Subject, string Description,
    int MaxMembers, bool IsApproved, string OwnerName, DateTime CreatedAt
);