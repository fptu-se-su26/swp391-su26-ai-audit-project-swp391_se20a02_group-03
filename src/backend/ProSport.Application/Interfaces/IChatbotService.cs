using ProSport.Application.DTOs;

namespace ProSport.Application.Interfaces;

public interface IChatbotService
{
    /// <summary>
    /// Gửi lịch sử hội thoại lên OpenAI và trả về phản hồi.
    /// System Prompt sẽ được tự động bổ sung dữ liệu sân trống thực tế từ DB.
    /// </summary>
    Task<ApiResponseDto<ChatResponseDto>> ChatAsync(ChatRequestDto request);
}
