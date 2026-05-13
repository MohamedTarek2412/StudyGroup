 namespace StudyGroup.API.Models;

public enum JoinRequestStatus { Pending, Approved, Rejected }

public class JoinRequest
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public JoinRequestStatus Status { get; set; } = JoinRequestStatus.Pending;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid GroupId { get; set; }
    public Group Group { get; set; } = null!;
}