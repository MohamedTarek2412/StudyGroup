 using StudyGroup.API.DTOs.JoinRequests;
using StudyGroup.API.Models;
using StudyGroup.API.Repositories.Interfaces;

namespace StudyGroup.API.Services;

public class JoinRequestService : IJoinRequestService
{
    private readonly IJoinRequestRepository _jrRepo;
    private readonly IGroupRepository _groups;

    public JoinRequestService(IJoinRequestRepository jrRepo, IGroupRepository groups)
    {
        _jrRepo = jrRepo; _groups = groups;
    }

    public async Task<JoinRequestListItemDto> CreateAsync(Guid groupId, Guid userId)
    {
        var group = await _groups.GetByIdAsync(groupId)
            ?? throw new KeyNotFoundException("Group not found.");

        if (!group.IsApproved)
            throw new InvalidOperationException("Group is not active.");

        var existing = await _jrRepo.GetByUserAndGroupAsync(userId, groupId);
        if (existing != null)
            throw new InvalidOperationException("Already requested to join this group.");

        var jr = new JoinRequest { GroupId = groupId, UserId = userId };
        await _jrRepo.AddAsync(jr);
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
    }

    private static JoinRequestListItemDto Map(JoinRequest jr) => new(
        jr.Id, jr.GroupId, jr.Group.Name,
        jr.UserId, jr.User.FullName, jr.Status.ToString(), jr.CreatedAt);
}