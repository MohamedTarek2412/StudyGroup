using Microsoft.AspNetCore.Http;
using StudyGroup.API.DTOs.Materials;

namespace StudyGroup.API.Services;

public interface IMaterialService
{
    Task<List<MaterialListItemDto>> GetGroupMaterialsAsync(Guid groupId, Guid requesterId);
    Task<MaterialListItemDto> UploadMaterialAsync(Guid groupId, IFormFile file, Guid uploaderId);
    Task DeleteMaterialAsync(Guid materialId, Guid requesterId);
    Task<(byte[] data, string fileName, string contentType)> DownloadMaterialAsync(Guid materialId, Guid requesterId);
}
