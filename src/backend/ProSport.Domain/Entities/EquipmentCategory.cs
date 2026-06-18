namespace ProSport.Domain.Entities;

public class EquipmentCategory : BaseEntity
{
    public int EquipmentCategoryId { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }

    // Navigation property
    public ICollection<Equipment> Equipments { get; set; } = new List<Equipment>();
}
