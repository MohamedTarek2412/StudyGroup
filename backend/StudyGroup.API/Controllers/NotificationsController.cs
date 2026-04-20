using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudyGroup.API.Middlewares;
using StudyGroup.API.Services;

namespace StudyGroup.API.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _notifications;

    public NotificationsController(INotificationService notifications) => _notifications = notifications;

    /// <summary>GET all notifications for the current user</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _notifications.GetMyNotificationsAsync(User.GetUserId()));

    /// <summary>PATCH mark a single notification as read</summary>
    [HttpPatch("{id:guid}/read")]
    public async Task<IActionResult> MarkRead(Guid id)
    {
        await _notifications.MarkAsReadAsync(id, User.GetUserId());
        return NoContent();
    }

    /// <summary>PATCH mark all notifications as read</summary>
    [HttpPatch("read-all")]
    public async Task<IActionResult> MarkAllRead()
    {
        await _notifications.MarkAllAsReadAsync(User.GetUserId());
        return NoContent();
    }
}
