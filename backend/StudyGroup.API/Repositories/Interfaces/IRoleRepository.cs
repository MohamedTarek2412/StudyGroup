 using StudyGroup.API.Models;

namespace StudyGroup.API.Repositories.Interfaces;

public interface IRoleRepository
{
    Task<Role?> GetByNameAsync(string name);
}