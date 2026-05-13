namespace StudyGroup.API.DTOs.Groups;

public record GroupStatsDto(
    Guid GroupId,
    int TotalMembers,
    int TotalDiscussionMessages,
    int TotalMaterials,
    int TotalMaterialDownloads
);
