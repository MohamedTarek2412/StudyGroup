namespace StudyGroup.API.Models;

public class Group
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public int MaxMembers { get; set; } = 30;
    public bool IsApproved { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Guid OwnerId { get; set; }
    public User Owner { get; set; } = null!;

    public ICollection<JoinRequest> JoinRequests { get; set; } = new List<JoinRequest>();
    public ICollection<Material> Materials { get; set; } = new List<Material>();
    public ICollection<DiscussionMessage> Messages { get; set; } = new List<DiscussionMessage>();
}
