using StudyGroup.API.DTOs.Discussions;

namespace StudyGroup.API.Services;

public interface IDiscussionService
{
    Task<List<MessageListItemDto>> GetMessagesAsync(Guid groupId, Guid requesterId, int page, int pageSize);
    Task<MessageListItemDto> SendMessageAsync(Guid groupId, string content, Guid senderId);
    Task DeleteMessageAsync(Guid messageId, Guid requesterId);
} 
