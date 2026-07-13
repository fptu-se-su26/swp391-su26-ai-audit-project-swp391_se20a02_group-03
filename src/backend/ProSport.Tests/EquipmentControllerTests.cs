using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using ProSport.API.Controllers;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;

namespace ProSport.Tests;

/// <summary>
/// BUG 1 — GET /equipment/{id} từng trả DTO trần trong khi mọi endpoint khác trả
/// envelope ApiResponseDto {statusCode, message, data}; axios interceptor unwrap
/// response.data nên FE đọc res.statusCode = undefined → hiển thị "KHÔNG TÌM THẤY THIẾT BỊ".
/// Các test này chốt contract: envelope ở cả 200 lẫn 404, đúng HTTP status thật.
/// </summary>
public class EquipmentControllerTests
{
    private readonly Mock<IEquipmentService> _equipmentServiceMock = new();
    private readonly Mock<IEquipmentRentalService> _rentalServiceMock = new();
    private readonly Mock<ICartService> _cartServiceMock = new();

    private EquipmentController CreateController() =>
        new(_equipmentServiceMock.Object, _rentalServiceMock.Object, _cartServiceMock.Object);

    [Fact]
    public async Task GetById_WhenFound_ReturnsHttp200_WithEnvelope()
    {
        var dto = new EquipmentDto
        {
            EquipmentId = 1,
            Name = "Vợt Yonex Astrox 88D",
            Price = 6_000_000m,
            StockQuantity = 4,
        };
        _equipmentServiceMock.Setup(s => s.GetByIdAsync(1)).ReturnsAsync(dto);

        var result = await CreateController().GetById(1);

        var ok = result.Should().BeOfType<OkObjectResult>().Subject; // HTTP 200 thật
        var envelope = ok.Value.Should().BeOfType<ApiResponseDto<EquipmentDto>>().Subject;
        envelope.StatusCode.Should().Be(200);
        envelope.Data.Should().NotBeNull();
        envelope.Data!.EquipmentId.Should().Be(1);
        envelope.Data.Name.Should().Be("Vợt Yonex Astrox 88D");
        envelope.Data.Price.Should().Be(6_000_000m);
        envelope.Data.StockQuantity.Should().Be(4);
    }

    [Fact]
    public async Task GetById_WhenNotFound_ReturnsHttp404_WithErrorEnvelope()
    {
        _equipmentServiceMock.Setup(s => s.GetByIdAsync(999)).ReturnsAsync((EquipmentDto?)null);

        var result = await CreateController().GetById(999);

        // HTTP 404 thật — KHÔNG phải HTTP 200 với statusCode nội bộ 404
        var notFound = result.Should().BeOfType<NotFoundObjectResult>().Subject;
        var envelope = notFound.Value.Should().BeOfType<ApiResponseDto<EquipmentDto?>>().Subject;
        envelope.StatusCode.Should().Be(404);
        envelope.Data.Should().BeNull();
    }
}
