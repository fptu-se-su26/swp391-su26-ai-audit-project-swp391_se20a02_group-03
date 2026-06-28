using Microsoft.EntityFrameworkCore;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Repositories;

// TK-035: Triển khai truy xuất đánh giá người chơi.
public class PlayerRatingRepository : IPlayerRatingRepository
{
    private readonly ProSportDbContext _context;

    public PlayerRatingRepository(ProSportDbContext context)
    {
        _context = context;
    }

    public async Task<PlayerRating> AddAsync(PlayerRating rating)
    {
        _context.PlayerRatings.Add(rating);
        await _context.SaveChangesAsync();
        return rating;
    }

    public async Task<bool> ExistsAsync(int raterId, int ratedUserId, int matchId)
    {
        return await _context.PlayerRatings
            .AnyAsync(r => r.RaterId == raterId && r.RatedUserId == ratedUserId && r.MatchId == matchId);
    }

    public async Task<(double Average, int Count)> GetTrustScoreAsync(int ratedUserId)
    {
        var scores = await _context.PlayerRatings
            .Where(r => r.RatedUserId == ratedUserId)
            .Select(r => r.Score)
            .ToListAsync();

        if (scores.Count == 0)
        {
            return (0d, 0);
        }

        return (scores.Average(), scores.Count);
    }
}
