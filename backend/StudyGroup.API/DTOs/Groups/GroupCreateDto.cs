 namespace StudyGroup.API.DTOs.Groups;

public record GroupCreateDto(string Name, string Description, string Subject, int MaxMembers);