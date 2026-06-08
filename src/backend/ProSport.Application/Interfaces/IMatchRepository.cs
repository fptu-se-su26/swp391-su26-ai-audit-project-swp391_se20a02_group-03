using ProSport.Domain.Entities;

namespace ProSport.Application.Interfaces;

public interface IMatchRepository
{
    Task<IEnumerable<Match>> GetAllAsync();
    Task<Match?> GetByIdAsync(int matchId);
    Task<IEnumerable<Match>> GetByHostIdAsync(int hostId);
    Task<Match> CreateAsync(Match match);
    Task UpdateAsync(Match match);
}
