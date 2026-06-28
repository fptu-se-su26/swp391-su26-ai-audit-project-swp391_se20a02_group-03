namespace ProSport.Infrastructure.Data;

/// <summary>
/// Tài khoản mẫu dev/demo. Mật khẩu chung: Admin@123456
/// </summary>
public static class SampleAccountDefaults
{
    public const string Password = "Admin@123456";

    // BCrypt hash tĩnh của Password (khớp ModelBuilderSeedExtensions).
    public const string PasswordHash = "$2a$11$8wyDirTdDhyqTcM3BAde4uiu1da5NulhpGioT7g4ONIT3RcG6f5a2";
}
