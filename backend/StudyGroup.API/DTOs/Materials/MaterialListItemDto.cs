namespace StudyGroup.API.DTOs.Materials;

public record MaterialListItemDto(
    Guid Id,
    string FileName,
    string FilePath,
    long FileSizeBytes,
    int DownloadCount,
    DateTime UploadedAt,
    Guid GroupId,
    Guid UploadedById,
    string UploadedByName
); 
