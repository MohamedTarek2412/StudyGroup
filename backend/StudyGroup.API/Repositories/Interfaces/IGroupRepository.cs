 using StudyGroup.API.Models;

namespace StudyGroup.API.Repositories.Interfaces;

public interface IGroupRepository
{
    Task<Group?> GetByIdAsync(Guid id);
    Task<List<Group>> GetAllApprovedAsync(string? subject, string? search);
    Task<List<Group>> GetByOwnerAsync(Guid ownerId);
    Task<List<Group>> GetPendingAsync();
    Task AddAsync(Group group);
    Task UpdateAsync(Group group);
    Task DeleteAsync(Group group);
}