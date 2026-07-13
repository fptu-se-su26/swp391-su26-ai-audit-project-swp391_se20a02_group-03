namespace ProSport.Application.Exceptions;

/// <summary>
/// Ném khi số điện thoại đã tồn tại (vi phạm ràng buộc unique ở tầng DB).
/// Dùng để tầng service map sang HTTP 400 thay vì để lỗi SqlException rơi vào catch chung (500).
/// </summary>
public class DuplicatePhoneException : Exception
{
    public DuplicatePhoneException(string message = "Số điện thoại đã được sử dụng.")
        : base(message) { }
}
