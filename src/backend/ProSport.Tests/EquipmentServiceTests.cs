using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Application.Services;
using ProSport.Domain.Entities;
using Xunit;

namespace ProSport.Tests;

/// <summary>
/// BUG — EquipmentService.CreateAsync từng hardcode Category = "Racket",
/// SportType = "Badminton", StockQuantity = 0 cho MỌI thiết bị mới, bất kể admin thực
/// sự chọn danh mục/môn thể thao/tồn kho nào. Hậu quả: tạo một đôi giày Pickleball vẫn
/// bị hiển thị/filter như một cây vợt cầu lông, và sản phẩm luôn hết hàng ngay khi tạo
/// vì không có cách nào set tồn kho ban đầu. Test dưới đây khoá lại: giá trị lưu DB phải
/// khớp đúng dto, không còn hardcode.
/// </summary>
public class EquipmentServiceTests
{
    private readonly Mock<IEquipmentRepository> _equipmentRepoMock = new();
    private readonly Mock<IEquipmentCategoryRepository> _categoryRepoMock = new();
    private readonly Mock<IEscrowRepository> _escrowRepoMock = new();
    private readonly Mock<ILogger<EquipmentService>> _loggerMock = new();
    private readonly EquipmentService _sut;

    public EquipmentServiceTests()
    {
        _sut = new EquipmentService(
            _equipmentRepoMock.Object,
            _categoryRepoMock.Object,
            _escrowRepoMock.Object,
            _loggerMock.Object);
    }

    [Fact]
    public async Task CreateAsync_PickleballFootwear_SavesRealCategorySportTypeAndStock_NotHardcoded()
    {
        var category = new EquipmentCategory { EquipmentCategoryId = 2, Name = "Footwear" };
        _categoryRepoMock.Setup(r => r.GetByIdAsync(2)).ReturnsAsync(category);

        Equipment? saved = null;
        _equipmentRepoMock.Setup(r => r.CreateAsync(It.IsAny<Equipment>()))
            .Callback<Equipment>(e => saved = e)
            .ReturnsAsync((Equipment e) => e);

        var dto = new CreateEquipmentDto
        {
            EquipmentCategoryId = 2,
            Name = "Giày Pickleball ASICS",
            Price = 2_800_000m,
            SportType = "Pickleball",
            StockQuantity = 15,
        };

        var result = await _sut.CreateAsync(dto);

        saved.Should().NotBeNull();
        saved!.Category.Should().Be("Footwear");
        saved.SportType.Should().Be("Pickleball");
        saved.StockQuantity.Should().Be(15);

        result.Category.Should().Be("Footwear");
        result.Type.Should().Be("Pickleball");
        result.StockQuantity.Should().Be(15);
    }
}
