using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.StaticFiles;
using StudyGroup.API.DTOs.Materials;
using StudyGroup.API.Models;
using StudyGroup.API.Repositories.Interfaces;

namespace StudyGroup.API.Services;

public class MaterialService : IMaterialService
{
    private readonly IMaterialRepository _materials;
    private readonly IGroupRepository _groups;
    private readonly IConfiguration _config;

    public MaterialService(
        IMaterialRepository materials,
        IGroupRepository groups,
        IConfiguration config)
    {
        _materials = materials;
        _groups = groups;
        _config = config;
    }

    private string UploadRoot =>
        _config["FileStorage:UploadPath"] ?? Path.Combine(Directory.GetCurrentDirectory(), "Uploads");

    private long MaxFileSizeBytes =>
        (_config.GetValue<long?>("FileStorage:MaxFileSizeMb") ?? 20) * 1024 * 1024;

    private IEnumerable<string> AllowedExtensions =>
        _config.GetSection("FileStorage:AllowedExtensions").Get<string[]>()
        ?? [".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".jpg", ".jpeg", ".png", ".zip"];

    public async Task<List<MaterialListItemDto>> GetGroupMaterialsAsync(Guid groupId, Guid requesterId)
    {
        var group = await _groups.GetByIdAsync(groupId)
            ?? throw new KeyNotFoundException("Group not found.");

        EnsureMember(group, requesterId);

        var list = await _materials.GetByGroupAsync(groupId);
        return list.Select(Map).ToList();
    }

    public async Task<MaterialListItemDto> UploadMaterialAsync(Guid groupId, IFormFile file, Guid uploaderId)
    {
        var group = await _groups.GetByIdAsync(groupId)
            ?? throw new KeyNotFoundException("Group not found.");

        EnsureMember(group, uploaderId);

        if (file.Length == 0)
            throw new InvalidOperationException("File is empty.");

        if (file.Length > MaxFileSizeBytes)
            throw new InvalidOperationException(
                $"File exceeds the maximum allowed size of {MaxFileSizeBytes / 1024 / 1024} MB.");

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(ext))
            throw new InvalidOperationException($"File type '{ext}' is not allowed.");

        var uploadsFolder = Path.Combine(UploadRoot, "Materials", groupId.ToString());
        Directory.CreateDirectory(uploadsFolder);

        var safeFileName = $"{Guid.NewGuid()}{ext}";
        var fullPath = Path.Combine(uploadsFolder, safeFileName);

        await using (var stream = new FileStream(fullPath, FileMode.Create))
            await file.CopyToAsync(stream);

        var material = new Material
        {
            FileName = file.FileName,
            FilePath = fullPath,
            FileSizeBytes = file.Length,
            GroupId = groupId,
            UploadedById = uploaderId,
        };

        await _materials.AddAsync(material);

        var saved = await _materials.GetByIdAsync(material.Id)
            ?? throw new Exception("Failed to retrieve saved material.");

        return Map(saved);
    }

    public async Task DeleteMaterialAsync(Guid materialId, Guid requesterId)
    {
        var material = await _materials.GetByIdAsync(materialId)
            ?? throw new KeyNotFoundException("Material not found.");

        var group = await _groups.GetByIdAsync(material.GroupId)
            ?? throw new KeyNotFoundException("Group not found.");

        if (material.UploadedById != requesterId && group.OwnerId != requesterId)
            throw new UnauthorizedAccessException("You do not have permission to delete this material.");

        if (File.Exists(material.FilePath))
            File.Delete(material.FilePath);

        await _materials.DeleteAsync(material);
    }

    public async Task<(byte[] data, string fileName, string contentType)> DownloadMaterialAsync(
        Guid materialId, Guid requesterId)
    {
        var material = await _materials.GetByIdAsync(materialId)
            ?? throw new KeyNotFoundException("Material not found.");

        var group = await _groups.GetByIdAsync(material.GroupId)
            ?? throw new KeyNotFoundException("Group not found.");

        EnsureMember(group, requesterId);

        if (!File.Exists(material.FilePath))
            throw new FileNotFoundException("File not found on server.");

        var data = await File.ReadAllBytesAsync(material.FilePath);

        var provider = new FileExtensionContentTypeProvider();
        if (!provider.TryGetContentType(material.FileName, out var contentType))
            contentType = "application/octet-stream";

        return (data, material.FileName, contentType);
    }

    // ── Helpers ───────────────────────────────────────────────────────────

    private static void EnsureMember(Models.Group group, Guid userId)
    {
        var isOwner = group.OwnerId == userId;
        var isApprovedMember = group.JoinRequests.Any(
            jr => jr.UserId == userId && jr.Status == JoinRequestStatus.Approved);

        if (!isOwner && !isApprovedMember)
            throw new UnauthorizedAccessException("You are not a member of this group.");
    }

    private static MaterialListItemDto Map(Material m) => new(
        m.Id, m.FileName, m.FilePath, m.FileSizeBytes,
        m.UploadedAt, m.GroupId, m.UploadedById, m.UploadedBy.FullName);
}
