using StudyGroup.API.Auth.Models;

namespace StudyGroup.API.Repositories.Interfaces;

public interface IRefreshTokenRepository
{
    Task<RefreshToken?> GetByTokenAsync(string token);
    Task AddAsync(RefreshToken token);
    Task RevokeAsync(RefreshToken token);
    Task RevokeAllForUserAsync(Guid userId);
}