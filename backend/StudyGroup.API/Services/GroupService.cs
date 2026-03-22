 using StudyGroup.API.DTOs.Groups;
using StudyGroup.API.Models;
using StudyGroup.API.Repositories.Interfaces;

namespace StudyGroup.API.Services;

public class GroupService : IGroupService
{
    private readonly IGroupRepository _groups;
    public GroupService(IGroupRepository groups) => _groups = groups;

    public async Task<List<GroupListItemDto>> GetApprovedGroupsAsync(string? subject, string? search)
    {
        var groups = await _groups.GetAllApprovedAsync(subject, search);
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
            MaxMembers = dto.MaxMembers,
            OwnerId = ownerId,
            IsApproved = false, // awaits admin approval
        };
        await _groups.AddAsync(group);
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
        group.MaxMembers = dto.MaxMembers;

        await _groups.UpdateAsync(group);
        return MapDetails(group);
    }

    public async Task DeleteGroupAsync(Guid id, Guid requesterId)
    {
        var group = await _groups.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Group not found.");

        if (group.OwnerId != requesterId)
            throw new UnauthorizedAccessException("Not the group owner.");

        await _groups.DeleteAsync(group);
    }

    public async Task<List<GroupListItemDto>> GetMyGroupsAsync(Guid ownerId)
    {
        var groups = await _groups.GetByOwnerAsync(ownerId);
        return groups.Select(Map).ToList();
    }

    private static GroupListItemDto Map(Group g) => new(
        g.Id, g.Name, g.Subject, g.Description, g.MaxMembers,
        g.IsApproved, g.Owner.FullName, g.CreatedAt);

    private static GroupDetailsDto MapDetails(Group g) => new(
        g.Id, g.Name, g.Subject, g.Description, g.MaxMembers,
        g.IsApproved, g.Owner.FullName, g.OwnerId, g.CreatedAt,
        g.JoinRequests.Count(jr => jr.Status == JoinRequestStatus.Approved));
}