namespace StudyGroup.API.Auth.Policies;

public static class PolicyNames
{
    public const string AdminOnly = "AdminOnly";
    public const string CreatorOrAdmin = "CreatorOrAdmin";
    public const string AuthenticatedUser = "AuthenticatedUser";
}
