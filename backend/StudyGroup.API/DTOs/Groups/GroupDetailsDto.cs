 namespace StudyGroup.API.DTOs.Groups;

public record GroupDetailsDto(
    Guid Id, string Name, string Subject, string Description,
    int MaxMembers, bool IsApproved, string OwnerName, Guid OwnerId, DateTime CreatedAt,
    int MemberCount
);