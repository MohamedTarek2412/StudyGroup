 using StudyGroup.API.DTOs.Groups;

namespace StudyGroup.API.Services;

public interface IGroupService
{
    Task<List<GroupListItemDto>> GetApprovedGroupsAsync(string? subject, string? search, string? location, string? meetingTime, string? creatorName = null);
    Task<GroupDetailsDto> GetGroupByIdAsync(Guid id);
    Task<GroupDetailsDto> CreateGroupAsync(GroupCreateDto dto, Guid ownerId);
    Task<GroupDetailsDto> UpdateGroupAsync(Guid id, GroupUpdateDto dto, Guid requesterId);
    Task DeleteGroupAsync(Guid id, Guid requesterId);
    Task<List<GroupListItemDto>> GetMyGroupsAsync(Guid ownerId);
    Task<List<MemberDto>> GetGroupMembersAsync(Guid groupId, Guid requesterId);
    Task<GroupStatsDto> GetGroupStatsAsync(Guid groupId);
}