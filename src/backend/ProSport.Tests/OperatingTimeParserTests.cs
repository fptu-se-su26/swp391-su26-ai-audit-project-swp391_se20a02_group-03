using FluentAssertions;
using ProSport.Application.Validation;

namespace ProSport.Tests;

public class OperatingTimeParserTests
{
    [Theory]
    [InlineData("05:00", true)]
    [InlineData("23:59", true)]
    [InlineData("00:00", true)]
    [InlineData("1.00:00", false)]
    [InlineData("25:00", false)]
    [InlineData("12:60", false)]
    [InlineData("", false)]
    public void TryParseStrict_ValidatesHourMinuteFormat(string input, bool expectedValid)
    {
        var ok = OperatingTimeParser.TryParseStrict(input, out var time);

        ok.Should().Be(expectedValid);
        if (expectedValid)
            time.Should().BeGreaterThanOrEqualTo(TimeSpan.Zero);
    }

    [Fact]
    public void IsValidOperatingWindow_RejectsClosingBeforeOpening()
    {
        OperatingTimeParser.TryParseStrict("20:00", out var opening);
        OperatingTimeParser.TryParseStrict("05:00", out var closing);

        OperatingTimeParser.IsValidOperatingWindow(opening, closing).Should().BeFalse();
    }

    [Fact]
    public void IsValidOperatingWindow_AcceptsOpeningBeforeClosing()
    {
        OperatingTimeParser.TryParseStrict("05:00", out var opening);
        OperatingTimeParser.TryParseStrict("23:00", out var closing);

        OperatingTimeParser.IsValidOperatingWindow(opening, closing).Should().BeTrue();
    }
}
