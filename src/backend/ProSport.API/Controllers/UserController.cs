using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;

namespace ProSport.API.Controllers;

// TK-010: API quản lý người dùng — chỉ Admin được truy cập.
[Route("api/users")]
[ApiController]
[Authorize(Roles = "Admin")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    // GET: danh sách tài khoản (phân trang + lọc theo từ khóa/role).
    [HttpGet]
    public async Task<IActionResult> GetUsers([FromQuery] AdminUserQueryParameters parameters)
    {
        var response = await _userService.GetUsersAsync(parameters);
        return StatusCode(response.StatusCode, response);
    }

    // PUT: khóa tài khoản (Ban).
    [HttpPut("{id}/lock")]
    public async Task<IActionResult> LockUser(int id)
    {
        var response = await _userService.SetLockStatusAsync(id, true);
        return StatusCode(response.StatusCode, response);
    }

    // PUT: mở khóa tài khoản (Unban).
    [HttpPut("{id}/unlock")]
    public async Task<IActionResult> UnlockUser(int id)
    {
        var response = await _userService.SetLockStatusAsync(id, false);
        return StatusCode(response.StatusCode, response);
    }
}
