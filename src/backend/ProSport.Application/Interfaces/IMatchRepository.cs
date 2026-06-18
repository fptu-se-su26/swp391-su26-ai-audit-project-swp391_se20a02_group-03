using ProSport.Domain.Entities;

namespace ProSport.Application.Interfaces;

public interface IMatchRepository
{
    Task<IEnumerable<Match>> GetMatchesByStatusAsync(string status);
    Task<IEnumerable<Match>> GetMyMatchHistoryAsync(int userId);
    Task<Match?> GetMatchByIdAsync(int matchId);
    Task<Match> CreateMatchAsync(Match match);
    Task UpdateMatchAsync(Match match);
    
    Task<MatchParticipant?> GetParticipantAsync(int matchId, int userId);
    Task AddParticipantAsync(MatchParticipant participant);
    Task UpdateParticipantAsync(MatchParticipant participant);
    Task<MatchParticipant> ExecuteJoinMatchTransactionAsync(int matchId, int joinerId);
    Task<IEnumerable<MatchParticipant>> GetParticipantsByMatchAsync(int matchId, string status);
    Task<MatchParticipant> ExecuteRejectMatchTransactionAsync(int matchId, int participantId, int hostId);
    Task<MatchParticipant> ExecuteApproveMatchTransactionAsync(int matchId, int participantId, int hostId);
    Task<bool> ExecuteCompleteMatchTransactionAsync(int matchId, int hostId);
    Task<bool> ExecuteCancelMatchTransactionAsync(int matchId, int hostId);
}
