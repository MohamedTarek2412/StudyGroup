using Microsoft.AspNetCore.Authorization;

namespace StudyGroup.API.Auth.Policies;

public sealed class ApprovedGroupCreatorRequirement : IAuthorizationRequirement { }
