 namespace StudyGroup.API.DTOs.Groups;

public record GroupUpdateDto(string Name, string Description, string Subject, string Location, string MeetingType, string MeetingSchedule, int MaxMembers);