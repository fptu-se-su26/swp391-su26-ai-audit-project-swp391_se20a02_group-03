using System;
using System.Collections.Generic;
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

public class EscrowServiceTests
{
    private readonly Mock<IEscrowRepository> _escrowRepoMock;
    private readonly Mock<IBookingRepository> _bookingRepoMock;
    private readonly Mock<ILogger<EscrowService>> _loggerMock;
    private readonly EscrowService _escrowService;

    public EscrowServiceTests()
    {
        _escrowRepoMock = new Mock<IEscrowRepository>();
        _bookingRepoMock = new Mock<IBookingRepository>();
        _loggerMock = new Mock<ILogger<EscrowService>>();

        _escrowService = new EscrowService(
            _escrowRepoMock.Object,
            _bookingRepoMock.Object,
            Mock.Of<IVnPayService>(),
            _loggerMock.Object);
    }

    [Fact]
    public async Task DepositAsync_WhenIdempotencyCheckPasses_ReturnsSuccessWithoutAddingTransaction()
    {
        // Arrange
        var userId = 1;
        var amount = 100000m;
        var referenceId = "VNPAY_12345";
        var walletId = 10;
        
        var wallet = new EscrowWallet { EscrowWalletId = walletId, UserId = userId, Balance = 50000m };
        
        _escrowRepoMock.Setup(x => x.ExecuteInTransactionAsync(It.IsAny<Func<Task<ApiResponseDto<bool>>>>()))
            .Returns<Func<Task<ApiResponseDto<bool>>>>(func => func());

        _escrowRepoMock.Setup(x => x.GetWalletByUserIdAsync(userId)).ReturnsAsync(wallet);
        
        // Simulating the DB transaction existence check (C4 fix)
        _escrowRepoMock.Setup(x => x.TransactionExistsByReferenceIdAsync(referenceId)).ReturnsAsync(true);

        // Act
        var result = await _escrowService.DepositAsync(userId, amount, referenceId, "Test Deposit");

        // Assert
        result.StatusCode.Should().Be(200);
        result.Message.Should().Contain("đã được xử lý");
        
        _escrowRepoMock.Verify(x => x.AddTransactionAsync(It.IsAny<Transaction>()), Times.Never);
        _escrowRepoMock.Verify(x => x.UpdateWalletAsync(It.IsAny<EscrowWallet>()), Times.Never);
    }
    
    [Fact]
    public async Task PayForBookingAsync_DelegatesToAtomicRepositoryMethod()
    {
        // Arrange
        var userId = 1;
        var bookingId = 1;
        var amount = 100000m;
        
        var booking = new Booking { BookingId = bookingId, UserId = userId, TotalAmount = amount, Status = "Pending" };
        var wallet = new EscrowWallet { UserId = userId, Balance = 200000m };

        _bookingRepoMock.Setup(x => x.GetByIdAsync(bookingId)).ReturnsAsync(booking);
        _escrowRepoMock.Setup(x => x.GetWalletByUserIdAsync(userId)).ReturnsAsync(wallet);
        _escrowRepoMock.Setup(x => x.PayFromWalletAtomicAsync(userId, amount, bookingId)).ReturnsAsync(true);

        // Act
        var result = await _escrowService.PayForBookingAsync(userId, bookingId);

        // Assert
        result.StatusCode.Should().Be(200);
        result.Message.Should().Contain("thành công");
        
        // Verify C5 Fix: We should call the atomic PayFromWalletAtomicAsync instead of manually updating booking here
        _escrowRepoMock.Verify(x => x.PayFromWalletAtomicAsync(userId, amount, bookingId), Times.Once);
        _bookingRepoMock.Verify(x => x.UpdateAsync(It.IsAny<Booking>()), Times.Never); // Should not happen in Service anymore
    }
}
