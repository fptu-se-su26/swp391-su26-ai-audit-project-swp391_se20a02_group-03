namespace ProSport.Application.Interfaces;

public interface IStaffOperationGuard
{
    Task EnsureCanCheckInAsync(int userId, int complexId);
    Task EnsureCanCreateWalkInAsync(int userId, int complexId);
}
