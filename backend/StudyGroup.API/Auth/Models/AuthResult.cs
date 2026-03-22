 namespace StudyGroup.API.Auth.Models;

public record AuthResult(string AccessToken, string RefreshTokenValue, object User);