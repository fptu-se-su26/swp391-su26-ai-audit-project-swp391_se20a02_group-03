using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Application.Services;
using ProSport.Domain.Constants;
using ProSport.Domain.Entities;
using Xunit;

namespace ProSport.Tests;

/// <summary>
/// BUG P1-3 — UpdateCourtAsync từng lưu thẳng dto.Status (giá trị API dạng
/// ACTIVE/MAINTENANCE/INACTIVE) vào Court.Status thay vì normalize về canonical DB
/// (Available/Maintenance/Inactive). Hậu quả: chỉ sửa tên một sân đang Active cũng làm
/// Court.Status bị ghi đè thành literal "ACTIVE", khiến CourtStatuses.IsBookable (so sánh
/// với "Available") trả về false — sân biến mất khỏi luồng đặt sân dù vẫn "đang hoạt động".
/// </summary>
public class CourtServiceTests
{
    private readonly Mock<ICourtRepository> _courtRepoMock = new();
    private readonly Mock<IComplexScheduleService> _scheduleServiceMock = new();
    private readonly Mock<ILogger<CourtService>> _loggerMock = new();
    private readonly CourtService _sut;

    public CourtServiceTests()
    {
        _sut = new CourtService(_courtRepoMock.Object, _scheduleServiceMock.Object, _loggerMock.Object);
    }

    private Court MakeCourt(string dbStatus) => new()
    {
        CourtId = 1,
        Name = "Sân Cầu Lông A1",
        CourtTypeId = 1,
        Status = dbStatus,
        CourtType = new CourtType { CourtTypeId = 1, Name = "Badminton" },
    };

    [Fact]
    public async Task UpdateCourtAsync_OnlyNameChanged_ButFormResubmitsApiStatus_KeepsCourtBookable()
    {
        // Arrange: sân đang Active (canonical DB = "Available"); form edit chỉ đổi tên
        // nhưng vẫn gửi kèm status hiện tại theo casing API ("ACTIVE") — đúng hành vi
        // thật của CourtFormModal (form luôn gửi đủ field, không phải partial patch).
        var court = MakeCourt(CourtStatuses.Active); // "Available"
        _courtRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(court);
        Court? saved = null;
        _courtRepoMock.Setup(r => r.UpdateAsync(It.IsAny<Court>()))
            .Callback<Court>(c => saved = c)
            .Returns(Task.CompletedTask);

        var dto = new UpdateCourtDto { Name = "Sân Cầu Lông A1 (mới)", Status = "ACTIVE" };

        var result = await _sut.UpdateCourtAsync(1, dto);

        result.StatusCode.Should().Be(200);
        saved.Should().NotBeNull();
        saved!.Name.Should().Be("Sân Cầu Lông A1 (mới)");
        // Cốt lõi của bug: DB phải lưu canonical "Available", KHÔNG phải literal "ACTIVE".
        saved.Status.Should().Be(CourtStatuses.Active);
        CourtStatuses.IsBookable(saved.Status).Should().BeTrue("sân vẫn đang hoạt động, chỉ đổi tên");
        // API vẫn trả đúng dạng ACTIVE cho FE.
        result.Data!.Status.Should().Be("ACTIVE");
    }

    [Theory]
    [InlineData("ACTIVE", "Available")]
    [InlineData("MAINTENANCE", "Maintenance")]
    [InlineData("INACTIVE", "Inactive")]
    [InlineData("Available", "Available")]
    [InlineData("Maintenance", "Maintenance")]
    [InlineData("Inactive", "Inactive")]
    public async Task UpdateCourtAsync_NormalizesEveryApiStatusValue_ToCanonicalDbValue(string apiStatus, string expectedDbStatus)
    {
        var court = MakeCourt(CourtStatuses.Active);
        _courtRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(court);
        Court? saved = null;
        _courtRepoMock.Setup(r => r.UpdateAsync(It.IsAny<Court>()))
            .Callback<Court>(c => saved = c)
            .Returns(Task.CompletedTask);

        var dto = new UpdateCourtDto { Status = apiStatus };
        await _sut.UpdateCourtAsync(1, dto);

        saved!.Status.Should().Be(expectedDbStatus);
    }

    [Fact]
    public async Task UpdateCourtAsync_StatusNull_KeepsExistingStatusUnchanged()
    {
        var court = MakeCourt(CourtStatuses.Maintenance);
        _courtRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(court);
        Court? saved = null;
        _courtRepoMock.Setup(r => r.UpdateAsync(It.IsAny<Court>()))
            .Callback<Court>(c => saved = c)
            .Returns(Task.CompletedTask);

        var dto = new UpdateCourtDto { Name = "Đổi tên thôi" }; // Status = null

        await _sut.UpdateCourtAsync(1, dto);

        saved!.Status.Should().Be(CourtStatuses.Maintenance);
    }
}
