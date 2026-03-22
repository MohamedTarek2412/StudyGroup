 using StudyGroup.API.DTOs.Groups;
using StudyGroup.API.DTOs.Users;
using StudyGroup.API.Repositories.Interfaces;

namespace StudyGroup.API.Services;

public class AdminService : IAdminService
{
    private readonly IGroupRepository _groups;
    private readonly IUserRepository _users;

    public AdminService(IGroupRepository groups, IUserRepository users)
    {
        _groups = groups; _users = users;
    }

    public async Task<List<GroupListItemDto>> GetPendingGroupsAsync()
    {
        var groups = await _groups.GetPendingAsync();
        return groups.Select(g => new GroupListItemDto(
            g.Id, g.Name, g.Subject, g.Description,
            g.MaxMembers, g.IsApproved, g.Owner.FullName, g.CreatedAt)).ToList();
    }

    public async Task ApproveGroupAsync(Guid groupId)
    {
        var group = await _groups.GetByIdAsync(groupId)
            ?? throw new KeyNotFoundException("Group not found.");
        group.IsApproved = true;
        await _groups.UpdateAsync(group);
    }

    public async Task RejectGroupAsync(Guid groupId)
    {
        var group = await _groups.GetByIdAsync(groupId)
            ?? throw new KeyNotFoundException("Group not found.");
        await _groups.DeleteAsync(group);
    }

    public async Task<List<UserListItemDto>> GetAllUsersAsync()
    {
        var users = await _users.GetAllAsync();
        return users.Select(u => new UserListItemDto(
            u.Id, u.FullName, u.Email,
            u.UserRoles.FirstOrDefault()?.Role.Name ?? "Unknown",
            u.IsApproved)).ToList();
    }

    public async Task ApproveCreatorAsync(Guid userId)
    {
        var user = await _users.GetByIdAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");
        user.IsApproved = true;
        await _users.UpdateAsync(user);
    }
}