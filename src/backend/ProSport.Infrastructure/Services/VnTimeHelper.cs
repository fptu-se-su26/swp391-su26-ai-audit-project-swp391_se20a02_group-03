namespace ProSport.Infrastructure.Services;

internal static class VnTimeHelper
{
    public static TimeZoneInfo GetVnTimeZone()
    {
        try { return TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"); }
        catch { return TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh"); }
    }

    public static DateTime VnNow()
        => TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, GetVnTimeZone());

    public static DateTime VnToday()
        => VnNow().Date;

    public static DateTime ToUtcStartOfVnDay(DateTime vnDate)
    {
        var local = DateTime.SpecifyKind(vnDate.Date, DateTimeKind.Unspecified);
        return TimeZoneInfo.ConvertTimeToUtc(local, GetVnTimeZone());
    }

    public static DateTime ToUtcEndOfVnDay(DateTime vnDate)
        => ToUtcStartOfVnDay(vnDate).AddDays(1).AddTicks(-1);

    public static bool IsSameVnDay(DateTime utcInstant, DateTime vnDate)
    {
        var vn = TimeZoneInfo.ConvertTimeFromUtc(
            utcInstant.Kind == DateTimeKind.Utc ? utcInstant : utcInstant.ToUniversalTime(),
            GetVnTimeZone());
        return vn.Date == vnDate.Date;
    }
}
