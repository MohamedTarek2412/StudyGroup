namespace StudyGroup.API.DTOs.Groups;

public record GroupDetailsDto(
    Guid Id, string Name, string Subject, string Description,
    string Location, string MeetingType, string MeetingSchedule,
    int MaxMembers, bool IsApproved, string OwnerName, Guid OwnerId, DateTime CreatedAt,
    int MemberCount
);