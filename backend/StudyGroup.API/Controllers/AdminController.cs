 using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudyGroup.API.Auth.Policies;
using StudyGroup.API.Services;

namespace StudyGroup.API.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = Roles.Admin)]
public class AdminController : ControllerBase
{
    private readonly IAdminService _admin;
    public AdminController(IAdminService admin) => _admin = admin;

    [HttpGet("groups/pending")]
    public async Task<IActionResult> PendingGroups()
        => Ok(await _admin.GetPendingGroupsAsync());

    [HttpPost("groups/{id:guid}/approve")]
    public async Task<IActionResult> ApproveGroup(Guid id)
    {
        await _admin.ApproveGroupAsync(id);
        return NoContent();
    }

    [HttpPost("groups/{id:guid}/reject")]
    public async Task<IActionResult> RejectGroup(Guid id)
    {
        await _admin.RejectGroupAsync(id);
        return NoContent();
    }

    [HttpGet("users")]
    public async Task<IActionResult> AllUsers()
        => Ok(await _admin.GetAllUsersAsync());

    [HttpPost("users/{id:guid}/approve-creator")]
    public async Task<IActionResult> ApproveCreator(Guid id)
    {
        await _admin.ApproveCreatorAsync(id);
        return NoContent();
    }
}