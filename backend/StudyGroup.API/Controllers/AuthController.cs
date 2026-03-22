using Microsoft.AspNetCore.Mvc;
using StudyGroup.API.Auth.Services;
using StudyGroup.API.DTOs.Auth;

namespace StudyGroup.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;
    public AuthController(IAuthService auth) => _auth = auth;

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto dto)
    {
        var result = await _auth.RegisterAsync(dto);
        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
    {
        var result = await _auth.LoginAsync(dto);
        return Ok(result);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequestDto dto)
    {
        var result = await _auth.RefreshAsync(dto.RefreshToken);
        return Ok(result);
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] RefreshTokenRequestDto dto)
    {
        await _auth.LogoutAsync(dto.RefreshToken);
        return NoContent();
    }
}