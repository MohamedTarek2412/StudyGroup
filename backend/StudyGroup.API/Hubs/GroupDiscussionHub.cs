using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using StudyGroup.API.DTOs.Discussions;
using StudyGroup.API.Middlewares;
using StudyGroup.API.Services;

namespace StudyGroup.API.Hubs;

[Authorize]
public class GroupDiscussionHub : Hub
{
    private readonly IDiscussionService _discussion;

    public GroupDiscussionHub(IDiscussionService discussion)
    {
        _discussion = discussion;
    }

    /// <summary>
    /// Client calls this to join a specific group's discussion room.
    /// </summary>
    public async Task JoinGroup(string groupId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, groupId);
    }

    /// <summary>
    /// Client calls this to leave a group's discussion room.
    /// </summary>
    public async Task LeaveGroup(string groupId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupId);
    }

    /// <summary>
    /// Client sends a message; persists it and broadcasts to the room.
    /// </summary>
    public async Task SendMessage(string groupId, string content)
    {
        var userId = Context.User?.GetUserId();
        if (userId is null || userId == Guid.Empty)
        {
            await Clients.Caller.SendAsync("Error", "Unauthorized.");
            return;
        }

        if (!Guid.TryParse(groupId, out var groupGuid))
        {
            await Clients.Caller.SendAsync("Error", "Invalid group ID.");
            return;
        }

        try
        {
            var message = await _discussion.SendMessageAsync(groupGuid, content, userId.Value);
            await Clients.Group(groupId).SendAsync("ReceiveMessage", message);
        }
        catch (UnauthorizedAccessException ex)
        {
            await Clients.Caller.SendAsync("Error", ex.Message);
        }
        catch (Exception ex)
        {
            await Clients.Caller.SendAsync("Error", ex.Message);
        }
    }
} 
