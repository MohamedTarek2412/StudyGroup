using Microsoft.EntityFrameworkCore;
using StudyGroup.API.Data;
using StudyGroup.API.Models;
using StudyGroup.API.Repositories.Interfaces;

namespace StudyGroup.API.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _db;
    public UserRepository(AppDbContext db) => _db = db;

    public Task<User?> GetByIdAsync(Guid id) =>
        _db.Users.Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
                 .FirstOrDefaultAsync(u => u.Id == id);

    public Task<User?> GetByEmailAsync(string email) =>
        _db.Users.Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
                 .FirstOrDefaultAsync(u => u.Email == email.ToLower());

    public Task<List<User>> GetAllAsync() =>
        _db.Users.Include(u => u.UserRoles).ThenInclude(ur => ur.Role).ToListAsync();

    public async Task AddAsync(User user)
    {
        await _db.Users.AddAsync(user);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(User user)
    {
        _db.Users.Update(user);
        await _db.SaveChangesAsync();
    }

    public Task<bool> EmailExistsAsync(string email) =>
        _db.Users.AnyAsync(u => u.Email == email.ToLower());
}