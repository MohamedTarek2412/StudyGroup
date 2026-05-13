 namespace StudyGroup.API.Models;

public class Material
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public long FileSizeBytes { get; set; }
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    public Guid GroupId { get; set; }
    public Group Group { get; set; } = null!;

    public Guid UploadedById { get; set; }
    public User UploadedBy { get; set; } = null!;
}