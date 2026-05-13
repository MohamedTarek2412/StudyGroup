 namespace StudyGroup.API.DTOs.JoinRequests;

public record JoinRequestListItemDto(
    Guid Id, Guid GroupId, string GroupName,
    Guid UserId, string UserFullName, string Status, DateTime CreatedAt
);