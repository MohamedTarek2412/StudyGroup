 using StudyGroup.API.Models;

namespace StudyGroup.API.Repositories.Interfaces;

public interface IJoinRequestRepository
{
    Task<JoinRequest?> GetByIdAsync(Guid id);
    Task<JoinRequest?> GetByUserAndGroupAsync(Guid userId, Guid groupId);
    Task<List<JoinRequest>> GetByGroupAsync(Guid groupId);
    Task<List<JoinRequest>> GetByUserAsync(Guid userId);
    Task AddAsync(JoinRequest request);
    Task UpdateAsync(JoinRequest request);
}