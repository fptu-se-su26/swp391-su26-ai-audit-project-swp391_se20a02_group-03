using ProSport.Domain.Entities;

namespace ProSport.Application.Interfaces;

// Truy xuất dữ liệu khiếu nại / báo cáo.
public interface IReportRepository
{
    Task<List<Report>> GetAllAsync(string? status = null);
    Task<List<Report>> GetByReporterAsync(int reporterId);
    Task<Report?> GetByIdAsync(int id);
    Task<bool> ExistsAsync(int reporterId, int reportedUserId, int matchId);
    Task<Report> AddAsync(Report report);
    Task<Report> UpdateAsync(Report report);
}
