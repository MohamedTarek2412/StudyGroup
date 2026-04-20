 namespace StudyGroup.API.Models;

public class Notification
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Message { get; set; } = string.Empty;
    public bool IsRead { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
}