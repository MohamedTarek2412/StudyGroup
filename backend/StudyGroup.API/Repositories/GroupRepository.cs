using Microsoft.EntityFrameworkCore;
using StudyGroup.API.Data;
using StudyGroup.API.Models;
using StudyGroup.API.Repositories.Interfaces;

namespace StudyGroup.API.Repositories;

public class GroupRepository : IGroupRepository
{
    private readonly AppDbContext _db;

    public GroupRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<Group>> GetAllApprovedAsync(string? subject, string? search, string? location, string? meetingTime)
    {
        var query = _db.Groups
            .Include(g => g.Owner)
            .Where(g => g.IsApproved);

        if (!string.IsNullOrWhiteSpace(subject))
            query = query.Where(g => g.Subject.Contains(subject));

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(g => g.Name.Contains(search) || g.Description.Contains(search));

        if (!string.IsNullOrWhiteSpace(location))
            query = query.Where(g => g.Location != null && g.Location.Contains(location));

        if (!string.IsNullOrWhiteSpace(meetingTime))
            query = query.Where(g => g.MeetingSchedule != null && g.MeetingSchedule.Contains(meetingTime));

        return await query.OrderByDescending(g => g.CreatedAt).ToListAsync();
    }

    public async Task<List<Group>> GetPendingAsync()
    {
        return await _db.Groups
            .Include(g => g.Owner)
            .Where(g => !g.IsApproved)
            .OrderByDescending(g => g.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Group>> GetByOwnerAsync(Guid ownerId)
    {
        return await _db.Groups
            .Include(g => g.Owner)
            .Where(g => g.OwnerId == ownerId)
            .OrderByDescending(g => g.CreatedAt)
            .ToListAsync();
    }

    public async Task<Group?> GetByIdAsync(Guid id)
    {
        return await _db.Groups
            .Include(g => g.Owner)
            .Include(g => g.JoinRequests)
            .FirstOrDefaultAsync(g => g.Id == id);
    }

    public async Task AddAsync(Group group)
    {
        _db.Groups.Add(group);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(Group group)
    {
        _db.Groups.Update(group);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Group group)
    {
        _db.Groups.Remove(group);
        await _db.SaveChangesAsync();
    }
}
