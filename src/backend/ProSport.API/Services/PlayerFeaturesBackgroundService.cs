using ProSport.Application.Interfaces;

namespace ProSport.API.Services;

public class PlayerFeaturesBackgroundService : BackgroundService
{
    private readonly IServiceProvider _services;
    private readonly ILogger<PlayerFeaturesBackgroundService> _logger;

    public PlayerFeaturesBackgroundService(IServiceProvider services, ILogger<PlayerFeaturesBackgroundService> logger)
    {
        _services = services;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _services.CreateScope();
                var split = scope.ServiceProvider.GetRequiredService<ISplitPaymentService>();
                var recurring = scope.ServiceProvider.GetRequiredService<IRecurringBookingService>();
                var bookingRepo = scope.ServiceProvider.GetRequiredService<IBookingRepository>();

                var expiredSplits = await split.ExpireUnpaidSharesAsync();
                var generated = await recurring.GenerateUpcomingBookingsAsync();
                var expiredBookings = await bookingRepo.CancelExpiredBookingsAsync();

                if (expiredSplits + generated + expiredBookings > 0)
                    _logger.LogInformation("Background: splits={S} recurring={R} bookings={B}",
                        expiredSplits, generated, expiredBookings);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "PlayerFeaturesBackgroundService tick failed");
            }

            await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
        }
    }
}
