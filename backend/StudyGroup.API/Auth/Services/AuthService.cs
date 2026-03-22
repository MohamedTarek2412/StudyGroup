 using StudyGroup.API.Auth.JWT;
using StudyGroup.API.Auth.Models;
using StudyGroup.API.Auth.Password;
using StudyGroup.API.DTOs.Auth;
using StudyGroup.API.Models;
using StudyGroup.API.Repositories.Interfaces;
using Microsoft.Extensions.Options;

namespace StudyGroup.API.Auth.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _users;
    private readonly IRoleRepository _roles;
    private readonly IRefreshTokenRepository _refreshTokens;
    private readonly IPasswordHasher _hasher;
    private readonly IJwtTokenGenerator _jwt;
    private readonly JwtOptions _opts;

    public AuthService(
        IUserRepository users, IRoleRepository roles,
        IRefreshTokenRepository refreshTokens,
        IPasswordHasher hasher, IJwtTokenGenerator jwt,
        IOptions<JwtOptions> opts)
    {
        _users = users; _roles = roles; _refreshTokens = refreshTokens;
        _hasher = hasher; _jwt = jwt; _opts = opts.Value;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto)
    {
        if (await _users.EmailExistsAsync(dto.Email))
            throw new InvalidOperationException("Email already in use.");

        var role = await _roles.GetByNameAsync(dto.Role)
            ?? throw new InvalidOperationException($"Role '{dto.Role}' not found.");

        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email.ToLower(),
            PasswordHash = _hasher.Hash(dto.Password),
            IsApproved = dto.Role != "GroupCreator", // GroupCreators need admin approval
        };
        user.UserRoles.Add(new UserRole { UserId = user.Id, RoleId = role.Id });

        await _users.AddAsync(user);
        return BuildAuthResponse(user, dto.Role);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto dto)
    {
        var user = await _users.GetByEmailAsync(dto.Email)
            ?? throw new UnauthorizedAccessException("Invalid credentials.");

        if (!_hasher.Verify(dto.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid credentials.");

        if (!user.IsApproved)
            throw new UnauthorizedAccessException("Account pending admin approval.");

        var roleName = user.UserRoles.FirstOrDefault()?.Role.Name ?? "Student";
        return BuildAuthResponse(user, roleName);
    }

    public async Task<AuthResponseDto> RefreshAsync(string refreshToken)
    {
        var stored = await _refreshTokens.GetByTokenAsync(refreshToken)
            ?? throw new UnauthorizedAccessException("Invalid refresh token.");

        if (stored.IsRevoked || stored.ExpiresAt < DateTime.UtcNow)
            throw new UnauthorizedAccessException("Refresh token expired or revoked.");

        await _refreshTokens.RevokeAsync(stored);

        var roleName = stored.User.UserRoles.FirstOrDefault()?.Role.Name ?? "Student";
        return BuildAuthResponse(stored.User, roleName);
    }

    public async Task LogoutAsync(string refreshToken)
    {
        var stored = await _refreshTokens.GetByTokenAsync(refreshToken);
        if (stored != null) await _refreshTokens.RevokeAsync(stored);
    }

    private AuthResponseDto BuildAuthResponse(User user, string roleName)
    {
        var accessToken = _jwt.GenerateAccessToken(user, roleName);
        var newRefreshToken = _jwt.GenerateRefreshToken();

        var rt = new RefreshToken
        {
            Token = newRefreshToken,
            UserId = user.Id,
            ExpiresAt = DateTime.UtcNow.AddDays(_opts.RefreshExpiryDays),
        };
        _ = _refreshTokens.AddAsync(rt); // fire-and-forget is fine here

        var profile = new UserProfileDto(user.Id, user.FullName, user.Email, roleName, user.IsApproved);
        return new AuthResponseDto(accessToken, newRefreshToken, profile);
    }
}