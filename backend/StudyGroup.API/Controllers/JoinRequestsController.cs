 using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudyGroup.API.Auth.Policies;
using StudyGroup.API.DTOs.JoinRequests;
using StudyGroup.API.Middlewares;
using StudyGroup.API.Services;

namespace StudyGroup.API.Controllers;

[ApiController]
[Route("api/join-requests")]
[Authorize]
public class JoinRequestsController : ControllerBase
{
    private readonly IJoinRequestService _jrService;
    public JoinRequestsController(IJoinRequestService jrService) => _jrService = jrService;

    [HttpPost]
    [Authorize(Roles = Roles.Student)]
    public async Task<IActionResult> Create([FromBody] JoinRequestCreateDto dto)
        => Ok(await _jrService.CreateAsync(dto.GroupId, User.GetUserId()));

    [HttpGet("mine")]
    [Authorize(Roles = Roles.Student)]
    public async Task<IActionResult> Mine()
        => Ok(await _jrService.GetMyRequestsAsync(User.GetUserId()));

    [HttpGet("group/{groupId:guid}")]
    [Authorize(Roles = Roles.GroupCreator)]
    public async Task<IActionResult> GetForGroup(Guid groupId)
        => Ok(await _jrService.GetByGroupAsync(groupId, User.GetUserId()));

    [HttpPost("{id:guid}/approve")]
    [Authorize(Roles = Roles.GroupCreator)]
    public async Task<IActionResult> Approve(Guid id)
    {
        await _jrService.ApproveAsync(id, User.GetUserId());
        return NoContent();
    }

    [HttpPost("{id:guid}/reject")]
    [Authorize(Roles = Roles.GroupCreator)]
    public async Task<IActionResult> Reject(Guid id)
    {
        await _jrService.RejectAsync(id, User.GetUserId());
        return NoContent();
    }
}