namespace ProSport.Domain.Entities;

public class Tournament : BaseEntity
{
    public int TournamentId { get; set; }
    public int ComplexId { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal EntryFee { get; set; }
    public int MaxTeams { get; set; } = 16;
    public int RegisteredTeams { get; set; }
    public string Format { get; set; } = "SingleElimination";
    public string Status { get; set; } = "Open";
    public string? SportType { get; set; }

    public Complex Complex { get; set; } = null!;
    public ICollection<TournamentRegistration> Registrations { get; set; } = new List<TournamentRegistration>();
}

public class TournamentRegistration : BaseEntity
{
    public int TournamentRegistrationId { get; set; }
    public int TournamentId { get; set; }
    public int CaptainUserId { get; set; }
    public string TeamName { get; set; } = string.Empty;
    public string Status { get; set; } = "Registered";

    /// <summary>True khi EntryFee đã trừ từ Escrow (hoặc giải miễn phí).</summary>
    public bool EntryFeePaid { get; set; }

    /// <summary>Giao dịch Escrow tương ứng khi EntryFee &gt; 0.</summary>
    public int? PaymentTransactionId { get; set; }

    public Tournament Tournament { get; set; } = null!;
    public User Captain { get; set; } = null!;
    public Transaction? PaymentTransaction { get; set; }
}
