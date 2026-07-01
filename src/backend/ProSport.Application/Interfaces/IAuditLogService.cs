using ProSport.Application.DTOs.Owner;

namespace ProSport.Application.Interfaces;

public interface IAuditLogService
{
    Task LogAsync(int? actorUserId, string action, string entityType, string entityId, int? complexId = null, string? oldValues = null, string? newValues = null);
    Task<(List<AuditLogDto> Items, int Total)> GetPagedAsync(AuditLogQueryDto query);
}