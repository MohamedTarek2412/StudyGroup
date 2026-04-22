using System.ComponentModel.DataAnnotations;

namespace StudyGroup.API.DTOs.Discussions;

public class MessageCreateDto
{
    [Required]
    [MinLength(1)]
    [MaxLength(2000)]
    public string Content { get; set; } = string.Empty;
}
