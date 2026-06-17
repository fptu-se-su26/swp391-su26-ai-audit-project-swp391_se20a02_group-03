namespace ProSport.Application.Services;

using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;
using System.Linq;
using System.Threading.Tasks;

public class EquipmentService : IEquipmentService
{
    private readonly IEquipmentRepository _repository;
    private readonly IEquipmentCategoryRepository _categoryRepository;

    public EquipmentService(IEquipmentRepository repository, IEquipmentCategoryRepository categoryRepository)
    {
        _repository = repository;
        _categoryRepository = categoryRepository;
    }

    public async Task<PagedResult<EquipmentDto>> GetPagedAsync(EquipmentQueryParameters parameters)
    {
        var (items, totalCount) = await _repository.GetPagedAsync(parameters);

        var dtoItems = items.Select(e => new EquipmentDto
        {
            EquipmentId = e.EquipmentId,
            EquipmentCategoryId = e.EquipmentCategoryId,
            CategoryName = e.EquipmentCategory?.Name ?? "Unknown",
            Name = e.Name,
            Description = e.Description,
            Price = e.Price,
            StockQuantity = e.StockQuantity,
            Status = e.Status,
            ImageUrl = e.ImageUrl
        }).ToList();

        return new PagedResult<EquipmentDto>
        {
            Items = dtoItems,
            TotalCount = totalCount,
            CurrentPage = parameters.PageNumber,
            TotalPages = (int)System.Math.Ceiling((double)totalCount / parameters.PageSize)
        };
    }

    public async Task<EquipmentDto?> GetByIdAsync(int id)
    {
        var e = await _repository.GetByIdAsync(id);
        if (e == null) return null;

        return new EquipmentDto
        {
            EquipmentId = e.EquipmentId,
            EquipmentCategoryId = e.EquipmentCategoryId,
            CategoryName = e.EquipmentCategory?.Name ?? "Unknown",
            Name = e.Name,
            Description = e.Description,
            Price = e.Price,
            StockQuantity = e.StockQuantity,
            Status = e.Status,
            ImageUrl = e.ImageUrl
        };
    }

    public async Task<EquipmentDto> CreateAsync(CreateEquipmentDto dto)
    {
        var equipment = new Equipment
        {
            EquipmentCategoryId = dto.EquipmentCategoryId,
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            ImageUrl = dto.ImageUrl,
            StockQuantity = 0, // Hardcoded to 0. Stock is managed via inventory API.
            Status = "Available"
        };

        var created = await _repository.CreateAsync(equipment);

        // Fetch to get CategoryName
        var category = await _categoryRepository.GetByIdAsync(created.EquipmentCategoryId);

        return new EquipmentDto
        {
            EquipmentId = created.EquipmentId,
            EquipmentCategoryId = created.EquipmentCategoryId,
            CategoryName = category?.Name ?? "Unknown",
            Name = created.Name,
            Description = created.Description,
            Price = created.Price,
            StockQuantity = created.StockQuantity,
            Status = created.Status,
            ImageUrl = created.ImageUrl
        };
    }

    public async Task<EquipmentDto?> UpdateAsync(int id, UpdateEquipmentDto dto)
    {
        var equipment = await _repository.GetByIdAsync(id);
        if (equipment == null) return null;

        equipment.EquipmentCategoryId = dto.EquipmentCategoryId;
        equipment.Name = dto.Name;
        equipment.Description = dto.Description;
        equipment.Price = dto.Price;
        equipment.Status = dto.Status;
        equipment.ImageUrl = dto.ImageUrl;
        // Do NOT map StockQuantity from dto to prevent unauthorized overrides

        await _repository.UpdateAsync(equipment);

        var category = await _categoryRepository.GetByIdAsync(equipment.EquipmentCategoryId);

        return new EquipmentDto
        {
            EquipmentId = equipment.EquipmentId,
            EquipmentCategoryId = equipment.EquipmentCategoryId,
            CategoryName = category?.Name ?? "Unknown",
            Name = equipment.Name,
            Description = equipment.Description,
            Price = equipment.Price,
            StockQuantity = equipment.StockQuantity,
            Status = equipment.Status,
            ImageUrl = equipment.ImageUrl
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var equipment = await _repository.GetByIdAsync(id);
        if (equipment == null) return false;

        await _repository.DeleteAsync(equipment);
        return true;
    }
}
