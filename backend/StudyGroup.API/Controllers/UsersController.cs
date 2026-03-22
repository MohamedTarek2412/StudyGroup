 using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudyGroup.API.Middlewares;
using StudyGroup.API.Repositories.Interfaces;
using StudyGroup.API.DTOs.Auth;

namespace StudyGroup.API.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _users;
    public UsersController(IUserRepository users) => _users = users;

    [HttpGet("me")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = User.GetUserId();
        var user = await _users.GetByIdAsync(userId);
        if (user is null) return NotFound();

        var role = user.UserRoles.FirstOrDefault()?.Role.Name ?? "Unknown";
        return Ok(new UserProfileDto(user.Id, user.FullName, user.Email, role, user.IsApproved));
    }
}