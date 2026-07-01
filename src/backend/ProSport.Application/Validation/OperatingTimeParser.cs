using System.Globalization;
using System.Text.RegularExpressions;

namespace ProSport.Application.Validation;

public static partial class OperatingTimeParser
{
    [GeneratedRegex(@"^(?:[01]\d|2[0-3]):[0-5]\d$")]
    private static partial Regex StrictTimePattern();

    /// <summary>
    /// Parses operating hours in strict HH:mm (00:00–23:59). Rejects values like "1.00:00".
    /// </summary>
    public static bool TryParseStrict(string? input, out TimeSpan time)
    {
        time = default;
        if (string.IsNullOrWhiteSpace(input))
            return false;

        var trimmed = input.Trim();
        if (!StrictTimePattern().IsMatch(trimmed))
            return false;

        return TimeSpan.TryParseExact(trimmed, @"hh\:mm", CultureInfo.InvariantCulture, out time);
    }

    public static bool IsValidOperatingWindow(TimeSpan? opening, TimeSpan? closing) =>
        opening.HasValue && closing.HasValue && opening.Value < closing.Value;
}
