using ProSport.Application.DTOs;

namespace ProSport.Application.Interfaces;

public interface INotificationService
{
    Task SendToUserAsync(int userId, RealtimeNotificationDto notification);
    Task SendToUsersAsync(IEnumerable<int> userIds, RealtimeNotificationDto notification);
}
