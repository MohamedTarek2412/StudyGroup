using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using StudyGroup.API.Middlewares;

namespace StudyGroup.API.Hubs;

[Authorize]
public class NotificationHub : Hub
{
    /// <summary>
    /// When a client connects, add it to a group keyed by the user's ID
    /// so the NotificationService can target individual users.
    /// </summary>
    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.GetUserId();
        if (userId.HasValue && userId.Value != Guid.Empty)
            await Groups.AddToGroupAsync(Context.ConnectionId, userId.Value.ToString());

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.User?.GetUserId();
        if (userId.HasValue && userId.Value != Guid.Empty)
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, userId.Value.ToString());

        await base.OnDisconnectedAsync(exception);
    }
} 
