 using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudyGroup.API.Middlewares;
using StudyGroup.API.Repositories.Interfaces;
using StudyGroup.API.DTOs.Auth;
using StudyGroup.API.DTOs.Users;

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

    [HttpPut("me")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserProfileDto dto)
    {
        var userId = User.GetUserId();
        var user = await _users.GetByIdAsync(userId);
        if (user is null) return NotFound();

        // Check if email is already taken by another user
        if (user.Email != dto.Email.ToLower())
        {
            var emailExists = await _users.EmailExistsAsync(dto.Email);
            if (emailExists)
                return BadRequest(new { message = "Email is already in use." });
        }

        user.FullName = dto.FullName;
        user.Email = dto.Email.ToLower();

        await _users.UpdateAsync(user);

        var role = user.UserRoles.FirstOrDefault()?.Role.Name ?? "Unknown";
        return Ok(new UserProfileDto(user.Id, user.FullName, user.Email, role, user.IsApproved));
    }
}