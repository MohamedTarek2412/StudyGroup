 using StudyGroup.API.DTOs.Groups;
using StudyGroup.API.DTOs.Users;

namespace StudyGroup.API.Services;

public interface IAdminService
{
    Task<List<GroupListItemDto>> GetPendingGroupsAsync();
    Task ApproveGroupAsync(Guid groupId);
    Task RejectGroupAsync(Guid groupId);
    Task<List<UserListItemDto>> GetAllUsersAsync();
    Task ApproveCreatorAsync(Guid userId);
}