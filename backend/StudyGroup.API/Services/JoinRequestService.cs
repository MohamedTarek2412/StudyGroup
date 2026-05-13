 using StudyGroup.API.DTOs.JoinRequests;
using StudyGroup.API.Models;
using StudyGroup.API.Repositories.Interfaces;

namespace StudyGroup.API.Services;

public class JoinRequestService : IJoinRequestService
{
    private readonly IJoinRequestRepository _jrRepo;
    private readonly IGroupRepository _groups;
    private readonly INotificationService _notifications;

    public JoinRequestService(IJoinRequestRepository jrRepo, IGroupRepository groups, INotificationService notifications)
    {
        _jrRepo = jrRepo; 
        _groups = groups;
        _notifications = notifications;
    }

    public async Task<JoinRequestListItemDto> CreateAsync(Guid groupId, Guid userId)
    {
        var group = await _groups.GetByIdAsync(groupId)
            ?? throw new KeyNotFoundException("Group not found.");

        if (!group.IsApproved)
            throw new InvalidOperationException("Group is not active.");

        var existing = await _jrRepo.GetByUserAndGroupAsync(userId, groupId);
        if (existing is not null)
        {
            switch (existing.Status)
            {
                case JoinRequestStatus.Pending:
                    throw new InvalidOperationException("You already have a pending join request for this group.");
                case JoinRequestStatus.Approved:
                    throw new InvalidOperationException("You are already a member of this group.");
                case JoinRequestStatus.Rejected:
                    existing.Status = JoinRequestStatus.Pending;
                    existing.CreatedAt = DateTime.UtcNow;
                    await _jrRepo.UpdateAsync(existing);
                    await _notifications.BroadcastNotificationAsync($"{existing.User.FullName} has requested to rejoin the group '{group.Name}'.");
                    var reopened = await _jrRepo.GetByIdAsync(existing.Id);
                    return Map(reopened!);
            }
        }

        var jr = new JoinRequest { GroupId = groupId, UserId = userId };
        await _jrRepo.AddAsync(jr);

        await _notifications.CreateNotificationAsync(
            group.OwnerId,
            $"You have a new join request for '{group.Name}' from a user.");

        await _notifications.BroadcastNotificationAsync($"A user has requested to join the group '{group.Name}'.");

        var saved = await _jrRepo.GetByIdAsync(jr.Id);
        return Map(saved!);
    }

    public async Task<List<JoinRequestListItemDto>> GetByGroupAsync(Guid groupId, Guid requesterId)
    {
        var group = await _groups.GetByIdAsync(groupId)
            ?? throw new KeyNotFoundException("Group not found.");

        if (group.OwnerId != requesterId)
            throw new UnauthorizedAccessException("Not the group owner.");

        var requests = await _jrRepo.GetByGroupAsync(groupId);
        return requests.Select(Map).ToList();
    }

    public async Task<List<JoinRequestListItemDto>> GetMyRequestsAsync(Guid userId)
    {
        var requests = await _jrRepo.GetByUserAsync(userId);
        return requests.Select(Map).ToList();
    }

    public async Task ApproveAsync(Guid requestId, Guid requesterId)
        => await UpdateStatus(requestId, requesterId, JoinRequestStatus.Approved);

    public async Task RejectAsync(Guid requestId, Guid requesterId)
        => await UpdateStatus(requestId, requesterId, JoinRequestStatus.Rejected);

    private async Task UpdateStatus(Guid requestId, Guid requesterId, JoinRequestStatus status)
    {
        var jr = await _jrRepo.GetByIdAsync(requestId)
            ?? throw new KeyNotFoundException("Join request not found.");

        if (jr.Group.OwnerId != requesterId)
            throw new UnauthorizedAccessException("Not the group owner.");

        jr.Status = status;
        await _jrRepo.UpdateAsync(jr);

        var statusString = status == JoinRequestStatus.Approved ? "approved" : "rejected";
        await _notifications.CreateNotificationAsync(
            jr.UserId,
            $"Your request to join '{jr.Group.Name}' was {statusString}.");

        if (status == JoinRequestStatus.Approved)
        {
            await _notifications.BroadcastNotificationAsync($"{jr.User.FullName} just joined the group '{jr.Group.Name}'!");
        }
    }

    private static JoinRequestListItemDto Map(JoinRequest jr) => new(
        jr.Id, jr.GroupId, jr.Group.Name,
        jr.UserId, jr.User.FullName, jr.Status.ToString(), jr.CreatedAt);
}