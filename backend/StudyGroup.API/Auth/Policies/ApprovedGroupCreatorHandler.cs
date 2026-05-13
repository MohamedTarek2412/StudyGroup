using Microsoft.AspNetCore.Authorization;
using StudyGroup.API.Middlewares;
using StudyGroup.API.Repositories.Interfaces;

namespace StudyGroup.API.Auth.Policies;

public sealed class ApprovedGroupCreatorHandler : AuthorizationHandler<ApprovedGroupCreatorRequirement>
{
    private readonly IUserRepository _users;

    public ApprovedGroupCreatorHandler(IUserRepository users) => _users = users;

    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        ApprovedGroupCreatorRequirement requirement)
    {
        var userId = context.User.GetUserId();
        if (userId == Guid.Empty) return;

        var user = await _users.GetByIdAsync(userId);
        if (user is { IsApproved: true })
            context.Succeed(requirement);
    }
}
