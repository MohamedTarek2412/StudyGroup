using StudyGroup.API.Models;

namespace StudyGroup.API.Auth.JWT;

public interface IJwtTokenGenerator
{
    string GenerateAccessToken(User user, string role);
    string GenerateRefreshToken();
}
