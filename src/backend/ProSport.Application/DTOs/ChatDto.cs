using System.ComponentModel.DataAnnotations;

namespace ProSport.Application.DTOs;

public class ChatMessageDto
{
    /// <summary>Role: "user" hoặc "assistant"</summary>
    [RegularExpression("^(user|assistant)$", ErrorMessage = "Role phải là 'user' hoặc 'assistant'.")]
    public string Role { get; set; } = "user";

    [Required(AllowEmptyStrings = false, ErrorMessage = "Nội dung tin nhắn không được rỗng.")]
    [StringLength(2000, ErrorMessage = "Tin nhắn tối đa 2000 ký tự.")]
    public string Content { get; set; } = string.Empty;
}

public class ChatRequestDto
{
    /// <summary>Lịch sử hội thoại (bao gồm tin nhắn mới nhất của user ở cuối)</summary>
    [MinLength(1, ErrorMessage = "Cần ít nhất 1 tin nhắn.")]
    [MaxLength(50, ErrorMessage = "Lịch sử hội thoại tối đa 50 tin nhắn.")]
    public List<ChatMessageDto> Messages { get; set; } = new();
}

public class ChatResponseDto
{
    public string Reply { get; set; } = string.Empty;
}
