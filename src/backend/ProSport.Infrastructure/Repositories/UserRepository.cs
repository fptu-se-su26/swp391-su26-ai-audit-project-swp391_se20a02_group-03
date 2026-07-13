using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using ProSport.Application.Exceptions;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ProSportDbContext _context;

    public UserRepository(ProSportDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(int userId)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId && !u.IsDeleted);
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email && !u.IsDeleted);
    }

    public async Task<User?> GetByPhoneAsync(string phone)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.PhoneNumber == phone && !u.IsDeleted);
    }

    public async Task<User?> GetByGoogleIdAsync(string googleId)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.GoogleId == googleId && !u.IsDeleted);
    }

    public async Task<User> CreateAsync(User user)
    {
        _context.Users.Add(user);
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex) when (IsPhoneUniqueViolation(ex))
        {
            throw new DuplicatePhoneException();
        }
        return user;
    }

    public async Task UpdateAsync(User user)
    {
        user.UpdatedAt = DateTime.UtcNow;
        _context.Users.Update(user);
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex) when (IsPhoneUniqueViolation(ex))
        {
            throw new DuplicatePhoneException();
        }
    }

    // Race condition: hai request cùng lúc vượt qua bước kiểm tra trùng phone ở tầng service rồi
    // cùng ghi -> unique index IX_Users_PhoneNumber chặn ở DB. Nhận diện để service trả 400 thay vì 500.
    private static bool IsPhoneUniqueViolation(DbUpdateException ex) =>
        ex.InnerException is SqlException sql
        && (sql.Number == 2601 || sql.Number == 2627)
        && sql.Message.Contains("IX_Users_PhoneNumber", StringComparison.OrdinalIgnoreCase);

    // TK-010: Global query filter đã tự loại bỏ user IsDeleted, nên không cần lọc thủ công ở đây.
    public async Task<(List<User> Items, int TotalCount)> GetPagedAsync(string? search, string? role, int page, int pageSize)
    {
        var query = _context.Users.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(u =>
                u.FullName.Contains(term) ||
                u.Email.Contains(term) ||
                (u.PhoneNumber != null && u.PhoneNumber.Contains(term)));
        }

        if (!string.IsNullOrWhiteSpace(role))
        {
            query = query.Where(u => u.Role == role);
        }

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }
}
