using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;

namespace ProSport.API.Controllers;

/// <summary>
/// TK-030 + TK-031: Endpoint nhận tin nhắn từ frontend và trả về phản hồi AI
/// </summary>
[Route("api/chatbot")]
[ApiController]
public class ChatController : ControllerBase
{
    private readonly IChatbotService _chatbotService;

    public ChatController(IChatbotService chatbotService)
    {
        _chatbotService = chatbotService;
    }

    /// <summary>
    /// POST api/chatbot/chat — requires authentication to limit abuse.
    /// </summary>
    [Authorize]
    [HttpPost("chat")]
    public async Task<IActionResult> Chat([FromBody] ChatRequestDto request)
    {
        if (request.Messages == null || request.Messages.Count == 0)
            return BadRequest(new ApiResponseDto<object>(400, "Nội dung tin nhắn không được để trống."));

        var response = await _chatbotService.ChatAsync(request);
        return StatusCode(response.StatusCode, response);
    }
}
