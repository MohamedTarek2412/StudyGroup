using Microsoft.EntityFrameworkCore;
using StudyGroup.API.Data;
using StudyGroup.API.Models;
using StudyGroup.API.Repositories.Interfaces;

namespace StudyGroup.API.Repositories;

public class RoleRepository : IRoleRepository
{
    private readonly AppDbContext _db;
    public RoleRepository(AppDbContext db) => _db = db;

    public Task<Role?> GetByNameAsync(string name) =>
        _db.Roles.FirstOrDefaultAsync(r => r.Name == name);
}