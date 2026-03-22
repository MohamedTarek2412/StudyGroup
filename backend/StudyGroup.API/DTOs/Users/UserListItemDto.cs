 namespace StudyGroup.API.DTOs.Users;

public record UserListItemDto(Guid Id, string FullName, string Email, string Role, bool IsApproved);