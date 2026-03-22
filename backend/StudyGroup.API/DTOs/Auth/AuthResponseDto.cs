 namespace StudyGroup.API.DTOs.Auth;

public record AuthResponseDto(
    string AccessToken,
    string RefreshToken,
    UserProfileDto User
);