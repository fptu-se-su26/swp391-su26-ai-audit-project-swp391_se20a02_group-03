namespace ProSport.Domain.Entities;

public class UserSkillRating : BaseEntity
{
    public int UserSkillRatingId { get; set; }
    public int UserId { get; set; }
    public string SportType { get; set; } = "Badminton";
    public int EloRating { get; set; } = 1200;
    public int GamesPlayed { get; set; }
    public int Wins { get; set; }
    public int Losses { get; set; }

    public User User { get; set; } = null!;
}
