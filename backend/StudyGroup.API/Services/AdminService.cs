 using StudyGroup.API.Auth.Policies;
using StudyGroup.API.DTOs.Groups;
using StudyGroup.API.DTOs.Users;
using StudyGroup.API.Repositories.Interfaces;

namespace StudyGroup.API.Services;

public class AdminService : IAdminService
{
    private readonly IGroupRepository _groups;
    private readonly IUserRepository _users;
    private readonly INotificationService _notifications;

    public AdminService(IGroupRepository groups, IUserRepository users, INotificationService notifications)
    {
        _groups = groups; 
        _users = users;
        _notifications = notifications;
    }

    public async Task<List<GroupListItemDto>> GetPendingGroupsAsync()
    {
        var groups = await _groups.GetPendingAsync();
        return groups.Select(g => new GroupListItemDto(
            g.Id, g.Name, g.Subject, g.Description,
            g.Location, g.MeetingType, g.MeetingSchedule,
            g.MaxMembers, g.IsApproved, g.Owner.FullName, g.CreatedAt)).ToList();
    }

    public async Task ApproveGroupAsync(Guid groupId)
    {
        var group = await _groups.GetByIdAsync(groupId)
            ?? throw new KeyNotFoundException("Group not found.");
        group.IsApproved = true;
        await _groups.UpdateAsync(group);

        await _notifications.CreateNotificationAsync(
            group.OwnerId,
            $"Your group '{group.Name}' has been approved by an admin.");

        await _notifications.BroadcastNotificationAsync($"The group '{group.Name}' has been approved and is now available to join!");
    }

    public async Task RejectGroupAsync(Guid groupId)
    {
        var group = await _groups.GetByIdAsync(groupId)
            ?? throw new KeyNotFoundException("Group not found.");
        await _groups.DeleteAsync(group);

        await _notifications.CreateNotificationAsync(
            group.OwnerId,
            $"Your group '{group.Name}' has been rejected by an admin.");

        await _notifications.BroadcastNotificationAsync($"The group '{group.Name}' has been rejected by an admin.");
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

        await _notifications.CreateNotificationAsync(
            userId,
            "Your creator account has been approved! You can now create groups.");

        await _notifications.BroadcastNotificationAsync($"{user.FullName}'s creator account has been approved!");
    }

    public async Task RejectCreatorAsync(Guid userId)
    {
        var user = await _users.GetByIdAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");

        var roleName = user.UserRoles.FirstOrDefault()?.Role.Name ?? string.Empty;
        if (roleName != Roles.GroupCreator)
            throw new InvalidOperationException("Only Group Creator registrations can be rejected here.");

        if (user.IsApproved)
            throw new InvalidOperationException("This account is already approved.");

        foreach (var owned in user.OwnedGroups.ToList())
        {
            var full = await _groups.GetByIdAsync(owned.Id) ?? owned;
            await _groups.DeleteAsync(full);
        }

        await _users.DeleteAsync(userId);

        await _notifications.BroadcastNotificationAsync("A pending group creator registration was rejected by an admin.");
    }
}