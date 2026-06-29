using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using OpenAI.Chat;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using System.Text;

namespace ProSport.Infrastructure.Services;

/// <summary>
/// TK-030 + TK-031: OpenAI ChatCompletion với fallback offline khi không có/không gọi được API key.
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
        var lastUserMessage = request.Messages.LastOrDefault(m => m.Role == "user")?.Content?.Trim() ?? "";
        if (string.IsNullOrWhiteSpace(lastUserMessage))
            return new ApiResponseDto<ChatResponseDto>(400, "Nội dung tin nhắn không được để trống.");

        var dbContext = await BuildDbContextAsync();
        var apiKey = ResolveOpenAiApiKey();

        if (string.IsNullOrWhiteSpace(apiKey))
        {
            return OfflineResponse(lastUserMessage, dbContext,
                "Chatbot đang ở chế độ offline (chưa cấu hình OPENAI_API_KEY).");
        }

        try
        {
            var systemPrompt = BuildSystemPrompt(dbContext);
            var client = new ChatClient(model: "gpt-4o-mini", apiKey: apiKey);

            var chatMessages = new List<ChatMessage> { ChatMessage.CreateSystemMessage(systemPrompt) };
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
            _logger.LogWarning(ex, "OpenAI unavailable — falling back to offline chatbot");
            return OfflineResponse(lastUserMessage, dbContext,
                "Không kết nối được OpenAI. Đang trả lời bằng dữ liệu hệ thống.");
        }
    }

    private string? ResolveOpenAiApiKey() =>
        _config["OpenAI:ApiKey"] ?? Environment.GetEnvironmentVariable("OPENAI_API_KEY");

    private async Task<(StringBuilder Courts, StringBuilder Matches, int OpenMatchCount)> BuildDbContextAsync()
    {
        var allCourts = await _courtRepository.GetAllAsync();
        var openMatches = (await _matchRepository.GetMatchesByStatusAsync("Open")).ToList();

        var courtContext = new StringBuilder();
        courtContext.AppendLine("=== DANH SÁCH SÂN HIỆN CÓ TẠI HỆ THỐNG ===");
        foreach (var c in allCourts)
            courtContext.AppendLine($"- Sân #{c.CourtId}: {c.Name} | Loại: {c.CourtType?.Name ?? "N/A"} | Trạng thái: {c.Status}");

        var matchContext = new StringBuilder();
        matchContext.AppendLine($"=== KÈO GIAO LƯU ĐANG MỞ ({openMatches.Count} kèo) ===");
        foreach (var m in openMatches.Take(5))
        {
            var slots = m.MaxParticipants - m.CurrentParticipants;
            matchContext.AppendLine(
                $"- Kèo #{m.MatchId}: Sân #{m.CourtId} | Ngày: {m.MatchDate:dd/MM/yyyy} | " +
                $"Giờ: {m.StartTime:hh\\:mm}-{m.EndTime:hh\\:mm} | Còn {slots} chỗ | Cọc: {m.EscrowAmount:N0}đ");
        }

        return (courtContext, matchContext, openMatches.Count);
    }

    private static string BuildSystemPrompt((StringBuilder Courts, StringBuilder Matches, int OpenMatchCount) dbContext)
    {
        return $"""
            Bạn là trợ lý AI của Pro-Sport Complex (đặt sân, kèo giao lưu, VNPay, ví Escrow).
            Trả lời bằng tiếng Việt, thân thiện. Khi hỏi về sân/kèo, dùng dữ liệu thực tế bên dưới.
            Hướng dẫn đặt sân: /courts · tham gia kèo: /matches

            {dbContext.Courts}

            {dbContext.Matches}
            """;
    }

    private static ApiResponseDto<ChatResponseDto> OfflineResponse(
        string userMessage,
        (StringBuilder Courts, StringBuilder Matches, int OpenMatchCount) dbContext,
        string notice)
    {
        var lower = userMessage.ToLowerInvariant();
        var reply = new StringBuilder();
        reply.AppendLine(notice);
        reply.AppendLine();

        if (ContainsAny(lower, "sân", "court", "đặt sân", "booking"))
        {
            reply.AppendLine("**Thông tin sân hiện có:**");
            reply.AppendLine(dbContext.Courts.ToString().TrimEnd());
            reply.AppendLine("Bạn có thể xem lịch trống và đặt sân tại trang **/courts**.");
        }
        else if (ContainsAny(lower, "kèo", "match", "giao lưu", "chơi cùng"))
        {
            reply.AppendLine(dbContext.OpenMatchCount > 0
                ? "**Kèo đang mở:**"
                : "Hiện chưa có kèo giao lưu nào đang mở.");
            reply.AppendLine(dbContext.Matches.ToString().TrimEnd());
            reply.AppendLine("Xem và tham gia kèo tại **/matches**.");
        }
        else if (ContainsAny(lower, "thanh toán", "vnpay", "nạp", "ví", "escrow"))
        {
            reply.AppendLine(
                "Pro-Sport hỗ trợ thanh toán qua **VNPay** và ví **Escrow** (ký quỹ). " +
                "Sau khi đặt sân, bạn có thể thanh toán trong mục booking hoặc nạp ví tại trang ví cá nhân.");
        }
        else
        {
            reply.AppendLine(
                "Tôi có thể hỗ trợ bạn về: đặt sân, kèo giao lưu, thanh toán VNPay/ví Escrow. " +
                "Hãy thử hỏi \"có sân nào trống?\" hoặc \"có kèo nào đang mở?\".");
            reply.AppendLine();
            reply.AppendLine(dbContext.Courts.ToString().TrimEnd());
        }

        return new ApiResponseDto<ChatResponseDto>(200, "Offline mode", new ChatResponseDto { Reply = reply.ToString().Trim() });
    }

    private static bool ContainsAny(string text, params string[] keywords) =>
        keywords.Any(k => text.Contains(k, StringComparison.OrdinalIgnoreCase));
}
