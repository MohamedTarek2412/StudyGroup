 namespace StudyGroup.API.DTOs.Auth;

public record UserProfileDto(
    Guid Id,
    string FullName,
    string Email,
    string Role,
    bool IsApproved
);