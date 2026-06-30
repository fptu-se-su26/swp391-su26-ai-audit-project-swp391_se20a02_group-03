namespace ProSport.Application.Interfaces;

public interface IRentalSessionRepository
{
    Task<int?> GetComplexIdBySessionIdAsync(int rentalSessionId);
}
