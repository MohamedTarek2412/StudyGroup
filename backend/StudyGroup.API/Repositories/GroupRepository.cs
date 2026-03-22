using Microsoft.EntityFrameworkCore;
using StudyGroup.API.Data;
using StudyGroup.API.Models;
using StudyGroup.API.Repositories.Interfaces;

namespace StudyGroup.API.Repositories;

public class GroupRepository : IGroupRepository
{
    private readonly AppDbContext _db;
    public GroupRepository(AppDbContext db) => _db = db;

    public Task<Group?> GetByIdAsync(Guid id) =>
        _db.Groups.Include(g => g.Owner)
                  .Include(g => g.JoinRequests)
                  .FirstOrDefaultAsync(g => g.Id == id);

    public Task<List<Group>> GetAllApprovedAsync(string? subject, string? search)
    {
        var q = _db.Groups.Include(g => g.Owner)
                          .Include(g => g.JoinRequests)
                          .Where(g => g.IsApproved);

        if (!string.IsNullOrWhiteSpace(subject))
            q = q.Where(g => g.Subject.ToLower().Contains(subject.ToLower()));

        if (!string.IsNullOrWhiteSpace(search))
            q = q.Where(g => g.Name.ToLower().Contains(search.ToLower()) ||
                              g.Description.ToLower().Contains(search.ToLower()));

        return q.OrderByDescending(g => g.CreatedAt).ToListAsync();
    }

    public Task<List<Group>> GetByOwnerAsync(Guid ownerId) =>
        _db.Groups.Include(g => g.Owner)
                  .Include(g => g.JoinRequests)
                  .Where(g => g.OwnerId == ownerId)
                  .OrderByDescending(g => g.CreatedAt)
                  .ToListAsync();

    public Task<List<Group>> GetPendingAsync() =>
        _db.Groups.Include(g => g.Owner)
                  .Where(g => !g.IsApproved)
                  .OrderBy(g => g.CreatedAt)
                  .ToListAsync();

    public async Task AddAsync(Group group) { await _db.Groups.AddAsync(group); await _db.SaveChangesAsync(); }
    public async Task UpdateAsync(Group group) { _db.Groups.Update(group); await _db.SaveChangesAsync(); }
    public async Task DeleteAsync(Group group) { _db.Groups.Remove(group); await _db.SaveChangesAsync(); }
}