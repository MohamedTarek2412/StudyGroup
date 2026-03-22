 namespace StudyGroup.API.Models;

public class DiscussionMessage
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Content { get; set; } = string.Empty;
    public DateTime SentAt { get; set; } = DateTime.UtcNow;

    public Guid GroupId { get; set; }
    public Group Group { get; set; } = null!;

    public Guid SenderId { get; set; }
    public User Sender { get; set; } = null!;
}