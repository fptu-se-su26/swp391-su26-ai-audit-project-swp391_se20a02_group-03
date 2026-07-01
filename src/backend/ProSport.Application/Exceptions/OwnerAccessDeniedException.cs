namespace ProSport.Application.Exceptions;

/// <summary>Ném khi user không có quyền truy cập tổ hợp hoặc resource thuộc tổ hợp khác.</summary>
public class OwnerAccessDeniedException : Exception
{
    public OwnerAccessDeniedException(string message = "Bạn không có quyền truy cập tài nguyên này.")
        : base(message) { }
}
