 using System.Security.Claims;

namespace StudyGroup.API.Middlewares;

public static class CurrentUserExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal user)
    {
        var id = user.FindFirstValue(ClaimTypes.NameIdentifier)
               ?? user.FindFirstValue("sub");
        return Guid.TryParse(id, out var guid) ? guid : Guid.Empty;
    }

    public static string GetRole(this ClaimsPrincipal user) =>
        user.FindFirstValue(ClaimTypes.Role) ?? string.Empty;
}