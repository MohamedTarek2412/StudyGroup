using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudyGroup.API.DTOs.Discussions;
using StudyGroup.API.Middlewares;
using StudyGroup.API.Services;

namespace StudyGroup.API.Controllers;

[ApiController]
[Route("api/groups/{groupId:guid}/discussions")]
[Authorize]
public class DiscussionsController : ControllerBase
{
    private readonly IDiscussionService _discussion;

    public DiscussionsController(IDiscussionService discussion) => _discussion = discussion;

    /// <summary>GET paginated messages for a group</summary>
    [HttpGet]
    public async Task<IActionResult> GetMessages(
        Guid groupId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50)
        => Ok(await _discussion.GetMessagesAsync(groupId, User.GetUserId(), page, pageSize));

    /// <summary>POST a new message via REST (for clients not using SignalR)</summary>
    [HttpPost]
    public async Task<IActionResult> SendMessage(Guid groupId, [FromBody] MessageCreateDto dto)
    {
        var result = await _discussion.SendMessageAsync(groupId, dto.Content, User.GetUserId());
        return CreatedAtAction(nameof(GetMessages), new { groupId }, result);
    }

    /// <summary>DELETE a message (sender or group owner)</summary>
    [HttpDelete("{messageId:guid}")]
    public async Task<IActionResult> DeleteMessage(Guid groupId, Guid messageId)
    {
        await _discussion.DeleteMessageAsync(messageId, User.GetUserId());
        return NoContent();
    }
}
