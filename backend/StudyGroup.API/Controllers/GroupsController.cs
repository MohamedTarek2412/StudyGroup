 using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudyGroup.API.Auth.Policies;
using StudyGroup.API.DTOs.Groups;
using StudyGroup.API.Middlewares;
using StudyGroup.API.Services;

namespace StudyGroup.API.Controllers;

[ApiController]
[Route("api/groups")]
public class GroupsController : ControllerBase
{
    private readonly IGroupService _groups;
    public GroupsController(IGroupService groups) => _groups = groups;

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> Browse([FromQuery] string? subject, [FromQuery] string? search, [FromQuery] string? location, [FromQuery] string? meetingTime, [FromQuery] string? creatorName)
        => Ok(await _groups.GetApprovedGroupsAsync(subject, search, location, meetingTime, creatorName));

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> Get(Guid id)
    {
        var group = await _groups.GetGroupByIdAsync(id);

        // If group is not approved, only allow Admin or the group owner to view it.
        if (!group.IsApproved)
        {
            var isAuthenticated = User?.Identity?.IsAuthenticated == true;
            if (!isAuthenticated) return NotFound();

            var role = (User is null) ? string.Empty : User.GetRole();
            if (role == Roles.Admin) return Ok(group);

            var userId = (User is null) ? Guid.Empty : User.GetUserId();
            if (userId != Guid.Empty && userId == group.OwnerId) return Ok(group);

            return NotFound();
        }

        return Ok(group);
    }

    [HttpGet("{id:guid}/members")]
    [Authorize]
    public async Task<IActionResult> GetMembers(Guid id)
        => Ok(await _groups.GetGroupMembersAsync(id, User.GetUserId()));

    [HttpGet("{id:guid}/stats")]
    [AllowAnonymous]
    public async Task<IActionResult> GetStats(Guid id)
        => Ok(await _groups.GetGroupStatsAsync(id));

    [HttpGet("mine")]
    [Authorize(Policy = AuthPolicies.ApprovedGroupCreator)]
    public async Task<IActionResult> Mine()
        => Ok(await _groups.GetMyGroupsAsync(User.GetUserId()));

    [HttpPost]
    [Authorize(Policy = AuthPolicies.ApprovedGroupCreator)]
    public async Task<IActionResult> Create([FromBody] GroupCreateDto dto)
    {
        var result = await _groups.CreateGroupAsync(dto, User.GetUserId());
        return CreatedAtAction(nameof(Get), new { id = result.Id }, result);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Policy = AuthPolicies.ApprovedGroupCreator)]
    public async Task<IActionResult> Update(Guid id, [FromBody] GroupUpdateDto dto)
        => Ok(await _groups.UpdateGroupAsync(id, dto, User.GetUserId()));

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = AuthPolicies.ApprovedGroupCreator)]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _groups.DeleteGroupAsync(id, User.GetUserId());
        return NoContent();
    }
}