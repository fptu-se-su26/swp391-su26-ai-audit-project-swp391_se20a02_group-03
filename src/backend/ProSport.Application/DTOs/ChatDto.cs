namespace ProSport.Application.DTOs;

public class ChatMessageDto
{
    /// <summary>Role: "user" hoặc "assistant"</summary>
    public string Role { get; set; } = "user";
    public string Content { get; set; } = string.Empty;
}

public class ChatRequestDto
{
    /// <summary>Lịch sử hội thoại (bao gồm tin nhắn mới nhất của user ở cuối)</summary>
    public List<ChatMessageDto> Messages { get; set; } = new();
}

public class ChatResponseDto
{
    public string Reply { get; set; } = string.Empty;
}
