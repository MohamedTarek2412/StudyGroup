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
    [Authorize]
    public async Task<IActionResult> Browse([FromQuery] string? subject, [FromQuery] string? search)
        => Ok(await _groups.GetApprovedGroupsAsync(subject, search));

    [HttpGet("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Get(Guid id)
        => Ok(await _groups.GetGroupByIdAsync(id));

    [HttpGet("mine")]
    [Authorize(Roles = Roles.GroupCreator)]
    public async Task<IActionResult> Mine()
        => Ok(await _groups.GetMyGroupsAsync(User.GetUserId()));

    [HttpPost]
    [Authorize(Roles = Roles.GroupCreator)]
    public async Task<IActionResult> Create([FromBody] GroupCreateDto dto)
    {
        var result = await _groups.CreateGroupAsync(dto, User.GetUserId());
        return CreatedAtAction(nameof(Get), new { id = result.Id }, result);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = Roles.GroupCreator)]
    public async Task<IActionResult> Update(Guid id, [FromBody] GroupUpdateDto dto)
        => Ok(await _groups.UpdateGroupAsync(id, dto, User.GetUserId()));

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = Roles.GroupCreator)]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _groups.DeleteGroupAsync(id, User.GetUserId());
        return NoContent();
    }
}