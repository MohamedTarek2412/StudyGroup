namespace StudyGroup.API.DTOs.Groups;

public record MemberDto(
    Guid UserId,
    string FullName,
    string Email,
    DateTime JoinedAt
);
