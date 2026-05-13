 using StudyGroup.API.DTOs.JoinRequests;

namespace StudyGroup.API.Services;

public interface IJoinRequestService
{
    Task<JoinRequestListItemDto> CreateAsync(Guid groupId, Guid userId);
    Task<List<JoinRequestListItemDto>> GetByGroupAsync(Guid groupId, Guid requesterId);
    Task<List<JoinRequestListItemDto>> GetMyRequestsAsync(Guid userId);
    Task ApproveAsync(Guid requestId, Guid requesterId);
    Task RejectAsync(Guid requestId, Guid requesterId);
}