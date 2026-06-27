using ProSport.Domain.Entities;

namespace ProSport.Application.Interfaces;

// Truy xuất dữ liệu voucher giảm giá.
public interface IVoucherRepository
{
    Task<List<Voucher>> GetAllAsync(bool onlyActive = false);
    Task<Voucher?> GetByIdAsync(int id);
    Task<Voucher?> GetByCodeAsync(string code);
    Task<Voucher> AddAsync(Voucher voucher);
    Task<Voucher> UpdateAsync(Voucher voucher);
    Task<bool> DeleteAsync(Voucher voucher);
}
