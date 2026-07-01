namespace ProSport.Application.Exceptions;

/// <summary>Ném khi resource không tồn tại hoặc không thuộc phạm vi Owner (trả 404, tránh rò rỉ).</summary>
public class OwnerResourceNotFoundException : Exception
{
    public OwnerResourceNotFoundException(string message = "Không tìm thấy tài nguyên.")
        : base(message) { }
}
