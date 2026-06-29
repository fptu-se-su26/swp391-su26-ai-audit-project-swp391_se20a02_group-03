using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;

namespace ProSport.Application.Services;

public class ReportService : IReportService
{
    private static readonly string[] AllowedStatuses = { "Investigating", "Resolved", "Rejected" };
    private static readonly string[] StaffAllowedStatuses = { "Investigating" };

    private readonly IReportRepository _repository;
    private readonly IUserRepository _userRepository;

    public ReportService(IReportRepository repository, IUserRepository userRepository)
    {
        _repository = repository;
        _userRepository = userRepository;
    }

    private static ReportDto Map(Report r) => new ReportDto
    {
        ReportId = r.ReportId,
        ReporterId = r.ReporterId,
        ReportedUserId = r.ReportedUserId,
        MatchId = r.MatchId,
        Reason = r.Reason,
        Evidence = r.Evidence,
        Status = r.Status,
        AdminNote = r.AdminNote,
        ResolvedByAdminId = r.ResolvedByAdminId,
        ReporterName = r.Reporter?.FullName,
        ReportedUserName = r.ReportedUser?.FullName,
        CreatedAt = r.CreatedAt
    };

    public async Task<ApiResponseDto<ReportDto>> CreateAsync(int reporterId, CreateReportDto dto)
    {
        if (reporterId == dto.ReportedUserId)
            return new ApiResponseDto<ReportDto>(400, "Bạn không thể tự báo cáo chính mình.");

        var reported = await _userRepository.GetByIdAsync(dto.ReportedUserId);
        if (reported is null)
            return new ApiResponseDto<ReportDto>(404, "Không tìm thấy người bị báo cáo.");

        var duplicated = await _repository.ExistsAsync(reporterId, dto.ReportedUserId, dto.MatchId);
        if (duplicated)
            return new ApiResponseDto<ReportDto>(409, "Bạn đã báo cáo người này trong trận đấu này rồi.");

        var report = new Report
        {
            ReporterId = reporterId,
            ReportedUserId = dto.ReportedUserId,
            MatchId = dto.MatchId,
            Reason = dto.Reason,
            Evidence = dto.Evidence,
            Status = "Pending"
        };

        await _repository.AddAsync(report);
        return new ApiResponseDto<ReportDto>(201, "Gửi khiếu nại thành công.", Map(report));
    }

    public async Task<ApiResponseDto<List<ReportDto>>> GetAllAsync(string? status = null)
    {
        var items = await _repository.GetAllAsync(status);
        return new ApiResponseDto<List<ReportDto>>(200, "Lấy danh sách khiếu nại thành công.", items.Select(Map).ToList());
    }

    public async Task<ApiResponseDto<List<ReportDto>>> GetMyReportsAsync(int reporterId)
    {
        var items = await _repository.GetByReporterAsync(reporterId);
        return new ApiResponseDto<List<ReportDto>>(200, "Thành công.", items.Select(Map).ToList());
    }

    public async Task<ApiResponseDto<ReportDto>> ResolveAsync(int reportId, int resolverId, string resolverRole, ResolveReportDto dto)
    {
        if (!AllowedStatuses.Contains(dto.Status))
            return new ApiResponseDto<ReportDto>(400, "Trạng thái không hợp lệ. Chỉ chấp nhận: Investigating, Resolved, Rejected.");

        var isAdmin = string.Equals(resolverRole, "Admin", StringComparison.OrdinalIgnoreCase);
        if (!isAdmin && !StaffAllowedStatuses.Contains(dto.Status))
            return new ApiResponseDto<ReportDto>(403, "Nhân viên chỉ được chuyển trạng thái sang Investigating. Admin mới được Resolved/Rejected.");

        var report = await _repository.GetByIdAsync(reportId);
        if (report is null)
            return new ApiResponseDto<ReportDto>(404, "Không tìm thấy khiếu nại.");

        report.Status = dto.Status;
        report.AdminNote = dto.AdminNote;
        report.ResolvedByAdminId = resolverId;

        await _repository.UpdateAsync(report);
        return new ApiResponseDto<ReportDto>(200, "Cập nhật khiếu nại thành công.", Map(report));
    }
}
