using StudyGroup.API.DTOs.Discussions;
using StudyGroup.API.Models;
using StudyGroup.API.Repositories.Interfaces;

namespace StudyGroup.API.Services;

public class DiscussionService : IDiscussionService
{
    private readonly IDiscussionRepository _messages;
    private readonly IGroupRepository _groups;
    private readonly INotificationService _notifications;

    public DiscussionService(IDiscussionRepository messages, IGroupRepository groups, INotificationService notifications)
    {
        _messages = messages;
        _groups = groups;
        _notifications = notifications;
    }

    public async Task<List<MessageListItemDto>> GetMessagesAsync(
        Guid groupId, Guid requesterId, int page, int pageSize)
    {
        var group = await _groups.GetByIdAsync(groupId)
            ?? throw new KeyNotFoundException("Group not found.");

        EnsureMember(group, requesterId);

        pageSize = Math.Clamp(pageSize, 1, 100);
        var skip = (page - 1) * pageSize;

        var messages = await _messages.GetByGroupAsync(groupId, skip, pageSize);
        // Return in chronological order (oldest first in the page)
        return messages.OrderBy(m => m.SentAt).Select(Map).ToList();
    }

    public async Task<MessageListItemDto> SendMessageAsync(Guid groupId, string content, Guid senderId)
    {
        var group = await _groups.GetByIdAsync(groupId)
            ?? throw new KeyNotFoundException("Group not found.");

        EnsureMember(group, senderId);

        var message = new DiscussionMessage
        {
            Content = content.Trim(),
            GroupId = groupId,
            SenderId = senderId,
        };

        await _messages.AddAsync(message);

        var saved = await _messages.GetByIdAsync(message.Id)
            ?? throw new Exception("Failed to retrieve saved message.");

        // Notify group members
        var membersToNotify = group.JoinRequests
            .Where(jr => jr.Status == JoinRequestStatus.Approved)
            .Select(jr => jr.UserId)
            .ToList();
        
        if (!membersToNotify.Contains(group.OwnerId))
            membersToNotify.Add(group.OwnerId);

        membersToNotify.Remove(senderId);

        foreach (var memberId in membersToNotify)
        {
            await _notifications.CreateNotificationAsync(memberId, $"New message in '{group.Name}'.");
        }

        await _notifications.BroadcastNotificationAsync($"{saved.Sender.FullName} just posted a new message in '{group.Name}'!");

        return Map(saved);
    }

    public async Task DeleteMessageAsync(Guid messageId, Guid requesterId)
    {
        var message = await _messages.GetByIdAsync(messageId)
            ?? throw new KeyNotFoundException("Message not found.");

        var group = await _groups.GetByIdAsync(message.GroupId)
            ?? throw new KeyNotFoundException("Group not found.");

        // Only the sender or group owner can delete
        if (message.SenderId != requesterId && group.OwnerId != requesterId)
            throw new UnauthorizedAccessException("You do not have permission to delete this message.");

        await _messages.DeleteAsync(message);

        await _notifications.BroadcastNotificationAsync($"A message was deleted in the group '{group.Name}'.");
    }

    private static void EnsureMember(Models.Group group, Guid userId)
    {
        var isOwner = group.OwnerId == userId;
        var isApprovedMember = group.JoinRequests.Any(
            jr => jr.UserId == userId && jr.Status == JoinRequestStatus.Approved);

        if (!isOwner && !isApprovedMember)
            throw new UnauthorizedAccessException("You are not a member of this group.");
    }

    private static MessageListItemDto Map(DiscussionMessage m) => new(
        m.Id, m.Content, m.SentAt, m.SenderId, m.Sender.FullName, m.GroupId);
} 
