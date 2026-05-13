using Microsoft.EntityFrameworkCore;
using StudyGroup.API.Data;
using StudyGroup.API.Models;
using StudyGroup.API.Repositories.Interfaces;

namespace StudyGroup.API.Repositories;

public class DiscussionRepository : IDiscussionRepository
{
    private readonly AppDbContext _db;
    public DiscussionRepository(AppDbContext db) => _db = db;

    public Task<List<DiscussionMessage>> GetByGroupAsync(Guid groupId, int skip, int take) =>
        _db.DiscussionMessages
            .Include(m => m.Sender)
            .Include(m => m.Group)
            .Where(m => m.GroupId == groupId)
            .OrderByDescending(m => m.SentAt)
            .Skip(skip)
            .Take(take)
            .ToListAsync();

    public Task<DiscussionMessage?> GetByIdAsync(Guid id) =>
        _db.DiscussionMessages
            .Include(m => m.Sender)
            .Include(m => m.Group)
            .FirstOrDefaultAsync(m => m.Id == id);

    public async Task AddAsync(DiscussionMessage message)
    {
        await _db.DiscussionMessages.AddAsync(message);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(DiscussionMessage message)
    {
        _db.DiscussionMessages.Remove(message);
        await _db.SaveChangesAsync();
    }
} 
