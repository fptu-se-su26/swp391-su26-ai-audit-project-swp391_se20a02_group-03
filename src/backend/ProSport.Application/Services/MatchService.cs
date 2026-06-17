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
    private readonly ILogger<MatchService> _logger;

    public MatchService(
        IMatchRepository matchRepository, 
        IBookingRepository bookingRepository, 
        IEscrowService escrowService,
        ILogger<MatchService> logger)
    {
        _matchRepository = matchRepository;
        _bookingRepository = bookingRepository;
        _escrowService = escrowService;
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

            // Tự động thiết lập số tiền chia đều (Escrow Amount) dựa trên tổng tiền Booking và số lượng người tham gia tối đa
            var splitAmount = Math.Round(booking.TotalAmount / dto.MaxParticipants, 0);

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
                EscrowAmount = splitAmount,
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
            var match = await _matchRepository.GetMatchByIdAsync(matchId);
            if (match == null || match.Status != ProSport.Domain.Constants.MatchStatus.Open)
                return new ApiResponseDto<bool>(400, "Kèo không tồn tại hoặc đã đóng", false);

            if (match.HostId == userId)
                return new ApiResponseDto<bool>(400, "Bạn là Host của kèo này", false);

            if (match.CurrentParticipants >= match.MaxParticipants)
                return new ApiResponseDto<bool>(400, "Kèo đã đủ người", false);

            var existingParticipant = await _matchRepository.GetParticipantAsync(matchId, userId);
            if (existingParticipant != null)
                return new ApiResponseDto<bool>(400, "Bạn đã tham gia hoặc đang chờ duyệt kèo này", false);

            // GỌI ESCROW ĐỂ KHÓA TIỀN CỌC
            if (match.EscrowAmount > 0)
            {
                var lockResponse = await _escrowService.LockFundsAsync(userId, match.EscrowAmount, matchId, $"Ký quỹ xin tham gia kèo {matchId}");
                if (lockResponse.StatusCode != 200)
                {
                    return new ApiResponseDto<bool>(lockResponse.StatusCode, lockResponse.Message, false);
                }
            }

            var participant = new MatchParticipant
            {
                MatchId = matchId,
                UserId = userId,
                Role = ProSport.Domain.Constants.MatchParticipantRole.Joiner,
                Status = ProSport.Domain.Constants.MatchParticipantStatus.Pending, // Đợi Host duyệt
                HasPaidEscrow = match.EscrowAmount > 0
            };

            await _matchRepository.AddParticipantAsync(participant);
            return new ApiResponseDto<bool>(200, "Đã gửi yêu cầu tham gia và khóa tiền ký quỹ thành công", true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error joining match {MatchId} for user {UserId}", matchId, userId);
            return new ApiResponseDto<bool>(500, "Lỗi hệ thống khi xin tham gia kèo", false);
        }
    }

    public async Task<ApiResponseDto<bool>> ApproveJoinerAsync(int matchId, int hostId, int joinerId)
    {
        try
        {
            var match = await _matchRepository.GetMatchByIdAsync(matchId);
            if (match == null || match.HostId != hostId)
                return new ApiResponseDto<bool>(403, "Bạn không có quyền duyệt kèo này", false);

            var participant = await _matchRepository.GetParticipantAsync(matchId, joinerId);
            if (participant == null || participant.Status != ProSport.Domain.Constants.MatchParticipantStatus.Pending)
                return new ApiResponseDto<bool>(400, "Yêu cầu không hợp lệ", false);

            if (match.CurrentParticipants >= match.MaxParticipants)
                return new ApiResponseDto<bool>(400, "Kèo đã đủ người", false);

            participant.Status = ProSport.Domain.Constants.MatchParticipantStatus.Approved;
            await _matchRepository.UpdateParticipantAsync(participant);

            match.CurrentParticipants += 1;
            if (match.CurrentParticipants >= match.MaxParticipants)
            {
                match.Status = ProSport.Domain.Constants.MatchStatus.Closed;
            }
            await _matchRepository.UpdateMatchAsync(match);

            return new ApiResponseDto<bool>(200, "Đã duyệt tham gia", true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error approving joiner {JoinerId} in match {MatchId}", joinerId, matchId);
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

            // TODO: Rule check giờ - nếu sát giờ đá mới hủy thì phạt cọc. 
            // Giả sử hủy sớm thì trả cọc.
            var match = await _matchRepository.GetMatchByIdAsync(matchId);
            
            if (participant.HasPaidEscrow && match!.EscrowAmount > 0)
            {
                // Trả lại tiền ký quỹ
                await _escrowService.ReleaseFundsAsync(userId, match.EscrowAmount, matchId, $"Hoàn cọc do rút khỏi kèo {matchId}");
            }

            // BUG FIX: Capture status BEFORE mutating it — otherwise the check below always fails
            var wasApproved = participant.Status == ProSport.Domain.Constants.MatchParticipantStatus.Approved;

            participant.Status = ProSport.Domain.Constants.MatchParticipantStatus.Rejected; // Should probably be Cancelled/Rejected, keeping Rejected for now. We didn't define Cancelled for Participant. Wait, we defined Rejected.
            await _matchRepository.UpdateParticipantAsync(participant);

            // Only decrement if the participant was actually Approved (not just Pending)
            if (wasApproved)
            {
                match!.CurrentParticipants = Math.Max(0, match.CurrentParticipants - 1);
                if (match.Status == ProSport.Domain.Constants.MatchStatus.Closed) match.Status = ProSport.Domain.Constants.MatchStatus.Open;
                await _matchRepository.UpdateMatchAsync(match);
            }

            return new ApiResponseDto<bool>(200, "Đã rút khỏi kèo và hoàn tiền", true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error leaving match {MatchId} for user {UserId}", matchId, userId);
            return new ApiResponseDto<bool>(500, "Lỗi hệ thống", false);
        }
    }

    public async Task<ApiResponseDto<bool>> CompleteMatchAsync(int matchId, int hostId)
    {
         // Logic chia tiền phức tạp sẽ ở đây (đợi chốt với yêu cầu)
         return new ApiResponseDto<bool>(200, "Tạm thời hardcode success", true);
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
        Notes = m.Notes
    };
}
