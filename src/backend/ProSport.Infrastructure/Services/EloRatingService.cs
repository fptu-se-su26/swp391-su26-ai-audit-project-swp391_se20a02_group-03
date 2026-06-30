using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;
using DomainMatch = ProSport.Domain.Entities.Match;

namespace ProSport.Infrastructure.Services;

public class EloRatingService : IEloRatingService
{
    private const int KFactor = 32;
    private const int DefaultElo = 1200;

    private readonly ProSportDbContext _db;
    private readonly IMatchRepository _matchRepository;
    private readonly INotificationService _notifications;
    private readonly ILogger<EloRatingService> _logger;

    public EloRatingService(
        ProSportDbContext db,
        IMatchRepository matchRepository,
        INotificationService notifications,
        ILogger<EloRatingService> logger)
    {
        _db = db;
        _matchRepository = matchRepository;
        _notifications = notifications;
        _logger = logger;
    }

    public async Task<ApiResponseDto<UserSkillRatingDto>> GetUserRatingAsync(int userId, string sportType)
    {
        var rating = await GetOrCreateRatingAsync(userId, sportType);
        return new ApiResponseDto<UserSkillRatingDto>(200, "Success", Map(rating));
    }

    public async Task<ApiResponseDto<bool>> SubmitMatchResultAsync(int reporterUserId, SubmitMatchResultDto dto)
    {
        var match = await _matchRepository.GetMatchByIdAsync(dto.MatchId);
        if (match == null) return new ApiResponseDto<bool>(404, "Match not found");

        if (dto.WinnerUserId == null && dto.LoserUserId == null)
            return new ApiResponseDto<bool>(400, "Cần xác định người thắng hoặc hòa.");

        if (!IsMatchParticipant(match, reporterUserId))
            return new ApiResponseDto<bool>(403, "Chỉ người tham gia kèo mới được báo cáo kết quả.");

        var existingResult = await _db.MatchResults
            .AnyAsync(r => r.MatchId == dto.MatchId && !r.IsDeleted);
        if (existingResult)
            return new ApiResponseDto<bool>(409, "Kết quả trận đấu đã được ghi nhận.");

        if (dto.WinnerUserId.HasValue && !IsMatchParticipant(match, dto.WinnerUserId.Value))
            return new ApiResponseDto<bool>(400, "Người thắng phải là người tham gia kèo.");
        if (dto.LoserUserId.HasValue && !IsMatchParticipant(match, dto.LoserUserId.Value))
            return new ApiResponseDto<bool>(400, "Người thua phải là người tham gia kèo.");

        var result = new MatchResult
        {
            MatchId = dto.MatchId,
            WinnerUserId = dto.WinnerUserId,
            LoserUserId = dto.LoserUserId,
            ReportedByUserId = reporterUserId,
            TeamAScore = dto.TeamAScore,
            TeamBScore = dto.TeamBScore,
            Status = MatchResultStatus.Pending
        };
        _db.MatchResults.Add(result);
        await _db.SaveChangesAsync();

        foreach (var opponentId in GetOpponentUserIds(match, reporterUserId))
        {
            await _notifications.SendToUserAsync(opponentId, new RealtimeNotificationDto
            {
                Type = "MatchResultPending",
                Title = "Xác nhận kết quả trận đấu",
                Message = $"Đối thủ đã báo cáo kết quả trận #{dto.MatchId}. Vui lòng xác nhận hoặc khiếu nại.",
                Data = new { dto.MatchId, dto.WinnerUserId, dto.LoserUserId, dto.TeamAScore, dto.TeamBScore }
            });
        }

        return new ApiResponseDto<bool>(200, "Đã gửi kết quả. Chờ đối thủ xác nhận.", true);
    }

    public async Task<ApiResponseDto<bool>> ConfirmMatchResultAsync(int confirmerUserId, int matchId)
    {
        var match = await _matchRepository.GetMatchByIdAsync(matchId);
        if (match == null) return new ApiResponseDto<bool>(404, "Match not found");

        if (!IsMatchParticipant(match, confirmerUserId))
            return new ApiResponseDto<bool>(403, "Chỉ người tham gia kèo mới được xác nhận kết quả.");

        var result = await _db.MatchResults
            .FirstOrDefaultAsync(r => r.MatchId == matchId && !r.IsDeleted);
        if (result == null) return new ApiResponseDto<bool>(404, "Chưa có kết quả để xác nhận.");
        if (result.Status == MatchResultStatus.Confirmed)
            return new ApiResponseDto<bool>(400, "Kết quả đã được xác nhận.");
        if (result.Status == MatchResultStatus.Disputed)
            return new ApiResponseDto<bool>(400, "Kết quả đang tranh chấp, không thể xác nhận.");
        if (result.Status != MatchResultStatus.Pending)
            return new ApiResponseDto<bool>(400, "Trạng thái kết quả không hợp lệ.");

        if (result.ReportedByUserId == confirmerUserId)
            return new ApiResponseDto<bool>(403, "Không thể tự xác nhận kết quả do chính mình báo cáo.");

        var sportType = ResolveSportType(match, null);
        await ApplyConfirmedResultAsync(match, result, sportType);

        await _notifications.SendToUserAsync(result.ReportedByUserId, new RealtimeNotificationDto
        {
            Type = "MatchResultConfirmed",
            Title = "Kết quả đã được xác nhận",
            Message = $"Đối thủ đã xác nhận kết quả trận #{matchId}. ELO đã được cập nhật.",
            Data = new { matchId }
        });

        return new ApiResponseDto<bool>(200, "Xác nhận kết quả và cập nhật ELO thành công.", true);
    }

    public async Task<ApiResponseDto<bool>> DisputeMatchResultAsync(int disputerUserId, int matchId)
    {
        var match = await _matchRepository.GetMatchByIdAsync(matchId);
        if (match == null) return new ApiResponseDto<bool>(404, "Match not found");

        if (!IsMatchParticipant(match, disputerUserId))
            return new ApiResponseDto<bool>(403, "Chỉ người tham gia kèo mới được khiếu nại kết quả.");

        var result = await _db.MatchResults
            .FirstOrDefaultAsync(r => r.MatchId == matchId && !r.IsDeleted);
        if (result == null) return new ApiResponseDto<bool>(404, "Chưa có kết quả để khiếu nại.");
        if (result.Status != MatchResultStatus.Pending)
            return new ApiResponseDto<bool>(400, "Chỉ có thể khiếu nại kết quả đang chờ xác nhận.");

        if (result.ReportedByUserId == disputerUserId)
            return new ApiResponseDto<bool>(403, "Không thể khiếu nại kết quả do chính mình báo cáo.");

        result.Status = MatchResultStatus.Disputed;
        result.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        await _notifications.SendToUserAsync(result.ReportedByUserId, new RealtimeNotificationDto
        {
            Type = "MatchResultDisputed",
            Title = "Kết quả bị khiếu nại",
            Message = $"Đối thủ đã khiếu nại kết quả trận #{matchId}. Vui lòng liên hệ quản trị để giải quyết.",
            Data = new { matchId }
        });

        return new ApiResponseDto<bool>(200, "Đã ghi nhận khiếu nại. ELO chưa thay đổi.", true);
    }

    private async Task ApplyConfirmedResultAsync(DomainMatch match, MatchResult result, string sportType)
    {
        if (result.WinnerUserId.HasValue && result.LoserUserId.HasValue)
        {
            var winner = await GetOrCreateRatingAsync(result.WinnerUserId.Value, sportType);
            var loser = await GetOrCreateRatingAsync(result.LoserUserId.Value, sportType);
            ApplyElo(winner, loser);
        }

        result.Status = MatchResultStatus.Confirmed;
        result.UpdatedAt = DateTime.UtcNow;

        if (match.Status != MatchStatus.Completed)
        {
            match.Status = MatchStatus.Completed;
            await _matchRepository.UpdateMatchAsync(match);
        }

        await _db.SaveChangesAsync();
    }

    private static IEnumerable<int> GetOpponentUserIds(DomainMatch match, int reporterUserId)
    {
        var opponents = new HashSet<int>();
        if (match.HostId != reporterUserId)
            opponents.Add(match.HostId);

        foreach (var participant in match.Participants.Where(p =>
                     p.UserId != reporterUserId && p.Status == MatchParticipantStatus.Approved))
        {
            opponents.Add(participant.UserId);
        }

        return opponents;
    }

    private static bool IsMatchParticipant(DomainMatch match, int userId)
    {
        if (match.HostId == userId) return true;
        return match.Participants.Any(p =>
            p.UserId == userId && p.Status == MatchParticipantStatus.Approved);
    }

    private static string ResolveSportType(DomainMatch match, string? requestedSportType)
    {
        if (!string.IsNullOrWhiteSpace(requestedSportType))
            return requestedSportType.Trim();

        return match.Court?.CourtType?.Name?.Trim() ?? "Badminton";
    }

    private async Task<UserSkillRating> GetOrCreateRatingAsync(int userId, string sportType)
    {
        var rating = await _db.UserSkillRatings
            .FirstOrDefaultAsync(r => r.UserId == userId && r.SportType == sportType);

        if (rating != null) return rating;

        rating = new UserSkillRating { UserId = userId, SportType = sportType, EloRating = DefaultElo };
        _db.UserSkillRatings.Add(rating);
        await _db.SaveChangesAsync();
        return rating;
    }

    private static void ApplyElo(UserSkillRating winner, UserSkillRating loser)
    {
        var expectedWinner = 1.0 / (1.0 + Math.Pow(10, (loser.EloRating - winner.EloRating) / 400.0));
        var expectedLoser = 1.0 - expectedWinner;

        winner.EloRating += (int)Math.Round(KFactor * (1 - expectedWinner));
        loser.EloRating += (int)Math.Round(KFactor * (0 - expectedLoser));

        winner.GamesPlayed++;
        loser.GamesPlayed++;
        winner.Wins++;
        loser.Losses++;
    }

    private static UserSkillRatingDto Map(UserSkillRating r) => new()
    {
        UserId = r.UserId,
        SportType = r.SportType,
        EloRating = r.EloRating,
        GamesPlayed = r.GamesPlayed,
        Wins = r.Wins,
        Losses = r.Losses
    };
}
