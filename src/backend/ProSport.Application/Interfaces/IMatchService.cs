using ProSport.Application.DTOs;

namespace ProSport.Application.Interfaces;

public interface IMatchService
{
    Task<ApiResponseDto<IEnumerable<MatchDto>>> GetAvailableMatchesAsync();
    Task<ApiResponseDto<IEnumerable<MatchDto>>> GetMyMatchHistoryAsync(int userId);
    Task<ApiResponseDto<MatchDto>> GetMatchByIdAsync(int matchId);
    
    // Host tạo kèo
    Task<ApiResponseDto<MatchDto>> CreateMatchAsync(int hostId, CreateMatchDto dto);
    
    // Joiner xin vào kèo (sẽ gọi EscrowService để khóa tiền)
    Task<ApiResponseDto<bool>> JoinMatchAsync(int matchId, int userId);
    
    // Host xem danh sách xin vào kèo
    Task<ApiResponseDto<IEnumerable<object>>> GetParticipantsByMatchAsync(int matchId, int hostId, string status);
    
    // Host duyệt Joiner
    Task<ApiResponseDto<bool>> ApproveJoinerAsync(int matchId, int hostId, int joinerId);
    
    // Host từ chối Joiner
    Task<ApiResponseDto<bool>> RejectJoinerAsync(int matchId, int hostId, int joinerId);
    Task<ApiResponseDto<bool>> LeaveMatchAsync(int matchId, int userId);
    
    // Đánh dấu kèo hoàn thành (chia tiền, trả cọc)
    Task<ApiResponseDto<bool>> CompleteMatchAsync(int matchId, int hostId);
    
    // Hủy kèo (hoàn tiền)
    Task<ApiResponseDto<bool>> CancelMatchAsync(int matchId, int hostId);
}
