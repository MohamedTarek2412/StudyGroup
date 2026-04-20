 namespace StudyGroup.API.DTOs.Groups;

public record GroupUpdateDto(string Name, string Description, string Subject, int MaxMembers);