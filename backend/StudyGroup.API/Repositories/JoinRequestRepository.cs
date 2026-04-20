 using Microsoft.EntityFrameworkCore;
using StudyGroup.API.Data;
using StudyGroup.API.Models;
using StudyGroup.API.Repositories.Interfaces;

namespace StudyGroup.API.Repositories;

public class JoinRequestRepository : IJoinRequestRepository
{
    private readonly AppDbContext _db;
    public JoinRequestRepository(AppDbContext db) => _db = db;

    public Task<JoinRequest?> GetByIdAsync(Guid id) =>
        _db.JoinRequests.Include(jr => jr.User).Include(jr => jr.Group)
                        .FirstOrDefaultAsync(jr => jr.Id == id);

    public Task<JoinRequest?> GetByUserAndGroupAsync(Guid userId, Guid groupId) =>
        _db.JoinRequests.FirstOrDefaultAsync(jr => jr.UserId == userId && jr.GroupId == groupId);

    public Task<List<JoinRequest>> GetByGroupAsync(Guid groupId) =>
        _db.JoinRequests.Include(jr => jr.User).Include(jr => jr.Group)
                        .Where(jr => jr.GroupId == groupId).ToListAsync();

    public Task<List<JoinRequest>> GetByUserAsync(Guid userId) =>
        _db.JoinRequests.Include(jr => jr.Group)
                        .Where(jr => jr.UserId == userId).ToListAsync();

    public async Task AddAsync(JoinRequest request) { await _db.JoinRequests.AddAsync(request); await _db.SaveChangesAsync(); }
    public async Task UpdateAsync(JoinRequest request) { _db.JoinRequests.Update(request); await _db.SaveChangesAsync(); }
}