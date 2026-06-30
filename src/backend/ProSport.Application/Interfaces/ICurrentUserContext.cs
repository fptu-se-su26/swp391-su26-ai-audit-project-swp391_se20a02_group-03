namespace ProSport.Application.Interfaces;

/// <summary>
/// Trích xuất thông tin user hiện tại từ JWT (HttpContext) — không tin dữ liệu từ client body.
/// </summary>
public interface ICurrentUserContext
{
    int? UserId { get; }
    string? Role { get; }
    bool IsAuthenticated { get; }
    bool IsAdmin { get; }
    bool IsCourtOwner { get; }
}
