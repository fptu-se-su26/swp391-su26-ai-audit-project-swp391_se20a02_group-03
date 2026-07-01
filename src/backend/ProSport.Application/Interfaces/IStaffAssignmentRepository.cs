using ProSport.Domain.Entities;

namespace ProSport.Application.Interfaces;

public interface IStaffAssignmentRepository
{
    Task<List<StaffAssignment>> GetByComplexIdAsync(int complexId);
    Task<StaffAssignment?> GetByIdAsync(int id);
    Task<StaffAssignment?> GetByStaffAndComplexAsync(int staffUserId, int complexId);
    Task<StaffAssignment> CreateAsync(StaffAssignment assignment);
    Task UpdateAsync(StaffAssignment assignment);
    Task DeleteAsync(StaffAssignment assignment);
    Task<int> CountByStaffUserIdAsync(int staffUserId);
}
