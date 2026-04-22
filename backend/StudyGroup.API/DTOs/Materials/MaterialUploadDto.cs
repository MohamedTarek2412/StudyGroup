using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace StudyGroup.API.DTOs.Materials;

public class MaterialUploadDto
{
    [Required]
    public IFormFile File { get; set; } = null!;
} 
