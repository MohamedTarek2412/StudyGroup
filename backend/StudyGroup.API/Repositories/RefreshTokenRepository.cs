using Microsoft.EntityFrameworkCore;
using StudyGroup.API.Auth.Models;
using StudyGroup.API.Data;
using StudyGroup.API.Repositories.Interfaces;

namespace StudyGroup.API.Repositories;

public class RefreshTokenRepository : IRefreshTokenRepository
{
    private readonly AppDbContext _db;
    public RefreshTokenRepository(AppDbContext db) => _db = db;

    public Task<RefreshToken?> GetByTokenAsync(string token) =>
        _db.RefreshTokens.Include(rt => rt.User)
                         .ThenInclude(u => u.UserRoles).ThenInclude(ur => ur.Role)
                         .FirstOrDefaultAsync(rt => rt.Token == token);

    public async Task AddAsync(RefreshToken token)
    {
        await _db.RefreshTokens.AddAsync(token);
        await _db.SaveChangesAsync();
    }

    public async Task RevokeAsync(RefreshToken token)
    {
        token.IsRevoked = true;
        await _db.SaveChangesAsync();
    }

    public async Task RevokeAllForUserAsync(Guid userId)
    {
        var tokens = await _db.RefreshTokens
            .Where(rt => rt.UserId == userId && !rt.IsRevoked)
            .ToListAsync();
        tokens.ForEach(t => t.IsRevoked = true);
        await _db.SaveChangesAsync();
    }
}