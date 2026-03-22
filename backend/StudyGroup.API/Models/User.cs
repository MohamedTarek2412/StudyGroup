 namespace StudyGroup.API.Models;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public bool IsApproved { get; set; } = true; // false for GroupCreator until admin approves
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    public ICollection<Group> OwnedGroups { get; set; } = new List<Group>();
    public ICollection<JoinRequest> JoinRequests { get; set; } = new List<JoinRequest>();
}
