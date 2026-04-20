using StudyGroup.API.Models;

namespace StudyGroup.API.Repositories.Interfaces;

public interface IDiscussionRepository
{
    Task<List<DiscussionMessage>> GetByGroupAsync(Guid groupId, int skip, int take);
    Task<DiscussionMessage?> GetByIdAsync(Guid id);
    Task AddAsync(DiscussionMessage message);
    Task DeleteAsync(DiscussionMessage message);
}
