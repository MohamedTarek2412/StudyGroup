 using StudyGroup.API.DTOs.Groups;
using StudyGroup.API.Models;
using StudyGroup.API.Repositories.Interfaces;

namespace StudyGroup.API.Services;

public class GroupService : IGroupService
{
    private readonly IGroupRepository _groups;
    private readonly INotificationService _notifications;

    public GroupService(IGroupRepository groups, INotificationService notifications)
    {
        _groups = groups;
        _notifications = notifications;
    }

    public async Task<List<GroupListItemDto>> GetApprovedGroupsAsync(string? subject, string? search, string? location, string? meetingTime, string? creatorName = null)
    {
        var groups = await _groups.GetAllApprovedAsync(subject, search, location, meetingTime, creatorName);
        return groups.Select(Map).ToList();
    }

    public async Task<GroupDetailsDto> GetGroupByIdAsync(Guid id)
    {
        var group = await _groups.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Group not found.");
        return MapDetails(group);
    }

    public async Task<GroupDetailsDto> CreateGroupAsync(GroupCreateDto dto, Guid ownerId)
    {
        var group = new Group
        {
            Name = dto.Name,
            Description = dto.Description,
            Subject = dto.Subject,
            Location = dto.Location,
            MeetingType = dto.MeetingType,
            MeetingSchedule = dto.MeetingSchedule,
            MaxMembers = dto.MaxMembers,
            OwnerId = ownerId,
            IsApproved = false, // awaits admin approval
        };
        await _groups.AddAsync(group);

        await _notifications.BroadcastNotificationAsync($"A new study group '{group.Name}' has been created and is awaiting approval.");

        var created = await _groups.GetByIdAsync(group.Id);
        return MapDetails(created!);
    }

    public async Task<GroupDetailsDto> UpdateGroupAsync(Guid id, GroupUpdateDto dto, Guid requesterId)
    {
        var group = await _groups.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Group not found.");

        if (group.OwnerId != requesterId)
            throw new UnauthorizedAccessException("Not the group owner.");

        group.Name = dto.Name;
        group.Description = dto.Description;
        group.Subject = dto.Subject;
        group.Location = dto.Location;
        group.MeetingType = dto.MeetingType;
        group.MeetingSchedule = dto.MeetingSchedule;
        group.MaxMembers = dto.MaxMembers;

        await _groups.UpdateAsync(group);

        await _notifications.BroadcastNotificationAsync($"The group '{group.Name}' has been updated by its owner.");

        return MapDetails(group);
    }

    public async Task DeleteGroupAsync(Guid id, Guid requesterId)
    {
        var group = await _groups.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Group not found.");

        if (group.OwnerId != requesterId)
            throw new UnauthorizedAccessException("Not the group owner.");

        await _groups.DeleteAsync(group);

        await _notifications.BroadcastNotificationAsync($"The group '{group.Name}' has been deleted by its owner.");
    }

    public async Task<List<GroupListItemDto>> GetMyGroupsAsync(Guid ownerId)
    {
        var groups = await _groups.GetByOwnerAsync(ownerId);
        return groups.Select(Map).ToList();
    }

    public async Task<List<MemberDto>> GetGroupMembersAsync(Guid groupId, Guid requesterId)
    {
        var group = await _groups.GetByIdAsync(groupId)
            ?? throw new KeyNotFoundException("Group not found.");

        // Verify requester is a member or owner
        var isOwner = group.OwnerId == requesterId;
        var isApprovedMember = group.JoinRequests.Any(
            jr => jr.UserId == requesterId && jr.Status == JoinRequestStatus.Approved);

        if (!isOwner && !isApprovedMember)
            throw new UnauthorizedAccessException("You are not a member of this group.");

        var members = new List<MemberDto>();

        // Add group owner as member
        members.Add(new MemberDto(group.OwnerId, group.Owner.FullName, group.Owner.Email, group.CreatedAt));

        // Add approved join requests as members
        var approvedMembers = group.JoinRequests
            .Where(jr => jr.Status == JoinRequestStatus.Approved)
            .OrderBy(jr => jr.CreatedAt)
            .Select(jr => new MemberDto(jr.UserId, jr.User.FullName, jr.User.Email, jr.CreatedAt))
            .ToList();

        members.AddRange(approvedMembers);

        return members;
    }

    public async Task<GroupStatsDto> GetGroupStatsAsync(Guid groupId)
    {
        var group = await _groups.GetByIdAsync(groupId)
            ?? throw new KeyNotFoundException("Group not found.");

        var totalMembers = 1 + group.JoinRequests.Count(jr => jr.Status == JoinRequestStatus.Approved);
        var totalMessages = group.DiscussionMessages.Count;
        var totalMaterials = group.Materials.Count;
        var totalDownloads = group.Materials.Sum(m => m.DownloadCount);

        return new GroupStatsDto(groupId, totalMembers, totalMessages, totalMaterials, totalDownloads);
    }

    private static GroupListItemDto Map(Group g) => new(
        g.Id, g.Name, g.Subject, g.Description, g.Location, g.MeetingType, g.MeetingSchedule, g.MaxMembers,
        g.IsApproved, g.Owner.FullName, g.CreatedAt);

    private static GroupDetailsDto MapDetails(Group g) => new(
        g.Id, g.Name, g.Subject, g.Description, g.Location, g.MeetingType, g.MeetingSchedule, g.MaxMembers,
        g.IsApproved, g.Owner.FullName, g.OwnerId, g.CreatedAt,
        g.JoinRequests.Count(jr => jr.Status == JoinRequestStatus.Approved));
}