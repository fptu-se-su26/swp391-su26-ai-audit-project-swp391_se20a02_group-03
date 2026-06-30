using Microsoft.AspNetCore.SignalR;
using ProSport.API.Hubs;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;

namespace ProSport.API.Services;

public class SignalRNotificationService : INotificationService
{
    private readonly IHubContext<NotificationHub> _hub;

    public SignalRNotificationService(IHubContext<NotificationHub> hub) => _hub = hub;

    public Task SendToUserAsync(int userId, RealtimeNotificationDto notification)
        => _hub.Clients.Group(NotificationHub.UserGroup(userId.ToString()))
            .SendAsync("ReceiveNotification", notification);

    public Task SendToUsersAsync(IEnumerable<int> userIds, RealtimeNotificationDto notification)
    {
        var tasks = userIds.Select(id => SendToUserAsync(id, notification));
        return Task.WhenAll(tasks);
    }
}
