using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ProSport.Application.DTOs;
using ProSport.Application.DTOs.Owner;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Services;

public class OwnerRentalService : IOwnerRentalService
{
    private readonly ProSportDbContext _db;
    private readonly IAuditLogService _auditLog;

    public OwnerRentalService(ProSportDbContext db, IAuditLogService auditLog)
    {
        _db = db;
        _auditLog = auditLog;
    }

    public async Task<ApiResponseDto<PagedResult<RentalSessionDto>>> GetRentalsAsync(OwnerRentalQueryDto query)
    {
        var q = _db.RentalSessions.AsNoTracking()
            .Include(r => r.Customer)
            .Include(r => r.Staff)
            .Where(r => r.ComplexId == query.ComplexId && !r.IsDeleted);

        if (!string.IsNullOrWhiteSpace(query.Status))
            q = q.Where(r => r.Status == query.Status);
        if (query.BookingId.HasValue)
            q = q.Where(r => r.BookingId == query.BookingId);

        if (!string.IsNullOrWhiteSpace(query.Keyword))
        {
            var kw = query.Keyword.Trim();
            q = q.Where(r => r.Customer.FullName.Contains(kw));
        }

        var total = await q.CountAsync();
        var ids = await q.OrderByDescending(r => r.CreatedAt)
            .Skip((query.Page - 1) * query.Size).Take(query.Size)
            .Select(r => r.RentalSessionId).ToListAsync();

        var items = await _db.RentalSessions.AsNoTracking()
            .Include(x => x.Customer)
            .Include(x => x.Staff)
            .Include(x => x.SessionAssets).ThenInclude(sa => sa.RentalAsset).ThenInclude(a => a.ProductStock)
            .Include(x => x.ConditionChecks).ThenInclude(c => c.Staff)
            .Include(x => x.Surcharges).ThenInclude(s => s.AppliedBy)
            .Where(r => ids.Contains(r.RentalSessionId))
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return new ApiResponseDto<PagedResult<RentalSessionDto>>(200, "Success", new PagedResult<RentalSessionDto>
        {
            Items = items.Select(MapSessionDetail).ToList(),
            TotalCount = total,
            CurrentPage = query.Page,
            TotalPages = (int)Math.Ceiling(total / (double)Math.Max(query.Size, 1))
        });
    }

    public async Task<ApiResponseDto<RentalSessionDto>> GetRentalByIdAsync(int id, int complexId)
    {
        var exists = await _db.RentalSessions.AnyAsync(r => r.RentalSessionId == id && r.ComplexId == complexId && !r.IsDeleted);
        if (!exists) return new ApiResponseDto<RentalSessionDto>(404, "Không tìm thấy phiên thuê.");
        return new ApiResponseDto<RentalSessionDto>(200, "Success", MapSessionDetail(await LoadSessionDetail(id)));
    }

    public async Task<ApiResponseDto<RentalSessionDto>> CreateRentalAsync(int actorUserId, CreateRentalSessionDto dto)
    {
        if (dto.RentalAssetIds == null || dto.RentalAssetIds.Count == 0)
            return new ApiResponseDto<RentalSessionDto>(400, "Phải chọn ít nhất một asset.");

        await using var tx = await _db.Database.BeginTransactionAsync();
        try
        {
            var assets = await _db.RentalAssets
                .Include(a => a.ProductStock)
                .Where(a => dto.RentalAssetIds.Contains(a.RentalAssetId) && a.ComplexId == dto.ComplexId && !a.IsDeleted)
                .ToListAsync();

            if (assets.Count != dto.RentalAssetIds.Count)
                return new ApiResponseDto<RentalSessionDto>(404, "Một hoặc nhiều asset không thuộc tổ hợp.");

            foreach (var asset in assets)
            {
                if (!RentalAssetStatuses.CanRent(asset.Status))
                    return new ApiResponseDto<RentalSessionDto>(409, $"Asset {asset.AssetCode} không khả dụng (trạng thái {asset.Status}).");
            }

            var session = new RentalSession
            {
                ComplexId = dto.ComplexId,
                BookingId = dto.BookingId,
                CustomerUserId = dto.CustomerUserId,
                StaffUserId = actorUserId,
                Status = "Active",
                RentalFee = dto.RentalFee,
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false
            };
            _db.RentalSessions.Add(session);
            await _db.SaveChangesAsync();

            foreach (var asset in assets)
            {
                asset.Status = RentalAssetStatuses.Rented;
                asset.UpdatedAt = DateTime.UtcNow;
                _db.RentalSessionAssets.Add(new RentalSessionAsset
                {
                    RentalSessionId = session.RentalSessionId,
                    RentalAssetId = asset.RentalAssetId,
                    BeforeCondition = asset.Condition,
                    RentalPriceAtTime = asset.ProductStock.SellingPrice
                });
            }
            await _db.SaveChangesAsync();
            await tx.CommitAsync();

            await _auditLog.LogAsync(actorUserId, "CREATE", "RentalSession", session.RentalSessionId.ToString(), dto.ComplexId,
                null, JsonSerializer.Serialize(dto.RentalAssetIds));

            return new ApiResponseDto<RentalSessionDto>(201, "Tạo phiên thuê thành công.", MapSessionDetail(await LoadSessionDetail(session.RentalSessionId)));
        }
        catch
        {
            await tx.RollbackAsync();
            throw;
        }
    }

    public async Task<ApiResponseDto<List<ConditionCheckDto>>> GetConditionHistoryAsync(int rentalId, int complexId)
    {
        if (!await SessionBelongsToComplex(rentalId, complexId))
            return new ApiResponseDto<List<ConditionCheckDto>>(404, "Không tìm thấy phiên thuê.");

        var checks = await _db.ConditionChecks.AsNoTracking()
            .Include(c => c.Staff)
            .Include(c => c.RentalAsset)
            .Where(c => c.RentalSessionId == rentalId)
            .OrderBy(c => c.CreatedAt)
            .Select(c => new ConditionCheckDto
            {
                ConditionCheckId = c.ConditionCheckId,
                RentalAssetId = c.RentalAssetId,
                AssetCode = c.RentalAsset.AssetCode,
                CheckType = c.CheckType,
                Condition = c.Condition,
                ImageUrls = c.ImageUrls,
                Notes = c.Notes,
                StaffName = c.Staff.FullName,
                IsFinal = c.IsFinal,
                CreatedAt = c.CreatedAt
            }).ToListAsync();

        return new ApiResponseDto<List<ConditionCheckDto>>(200, "Success", checks);
    }

    public async Task<ApiResponseDto<ConditionCheckDto>> AddConditionCheckAsync(int actorUserId, int rentalId, int complexId, CreateConditionCheckDto dto)
    {
        var session = await _db.RentalSessions
            .Include(r => r.SessionAssets)
            .FirstOrDefaultAsync(r => r.RentalSessionId == rentalId && r.ComplexId == complexId && !r.IsDeleted);
        if (session == null) return new ApiResponseDto<ConditionCheckDto>(404, "Không tìm thấy phiên thuê.");
        if (session.Status == "Completed")
            return new ApiResponseDto<ConditionCheckDto>(400, "Không thể sửa condition history sau khi hoàn tất.");

        var sessionAsset = session.SessionAssets.FirstOrDefault(a => a.RentalAssetId == dto.RentalAssetId);
        if (sessionAsset == null)
            return new ApiResponseDto<ConditionCheckDto>(404, "Asset không thuộc phiên thuê này.");

        var asset = await _db.RentalAssets.FindAsync(dto.RentalAssetId);
        if (asset == null) return new ApiResponseDto<ConditionCheckDto>(404, "Không tìm thấy asset.");

        var check = new ConditionCheck
        {
            RentalSessionId = rentalId,
            RentalAssetId = dto.RentalAssetId,
            CheckType = dto.CheckType,
            Condition = dto.Condition,
            ImageUrls = dto.ImageUrls,
            Notes = dto.Notes,
            StaffUserId = actorUserId,
            IsFinal = dto.MarkFinal,
            CreatedAt = DateTime.UtcNow
        };
        _db.ConditionChecks.Add(check);

        asset.LastConditionCheck = DateTime.UtcNow;
        asset.Condition = dto.Condition;

        if (dto.CheckType.Equals("After", StringComparison.OrdinalIgnoreCase))
            sessionAsset.AfterCondition = dto.Condition;

        if (dto.MarkFinal)
        {
            if (dto.Condition.Equals("Damaged", StringComparison.OrdinalIgnoreCase))
            {
                asset.Status = RentalAssetStatuses.Damaged;
            }
            else
            {
                asset.Status = RentalAssetStatuses.Available;
                asset.RentCount += 1;
            }
            session.Status = "Completed";
            session.CompletedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();
        await _auditLog.LogAsync(actorUserId, "CONDITION_CHECK", "RentalSession", rentalId.ToString(), complexId,
            null, JsonSerializer.Serialize(new { dto.RentalAssetId, dto.Condition, dto.MarkFinal }));

        var staff = await _db.Users.FindAsync(actorUserId);
        return new ApiResponseDto<ConditionCheckDto>(201, "Ghi nhận kiểm tra thành công.", new ConditionCheckDto
        {
            ConditionCheckId = check.ConditionCheckId,
            RentalAssetId = check.RentalAssetId,
            AssetCode = asset.AssetCode,
            CheckType = check.CheckType,
            Condition = check.Condition,
            ImageUrls = check.ImageUrls,
            Notes = check.Notes,
            StaffName = staff?.FullName ?? "",
            IsFinal = check.IsFinal,
            CreatedAt = check.CreatedAt
        });
    }

    public async Task<ApiResponseDto<RentalSurchargeDto>> AddSurchargeAsync(int actorUserId, int rentalId, int complexId, CreateRentalSurchargeDto dto)
    {
        if (dto.Amount <= 0 || string.IsNullOrWhiteSpace(dto.Reason))
            return new ApiResponseDto<RentalSurchargeDto>(400, "Surcharge phải có amount > 0 và reason.");

        var session = await _db.RentalSessions.FirstOrDefaultAsync(r => r.RentalSessionId == rentalId && r.ComplexId == complexId && !r.IsDeleted);
        if (session == null) return new ApiResponseDto<RentalSurchargeDto>(404, "Không tìm thấy phiên thuê.");

        var surcharge = new RentalSurcharge
        {
            RentalSessionId = rentalId,
            Amount = dto.Amount,
            Reason = dto.Reason.Trim(),
            AppliedByUserId = actorUserId,
            CreatedAt = DateTime.UtcNow
        };
        _db.RentalSurcharges.Add(surcharge);
        session.SurchargeTotal += dto.Amount;
        session.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        await _auditLog.LogAsync(actorUserId, "SURCHARGE", "RentalSession", rentalId.ToString(), complexId,
            null, JsonSerializer.Serialize(new { dto.Amount, dto.Reason }));

        var staff = await _db.Users.FindAsync(actorUserId);
        return new ApiResponseDto<RentalSurchargeDto>(201, "Áp dụng surcharge thành công.", new RentalSurchargeDto
        {
            RentalSurchargeId = surcharge.RentalSurchargeId,
            Amount = surcharge.Amount,
            Reason = surcharge.Reason,
            AppliedByName = staff?.FullName ?? "",
            CreatedAt = surcharge.CreatedAt
        });
    }

    private async Task<bool> SessionBelongsToComplex(int rentalId, int complexId) =>
        await _db.RentalSessions.AnyAsync(r => r.RentalSessionId == rentalId && r.ComplexId == complexId && !r.IsDeleted);

    private Task<RentalSession> LoadSessionDetail(int id) =>
        _db.RentalSessions.AsNoTracking()
            .Include(x => x.Customer)
            .Include(x => x.Staff)
            .Include(x => x.SessionAssets).ThenInclude(sa => sa.RentalAsset).ThenInclude(a => a.ProductStock)
            .Include(x => x.ConditionChecks).ThenInclude(c => c.Staff)
            .Include(x => x.Surcharges).ThenInclude(s => s.AppliedBy)
            .FirstAsync(x => x.RentalSessionId == id);

    private static RentalSessionDto MapSessionDetail(RentalSession r) => new()
        {
            RentalSessionId = r.RentalSessionId,
            ComplexId = r.ComplexId,
            BookingId = r.BookingId,
            CustomerName = r.Customer.FullName,
            StaffName = r.Staff?.FullName,
            Status = r.Status,
            RentalFee = r.RentalFee,
            SurchargeTotal = r.SurchargeTotal,
            CreatedAt = r.CreatedAt,
            CompletedAt = r.CompletedAt,
            Assets = r.SessionAssets.Select(sa => new RentalSessionAssetDto
            {
                RentalAssetId = sa.RentalAssetId,
                AssetCode = sa.RentalAsset.AssetCode,
                ProductName = sa.RentalAsset.ProductStock?.ProductName ?? "",
                RentalPriceAtTime = sa.RentalPriceAtTime,
                BeforeCondition = sa.BeforeCondition,
                AfterCondition = sa.AfterCondition
            }).ToList(),
            ConditionHistory = r.ConditionChecks.OrderBy(c => c.CreatedAt).Select(c => new ConditionCheckDto
            {
                ConditionCheckId = c.ConditionCheckId,
                RentalAssetId = c.RentalAssetId,
                AssetCode = c.RentalAsset?.AssetCode ?? "",
                CheckType = c.CheckType,
                Condition = c.Condition,
                ImageUrls = c.ImageUrls,
                Notes = c.Notes,
                StaffName = c.Staff?.FullName ?? "",
                IsFinal = c.IsFinal,
                CreatedAt = c.CreatedAt
            }).ToList(),
            Surcharges = r.Surcharges.Select(s => new RentalSurchargeDto
            {
                RentalSurchargeId = s.RentalSurchargeId,
                Amount = s.Amount,
                Reason = s.Reason,
                AppliedByName = s.AppliedBy?.FullName ?? "",
                CreatedAt = s.CreatedAt
            }).ToList()
        };
}
