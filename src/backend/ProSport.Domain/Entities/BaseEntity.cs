using System.ComponentModel.DataAnnotations.Schema;

namespace ProSport.Domain.Entities;

public abstract class BaseEntity
{
    [Column("CreatedAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("UpdatedAt")]
    public DateTime? UpdatedAt { get; set; }

    [Column("IsDeleted")]
    public bool IsDeleted { get; set; } = false;
}
