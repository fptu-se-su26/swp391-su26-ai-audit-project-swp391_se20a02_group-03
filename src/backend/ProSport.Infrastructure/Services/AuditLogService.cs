using Microsoft.EntityFrameworkCore;
using ProSport.Application.DTOs.Owner;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Services;

public class AuditLogService : IAuditLogService
{
    private readonly ProSportDbContext _db;

    public AuditLogService(ProSportDbContext db)
    {
        _db = db;
    }

    public async Task LogAsync(int? actorUserId, string action, string entityType, string entityId, int? complexId = null, string? oldValues = null, string? newValues = null)
    {
        _db.AuditLogs.Add(new AuditLog
        {
            ActorUserId = actorUserId,
            Action = action,
            EntityType = entityType,
            EntityId = entityId,
            ComplexId = complexId,
            OldValues = oldValues,
            NewValues = newValues,
            CreatedAt = DateTime.UtcNow
        });
        await _db.SaveChangesAsync();
    }

    public async Task<(List<AuditLogDto> Items, int Total)> GetPagedAsync(AuditLogQueryDto query)
    {
        var q = _db.AuditLogs.AsNoTracking().Where(a => a.ComplexId == query.ComplexId);
        if (!string.IsNullOrWhiteSpace(query.EntityType))
            q = q.Where(a => a.EntityType == query.EntityType);
        if (query.From.HasValue)
            q = q.Where(a => a.CreatedAt >= query.From.Value);
        if (query.To.HasValue)
            q = q.Where(a => a.CreatedAt <= query.To.Value);

        var total = await q.CountAsync();
        var items = await q.OrderByDescending(a => a.CreatedAt)
            .Skip((query.Page - 1) * query.Size).Take(query.Size)
            .Select(a => new AuditLogDto
            {
                AuditLogId = a.AuditLogId,
                ActorUserId = a.ActorUserId,
                Action = a.Action,
                EntityType = a.EntityType,
                EntityId = a.EntityId,
                ComplexId = a.ComplexId,
                OldValues = a.OldValues,
                NewValues = a.NewValues,
                CreatedAt = a.CreatedAt
            }).ToListAsync();
        return (items, total);
    }
}
