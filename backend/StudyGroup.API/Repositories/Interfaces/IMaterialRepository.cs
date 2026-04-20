using StudyGroup.API.Models;

namespace StudyGroup.API.Repositories.Interfaces;

public interface IMaterialRepository
{
    Task<Material?> GetByIdAsync(Guid id);
    Task<List<Material>> GetByGroupAsync(Guid groupId);
    Task AddAsync(Material material);
    Task DeleteAsync(Material material);
}
