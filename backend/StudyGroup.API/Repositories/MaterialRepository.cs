using Microsoft.EntityFrameworkCore;
using StudyGroup.API.Data;
using StudyGroup.API.Models;
using StudyGroup.API.Repositories.Interfaces;

namespace StudyGroup.API.Repositories;

public class MaterialRepository : IMaterialRepository
{
    private readonly AppDbContext _db;
    public MaterialRepository(AppDbContext db) => _db = db;

    public Task<Material?> GetByIdAsync(Guid id) =>
        _db.Materials
            .Include(m => m.UploadedBy)
            .Include(m => m.Group)
            .FirstOrDefaultAsync(m => m.Id == id);

    public Task<List<Material>> GetByGroupAsync(Guid groupId) =>
        _db.Materials
            .Include(m => m.UploadedBy)
            .Include(m => m.Group)
            .Where(m => m.GroupId == groupId)
            .OrderByDescending(m => m.UploadedAt)
            .ToListAsync();

    public async Task AddAsync(Material material)
    {
        await _db.Materials.AddAsync(material);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(Material material)
    {
        _db.Materials.Update(material);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Material material)
    {
        _db.Materials.Remove(material);
        await _db.SaveChangesAsync();
    }
} 
