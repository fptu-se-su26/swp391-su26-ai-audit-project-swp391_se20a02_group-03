using Microsoft.EntityFrameworkCore;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;
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

    public async Task<IReadOnlyList<LeaderboardEntryDto>> GetLeaderboardAsync(int limit)
    {
        var grouped = await _context.PlayerRatings
            .GroupBy(r => r.RatedUserId)
            .Select(g => new
            {
                UserId = g.Key,
                AvgScore = g.Average(x => x.Score),
                TotalRatings = g.Count()
            })
            .Where(x => x.TotalRatings > 0)
            .OrderByDescending(x => x.AvgScore)
            .ThenByDescending(x => x.TotalRatings)
            .Take(limit)
            .ToListAsync();

        if (grouped.Count == 0)
        {
            return Array.Empty<LeaderboardEntryDto>();
        }

        var userIds = grouped.Select(x => x.UserId).ToList();
        var users = await _context.Users
            .Where(u => userIds.Contains(u.UserId))
            .Select(u => new { u.UserId, u.FullName, u.AvatarUrl })
            .ToListAsync();

        var matchCounts = await _context.MatchParticipants
            .Where(p => userIds.Contains(p.UserId) && p.Status == MatchParticipantStatus.Approved)
            .GroupBy(p => p.UserId)
            .Select(g => new { UserId = g.Key, Count = g.Count() })
            .ToListAsync();

        var userMap = users.ToDictionary(u => u.UserId);
        var matchMap = matchCounts.ToDictionary(m => m.UserId, m => m.Count);

        var result = new List<LeaderboardEntryDto>();
        for (var i = 0; i < grouped.Count; i++)
        {
            var row = grouped[i];
            userMap.TryGetValue(row.UserId, out var user);
            matchMap.TryGetValue(row.UserId, out var matchCount);
            var trust = Math.Round(row.AvgScore, 2);
            result.Add(new LeaderboardEntryDto
            {
                Rank = i + 1,
                UserId = row.UserId,
                FullName = user?.FullName ?? $"Người chơi #{row.UserId}",
                AvatarUrl = user?.AvatarUrl,
                TrustScore = trust,
                TotalRatings = row.TotalRatings,
                MatchCount = matchCount,
                Points = (int)Math.Round(trust * 100) + matchCount * 10
            });
        }

        return result;
    }
}
