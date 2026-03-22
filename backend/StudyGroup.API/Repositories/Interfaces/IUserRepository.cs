 using StudyGroup.API.Models;

namespace StudyGroup.API.Repositories.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id);
    Task<User?> GetByEmailAsync(string email);
    Task<List<User>> GetAllAsync();
    Task AddAsync(User user);
    Task UpdateAsync(User user);
    Task<bool> EmailExistsAsync(string email);
}