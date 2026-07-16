using Microsoft.EntityFrameworkCore;
using ProSport.Application.DTOs;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;
using ProSport.Infrastructure.Repositories;

namespace ProSport.Tests;

public class CourtRepositoryTests
{
    [Theory]
    [InlineData("ACTIVE")]
    [InlineData("Active")]
    [InlineData("Available")]
    public async Task GetPagedCourtsAsync_NormalizesActiveApiStatus(string status)
    {
        var options = new DbContextOptionsBuilder<ProSportDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var db = new ProSportDbContext(options);
        var courtType = new CourtType { Name = "Badminton" };
        db.CourtTypes.Add(courtType);
        await db.SaveChangesAsync();
        db.Courts.AddRange(
            new Court { Name = "Bookable", CourtTypeId = courtType.CourtTypeId, Status = "Available" },
            new Court { Name = "Maintenance", CourtTypeId = courtType.CourtTypeId, Status = "Maintenance" });
        await db.SaveChangesAsync();

        var repository = new CourtRepository(db);
        var (items, totalCount) = await repository.GetPagedCourtsAsync(new CourtQueryParameters
        {
            Status = status,
            PageNumber = 1,
            PageSize = 10
        });

        Assert.Equal(1, totalCount);
        Assert.Equal("Bookable", Assert.Single(items).Name);
    }
}
