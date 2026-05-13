using Microsoft.EntityFrameworkCore;
using StudyGroup.API.Data;

namespace StudyGroup.API.Repositories.Generic;

/// <summary>
/// Generic read helper (course: at least one generic repository abstraction).
/// </summary>
public interface IReadRepository<TEntity> where TEntity : class
{
    Task<TEntity?> FindByIdAsync(Guid id, CancellationToken cancellationToken = default);
}

public class ReadRepository<TEntity> : IReadRepository<TEntity> where TEntity : class
{
    protected readonly AppDbContext Db;

    public ReadRepository(AppDbContext db) => Db = db;

    public virtual async Task<TEntity?> FindByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await Db.Set<TEntity>().FindAsync([id], cancellationToken);
    }
}
