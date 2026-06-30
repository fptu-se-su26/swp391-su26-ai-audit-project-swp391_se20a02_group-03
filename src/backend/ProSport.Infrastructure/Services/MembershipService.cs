using Microsoft.EntityFrameworkCore;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Services;

public class MembershipService : IMembershipService
{
    private static readonly HashSet<string> AllowedStatuses = new(StringComparer.OrdinalIgnoreCase)
    {
        "Active", "Expired", "Cancelled"
    };

    private readonly ProSportDbContext _db;
    private readonly IOwnerAccessService _ownerAccess;

    public MembershipService(ProSportDbContext db, IOwnerAccessService ownerAccess)
    {
        _db = db;
        _ownerAccess = ownerAccess;
    }

    public async Task<ApiResponseDto<IEnumerable<MembershipDto>>> GetMyMembershipsAsync(int userId)
    {
        var today = DateTime.UtcNow.Date;
        var rows = await _db.Memberships.AsNoTracking()
            .Include(m => m.Complex)
            .Include(m => m.User)
            .Where(m => m.UserId == userId && m.Status == "Active" && m.ValidTo >= today && !m.IsDeleted)
            .OrderByDescending(m => m.ValidTo)
            .ToListAsync();

        return new ApiResponseDto<IEnumerable<MembershipDto>>(200, "Success", rows.Select(Map));
    }

    public async Task<ApiResponseDto<IEnumerable<MembershipDto>>> GetByComplexAsync(int complexId)
    {
        var rows = await _db.Memberships.AsNoTracking()
            .Include(m => m.Complex)
            .Include(m => m.User)
            .Where(m => m.ComplexId == complexId && !m.IsDeleted)
            .OrderByDescending(m => m.CreatedAt)
            .ToListAsync();

        return new ApiResponseDto<IEnumerable<MembershipDto>>(200, "Success", rows.Select(Map));
    }

    public async Task<ApiResponseDto<MembershipDto>> CreateAsync(int actorUserId, int complexId, CreateMembershipDto dto, bool isAdmin = false)
    {
        await _ownerAccess.RequireComplexAccessAsync(actorUserId, complexId, isAdmin);

        if (dto.ValidTo <= dto.ValidFrom)
            return new ApiResponseDto<MembershipDto>(400, "ValidTo phải sau ValidFrom.");

        var userExists = await _db.Users.AnyAsync(u => u.UserId == dto.UserId && !u.IsDeleted);
        if (!userExists)
            return new ApiResponseDto<MembershipDto>(404, "Không tìm thấy người dùng.");

        var overlap = await _db.Memberships.AnyAsync(m =>
            m.UserId == dto.UserId
            && m.ComplexId == complexId
            && m.Status == "Active"
            && !m.IsDeleted
            && m.ValidFrom <= dto.ValidTo
            && m.ValidTo >= dto.ValidFrom);
        if (overlap)
            return new ApiResponseDto<MembershipDto>(409, "Người dùng đã có membership trùng thời gian tại tổ hợp này.");

        var membership = new Membership
        {
            UserId = dto.UserId,
            ComplexId = complexId,
            Tier = dto.Tier.Trim(),
            DiscountPercent = dto.DiscountPercent,
            ValidFrom = dto.ValidFrom.Date,
            ValidTo = dto.ValidTo.Date,
            Status = "Active"
        };

        _db.Memberships.Add(membership);
        await _db.SaveChangesAsync();

        await _db.Entry(membership).Reference(m => m.User).LoadAsync();
        await _db.Entry(membership).Reference(m => m.Complex).LoadAsync();

        return new ApiResponseDto<MembershipDto>(201, "Tạo membership thành công.", Map(membership));
    }

    public async Task<ApiResponseDto<bool>> UpdateStatusAsync(int actorUserId, int complexId, int membershipId, string status, bool isAdmin = false)
    {
        await _ownerAccess.RequireComplexAccessAsync(actorUserId, complexId, isAdmin);

        if (!AllowedStatuses.Contains(status))
            return new ApiResponseDto<bool>(400, "Status không hợp lệ.");

        var membership = await _db.Memberships.FirstOrDefaultAsync(m =>
            m.MembershipId == membershipId && m.ComplexId == complexId && !m.IsDeleted);
        if (membership == null)
            return new ApiResponseDto<bool>(404, "Không tìm thấy membership.");

        membership.Status = status;
        membership.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return new ApiResponseDto<bool>(200, "Cập nhật membership thành công.", true);
    }

    public async Task<decimal> GetActiveDiscountPercentAsync(int userId, int complexId, DateTime? asOf = null)
    {
        var today = (asOf ?? DateTime.UtcNow).Date;
        var membership = await _db.Memberships.AsNoTracking()
            .Where(m => m.UserId == userId
                && m.ComplexId == complexId
                && m.Status == "Active"
                && !m.IsDeleted
                && m.ValidFrom <= today
                && m.ValidTo >= today)
            .OrderByDescending(m => m.DiscountPercent)
            .FirstOrDefaultAsync();

        return membership?.DiscountPercent ?? 0m;
    }

    private static MembershipDto Map(Membership m) => new()
    {
        MembershipId = m.MembershipId,
        UserId = m.UserId,
        UserName = m.User?.FullName ?? "",
        ComplexId = m.ComplexId,
        ComplexName = m.Complex?.Name ?? "",
        Tier = m.Tier,
        DiscountPercent = m.DiscountPercent,
        ValidFrom = m.ValidFrom,
        ValidTo = m.ValidTo,
        Status = m.Status
    };
}
