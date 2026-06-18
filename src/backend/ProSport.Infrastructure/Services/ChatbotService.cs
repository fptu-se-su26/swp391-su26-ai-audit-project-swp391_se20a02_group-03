using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using OpenAI.Chat;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using System.Text;

namespace ProSport.Infrastructure.Services;

/// <summary>
/// TK-030 + TK-031:
/// - Gọi OpenAI ChatCompletion API
/// - Tự động bổ sung dữ liệu sân trống thực tế từ DB vào System Prompt
/// </summary>
public class ChatbotService : IChatbotService
{
    private readonly ICourtRepository _courtRepository;
    private readonly IMatchRepository _matchRepository;
    private readonly IConfiguration _config;
    private readonly ILogger<ChatbotService> _logger;

    public ChatbotService(
        ICourtRepository courtRepository,
        IMatchRepository matchRepository,
        IConfiguration config,
        ILogger<ChatbotService> logger)
    {
        _courtRepository = courtRepository;
        _matchRepository = matchRepository;
        _config = config;
        _logger = logger;
    }

    public async Task<ApiResponseDto<ChatResponseDto>> ChatAsync(ChatRequestDto request)
    {
        try
        {
            var apiKey = _config["OpenAI:ApiKey"];
            if (string.IsNullOrWhiteSpace(apiKey))
                return new ApiResponseDto<ChatResponseDto>(500, "OpenAI API key chưa được cấu hình.");

            // === TK-031: Query dữ liệu thực tế từ DB để nhồi vào System Prompt ===
            var allCourts = await _courtRepository.GetAllAsync();
            var openMatches = await _matchRepository.GetMatchesByStatusAsync("Open");

            var courtContext = new StringBuilder();
            courtContext.AppendLine("=== DANH SÁCH SÂN HIỆN CÓ TẠI HỆ THỐNG ===");
            foreach (var c in allCourts)
            {
                courtContext.AppendLine($"- Sân #{c.CourtId}: {c.Name} | Loại: {c.CourtType?.Name ?? "N/A"} | Trạng thái: {c.Status}");
            }

            var matchContext = new StringBuilder();
            matchContext.AppendLine($"=== KÈOS GIAO LƯU ĐANG MỞ ({openMatches.Count()} kèo) ===");
            foreach (var m in openMatches.Take(5))
            {
                var slots = m.MaxParticipants - m.CurrentParticipants;
                matchContext.AppendLine($"- Kèo #{m.MatchId}: Sân #{m.CourtId} | Ngày: {m.MatchDate:dd/MM/yyyy} | Giờ: {m.StartTime:hh\\:mm}-{m.EndTime:hh\\:mm} | Còn {slots} chỗ | Cọc: {m.EscrowAmount:N0}đ | Trình độ: {m.LevelRequirement ?? "Tất cả"}");
            }

            var systemPrompt = $"""
                Bạn là một trợ lý AI thông minh và đa năng (tương tự như Gemini hay ChatGPT), được tích hợp trong hệ thống đặt sân thể thao Pro-Sport Complex.
                
                Nhiệm vụ của bạn bao gồm:
                1. Trả lời MỌI CÂU HỎI của người dùng về tất cả các lĩnh vực (kiến thức chung, khoa học, lập trình, dịch thuật, tính toán, lên kế hoạch, v.v.) một cách thông minh, tự nhiên và chi tiết giống như một AI đa nhiệm thực thụ. Không từ chối các câu hỏi ngoài lề thể thao.
                2. ĐỒNG THỜI, bạn am hiểu sâu sắc về hệ thống Pro-Sport Complex và xuất sắc trong việc hỗ trợ khách hàng:
                   - Tìm sân phù hợp theo thời gian, loại sân, ngân sách.
                   - Gợi ý các kèo giao lưu đang mở để tham gia.
                   - Giải thích quy trình đặt sân, thanh toán VNPay, hệ thống ký quỹ Escrow.

                Luôn trả lời bằng tiếng Việt, thân thiện và chuyên nghiệp.
                Chỉ khi người dùng hỏi về sân hoặc kèo, hãy dùng dữ liệu THỰC TẾ dưới đây.
                Nếu người dùng muốn đặt sân, hướng dẫn họ vào trang /courts để xem lịch. Nếu muốn tham gia kèo, hướng dẫn vào /matches.

                {courtContext}

                {matchContext}
                """;

            // === TK-030: Gọi OpenAI ChatCompletion ===
            var client = new ChatClient(model: "gpt-4o-mini", apiKey: apiKey);

            var chatMessages = new List<ChatMessage>
            {
                ChatMessage.CreateSystemMessage(systemPrompt)
            };

            // Map lịch sử hội thoại
            foreach (var msg in request.Messages)
            {
                if (msg.Role == "user")
                    chatMessages.Add(ChatMessage.CreateUserMessage(msg.Content));
                else if (msg.Role == "assistant")
                    chatMessages.Add(ChatMessage.CreateAssistantMessage(msg.Content));
            }

            var completion = await client.CompleteChatAsync(chatMessages);
            var reply = completion.Value.Content[0].Text;

            return new ApiResponseDto<ChatResponseDto>(200, "Success", new ChatResponseDto { Reply = reply });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi gọi OpenAI Chatbot");
            return new ApiResponseDto<ChatResponseDto>(500, $"Lỗi AI: {ex.Message}");
        }
    }
}
