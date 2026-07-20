using Microsoft.Extensions.Logging;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;

namespace ProSport.Application.Services;

public class MatchService : IMatchService
{
    private readonly IMatchRepository _matchRepository;
    private readonly IBookingRepository _bookingRepository;
    private readonly IEscrowService _escrowService;
    private readonly ICancellationPolicyService _cancellationPolicy;
    private readonly ICourtRepository _courtRepository;
    private readonly IUserRepository _userRepository;
    private readonly ILogger<MatchService> _logger;

    public MatchService(
        IMatchRepository matchRepository,
        IBookingRepository bookingRepository,
        IEscrowService escrowService,
        ICancellationPolicyService cancellationPolicy,
        ICourtRepository courtRepository,
        IUserRepository userRepository,
        ILogger<MatchService> logger)
    {
        _matchRepository = matchRepository;
        _bookingRepository = bookingRepository;
        _escrowService = escrowService;
        _cancellationPolicy = cancellationPolicy;
        _courtRepository = courtRepository;
        _userRepository = userRepository;
        _logger = logger;
    }

    public async Task<ApiResponseDto<IEnumerable<MatchDto>>> GetAvailableMatchesAsync()
    {
        var matches = await _matchRepository.GetMatchesByStatusAsync(ProSport.Domain.Constants.MatchStatus.Open);
        var dtos = matches.Select(MapToDto);
        return new ApiResponseDto<IEnumerable<MatchDto>>(200, "Success", dtos);
    }

    public async Task<ApiResponseDto<IEnumerable<MatchDto>>> GetMyMatchHistoryAsync(int userId)
    {
        var matches = await _matchRepository.GetMyMatchHistoryAsync(userId);
        var dtos = matches.Select(MapToDto);
        return new ApiResponseDto<IEnumerable<MatchDto>>(200, "Success", dtos);
    }

    public async Task<ApiResponseDto<MatchDto>> GetMatchByIdAsync(int matchId)
    {
        var match = await _matchRepository.GetMatchByIdAsync(matchId);
        if (match == null) return new ApiResponseDto<MatchDto>(404, "Không tìm thấy kèo");
        return new ApiResponseDto<MatchDto>(200, "Success", MapToDto(match));
    }

    public async Task<ApiResponseDto<MatchDto>> CreateMatchAsync(int hostId, CreateMatchDto dto)
    {
        try
        {
            var booking = await _bookingRepository.GetByIdAsync(dto.BookingId);
            if (booking == null || booking.UserId != hostId)
            {
                return new ApiResponseDto<MatchDto>(403, "Bạn không có quyền tạo kèo cho sân chưa đặt hoặc của người khác.");
            }

            // Đảm bảo Booking đã thanh toán thành công mới được tạo kèo
            if (booking.PaymentStatus != Domain.Constants.PaymentStatus.Paid)
            {
                return new ApiResponseDto<MatchDto>(400, "Bạn chỉ được đăng kèo khi Booking đã được thanh toán thành công.");
            }

            if (dto.MaxParticipants <= 0)
                return new ApiResponseDto<MatchDto>(400, "MaxParticipants must be greater than zero.");

            var match = new Match
            {
                HostId = hostId,
                CourtId = dto.CourtId,
                BookingId = dto.BookingId,
                MatchDate = dto.MatchDate,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                MaxParticipants = dto.MaxParticipants,
                CurrentParticipants = 1, // Host
                // Dùng đúng số tiền ký quỹ host đã cấu hình ở UI (dto.EscrowAmount) — trước đây
                // bị bỏ qua và tự tính lại TotalAmount/MaxParticipants, khiến số tiền hiển thị
                // cho host trước khi submit không khớp với số tiền thực sự lưu vào DB.
                EscrowAmount = dto.EscrowAmount,
                Status = ProSport.Domain.Constants.MatchStatus.Open,
                LevelRequirement = dto.LevelRequirement,
                Notes = dto.Notes
            };

            var createdMatch = await _matchRepository.CreateMatchAsync(match);
            
            // Tự động add Host vào participant
            await _matchRepository.AddParticipantAsync(new MatchParticipant
            {
                MatchId = createdMatch.MatchId,
                UserId = hostId,
                Role = ProSport.Domain.Constants.MatchParticipantRole.Host,
                Status = ProSport.Domain.Constants.MatchParticipantStatus.Approved,
                HasPaidEscrow = false // Host không cần tự cọc cho chính mình
            });

            return new ApiResponseDto<MatchDto>(201, "Tạo kèo thành công", MapToDto(createdMatch));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating match for Host {HostId}", hostId);
            return new ApiResponseDto<MatchDto>(500, "Lỗi hệ thống khi tạo kèo");
        }
    }

    public async Task<ApiResponseDto<bool>> JoinMatchAsync(int matchId, int userId)
    {
        try
        {
            // BUG 5: chặn host tự tham gia kèo của mình NGAY TẠI SERVICE — trước khi mở
            // transaction join (không đụng ví, không tạo participant). Repository vẫn giữ
            // check tương tự làm lớp phòng thủ thứ hai cho dữ liệu cũ/lệch.
            var match = await _matchRepository.GetMatchByIdAsync(matchId);
            if (match == null)
                return new ApiResponseDto<bool>(400, "Kèo không tồn tại.", false);
            if (match.HostId == userId)
                return new ApiResponseDto<bool>(400, "Chủ kèo không thể tham gia kèo của chính mình.", false);

            // TK-004: Bắt buộc xác thực E-KYC trước khi tham gia kèo ký quỹ (chống bùng kèo).
            var joiner = await _userRepository.GetByIdAsync(userId);
            if (joiner == null)
                return new ApiResponseDto<bool>(404, "Không tìm thấy tài khoản.", false);
            if (joiner.IsLocked)
                return new ApiResponseDto<bool>(403, "Tài khoản đang bị khóa.", false);
            if (!joiner.IsVerified)
                return new ApiResponseDto<bool>(403, "Tài khoản chưa xác thực E-KYC. Vui lòng hoàn tất xác thực định danh trước khi tham gia kèo.", false);

            // Delegate toàn bộ logic phức tạp (lock, validate, transaction) xuống Repository
            await _matchRepository.ExecuteJoinMatchTransactionAsync(matchId, userId);

            return new ApiResponseDto<bool>(200, "Đã gửi yêu cầu tham gia và khóa tiền ký quỹ thành công", true);
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("Giao dịch đang được xử lý"))
        {
            // Bắt lỗi Concurrency
            return new ApiResponseDto<bool>(409, ex.Message, false);
        }
        catch (InvalidOperationException ex)
        {
            // Bắt lỗi Validation nghiệp vụ khác (VD: Số dư không đủ)
            return new ApiResponseDto<bool>(400, ex.Message, false);
        }
        catch (Exception ex)
        {
            if (ex.Message == "Kèo không tồn tại." || ex.Message.Contains("không thể tham gia") || ex.Message.Contains("đủ người") || ex.Message.Contains("đã tham gia"))
            {
                return new ApiResponseDto<bool>(400, ex.Message, false);
            }

            _logger.LogError(ex, "Error joining match {MatchId} for user {UserId}", matchId, userId);
            return new ApiResponseDto<bool>(500, "Lỗi hệ thống khi xin tham gia kèo", false);
        }
    }

    public async Task<ApiResponseDto<IEnumerable<object>>> GetParticipantsByMatchAsync(int matchId, int hostId, string status)
    {
        try
        {
            var match = await _matchRepository.GetMatchByIdAsync(matchId);
            if (match == null || match.HostId != hostId)
                return new ApiResponseDto<IEnumerable<object>>(403, "Bạn không có quyền xem danh sách này", null);

            var participants = await _matchRepository.GetParticipantsByMatchAsync(matchId, status);
            var result = participants.Select(p => new
            {
                p.MatchParticipantId,
                p.MatchId,
                p.UserId,
                UserName = p.User?.FullName ?? "Unknown",
                p.Role,
                p.Status,
                p.HasPaidEscrow
            });

            return new ApiResponseDto<IEnumerable<object>>(200, "Success", result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting members for match {MatchId}", matchId);
            return new ApiResponseDto<IEnumerable<object>>(500, "Lỗi hệ thống", null);
        }
    }

    public async Task<ApiResponseDto<IEnumerable<object>>> GetMatchMembersAsync(int matchId, int requestingUserId)
    {
        try
        {
            var match = await _matchRepository.GetMatchByIdAsync(matchId);
            if (match == null)
                return new ApiResponseDto<IEnumerable<object>>(404, "Không tìm thấy kèo", null);

            var members = await _matchRepository.GetParticipantsByMatchAsync(matchId, ProSport.Domain.Constants.MatchParticipantStatus.Approved);

            var isMember = match.HostId == requestingUserId || members.Any(m => m.UserId == requestingUserId);
            if (!isMember)
                return new ApiResponseDto<IEnumerable<object>>(403, "Bạn không phải thành viên của kèo này", null);

            var result = members.Select(p => new
            {
                p.UserId,
                UserName = p.User?.FullName ?? "Unknown",
                p.Role,
                IsHost = p.Role == ProSport.Domain.Constants.MatchParticipantRole.Host,
            });

            return new ApiResponseDto<IEnumerable<object>>(200, "Success", result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting participants for match {MatchId}", matchId);
            return new ApiResponseDto<IEnumerable<object>>(500, "Lỗi hệ thống", null);
        }
    }

    public async Task<ApiResponseDto<bool>> ApproveJoinerAsync(int matchId, int hostId, int joinerId)
    {
        try
        {
            await _matchRepository.ExecuteApproveMatchTransactionAsync(matchId, joinerId, hostId);
            return new ApiResponseDto<bool>(200, "Đã duyệt tham gia", true);
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("Giao dịch đang được xử lý"))
        {
            return new ApiResponseDto<bool>(409, ex.Message, false);
        }
        catch (Exception ex)
        {
            if (ex.Message.Contains("không tồn tại") || ex.Message.Contains("quyền") || ex.Message.Contains("đủ người") || ex.Message.Contains("không hợp lệ"))
                return new ApiResponseDto<bool>(400, ex.Message, false);

            _logger.LogError(ex, "Error approving joiner {JoinerId} in match {MatchId}", joinerId, matchId);
            return new ApiResponseDto<bool>(500, "Lỗi hệ thống", false);
        }
    }

    public async Task<ApiResponseDto<bool>> RejectJoinerAsync(int matchId, int hostId, int joinerId)
    {
        try
        {
            await _matchRepository.ExecuteRejectMatchTransactionAsync(matchId, joinerId, hostId);
            return new ApiResponseDto<bool>(200, "Đã từ chối và hoàn tiền ký quỹ (nếu có)", true);
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("Giao dịch đang được xử lý"))
        {
            return new ApiResponseDto<bool>(409, ex.Message, false);
        }
        catch (Exception ex)
        {
            if (ex.Message.Contains("không tồn tại") || ex.Message.Contains("quyền") || ex.Message.Contains("không hợp lệ") || ex.Message.Contains("không tìm thấy ví"))
                return new ApiResponseDto<bool>(400, ex.Message, false);

            _logger.LogError(ex, "Error rejecting joiner {JoinerId} in match {MatchId}", joinerId, matchId);
            return new ApiResponseDto<bool>(500, "Lỗi hệ thống", false);
        }
    }

    public async Task<ApiResponseDto<bool>> LeaveMatchAsync(int matchId, int userId)
    {
        try
        {
            var participant = await _matchRepository.GetParticipantAsync(matchId, userId);
            if (participant == null || participant.Role == ProSport.Domain.Constants.MatchParticipantRole.Host)
                return new ApiResponseDto<bool>(400, "Yêu cầu không hợp lệ", false);

            // C-02 FIX: Only apply penalty/refund logic if the match hasn't already started.
            // If matchTime is in the past, the escrow should be settled by CompleteMatch/CancelMatch, not here.
            var match = await _matchRepository.GetMatchByIdAsync(matchId);
            // C3 FIX: Add explicit null check — data inconsistency could cause match to be null
            if (match == null)
                return new ApiResponseDto<bool>(404, "Kèo không tồn tại", false);

            var vnTimeZone = TimeZoneInfo.FindSystemTimeZoneById(
                OperatingSystem.IsWindows() ? "SE Asia Standard Time" : "Asia/Ho_Chi_Minh");
            var localTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, vnTimeZone);
            var matchTime = match!.MatchDate.Date + match.StartTime;
            var timeUntilMatch = matchTime - localTime;

            string returnMessage;
            if (participant.HasPaidEscrow && match.EscrowAmount > 0)
            {
                // Match has already started or passed — no penalty, no refund here (host should call CompleteMatch)
                if (timeUntilMatch <= TimeSpan.Zero)
                {
                    // Do nothing with funds — match already happened
                    returnMessage = "Đã rút khỏi kèo. Tiền cọc sẽ được xử lý khi Host kết thúc kèo.";
                }
                else
                {
                    var court = await _courtRepository.GetByIdAsync(match.CourtId);
                    var complexId = court?.ComplexId ?? 1;
                    var (releasePct, policyMsg) = await _cancellationPolicy.CalculateMatchLeaveReleaseAsync(complexId, matchTime);

                    if (releasePct >= 100m)
                    {
                        await _escrowService.ReleaseFundsAsync(userId, match.EscrowAmount, matchId, $"Hoàn cọc — {policyMsg} - Mã kèo {matchId}");
                    }
                    else if (releasePct <= 0m)
                    {
                        await _escrowService.DeductLockedFundsAsync(userId, match.EscrowAmount, matchId, $"Phạt cọc — {policyMsg} - Mã kèo {matchId}");
                    }
                    else
                    {
                        var releaseAmt = match.EscrowAmount * releasePct / 100m;
                        var deductAmt = match.EscrowAmount - releaseAmt;
                        if (releaseAmt > 0)
                            await _escrowService.ReleaseFundsAsync(userId, releaseAmt, matchId, $"Hoàn {releasePct}% cọc - Mã kèo {matchId}");
                        if (deductAmt > 0)
                            await _escrowService.DeductLockedFundsAsync(userId, deductAmt, matchId, $"Phạt {100m - releasePct}% cọc - Mã kèo {matchId}");
                    }

                    returnMessage = $"Đã rút khỏi kèo. {policyMsg}";
                }
            }
            else
            {
                returnMessage = "Đã rút khỏi kèo thành công.";
            }

            // BUG FIX: Capture status BEFORE mutating it — otherwise the check below always fails
            var wasApproved = participant.Status == ProSport.Domain.Constants.MatchParticipantStatus.Approved;

            // M-01 FIX: Participant who left is marked Rejected (system cancelled their participation)
            participant.Status = ProSport.Domain.Constants.MatchParticipantStatus.Rejected;
            // M6 FIX: Reset HasPaidEscrow flag to maintain audit consistency
            participant.HasPaidEscrow = false;
            await _matchRepository.UpdateParticipantAsync(participant);

            // Only decrement if the participant was actually Approved (not just Pending)
            if (wasApproved)
            {
                match!.CurrentParticipants = Math.Max(0, match.CurrentParticipants - 1);
                if (match.Status == ProSport.Domain.Constants.MatchStatus.Closed) match.Status = ProSport.Domain.Constants.MatchStatus.Open;
                await _matchRepository.UpdateMatchAsync(match);
            }

            return new ApiResponseDto<bool>(200, returnMessage, true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error leaving match {MatchId} for user {UserId}", matchId, userId);
            return new ApiResponseDto<bool>(500, "Lỗi hệ thống", false);
        }
    }

    public async Task<ApiResponseDto<bool>> CompleteMatchAsync(int matchId, int hostId)
    {
        try
        {
            await _matchRepository.ExecuteCompleteMatchTransactionAsync(matchId, hostId);
            return new ApiResponseDto<bool>(200, "Đã hoàn thành trận đấu và giải ngân tiền cọc thành công", true);
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("Giao dịch đang được xử lý"))
        {
            return new ApiResponseDto<bool>(409, ex.Message, false);
        }
        catch (Exception ex)
        {
            if (ex.Message.Contains("không tồn tại") || ex.Message.Contains("quyền") || ex.Message.Contains("hợp lệ"))
                return new ApiResponseDto<bool>(400, ex.Message, false);

            _logger.LogError(ex, "Error completing match {MatchId} by host {HostId}", matchId, hostId);
            return new ApiResponseDto<bool>(500, "Lỗi hệ thống", false);
        }
    }

    public async Task<ApiResponseDto<bool>> CancelMatchAsync(int matchId, int hostId)
    {
        try
        {
            await _matchRepository.ExecuteCancelMatchTransactionAsync(matchId, hostId);
            return new ApiResponseDto<bool>(200, "Đã hủy trận đấu và hoàn tiền thành công", true);
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("Giao dịch đang được xử lý"))
        {
            return new ApiResponseDto<bool>(409, ex.Message, false);
        }
        catch (Exception ex)
        {
            if (ex.Message.Contains("không tồn tại") || ex.Message.Contains("quyền") || ex.Message.Contains("hợp lệ"))
                return new ApiResponseDto<bool>(400, ex.Message, false);

            _logger.LogError(ex, "Error cancelling match {MatchId} by host {HostId}", matchId, hostId);
            return new ApiResponseDto<bool>(500, "Lỗi hệ thống", false);
        }
    }

    private static MatchDto MapToDto(Match m) => new MatchDto
    {
        MatchId = m.MatchId,
        HostId = m.HostId,
        CourtId = m.CourtId,
        BookingId = m.BookingId,
        MatchDate = m.MatchDate,
        StartTime = m.StartTime,
        EndTime = m.EndTime,
        MaxParticipants = m.MaxParticipants,
        CurrentParticipants = m.CurrentParticipants,
        EscrowAmount = m.EscrowAmount,
        Status = m.Status,
        LevelRequirement = m.LevelRequirement,
        Notes = m.Notes,
        HostName = m.Host?.FullName,
        CourtName = m.Court?.Name,
        SportType = m.Court?.CourtType?.Name
    };
}
