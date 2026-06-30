using ProSport.Application.DTOs.Owner;
using ProSport.Application.Exceptions;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;

namespace ProSport.Application.Services;

public class OwnerAccessService : IOwnerAccessService
{
    private readonly IComplexOwnerRepository _complexOwnerRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICourtRepository _courtRepository;
    private readonly IBookingRepository _bookingRepository;
    private readonly IRentalSessionRepository _rentalSessionRepository;

    public OwnerAccessService(
        IComplexOwnerRepository complexOwnerRepository,
        IUserRepository userRepository,
        ICourtRepository courtRepository,
        IBookingRepository bookingRepository,
        IRentalSessionRepository rentalSessionRepository)
    {
        _complexOwnerRepository = complexOwnerRepository;
        _userRepository = userRepository;
        _courtRepository = courtRepository;
        _bookingRepository = bookingRepository;
        _rentalSessionRepository = rentalSessionRepository;
    }

    public async Task<OwnerContextDto> GetOwnerContextAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId)
            ?? throw new OwnerResourceNotFoundException("Không tìm thấy người dùng.");

        var complexOwners = await _complexOwnerRepository.GetByUserIdAsync(userId);

        var dto = new OwnerContextDto
        {
            User = new OwnerUserDto
            {
                UserId = user.UserId,
                FullName = user.FullName,
                Email = user.Email
            },
            Role = user.Role,
            ManagedComplexes = complexOwners.Select(co => new ComplexDto
            {
                ComplexId = co.Complex.ComplexId,
                Name = co.Complex.Name,
                Address = co.Complex.Address,
                LogoUrl = co.Complex.LogoUrl,
                IsPrimary = co.IsPrimary
            }).ToList()
        };

        var primary = complexOwners.FirstOrDefault(co => co.IsPrimary) ?? complexOwners.FirstOrDefault();
        if (primary != null)
        {
            dto.CurrentComplex = dto.ManagedComplexes.First(c => c.ComplexId == primary.ComplexId);
            dto.DefaultComplexId = primary.ComplexId;
        }

        return dto;
    }

    public Task<bool> CanManageComplexAsync(int userId, int complexId) =>
        HasAccessToComplexAsync(userId, complexId);

    public async Task<bool> HasAccessToComplexAsync(int userId, int complexId)
    {
        return await _complexOwnerRepository.IsUserOwnerOfComplexAsync(userId, complexId);
    }

    public async Task<int> GetPrimaryComplexIdAsync(int userId)
    {
        var primary = await _complexOwnerRepository.GetPrimaryByUserIdAsync(userId);
        if (primary == null)
        {
            var all = await _complexOwnerRepository.GetByUserIdAsync(userId);
            primary = all.FirstOrDefault();
        }

        if (primary == null)
            throw new OwnerAccessDeniedException("Bạn chưa được cấp quyền quản lý bất kỳ tổ hợp sân nào.");

        return primary.ComplexId;
    }

    public async Task<IReadOnlyList<int>> GetManagedComplexIdsAsync(int userId)
    {
        var owners = await _complexOwnerRepository.GetByUserIdAsync(userId);
        return owners.Select(o => o.ComplexId).ToList();
    }

    public async Task RequireOwnerRoleAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId)
            ?? throw new OwnerAccessDeniedException();

        if (user.Role != Roles.CourtOwner && user.Role != Roles.Admin)
            throw new OwnerAccessDeniedException("Chỉ Chủ sân hoặc Quản trị viên mới có quyền truy cập.");
    }

    public async Task RequireComplexAccessAsync(int userId, int complexId, bool isAdmin = false)
    {
        if (isAdmin) return;
        if (!await HasAccessToComplexAsync(userId, complexId))
            throw new OwnerAccessDeniedException();
    }

    public async Task RequireOwnerOrAdminAccessAsync(int userId, int complexId, bool isAdmin)
    {
        await RequireComplexAccessAsync(userId, complexId, isAdmin);
    }

    public async Task RequireCourtAccessAsync(int userId, int courtId, bool isAdmin)
    {
        if (isAdmin) return;

        var court = await _courtRepository.GetByIdAsync(courtId)
            ?? throw new OwnerResourceNotFoundException("Không tìm thấy sân.");

        if (!court.ComplexId.HasValue)
            throw new OwnerResourceNotFoundException("Không tìm thấy sân.");

        if (!await HasAccessToComplexAsync(userId, court.ComplexId.Value))
            throw new OwnerResourceNotFoundException("Không tìm thấy sân.");
    }

    public async Task RequireBookingAccessAsync(int userId, int bookingId, bool isAdmin)
    {
        if (isAdmin) return;

        var booking = await _bookingRepository.GetByIdAsync(bookingId)
            ?? throw new OwnerResourceNotFoundException("Không tìm thấy booking.");

        var complexIds = await GetManagedComplexIdsAsync(userId);
        if (complexIds.Count == 0)
            throw new OwnerAccessDeniedException();

        var courtIds = booking.BookingDetails?.Select(d => d.CourtId).Distinct().ToList() ?? new List<int>();
        if (courtIds.Count == 0)
            throw new OwnerResourceNotFoundException("Không tìm thấy booking.");

        foreach (var courtId in courtIds)
        {
            var court = await _courtRepository.GetByIdAsync(courtId);
            if (court?.ComplexId == null || !complexIds.Contains(court.ComplexId.Value))
                throw new OwnerAccessDeniedException("Bạn không có quyền truy cập booking này.");
        }
    }

    public async Task RequireRentalAccessAsync(int userId, int rentalSessionId, bool isAdmin)
    {
        if (isAdmin) return;

        var complexId = await _rentalSessionRepository.GetComplexIdBySessionIdAsync(rentalSessionId)
            ?? throw new OwnerResourceNotFoundException("Không tìm thấy phiên thuê.");

        if (!await HasAccessToComplexAsync(userId, complexId))
            throw new OwnerResourceNotFoundException("Không tìm thấy phiên thuê.");
    }
}
