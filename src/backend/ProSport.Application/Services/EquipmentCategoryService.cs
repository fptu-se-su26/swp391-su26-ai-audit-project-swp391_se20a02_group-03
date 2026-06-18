namespace ProSport.Application.Services;

using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class EquipmentCategoryService : IEquipmentCategoryService
{
    private readonly IEquipmentCategoryRepository _repository;

    public EquipmentCategoryService(IEquipmentCategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<EquipmentCategoryDto>> GetAllAsync()
    {
        var categories = await _repository.GetAllAsync();
        return categories.Select(c => new EquipmentCategoryDto
        {
            EquipmentCategoryId = c.EquipmentCategoryId,
            Name = c.Name,
            Description = c.Description
        });
    }

    public async Task<EquipmentCategoryDto?> GetByIdAsync(int id)
    {
        var c = await _repository.GetByIdAsync(id);
        if (c == null) return null;

        return new EquipmentCategoryDto
        {
            EquipmentCategoryId = c.EquipmentCategoryId,
            Name = c.Name,
            Description = c.Description
        };
    }

    public async Task<EquipmentCategoryDto> CreateAsync(CreateUpdateEquipmentCategoryDto dto)
    {
        var category = new EquipmentCategory
        {
            Name = dto.Name,
            Description = dto.Description
        };

        var created = await _repository.CreateAsync(category);

        return new EquipmentCategoryDto
        {
            EquipmentCategoryId = created.EquipmentCategoryId,
            Name = created.Name,
            Description = created.Description
        };
    }

    public async Task<EquipmentCategoryDto?> UpdateAsync(int id, CreateUpdateEquipmentCategoryDto dto)
    {
        var category = await _repository.GetByIdAsync(id);
        if (category == null) return null;

        category.Name = dto.Name;
        category.Description = dto.Description;

        await _repository.UpdateAsync(category);

        return new EquipmentCategoryDto
        {
            EquipmentCategoryId = category.EquipmentCategoryId,
            Name = category.Name,
            Description = category.Description
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var category = await _repository.GetByIdAsync(id);
        if (category == null) return false;

        await _repository.DeleteAsync(category);
        return true;
    }
}
