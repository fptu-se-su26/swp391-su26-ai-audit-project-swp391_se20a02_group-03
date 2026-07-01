using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ProSport.Application.DTOs;
using ProSport.Application.DTOs.Owner;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Services;

public class OwnerInventoryService : IOwnerInventoryService
{
    private readonly ProSportDbContext _db;
    private readonly IAuditLogService _auditLog;

    public OwnerInventoryService(ProSportDbContext db, IAuditLogService auditLog)
    {
        _db = db;
        _auditLog = auditLog;
    }

    public async Task<ApiResponseDto<PagedResult<ProductStockDto>>> GetProductsAsync(OwnerInventoryQueryDto query)
    {
        var q = _db.ProductStocks.AsNoTracking()
            .Where(p => p.ComplexId == query.ComplexId && !p.IsDeleted);

        if (!string.IsNullOrWhiteSpace(query.Keyword))
        {
            var kw = query.Keyword.Trim();
            q = q.Where(p => p.ProductName.Contains(kw) || p.Sku.Contains(kw));
        }
        if (!string.IsNullOrWhiteSpace(query.Category))
            q = q.Where(p => p.Category == query.Category);
        if (!string.IsNullOrWhiteSpace(query.Status))
            q = q.Where(p => p.Status == query.Status);

        var total = await q.CountAsync();
        var items = await q.OrderBy(p => p.ProductName)
            .Skip((query.Page - 1) * query.Size).Take(query.Size)
            .Select(p => MapProduct(p)).ToListAsync();

        return OkPaged(items, total, query.Page, query.Size);
    }

    public async Task<ApiResponseDto<ProductStockDto>> CreateProductAsync(int actorUserId, CreateProductStockDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Sku) || string.IsNullOrWhiteSpace(dto.ProductName))
            return new ApiResponseDto<ProductStockDto>(400, "SKU và tên sản phẩm là bắt buộc.");

        if (await _db.ProductStocks.AnyAsync(p => p.ComplexId == dto.ComplexId && p.Sku == dto.Sku.Trim() && !p.IsDeleted))
            return new ApiResponseDto<ProductStockDto>(409, "SKU đã tồn tại trong tổ hợp.");

        var product = new ProductStock
        {
            ComplexId = dto.ComplexId,
            Sku = dto.Sku.Trim().ToUpperInvariant(),
            ProductName = dto.ProductName.Trim(),
            Category = dto.Category.Trim(),
            Quantity = dto.Quantity,
            LowStockThreshold = dto.LowStockThreshold,
            SellingPrice = dto.SellingPrice,
            Status = dto.Status,
            CreatedAt = DateTime.UtcNow,
            IsDeleted = false
        };
        _db.ProductStocks.Add(product);
        await _db.SaveChangesAsync();
        await _auditLog.LogAsync(actorUserId, "CREATE", "ProductStock", product.ProductStockId.ToString(), dto.ComplexId,
            null, JsonSerializer.Serialize(new { product.Sku, product.Quantity }));
        return new ApiResponseDto<ProductStockDto>(201, "Tạo sản phẩm thành công.", MapProduct(product));
    }

    public async Task<ApiResponseDto<ProductStockDto>> UpdateProductAsync(int actorUserId, int id, int complexId, UpdateProductStockDto dto)
    {
        var product = await _db.ProductStocks.FirstOrDefaultAsync(p => p.ProductStockId == id && p.ComplexId == complexId && !p.IsDeleted);
        if (product == null) return new ApiResponseDto<ProductStockDto>(404, "Không tìm thấy sản phẩm.");

        var old = JsonSerializer.Serialize(new { product.Quantity, product.SellingPrice, product.Status });
        if (dto.ProductName != null) product.ProductName = dto.ProductName.Trim();
        if (dto.Category != null) product.Category = dto.Category.Trim();
        if (dto.Quantity.HasValue) product.Quantity = dto.Quantity.Value;
        if (dto.LowStockThreshold.HasValue) product.LowStockThreshold = dto.LowStockThreshold.Value;
        if (dto.SellingPrice.HasValue) product.SellingPrice = dto.SellingPrice.Value;
        if (dto.Status != null) product.Status = dto.Status;
        product.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        await _auditLog.LogAsync(actorUserId, "UPDATE", "ProductStock", id.ToString(), complexId, old,
            JsonSerializer.Serialize(new { product.Quantity, product.SellingPrice, product.Status }));
        return new ApiResponseDto<ProductStockDto>(200, "Cập nhật sản phẩm thành công.", MapProduct(product));
    }

    public async Task<ApiResponseDto<PagedResult<RentalAssetDto>>> GetRentalAssetsAsync(OwnerInventoryQueryDto query)
    {
        var q = _db.RentalAssets.AsNoTracking()
            .Include(a => a.ProductStock)
            .Where(a => a.ComplexId == query.ComplexId && !a.IsDeleted);

        if (!string.IsNullOrWhiteSpace(query.Keyword))
        {
            var kw = query.Keyword.Trim();
            q = q.Where(a => a.AssetCode.Contains(kw) || a.ProductStock.ProductName.Contains(kw));
        }
        if (!string.IsNullOrWhiteSpace(query.Status))
            q = q.Where(a => a.Status == query.Status);

        var total = await q.CountAsync();
        var items = await q.OrderBy(a => a.AssetCode)
            .Skip((query.Page - 1) * query.Size).Take(query.Size)
            .Select(a => MapAsset(a)).ToListAsync();

        return OkPaged(items, total, query.Page, query.Size);
    }

    public async Task<ApiResponseDto<RentalAssetDto>> CreateRentalAssetAsync(int actorUserId, CreateRentalAssetDto dto)
    {
        var product = await _db.ProductStocks.FirstOrDefaultAsync(p => p.ProductStockId == dto.ProductStockId && p.ComplexId == dto.ComplexId && !p.IsDeleted);
        if (product == null) return new ApiResponseDto<RentalAssetDto>(404, "Không tìm thấy sản phẩm.");

        var code = string.IsNullOrWhiteSpace(dto.AssetCode) ? $"{product.Sku}-{Guid.NewGuid().ToString()[..6].ToUpper()}" : dto.AssetCode.Trim().ToUpperInvariant();
        if (await _db.RentalAssets.AnyAsync(a => a.ComplexId == dto.ComplexId && a.AssetCode == code && !a.IsDeleted))
            return new ApiResponseDto<RentalAssetDto>(409, "Mã asset đã tồn tại.");

        var asset = new RentalAsset
        {
            ComplexId = dto.ComplexId,
            ProductStockId = dto.ProductStockId,
            AssetCode = code,
            Condition = dto.Condition,
            Status = RentalAssetStatuses.Available,
            MaintenanceNote = dto.MaintenanceNote,
            CreatedAt = DateTime.UtcNow,
            IsDeleted = false
        };
        _db.RentalAssets.Add(asset);
        await _db.SaveChangesAsync();
        asset.ProductStock = product;
        await _auditLog.LogAsync(actorUserId, "CREATE", "RentalAsset", asset.RentalAssetId.ToString(), dto.ComplexId, null, code);
        return new ApiResponseDto<RentalAssetDto>(201, "Tạo rental asset thành công.", MapAsset(asset));
    }

    public async Task<ApiResponseDto<RentalAssetDto>> UpdateRentalAssetAsync(int actorUserId, int id, int complexId, UpdateRentalAssetDto dto)
    {
        var asset = await _db.RentalAssets.Include(a => a.ProductStock)
            .FirstOrDefaultAsync(a => a.RentalAssetId == id && a.ComplexId == complexId && !a.IsDeleted);
        if (asset == null) return new ApiResponseDto<RentalAssetDto>(404, "Không tìm thấy asset.");

        if (dto.Condition != null) asset.Condition = dto.Condition;
        if (dto.MaintenanceNote != null) asset.MaintenanceNote = dto.MaintenanceNote;
        asset.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        await _auditLog.LogAsync(actorUserId, "UPDATE", "RentalAsset", id.ToString(), complexId, null, asset.Condition);
        return new ApiResponseDto<RentalAssetDto>(200, "Cập nhật asset thành công.", MapAsset(asset));
    }

    public async Task<ApiResponseDto<RentalAssetDto>> UpdateRentalAssetStatusAsync(int actorUserId, int id, int complexId, UpdateRentalAssetStatusDto dto)
    {
        var asset = await _db.RentalAssets.Include(a => a.ProductStock)
            .FirstOrDefaultAsync(a => a.RentalAssetId == id && a.ComplexId == complexId && !a.IsDeleted);
        if (asset == null) return new ApiResponseDto<RentalAssetDto>(404, "Không tìm thấy asset.");

        var newStatus = dto.Status.Trim().ToUpperInvariant();
        if (!RentalAssetStatuses.CanTransitionTo(asset.Status, newStatus) && asset.Status != newStatus)
            return new ApiResponseDto<RentalAssetDto>(400, $"Không thể chuyển từ {asset.Status} sang {newStatus}.");

        var old = asset.Status;
        asset.Status = newStatus;
        if (dto.MaintenanceNote != null) asset.MaintenanceNote = dto.MaintenanceNote;
        if (newStatus == RentalAssetStatuses.Maintenance || newStatus == RentalAssetStatuses.Damaged)
            asset.LastConditionCheck = DateTime.UtcNow;
        asset.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        await _auditLog.LogAsync(actorUserId, "STATUS_CHANGE", "RentalAsset", id.ToString(), complexId, old, newStatus);
        return new ApiResponseDto<RentalAssetDto>(200, "Cập nhật trạng thái asset thành công.", MapAsset(asset));
    }

    private static ProductStockDto MapProduct(ProductStock p) => new()
    {
        ProductStockId = p.ProductStockId,
        ComplexId = p.ComplexId,
        Sku = p.Sku,
        ProductName = p.ProductName,
        Category = p.Category,
        Quantity = p.Quantity,
        LowStockThreshold = p.LowStockThreshold,
        SellingPrice = p.SellingPrice,
        Status = p.Status,
        IsLowStock = p.Quantity <= p.LowStockThreshold
    };

    private static RentalAssetDto MapAsset(RentalAsset a) => new()
    {
        RentalAssetId = a.RentalAssetId,
        ComplexId = a.ComplexId,
        ProductStockId = a.ProductStockId,
        ProductName = a.ProductStock?.ProductName ?? "",
        AssetCode = a.AssetCode,
        Condition = a.Condition,
        Status = a.Status,
        RentCount = a.RentCount,
        LastConditionCheck = a.LastConditionCheck,
        MaintenanceNote = a.MaintenanceNote
    };

    private static ApiResponseDto<PagedResult<T>> OkPaged<T>(List<T> items, int total, int page, int size) =>
        new(200, "Success", new PagedResult<T>
        {
            Items = items,
            TotalCount = total,
            CurrentPage = page,
            TotalPages = (int)Math.Ceiling(total / (double)Math.Max(size, 1))
        });
}
